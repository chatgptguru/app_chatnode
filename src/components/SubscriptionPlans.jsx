import { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import Stripe from 'stripe';
import { CheckCircle, X } from 'lucide-react';
import Checkout from './CheckOut';
import { Elements } from '@stripe/react-stripe-js';
import axios from 'axios';
// const stripe = new Stripe(import.meta.env.VITE_STRIPE_SECRET_KEY);
const stripePromise = loadStripe('pk_test_51P3fxGFfdHutdESI4G1kjXUgGyg73LDMxSnyyLJvHvJvCJ5JJ9Yw5EN6F8tkEkoWxkcxVLvt4kvvXUyD4bDDbMXS00G1Y5Ievn');

export default function SubscriptionPlans() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [currentPlan, setCurrentPlan] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [planToSwitch, setPlanToSwitch] = useState(null);
  const getCurrentPlan = async () => {
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/subscriptions/${localStorage.getItem('user_id')}`)
    console.log(response.data)
    setCurrentPlan(response.data)
  }
  useEffect(() => {
    getCurrentPlan()
  }, [])
  useEffect(() => {
    fetchSubscriptionPlans();
  }, []);

  const fetchSubscriptionPlans = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/subscriptions`);
      if (!response.ok) {
        throw new Error('Failed to fetch subscription plans');
      }
      const data = await response.json();
      setPlans(data.plans.filter(plan => plan.isActive));
    } catch (err) {
      console.error('Error fetching plans:', err);
      setError('Failed to load subscription plans');
    } finally {
      setLoading(false);
    }
  };

  const handlePlanSelection = (plan) => {
    if (currentPlan) {
      setPlanToSwitch(plan);
      setShowConfirmModal(true);
    } else {
      setSelectedPlan(plan);
    }
  };

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (plans.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
      <div className="text-center">
        <h2 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
          Choose Your Perfect Plan
        </h2>
        <p className="mt-4 text-xl text-gray-600">
          Start free, upgrade when you're ready
        </p>
      </div>

      {/* Plans Grid */}
      <div className="mt-16 grid gap-8 lg:grid-cols-3">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`relative flex flex-col rounded-2xl border shadow-xl transition-all duration-300 bg-white
              ${currentPlan === plan.name 
                ? 'border-blue-500 border-2 scale-105' 
                : 'border-gray-200 hover:scale-105'
              }`}
          >
            {/* Current Plan Badge */}
            {currentPlan === plan.name && (
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                  Current Plan
                </span>
              </div>
            )}

            {/* Plan Header */}
            <div className="p-8">
              <h3 className={`text-2xl font-bold ${currentPlan === plan.name ? 'text-blue-600' : 'text-gray-900'}`}>
                {plan.name}
              </h3>
              <div className="mt-4 flex items-baseline">
                <span className="text-5xl font-bold tracking-tight text-gray-900">
                  ${plan.price}
                </span>
                <span className="ml-2 text-gray-500">/mo</span>
              </div>

              {/* Features List */}
              <ul className="mt-8 space-y-4">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 shrink-0" />
                    <span className="ml-3 text-gray-600">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Action Button */}
            <div className="p-6 bg-gray-50 mt-auto">
              <button
                onClick={() => handlePlanSelection(plan)}
                disabled={currentPlan === plan.name}
                className={`w-full rounded-lg py-4 px-6 text-center text-base font-semibold transition-all
                  ${currentPlan === plan.name 
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'text-white bg-blue-600 hover:bg-blue-700'
                  }`}
              >
                {currentPlan === plan.name ? 'Current Plan' : 'Get Started'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold mb-4">Change Subscription Plan</h3>
            <p className="text-gray-600 mb-6">
              You are about to switch from "{currentPlan}" to "{planToSwitch.name}". 
              Your new billing cycle will start immediately. Do you want to continue?
            </p>
            <div className="flex gap-4 justify-end">
              <button
                onClick={() => {
                  setShowConfirmModal(false);
                  setPlanToSwitch(null);
                }}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowConfirmModal(false);
                  setSelectedPlan(planToSwitch);
                  setPlanToSwitch(null);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Confirm Change
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Checkout Modal */}
      {selectedPlan && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-auto">
            <Elements stripe={stripePromise}>
              <Checkout
                plan={selectedPlan}
                onClose={() => setSelectedPlan(null)}
              />
            </Elements>
          </div>
        </div>
      )}
    </div>
  );
} 