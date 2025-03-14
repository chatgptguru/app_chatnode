import React, { useState, useEffect } from 'react';
import {
    FiUsers, FiMessageSquare, FiDollarSign,
    FiTrendingUp, FiClock, FiActivity
} from 'react-icons/fi';
import axios from 'axios';
import { toast } from 'react-toastify';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    BarChart, Bar, PieChart, Pie, Cell
} from 'recharts';

const Dashboard = () => {
    const [timeRange, setTimeRange] = useState('7d');
    const [isLoading, setIsLoading] = useState(true);
    const [stats, setStats] = useState([]);
    const [lineChartData, setLineChartData] = useState([]);
    const [pieChartData, setPieChartData] = useState([]);
    const [recentActivities, setRecentActivities] = useState([]);

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

    useEffect(() => {
        fetchDashboardData();
    }, [timeRange]);

    const fetchDashboardData = async () => {
        try {
            setIsLoading(true);
            const token = await localStorage.getItem('token');
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/admin/dashboard`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                params: {
                    timeRange
                }
            });

            const { stats, userGrowth, subscriptionDistribution, activities } = response.data;

            setStats(stats);
            setLineChartData(userGrowth);
            setPieChartData(subscriptionDistribution);
            setRecentActivities(activities);
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
            toast.error('Failed to fetch dashboard data');
        } finally {
            setIsLoading(false);
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
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Dashboard Overview</h2>
                <div className="flex space-x-2">
                    <select
                        className="border rounded-lg px-3 py-2"
                        value={timeRange}
                        onChange={(e) => setTimeRange(e.target.value)}
                    >
                        <option value="7d">Last 7 days</option>
                        <option value="30d">Last 30 days</option>
                        <option value="90d">Last 90 days</option>
                    </select>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {stats.map((stat, index) => (
                    <div key={index} className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center justify-between">
                            <div className="p-3 bg-blue-100 rounded-full text-blue-600">
                                {stat.icon === 'users' && <FiUsers />}
                                {stat.icon === 'messages' && <FiMessageSquare />}
                                {stat.icon === 'revenue' && <FiDollarSign />}
                            </div>
                            <span className={`text-sm font-semibold ${stat.changeType === 'positive' ? 'text-green-500' : 'text-red-500'
                                }`}>
                                {stat.change}
                            </span>
                        </div>
                        <div className="mt-4">
                            <p className="text-gray-500">{stat.label}</p>
                            <p className="text-2xl font-bold">{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Activity */}
                <div className="bg-white rounded-lg shadow">
                    <div className="p-6">
                        <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
                        <div className="space-y-4">
                            {recentActivities.map((activity) => (
                                <div key={activity.id} className="flex items-center justify-between border-b pb-4">
                                    <div className="flex items-center space-x-3">
                                        <div className="p-2 bg-gray-100 rounded-full">
                                            <FiClock className="text-gray-600" />
                                        </div>
                                        <div>
                                            <p className="font-medium">{activity.user}</p>
                                            <p className="text-sm text-gray-500">{activity.action}</p>
                                        </div>
                                    </div>
                                    <span className="text-sm text-gray-500">{activity.time}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                {/* User Growth Chart
                <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-lg font-semibold mb-4">User Growth</h3>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={lineChartData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Line type="monotone" dataKey="users" stroke="#0088FE" />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div> */}

                {/* Subscription Distribution */}
                <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-lg font-semibold mb-4">Subscription Distribution</h3>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={pieChartData}
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {pieChartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>


        </div>
    );
};

export default Dashboard;