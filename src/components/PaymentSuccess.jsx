import React, { useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { setSubscriptionPlan } from '../store/reducers/layoutReducer';
import axios from 'axios';

const PaymentSuccess = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const hasPaymentBeenSaved = useRef(false);

    // Extract URL parameters
    const paymentId = searchParams.get('id');
    const status = searchParams.get('status');
    const amount = searchParams.get('amount');
    const message = searchParams.get('message');
    const subscriptionPlan = searchParams.get('subscriptionPlan');
    const dispatch = useDispatch();

    const savePaymentDetails = async (paymentId, status, amount, message) => {
        if (hasPaymentBeenSaved.current) return;
        
        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/payment/save`, {
                paymentId,
                status,
                amount,
                message,
                userId: localStorage.getItem('user_id'),
                subscriptionPlan
            });
            hasPaymentBeenSaved.current = true;
            dispatch(setSubscriptionPlan(null));
            console.log('Payment details saved successfully');
        } catch (error) {
            console.error('Error saving payment details:', error);
        }
    };

    useEffect(() => {
        if (subscriptionPlan && !hasPaymentBeenSaved.current) {
            savePaymentDetails(paymentId, status, amount, message);
        }
    }, [subscriptionPlan]);

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
                <div className="mb-8">
                    <CheckCircle className="w-20 h-20 text-green-500 mx-auto animate-bounce" />
                </div>

                <h1 className="text-3xl font-bold text-gray-900 mb-4">
                    Payment Successful!
                </h1>

                <p className="text-gray-600 mb-8">
                    Thank you for your subscription. Your payment of ${amount / 100} has been processed successfully.
                    Transaction ID: {paymentId}
                </p>

                <div className="space-y-4">
                    <button
                        onClick={() => navigate('/')}
                        className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition duration-200"
                    >
                        Go to Dashboard
                    </button>

                    <button
                        onClick={() => navigate('/subscription-plans')}
                        className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-200 transition duration-200"
                    >
                        View Subscription Details
                    </button>
                </div>

                <p className="text-sm text-gray-500 mt-8">
                    You will be automatically redirected to the dashboard in 5 seconds...
                </p>
            </div>
        </div>
    );
};

export default PaymentSuccess; 