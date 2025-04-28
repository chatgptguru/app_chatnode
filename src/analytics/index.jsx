import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Analytics = () => {
    const [dateRange, setDateRange] = useState('7d'); // 7d, 30d, 90d
    const [analyticsData, setAnalyticsData] = useState({
        messages: 0,
        chats: 0,
        likes: { count: 0, percentage: '0%' },
        dislikes: { count: 0, percentage: '0%' },
        transferred: { count: 0, percentage: '0%' },
        chartData: []
    });

    // Function to generate sample data - replace with actual API call
    const fetchAnalyticsData = async (range) => {
        // This is sample data - replace with actual API integration
        const now = new Date();
        const data = {
            messages: 0,
            chats: 0,
            likes: { count: 0, percentage: '0%' },
            dislikes: { count: 0, percentage: '0%' },
            transferred: { count: 0, percentage: '0%' },
            chartData: []
        };

        // Generate sample chart data
        const days = range === '7d' ? 7 : range === '30d' ? 30 : 90;
        for (let i = 0; i < days; i++) {
            const date = new Date(now);
            date.setDate(date.getDate() - i);
            data.chartData.unshift({
                date: date.toLocaleDateString(),
                messages: 0,
            });
        }

        setAnalyticsData(data);
    };

    useEffect(() => {
        fetchAnalyticsData(dateRange);
    }, [dateRange]);

    return (
        <div className="p-6 max-w-7xl mx-auto">
            {/* Date Range Selector */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
                <div className="inline-flex rounded-md shadow-sm">
                    <button
                        onClick={() => setDateRange('7d')}
                        className={`px-4 py-2 text-sm font-medium rounded-l-lg ${
                            dateRange === '7d'
                                ? 'bg-blue-600 text-white'
                                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                        }`}
                    >
                        Last 7 Days
                    </button>
                    <button
                        onClick={() => setDateRange('30d')}
                        className={`px-4 py-2 text-sm font-medium border-t border-b ${
                            dateRange === '30d'
                                ? 'bg-blue-600 text-white'
                                : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-300'
                        }`}
                    >
                        Last 30 Days
                    </button>
                    <button
                        onClick={() => setDateRange('90d')}
                        className={`px-4 py-2 text-sm font-medium rounded-r-lg ${
                            dateRange === '90d'
                                ? 'bg-blue-600 text-white'
                                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                        }`}
                    >
                        Last 90 Days
                    </button>
                </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
                {/* Messages */}
                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-sm font-medium text-gray-500">Messages</h3>
                    <p className="mt-2 text-3xl font-semibold text-gray-900">{analyticsData.messages}</p>
                    <p className="text-xs text-gray-500 mt-1">per Chat Avg</p>
                </div>

                {/* Chats */}
                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-sm font-medium text-gray-500">Chats</h3>
                    <p className="mt-2 text-3xl font-semibold text-gray-900">{analyticsData.chats}</p>
                </div>

                {/* Likes */}
                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-sm font-medium text-gray-500">Likes</h3>
                    <p className="mt-2 text-3xl font-semibold text-gray-900">{analyticsData.likes.count}</p>
                    <p className="text-xs text-gray-500 mt-1">{analyticsData.likes.percentage}</p>
                </div>

                {/* Dislikes */}
                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-sm font-medium text-gray-500">Dislikes</h3>
                    <p className="mt-2 text-3xl font-semibold text-gray-900">{analyticsData.dislikes.count}</p>
                    <p className="text-xs text-gray-500 mt-1">{analyticsData.dislikes.percentage}</p>
                </div>

                {/* Transferred to Live Agent */}
                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-sm font-medium text-gray-500">Transferred to Live Agent</h3>
                    <p className="mt-2 text-3xl font-semibold text-gray-900">{analyticsData.transferred.count}</p>
                    <p className="text-xs text-gray-500 mt-1">{analyticsData.transferred.percentage}</p>
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
