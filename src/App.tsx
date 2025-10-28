import { useState } from 'react';
import { LoginScreen } from './components/LoginScreen';
import { DocumentUpload } from './components/DocumentUpload';
import { DeductionChat } from './components/DeductionChat';
import { TaxSummary } from './components/TaxSummary';
import { MockForm1040 } from './components/MockForm1040';
import { motion, AnimatePresence } from 'motion/react';

type Step = 'login' | 'upload' | 'analysis' | 'form';

interface ExtractedData {
  totalIncome: number;
  taxWithheld: number;
  mortgageInterest: number;
  charitableDonations: number;
  confidence: number;
}

export default function App() {
  const [currentStep, setCurrentStep] = useState<Step>('login');
  const [extractedData, setExtractedData] = useState<ExtractedData | null>(null);
  const [showForm, setShowForm] = useState(false);

  const handleLogin = () => {
    setCurrentStep('upload');
  };

  const handleDocumentComplete = (data: ExtractedData) => {
    setExtractedData(data);
    setCurrentStep('analysis');
  };

  const handleViewForm = () => {
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
  };

  const totalDeductions = extractedData
    ? extractedData.mortgageInterest + extractedData.charitableDonations + 14600 // Standard deduction
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5F7FA] via-[#F5F7FA] to-[#E8EBF0]">
      <AnimatePresence mode="wait">
        {currentStep === 'login' && (
          <motion.div
            key="login"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <LoginScreen onLogin={handleLogin} />
          </motion.div>
        )}

        {currentStep === 'upload' && (
          <motion.div
            key="upload"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="min-h-screen py-12"
          >
            <div className="max-w-7xl mx-auto">
              {/* Header */}
              <div className="mb-8 px-6">
                <div className="flex items-center gap-3">
                  <svg width="40" height="40" viewBox="0 0 120 120">
                    <defs>
                      <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#4A00B5" />
                        <stop offset="100%" stopColor="#00FFC0" />
                      </linearGradient>
                    </defs>
                    <circle cx="60" cy="60" r="35" fill="url(#logoGradient)" />
                    <path
                      d="M45 60 L55 70 L75 50"
                      stroke="white"
                      strokeWidth="4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      fill="none"
                    />
                  </svg>
                  <h1>TAX-BOT</h1>
                </div>
                <p className="text-gray-600 mt-2">You Earn. I File. The Government Smiles :)</p>
              </div>

              <DocumentUpload onComplete={handleDocumentComplete} />
            </div>
          </motion.div>
        )}

        {currentStep === 'analysis' && extractedData && (
          <motion.div
            key="analysis"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="min-h-screen py-12"
          >
            <div className="max-w-7xl mx-auto px-6">
              {/* Header */}
              <div className="mb-8">
                <div className="flex items-center gap-3">
                  <svg width="40" height="40" viewBox="0 0 120 120">
                    <defs>
                      <linearGradient id="logoGradient2" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#4A00B5" />
                        <stop offset="100%" stopColor="#00FFC0" />
                      </linearGradient>
                    </defs>
                    <circle cx="60" cy="60" r="35" fill="url(#logoGradient2)" />
                    <path
                      d="M45 60 L55 70 L75 50"
                      stroke="white"
                      strokeWidth="4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      fill="none"
                    />
                  </svg>
                  <h1>TAX-BOT</h1>
                </div>
                <p className="text-gray-600 mt-2">You Earn. I File. The Government Smiles :)</p>
              </div>

              {/* Progress Indicator */}
              <div className="mb-8 flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#00FFC0] text-gray-900 flex items-center justify-center">✓</div>
                  <span className="text-sm text-gray-600">Document Upload</span>
                </div>
                <div className="flex-1 h-0.5 bg-[#00FFC0]" />
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#4A00B5] text-white flex items-center justify-center">2</div>
                  <span className="text-sm">Analysis & Review</span>
                </div>
                <div className="flex-1 h-0.5 bg-gray-300" />
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gray-300 text-gray-600 flex items-center justify-center">3</div>
                  <span className="text-sm text-gray-600">Finalize</span>
                </div>
              </div>

              <div className="flex gap-6 relative">
                {/* Main Content */}
                <div className="flex-1 pr-[420px]">
                  <TaxSummary
                    totalIncome={extractedData.totalIncome}
                    deductions={totalDeductions}
                    taxWithheld={extractedData.taxWithheld}
                    onViewForm={handleViewForm}
                  />

                  {/* Tips Section */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-white rounded-xl p-6 shadow-lg border-2 border-gray-200"
                  >
                    <h3 className="mb-4">💡 AI-Powered Insights</h3>
                    <div className="space-y-3">
                      <div className="p-4 bg-[#00FFC0] bg-opacity-10 rounded-lg border-l-4 border-[#00FFC0]">
                        <p className="text-sm">
                          <strong>Deductions Identified:</strong> Mortgage interest and charitable donations totaling ${(extractedData.mortgageInterest + extractedData.charitableDonations).toLocaleString()}
                        </p>
                      </div>
                      <div className="p-4 bg-[#4A00B5] bg-opacity-5 rounded-lg border-l-4 border-[#4A00B5]">
                        <p className="text-sm">
                          <strong>Standard Deduction Applied:</strong> $14,600 (Single filer, 2024)
                        </p>
                      </div>
                      <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                        <p className="text-sm">
                          💬 <strong>Ask the AI Advisor:</strong> Use the chat to discover additional deductions you may qualify for!
                        </p>
                      </div>
                    </div>
                  </motion.div>
                </div>

                {/* Chat Sidebar */}
                <DeductionChat isVisible={true} />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Form Modal */}
      <AnimatePresence>
        {showForm && extractedData && (
          <MockForm1040
            data={{
              totalIncome: extractedData.totalIncome,
              deductions: totalDeductions,
              taxWithheld: extractedData.taxWithheld
            }}
            onClose={handleCloseForm}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
