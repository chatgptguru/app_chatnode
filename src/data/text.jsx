import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaAlignLeft } from 'react-icons/fa'; // Icon for Websites
import axios from 'axios';

const Text = () => {
    const navigate = useNavigate();
    const [text, setText] = useState(''); // State to store the text input
    const [texts, setTexts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');

    // Fetch existing texts on component mount
    useEffect(() => {
        fetchTexts();
    }, []);

    const fetchTexts = async () => {
        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/texts`, {
                user_id: localStorage.getItem('user_id')
            });
            setTexts(response.data.texts);
        } catch (error) {
            console.error('Error fetching texts:', error);
            setError('Failed to load existing texts');
        }
    };

    const handleAddText = async () => {
        if (!text.trim()) {
            setError('Please enter some text');
            return;
        }

        setLoading(true);
        setError(null);
        
        const data = {
            text: text,
            user_id: localStorage.getItem('user_id')
        };

        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/process-text`, data, {
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            console.log('Response from backend:', response.data);
            setSuccessMessage('Text processed successfully!');
            setText(''); // Clear the input
            fetchTexts(); // Refresh the list
        } catch (error) {
            console.error('Error sending text to backend:', error);
            setError(error.response?.data?.error || 'Failed to process text');
        } finally {
            setLoading(false);
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
                    className='flex items-center gap-2 px-6 py-3 text-lg font-semibold text-white transition duration-200 bg-blue-500 rounded-full hover:bg-blue-600 disabled:bg-gray-400'
                    onClick={handleAddText}
                    disabled={loading}
                >
                    {loading ? 'Processing...' : (
                        <><span>+</span> Add Text</>
                    )}
                </button>
            </div>

            {/* Error/Success Messages */}
            {error && (
                <div className='p-4 text-red-700 bg-red-100 rounded-lg'>
                    {error}
                </div>
            )}
            {successMessage && (
                <div className='p-4 text-green-700 bg-green-100 rounded-lg'>
                    {successMessage}
                </div>
            )}

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

            {/* Processed Texts List */}
            <div className='mt-8'>
                <h2 className='mb-4 text-2xl font-semibold text-gray-800'>Processed Texts</h2>
                <div className='space-y-4'>
                    {texts.map((item) => (
                        <div key={item.id} className='p-4 bg-white rounded-lg shadow'>
                            <p className='text-gray-600'>{item.content}</p>
                            <p className='mt-2 text-sm text-gray-400'>
                                Processed at: {new Date(item.processed_at).toLocaleString()}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Text;