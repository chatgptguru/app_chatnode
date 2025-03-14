import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const ModelsManagement = () => {
    const [localModels, setLocalModels] = useState([]);
    const [openAIConfig, setOpenAIConfig] = useState({
        apiKey: '',
        model: 'gpt-4',
        maxTokens: 2000,
        useOpenAI: true,
    });
    const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
    const [selectedModel, setSelectedModel] = useState(null);
    const [newModelName, setNewModelName] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Fetch models when component mounts
    useEffect(() => {
        fetchModels();
        fetchOpenAIConfig();
    }, []);

    const fetchModels = async () => {
        try {
            setIsLoading(true);
            const token = await localStorage.getItem('token');
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/admin/models`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                }
            });
            setLocalModels(response.data.models);
        } catch (error) {
            console.error('Error fetching models:', error);
            toast.error('Failed to fetch models');
        } finally {
            setIsLoading(false);
        }
    };

    const fetchOpenAIConfig = async () => {
        try {
            const token = await localStorage.getItem('token');
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/admin/openai-config`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                }
            });
            console.log(response.data.config);
            setOpenAIConfig(response.data.config);
        } catch (error) {
            console.error('Error fetching OpenAI config:', error);
            toast.error('Failed to fetch OpenAI configuration');
        }
    };

    const handleAddModel = async () => {
        if (newModelName.trim()) {
            try {
                const token = await localStorage.getItem('token');
                const response = await axios.post(
                    `${import.meta.env.VITE_API_URL}/api/admin/models`,
                    { name: newModelName },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'application/json',
                        }
                    }
                );
                setLocalModels([...localModels, response.data.model]);
                setNewModelName('');
                toast.success('Model added successfully');
            } catch (error) {
                console.error('Error adding model:', error);
                toast.error('Failed to add model');
            }
        }
    };

    const handleDeleteModel = async (modelId) => {
        try {
            const token = await localStorage.getItem('token');
            await axios.delete(
                `${import.meta.env.VITE_API_URL}/api/admin/models/${modelId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    }
                }
            );
            setLocalModels(localModels.filter(model => model.id !== modelId));
            toast.success('Model deleted successfully');
        } catch (error) {
            console.error('Error deleting model:', error);
            toast.error('Failed to delete model');
        }
    };

    const handleConfigureModel = (model) => {
        setSelectedModel(model);
        setIsConfigModalOpen(true);
    };

    const handleToggleModelStatus = async (model) => {
        try {
            const token = await localStorage.getItem('token');
            // If trying to activate a local model while OpenAI is enabled
            if (openAIConfig.useOpenAI && model.status === 'inactive') {
                toast.error("Cannot enable local model while OpenAI is enabled");
                return;
            }

            // If activating a model, first disable all other local models
            if (model.status === 'inactive') {
                // Disable all other active models
                const updatePromises = localModels
                    .filter(m => m.status === 'active')
                    .map(m =>
                        axios.patch(
                            `${import.meta.env.VITE_API_URL}/api/admin/models/${m.id}/status`,
                            { status: 'inactive' },
                            {
                                headers: {
                                    Authorization: `Bearer ${token}`,
                                    'Content-Type': 'application/json',
                                }
                            }
                        )
                    );
                await Promise.all(updatePromises);
            }

            const newStatus = model.status === 'active' ? 'inactive' : 'active';
            await axios.patch(
                `${import.meta.env.VITE_API_URL}/api/admin/models/${model.id}/status`,
                { status: newStatus },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    }
                }
            );

            // Update local state to reflect all changes
            setLocalModels(localModels.map(m =>
                m.id === model.id
                    ? { ...m, status: newStatus }
                    : newStatus === 'active'
                        ? { ...m, status: 'inactive' }
                        : m
            ));

            toast.success('Model status updated successfully');
        } catch (error) {
            console.error('Error updating model status:', error);
            toast.error('Failed to update model status');
        }
    };

    const handleOpenAIToggle = async (checked) => {
        try {
            // If enabling OpenAI, disable all local models
            if (checked) {
                const token = await localStorage.getItem('token');

                // Disable all active local models in the backend
                const updatePromises = localModels
                    .filter(m => m.status === 'active')
                    .map(m =>
                        axios.patch(
                            `${import.meta.env.VITE_API_URL}/api/admin/models/${m.id}/status`,
                            { status: 'inactive' },
                            {
                                headers: {
                                    Authorization: `Bearer ${token}`,
                                    'Content-Type': 'application/json',
                                }
                            }
                        )
                    );
                await Promise.all(updatePromises);

                // Update local state
                setLocalModels(localModels.map(model => ({
                    ...model,
                    status: 'inactive'
                })));
            }

            // Update OpenAI configuration
            setOpenAIConfig({ ...openAIConfig, useOpenAI: checked });
            toast.success(`Successfully ${checked ? 'enabled' : 'disabled'} OpenAI`);
        } catch (error) {
            console.error('Error toggling OpenAI:', error);
            toast.error('Failed to toggle OpenAI status');
            // Revert the OpenAI toggle if there's an error
            setOpenAIConfig({ ...openAIConfig, useOpenAI: !checked });
        }
    };

    const handleSaveOpenAIConfig = async (e) => {
        e.preventDefault();
        try {
            const token = await localStorage.getItem('token');
            await axios.post(
                `${import.meta.env.VITE_API_URL}/api/admin/openai-config`,
                openAIConfig,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    }
                }
            );
            toast.success('OpenAI configuration saved successfully');
        } catch (error) {
            console.error('Error saving OpenAI config:', error);
            toast.error('Failed to save OpenAI configuration');
        }
    };

    return (
        <div>
            <h2 className="text-2xl font-bold mb-6">Models Management</h2>

            <div className="grid grid-cols-1 gap-6">
                {/* OpenAI Configuration */}
                <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-lg font-semibold mb-4">OpenAI Configuration</h3>
                    <form onSubmit={handleSaveOpenAIConfig} className="space-y-4">
                        <div className="flex items-center space-x-2 mb-4">
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="sr-only peer"
                                    checked={openAIConfig.useOpenAI}
                                    onChange={(e) => handleOpenAIToggle(e.target.checked)}
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                            <span className="text-sm font-medium">
                                {openAIConfig.useOpenAI ? 'Using OpenAI' : 'Using Local Model'}
                            </span>
                        </div>

                        {openAIConfig.useOpenAI && (
                            <div>
                                <label className="block text-sm font-medium mb-1">Model</label>
                                <select
                                    className="w-full p-2 border rounded"
                                    value={openAIConfig.model}
                                    onChange={(e) => setOpenAIConfig({ ...openAIConfig, model: e.target.value })}
                                >
                                    <option value="gpt-4">GPT-4</option>
                                    <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                                </select>
                            </div>
                        )}
                        <button
                            type="submit"
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                        >
                            Save Configuration
                        </button>
                    </form>
                </div>
            </div>
            {/* Local Models */}
            <div className="bg-white rounded-lg shadow p-6">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">Local Models</h3>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            placeholder="New model name"
                            className="border rounded px-3 py-1"
                            value={newModelName}
                            onChange={(e) => setNewModelName(e.target.value)}
                        />
                        <button
                            onClick={handleAddModel}
                            disabled={isLoading}
                            className="bg-green-500 text-white px-4 py-1 rounded hover:bg-green-600 disabled:bg-gray-400"
                        >
                            {isLoading ? 'Adding...' : 'Add Model'}
                        </button>
                    </div>
                </div>
                {isLoading ? (
                    <div className="text-center py-4">Loading models...</div>
                ) : (
                    <table className="w-full">
                        <thead>
                            <tr className="border-b">
                                <th className="text-left py-3">Model Name</th>
                                <th className="text-left py-3">Status</th>
                                <th className="text-left py-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {localModels.map((model) => (
                                <tr key={model.id} className="border-b">
                                    <td className="py-3">{model.name}</td>
                                    <td className="py-3">
                                        <span className={`px-2 py-1 rounded ${model.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                            }`}>
                                            {model.status}
                                        </span>
                                    </td>
                                    <td className="py-3 space-x-2">
                                        <button
                                            onClick={() => handleToggleModelStatus(model)}
                                            className={`px-3 py-1 rounded text-white ${model.status === 'active'
                                                    ? 'bg-red-500 hover:bg-red-600'
                                                    : 'bg-green-500 hover:bg-green-600'
                                                }`}
                                            disabled={openAIConfig.useOpenAI && model.status === 'inactive'}
                                        >
                                            {model.status === 'active' ? 'Disable' : 'Enable'}
                                        </button>
                                        <button
                                            onClick={() => handleDeleteModel(model.id)}
                                            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>



            {/* Configuration Modal */}
            {isConfigModalOpen && selectedModel && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white rounded-lg p-6 w-96">
                        <h3 className="text-lg font-semibold mb-4">Configure Model: {selectedModel.name}</h3>
                        <div className="space-y-4">
                            <div className="flex justify-end space-x-2">
                                <button
                                    onClick={() => setIsConfigModalOpen(false)}
                                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ModelsManagement;