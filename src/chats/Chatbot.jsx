import axios from 'axios';
import React, { useState, useRef, useEffect } from 'react';
import { IoRefreshSharp, IoCopyOutline, IoCheckmark, IoPaperPlaneOutline, IoLockClosedOutline } from 'react-icons/io5';
import { io } from 'socket.io-client';
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';
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
    const [messageLimit, setMessageLimit] = useState(0);
    const { botId } = useParams();
    const [bot, setBot] = useState()
    useEffect(() => {
        const fetchBot = async () => {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/bots/${botId}`);
            setBot(response.data.bot);
        }
        fetchBot();
    }, [botId]);
    const getCurrentPlan = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/subscriptions/${localStorage.getItem('user_id')}`)
            console.log(response.data, "response")
            setCurrentPlan(response.data.name);
            setMessageLimit(response.data.message_limit);
            console.log(response.data.message_limit, "message_limit")
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
        if (messages.length > 0 && messagesEndRef.current) {
            const chatContainer = messagesEndRef.current.parentElement;
            const isNearBottom = chatContainer.scrollHeight - chatContainer.scrollTop - chatContainer.clientHeight < 100;

            if (isNearBottom) {
                messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
            }
        }
    };

    useEffect(() => {
        if (messages.length > 0) {
            scrollToBottom();
        }
        getCurrentPlan()
    }, [messages]);

    const handleSendMessage = async () => {
        if (inputText.trim()) {
            if ((messages.length / 2) >= messageLimit) {
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
        socket.emit('query', { query, is_new, topic_id, user_id, bot_id: botId });
    }
    return (
        <>
            {bot ? (
                <div className='mx-auto bg-gray-50 rounded-lg shadow-lg flex flex-col w-full h-full'>
                    <div className='p-4 border-b rounded-t-lg bg-blue-600'>
                        <div className='flex items-center justify-between'>
                            <div className='flex items-center gap-2'>
                                <div className='text-lg font-semibold text-white'>AI Chatbot</div>
                                <div className='w-2 h-2 bg-green-500 rounded-full'></div>
                                <div className='text-sm text-white'>Online</div>
                            </div>
                            <div className='flex items-center gap-4'>
                                {messageLimit && (
                                    <div className='text-sm text-black'>
                                        Messages: {Math.ceil(messages.length / 2)}/{messageLimit}
                                    </div>
                                )}
                                <button className='p-2 rounded-full hover:bg-gray-100' onClick={() => {
                                    setIsNew(true)
                                    setMessages([])
                                }}>
                                    <IoRefreshSharp className='text-white' />
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
                        {currentPlan === 'Free' && (Math.ceil(messages.length / 2) >= messageLimit) && (
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
            ) : (
                <div className="min-h-screen flex items-center justify-center bg-gray-50">
                    <div className="text-center p-8 bg-white rounded-xl shadow-lg max-w-md mx-auto">
                        <div className="flex justify-center mb-6">
                            <IoLockClosedOutline className="text-6xl text-gray-400" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-3">
                            Private Bot
                        </h2>
                        <p className="text-gray-600">
                            This bot is set to private and cannot be accessed publicly.
                        </p>
                        <a
                            href="/"
                            className="mt-6 inline-block px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200"
                        >
                            Go Back Home
                        </a>
                    </div>
                </div>
            )}
        </>
    );
};

export default Chatbot;