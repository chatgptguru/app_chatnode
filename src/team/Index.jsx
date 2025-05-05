import React, { useState, useEffect } from 'react';
import { FiMessageSquare } from 'react-icons/fi';
import Manage from './Manage';
import Members from './Members';
import Subscription from '../components/SubscriptionPlans';
import { useParams } from 'react-router-dom';
import axios from 'axios';
const Team = () => {
    const { teamId } = useParams();
    const [currentPage, setCurrentPage] = useState('Manage');
    const [teamName, setTeamName] = useState('');
    const [teamMembers, setTeamMembers] = useState([]);
    useEffect(() => {
        const fetchTeam = async () => {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/teams/${teamId}`);
            setTeamName(response.data.name);
            setTeamMembers(response.data.members);
            console.log(response.data, "response")
        };
        fetchTeam();
    }, [teamId]);
    return (
        <div className='flex flex-col items-center justify-center w-full p-4 bg-gray-50'>
            <div className='flex justify-between items-center bg-white border border-gray-200 rounded-full shadow-sm w-full max-w-[1200px] px-6 py-3'>
                {/* Left Section: Team Name */}
                <div className='text-lg font-semibold text-gray-800'>
                    Team
                </div>
                {/* Middle Section: Navigation Links */}
                <div className='flex gap-6'>
                    {['Manage', 'Members', 'Subscription'].map((item, index) => (
                        <div
                            key={index}
                            onClick={() => {
                                setCurrentPage(item)
                            }}
                            className='text-sm text-gray-600 transition-colors cursor-pointer hover:text-blue-500'
                        >
                            {item}
                        </div>
                    ))}
                </div>
                <div className='flex'>
                </div>
            </div>
            <div className='flex'>
                {currentPage === 'Manage' && <Manage teamId={teamId} teamName={teamName} teamMembers={teamMembers} />}
                {currentPage === 'Members' && <Members teamId={teamId} teamName={teamName} teamMembers={teamMembers} />}
                {currentPage === 'Subscription' && <Subscription />}
            </div>
        </div>
    );
};

export default Team;