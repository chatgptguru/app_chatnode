import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { 
  FiUsers, 
  FiMessageSquare, 
  FiClock 
} from 'react-icons/fi';

const Analytics = () => {
  const [analyticsData, setAnalyticsData] = useState({
    totalUsers: 0,
    totalChats: 0,
    usageStats: []
  });
  const [timeRange, setTimeRange] = useState('3m');

  useEffect(() => {
    // TODO: Fetch analytics data from your backend based on timeRange
    // This is example data - replace with actual API call
    const getData = () => {
      const now = new Date();
      const data = {
        totalUsers: 150,
        totalChats: 1200,
        usageStats: []
      };

      // Generate sample data based on selected range
      let months = timeRange === '1y' ? 12 : timeRange === '6m' ? 6 : 3;
      for (let i = 0; i < months; i++) {
        const date = new Date(now.getFullYear(), now.getMonth() - i);
        data.usageStats.unshift({
          date: date.toISOString().slice(0, 7),
          users: Math.floor(Math.random() * 100) + 100,
          chats: Math.floor(Math.random() * 500) + 700,
        });
      }

      setAnalyticsData(data);
    };

    getData();
  }, [timeRange]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
        <div className="inline-flex rounded-lg shadow">
          <button
            onClick={() => setTimeRange('3m')}
            className={`px-4 py-2 text-sm font-medium rounded-l-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:z-10 transition-colors
              ${timeRange === '3m' 
                ? 'bg-indigo-600 text-white hover:bg-indigo-700' 
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'}`}
          >
            3 Months
          </button>
          <button
            onClick={() => setTimeRange('6m')}
            className={`px-4 py-2 text-sm font-medium -ml-px focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:z-10 transition-colors
              ${timeRange === '6m' 
                ? 'bg-indigo-600 text-white hover:bg-indigo-700' 
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'}`}
          >
            6 Months
          </button>
          <button
            onClick={() => setTimeRange('1y')}
            className={`px-4 py-2 text-sm font-medium rounded-r-lg -ml-px focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:z-10 transition-colors
              ${timeRange === '1y' 
                ? 'bg-indigo-600 text-white hover:bg-indigo-700' 
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'}`}
          >
            1 Year
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <FiUsers className="h-8 w-8 text-blue-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Users</p>
              <p className="mt-1 text-3xl font-semibold text-gray-900">
                {analyticsData.totalUsers}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <FiMessageSquare className="h-8 w-8 text-green-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Chats</p>
              <p className="mt-1 text-3xl font-semibold text-gray-900">
                {analyticsData.totalChats}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Usage Statistics</h2>
        <div className="w-full overflow-x-auto">
          <LineChart
            width={800}
            height={400}
            data={analyticsData.usageStats}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="users" stroke="#3B82F6" />
            <Line type="monotone" dataKey="chats" stroke="#10B981" />
          </LineChart>
        </div>
      </div>
    </div>
  );
};

export default Analytics; 