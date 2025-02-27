import React, { useState } from 'react';
import { FiMessageSquare } from 'react-icons/fi';
import Chats from '../chats';
import Data from '../data/Index';
import Chatbot from '../chats/Chatbot';

const Bot = () => {
    const [currentPage, setCurrentPage] = useState('chats');
    return (
        <div className='flex flex-col items-center justify-center w-full p-4 bg-gray-50'>
            <div className='flex justify-between items-center bg-white border border-gray-200 rounded-full shadow-sm w-full max-w-[1200px] px-6 py-3'>
                {/* Left Section: Bot Name */}
                <div className='text-lg font-semibold text-gray-800'>
                    Bot
                </div>

                {/* Middle Section: Navigation Links */}
                <div className='flex gap-6'>
                    {['Chats', 'Data', 'Settings', 'Share', 'Analytics'].map((item, index) => (
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

                {/* Right Section: Chat Button */}
                <div className='flex items-center gap-2 p-2 text-white transition-colors bg-blue-500 rounded-full cursor-pointer hover:bg-blue-600'>
                    <div className='text-sm'>Chat</div>
                    <FiMessageSquare className='text-lg' />
                </div>
            </div>
            <div className='flex'>
                {currentPage == 'Chats' &&
                    <Chats></Chats>
                }
                {currentPage == 'Data' &&
                    <Data></Data>
                }
                <Chatbot></Chatbot>
            </div>
        </div>
    );
};

export default Bot;