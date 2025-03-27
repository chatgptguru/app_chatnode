import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

const Manage = () => {
    const teamName = useSelector((state) => state.layout.teamName);
    const teamId = useSelector((state) => state.layout.teamId);
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            if (!teamId) {
                throw new Error('Team not selected');
            }

            const response = await fetch(`/api/team/settings/${teamId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ teamName }),
            });

            if (!response.ok) {
                throw new Error('Failed to update settings');
            }

            // Optional: Show success message
        } catch (err) {
            setError(err.message || 'Failed to update settings');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className='flex flex-col items-center justify-center min-w-[600px] p-8 bg-gray-50 min-h-[500px]'>
            <div className='w-full max-w-md bg-white rounded-lg shadow-md p-6 space-y-6'>
                {error && (
                    <div className='bg-red-50 text-red-600 p-3 rounded-md'>
                        {error}
                    </div>
                )}

                <div className='border-b pb-4'>
                    <h2 className='text-2xl font-bold text-gray-800'>General Settings</h2>
                </div>

                <form onSubmit={handleSubmit} className='space-y-4'>
                    <div>
                        <label className='block text-sm font-medium text-gray-700 mb-1'>
                            Team Name
                        </label>
                        <input
                            type="text"
                            value={teamName}
                            onChange={(e) => setTeamName(e.target.value)}
                            placeholder='Enter team name'
                            className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                        />
                    </div>

                    <div className='pt-4'>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className='w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200 font-medium disabled:bg-blue-300'
                        >
                            {isLoading ? 'Updating...' : 'Update Settings'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Manage;