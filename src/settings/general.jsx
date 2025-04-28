import { FiUser, FiShare2, FiCopy, FiMessageSquare, FiClock, FiRefreshCw, FiTrash2 } from 'react-icons/fi';
import { IoLockClosed, IoGlobeOutline } from 'react-icons/io5';
import { useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { setBot } from '../store/reducers/layoutReducer';
import { useDispatch } from 'react-redux';
const General = () => {
    const dispatch = useDispatch();
    const bot = useSelector((state) => state.layout.bot);
    const [hasChanges, setHasChanges] = useState(false);
    const [formData, setFormData] = useState({
        name: bot?.name,
        public: bot?.public,
        messageLimit: false,
        rateLimit: false
    });
    useEffect(() => {
        setFormData({
            name: bot?.name,
            public: bot?.public,
            messageLimit: bot?.messageLimit
        });
    }, [bot]);
    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
        setHasChanges(true);
    };

    const handleDiscard = () => {
        setFormData({
            name: bot?.name,
            public: bot?.public,
            messageLimit: false,
        });
        setHasChanges(false);
    };

    const handleSave = async () => {
        try {
            const response = await axios.put(`${import.meta.env.VITE_API_URL}/api/bots/${bot?.id}`, {
                name: formData.name,
                public: formData.public,
                messageLimit: formData.messageLimit,
            });

            if (response.status === 200) {
                setHasChanges(false);
                // Optionally update the global state/redux store with the new bot data
                dispatch(setBot(response.data.bot));
            }
        } catch (error) {
            console.error('Error updating bot:', error);
            // Handle error (show error message to user)
            alert('Failed to update bot settings. Please try again.');
        }
    };

    return (
        <>
            <div className="max-w-4xl mx-auto p-6 space-y-8 mb-20">
                {/* Bot Name Section */}
                <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center gap-2 mb-3">
                        <FiUser className="text-gray-600 w-5 h-5" />
                        <h2 className="text-lg font-semibold text-gray-800">Bot Name</h2>
                    </div>
                    <input 
                        type="text"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                    />
                </div>

                {/* Sharing & Bot ID Section */}
                <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 space-y-6">
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <FiShare2 className="text-gray-600 w-5 h-5" />
                            <h2 className="text-lg font-semibold text-gray-800">Sharing</h2>
                        </div>
                        <div className="flex items-center gap-6">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input 
                                    type="radio" 
                                    name="sharing" 
                                    className="w-4 h-4 text-blue-600" 
                                    checked={!formData.public}
                                    onChange={() => handleInputChange('public', false)}
                                />
                                <span className="flex items-center gap-1">
                                    <IoLockClosed className="text-gray-600 w-4 h-4" />
                                    Private
                                </span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input 
                                    type="radio" 
                                    name="sharing" 
                                    className="w-4 h-4 text-blue-600" 
                                    checked={formData.public}
                                    onChange={() => handleInputChange('public', true)}
                                />
                                <span className="flex items-center gap-1">
                                    <IoGlobeOutline className="text-gray-600 w-4 h-4" />
                                    Public
                                </span>
                            </label>
                        </div>
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold text-gray-800 mb-3">Bot ID</h2>
                        <div className="flex gap-2">
                            <input 
                                type="text" 
                                className="flex-1 px-4 py-2 border border-gray-200 rounded-md bg-gray-50" 
                                readOnly
                                value={bot?.id}
                            />
                            <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md transition">
                                <FiCopy className="w-4 h-4" />
                                Copy
                            </button>
                        </div>
                    </div>
                </div>

                {/* Message Limit Section */}
                <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center gap-2 mb-2">
                        <FiMessageSquare className="text-gray-600 w-5 h-5" />
                        <h2 className="text-lg font-semibold text-gray-800">Enable Monthly Message Limit</h2>
                    </div>
                    <p className="text-gray-600 mb-4">Limit the number of messages this bot can send within each usage period</p>
                    <div className="flex items-center gap-6">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input 
                                type="radio" 
                                name="messageLimit" 
                                className="w-4 h-4 text-blue-600"
                                checked={!formData.messageLimit}
                                onChange={() => handleInputChange('messageLimit', false)}
                            />
                            <span>Off</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input 
                                type="radio" 
                                name="messageLimit" 
                                className="w-4 h-4 text-blue-600"
                                checked={formData.messageLimit}
                                onChange={() => handleInputChange('messageLimit', true)}
                            />
                            <span>On</span>
                        </label>
                    </div>
                </div>

                {/* Auto Retrain Section */}
                <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
                    <div className="flex justify-between items-start">
                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <FiRefreshCw className="text-gray-600 w-5 h-5" />
                                <h2 className="text-lg font-semibold text-gray-800">Auto Retrain</h2>
                            </div>
                            <p className="text-gray-600">Keep your chatbot up-to-date automatically. No manual updates needed.</p>
                            <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">
                                Upgrade
                            </button>
                        </div>
                        <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center">
                            <img src="" alt="" className="w-16 h-16" />
                        </div>
                    </div>
                </div>

                {/* Delete Section */}
                <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center gap-2 mb-4">
                        <FiTrash2 className="text-red-600 w-5 h-5" />
                        <h2 className="text-lg font-semibold text-red-600">Delete Chatbot</h2>
                    </div>
                    <button className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition flex items-center gap-2">
                        <FiTrash2 className="w-4 h-4" />
                        Delete Permanently
                    </button>
                </div>

                {/* Fixed Button Bar */}
                {hasChanges && (
                    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
                        <div className="max-w-4xl mx-auto flex justify-end gap-4">
                            <button
                                onClick={handleDiscard}
                                className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition"
                            >
                                Discard
                            </button>
                            <button
                                onClick={handleSave}
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                            >
                                Save Changes
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}

export default General;

