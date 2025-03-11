import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UsersManagement = () => {
    const [pendingRequests, setPendingRequests] = useState([]);
    const [activeUsers, setActiveUsers] = useState([]);
    const [viewMode, setViewMode] = useState('pending'); // 'pending' or 'active'
    const API_URL = import.meta.env.VITE_API_URL

    useEffect(() => {
        if (viewMode === 'pending') {
            fetchPendingUsers();
        } else {
            fetchActiveUsers();
        }
    }, [viewMode]);

    const fetchActiveUsers = async () => {
        try {
            const response = await axios.get(`${API_URL}/api/admin/active-users`);
            setActiveUsers(response.data);
        } catch (error) {
            console.error('Error fetching active users:', error);
        }
    };

    const fetchPendingUsers = async () => {
        try {
            const response = await axios.get(`${API_URL}/api/admin/pending-users`);
            setPendingRequests(response.data);
        } catch (error) {
            console.error('Error fetching pending users:', error);
            // Handle error (e.g., show toast notification)
        }
    };

    const handleApprove = async (userId) => {
        try {
            await axios.post(`${API_URL}/api/admin/approve-user/${userId}`);
            // Refresh the list after approval
            fetchPendingUsers();
        } catch (error) {
            console.error('Error approving user:', error);
            // Handle error
        }
    };

    const handleReject = async (userId) => {
        try {
            await axios.post(`${API_URL}/admin/reject-user/${userId}`);
            // Refresh the list after rejection
            fetchPendingUsers();
        } catch (error) {
            console.error('Error rejecting user:', error);
            // Handle error
        }
    };

    const handleDeleteUser = async (userId) => {
        if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
            try {
                await axios.delete(`${API_URL}/api/admin/delete-user/${userId}`);
                // Refresh the active users list
                fetchActiveUsers();
            } catch (error) {
                console.error('Error deleting user:', error);
                // Handle error
            }
        }
    };

    const handleBlockUser = async (userId, isBlocked) => {
        try {
            await axios.post(`${API_URL}/api/admin/toggle-block-user/${userId}`, {
                blocked: !isBlocked
            });
            // Refresh the active users list
            fetchActiveUsers();
        } catch (error) {
            console.error('Error toggling user block status:', error);
            // Handle error
        }
    };

    return (
        <div>
            <h2 className="text-2xl font-bold mb-6">Users Management</h2>

            <div className="bg-white rounded-lg shadow">
                <div className="p-6">
                    <div className="flex space-x-4 mb-6">
                        <label className="inline-flex items-center">
                            <input
                                type="radio"
                                className="form-radio"
                                name="userView"
                                value="pending"
                                checked={viewMode === 'pending'}
                                onChange={(e) => setViewMode(e.target.value)}
                            />
                            <span className="ml-2">Pending Requests</span>
                        </label>
                        <label className="inline-flex items-center">
                            <input
                                type="radio"
                                className="form-radio"
                                name="userView"
                                value="active"
                                checked={viewMode === 'active'}
                                onChange={(e) => setViewMode(e.target.value)}
                            />
                            <span className="ml-2">Active Users</span>
                        </label>
                    </div>

                    <h3 className="text-lg font-semibold mb-4">
                        {viewMode === 'pending' ? 'Pending Join Requests' : 'Active Users'}
                    </h3>

                    <table className="w-full">
                        <thead>
                            <tr className="border-b">
                                <th className="text-left py-3">Email</th>
                                <th className="text-left py-3">
                                    {viewMode === 'pending' ? 'Request Date' : 'Join Date'}
                                </th>
                                {viewMode === 'active' && <th className="text-left py-3">
                                    Status
                                </th>}
                                <th className="text-left py-3">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {viewMode === 'pending' ? (
                                pendingRequests.map((request) => (
                                    <tr key={request.id} className="border-b">
                                        <td className="py-3">{request.email}</td>
                                        <td className="py-3">{request.requestDate}</td>
                                        <td className="py-3">
                                            <button
                                                onClick={() => handleApprove(request.id)}
                                                className="bg-green-500 text-white px-3 py-1 rounded mr-2"
                                            >
                                                Approve
                                            </button>
                                            <button
                                                onClick={() => handleReject(request.id)}
                                                className="bg-red-500 text-white px-3 py-1 rounded"
                                            >
                                                Reject
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                activeUsers.map((user) => (
                                    <tr key={user.id} className="border-b">
                                        <td className="py-3">{user.email}</td>
                                        <td className="py-3">{user.joinedDate}</td>
                                        <td className=""><span className={`p-3 rounded w-[100px] ${user.status == 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{user.status}</span></td>
                                        <td className="py-3 space-x-2 w-[200px]">
                                            <button
                                                onClick={() => handleBlockUser(user.id, user.blocked)}
                                                className={`${user.status == 'active'
                                                    ? 'bg-yellow-500'
                                                    : 'bg-red-500'
                                                    } text-white px-3 py-1 rounded w-[80px]`}
                                            >
                                                {user.status == 'blocked' ? 'Unblock' : 'Block'}
                                            </button>
                                            <button
                                                onClick={() => handleDeleteUser(user.id)}
                                                className="bg-red-700 text-white px-3 py-1 rounded w-[80px]"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default UsersManagement;