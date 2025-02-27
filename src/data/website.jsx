import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaGlobe } from 'react-icons/fa'; // Icon for Websites
import axios from 'axios';

const Website = () => {
    const navigate = useNavigate();
    const handleAddWebsite = async () => {
        const data = {
            url: 'https://www.google.com'
        }
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/scrape-website`, data, {
            headers: {
                'Content-Type': 'application/json',
            }
        });
    }
    return (
        <div className='flex flex-col justify-center w-full gap-6 p-8 h-fit bg-gray-50'>
            {/* Header Section */}
            <div className='flex items-center justify-between'>
                <div className='flex items-center gap-3'>
                    <FaGlobe className='text-3xl text-blue-500' /> {/* Icon */}
                    <h1 className='text-3xl font-bold text-gray-800'>Websites</h1>
                </div>
                <button
                    className='flex items-center gap-2 px-6 py-3 text-lg font-semibold text-white transition duration-200 bg-blue-500 rounded-full hover:bg-blue-600'
                    onClick={() => {
                        handleAddWebsite()
                    }} // Example navigation
                >
                    <span>+</span> Add Website
                </button>
            </div>

            {/* Data Section */}
            <div className='w-full min-h-[300px] border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-white'>
                <p className='text-lg text-gray-500'>No data available</p>
            </div>
        </div>
    );
};

export default Website;