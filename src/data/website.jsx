import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FaGlobe, FaSpinner } from 'react-icons/fa'; // Added loading spinner icon
import axios from 'axios';

const Website = () => {
    const navigate = useNavigate();
    const [websites, setWebsites] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [url, setUrl] = useState('');
    const { botId } = useParams();

    // Fetch websites on component mount
    useEffect(() => {
        fetchWebsites();
    }, []);

    const fetchWebsites = async () => {
        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/websites`, {
                user_id: localStorage.getItem('user_id'), // Assuming user_id is stored in localStorage
                bot_id: botId
            });
            setWebsites(response.data.websites);
        } catch (err) {
            setError('Failed to fetch websites');
            console.error(err);
        }
    };

    const handleAddWebsite = async () => {
        if (!url) {
            setError('Please enter a URL');
            return;
        }
        
        setLoading(true);
        setError(null);
        
        try {
            const data = {
                url: url,
                user_id: localStorage.getItem('user_id'),
                bot_id: botId
            };
            
            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}/api/scrape-website`,
                data,
                {
                    headers: {
                        'Content-Type': 'application/json',
                    }
                }
            );
            
            // Refresh the website list after successful addition
            await fetchWebsites();
            setUrl(''); // Clear the input
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to add website');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='flex flex-col justify-center w-full gap-6 p-8 h-fit bg-gray-50'>
            {/* Header Section */}
            <div className='flex items-center justify-between'>
                <div className='flex items-center gap-3'>
                    <FaGlobe className='text-3xl text-blue-500' />
                    <h1 className='text-3xl font-bold text-gray-800'>Websites</h1>
                </div>
                <div className='flex items-center gap-4'>
                    <input
                        type="url"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        placeholder="Enter website URL"
                        className="px-4 py-2 border rounded-lg"
                    />
                    <button
                        className='flex items-center gap-2 px-6 py-3 text-lg font-semibold text-white transition duration-200 bg-blue-500 rounded-full hover:bg-blue-600 disabled:bg-blue-300'
                        onClick={handleAddWebsite}
                        disabled={loading}
                    >
                        {loading ? <FaSpinner className="animate-spin" /> : <span>+</span>}
                        Add Website
                    </button>
                </div>
            </div>

            {/* Error message */}
            {error && (
                <div className="p-4 text-red-700 bg-red-100 rounded-lg">
                    {error}
                </div>
            )}

            {/* Data Section */}
            <div className='w-full min-h-[300px] border-2 border-gray-200 rounded-lg bg-white p-4'>
                {websites.length > 0 ? (
                    <div className="space-y-4">
                        {websites.map((website) => (
                            <div key={website.id} className="p-4 border rounded-lg hover:bg-gray-50">
                                <div className="flex items-center justify-between">
                                    <a href={website.url} target="_blank" rel="noopener noreferrer" 
                                       className="text-blue-600 hover:underline">
                                        {website.url}
                                    </a>
                                    <span className="text-sm text-gray-500">
                                        {new Date(website.scraped_at).toLocaleDateString()}
                                    </span>
                                </div>
                                <p className="mt-2 text-sm text-gray-600">
                                    {website.extracted_text.substring(0, 200)}...
                                </p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className='flex items-center justify-center h-full'>
                        <p className='text-lg text-gray-500'>No websites added yet</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Website;