import React, { useState } from 'react';
import PaymentProcessing from './PaymentProcessing';

const PaymentForm = () => {
  const [formData, setFormData] = useState({
    amount: '',
    description: '',
    customerEmail: '',
    customerName: ''
  });
  const [showProcessing, setShowProcessing] = useState(false);
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Please enter a valid amount';
    }
    
    if (parseFloat(formData.amount) > 50000) {
      newErrors.amount = 'Amount cannot exceed ₹50,000';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Please enter a description';
    }
    
    if (!formData.customerEmail || !/\S+@\S+\.\S+/.test(formData.customerEmail)) {
      newErrors.customerEmail = 'Please enter a valid email';
    }
    
    if (!formData.customerName.trim()) {
      newErrors.customerName = 'Please enter your name';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleProceedToPayment = () => {
    if (validateForm()) {
      setShowProcessing(true);
    }
  };

  const handleBackToForm = () => {
    setShowProcessing(false);
  };

  if (showProcessing) {
    return <PaymentProcessing paymentData={formData} onBack={handleBackToForm} />;
  }

  return (
    <div className="max-w-lg mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
      <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-purple-700 text-white p-8 text-center relative">
        <h2 className="text-2xl font-bold mb-2">💳 Payment Details</h2>
        <p className="opacity-90">Enter payment information</p>
      </div>

      <div className="p-10">
        <div className="mb-6">
          <label htmlFor="amount" className="block mb-2 font-semibold text-gray-700 text-sm">Amount (₹)</label>
          <div className="relative flex items-center">
            <span className="absolute left-4 font-semibold text-gray-600 z-10">₹</span>
            <input
              type="number"
              id="amount"
              name="amount"
              value={formData.amount}
              onChange={handleInputChange}
              placeholder="0.00"
              min="1"
              max="50000"
              step="0.01"
              className={`w-full pl-10 pr-5 py-4 border-2 rounded-xl text-base transition-all duration-300 ${errors.amount ? 'border-red-500 shadow-red-500/10' : 'border-gray-200 focus:border-green-500 focus:shadow-green-500/10'} focus:outline-none focus:shadow-lg`}
            />
          </div>
          {errors.amount && <span className="text-red-500 text-xs mt-1 block">{errors.amount}</span>}
        </div>

        <div className="mb-6">
          <label htmlFor="description" className="block mb-2 font-semibold text-gray-700 text-sm">Description</label>
          <input
            type="text"
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="What is this payment for?"
            maxLength="100"
            className={`w-full px-5 py-4 border-2 rounded-xl text-base transition-all duration-300 ${errors.description ? 'border-red-500 shadow-red-500/10' : 'border-gray-200 focus:border-green-500 focus:shadow-green-500/10'} focus:outline-none focus:shadow-lg`}
          />
          {errors.description && <span className="text-red-500 text-xs mt-1 block">{errors.description}</span>}
        </div>

        <div className="mb-6">
          <label htmlFor="customerName" className="block mb-2 font-semibold text-gray-700 text-sm">Your Name</label>
          <input
            type="text"
            id="customerName"
            name="customerName"
            value={formData.customerName}
            onChange={handleInputChange}
            placeholder="Enter your full name"
            className={`w-full px-5 py-4 border-2 rounded-xl text-base transition-all duration-300 ${errors.customerName ? 'border-red-500 shadow-red-500/10' : 'border-gray-200 focus:border-green-500 focus:shadow-green-500/10'} focus:outline-none focus:shadow-lg`}
          />
          {errors.customerName && <span className="text-red-500 text-xs mt-1 block">{errors.customerName}</span>}
        </div>

        <div className="mb-8">
          <label htmlFor="customerEmail" className="block mb-2 font-semibold text-gray-700 text-sm">Email Address</label>
          <input
            type="email"
            id="customerEmail"
            name="customerEmail"
            value={formData.customerEmail}
            onChange={handleInputChange}
            placeholder="your.email@example.com"
            className={`w-full px-5 py-4 border-2 rounded-xl text-base transition-all duration-300 ${errors.customerEmail ? 'border-red-500 shadow-red-500/10' : 'border-gray-200 focus:border-green-500 focus:shadow-green-500/10'} focus:outline-none focus:shadow-lg`}
          />
          {errors.customerEmail && <span className="text-red-500 text-xs mt-1 block">{errors.customerEmail}</span>}
        </div>

        <div className="bg-gray-50 rounded-xl p-5 mb-8">
          <div className="font-semibold mb-4 text-gray-700">Payment Summary</div>
          <div className="flex justify-between my-3 text-gray-600">
            <span>Amount:</span>
            <span className="text-green-600 font-semibold">
              {formData.amount ? `₹${parseFloat(formData.amount).toFixed(2)}` : '₹0.00'}
            </span>
          </div>
          <div className="flex justify-between my-3 text-gray-600">
            <span>Transaction Fee:</span>
            <span className="text-green-600">₹0.00</span>
          </div>
          <div className="flex justify-between pt-4 mt-4 border-t border-gray-200 font-semibold text-gray-700">
            <span>Total:</span>
            <span className="text-green-600">
              {formData.amount ? `₹${parseFloat(formData.amount).toFixed(2)}` : '₹0.00'}
            </span>
          </div>
        </div>

        <button 
          onClick={handleProceedToPayment}
          className={`w-full py-5 text-base font-semibold rounded-xl transition-all duration-300 mt-5 ${
            !formData.amount || !formData.description || !formData.customerEmail || !formData.customerName
              ? 'bg-gray-300 cursor-not-allowed' 
              : 'bg-gradient-to-r from-green-500 to-green-600 text-white hover:-translate-y-0.5 hover:shadow-lg hover:shadow-green-500/30'
          }`}
          disabled={!formData.amount || !formData.description || !formData.customerEmail || !formData.customerName}
        >
          🔐 Proceed to Payment
        </button>
      </div>
    </div>
  );
};

export default PaymentForm;
