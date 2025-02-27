import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaAlignLeft } from 'react-icons/fa'; // Icon for Websites
import axios from 'axios';

const Text = () => {
    const navigate = useNavigate();
    const [text, setText] = useState(''); // State to store the text input

    const handleAddText = async () => {
        const data = {
            text: text // Send the text data instead of a URL
        };

        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/process-text`, data, {
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            console.log('Response from backend:', response.data);
        } catch (error) {
            console.error('Error sending text to backend:', error);
        }
    };

    return (
        <div className='flex flex-col justify-center w-full gap-6 p-8 h-fit bg-gray-50'>
            {/* Header Section */}
            <div className='flex items-center justify-between'>
                <div className='flex items-center gap-3'>
                    <FaAlignLeft className='text-3xl text-blue-500' /> {/* Icon */}
                    <h1 className='text-3xl font-bold text-gray-800'>Text Processing</h1>
                </div>
                <button
                    className='flex items-center gap-2 px-6 py-3 text-lg font-semibold text-white transition duration-200 bg-blue-500 rounded-full hover:bg-blue-600'
                    onClick={handleAddText}
                >
                    <span>+</span> Add Text
                </button>
            </div>

            {/* Data Section */}
            <div className='w-full min-h-[300px] border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center bg-white p-4'>
                <textarea
                    className='w-full h-40 p-4 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500'
                    placeholder='Enter your text here...'
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                />
                <p className='mt-4 text-lg text-gray-500'>Enter text to process</p>
            </div>
        </div>
    );
};

export default Text;