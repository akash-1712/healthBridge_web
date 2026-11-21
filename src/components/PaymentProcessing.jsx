import React, { useState, useEffect } from 'react';

const PaymentProcessing = ({ paymentData, onBack, onMainBack }) => {
  const [processingStatus, setProcessingStatus] = useState('creating');
  const [qrCodeData, setQrCodeData] = useState(null);
  const [orderId, setOrderId] = useState('');
  const [error, setError] = useState('');

  // Your real QROPAY credentials
  const QROPAY_API_KEY = import.meta.env.REACT_APP_QROPAY_API_KEY || '8923153322481';
  const QROPAY_SECRET_KEY = import.meta.env.REACT_APP_QROPAY_SECRET_KEY || '031b41c0c335b2e8709d702e7fa930c4';

  useEffect(() => {
    initiateRealPayment();
  }, []);

  // Simple hash function for browser (no crypto library needed)
  const simpleHash = (data) => {
    let hash = 0;
    for (let i = 0; i < data.length; i++) {
      const char = data.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash).toString(16);
  };

  const generateSignature = (data, secretKey) => {
    // Create sorted query string
    const sortedKeys = Object.keys(data).filter(key => key !== 'signature').sort();
    const queryString = sortedKeys.map(key => `${key}=${data[key]}`).join('&');
    
    // Use simple hash with secret key (browser-compatible)
    const dataWithSecret = queryString + secretKey;
    return simpleHash(dataWithSecret);
  };

  const initiateRealPayment = async () => {
    try {
      setProcessingStatus('creating');
      
      const newOrderId = `qro_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      setOrderId(newOrderId);
      
      // Real QROPAY payment data
      const paymentRequestData = {
        key: QROPAY_API_KEY,
        order_id: newOrderId,
        amount: Math.round(parseFloat(paymentData.amount)),
        currency: 'INR',
        purpose: paymentData.description,
        customer_email: paymentData.customerEmail,
        customer_name: paymentData.customerName,
        timestamp: Math.floor(Date.now() / 1000),
        redirect_url: window.location.origin + '/api/payment-callback',
        success_url: window.location.origin + '/payment-success',
        failure_url: window.location.origin + '/payment-failed',
      };

      // Generate signature using browser-compatible method
      const signature = generateSignature(paymentRequestData, QROPAY_SECRET_KEY);
      paymentRequestData.signature = signature;

      console.log('🔐 Creating real QROPAY payment:', {
        order_id: newOrderId,
        amount: paymentRequestData.amount,
        signature: signature.substring(0, 16) + '...'
      });

      // **REAL QROPAY API CALL**
      const response = await fetch('/qropay-api/add_order.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${QROPAY_API_KEY}`,
          'X-Signature': signature,
        },
        body: JSON.stringify(paymentRequestData),
      });

      const result = await response.json();

      if (result.status==="true") {

        // if (result.success || result.status === 'success') {
          // Use real data from QROPAY API
          const realQRData = {
            payment_url: result.payment_url,
            qr_code_url: result.qr_code_url,
            order_id: newOrderId,
            amount: paymentRequestData.amount,
            expires_at: result.expires_at || new Date(Date.now() + 15 * 60 * 1000).toISOString()
          };
          
          setQrCodeData(realQRData);
          setProcessingStatus('awaiting');
          
          console.log('✅ Real QROPAY payment created:', realQRData);
          
          // Start real payment monitoring
        //   startRealPaymentMonitoring(newOrderId);
        } else {
          throw new Error(result.msg || 'QROPAY payment creation failed');
        }
      }  catch (error) {
      console.error('QROPAY API call failed:', error);
      setError(error.message);
      setProcessingStatus('failed');
    }
  };

  const startRealPaymentMonitoring = (orderId) => {
    // Real payment status monitoring
    const checkPaymentStatus = async () => {
      try {
        // Call QROPAY status check API
        const statusResponse = await fetch(`https://api.qropay.com/v1/payment-status/${orderId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${QROPAY_API_KEY}`,
            'Content-Type': 'application/json',
          }
        });

        if (statusResponse.ok) {
          const statusResult = await statusResponse.json();
          
          if (statusResult.status === 'success' || statusResult.status === 'completed') {
            console.log('🎉 Real payment completed:', statusResult);
            setProcessingStatus('completed');
            return;
          } else if (statusResult.status === 'failed') {
            console.log('❌ Payment failed:', statusResult);
            setProcessingStatus('failed');
            setError('Payment was declined or failed');
            return;
          }
        }
        
        // Continue monitoring if status is still pending
        setTimeout(checkPaymentStatus, 3000);
      } catch (error) {
        console.error('Status check error:', error);
        // Continue monitoring despite errors
        setTimeout(checkPaymentStatus, 5000);
      }
    };

    // Start monitoring after 3 seconds
    setTimeout(checkPaymentStatus, 3000);
    
    // Set timeout for payment expiry (15 minutes)
    setTimeout(() => {
      if (processingStatus === 'awaiting') {
        setProcessingStatus('failed');
        setError('Payment session expired. Please try again.');
      }
    }, 15 * 60 * 1000);
  };

  const handleRetryPayment = () => {
    setError('');
    initiateRealPayment();
  };

  const handleNewPayment = () => {
    onMainBack();
  };

  const openPaymentLink = () => {
    if (qrCodeData?.payment_url) {
      window.open(qrCodeData.payment_url, '_blank', 'width=600,height=700');
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden min-h-[500px]">
      <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-purple-700 text-white p-6 relative">
        <button 
          onClick={onBack} 
          className="absolute left-5 top-1/2 -translate-y-1/2 bg-white/20 text-white border-none px-4 py-2 rounded-lg cursor-pointer text-sm hover:bg-white/30 transition-colors"
        >
          ← Back to Form
        </button>
        <h2 className="text-2xl font-bold text-center">🔐 Payment Processing</h2>
      </div>

      {processingStatus === 'creating' && (
        <div className="p-16 text-center">
          <div className="w-16 h-16 border-4 border-gray-200 border-t-green-500 rounded-full animate-spin mx-auto mb-8"></div>
          <h3 className="text-xl font-semibold mb-4 text-gray-800">Creating Secure Payment</h3>
          <p className="text-gray-600 mb-8">Connecting to QROPAY servers...</p>
          <div className="bg-gray-50 rounded-xl p-6 max-w-md mx-auto">
            <div className="flex justify-between items-center mb-4">
              <span className="font-semibold text-gray-600">Amount:</span>
              <span className="text-gray-800 font-bold">₹{paymentData.amount}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-semibold text-gray-600">Description:</span>
              <span className="text-gray-800">{paymentData.description}</span>
            </div>
          </div>
        </div>
      )}

      {processingStatus === 'awaiting' && qrCodeData && (
        <div className="p-8">
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-8 mb-8 text-center">
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">💳 Complete Your Payment</h3>
              <div className="text-5xl font-bold text-green-600 my-6">₹{paymentData.amount}</div>
            </div>
            
            <div className="bg-white rounded-xl p-6 mt-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="font-semibold text-gray-600">Order ID:</span>
                  <span className="text-gray-800 font-mono bg-gray-100 px-3 py-1 rounded-lg text-sm">{orderId}</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="font-semibold text-gray-600">Description:</span>
                  <span className="text-gray-800">{paymentData.description}</span>
                </div>
                <div className="flex justify-between items-center py-3">
                  <span className="font-semibold text-gray-600">Customer:</span>
                  <span className="text-gray-800">{paymentData.customerName}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center my-10">
            <h4 className="text-lg font-semibold mb-6 text-gray-800">📱 Scan QR Code to Pay</h4>
            <div className="relative inline-block my-6">
              <img 
                src={qrCodeData.qr_code_url} 
                alt="Payment QR Code" 
                className="w-64 h-64 rounded-2xl shadow-xl bg-white p-6 mx-auto"
                onError={(e) => {
                  e.target.style.display = 'none';
                  console.error('QR Code failed to load');
                }}
              />
              <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-3 py-1 rounded-full font-semibold">
                🔒 Secure
              </div>
            </div>
            <p className="text-gray-600 mt-6 text-sm leading-relaxed max-w-md mx-auto">
              Open any UPI app (Google Pay, PhonePe, Paytm, etc.) and scan this QR code to complete your payment
            </p>
          </div>

          <div className="text-center my-8">
            <button 
              onClick={openPaymentLink} 
              className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-500/25"
            >
              🌐 Open Payment Page
            </button>
          </div>

          <div className="bg-gray-50 rounded-xl p-6 text-center mt-8">
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="font-semibold text-gray-700">Waiting for payment confirmation...</span>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed m-0">
              Complete the payment in your UPI app. This page will automatically update once payment is received.
            </p>
          </div>
        </div>
      )}

      {processingStatus === 'completed' && (
        <div className="p-16 text-center">
          <div className="mb-8">
            <div className="text-6xl animate-bounce">✅</div>
          </div>
          <h2 className="text-3xl font-bold text-green-600 mb-8">🎉 Payment Successful!</h2>
          <div className="my-8">
            <div className="bg-gray-50 rounded-xl p-6 text-left max-w-md mx-auto">
              <div className="space-y-4">
                <div className="flex justify-between py-2 border-b border-gray-200">
                  <span className="text-gray-600">Order ID:</span>
                  <span className="font-semibold text-green-600">{orderId}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-200">
                  <span className="text-gray-600">Amount:</span>
                  <span className="font-semibold text-green-600">₹{paymentData.amount}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-200">
                  <span className="text-gray-600">Customer:</span>
                  <span className="font-semibold text-green-600">{paymentData.customerName}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span className="text-gray-600">Description:</span>
                  <span className="font-semibold text-green-600">{paymentData.description}</span>
                </div>
              </div>
            </div>
          </div>
          <button 
            onClick={handleNewPayment} 
            className="bg-gradient-to-r from-green-500 to-green-600 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-green-500/25"
          >
            🔄 Make Another Payment
          </button>
        </div>
      )}

      {processingStatus === 'failed' && (
        <div className="p-16 text-center">
          <div className="text-6xl mb-6">❌</div>
          <h2 className="text-2xl font-bold text-red-600 mb-6">Payment Failed</h2>
          <p className="text-gray-600 my-6 max-w-md mx-auto">{error}</p>
          <div className="mt-8 space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
            <button 
              onClick={handleRetryPayment} 
              className="w-full sm:w-auto bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-green-500/25"
            >
              🔄 Retry Payment
            </button>
            <button 
              onClick={onBack} 
              className="w-full sm:w-auto bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-500/25"
            >
              ← Back to Form
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentProcessing;
