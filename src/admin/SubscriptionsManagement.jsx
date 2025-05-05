import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const SubscriptionsManagement = () => {
    const [plans, setPlans] = useState([]);
    const [editingPlan, setEditingPlan] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isCreating, setIsCreating] = useState(false);

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

    const handleCreatePlan = () => {
        setEditingPlan({
            name: '',
            price: 0,
            features: [''],
            chatLimit: 0,
            documentLimit: 0,
            chatbotLimit: 0,
            teamLimit: 0,
            memberLimit: 0,
            isActive: true
        });
        setIsCreating(true);
        setIsModalOpen(true);
    };

    const handleSavePlan = async () => {
        try {
            const token = await localStorage.getItem('token');
            if (isCreating) {
                const response = await axios.post(
                    `${import.meta.env.VITE_API_URL}/api/admin/subscriptions`,
                    editingPlan,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'application/json',
                        }
                    }
                );
                setPlans([...plans, response.data]);
                toast.success('Plan created successfully');
            } else {
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
                toast.success('Plan updated successfully');
            }
            setIsModalOpen(false);
            setEditingPlan(null);
            setIsCreating(false);
        } catch (error) {
            console.error('Error saving plan:', error);
            toast.error(`Failed to ${isCreating ? 'create' : 'update'} plan`);
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
                p.id === planId ? { ...p, isActive: newStatus } : p
            ));
            toast.success('Plan status updated successfully');
        } catch (error) {
            console.error('Error updating plan status:', error);
            toast.error('Failed to update plan status');
        }
    };

    const handleDeletePlan = async (planId) => {
        try {
            const token = await localStorage.getItem('token');
            await axios.delete(
                `${import.meta.env.VITE_API_URL}/api/admin/subscriptions/${planId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    }
                }
            );
            setPlans(plans.filter(p => p.id !== planId));
            toast.success('Plan deleted successfully');
        } catch (error) {
            console.error('Error deleting plan:', error);
            toast.error('Failed to delete plan');
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
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Subscriptions Management</h2>
                <div className='flex gap-2'>
                    <button
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                        onClick={async () => {
                            const response = await axios.get(`${import.meta.env.VITE_API_URL}/create_plans`);
                            if (response.status === 200) {
                                toast.success('Auto-Pricing Plan created successfully');
                            } else {
                                toast.error('Failed to create Auto-Pricing Plan');
                            }
                        }}
                    >
                        Create Auto-Pricing Plan
                    </button>
                    <button
                        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                        onClick={handleCreatePlan}
                    >
                        Create New Plan
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {plans.map((plan) => (
                    <div key={plan.id} className="bg-white rounded-lg shadow p-6">
                        <div className="text-center flex flex-col justify-between h-full">
                            <h3 className="text-xl font-bold">{plan.name}</h3>
                            <div className="mt-4">
                                <span className="text-3xl font-bold">${plan.price}</span>
                                <span className="text-gray-500">/month</span>
                            </div>
                            <div className="mt-4 text-gray-600">
                                <p>Chat Limit: {plan.chatLimit} messages</p>
                                <p>Document Limit: {plan.documentLimit} files</p>
                                <p>Chatbot Limit: {plan.chatbotLimit} chatbots</p>
                                <p>Team Limit: {plan.teamLimit} teams</p>
                                <p>Member Limit: {plan.memberLimit} members</p>
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
                            <div className="flex justify-between mt-4 gap-4 w-full">
                                <button
                                    className="mt-4 w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                                    onClick={() => handleEditPlan(plan)}
                                >
                                    Edit Plan
                                </button>
                                <button
                                    className="mt-4 w-full bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                                    onClick={() => handleDeletePlan(plan.id)}
                                >
                                    Delete Plan
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Edit/Create Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg w-96">
                        <h3 className="text-xl font-bold mb-4">
                            {isCreating ? 'Create New Plan' : 'Edit Plan'}
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Name</label>
                                <input
                                    type="text"
                                    value={editingPlan.name}
                                    onChange={(e) => setEditingPlan({ ...editingPlan, name: e.target.value })}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Price</label>
                                <input
                                    type="number"
                                    value={editingPlan.price}
                                    onChange={(e) => setEditingPlan({ ...editingPlan, price: parseFloat(e.target.value) })}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Chat Limit</label>
                                <input
                                    type="number"
                                    value={editingPlan.chatLimit}
                                    onChange={(e) => setEditingPlan({ ...editingPlan, chatLimit: parseInt(e.target.value) })}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Document Limit</label>
                                <input
                                    type="number"
                                    value={editingPlan.documentLimit}
                                    onChange={(e) => setEditingPlan({ ...editingPlan, documentLimit: parseInt(e.target.value) })}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Chatbot Limit</label>
                                <input
                                    type="number"
                                    value={editingPlan.chatbotLimit}
                                    onChange={(e) => setEditingPlan({ ...editingPlan, chatbotLimit: parseInt(e.target.value) })}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Team Limit</label>
                                <input
                                    type="number"
                                    value={editingPlan.teamLimit}
                                    onChange={(e) => setEditingPlan({ ...editingPlan, teamLimit: parseInt(e.target.value) })}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Member Limit</label>
                                <input
                                    type="number"
                                    value={editingPlan.memberLimit}
                                    onChange={(e) => setEditingPlan({ ...editingPlan, memberLimit: parseInt(e.target.value) })}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Features</label>
                                {editingPlan.features.map((feature, index) => (
                                    <div key={index} className="flex items-center space-x-2">
                                        <input
                                            type="text"
                                            value={feature}
                                            onChange={(e) => {
                                                const newFeatures = [...editingPlan.features];
                                                newFeatures[index] = e.target.value;
                                                setEditingPlan({ ...editingPlan, features: newFeatures });
                                            }}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => {
                                                const newFeatures = editingPlan.features.filter((_, i) => i !== index);
                                                setEditingPlan({ ...editingPlan, features: newFeatures });
                                            }}
                                            className="text-red-500"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                ))}
                                <button
                                    type="button"
                                    onClick={() => {
                                        setEditingPlan({
                                            ...editingPlan,
                                            features: [...editingPlan.features, '']
                                        });
                                    }}
                                    className="mt-2 text-blue-500"
                                >
                                    Add Feature
                                </button>
                            </div>
                            <div className="flex justify-end space-x-2 mt-4">
                                <button
                                    onClick={() => {
                                        setIsModalOpen(false);
                                        setIsCreating(false);
                                        setEditingPlan(null);
                                    }}
                                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSavePlan}
                                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                                >
                                    {isCreating ? 'Create Plan' : 'Save Changes'}
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