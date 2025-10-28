import { useState } from 'react';
import { motion } from 'motion/react';
import { Upload, FileText, CheckCircle2 } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Input } from './ui/input';

interface ExtractedData {
  totalIncome: number;
  taxWithheld: number;
  mortgageInterest: number;
  charitableDonations: number;
  confidence: number;
}

interface DocumentUploadProps {
  onComplete: (data: ExtractedData) => void;
}

export function DocumentUpload({ onComplete }: DocumentUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [extractedData, setExtractedData] = useState<ExtractedData | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    simulateUpload();
  };

  const simulateUpload = () => {
    setIsProcessing(true);
    
    // Simulate API call to /upload-document
    setTimeout(() => {
      const mockData: ExtractedData = {
        totalIncome: 85000,
        taxWithheld: 12750,
        mortgageInterest: 8500,
        charitableDonations: 2500,
        confidence: 98.5
      };
      setExtractedData(mockData);
      setIsProcessing(false);
    }, 2000);
  };

  const handleEditChange = (field: keyof Omit<ExtractedData, 'confidence'>, value: string) => {
    if (extractedData) {
      setExtractedData({
        ...extractedData,
        [field]: parseFloat(value) || 0
      });
    }
  };

  const handleContinue = () => {
    if (extractedData) {
      onComplete(extractedData);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-full bg-[#4A00B5] text-white flex items-center justify-center">1</div>
            <h2>Document Intake</h2>
          </div>
          <p className="text-gray-600 ml-11">Upload your tax documents for AI-powered extraction</p>
        </div>

        {!extractedData ? (
          <Card className="border-2 border-dashed border-gray-300 bg-white shadow-sm">
            <div
              className={`p-12 text-center transition-all duration-300 ${
                isDragging ? 'bg-[#4A00B5] bg-opacity-5 border-[#4A00B5]' : ''
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              {isProcessing ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center"
                >
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="mb-4"
                  >
                    <FileText className="w-16 h-16 text-[#4A00B5]" />
                  </motion.div>
                  <p className="text-gray-600">Processing your document with AI...</p>
                </motion.div>
              ) : (
                <>
                  <div className="mb-6 flex justify-center">
                    <div className="relative">
                      <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-[#4A00B5] to-[#6B20D5] flex items-center justify-center shadow-lg">
                        <Upload className="w-12 h-12 text-white" />
                      </div>
                      <motion.div
                        className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-[#00FFC0] flex items-center justify-center"
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <span className="text-xs">✨</span>
                      </motion.div>
                    </div>
                  </div>
                  <h3 className="mb-2">Drop your W-2 or tax documents here</h3>
                  <p className="text-gray-600 mb-6">or click to browse files</p>
                  <Button
                    onClick={simulateUpload}
                    className="bg-[#4A00B5] hover:bg-[#3A0095] text-white"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Select File
                  </Button>
                  <p className="mt-4 text-sm text-gray-500">Supported: PDF, JPG, PNG (Max 10MB)</p>
                </>
              )}
            </div>
          </Card>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="bg-white shadow-lg border-[#00FFC0] border-2 overflow-hidden">
              <div className="bg-gradient-to-r from-[#00FFC0] to-[#00D9A6] p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-6 h-6 text-white" />
                  <div>
                    <p className="text-white">Extracted by AI</p>
                    <p className="text-white text-sm opacity-90">Confidence: {extractedData.confidence}%</p>
                  </div>
                </div>
                <Button
                  onClick={() => setIsEditing(!isEditing)}
                  variant="outline"
                  className="bg-white text-[#00D9A6] border-white hover:bg-gray-50"
                  size="sm"
                >
                  {isEditing ? 'Done Editing' : 'Edit Values'}
                </Button>
              </div>

              <div className="p-6">
                <div className="space-y-4">
                  {/* Total Income */}
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <label className="text-gray-700">Total Income</label>
                    {isEditing ? (
                      <Input
                        type="number"
                        value={extractedData.totalIncome}
                        onChange={(e) => handleEditChange('totalIncome', e.target.value)}
                        className="w-40 text-right"
                      />
                    ) : (
                      <span className="text-gray-900">
                        ${extractedData.totalIncome.toLocaleString()}
                      </span>
                    )}
                  </div>

                  {/* Tax Withheld */}
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <label className="text-gray-700">Tax Withheld</label>
                    {isEditing ? (
                      <Input
                        type="number"
                        value={extractedData.taxWithheld}
                        onChange={(e) => handleEditChange('taxWithheld', e.target.value)}
                        className="w-40 text-right"
                      />
                    ) : (
                      <span className="text-gray-900">
                        ${extractedData.taxWithheld.toLocaleString()}
                      </span>
                    )}
                  </div>

                  {/* Mortgage Interest */}
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <label className="text-gray-700">Mortgage Interest</label>
                    {isEditing ? (
                      <Input
                        type="number"
                        value={extractedData.mortgageInterest}
                        onChange={(e) => handleEditChange('mortgageInterest', e.target.value)}
                        className="w-40 text-right"
                      />
                    ) : (
                      <span className="text-gray-900">
                        ${extractedData.mortgageInterest.toLocaleString()}
                      </span>
                    )}
                  </div>

                  {/* Charitable Donations */}
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <label className="text-gray-700">Charitable Donations</label>
                    {isEditing ? (
                      <Input
                        type="number"
                        value={extractedData.charitableDonations}
                        onChange={(e) => handleEditChange('charitableDonations', e.target.value)}
                        className="w-40 text-right"
                      />
                    ) : (
                      <span className="text-gray-900">
                        ${extractedData.charitableDonations.toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>

                <Button
                  onClick={handleContinue}
                  className="w-full mt-6 bg-[#4A00B5] hover:bg-[#3A0095] text-white py-6"
                >
                  Continue to Deduction Analysis
                </Button>
              </div>
            </Card>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
