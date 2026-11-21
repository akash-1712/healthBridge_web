import React, { useState, useEffect } from 'react';

const env=import.meta.env.VITE_NODE_ENV;

const SubscriptionButton = ({ user, token }) => {
    const [loading, setLoading] = useState(true);
    const [hasSubscription, setHasSubscription] = useState(false);
    const [subscriptionData, setSubscriptionData] = useState(null);

    // Helper: Fetch with auth headers
    const apiFetch = async (url, options = {}) => {
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        };
        
        const response = await fetch(url, {
            ...options,
            headers: { ...headers, ...options.headers }
        });
        
        if (!response.ok) {
            throw new Error(await response.text());
        }
        
        return response.json();
    };

    // Check subscription status
    const checkSubscriptionStatus = async () => {
        if (!token || !user) return;
        
        try {
            setLoading(true);
            const data = await apiFetch(`${env==="dev" ?'/api':'/backend'}/subscription-status`);

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
            const orderResponse = await fetch(`${env==="dev" ?'/api':'/backend'}/create-order`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ userId:user.id })
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
                        const verifyResponse = await fetch(`${env==="dev" ?'/api':'/backend'}/verify-payment`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${token}`
                            },
                            body: JSON.stringify({
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_signature: response.razorpay_signature,
                                userId:user.id
                            })
                        });
                        
                        if (!verifyResponse.ok) {
                            throw new Error(await verifyResponse.text());
                        }
                        
                        const verifyData = await verifyResponse.json();
                        alert('✅ Subscription activated!');
                        checkSubscriptionStatus();  // Refresh
                    },
                    method: {
                        netbanking: true,   
                        card: true,        
                        wallet: true,      
                        emi: false,         
                        paylater: false     
                    },
                    prefill: {
                        name: user.name,
                        email: user.email,
                        contact:"+919205299574"
                    },
                    theme: {
                        color: '#3399cc'
                    }
                };

                const rzp = new window.Razorpay(options);
                rzp.open();
            };
            document.body.appendChild(script);
        } catch (error) {
            console.error('Payment failed:', error);
            alert('❌ Payment failed: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    // Initial check + periodic refresh
    useEffect(() => {
        checkSubscriptionStatus();
        // const interval = setInterval(checkSubscriptionStatus, 5 * 60 * 1000); // 5 mins
        
        // return () => clearInterval(interval);
    }, [user.id, token]);

    // Show loading
    if (loading) {
        return <div className="subscription-btn"> Checking subscription...</div>;
    }

    // Already subscribed
    if (hasSubscription && subscriptionData) {
        const expiresIn = new Date(subscriptionData.endDate) - new Date();
        const daysLeft = Math.ceil(expiresIn / (1000 * 60 * 60 * 24));
        
        return (
            <div className="subscription-active">
                ✅ Active until {new Date(subscriptionData.endDate).toLocaleDateString()} 
                ({daysLeft} days left)
            </div>
        );
    }

    // Show subscribe button
    return (
        <button 
            onClick={handleSubscribe}
            disabled={loading}
            className="ml-4 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg shadow-md transition text-white focus:outline-none focus:ring-2 focus:ring-red-400 text-sm"
        >
            Subscribe Now
        </button>
    );
};

export default SubscriptionButton;
