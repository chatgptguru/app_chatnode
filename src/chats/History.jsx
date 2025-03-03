import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setTopicId } from '../store/reducers/chatReducer';
const History = () => {
    const dispatch = useDispatch()
    const [histories, setHistories] = useState([
    ]);
    const [sortBy, setSortBy] = useState('Newest');
    const [filterByType, setFilterByType] = useState('All');
    const [filterByStatus, setFilterByStatus] = useState('All');
    const filteredHistories = histories
        .filter(history => filterByType === 'All' || history.type === filterByType)
        .filter(history => filterByStatus === 'All' || history.status === filterByStatus)
        .sort((a, b) => sortBy === 'Newest' ? b.id - a.id : a.id - b.id);
    const getTopics = async () => {
        const user_id = await localStorage.getItem('user_id')
        const data = {
            user_id
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
                    <div key={history.id} className='p-3 transition-colors rounded-lg hover:bg-gray-50 cursor-pointer' onClick={() => {
                        dispatch(setTopicId(history.id))
                    }}>
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
                ))}
            </div>

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