import React, { useState } from 'react';
import { Plus, Trash2, Info, HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';

const FAQSection = () => {
  const [faqs, setFaqs] = useState([]);
  const [expandedFAQ, setExpandedFAQ] = useState(null);

  const handleAddFAQ = () => {
    setFaqs([...faqs, { question: '', answer: '' }]);
  };

  const handleRemoveFAQ = (index) => {
    setFaqs(faqs.filter((_, i) => i !== index));
    if (expandedFAQ === index) {
      setExpandedFAQ(null);
    }
  };

  const handleFAQChange = (index, field, value) => {
    const updatedFAQs = faqs.map((faq, i) => 
      i === index ? { ...faq, [field]: value } : faq
    );
    setFaqs(updatedFAQs);
  };

  const toggleFAQ = (index) => {
    setExpandedFAQ(expandedFAQ === index ? null : index);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-blue-900 to-blue-700 p-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
                <HelpCircle className="text-white" size={28} />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-white mb-2">
                  Frequently Asked Questions
                </h2>
                <p className="text-blue-100 text-lg">
                  Manage your FAQ content with ease
                </p>
              </div>
            </div>
            <button
              onClick={handleAddFAQ}
              className="bg-gradient-to-r from-orange-500 to-orange-400 hover:from-orange-600 hover:to-orange-500 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <Plus size={20} />
              Add FAQ
            </button>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-8">
          {faqs.length === 0 ? (
            /* Empty State */
            <div className="text-center py-16">
              <div className="bg-gradient-to-br from-blue-50 to-orange-50 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
                <Info className="text-blue-400" size={40} />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-3">
                No FAQs Yet
              </h3>
              <p className="text-gray-500 text-lg mb-8 max-w-md mx-auto">
                Start building your FAQ section by adding your first question and answer pair.
              </p>
              <button
                onClick={handleAddFAQ}
                className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white px-8 py-4 rounded-xl font-semibold flex items-center gap-3 mx-auto transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                <Plus size={20} />
                Create Your First FAQ
              </button>
            </div>
          ) : (
            /* FAQ List */
            <div className="space-y-6">
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  className="group bg-gradient-to-r from-gray-50 to-blue-50/30 border-2 border-gray-200 hover:border-blue-300 rounded-2xl overflow-hidden transition-all duration-300 shadow-sm hover:shadow-lg"
                >
                  {/* FAQ Header */}
                  <div className="p-6 border-b border-gray-200/50">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="bg-gradient-to-r from-blue-600 to-blue-500 text-white w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm">
                          {index + 1}
                        </div>
                        <span className="text-lg font-semibold text-gray-800">
                          FAQ #{index + 1}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => toggleFAQ(index)}
                          className="p-2 hover:bg-white rounded-lg transition-colors text-gray-600 hover:text-blue-600"
                        >
                          {expandedFAQ === index ? (
                            <ChevronUp size={20} />
                          ) : (
                            <ChevronDown size={20} />
                          )}
                        </button>
                        <button
                          onClick={() => handleRemoveFAQ(index)}
                          className="p-2 hover:bg-red-50 rounded-lg transition-colors text-gray-400 hover:text-red-500 group"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                    </div>

                    {/* Question Input */}
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                        <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                        Question
                      </label>
                      <input
                        type="text"
                        value={faq.question}
                        onChange={(e) => handleFAQChange(index, 'question', e.target.value)}
                        placeholder="What would you like to know?"
                        className="w-full p-4 border-2 border-gray-300 focus:border-blue-500 rounded-xl focus:ring-4 focus:ring-blue-100 transition-all duration-200 text-gray-800 placeholder-gray-400 bg-white"
                      />
                    </div>
                  </div>

                  {/* Answer Section - Collapsible */}
                  <div className={`transition-all duration-300 ${expandedFAQ === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
                    <div className="p-6 bg-white/50">
                      <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                        <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                        Answer
                      </label>
                      <textarea
                        value={faq.answer}
                        onChange={(e) => handleFAQChange(index, 'answer', e.target.value)}
                        placeholder="Provide a clear and helpful answer..."
                        rows={4}
                        className="w-full p-4 border-2 border-gray-300 focus:border-blue-500 rounded-xl focus:ring-4 focus:ring-blue-100 transition-all duration-200 text-gray-800 placeholder-gray-400 bg-white resize-none"
                      />
                    </div>
                  </div>

                  {/* Preview Section */}
                  {faq.question && faq.answer && (
                    <div className="bg-gradient-to-r from-blue-50 to-orange-50/30 p-6 border-t border-gray-200/50">
                      <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                        Preview
                      </div>
                      <div className="space-y-3">
                        <div className="font-semibold text-gray-800 text-lg">
                          Q: {faq.question}
                        </div>
                        <div className="text-gray-600 leading-relaxed pl-4 border-l-4 border-orange-300">
                          A: {faq.answer}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Footer Stats */}
          {faqs.length > 0 && (
            <div className="mt-8 p-6 bg-gradient-to-r from-gray-50 to-blue-50/30 rounded-xl border border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{faqs.length}</div>
                    <div className="text-sm text-gray-600">Total FAQs</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-500">
                      {faqs.filter(faq => faq.question && faq.answer).length}
                    </div>
                    <div className="text-sm text-gray-600">Completed</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-500">
                    Last updated: Just now
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FAQSection;