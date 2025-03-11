import React, { useState } from 'react';

const Manage = () => {
    return (
        <div className='flex flex-col items-center justify-center min-w-[600px] p-8 bg-gray-50 min-h-[500px]'>
            <div className='w-full max-w-md bg-white rounded-lg shadow-md p-6 space-y-6'>
                <div className='border-b pb-4'>
                    <h2 className='text-2xl font-bold text-gray-800'>General Settings</h2>
                </div>
                
                <div className='space-y-4'>
                    <div>
                        <label className='block text-sm font-medium text-gray-700 mb-1'>
                            Team Name
                        </label>
                        <input 
                            type="text" 
                            placeholder='Enter team name' 
                            className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                        />
                    </div>
                    
                    <div>
                        <label className='block text-sm font-medium text-gray-700 mb-1'>
                            Team ID
                        </label>
                        <input 
                            type="text" 
                            placeholder='Enter team ID' 
                            className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                        />
                    </div>
                </div>

                <div className='pt-4'>
                    <button className='w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200 font-medium'>
                        Update Settings
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Manage;