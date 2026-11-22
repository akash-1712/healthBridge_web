import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import Button from './ui/Button';
import Badge from './ui/Badge';
import LoadingSpinner from './ui/LoadingSpinner';
import { buildApiUrl } from '../util/api';

const SubscriptionButton = ({ user, token }) => {
  const [loading, setLoading] = useState(true);
  const [hasSubscription, setHasSubscription] = useState(false);
  const [subscriptionData, setSubscriptionData] = useState(null);

  const apiFetch = async (url, options = {}) => {
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    };

    const response = await fetch(url, {
      ...options,
      headers: { ...headers, ...options.headers },
    });

    if (!response.ok) {
      throw new Error(await response.text());
    }

    return response.json();
  };

  const checkSubscriptionStatus = async () => {
    if (!token || !user) return;

    try {
      setLoading(true);
      const data = await apiFetch(buildApiUrl('subscription-status'));

      setHasSubscription(data.hasActiveSubscription);
      setSubscriptionData(data.subscription);
    } catch (error) {
      console.error('Subscription check failed:', error.message);
      setHasSubscription(false);
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async () => {
    try {
      setLoading(true);

      // 1. Create order
      const orderResponse = await fetch(buildApiUrl('create-order'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ userId: user.id }),
      });

      if (!orderResponse.ok) {
        throw new Error(await orderResponse.text());
      }
      const orderData = await orderResponse.json();

      // 2. Load Razorpay script
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => {
        const options = {
          key: orderData.key,
          amount: orderData.amount,
          currency: 'INR',
          name: 'HealthBridge Pediatric',
          description: '1 Month Subscription - ₹1000',
          order_id: orderData.orderId,
          handler: async function (response) {
            // 3. Verify payment
            const verifyResponse = await fetch(buildApiUrl('verify-payment'), {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                userId: user.id,
              }),
            });

            if (!verifyResponse.ok) {
              throw new Error(await verifyResponse.text());
            }

            toast.success('Subscription activated!');
            checkSubscriptionStatus();
          },
          method: {
            netbanking: true,
            card: true,
            wallet: true,
            emi: false,
            paylater: false,
          },
          prefill: {
            name: user.name,
            email: user.email,
            contact: '+919205299574',
          },
          theme: {
            color: '#2563eb',
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      };
      document.body.appendChild(script);
    } catch (error) {
      console.error('Payment failed:', error);
      toast.error('Payment failed: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Initial check
  useEffect(() => {
    checkSubscriptionStatus();
  }, [user.id, token]);

  // Show loading
  if (loading) {
    return (
      <div className="flex items-center gap-2 text-sm text-text-secondary px-2">
        <LoadingSpinner size="sm" />
        <span>Checking subscription...</span>
      </div>
    );
  }

  // Already subscribed
  if (hasSubscription && subscriptionData) {
    const expiresIn = new Date(subscriptionData.endDate) - new Date();
    const daysLeft = Math.ceil(expiresIn / (1000 * 60 * 60 * 24));

    return (
      <Badge variant="success" size="md">
        ✅ Active until {new Date(subscriptionData.endDate).toLocaleDateString()} ({daysLeft} days left)
      </Badge>
    );
  }

  // Show subscribe button
  return (
    <Button
      onClick={handleSubscribe}
      disabled={loading}
      variant="primary"
      size="sm"
    >
      Subscribe Now
    </Button>
  );
};

export default SubscriptionButton;