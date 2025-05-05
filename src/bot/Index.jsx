import React, { useEffect, useState } from 'react';
import { FiMessageSquare } from 'react-icons/fi';
import Chats from '../chats/Index';
import Data from '../data/Index';
import Chatbot from '../chats/Chatbot';
import Settings from '../settings/index';
import { Outlet, useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setIsChatbotBarOpen } from '../store/reducers/layoutReducer';
import axios from 'axios';
import { setBot, setBotId } from '../store/reducers/layoutReducer';
const Bot = () => {
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState('Chats');
    const isChatbotBarOpen = useSelector((state) => state.layout.isChatbotBarOpen);
    const dispatch = useDispatch();
    const params = useParams();
    const botId = params.botId;
    const [bot, setCurrentBot] = useState()
    useEffect(() => {
        const fetchBot = async () => {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/bots/${botId}`);
            dispatch(setBot(response.data.bot));
            setCurrentBot(response.data.bot);
            dispatch(setBotId(response.data.bot.id));
        }
        fetchBot();
    }, []);
    return (
        <div className='flex flex-col items-center justify-center w-full p-4 bg-gray-50 h-[calc(100vh-80px)]'>
            <div className='flex justify-between items-center bg-white border border-gray-200 rounded-full shadow-sm w-full max-w-[1200px] px-6 py-3 flex-0'>
                {/* Left Section: Bot Name */}
                <div className='text-lg font-semibold text-gray-800'>
                    {bot?.name}
                </div>

                {/* Middle Section: Navigation Links */}
                <div className='flex gap-6'>
                    {['Chats', 'Data', 'Settings', 'Share', 'Analytics'].map((item, index) => (
                        <div
                            key={index}
                            onClick={() => {
                                navigate(`/bot/${botId}/${item.toLowerCase()}`);
                            }}
                            className='text-sm text-gray-600 transition-colors cursor-pointer hover:text-blue-500'
                        >
                            {item}
                        </div>
                    ))}
                </div>

                {/* Right Section: Chat Button */}
                <div className='flex items-center gap-2 p-2 text-white transition-colors bg-blue-500 rounded-full cursor-pointer hover:bg-blue-600' onClick={() => dispatch(setIsChatbotBarOpen(!isChatbotBarOpen))}>
                    <div className='text-sm'>Chat</div>
                    <FiMessageSquare className='text-lg' />
                </div>
            </div>
            <div className='flex w-full h-full justify-between items-start'>
                <Outlet />
                {isChatbotBarOpen && (
                    <div className='w-[460px] h-[800px]'>
                        <Chatbot enable={true}></Chatbot>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Bot;