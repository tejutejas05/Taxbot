# app.py - Main Flask Application
from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from werkzeug.utils import secure_filename
import os
from datetime import datetime
import pytesseract
from PIL import Image
import io
import re
import numpy as np
from sklearn.ensemble import RandomForestClassifier
import joblib
import logging

app = Flask(__name__)
CORS(app)

# Configuration
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///taxbot.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['UPLOAD_FOLDER'] = 'uploads/'
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max file size

db = SQLAlchemy(app)

# Database Models
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    name = db.Column(db.String(100), nullable=False)
    documents = db.relationship('Document', backref='user', lazy=True)
    deductions = db.relationship('Deduction', backref='user', lazy=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class Document(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    filename = db.Column(db.String(255), nullable=False)
    document_type = db.Column(db.String(50), nullable=False)  # W2, 1099, Receipt, etc.
    extracted_data = db.Column(db.Text)  # JSON string of extracted data
    upload_date = db.Column(db.DateTime, default=datetime.utcnow)
    processed = db.Column(db.Boolean, default=False)

class Deduction(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    category = db.Column(db.String(100), nullable=False)
    amount = db.Column(db.Float, nullable=False)
    description = db.Column(db.Text)
    year = db.Column(db.Integer, nullable=False)
    confidence_score = db.Column(db.Float)  # ML model confidence
    supporting_docs = db.relationship('Document', secondary='deduction_documents')

deduction_documents = db.Table('deduction_documents',
    db.Column('deduction_id', db.Integer, db.ForeignKey('deduction.id')),
    db.Column('document_id', db.Integer, db.ForeignKey('document.id'))
)

# ML Model for Document Processing
class DocumentProcessor:
    def __init__(self):
        self.supported_formats = ['image/png', 'image/jpeg', 'image/jpg', 'application/pdf']
        
    def extract_text_from_image(self, image_file):
        """Extract text from image using OCR"""
        try:
            # Convert to PIL Image if needed
            if hasattr(image_file, 'read'):
                image = Image.open(io.BytesIO(image_file.read()))
            else:
                image = Image.open(image_file)
            
            # Preprocess image for better OCR
            gray_image = image.convert('L')
            
            # Perform OCR
            text = pytesseract.image_to_string(gray_image)
            return text.strip()
        except Exception as e:
            logging.error(f"OCR processing error: {str(e)}")
            return None
    
    def parse_w2_form(self, extracted_text):
        """Parse W2 form data from extracted text"""
        w2_data = {}
        try:
            # Employer EIN
            ein_match = re.search(r'\d{2}-\d{7}', extracted_text)
            if ein_match:
                w2_data['employer_ein'] = ein_match.group()
            
            # Wages
            wages_match = re.search(r'Wages.*?(\d{1,3}(?:,\d{3})*\.\d{2})', extracted_text)
            if wages_match:
                w2_data['wages'] = float(wages_match.group(1).replace(',', ''))
            
            # Federal tax withheld
            fed_tax_match = re.search(r'Federal.*?(\d{1,3}(?:,\d{3})*\.\d{2})', extracted_text)
            if fed_tax_match:
                w2_data['federal_tax_withheld'] = float(fed_tax_match.group(1).replace(',', ''))
                
            return w2_data
        except Exception as e:
            logging.error(f"W2 parsing error: {str(e)}")
            return {}
    
    def parse_receipt(self, extracted_text):
        """Parse receipt data for expense tracking"""
        receipt_data = {}
        try:
            # Look for date patterns
            date_match = re.search(r'(\d{1,2}/\d{1,2}/\d{4})', extracted_text)
            if date_match:
                receipt_data['date'] = date_match.group(1)
            
            # Look for total amount
            total_match = re.search(r'TOTAL.*?(\d+\.\d{2})', extracted_text.upper())
            if not total_match:
                total_match = re.search(r'(\d+\.\d{2})\s*$', extracted_text)
            
            if total_match:
                receipt_data['amount'] = float(total_match.group(1))
            
            # Categorize based on keywords
            categories = {
                'office_supplies': ['staples', 'office', 'supplies', 'paper', 'ink'],
                'meals': ['restaurant', 'cafe', 'coffee', 'lunch', 'dinner'],
                'travel': ['hotel', 'flight', 'airline', 'lodging'],
                'equipment': ['computer', 'software', 'hardware', 'printer']
            }
            
            for category, keywords in categories.items():
                if any(keyword in extracted_text.lower() for keyword in keywords):
                    receipt_data['category'] = category
                    break
            
            return receipt_data
        except Exception as e:
            logging.error(f"Receipt parsing error: {str(e)}")
            return {}

# ML Model for Deduction Recommendation
class DeductionPredictor:
    def __init__(self):
        self.model = None
        self.features = [
            'income_level', 'filing_status', 'home_owner', 'self_employed',
            'has_medical_expenses', 'has_education_expenses', 'has_charitable_contributions'
        ]
        self.deduction_categories = [
            'charitable_contributions', 'medical_expenses', 'home_office',
            'education_expenses', 'retirement_contributions', 'state_taxes'
        ]
    
    def train_model(self, training_data):
        """Train the deduction recommendation model"""
        X = np.array([list(item.values()) for item in training_data['features']])
        y = np.array(training_data['labels'])
        
        self.model = RandomForestClassifier(n_estimators=100, random_state=42)
        self.model.fit(X, y)
        
        # Save the trained model
        joblib.dump(self.model, 'deduction_model.pkl')
    
    def predict_deductions(self, user_profile):
        """Predict eligible deductions for a user"""
        if self.model is None:
            try:
                self.model = joblib.load('deduction_model.pkl')
            except:
                return self._get_default_deductions(user_profile)
        
        # Prepare features for prediction
        features = self._extract_features(user_profile)
        probabilities = self.model.predict_proba([features])[0]
        
        recommendations = []
        for i, category in enumerate(self.deduction_categories):
            if probabilities[i] > 0.5:  # Confidence threshold
                recommendations.append({
                    'category': category,
                    'confidence': float(probabilities[i]),
                    'estimated_amount': self._estimate_deduction_amount(category, user_profile)
                })
        
        return recommendations
    
    def _extract_features(self, user_profile):
        """Extract features from user profile for ML model"""
        return [
            user_profile.get('income_level', 0),
            1 if user_profile.get('filing_status') == 'married' else 0,
            1 if user_profile.get('home_owner', False) else 0,
            1 if user_profile.get('self_employed', False) else 0,
            1 if user_profile.get('has_medical_expenses', False) else 0,
            1 if user_profile.get('has_education_expenses', False) else 0,
            1 if user_profile.get('has_charitable_contributions', False) else 0
        ]
    
    def _estimate_deduction_amount(self, category, user_profile):
        """Estimate potential deduction amount based on category"""
        base_amounts = {
            'charitable_contributions': min(user_profile.get('income_level', 0) * 0.03, 10000),
            'medical_expenses': min(user_profile.get('income_level', 0) * 0.075, 5000),
            'home_office': 1500,
            'education_expenses': 4000,
            'retirement_contributions': min(user_profile.get('income_level', 0) * 0.1, 6000),
            'state_taxes': min(user_profile.get('income_level', 0) * 0.05, 10000)
        }
        return base_amounts.get(category, 0)
    
    def _get_default_deductions(self, user_profile):
        """Fallback deduction recommendations when ML model is not available"""
        return [
            {'category': 'charitable_contributions', 'confidence': 0.8, 'estimated_amount': 1000},
            {'category': 'retirement_contributions', 'confidence': 0.9, 'estimated_amount': 6000}
        ]

# Initialize processors
doc_processor = DocumentProcessor()
deduction_predictor = DeductionPredictor()

# API Routes
@app.route('/api/upload-document', methods=['POST'])
def upload_document():
    """Handle document upload and processing"""
    try:
        user_id = request.form.get('user_id')
        document_type = request.form.get('document_type')
        
        if 'file' not in request.files:
            return jsonify({'error': 'No file provided'}), 400
        
        file = request.files['file']
        if file.filename == '':
            return jsonify({'error': 'No file selected'}), 400
        
        if file and file.content_type in doc_processor.supported_formats:
            filename = secure_filename(file.filename)
            filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            file.save(filepath)
            
            # Extract text from document
            extracted_text = doc_processor.extract_text_from_image(filepath)
            
            # Parse document based on type
            parsed_data = {}
            if document_type == 'w2':
                parsed_data = doc_processor.parse_w2_form(extracted_text)
            elif document_type == 'receipt':
                parsed_data = doc_processor.parse_receipt(extracted_text)
            
            # Save to database
            new_document = Document(
                user_id=user_id,
                filename=filename,
                document_type=document_type,
                extracted_data=str(parsed_data),
                processed=True
            )
            db.session.add(new_document)
            db.session.commit()
            
            return jsonify({
                'success': True,
                'document_id': new_document.id,
                'extracted_data': parsed_data,
                'raw_text': extracted_text[:500] + '...' if len(extracted_text) > 500 else extracted_text
            })
            
    except Exception as e:
        logging.error(f"Upload error: {str(e)}")
        return jsonify({'error': 'Document processing failed'}), 500

@app.route('/api/analyze-deductions', methods=['POST'])
def analyze_deductions():
    """Analyze user profile and recommend deductions"""
    try:
        user_data = request.json
        user_profile = user_data.get('profile', {})
        
        # Get deduction recommendations
        recommendations = deduction_predictor.predict_deductions(user_profile)
        
        # Save recommendations to database
        user = User.query.get(user_profile.get('user_id'))
        if user:
            for rec in recommendations:
                deduction = Deduction(
                    user_id=user.id,
                    category=rec['category'],
                    amount=rec['estimated_amount'],
                    description=f"Recommended {rec['category']} deduction",
                    year=datetime.now().year,
                    confidence_score=rec['confidence']
                )
                db.session.add(deduction)
            db.session.commit()
        
        return jsonify({
            'success': True,
            'recommendations': recommendations,
            'total_estimated_savings': sum(rec['estimated_amount'] for rec in recommendations)
        })
        
    except Exception as e:
        logging.error(f"Deduction analysis error: {str(e)}")
        return jsonify({'error': 'Deduction analysis failed'}), 500

@app.route('/api/user/documents/<int:user_id>')
def get_user_documents(user_id):
    """Get all documents for a user"""
    documents = Document.query.filter_by(user_id=user_id).all()
    return jsonify({
        'documents': [{
            'id': doc.id,
            'filename': doc.filename,
            'type': doc.document_type,
            'processed': doc.processed,
            'upload_date': doc.upload_date.isoformat()
        } for doc in documents]
    })

@app.route('/api/user/deductions/<int:user_id>')
def get_user_deductions(user_id):
    """Get all deductions for a user"""
    deductions = Deduction.query.filter_by(user_id=user_id).all()
    return jsonify({
        'deductions': [{
            'id': ded.id,
            'category': ded.category,
            'amount': ded.amount,
            'description': ded.description,
            'confidence': ded.confidence_score
        } for ded in deductions]
    })

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
        # Create upload directory if it doesn't exist
        os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
    app.run(debug=True, port=5000)