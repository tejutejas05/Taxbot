import { motion } from 'motion/react';
import { X, Download, FileText } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';

interface MockForm1040Props {
  data: {
    totalIncome: number;
    deductions: number;
    taxWithheld: number;
  };
  onClose: () => void;
}

export function MockForm1040({ data, onClose }: MockForm1040Props) {
  const taxableIncome = data.totalIncome - data.deductions;
  const totalTaxDue = taxableIncome * 0.22;
  const refundAmount = data.taxWithheld - totalTaxDue;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", duration: 0.5 }}
        className="w-full max-w-4xl max-h-[90vh] overflow-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <Card className="bg-white shadow-2xl">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#4A00B5] to-[#6B20D5] p-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FileText className="w-6 h-6 text-white" />
              <div>
                <h2 className="text-white">Form 1040 - U.S. Individual Income Tax Return</h2>
                <p className="text-white text-sm opacity-90">Tax Year 2024 (Mock Preview)</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="bg-white text-[#4A00B5] hover:bg-gray-100"
              >
                <Download className="w-4 h-4 mr-2" />
                Download PDF
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={onClose}
                className="bg-white text-[#4A00B5] hover:bg-gray-100"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Form Content */}
          <div className="p-8 bg-white">
            <div className="border-4 border-gray-900 p-6">
              {/* Form Header */}
              <div className="text-center mb-8 pb-6 border-b-2 border-gray-300">
                <h1 className="mb-2">Form 1040</h1>
                <p className="text-gray-600">U.S. Individual Income Tax Return</p>
                <p className="text-gray-600">Department of the Treasury—Internal Revenue Service</p>
                <p className="text-gray-600">Tax Year 2024</p>
              </div>

              {/* Taxpayer Information */}
              <div className="mb-8 p-4 bg-gray-50 rounded">
                <h3 className="mb-4">Filing Status & Personal Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-600">Your name</label>
                    <div className="p-2 bg-white border border-gray-300 rounded mt-1">
                      <p>TAXPAYER NAME</p>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Social Security Number</label>
                    <div className="p-2 bg-white border border-gray-300 rounded mt-1">
                      <p>XXX-XX-XXXX</p>
                    </div>
                  </div>
                </div>
                <div className="mt-4">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" checked readOnly className="w-4 h-4" />
                    <span>Single</span>
                  </label>
                </div>
              </div>

              {/* Income Section */}
              <div className="mb-8">
                <div className="bg-[#4A00B5] text-white p-3 rounded-t">
                  <h3 className="text-white">Income</h3>
                </div>
                <div className="border-2 border-[#4A00B5] border-t-0 rounded-b p-4 space-y-3">
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                    <div>
                      <span className="mr-2">1a</span>
                      <span>Total amount from Form(s) W-2, box 1</span>
                    </div>
                    <span className="px-4 py-2 bg-white border border-gray-300 rounded min-w-[150px] text-right">
                      ${data.totalIncome.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                    <div>
                      <span className="mr-2">9</span>
                      <span>Total income (add lines 1a through 8)</span>
                    </div>
                    <span className="px-4 py-2 bg-white border border-gray-300 rounded min-w-[150px] text-right">
                      ${data.totalIncome.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Deductions Section */}
              <div className="mb-8">
                <div className="bg-[#00FFC0] text-gray-900 p-3 rounded-t">
                  <h3>Standard Deduction and Qualified Business Income Deduction</h3>
                </div>
                <div className="border-2 border-[#00FFC0] border-t-0 rounded-b p-4 space-y-3">
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                    <div>
                      <span className="mr-2">12</span>
                      <span>Standard deduction or itemized deductions</span>
                    </div>
                    <span className="px-4 py-2 bg-white border border-gray-300 rounded min-w-[150px] text-right">
                      ${data.deductions.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                    <div>
                      <span className="mr-2">15</span>
                      <span>Taxable income</span>
                    </div>
                    <span className="px-4 py-2 bg-white border-2 border-[#4A00B5] rounded min-w-[150px] text-right">
                      ${taxableIncome.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Tax and Credits Section */}
              <div className="mb-8">
                <div className="bg-[#4A00B5] text-white p-3 rounded-t">
                  <h3 className="text-white">Tax and Credits</h3>
                </div>
                <div className="border-2 border-[#4A00B5] border-t-0 rounded-b p-4 space-y-3">
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                    <div>
                      <span className="mr-2">16</span>
                      <span>Tax</span>
                    </div>
                    <span className="px-4 py-2 bg-white border border-gray-300 rounded min-w-[150px] text-right">
                      ${totalTaxDue.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                    <div>
                      <span className="mr-2">24</span>
                      <span>Total tax</span>
                    </div>
                    <span className="px-4 py-2 bg-white border-2 border-[#4A00B5] rounded min-w-[150px] text-right">
                      ${totalTaxDue.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Payments Section */}
              <div className="mb-8">
                <div className="bg-[#00FFC0] text-gray-900 p-3 rounded-t">
                  <h3>Payments</h3>
                </div>
                <div className="border-2 border-[#00FFC0] border-t-0 rounded-b p-4 space-y-3">
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                    <div>
                      <span className="mr-2">25a</span>
                      <span>Federal income tax withheld</span>
                    </div>
                    <span className="px-4 py-2 bg-white border border-gray-300 rounded min-w-[150px] text-right">
                      ${data.taxWithheld.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                    <div>
                      <span className="mr-2">33</span>
                      <span>Total payments</span>
                    </div>
                    <span className="px-4 py-2 bg-white border-2 border-[#00FFC0] rounded min-w-[150px] text-right">
                      ${data.taxWithheld.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Refund Section */}
              <div className="mb-8">
                <div className={`p-3 rounded-t ${refundAmount > 0 ? 'bg-[#00FFC0]' : 'bg-red-500 text-white'}`}>
                  <h3 className={refundAmount > 0 ? 'text-gray-900' : 'text-white'}>
                    {refundAmount > 0 ? 'Refund' : 'Amount You Owe'}
                  </h3>
                </div>
                <div className={`border-2 ${refundAmount > 0 ? 'border-[#00FFC0]' : 'border-red-500'} border-t-0 rounded-b p-4`}>
                  <div className="flex justify-between items-center p-4 bg-gray-50 rounded">
                    <div>
                      <span className="mr-2">{refundAmount > 0 ? '34' : '37'}</span>
                      <span className="text-lg">
                        {refundAmount > 0 ? 'Amount overpaid (Refund)' : 'Amount you owe'}
                      </span>
                    </div>
                    <span className={`px-6 py-3 border-4 rounded text-2xl min-w-[200px] text-right ${
                      refundAmount > 0 
                        ? 'bg-[#00FFC0] border-[#00D9A6]' 
                        : 'bg-red-100 border-red-500 text-red-700'
                    }`}>
                      ${Math.abs(refundAmount).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Signature Section */}
              <div className="border-t-2 border-gray-300 pt-6">
                <h3 className="mb-4">Sign Here</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Under penalties of perjury, I declare that I have examined this return and accompanying schedules and statements, and to the best of my knowledge and belief, they are true, correct, and complete.
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-600">Your signature</label>
                    <div className="p-3 bg-gray-50 border-b-2 border-gray-900 mt-1">
                      <p className="text-gray-400 italic">Sign here</p>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Date</label>
                    <div className="p-3 bg-gray-50 border-b-2 border-gray-900 mt-1">
                      <p className="text-gray-400 italic">MM/DD/YYYY</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer Note */}
              <div className="mt-8 p-4 bg-blue-50 border-l-4 border-blue-500 rounded">
                <p className="text-sm text-blue-900">
                  <strong>Note:</strong> This is a mock preview generated by TAX-BOT for demonstration purposes. 
                  This is not an official IRS document and should not be filed.
                </p>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
}
