'use client'


import { useState } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { submitSubscription } from '@/services/subscriptions-invoice/api';
import type { SubscriptionData } from '@/lib/types';


export default function SubscriptionPage() {
  const [paymentExpanded, setPaymentExpanded] = useState(true);
  const [selectedPayment, setSelectedPayment] = useState('visa');
  const [yearlyBilling, setYearlyBilling] = useState(false);
  const [billingSameAsShipping, setBillingSameAsShipping] = useState(true);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cardHolderName, setCardHolderName] = useState('');
  const [billingCountry, setBillingCountry] = useState('Algeria');
  const [zipCode, setZipCode] = useState('');
  const [city, setCity] = useState('');

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // API call here
      // await submitSubscription(...)
      const subscriptionData: SubscriptionData = {
        cardHolderName,
        paymentMethod: selectedPayment,
        billingAddress: {
          country: billingCountry,
          zipCode,
          city,
        },
        plan: {
          type: 'Standard',
          price: 1999,
          duration: 3,
        },
        billingSameAsShipping,
        yearlyBilling,
      };
  
      const response = await submitSubscription(subscriptionData);
  
      if (!response.success) {
        throw new Error(response.error || 'Subscription failed');
      }
  
      // Handle successful subscription
      // You might want to redirect to a success page or show a success message
      console.log('Subscription created:', response.subscriptionId);

    } catch (error) {
      setErrors({ submit: error instanceof Error ? error.message : 'Failed to process subscription' });
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <div className="min-h-screen bg-gray-50 font-['Outfit']">
      {/* Header */}
      <header className="bg-white py-3 px-6 flex items-center justify-between border-b border-gray-100">
        <div className="flex items-center">
          <img 
            src="/api/placeholder/150/50" 
            alt="AlgeCom Logo" 
            className="h-8"
          />
        </div>
        <div className="relative flex-1 max-w-lg mx-12">
          <div className="relative">
            <input
              type="text"
              placeholder="Search something here"
              className="w-full px-4 py-2 rounded-full border border-gray-200 pl-10"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <button className="p-2 text-gray-500 rounded-full border border-gray-200">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </button>
          </div>
          <div className="flex items-center">
            <div className="bg-orange-400 rounded-full h-10 w-10 flex items-center justify-center text-white font-semibold">
              ZJ
            </div>
            <span className="ml-2 font-medium text-blue-900">STORE</span>
            <ChevronDown className="ml-1 h-5 w-5 text-gray-500" />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-screen-xl mx-auto py-6 px-6">
        <div className="flex items-center mb-6">
          <button className="mr-4">
            <svg className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-3xl font-bold text-gray-800">Review and subscribe</h1>
        </div>

        <div className="flex flex-wrap -mx-4">
          {/* Left Column - Payment Details */}
          <div className="w-full lg:w-2/3 px-4">
            <div className="bg-white rounded-lg shadow-sm mb-6 p-6">
              <div className="flex items-center justify-between py-2">
                <div>
                  <span className="text-gray-800 font-medium">Switch to yearly billing</span>
                </div>
                <div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={yearlyBilling}
                      onChange={() => setYearlyBilling(!yearlyBilling)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-900"></div>
                  </label>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm mb-6">
              <div 
                className="flex items-center justify-between px-6 py-4 cursor-pointer border-b border-gray-100"
                onClick={() => setPaymentExpanded(!paymentExpanded)}
              >
                <div>
                  <h2 className="text-lg font-medium text-gray-800">Payment</h2>
                  <p className="text-sm text-gray-500">Choose how you'd like to pay for Algecom.</p>
                </div>
                <div>
                  {paymentExpanded ? (
                    <ChevronUp className="h-5 w-5 text-gray-500" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-500" />
                  )}
                </div>
              </div>
              
              {paymentExpanded && (
                <div className="px-6 py-4">
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-md font-medium text-gray-800">Payment method</h3>
                      <button className="text-blue-600 font-medium flex items-center">
                        <span className="mr-1">+</span> Add new
                      </button>
                    </div>
                    
                    <div className="flex space-x-4">
                      <div 
                        className={`flex-1 border ${selectedPayment === 'visa' ? 'border-blue-600' : 'border-gray-200'} rounded-lg p-4 cursor-pointer`}
                        onClick={() => setSelectedPayment('visa')}
                      >
                        <div className="flex items-center">
                          <div className="flex items-center">
                            <input
                              type="radio"
                              checked={selectedPayment === 'visa'}
                              onChange={() => setSelectedPayment('visa')}
                              className="h-4 w-4 text-blue-600"
                            />
                          </div>
                          <div className="ml-4">
                            <span className="block text-gray-600">**** 8304</span>
                            <div className="flex items-center">
                              <span className="text-gray-500 mr-2">Visa</span>
                              <span className="text-blue-600 font-medium">• Edit</span>
                            </div>
                          </div>
                        </div>
                        <div className="mt-2">
                          <img src="/api/placeholder/40/25" alt="Visa" className="h-6" />
                        </div>
                      </div>
                      
                      <div 
                        className={`flex-1 border ${selectedPayment === 'paypal1' ? 'border-blue-600' : 'border-gray-200'} rounded-lg p-4 cursor-pointer`}
                        onClick={() => setSelectedPayment('paypal1')}
                      >
                        <div className="flex items-center">
                          <div className="flex items-center">
                            <input
                              type="radio"
                              checked={selectedPayment === 'paypal1'}
                              onChange={() => setSelectedPayment('paypal1')}
                              className="h-4 w-4 text-blue-600"
                            />
                          </div>
                          <div className="ml-4">
                            <span className="block text-gray-600">**** 8304</span>
                            <div className="flex items-center">
                              <span className="text-gray-500 mr-2">Paypal</span>
                              <span className="text-blue-600 font-medium">• Edit</span>
                            </div>
                          </div>
                        </div>
                        <div className="mt-2">
                          <img src="/api/placeholder/40/25" alt="PayPal" className="h-6" />
                        </div>
                      </div>
                      
                      <div 
                        className={`flex-1 border ${selectedPayment === 'paypal2' ? 'border-blue-600' : 'border-gray-200'} rounded-lg p-4 cursor-pointer`}
                        onClick={() => setSelectedPayment('paypal2')}
                      >
                        <div className="flex items-center">
                          <div className="flex items-center">
                            <input
                              type="radio"
                              checked={selectedPayment === 'paypal2'}
                              onChange={() => setSelectedPayment('paypal2')}
                              className="h-4 w-4 text-blue-600"
                            />
                          </div>
                          <div className="ml-4">
                            <span className="block text-gray-600">**** 8304</span>
                            <div className="flex items-center">
                              <span className="text-gray-500">Paypal</span>
                            </div>
                          </div>
                        </div>
                        <div className="mt-2">
                          <img src="/api/placeholder/40/25" alt="PayPal" className="h-6" />
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-gray-800 font-medium mb-2">Card holder name</label>
                    <input
                      type="text"
                      placeholder="Ex: Amrani Mohammed"
                      className="w-full px-4 py-3 rounded-lg border border-gray-200"
                      value={cardHolderName}
                      onChange={(e) => setCardHolderName(e.target.value)}
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-gray-800 font-medium mb-2">Billing address</label>
                    <div className="relative">
                      <select 
                        className="w-full px-4 py-3 rounded-lg border border-gray-200 appearance-none"
                        value={billingCountry}
                        onChange={(e) => setBillingCountry(e.target.value)}
                      >
                        <option value="Algeria">Algeria</option>
                        <option value="Morocco">Morocco</option>
                        <option value="Tunisia">Tunisia</option>
                      </select>

                      <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                        <ChevronDown className="h-5 w-5 text-gray-500" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex space-x-4 mb-4">
                    <div className="w-1/2">
                      <label className="block text-gray-800 font-medium mb-2">Zip code</label>
                      <input
                        type="text"
                        placeholder="Ex: 73923"
                        className="w-full px-4 py-3 rounded-lg border border-gray-200"
                        value={zipCode}
                        onChange={(e) => setZipCode(e.target.value)}
                      />
                    </div>
                    <div className="w-1/2">
                      <label className="block text-gray-800 font-medium mb-2">City</label>
                      <input
                        type="text"
                        placeholder="Ex: Tlemcen"
                        className="w-full px-4 py-3 rounded-lg border border-gray-200"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center mt-6">
                    <input
                      type="checkbox"
                      checked={billingSameAsShipping}
                      onChange={() => setBillingSameAsShipping(!billingSameAsShipping)}
                      className="h-5 w-5 text-blue-600 rounded-full"
                    />
                    <label className="ml-2 text-gray-800">Billing address is same as shipping</label>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Right Column - Plan Summary */}
          <div className="w-full lg:w-1/3 px-4">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center mb-6">
                <div className="h-10 w-10 rounded-full bg-blue-700 flex items-center justify-center mr-3">
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-800">Standard plan</h3>
                  <p className="text-gray-500">Monthly</p>
                </div>
                <div className="ml-auto">
                  <span className="text-xl font-bold">1999 DZD</span>
                  <p className="text-gray-500 text-right text-sm">03 months</p>
                </div>
              </div>
              
              <div className="border-t border-gray-100 pt-4 mb-4">
                <div className="flex items-center py-3">
                  <div className="h-6 w-6 rounded-full bg-blue-700 flex items-center justify-center mr-3">
                  </div>
                  <div>
                    <h4 className="font-medium">Today</h4>
                    <p className="text-gray-500 text-sm">Trial</p>
                  </div>
                  <div className="ml-auto">
                    <span className="text-lg font-medium">Free</span>
                  </div>
                </div>
                
                <div className="flex items-center py-3">
                  <div className="h-6 w-6 rounded-full bg-blue-700 flex items-center justify-center mr-3">
                  </div>
                  <div>
                    <h4 className="font-medium">Apr 22, 2025</h4>
                    <p className="text-gray-500 text-sm">03 months</p>
                  </div>
                  <div className="ml-auto">
                    <span className="text-lg font-medium">DZD 10.00/mo</span>
                  </div>
                </div>
                
                <div className="flex items-center py-3">
                  <div className="h-6 w-6 rounded-full bg-blue-700 flex items-center justify-center mr-3">
                  </div>
                  <div>
                    <h4 className="font-medium">Jul 21, 2025</h4>
                  </div>
                  <div className="ml-auto">
                    <span className="text-lg font-medium">1999 DZD</span>
                  </div>
                </div>
              </div>
              
              <div className="border-t border-gray-100 pt-4 mb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium">Amount due</h3>
                    <p className="text-gray-500">Apr 22, 2025</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xl font-bold">1999 DZD</span>
                    <p className="text-gray-500 text-sm">Plus applicable taxes</p>
                  </div>
                </div>
              </div>
              
              <button
                className="w-full bg-blue-800 hover:bg-blue-900 text-white font-medium py-3 px-4 rounded-lg disabled:opacity-50"
                onClick={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Processing...' : 'Subscribe'}
              </button>
              
              <p className="text-center text-gray-500 mt-4 text-sm">
                Change or cancel your plan at any time.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}