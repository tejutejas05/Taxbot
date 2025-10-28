import { motion } from 'motion/react';
import { TrendingUp, ArrowUpRight, Calculator } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';

interface TaxSummaryProps {
  totalIncome: number;
  deductions: number;
  taxWithheld: number;
  onViewForm: () => void;
}

export function TaxSummary({ totalIncome, deductions, taxWithheld, onViewForm }: TaxSummaryProps) {
  // Simple tax calculation (mock)
  const taxableIncome = totalIncome - deductions;
  const taxRate = 0.22; // 22% bracket
  const totalTaxDue = taxableIncome * taxRate;
  const refundAmount = taxWithheld - totalTaxDue;
  const isRefund = refundAmount > 0;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="mb-6"
    >
      <Card className="bg-gradient-to-br from-white to-gray-50 shadow-xl border-2 border-gray-200 overflow-hidden">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-[#4A00B5] text-white flex items-center justify-center">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h2>Your 2024 Tax Summary</h2>
              <p className="text-gray-600 text-sm">Estimated outcome based on your documents</p>
            </div>
          </div>

          {/* Main Result Card */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className={`relative overflow-hidden rounded-2xl p-8 mb-6 ${
              isRefund
                ? 'bg-gradient-to-br from-[#00FFC0] to-[#00D9A6]'
                : 'bg-gradient-to-br from-[#4A00B5] to-[#6B20D5]'
            }`}
          >
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white opacity-10 rounded-full -ml-12 -mb-12" />

            <div className="relative">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-white opacity-90 mb-2">
                    {isRefund ? 'Estimated Refund' : 'Estimated Tax Due'}
                  </p>
                  <div className="flex items-baseline gap-2">
                    <motion.h1
                      className="text-white text-5xl"
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.3, type: "spring" }}
                    >
                      ${Math.abs(refundAmount).toLocaleString()}
                    </motion.h1>
                    {isRefund && (
                      <motion.div
                        initial={{ x: -10, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.5 }}
                      >
                        <ArrowUpRight className="w-10 h-10 text-white" />
                      </motion.div>
                    )}
                  </div>
                </div>
                
                <motion.div
                  animate={{ rotate: [0, 10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-16 h-16 rounded-full bg-white bg-opacity-20 flex items-center justify-center"
                >
                  <TrendingUp className="w-8 h-8 text-white" />
                </motion.div>
              </div>

              {isRefund && (
                <p className="text-white text-sm opacity-90">
                  🎉 Great news! Your deductions saved you money.
                </p>
              )}
            </div>
          </motion.div>

          {/* Breakdown */}
          <div className="space-y-3 mb-6">
            <div className="flex justify-between items-center p-4 bg-gray-100 rounded-lg">
              <span className="text-gray-700">Total Income</span>
              <span className="text-gray-900">${totalIncome.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center p-4 bg-gray-100 rounded-lg">
              <span className="text-gray-700">Total Deductions</span>
              <span className="text-[#00FFC0]">-${deductions.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center p-4 bg-gray-100 rounded-lg">
              <span className="text-gray-700">Taxable Income</span>
              <span className="text-gray-900">${taxableIncome.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center p-4 bg-gray-100 rounded-lg">
              <span className="text-gray-700">Tax Withheld</span>
              <span className="text-gray-900">${taxWithheld.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center p-4 bg-gray-100 rounded-lg">
              <span className="text-gray-700">Calculated Tax</span>
              <span className="text-gray-900">${totalTaxDue.toLocaleString()}</span>
            </div>
          </div>

          <Button
            onClick={onViewForm}
            className="w-full bg-[#4A00B5] hover:bg-[#3A0095] text-white py-6"
          >
            Finalize & View Mock Form 1040
          </Button>
        </div>
      </Card>
    </motion.div>
  );
}
