import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
const Members = ({ teamId, teamName, teamMembers }) => {
    const [members, setMembers] = useState(teamMembers);
    const [showInviteModal, setShowInviteModal] = useState(false);
    const [inviteEmail, setInviteEmail] = useState("");
    const [inviteRole, setInviteRole] = useState("member");
    const [loading, setLoading] = useState(false);

    const handleInvite = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/teams/${teamId}/invite`, {
                email: inviteEmail,
                role: inviteRole,
            });
            setMembers([...members, response.data]);
            toast.success("Member invited successfully!");
            setShowInviteModal(false);
            setInviteEmail("");
            setInviteRole("member");
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to invite member");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='flex flex-col items-center justify-center min-w-[600px] p-8 bg-gray-50 min-h-[500px]'>
            <div className='w-full min-w-[800px] bg-white rounded-lg shadow-md p-6 space-y-6'>
                <div className='flex justify-between items-center border-b pb-4'>
                    <h2 className='text-2xl font-bold text-gray-800'>Members</h2>
                    <button className='inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors duration-150 ease-in-out' onClick={() => setShowInviteModal(true)}>
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                        </svg>
                        Invite Member
                    </button>
                </div>

                <div className='overflow-x-auto'>
                    <table className='min-w-full divide-y divide-gray-200'>
                        <thead className='bg-gray-50'>
                            <tr>
                                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>E-mail</th>
                                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Joined</th>
                                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Role</th>
                                <th className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'></th>
                            </tr>
                        </thead>
                        <tbody className='bg-white divide-y divide-gray-200'>
                            {members.map((member) => (
                                <tr className='hover:bg-gray-50' key={member.id}>
                                    <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>{member.email}</td>
                                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>{member.created_at}</td>
                                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                                        <span className='px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800'>
                                            {member.role}
                                        </span>
                                    </td>
                                    <td className='px-6 py-4 whitespace-nowrap text-right text-sm font-medium'>
                                        <button className='text-red-600 hover:text-red-900 font-medium'>
                                            Remove
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            {showInviteModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                        <h3 className="text-lg font-bold mb-4">Invite Member</h3>
                        <form onSubmit={handleInvite} className="space-y-4">
                            <input
                                type="email"
                                required
                                placeholder="E-mail"
                                className="w-full border px-3 py-2 rounded"
                                value={inviteEmail}
                                onChange={e => setInviteEmail(e.target.value)}
                            />
                            <select
                                className="w-full border px-3 py-2 rounded"
                                value={inviteRole}
                                onChange={e => setInviteRole(e.target.value)}
                            >
                                <option value="member">Member</option>
                                <option value="admin">Admin</option>
                            </select>
                            <div className="flex justify-end space-x-2">
                                <button type="button" className="px-4 py-2 bg-gray-200 rounded" onClick={() => setShowInviteModal(false)} disabled={loading}>Cancel</button>
                                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded" disabled={loading}>{loading ? "Inviting..." : "Invite"}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Members;