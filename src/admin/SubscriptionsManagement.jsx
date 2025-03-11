import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const SubscriptionsManagement = () => {
    const [plans, setPlans] = useState([]);
    const [editingPlan, setEditingPlan] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Fetch plans when component mounts
    useEffect(() => {
        fetchPlans();
    }, []);

    const fetchPlans = async () => {
        try {
            setIsLoading(true);
            const token = await localStorage.getItem('token');
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/admin/subscriptions`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                }
            });
            setPlans(response.data.plans);
        } catch (error) {
            console.error('Error fetching plans:', error);
            toast.error('Failed to fetch subscription plans');
        } finally {
            setIsLoading(false);
        }
    };

    const handleEditPlan = (plan) => {
        setEditingPlan({ ...plan });
        setIsModalOpen(true);
    };

    const handleSavePlan = async () => {
        try {
            const token = await localStorage.getItem('token');
            await axios.put(
                `${import.meta.env.VITE_API_URL}/api/admin/subscriptions/${editingPlan.id}`,
                editingPlan,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    }
                }
            );
            setPlans(plans.map(p => 
                p.id === editingPlan.id ? editingPlan : p
            ));
            setIsModalOpen(false);
            setEditingPlan(null);
            toast.success('Plan updated successfully');
        } catch (error) {
            console.error('Error updating plan:', error);
            toast.error('Failed to update plan');
        }
    };

    const handleTogglePlanStatus = async (planId, newStatus) => {
        try {
            const token = await localStorage.getItem('token');
            await axios.patch(
                `${import.meta.env.VITE_API_URL}/api/admin/subscriptions/${planId}/status`,
                { isActive: newStatus },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    }
                }
            );
            setPlans(plans.map(p => 
                p.id === planId ? {...p, isActive: newStatus} : p
            ));
            toast.success('Plan status updated successfully');
        } catch (error) {
            console.error('Error updating plan status:', error);
            toast.error('Failed to update plan status');
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div>
            <h2 className="text-2xl font-bold mb-6">Subscriptions Management</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {plans.map((plan) => (
                    <div key={plan.id} className="bg-white rounded-lg shadow p-6">
                        <div className="text-center flex flex-col justify-between h-full">
                            <h3 className="text-xl font-bold">{plan.name}</h3>
                            <div className="mt-4">
                                <span className="text-3xl font-bold">${plan.price}</span>
                                <span className="text-gray-500">/month</span>
                            </div>
                            <ul className="mt-6 space-y-2">
                                {plan.features.map((feature, index) => (
                                    <li key={index} className="text-gray-600">
                                        {feature}
                                    </li>
                                ))}
                            </ul>
                            <div className="mt-6">
                                <label className="inline-flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={plan.isActive}
                                        onChange={() => handleTogglePlanStatus(plan.id, !plan.isActive)}
                                        className="form-checkbox"
                                    />
                                    <span className="ml-2">Active</span>
                                </label>
                            </div>
                            <button 
                                className="mt-4 w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                                onClick={() => handleEditPlan(plan)}
                            >
                                Edit Plan
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Edit Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg w-96">
                        <h3 className="text-xl font-bold mb-4">Edit Plan</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Name</label>
                                <input
                                    type="text"
                                    value={editingPlan.name}
                                    onChange={(e) => setEditingPlan({...editingPlan, name: e.target.value})}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Price</label>
                                <input
                                    type="number"
                                    value={editingPlan.price}
                                    onChange={(e) => setEditingPlan({...editingPlan, price: parseFloat(e.target.value)})}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Features</label>
                                {editingPlan.features.map((feature, index) => (
                                    <input
                                        key={index}
                                        type="text"
                                        value={feature}
                                        onChange={(e) => {
                                            const newFeatures = [...editingPlan.features];
                                            newFeatures[index] = e.target.value;
                                            setEditingPlan({...editingPlan, features: newFeatures});
                                        }}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    />
                                ))}
                            </div>
                            <div className="flex justify-end space-x-2 mt-4">
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSavePlan}
                                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                                >
                                    Save Changes
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SubscriptionsManagement;