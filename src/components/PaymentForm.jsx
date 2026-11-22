import React, { useState } from 'react';
import PaymentProcessing from './PaymentProcessing';
import Card from './ui/Card';
import Input from './ui/Input';
import Button from './ui/Button';
import Badge from './ui/Badge';

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
    <div className="max-w-lg mx-auto bg-bg-secondary rounded-2xl shadow-xl overflow-hidden">
      <div className="bg-gradient-to-r from-primary-600 via-primary-700 to-primary-900 text-white p-8 text-center relative">
        <h2 className="text-2xl font-bold mb-2">💳 Payment Details</h2>
        <p className="opacity-90">Enter payment information</p>
      </div>

      <div className="p-6 sm:p-10 space-y-6">
        <Input
          label="Amount (₹)"
          type="number"
          id="amount"
          name="amount"
          value={formData.amount}
          onChange={handleInputChange}
          placeholder="0.00"
          min="1"
          max="50000"
          step="0.01"
          error={errors.amount}
          leftIcon={<span className="font-semibold" aria-hidden="true">₹</span>}
        />

        <Input
          label="Description"
          type="text"
          id="description"
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          placeholder="What is this payment for?"
          maxLength="100"
          error={errors.description}
        />

        <Input
          label="Your Name"
          type="text"
          id="customerName"
          name="customerName"
          value={formData.customerName}
          onChange={handleInputChange}
          placeholder="Enter your full name"
          error={errors.customerName}
        />
        <Input
          label="Email Address"
          type="email"
          id="customerEmail"
          name="customerEmail"
          value={formData.customerEmail}
          onChange={handleInputChange}
          placeholder="your.email@example.com"
          error={errors.customerEmail}
        />

        <div className="bg-bg-tertiary dark:bg-neutral-800 rounded-xl p-5">
          <div className="font-semibold mb-4 text-text-primary">Payment Summary</div>
          <div className="flex justify-between my-3 text-text-secondary">
            <span>Amount:</span>
            <span className="text-success-600 dark:text-success-400 font-semibold">
              {formData.amount ? `₹${parseFloat(formData.amount).toFixed(2)}` : '₹0.00'}
            </span>
          </div>
          <div className="flex justify-between my-3 text-text-secondary">
            <span>Transaction Fee:</span>
            <span className="text-success-600 dark:text-success-400">₹0.00</span>
          </div>
          <div className="flex justify-between pt-4 mt-4 border-t border-border-primary font-semibold text-text-primary">
            <span>Total:</span>
            <span className="text-success-600 dark:text-success-400">
              {formData.amount ? `₹${parseFloat(formData.amount).toFixed(2)}` : '₹0.00'}
            </span>
          </div>
        </div>

        <Button
          onClick={handleProceedToPayment}
          variant="success"
          fullWidth
          size="lg"
          disabled={!formData.amount || !formData.description || !formData.customerEmail || !formData.customerName}
        >
          🔐 Proceed to Payment
        </Button>
      </div>
    </div>
  );
};

export default PaymentForm;
