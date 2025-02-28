import axios from 'axios';
import React, { useState, useRef, useEffect } from 'react';
import { IoRefreshSharp, IoCopyOutline, IoCheckmark, IoPaperPlaneOutline } from 'react-icons/io5';

const Chatbot = () => {
    const [messages, setMessages] = useState([]);
    const [inputText, setInputText] = useState('');
    const [isFollowing, setIsFollowing] = useState(false);
    const [is_new, setIsNew] = useState(true)
    const [topic_id, setTopic_Id] = useState(null)
    // const getChats = async () => {
    //     const user_id = await localStorage.getItem('user_id');
    //     const data = {
    //     }
    //     const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/chats`, data, {
    //         headers: {
    //             'Content-Type': 'application/json',
    //         }
    //     });
    //     const chats = response.data.chats
    //     const messageList = [];
    //     chats.map((chat) => {
    //         messageList.push({ type: "user", content: chat.query, time: 'Just now' })
    //         messageList.push({ type: "AI", content: chat.response, time: 'Just now' })
    //     })
    //     setMessages(messageList);
    // }
    // useEffect(() => {
    //     getChats()
    // }, [])
    const handleSendMessage = async () => {
        if (inputText.trim()) {
            const copy_messages = messages
            setMessages([...copy_messages, { type: "user", content: inputText, time: 'Just now' }]);
            getAnswer([...copy_messages, { type: "user", content: inputText, time: 'Just now' }])
            setInputText('');
        }
    };
    const getAnswer = async (copy_messages) => {
        const query = inputText;
        const user_id = await localStorage.getItem('user_id');
        const token = await localStorage.getItem('token');
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/query`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json", // Specify JSON content type
                Authorization: `Bearer ${token}`, // Replace with actual token
            },
            body: JSON.stringify({ query: query, is_new: is_new, topic_id: topic_id, user_id: user_id }), // Send the query as JSON
        });
        const data = await response.json();
        setTopic_Id(data.topic_id)
        setMessages([...copy_messages, { type: "AI", content: data.response, time: 'Just now' }]);
        setIsNew(false)
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
                                : 'bg-blue-500 text-white'
                                }`}
                        >
                            {/* <div className='mt-1 text-xs text-gray-400'>{message.time}</div> */}
                            <div className='text-sm whitespace-pre-wrap'>{message.content}</div>
                        </div>
                    </div>
                ))}
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