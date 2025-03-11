import axios from 'axios';
import React, { useState, useRef, useEffect } from 'react';
import { IoRefreshSharp, IoCopyOutline, IoCheckmark, IoPaperPlaneOutline } from 'react-icons/io5';
import { io } from 'socket.io-client';
import { toast } from 'react-toastify';

const socket = io(`${import.meta.env.VITE_API_URL}`);

const Chatbot = () => {
    const [messages, setMessages] = useState([]);
    const messages_ref = useRef([])
    const [inputText, setInputText] = useState('');
    const [isFollowing, setIsFollowing] = useState(false);
    const [is_new, setIsNew] = useState(true);
    const [topic_id, setTopic_Id] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);
    const [currentPlan, setCurrentPlan] = useState('Free');
    const [messageLimit, setMessageLimit] = useState(10);

    const getCurrentPlan = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/subscriptions/${localStorage.getItem('user_id')}`)
            // setCurrentPlan(response.data.name);
            // setMessageLimit(response.data.message_limit);
        } catch (error) {
            console.error('Error fetching plan:', error);
            toast.error('Failed to fetch subscription plan');
        }
    }

    useEffect(() => {
        getCurrentPlan();
        // Listen for connection
        socket.on('connect', () => {
            console.log('Connected to server');
        });

        // Listen for responses
        socket.on('response', (data) => {
            setMessages(prevMessages => [...prevMessages, { type: "AI", content: data.response, time: 'Just now' }]);
            setIsLoading(false);
            setIsNew(false);
            if (data.topic_id) {
                setTopic_Id(data.topic_id);
            }
        });

        // Listen for errors
        socket.on('error', (error) => {
            console.error('Error:', error);
            setIsLoading(false);
            setMessages(prevMessages => [...prevMessages, {
                type: "AI",
                content: "An error occurred while getting the response.",
                time: 'Just now',
                isError: true
            }]);
        });

        // Cleanup function to remove listeners when component unmounts
        return () => {
            socket.off('response');
            socket.off('error');
        };
    }, []);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = async () => {
        if (inputText.trim()) {
            if (messages.length >= messageLimit) {
                toast.error(`You have reached the message limit (${messageLimit}) for the Free plan. Please upgrade to continue chatting.`);
                return;
            }
            
            setMessages(prevMessages => [...prevMessages, { type: "user", content: inputText, time: 'Just now' }]);
            getAnswer();
            setInputText('');
        }
    };
    const getAnswer = async () => {
        console.log(topic_id, "topic_id")
        const query = inputText;
        const user_id = await localStorage.getItem('user_id');
        const token = await localStorage.getItem('token');
        setIsLoading(true);
        socket.emit('query', { query, is_new, topic_id, user_id });
    }
    return (
        <div className='w-[600px] mx-auto bg-gray-50 rounded-lg shadow-lg h-[700px] flex flex-col'>
            {/* Header */}
            <div className='p-4 bg-white border-b rounded-t-lg'>
                <div className='flex items-center justify-between'>
                    <div className='flex items-center gap-2'>
                        <div className='text-lg font-semibold'>AI Chatbot</div>
                        <div className='w-2 h-2 bg-blue-500 rounded-full'></div>
                        <div className='text-sm text-blue-500'>Online</div>
                    </div>
                    <div className='flex items-center gap-4'>
                        {currentPlan === 'Free' && messageLimit && (
                            <div className='text-sm text-gray-600'>
                                Messages: {messages.length}/{messageLimit}
                            </div>
                        )}
                        <button className='p-2 rounded-full hover:bg-gray-100' onClick={() => {
                            setIsNew(true)
                            setMessages([])
                        }}>
                            <IoRefreshSharp className='text-gray-600' />
                        </button>
                    </div>
                </div>
            </div>

            {/* Chat Messages */}
            <div className='flex-1 p-4 space-y-4 overflow-y-auto'>
                {messages.map((message, index) => (
                    <div key={index} className={`flex ${message.type === "user" ? 'justify-end' : 'justify-start'}`}>
                        <div
                            className={`max-w-[95%] p-4 rounded-lg ${message.type === "user"
                                ? 'bg-white text-gray-800 border border-gray-200'
                                : message.isError
                                    ? 'bg-red-500 text-white'
                                    : 'bg-blue-500 text-white'
                                }`}
                        >
                            <div className='text-sm whitespace-pre-wrap'>{message.content}</div>
                        </div>
                    </div>
                ))}
                {isLoading && (
                    <div className="flex justify-start">
                        <div className="max-w-[95%] p-4 rounded-lg bg-gray-200">
                            <div className="flex items-center space-x-2">
                                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '600ms' }}></div>
                            </div>
                        </div>
                    </div>
                )}
                {currentPlan === 'Free' && messages.length >= messageLimit && (
                    <div className="flex justify-center">
                        <div className="bg-blue-50 p-4 rounded-lg text-center">
                            <p className="text-blue-800 mb-2">You've reached the {messageLimit} message limit on the free plan</p>
                            <a 
                                href="/subscription" 
                                className="inline-block px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                            >
                                Upgrade Now
                            </a>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Bar (Fixed at Bottom) */}
            <div className='sticky bottom-0 p-4 bg-white border-t'>
                <div className='flex items-center gap-2'>
                    <input
                        type='text'
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        placeholder='Type a message...'
                        className='flex-1 p-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500'
                    />
                    <button
                        onClick={handleSendMessage}
                        className='p-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600'
                    >
                        <IoPaperPlaneOutline className='text-lg' />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Chatbot;