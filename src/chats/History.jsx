import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setTopicId } from '../store/reducers/chatReducer';
import { useParams } from 'react-router-dom';
const History = () => {
    const dispatch = useDispatch()
    const [histories, setHistories] = useState([
    ]);
    const [sortBy, setSortBy] = useState('Newest');
    const [filterByType, setFilterByType] = useState('All');
    const [filterByStatus, setFilterByStatus] = useState('All');
    const [showModal, setShowModal] = useState(false);
    const [selectedTopicId, setSelectedTopicId] = useState(null);
    const { botId } = useParams();
    const filteredHistories = histories
        .filter(history => filterByType === 'All' || history.type === filterByType)
        .filter(history => filterByStatus === 'All' || history.status === filterByStatus)
        .sort((a, b) => sortBy === 'Newest' ? b.id - a.id : a.id - b.id);
    const getTopics = async () => {
        const user_id = await localStorage.getItem('user_id')
        const data = {
            user_id,
            bot_id: botId
        }
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/topics`, data, {
            headers: {
                'Content-Type': 'application/json',
            }
        });
        setHistories(response.data.topics)
    }
    useEffect(() => {
        getTopics()
    }, [])

    const handleDelete = async () => {
        try {
            await axios.delete(`${import.meta.env.VITE_API_URL}/api/topics/${selectedTopicId}`, {
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            getTopics();
            setShowModal(false);
        } catch (error) {
            console.error('Error deleting topic:', error);
        }
    };

    return (
        <div className='w-[350px] bg-white rounded-lg shadow-lg overflow-hidden h-fit'>
            {/* Header */}
            <div className='p-4 border-b bg-gray-50'>
                <h2 className='text-lg font-semibold text-gray-800'>History</h2>
                <p className='text-sm text-gray-500'>1/1/25 - 2/13/25</p>
            </div>

            {/* Filters */}
            <div className='p-4 space-y-4 border-b'>
                <div className='flex gap-2'>
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className='flex-1 p-2 text-sm border rounded-md'
                    >
                        <option>Newest</option>
                        <option>Oldest</option>
                    </select>
                    <select
                        value={filterByType}
                        onChange={(e) => setFilterByType(e.target.value)}
                        className='flex-1 p-2 text-sm border rounded-md'
                    >
                        <option>All</option>
                        <option>Agent</option>
                        <option>AI</option>
                    </select>
                    <select
                        value={filterByStatus}
                        onChange={(e) => setFilterByStatus(e.target.value)}
                        className='flex-1 p-2 text-sm border rounded-md'
                    >
                        <option>All</option>
                        <option>Unread</option>
                        <option>Read</option>
                    </select>
                </div>
            </div>

            {/* History List */}
            <div className='p-4 space-y-3 overflow-y-auto h-[500px]'>
                {filteredHistories.map((history) => (
                    <div key={history.id} className='p-3 transition-colors rounded-lg hover:bg-gray-50 relative'>
                        <div className='flex justify-between'>
                            <div className='cursor-pointer' onClick={() => dispatch(setTopicId(history.id))}>
                                <div className='text-sm text-gray-800'>{(new Date(history.date)).toISOString().replace('T', ' ').slice(0, 19)}</div>
                                <div className='flex items-center justify-between text-xs text-gray-500'>
                                    <span>{history.type}</span>
                                    <span
                                        className={`px-2 py-1 rounded-full ${history.status === 'Read' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'
                                            }`}
                                    >
                                        {history.status}
                                    </span>
                                </div>
                            </div>
                            <button 
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedTopicId(history.id);
                                    setShowModal(true);
                                }}
                                className="text-red-500 hover:text-red-700 px-2"
                            >
                                ×
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Confirmation Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-xl">
                        <h3 className="text-lg font-semibold mb-4">Confirm Deletion</h3>
                        <p className="mb-4">Are you sure you want to delete this history?</p>
                        <div className="flex justify-end gap-2">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setShowModal(false);
                                }}
                                className="px-4 py-2 text-gray-600 border rounded hover:bg-gray-100"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDelete}
                                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Footer */}
            <div className='p-4 border-t bg-gray-50'>
                <button className='w-full px-4 py-2 text-white transition-colors bg-blue-500 rounded-md hover:bg-blue-600'>
                    Export
                </button>
            </div>
        </div>
    );
};

export default History;