import React, { useState } from 'react';
import { FiMessageSquare } from 'react-icons/fi';
import Manage from './Manage';
import Members from './Members';
import Subscription from '../components/SubscriptionPlans';

const Team = () => {
    const [currentPage, setCurrentPage] = useState('Manage');
    return (
        <div className='flex flex-col items-center justify-center w-full p-4 bg-gray-50'>
            <div className='flex justify-between items-center bg-white border border-gray-200 rounded-full shadow-sm w-full max-w-[1200px] px-6 py-3'>
                {/* Left Section: Team Name */}
                <div className='text-lg font-semibold text-gray-800'>
                    Team
                </div>

                {/* Middle Section: Navigation Links */}
                <div className='flex gap-6'>
                    {['Manage', 'Members', 'Subscription'].map((item, index) => (
                        <div
                            key={index}
                            onClick={() => {
                                setCurrentPage(item)
                            }}
                            className='text-sm text-gray-600 transition-colors cursor-pointer hover:text-blue-500'
                        >
                            {item}
                        </div>
                    ))}
                </div>
                <div className='flex'>
                </div>
            </div>
            <div className='flex'>
                {currentPage === 'Manage' && <Manage />}
                {currentPage === 'Members' && <Members />}
                {currentPage === 'Subscription' && <Subscription />}
            </div>
        </div>
    );
};

export default Team;