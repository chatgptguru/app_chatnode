import React, { useState } from 'react';

const Manage = () => {
    return (
        <div className='flex flex-col items-center justify-center min-w-[600px] p-8 bg-gray-50 min-h-[500px]'>
            <div className='w-full min-w-[800px] bg-white rounded-lg shadow-md p-6 space-y-6'>
                <div className='flex justify-between items-center border-b pb-4'>
                    <h2 className='text-2xl font-bold text-gray-800'>Members</h2>
                    <button className='inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors duration-150 ease-in-out'>
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
                            <tr className='hover:bg-gray-50'>
                                <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>John Doe</td>
                                <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>2021-01-01</td>
                                <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                                    <span className='px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800'>
                                        Admin
                                    </span>
                                </td>
                                <td className='px-6 py-4 whitespace-nowrap text-right text-sm font-medium'>
                                    <button className='text-red-600 hover:text-red-900 font-medium'>
                                        Leave Team
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Manage;