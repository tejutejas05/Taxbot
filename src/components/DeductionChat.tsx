import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, Sparkles, ExternalLink } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card } from './ui/card';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  source?: string;
}

interface DeductionChatProps {
  isVisible: boolean;
}

export function DeductionChat({ isVisible }: DeductionChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hello! I'm your AI Deduction Advisor. I can help you find deductions you might have missed. Ask me about home office expenses, education costs, or any other potential deductions!",
      source: "IRS Publication 17"
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const responses = [
        {
          content: "Based on your income and expenses, you may qualify for the home office deduction if you use part of your home exclusively for business. This could save you approximately $800-$1,200 in taxes.",
          source: "IRS Publication 587 - Business Use of Your Home"
        },
        {
          content: "I see you have charitable donations of $2,500. Did you know you can also deduct mileage driven for charitable purposes at 14 cents per mile? This is often overlooked!",
          source: "IRS Publication 526 - Charitable Contributions"
        },
        {
          content: "With your mortgage interest of $8,500, you're already itemizing. Consider if you had any state and local taxes (SALT) - you can deduct up to $10,000, which could significantly increase your refund.",
          source: "Tax Cuts and Jobs Act (TCJA) SALT Deduction Limits"
        },
        {
          content: "Great question! Educational expenses can be deductible through the Lifetime Learning Credit (up to $2,000) or the American Opportunity Tax Credit (up to $2,500) if you or your dependents were enrolled in eligible programs.",
          source: "IRS Publication 970 - Tax Benefits for Education"
        }
      ];

      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: randomResponse.content,
        source: randomResponse.source
      };

      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ x: 400, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="fixed right-6 top-6 bottom-6 w-96 z-50"
    >
      <Card className="h-full flex flex-col bg-white shadow-2xl border-2 border-[#4A00B5]">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#4A00B5] to-[#6B20D5] p-4 rounded-t-lg">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-white bg-opacity-20 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <motion.div
                className="absolute -top-1 -right-1 w-3 h-3 bg-[#00FFC0] rounded-full"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </div>
            <div>
              <h3 className="text-white">Deduction Advisor</h3>
              <p className="text-white text-sm opacity-90">Real-time AI assistance</p>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl p-4 ${
                    message.role === 'user'
                      ? 'bg-gray-200 text-gray-900'
                      : 'bg-[#4A00B5] text-white'
                  }`}
                >
                  <p className="text-sm leading-relaxed">{message.content}</p>
                  {message.source && (
                    <div className="mt-3 pt-3 border-t border-white border-opacity-20">
                      <a
                        href="#"
                        className="flex items-center gap-1 text-xs text-[#00FFC0] hover:text-[#00D9A6] transition-colors"
                        onClick={(e) => e.preventDefault()}
                      >
                        <ExternalLink className="w-3 h-3" />
                        Source: {message.source}
                      </a>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-start"
            >
              <div className="bg-[#4A00B5] text-white rounded-2xl p-4 max-w-[85%]">
                <div className="flex gap-1">
                  <motion.div
                    className="w-2 h-2 bg-[#00FFC0] rounded-full"
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                  />
                  <motion.div
                    className="w-2 h-2 bg-[#00FFC0] rounded-full"
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                  />
                  <motion.div
                    className="w-2 h-2 bg-[#00FFC0] rounded-full"
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                  />
                </div>
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 bg-white border-t border-gray-200">
          <div className="flex gap-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask about deductions..."
              className="flex-1"
              disabled={isTyping}
            />
            <Button
              onClick={handleSend}
              disabled={!inputValue.trim() || isTyping}
              className="bg-[#4A00B5] hover:bg-[#3A0095] text-white"
              size="icon"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
