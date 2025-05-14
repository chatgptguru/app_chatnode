import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import axios from 'axios';
import { useParams } from 'react-router-dom';
const Analytics = () => {
    const { botId } = useParams();
    const [dateRange, setDateRange] = useState('7d'); // 7d, 30d, 90d
    const [analyticsData, setAnalyticsData] = useState({
        messages: 0,
        chats: 0,
        likes: { count: 0, percentage: '0%' },
        dislikes: { count: 0, percentage: '0%' },
        transferred: { count: 0, percentage: '0%' },
        chartData: []
    });
    const [topics, setTopics] = useState([]);

    // Function to generate sample data - replace with actual API call
    const fetchAnalyticsData = async (range) => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/analytics?range=${range}&bot_id=${botId}&user_id=${localStorage.getItem('user_id')}`);
            setAnalyticsData(response.data);
        } catch (error) {
            console.error("Error fetching analytics data:", error);
        }
    };

    // Fetch topics from the backend
    const fetchTopics = async () => {
        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/topics`, {
                bot_id: botId,
                user_id: localStorage.getItem('user_id')
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            setTopics(response.data.topics);
        } catch (error) {
            console.error("Error fetching topics:", error);
        }
    };

    useEffect(() => {
        fetchAnalyticsData(dateRange);
        fetchTopics();
    }, [dateRange]);

    return (
        <div className="p-6 max-w-7xl mx-auto">
            {/* Date Range Selector */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
                <div className="inline-flex rounded-md shadow-sm">
                    <button
                        onClick={() => setDateRange('7d')}
                        className={`px-4 py-2 text-sm font-medium rounded-l-lg ${dateRange === '7d'
                            ? 'bg-blue-600 text-white'
                            : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                            }`}
                    >
                        Last 7 Days
                    </button>
                    <button
                        onClick={() => setDateRange('30d')}
                        className={`px-4 py-2 text-sm font-medium border-t border-b ${dateRange === '30d'
                            ? 'bg-blue-600 text-white'
                            : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-300'
                            }`}
                    >
                        Last 30 Days
                    </button>
                    <button
                        onClick={() => setDateRange('90d')}
                        className={`px-4 py-2 text-sm font-medium rounded-r-lg ${dateRange === '90d'
                            ? 'bg-blue-600 text-white'
                            : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                            }`}
                    >
                        Last 90 Days
                    </button>
                </div>
            </div>
            <div className='flex gap-6'>
                {/* Metrics Grid */}
                <div className="flex gap-1 w-[60%] justify-between flex-wrap">
                    {/* Messages */}
                    <div className="bg-white p-2 w-[30%] rounded-lg shadow">
                        <h3 className="text-sm font-medium text-gray-500">Messages</h3>
                        <p className="mt-2 text-3xl font-semibold text-gray-900">{analyticsData.messages}</p>
                    </div>

                    {/* Topics */}
                    <div className="bg-white p-2 w-[30%] rounded-lg shadow">
                        <h3 className="text-sm font-medium text-gray-500">Topics</h3>
                        <p className="mt-2 text-3xl font-semibold text-gray-900">{analyticsData.topics}</p>
                    </div>

                    {/* PDF Documents */}
                    <div className="bg-white p-2 w-[30%] rounded-lg shadow">
                        <h3 className="text-sm font-medium text-gray-500">PDF Documents</h3>
                        <p className="mt-2 text-3xl font-semibold text-gray-900">{analyticsData.pdfs}</p>
                    </div>

                    {/* Websites */}
                    <div className="bg-white p-2 w-[30%] rounded-lg shadow">
                        <h3 className="text-sm font-medium text-gray-500">Websites</h3>
                        <p className="mt-2 text-3xl font-semibold text-gray-900">{analyticsData.websites}</p>
                    </div>

                    {/* Texts */}
                    <div className="bg-white p-2 w-[30%] rounded-lg shadow">
                        <h3 className="text-sm font-medium text-gray-500">Texts</h3>
                        <p className="mt-2 text-3xl font-semibold text-gray-900">{analyticsData.texts}</p>
                    </div>
                </div>

                {/* Topics List */}
                <div className="bg-white p-6 rounded-lg shadow w-[40%]">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Topics</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {topics.map((topic, index) => (
                            <div key={index} className="bg-gray-100 p-4 rounded-lg shadow-sm">
                                <h4 className="text-md font-semibold text-gray-800">{topic.query}</h4>
                                <p className="text-sm text-gray-600">Date: {topic.date}</p>
                                <p className="text-sm text-gray-600">Status: {topic.status}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Messages/Chats Chart */}
            <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Messages / Chats</h3>
                <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={analyticsData.chartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line
                                type="monotone"
                                dataKey="messages"
                                stroke="#3B82F6"
                                strokeWidth={2}
                                dot={false}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default Analytics;
