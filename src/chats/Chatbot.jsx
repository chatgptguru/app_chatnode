import axios from 'axios';
import React, { useState, useRef, useEffect } from 'react';
import { IoRefreshSharp, IoCopyOutline, IoCheckmark, IoPaperPlaneOutline, IoLockClosedOutline } from 'react-icons/io5';
import { io } from 'socket.io-client';
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';
const socket = io(`${import.meta.env.VITE_API_URL}`);

const Chatbot = ({ enable }) => {
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
    const defaultSettings = {
        theme: {
            primaryColor: "#4169E1",
            backgroundColor: "#FFFFFF"
        },
        customIcons: {
            enabled: false,
        },
        header: {
            enabled: true,
            title: "AI Chatbot",
            titleColor: "#FFFFFF",
            statusEnabled: true,
            statusText: "Online",
            statusColor: "#4CAF50",
            shadow: "#E5E5E5",
            resetButton: "#FFFFFF",
            background: "#4169E1"
        },
        chatBubbles: {
            greeting: "What can I help you with?",
            botBubbleBg: "#000000",
            botBubbleText: "#FFFFFF",
            userBubbleBg: "#4169E1",
            userBubbleText: "#FFFFFF",
            feedback: true,
            soundEffect: false
        },
        chatInput: {
            text: "",
            textColor: "#000000",
            background: "#FFFFFF",
            border: "#E5E5E5",
            sendButton: "#000000"
        },
        suggestedQuestions: {
            questions: ["Who Are You?", "What is your purpose?"]
        },
        popupMessage: {
            enabled: true,
            message1: "Need help?",
            message2: "Type your message",
            text: "#000000",
            background: "#FFFFFF",
            border: "#E5E5E5"
        },
        popupButton: {
            openByDefault: true,
            buttonOnRight: true,
            background: "#4169E1",
            icon: "#FFFFFF"
        },
        userInfo: {
            collectName: true,
            collectEmail: true,
            collectPhone: true,
            submitButton: "Start Chatting",
            privacyPolicy: true
        }
    };
    const [settings, setSettings] = useState(defaultSettings);
    const getSettings = async () => {
        const user_id = await localStorage.getItem('user_id');
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/settings?user_id=${user_id}`);
        return res.data;
    };
    useEffect(() => {
        getSettings()
            .then(data => {
                const merged = { ...defaultSettings, ...data };
                setSettings(merged);
            });
    }, []);
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
            {(bot?.public || enable) ? (
                <div className='mx-auto bg-gray-50 rounded-lg shadow-lg flex flex-col w-full h-full'>
                    <div
                        className='p-4 border-b rounded-t-lg'
                        style={{
                            background: settings.header.background,
                        }}
                    >
                        <div className='flex items-center justify-between'>
                            <div className='flex items-center gap-2'>
                                <div
                                    className='text-lg font-semibold'
                                    style={{ color: settings.header.titleColor }}
                                >
                                    {settings.header.title}
                                </div>
                                {settings.header.statusEnabled && (
                                    <>
                                        <div
                                            className='w-2 h-2 rounded-full'
                                            style={{ background: settings.header.statusColor }}
                                        ></div>
                                        <div
                                            className='text-sm'
                                            style={{ color: settings.header.statusColor }}
                                        >
                                            {settings.header.statusText}
                                        </div>
                                    </>
                                )}
                            </div>
                            <div className='flex items-center gap-4'>
                                {messageLimit && (
                                    <div className='text-sm text-black'>
                                        Messages: {Math.ceil(messages.length / 2)}/{messageLimit}
                                    </div>
                                )}
                                <button
                                    className='p-2 rounded-full hover:bg-gray-100'
                                    style={{ background: settings.header.resetButton }}
                                    onClick={() => {
                                        setIsNew(true)
                                        setMessages([])
                                    }}
                                >
                                    <IoRefreshSharp className='text-white' />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Chat Messages */}
                    <div className='flex-1 p-4 space-y-4 overflow-y-auto'>
                        {messages.map((message, index) => (
                            <div key={index} className={`flex items-center ${message.type === "user" ? 'justify-end' : 'justify-start'}`}>
                                {defaultSettings.customIcons.enabled && message.type != "user" && <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
                                    <img src={`${import.meta.env.VITE_API_URL}/api/image/${botId}`} alt="Bot Avatar" className="w-8 h-8 rounded-full" />
                                </div>}
                                <div
                                    className={`max-w-[95%] p-4 rounded-lg ${message.type === "user"
                                        ? `bg-[${settings.chatBubbles.userBubbleBg}] text-[${settings.chatBubbles.userBubbleText}] border border-[${settings.chatBubbles.userBubbleBorder}]`
                                        : message.isError
                                            ? 'bg-red-500 text-white'
                                            : `bg-[${settings.chatBubbles.botBubbleBg}] text-[${settings.chatBubbles.botBubbleText}] border border-[${settings.chatBubbles.botBubbleBorder}]`
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
                                placeholder={settings.chatInput.placeholder}
                                className={`flex-1 p-2 border rounded-lg focus:outline-none border-[${settings.chatInput.border}] bg-[${settings.chatInput.background}] text-[${settings.chatInput.textColor}]`}
                            />
                            <button
                                onClick={handleSendMessage}
                                className={`p-2 text-white bg-[${settings.chatInput.sendButton}] rounded-lg hover:bg-blue-600`}
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