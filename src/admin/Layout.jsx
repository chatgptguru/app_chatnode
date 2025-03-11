import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import {
    FiUsers, FiBox, FiDollarSign, FiHome, FiMenu, FiX,
    FiSettings, FiActivity, FiMessageSquare, FiHelpCircle,
    FiBell, FiSearch, FiUser
} from 'react-icons/fi';
import { FaUserCircle } from 'react-icons/fa';

const Layout = () => {
    const [isSidebarOpen, setSidebarOpen] = useState(true);
    const [isProfileDropdownOpen, setProfileDropdownOpen] = useState(false);
    const [isNotificationDropdownOpen, setNotificationDropdownOpen] = useState(false);
    const location = useLocation();

    const menuItems = [
        { path: '/admin', icon: <FiHome />, label: 'Dashboard' },
        { path: '/admin/users', icon: <FiUsers />, label: 'Users Management' },
        { path: '/admin/models', icon: <FiBox />, label: 'Models Management' },
        { path: '/admin/subscriptions', icon: <FiDollarSign />, label: 'Subscriptions' },
        { path: '/admin/chats', icon: <FiMessageSquare />, label: 'Chat Logs' },
        { path: '/admin/settings', icon: <FiSettings />, label: 'Settings' },
        { path: '/admin/help', icon: <FiHelpCircle />, label: 'Help & Support' },
    ];

    const notifications = [
        { id: 1, message: 'New user registration', time: '5 min ago' },
        { id: 2, message: 'Server update completed', time: '1 hour ago' },
        // Add more notifications as needed
    ];

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <div className={`${isSidebarOpen ? 'w-64' : 'w-20'} bg-white shadow-lg transition-all duration-300 ease-in-out`}>
                <div className="flex items-center justify-between p-6">
                    <h1 className={`text-2xl font-bold text-gray-800 ${!isSidebarOpen && 'hidden'}`}>
                        RAG System
                    </h1>
                    <button
                        onClick={() => setSidebarOpen(!isSidebarOpen)}
                        className="p-2 rounded-lg hover:bg-gray-100"
                    >
                        {isSidebarOpen ? <FiX /> : <FiMenu />}
                    </button>
                </div>
                <nav className="mt-6">
                    {menuItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center px-6 py-3 text-gray-600 hover:bg-blue-50 hover:text-blue-600 
                                ${location.pathname === item.path ? 'bg-blue-50 text-blue-600 border-r-4 border-blue-600' : ''}`}
                        >
                            <span className="text-xl">{item.icon}</span>
                            {isSidebarOpen && <span className="ml-3">{item.label}</span>}
                        </Link>
                    ))}
                </nav>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Top Navigation Bar */}
                <header className="bg-white shadow-sm">
                    <div className="flex items-center justify-between px-6 py-4">
                        <div className="flex items-center flex-1">
                            <div className="relative w-64">
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    className="w-full pl-10 pr-4 py-2 rounded-lg border focus:outline-none focus:border-blue-500"
                                />
                                <FiSearch className="absolute left-3 top-3 text-gray-400" />
                            </div>
                        </div>

                        <div className="flex items-center space-x-4">
                            {/* Notifications */}
                            <div className="relative">
                                <button
                                    onClick={() => setNotificationDropdownOpen(!isNotificationDropdownOpen)}
                                    className="p-2 rounded-full hover:bg-gray-100 relative"
                                >
                                    <FiBell className="text-xl" />
                                    <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
                                </button>

                                {isNotificationDropdownOpen && (
                                    <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg py-2 z-50">
                                        <h3 className="px-4 py-2 text-sm font-semibold border-b">Notifications</h3>
                                        {notifications.map(notification => (
                                            <div key={notification.id} className="px-4 py-3 hover:bg-gray-50">
                                                <p className="text-sm">{notification.message}</p>
                                                <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Profile Dropdown */}
                            <div className="relative">
                                <button
                                    onClick={() => setProfileDropdownOpen(!isProfileDropdownOpen)}
                                    className="flex items-center space-x-2"
                                >
                                    <FaUserCircle
                                        className="w-8 h-8 rounded-full"
                                    />
                                    {isSidebarOpen && (
                                        <span className="text-sm font-medium">Admin User</span>
                                    )}
                                </button>

                                {isProfileDropdownOpen && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50">
                                        <Link to="/admin/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                            Profile Settings
                                        </Link>
                                        <Link to="/admin/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                            Account Settings
                                        </Link>
                                        <div className="border-t my-1"></div>
                                        <button className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100">
                                            Sign Out
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </header>

                {/* Main Content Area */}
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
                    <div className="container mx-auto px-6 py-8">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Layout;