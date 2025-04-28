import { useState, useEffect } from 'react';
import { FiMoreHorizontal, FiLock, FiCheck, FiChevronDown, FiMessageSquare, FiDatabase, FiSettings, FiShare2, FiBarChart2, FiTrash2, FiPlus, FiX } from 'react-icons/fi';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { setBotId, setBot } from '../store/reducers/layoutReducer';

const Bots = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [bots, setBots] = useState([]);
    const [activeDropdown, setActiveDropdown] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [botToDelete, setBotToDelete] = useState(null);
    const [newBotName, setNewBotName] = useState('');

    const fetchBots = async () => {
        const token = await localStorage.getItem('token');
        const userId = await localStorage.getItem('user_id');

        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/bots?user_id=${userId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });

        if (response.data) {
            setBots(response.data);
        }
    };
    useEffect(() => {
        fetchBots();
    }, []);


    const handleDropdownClick = (index) => {
        setActiveDropdown(activeDropdown === index ? null : index);
    };

    const dropdownOptions = [
        { icon: <FiMessageSquare />, label: 'Chats' },
        { icon: <FiDatabase />, label: 'Data' },
        { icon: <FiSettings />, label: 'Settings' },
        { icon: <FiShare2 />, label: 'Share' },
        { icon: <FiBarChart2 />, label: 'Analytics' },
        { icon: <FiTrash2 />, label: 'Delete' },
    ];

    const handleCreateBot = () => {
        setIsModalOpen(true);
    };

    const handleSave = async () => {
        if (newBotName.trim()) {
            try {
                const token = await localStorage.getItem('token');
                const userId = await localStorage.getItem('user_id');

                const response = await axios.post(
                    `${import.meta.env.VITE_API_URL}/api/bots`,
                    {
                        name: newBotName,
                        user_id: userId
                    },
                    {
                        headers: {
                            'Content-Type': 'application/json',
                        }
                    }
                );

                if (response.data) {
                    toast.success('Bot created successfully');
                    setIsModalOpen(false);
                    setNewBotName('');
                    fetchBots();
                }
            } catch (error) {
                console.error('Error creating bot:', error);
                toast.error(error.response?.data?.message || 'Failed to create bot');
            }
        }
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        setNewBotName('');
    };

    const handleDeleteBot = async (bot) => {
        setBotToDelete(bot);
        setIsDeleteModalOpen(true);
        setActiveDropdown(null);
    };

    const confirmDelete = async () => {
        try {
            const response = await axios.delete(`${import.meta.env.VITE_API_URL}/api/bots/${botToDelete.id}`);

            if (response.data) {
                toast.success('Bot deleted successfully');
                fetchBots();
                setIsDeleteModalOpen(false);
                setBotToDelete(null);
            }
        } catch (error) {
            console.error('Error deleting bot:', error);
            toast.error(error.response?.data?.message || 'Failed to delete bot');
        }
    };

    const cancelDelete = () => {
        setIsDeleteModalOpen(false);
        setBotToDelete(null);
    };

    const handleDropdownOptionClick = (bot, option) => {
        dispatch(setBotId(bot.id));
        dispatch(setBot(bot));
        if (option.label === 'Chats') {
            navigate(`/bot/${bot.id}/chats`);
        } else if (option.label === 'Data') {
            navigate(`/bot/${bot.id}/data`);
        } else if (option.label === 'Settings') {
            navigate(`/bot/${bot.id}/settings`);
        } else if (option.label === 'Share') {
            navigate(`/bot/${bot.id}/share`);
        } else if (option.label === 'Analytics') {
            navigate(`/bot/${bot.id}/analytics`);
        } else if (option.label === 'Delete') {
            handleDeleteBot(bot);
        }
    };

    return (
        <>
            <div className="flex w-[90%] mx-[5%]">
                {/* Main Content */}
                <div className="flex-1 p-8">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-semibold">Chatbots</h1>
                        <button
                            onClick={handleCreateBot}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            <FiPlus /> Create Bot
                        </button>
                    </div>

                    {bots.length > 0 ? (
                        /* Bots Table */
                        <div className="bg-white rounded-lg shadow">
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Name
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Created
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Messages Sent (Current Month)
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Model
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Public
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {bots.map((bot, index) => (
                                        <tr key={index}>
                                            <td className="px-6 py-4 whitespace-nowrap  cursor-pointer" onClick={() => {
                                                dispatch(setBotId(bot.id));
                                                dispatch(setBot(bot));
                                                navigate(`/bot/${bot.id}/chats`)
                                            }}>
                                                <span className="text-blue-600 font-medium">{bot.name}</span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {format(new Date(bot.created_at), 'MMM d, yyyy')}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {bot.messagesSent}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {bot.model ? bot.model : 'GPT-4o-mini'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                {bot.public ? <FiLock className="text-gray-400" /> : <FiCheck className="text-green-500" />}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                <div className="relative">
                                                    <button
                                                        className="text-gray-400 hover:text-gray-600"
                                                        onClick={() => handleDropdownClick(index)}
                                                    >
                                                        <FiMoreHorizontal />
                                                    </button>
                                                    {activeDropdown === index && (
                                                        <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                                                            <div className="py-1" role="menu">
                                                                {dropdownOptions.map((option, optionIndex) => (
                                                                    <button
                                                                        key={optionIndex}
                                                                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                                        role="menuitem"
                                                                        onClick={() => handleDropdownOptionClick(bot, option)}
                                                                    >
                                                                        <span className="mr-3 text-gray-400">
                                                                            {option.icon}
                                                                        </span>
                                                                        {option.label}
                                                                    </button>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="text-center py-16 bg-white rounded-lg shadow">
                            <div className="mb-4">
                                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <FiMessageSquare className="w-8 h-8 text-blue-600" />
                                </div>
                                <h2 className="text-xl font-semibold mb-2">No Chatbots Yet</h2>
                                <p className="text-gray-500 mb-6">Create your first chatbot to get started</p>
                                <button
                                    onClick={() => handleCreateBot()}
                                    className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors mx-auto"
                                >
                                    <FiPlus /> Create Your First Bot
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Sidebar */}
                <div className="w-80 border bg-white p-6 mt-10">
                    <div className="mb-8">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-semibold flex items-center gap-2">
                                Getting Started
                                <FiChevronDown />
                            </h2>
                            <span className="text-sm text-blue-600">5 Credits Earned</span>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center gap-2 text-sm">
                                <FiCheck className="text-green-500" />
                                <span>Create a bot</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <div className="flex items-center gap-2">
                                    <FiCheck className="text-green-500" />
                                    <span>Add Data/Integrations</span>
                                </div>
                                <span className="bg-gray-100 px-2 py-1 rounded">5 ⭐</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <div className="flex items-center gap-2">
                                    <span className="w-4 h-4 rounded-full border-2 border-gray-300"></span>
                                    <span>Prompt Improved</span>
                                </div>
                                <span className="bg-gray-100 px-2 py-1 rounded">5 ⭐</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <div className="flex items-center gap-2">
                                    <span className="w-4 h-4 rounded-full border-2 border-gray-300"></span>
                                    <span>Customize</span>
                                </div>
                                <span className="bg-gray-100 px-2 py-1 rounded">5 ⭐</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <div className="flex items-center gap-2">
                                    <span className="w-4 h-4 rounded-full border-2 border-gray-300"></span>
                                    <span>Publish</span>
                                </div>
                                <span className="bg-gray-100 px-2 py-1 rounded">10 ⭐</span>
                            </div>
                        </div>
                    </div>

                    <div className="mb-8">
                        <h3 className="font-semibold mb-4">Credits</h3>
                        <div className="bg-gray-100 rounded-full h-2 mb-2">
                            <div className="bg-blue-600 h-full rounded-full" style={{ width: '0%' }}></div>
                        </div>
                        <div className="flex justify-between text-sm text-gray-600">
                            <span>0/40</span>
                            <span>35:55</span>
                        </div>
                    </div>

                    <div className="mb-8">
                        <div className="flex justify-between text-sm mb-4">
                            <div>
                                <div>Apr 15</div>
                                <div className="text-gray-500">Bots 1/1</div>
                            </div>
                            <div className="text-right">
                                <div>May 15</div>
                                <div className="text-gray-500">Users 1/1</div>
                            </div>
                        </div>
                        <button className="w-full py-2 text-center border rounded-lg text-sm">
                            Subscription
                        </button>
                    </div>
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-[400px] shadow-xl">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold">Create New Bot</h2>
                            <button
                                onClick={handleCancel}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <FiX className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="mb-6">
                            <label htmlFor="botName" className="block text-sm font-medium text-gray-700 mb-2">
                                Bot Name
                            </label>
                            <input
                                type="text"
                                id="botName"
                                value={newBotName}
                                onChange={(e) => setNewBotName(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Enter bot name"
                                autoFocus
                            />
                        </div>

                        <div className="flex justify-end gap-3">
                            <button
                                onClick={handleCancel}
                                className="px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={!newBotName.trim()}
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {isDeleteModalOpen && botToDelete && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-[400px] shadow-xl">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold">Delete Bot</h2>
                            <button
                                onClick={cancelDelete}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <FiX className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="mb-6">
                            <p className="text-gray-600">
                                Are you sure you want to delete the bot "{botToDelete.name}"? This action cannot be undone.
                            </p>
                        </div>

                        <div className="flex justify-end gap-3">
                            <button
                                onClick={cancelDelete}
                                className="px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmDelete}
                                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Bots;