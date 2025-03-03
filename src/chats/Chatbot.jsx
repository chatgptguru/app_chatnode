import axios from 'axios';
import React, { useState, useRef, useEffect } from 'react';
import { IoRefreshSharp, IoCopyOutline, IoCheckmark, IoPaperPlaneOutline } from 'react-icons/io5';
import { io } from 'socket.io-client';

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
    useEffect(() => {
        // Listen for connection
        socket.on('connect', () => {
            console.log('Connected to server');
        });

        // Listen for responses
        socket.on('response', (data) => {
            messages_ref.current = [...messages_ref.current, { type: "AI", content: data.response, time: 'Just now' }]
            setMessages(messages_ref.current);
            setIsLoading(false);
        });

        // Listen for errors
        socket.on('error', (error) => {
            console.error('Error:', error);
        });
    }, [])
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = async () => {
        if (inputText.trim()) {
            const copy_messages = messages
            setMessages([...copy_messages, { type: "user", content: inputText, time: 'Just now' }]);
            messages_ref.current = [...copy_messages, { type: "user", content: inputText, time: 'Just now' }]
            getAnswer()
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

        // const maxRetries = 3;
        // let retryCount = 0;
        // let lastError = null;

        // while (retryCount < maxRetries) {
        //     try {
        //         const { data } = await axios({
        //             method: 'post',
        //             url: `${import.meta.env.VITE_API_URL}/api/query`,
        //             data: { query, is_new, topic_id, user_id },
        //             headers: {
        //                 Authorization: `Bearer ${token}`,
        //             },
        //             timeout: 300000, // 5 minutes timeout
        //         });

        //         setTopic_Id(data.topic_id);
        //         console.log(data.topic_id, "data.topic_id");
        //         setMessages([...copy_messages, { type: "AI", content: data.response, time: 'Just now' }]);
        //         setIsNew(false);
        //         return; // Success, exit the function

        //     } catch (error) {
        //         console.error(`Attempt ${retryCount + 1} failed:`, error);
        //         lastError = error;

        //         // Only retry on timeout or 504 errors
        //         if (error.code !== 'ECONNABORTED' && error.response?.status !== 504) {
        //             break; // Don't retry on other errors
        //         }

        //         retryCount++;
        //         if (retryCount < maxRetries) {
        //             const delayMs = Math.min(1000 * Math.pow(2, retryCount), 10000); // Exponential backoff with max 10s delay
        //             setMessages([...copy_messages, {
        //                 type: "AI",
        //                 content: `Request timed out. Retrying in ${delayMs / 1000} seconds... (Attempt ${retryCount + 1}/${maxRetries})`,
        //                 time: 'Just now',
        //                 isError: true
        //             }]);
        //             await new Promise(resolve => setTimeout(resolve, delayMs));
        //         }
        //     }
        // }

        // // If we get here, all retries failed
        // let errorMessage = 'An error occurred while getting the response.';

        // if (lastError) {
        //     if (lastError.code === 'ECONNABORTED' || lastError.response?.status === 504) {
        //         errorMessage = `The request timed out after ${maxRetries} attempts. The server might be overloaded. Please try again later.`;
        //     } else if (lastError.response?.status === 401) {
        //         errorMessage = 'Authentication failed. Please log in again.';
        //     } else if (lastError.response?.status === 403) {
        //         errorMessage = 'You do not have permission to perform this action.';
        //     }
        // }

        // setMessages([...copy_messages, {
        //     type: "AI",
        //     content: errorMessage,
        //     time: 'Just now',
        //     isError: true
        // }]);
        // setIsLoading(false);
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
                    <button className='p-2 rounded-full hover:bg-gray-100' onClick={() => {
                        setIsNew(true)
                        setMessages([])
                    }}>
                        <IoRefreshSharp className='text-gray-600' />
                    </button>
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