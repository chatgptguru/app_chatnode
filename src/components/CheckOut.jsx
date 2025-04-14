import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
const Checkout = ({ plan, onClose }) => {
    const subscriptionPlan = useSelector((state) => state.layout.subscriptionPlan);
    // const stripe = useStripe();
    // const elements = useElements();
    // const [loading, setLoading] = useState(false);
    // const [error, setError] = useState(null);
    // const handleSubmit = async (event) => {
    //     event.preventDefault();
    //     if (!stripe || !elements) return;

    //     setLoading(true);
    //     setError(null);

    //     const { error, paymentMethod } = await stripe.createPaymentMethod({
    //         type: 'card',
    //         card: elements.getElement(CardElement),
    //     });

    //     if (error) {
    //         setError(error.message);
    //         setLoading(false);
    //     } else {
    //         // Send paymentMethod.id to your backend
    //         try {
    //             const data = {
    //                 user_id: localStorage.getItem('user_id'),
    //                 payment_method_id: paymentMethod.id,
    //                 stripe_price_id: plan.stripe_price_id
    //             }
    //             const response = await axios.post(`${import.meta.env.VITE_API_URL}/create-subscription`, data, {
    //                 headers: {
    //                     'Content-Type': 'application/json',
    //                 }
    //             });
    //             toast.success("Subscription created successfully")
    //             onClose()
    //         } catch (err) {
    //             setError('An error occurred. Please try again.');
    //         }
    //         setLoading(false);
    //     }
    // };
    const savePayment = (payment) => {
        console.log(payment)
        return true
    }
    useEffect(() => {
        Moyasar.init({
            element: '.mysr-form',
            amount: plan.price * 100,
            currency: 'USD',
            description: `Subscription to ${plan.name}`,
            publishable_api_key: 'pk_test_PtXX7r1XnRAQnV5uFNQMqReydsEQ2Xj4VahYnAyB',
            callback_url: 'https://testrag.exrelay.com/payment-success?subscriptionPlan=' + subscriptionPlan,
            methods: ['creditcard'],
            on_completed: function (payment) {
                return new Promise(function (resolve, reject) {
                    if (savePayment(payment)) {
                        resolve({});
                    } else {
                        reject();
                    }
                });
            },
        })
    }, [])
    return (
        <>
        </>
        //     <div className="relative">
        //         <button
        //             onClick={onClose}
        //             className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
        //         >
        //             <X className="h-6 w-6" />
        //         </button>

        //         <div className="p-6">
        //             <h2 className="text-2xl font-bold text-center mb-6">
        //                 Complete Your Subscription
        //             </h2>

        //             <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        //                 <h3 className="font-semibold text-lg mb-2">{plan.name}</h3>
        //                 <p className="text-gray-600">${plan.price}/mo</p>
        //             </div>

        //             <form onSubmit={handleSubmit} className="space-y-4">
        //                 <div>
        //                     <label className="block text-sm font-medium mb-2">Card Details</label>
        //                     <div className="p-3 border rounded-lg focus-within:ring-2 focus-within:ring-blue-500">
        //                         <CardElement
        //                             options={{
        //                                 style: {
        //                                     base: {
        //                                         fontSize: '16px',
        //                                         color: '#424770',
        //                                         '::placeholder': {
        //                                             color: '#aab7c4',
        //                                         },
        //                                     },
        //                                     invalid: {
        //                                         color: '#9e2146',
        //                                     },
        //                                 },
        //                             }}
        //                         />
        //                     </div>
        //                 </div>

        //                 {error && (
        //                     <div className="p-4 bg-red-50 text-red-600 rounded-lg text-sm">
        //                         {error}
        //                     </div>
        //                 )}

        //                 <button
        //                     type="submit"
        //                     disabled={loading || !stripe}
        //                     className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition duration-200 disabled:bg-blue-300"
        //                 >
        //                     {loading ? (
        //                         <div className="flex items-center justify-center">
        //                             <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
        //                             Processing...
        //                         </div>
        //                     ) : (
        //                         `Pay ${plan.price} /mo`
        //                     )}
        //                 </button>
        //             </form>

        //             <p className="mt-4 text-sm text-gray-500 text-center">
        //                 Your payment is secured by Stripe. You can cancel anytime.
        //             </p>
        //         </div>
        //     </div>
    );
};

export default Checkout;