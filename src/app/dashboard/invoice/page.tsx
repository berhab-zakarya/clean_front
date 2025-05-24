'use client'

import { useState, useEffect } from 'react';
import { ChevronUp, ChevronDown, X, CreditCard, Calendar, User, AlertTriangle } from 'lucide-react';
import { useSubscription } from '@/hooks/useSubscription';
import type { CreateSubscriptionRequest } from '@/lib/types/subscription';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';
import { usePlans } from '@/hooks/usePlans';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

// Payment method type
type PaymentMethod = {
  id: string;
  lastFourDigits: string;
  type: string;
  expired?: boolean;
  isDeleting?: boolean;
};

export default function SubscriptionPage() {
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const planId = searchParams.get('planId');
  const { plans, loading: plansLoading } = usePlans();
  const { createSubscription, isLoading: isSubmitting } = useSubscription();
  
  const [paymentExpanded, setPaymentExpanded] = useState(true);
  const [selectedPayment, setSelectedPayment] = useState('ccp1');
  const [yearlyBilling, setYearlyBilling] = useState(false);
  const [billingSameAsShipping, setBillingSameAsShipping] = useState(true);
  const [businessName, setBusinessName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [selectedPlan, setSelectedPlan] = useState<number | null>(planId ? parseInt(planId) : null);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    { id: 'ccp1', lastFourDigits: '8304', type: 'CCP' },
    { id: 'ccp2', lastFourDigits: '2156', type: 'CCP' }
  ]);
  const [showAddCardPopup, setShowAddCardPopup] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [cardToDelete, setCardToDelete] = useState<string | null>(null);
  const [showCalendar, setShowCalendar] = useState(false);
  const [datePickerStep, setDatePickerStep] = useState<'year' | 'month'>('year');
  const [selectedYear, setSelectedYear] = useState<string>('');
  const [newCardDetails, setNewCardDetails] = useState({
    cardNumber: '',
    cardHolderName: '',
    expiryDate: '',
    ccpAccountNumber: '',
  });
  const [formValidation, setFormValidation] = useState({
    cardNumber: true,
    cardHolderName: true, 
    expiryDate: true
  });

  // Generate month/year options for the date picker
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => (currentYear + i).toString().substring(2));
  const months = Array.from({ length: 12 }, (_, i) => {
    const month = i + 1;
    return month < 10 ? `0${month}` : `${month}`;
  });

  // Add this useEffect to control body scroll
  useEffect(() => {
    if (showAddCardPopup || showDeleteConfirm) {
      // Prevent scrolling when popup is active
      document.body.style.overflow = 'hidden';
    } else {
      // Re-enable scrolling when popup is closed
      document.body.style.overflow = 'auto';
    }
    
    // Cleanup function to ensure scrolling is re-enabled
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [showAddCardPopup, showDeleteConfirm]);

  // Handle click outside popup
  const handleClickOutside = (e: React.MouseEvent<HTMLDivElement>) => {
    // Check if the click is on the backdrop (not on the popup content)
    if (e.target === e.currentTarget) {
      setShowAddCardPopup(false);
      setShowDeleteConfirm(false);
    }
  };

  const handleSubmit = async () => {
    if (!selectedPlan) {
      toast({
        title: "No Plan Selected",
        description: "Please select a plan before proceeding",
        variant: "destructive",
      });
      return;
    }

    if (!businessName || !phoneNumber) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    // Validate phone number format
    const phoneRegex = /^\+213[0-9]{9}$/;
    if (!phoneRegex.test(phoneNumber)) {
      toast({
        title: "Invalid Phone Number",
        description: "Please enter a valid Algerian phone number (e.g., +213123456789)",
        variant: "destructive",
      });
      return;
    }

    try {
      const subscriptionData: CreateSubscriptionRequest = {
        profile: {
          business_name: businessName.trim(),
          phone_number: phoneNumber.trim()
        },
        plan: {
          id: selectedPlan
        },
        billingSameAsShipping,
        yearlyBilling
      };

      console.log('Submitting subscription:', subscriptionData);
      const response = await createSubscription(subscriptionData);
      
      // Handle successful subscription
      toast({
        title: "Success",
        description: response.message,
      });

      // Redirect to dashboard or success page
      window.location.href = '/dashboard';

    } catch (error) {
      // Check if it's an active subscription error
      if (error instanceof Error && error.message.includes('already has an active or pending subscription')) {
        // Show a more helpful message with a link to manage subscription
        toast({
          title: "Active Subscription",
          description: (
            <div className="flex flex-col gap-2">
              <p>You already have an active or pending subscription.</p>
              <Link 
                href="/dashboard/subscription" 
                className="text-blue-600 hover:text-blue-800 underline"
              >
                Manage your subscription
              </Link>
            </div>
          ),
          variant: "default",
        });
      }
      // Other errors are already handled by the hook
      console.error('Subscription error:', error);
    }
  };

  const validateForm = () => {
    const validation = {
      cardNumber: !!newCardDetails.cardNumber && newCardDetails.cardNumber.length >= 12,
      cardHolderName: !!newCardDetails.cardHolderName && newCardDetails.cardHolderName.length >= 3,
      expiryDate: !!newCardDetails.expiryDate && /^\d{2}\/\d{2}$/.test(newCardDetails.expiryDate)
    };
    
    setFormValidation(validation);
    return Object.values(validation).every(Boolean);
  };

  const handleAddCard = () => {
    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields correctly",
        variant: "destructive",
      });
      return;
    }

    // Generate a unique ID for the new card
    const newCardId = `ccp${Date.now().toString().slice(-4)}`;
    
    // Extract last four digits from card number
    const lastFourDigits = newCardDetails.cardNumber.slice(-4);
    
    // Add the new card to payment methods
    const newCard: PaymentMethod = {
      id: newCardId,
      lastFourDigits,
      type: 'CCP'
    };
    
    setPaymentMethods([...paymentMethods, newCard]);
    
    // Select the new card as current payment
    setSelectedPayment(newCardId);
    
    // Show success message
    toast({
      title: "Card Added",
      description: "Your new payment method has been added successfully",
      variant: "default",
      className: "bg-green-500"
    });
    
    // Close the popup and reset form
    setShowAddCardPopup(false);
    setNewCardDetails({
      cardNumber: '',
      cardHolderName: '',
      expiryDate: '',
      ccpAccountNumber: '',
    });
  };

  const handleCardInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewCardDetails({
      ...newCardDetails,
      [name]: value,
    });
  };

  const handleExpiryDateSelect = (month: string, year: string) => {
    setNewCardDetails({
      ...newCardDetails,
      expiryDate: `${month}/${year}`
    });
    setShowCalendar(false);
  };

  const handleYearSelect = (year: string) => {
    setSelectedYear(year);
    setDatePickerStep('month');
  };

  const handleMonthSelect = (month: string) => {
    handleExpiryDateSelect(month, selectedYear);
    setDatePickerStep('year');
    setShowCalendar(false);
  };

  const openDatePicker = () => {
    setDatePickerStep('year');
    setShowCalendar(true);
  };

  const handleCancelDelete = () => {
    setCardToDelete(null);
    setShowDeleteConfirm(false);
  };

  const handleConfirmDelete = () => {
    if (!cardToDelete) return;

    // Mark card as visually deleted but don't actually remove it yet
    setPaymentMethods(prev => prev.map(method => 
      method.id === cardToDelete ? { ...method, isDeleting: true } : method
    ));

    // If the deleted card was selected, select another card
    if (selectedPayment === cardToDelete) {
      const availableCard = paymentMethods.find(card => card.id !== cardToDelete);
      if (availableCard) {
        setSelectedPayment(availableCard.id);
      }
    }

    // Close the confirmation dialog
    setShowDeleteConfirm(false);

    // Show "undo" toast
    toast({
      title: "Card Deleted",
      description: "Click 'Undo' to restore your card",
      variant: "default",
      className: "bg-gray-500",
      action: (
        <button
          onClick={() => handleUndoDelete(cardToDelete)}
          className="bg-white text-gray-800 px-3 py-1 rounded-md text-xs font-medium"
        >
          Undo
        </button>
      ),
      duration: 5000, // 5 seconds
    });

    // After 5 seconds, if undo wasn't clicked, "permanently" remove the card
    setTimeout(() => {
      // This is fake permanent deletion - in a real app, you'd call an API here
      setPaymentMethods(prev => prev.filter(method => 
        !(method.id === cardToDelete && method.isDeleting)
      ));
      setCardToDelete(null);
    }, 5200); // Slightly longer than toast to ensure toast is gone
  };

  const handleUndoDelete = (cardId: string) => {
    // Mark the card as not being deleted anymore
    setPaymentMethods(prev => prev.map(method => 
      method.id === cardId ? { ...method, isDeleting: false } : method
    ));
    
    // Show success message
    toast({
      title: "Card Restored",
      description: "Your card has been restored successfully",
      variant: "default"
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      
      {/* Main Content */}
      <main className={`max-w-screen-xl mx-auto py-6 px-6 transition-all duration-300 ${(showAddCardPopup || showDeleteConfirm) ? 'blur-sm brightness-50' : ''}`}>
        <div className="flex items-center mb-6">
          <button className="mr-4">
            <Link href="/dashboard">
              <svg className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
          </button>
          <h1 className="text-3xl font-bold text-gray-800">Review and subscribe</h1>
        </div>

        <div className="flex flex-wrap -mx-4">
          {/* Left Column - Plan Selection or Payment Details */}
          <div className="w-full lg:w-2/3 px-4">
            {!selectedPlan ? (
              // Plan Selection UI
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-2xl font-bold mb-8 text-gray-800 text-center">Choose Your Perfect Plan</h2>
                {plansLoading ? (
                  <div className="flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-800"></div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {plans.map((plan) => (
                      <div
                        key={plan.id}
                        className={`relative group transition-all duration-300 transform hover:scale-105 ${
                          selectedPlan === plan.id 
                            ? 'border-2 border-blue-600 bg-gradient-to-br from-blue-50 to-white' 
                            : 'border border-gray-200 hover:border-blue-400 hover:shadow-lg'
                        } rounded-2xl p-8 cursor-pointer`}
                        onClick={() => setSelectedPlan(plan.id)}
                      >
                        {plan.is_best_value && (
                          <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                            <span className="bg-gradient-to-r from-blue-600 to-blue-800 text-white px-4 py-1 rounded-full text-sm font-medium shadow-md">
                              Best Value
                            </span>
                          </div>
                        )}
                        
                        <div className="space-y-6">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="text-xl font-bold text-gray-800 mb-2">{plan.name}</h3>
                              <p className="text-gray-600 text-sm leading-relaxed">{plan.description}</p>
                            </div>
                            <div className="text-right">
                              <div className="text-3xl font-bold text-blue-800">{plan.price}</div>
                              <div className="text-sm text-gray-500">per {plan.frequency}</div>
                            </div>
                          </div>

                          <div className="space-y-3">
                            <div className="flex items-center space-x-3">
                              <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                                <svg className="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                              </div>
                              <span className="text-gray-700">Storage: {plan.features.storage}</span>
                            </div>
                            <div className="flex items-center space-x-3">
                              <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                                <svg className="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                              </div>
                              <span className="text-gray-700">Projects: {plan.features.projects}</span>
                            </div>
                          </div>

                          <div className="pt-4">
                            <button
                              className={`w-full py-3 px-6 rounded-xl font-medium transition-all duration-300 ${
                                selectedPlan === plan.id
                                  ? 'bg-blue-800 text-white shadow-lg shadow-blue-200'
                                  : 'bg-gray-50 text-gray-700 hover:bg-blue-50 hover:text-blue-800'
                              }`}
                            >
                              {selectedPlan === plan.id ? 'Selected' : 'Select Plan'}
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <>
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
                      <h2 className="text-lg font-medium text-gray-800">Business Information</h2>
                      <p className="text-sm text-gray-500">Enter your business details</p>
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
                        <label className="block text-gray-800 font-medium mb-2">Business Name</label>
                        <input
                          type="text"
                          placeholder="Enter your business name"
                          className="w-full px-4 py-3 rounded-lg border border-gray-200"
                          value={businessName}
                          onChange={(e) => setBusinessName(e.target.value)}
                        />
                      </div>
                      
                      <div className="mb-4">
                        <label className="block text-gray-800 font-medium mb-2">Phone Number</label>
                        <input
                          type="tel"
                          placeholder="+213123456789"
                          className="w-full px-4 py-3 rounded-lg border border-gray-200"
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                        />
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
              </>
            )}
          </div>
          
          {/* Right Column - Plan Summary */}
          <div className="w-full lg:w-1/3 px-4">
            {selectedPlan && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center mb-6">
                  <div className="h-10 w-10 rounded-full bg-blue-700 flex items-center justify-center mr-3">
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-800">
                      {plans.find(p => p.id === selectedPlan)?.name || 'Selected Plan'}
                    </h3>
                    <p className="text-gray-500">{yearlyBilling ? 'Yearly' : 'Monthly'}</p>
                  </div>
                  <div className="ml-auto">
                    <span className="text-xl font-bold">
                      {plans.find(p => p.id === selectedPlan)?.price || '0'} DZD
                    </span>
                    <p className="text-gray-500 text-right text-sm">
                      {yearlyBilling ? '12 months' : '1 month'}
                    </p>
                  </div>
                </div>
                
                <div className="border-t border-gray-100 pt-4 mb-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-medium">Amount due</h3>
                      <p className="text-gray-500">Today</p>
                    </div>
                    <div className="text-right">
                      <span className="text-xl font-bold">
                        {plans.find(p => p.id === selectedPlan)?.price || '0'} DZD
                      </span>
                      <p className="text-gray-500 text-sm">Plus applicable taxes</p>
                    </div>
                  </div>
                </div>
                
                <button
                  className="w-full bg-blue-800 hover:bg-blue-900 text-white font-medium py-3 px-4 rounded-lg disabled:opacity-50 cursor-pointer"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Processing...' : 'Subscribe'}
                </button>
                
                <p className="text-center text-gray-500 mt-4 text-sm">
                  Change or cancel your plan at any time.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Add Card Popup */}
      {showAddCardPopup && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={handleClickOutside}
        >
          <div 
            className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-visible transform transition-all duration-300 scale-100 opacity-100"
            style={{ 
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
            }}
          >
            {/* Header */}
            <div className="bg-blue-800 px-6 py-4 text-white">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold flex items-center">
                  <CreditCard className="h-5 w-5 mr-2" />
                  Add Payment Method
                </h3>
                <button 
                  onClick={() => setShowAddCardPopup(false)}
                  className="text-white/80 hover:text-white p-1 rounded-full hover:bg-blue-700 transition-all"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
            
            {/* Form content */}
            <div className="p-6">
              <div className="space-y-5">
                <div className="relative">
                  <label className="block text-gray-700 font-medium mb-2 text-sm">CCP Number</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <CreditCard className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="cardNumber"
                      placeholder="**** **** ****"
                      className={`w-full pl-10 pr-4 py-3 rounded-lg border ${!formValidation.cardNumber && 'border-red-500 bg-red-50'} border-gray-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 focus:outline-none transition-all`}
                      value={newCardDetails.cardNumber}
                      onChange={handleCardInputChange}
                    />
                    {!formValidation.cardNumber && (
                      <p className="text-red-500 text-xs mt-1">Please enter a valid card number</p>
                    )}
                  </div>
                </div>
                
                <div className="relative">
                  <label className="block text-gray-700 font-medium mb-2 text-sm">Card Holder Name</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="cardHolderName"
                      placeholder="Ex: Amrani Mohammed"
                      className={`w-full pl-10 pr-4 py-3 rounded-lg border ${!formValidation.cardHolderName && 'border-red-500 bg-red-50'} border-gray-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 focus:outline-none transition-all`}
                      value={newCardDetails.cardHolderName}
                      onChange={handleCardInputChange}
                    />
                    {!formValidation.cardHolderName && (
                      <p className="text-red-500 text-xs mt-1">Please enter your name</p>
                    )}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="relative">
                    <label className="block text-gray-700 font-medium mb-2 text-sm">Expiry Date</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Calendar className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        name="expiryDate"
                        placeholder="MM/YY"
                        className={`w-full py-3 pl-10 pr-4 rounded-lg border ${!formValidation.expiryDate && 'border-red-500 bg-red-50'} border-gray-200 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 focus:outline-none transition-all cursor-pointer`}
                        value={newCardDetails.expiryDate}
                        readOnly
                        onClick={openDatePicker}
                      />
                      
                      {/* Calendar Dropdown */}
                      {showCalendar && (
                        <div className="absolute mt-1 min-w-[240px] bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                          {datePickerStep === 'year' && (
                            <div className="p-4">
                              <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center justify-between">
                                <span>Select Year</span>
                                <button 
                                  onClick={() => setShowCalendar(false)}
                                  className="text-gray-500 hover:text-gray-700"
                                >
                                  <X className="h-4 w-4" />
                                </button>
                              </h4>
                              <div className="grid grid-cols-3 gap-2 max-h-[200px] overflow-y-auto pb-1">
                                {years.map((year) => (
                                  <button
                                    key={year}
                                    className={`text-sm py-2 px-3 rounded transition-colors ${
                                      selectedYear === year
                                        ? 'bg-blue-600 text-white font-medium'
                                        : 'hover:bg-blue-50'
                                    }`}
                                    onClick={() => handleYearSelect(year)}
                                  >
                                    20{year}
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          {datePickerStep === 'month' && (
                            <div className="p-4">
                              <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center justify-between">
                                <div className="flex items-center">
                                  <button 
                                    onClick={() => setDatePickerStep('year')}
                                    className="mr-2 text-blue-600 hover:text-blue-800"
                                  >
                                    <ChevronDown className="h-4 w-4 rotate-90" />
                                  </button>
                                  <span>Select Month (20{selectedYear})</span>
                                </div>
                                <button 
                                  onClick={() => setShowCalendar(false)}
                                  className="text-gray-500 hover:text-gray-700"
                                >
                                  <X className="h-4 w-4" />
                                </button>
                              </h4>
                              <div className="grid grid-cols-4 gap-2">
                                {months.map((month) => (
                                  <button
                                    key={month}
                                    className="text-sm py-2 px-3 rounded transition-colors hover:bg-blue-50"
                                    onClick={() => handleMonthSelect(month)}
                                  >
                                    {month}
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                      
                      {!formValidation.expiryDate && (
                        <p className="text-red-500 text-xs mt-1">Required</p>
                      )}
                    </div>
                  </div>
                  
                </div>
                
                <div className="pt-4 mt-2">
                  <div className="flex items-center justify-center mb-3">
                    <div className="flex space-x-2">
                      <Image src="/assets/images/ccp.png" alt="CCP" width={32} height={20} className="h-5 object-contain opacity-50" />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center"
                      onClick={() => setShowAddCardPopup(false)}
                    >
                      Cancel
                    </button>
                    <button
                      className="w-full bg-blue-800 hover:bg-blue-900 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center"
                      onClick={handleAddCard}
                    >
                      Add Card
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Card Confirmation */}
      {showDeleteConfirm && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={handleClickOutside}
        >
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-sm">
            <div className="flex items-center text-amber-500 mb-4">
              <AlertTriangle className="h-6 w-6 mr-2" />
              <h3 className="text-lg font-medium">Delete Card</h3>
            </div>
            
            <p className="text-gray-600 mb-6">
              Are you sure you want to remove this card?
            </p>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={handleCancelDelete}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 border border-gray-300 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}