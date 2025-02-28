import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
const Container = () => {
    const topic_id = useSelector((state) => state.chat.topic_id)
    const [messages, setMessages] = useState([
    ]);
    const getChats = async () => {
        const data = {
            topic_id: topic_id
        }
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/chats`, data, {
            headers: {
                'Content-Type': 'application/json',
            }
        });
        const chats = response.data.chats
        const messageList = [];
        chats.map((chat) => {
            messageList.push({ type: "user", content: chat.query, time: 'Just now' })
            messageList.push({ type: "ai", content: chat.response, time: 'Just now' })
            setMessages(messageList);
        })
    }
    useEffect(() => {
        getChats()
    }, [topic_id])
    return (
        <div className='w-[800px] mx-auto p-6 bg-gray-50 rounded-lg shadow-lg h-[700px] overflow-y-auto'>
            <div className='space-y-4'>
                {messages.map((message, index) => (
                    <div
                        key={index}
                        className={`flex ${message.type === "user" ? 'justify-end' : 'justify-start'}`}
                    >
                        <div
                            className={`max-w-[80%] p-4 rounded-lg ${message.type === "user"
                                ? 'bg-blue-500 text-white'
                                : 'bg-white text-gray-800 border border-gray-200'
                                }`}
                        >
                            <div className='text-sm whitespace-pre-wrap'>{message.content}</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Container;