import React, { useState, useCallback, useEffect } from 'react';
import LogOut from './assets/logout.svg'
import 'react-tooltip/dist/react-tooltip.css'
import axios from 'axios';
import { toast } from 'react-toastify';
import { HiOutlineSelector } from "react-icons/hi";
import { LuSettings } from "react-icons/lu";
import { FaRegUserCircle } from "react-icons/fa";
import { FaAngleDown } from "react-icons/fa";
import { useNavigate, Outlet } from 'react-router-dom';
import Bot from './bot/Index';
import Team from './team/Index';
import { useDispatch, useSelector } from 'react-redux';
import { setIsSideBarOpen, setIsTeamBarOpen, setIsBotBarOpen } from './store/reducers/layoutReducer';

const Dashboard = () => {
    const navigate = useNavigate();
    const isTeamBarOpen = useSelector((state) => state.layout.isTeamBarOpen);
    const dispatch = useDispatch();
    const signOut = async () => {
        await localStorage.removeItem('token');
        await localStorage.removeItem('isSigned');
        navigate('/signin');
    }
    const [isShowUserDrowDown, setIsShowUserDrowDown] = useState(false)
    const [isShowTeamDrowDown, setIsShowTeamDrowDown] = useState(false)
    const [isShowCreateTeamModal, setIsShowCreateTeamModal] = useState(false);
    const [newTeamName, setNewTeamName] = useState('');
    const [teams, setTeams] = useState([]);
    const [selectedTeam, setSelectedTeam] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const allHideDropDown = () => {
        if (isShowUserDrowDown)
            setIsShowUserDrowDown(false)
        if (isShowTeamDrowDown)
            setIsShowTeamDrowDown(false)
    }

    // Fetch teams on component mount
    useEffect(() => {
        fetchTeams();
    }, []);

    const fetchTeams = async () => {
        try {
            setIsLoading(true);
            const token = localStorage.getItem('token');
            const userId = localStorage.getItem('user_id');

            const response = await axios.get(`/api/teams/user/${userId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            console.log(response.data);
            // setTeams(response.data);
            // Set default selected team if none selected
            if (!selectedTeam && response.data.length > 0) {
                setSelectedTeam(response.data[0]);
            }
        } catch (error) {
            toast.error('Failed to fetch teams');
            console.error('Error fetching teams:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreateTeam = async () => {
        if (!newTeamName.trim()) {
            toast.error('Please enter a team name');
            return;
        }

        try {
            setIsLoading(true);
            const token = localStorage.getItem('token');
            const userId = localStorage.getItem('user_id');

            const response = await axios.post('/api/teams', 
                {
                    name: newTeamName,
                    user_id: userId,
                },
                { 
                    headers: { Authorization: `Bearer ${token}` }
                }
            );
            
            // Add new team to list
            setTeams([...teams, response.data]);
            setNewTeamName('');
            setIsShowCreateTeamModal(false);
            setIsShowTeamDrowDown(false);
            toast.success('Team created successfully!');
        } catch (error) {
            toast.error('Failed to create team');
            console.error('Error creating team:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={{ width: '100vw', height: '100vh' }} onClick={allHideDropDown}>
            <div className='flex items-center justify-between p-5 text-white bg-blue-500'>
                <div className='text-[20px]'>RAG System</div>
                <div className='relative'>
                    <div className='flex items-center px-3 py-2 rounded-lg cursor-pointer hover:bg-gray-300' onClick={() => {
                        setIsShowTeamDrowDown(true)
                    }}>
                        <div>{selectedTeam?.name || 'Select Team'}</div>
                        <HiOutlineSelector />
                    </div>
                    {isShowTeamDrowDown && (
                        <div className='absolute w-[200px] flex flex-col gap-2 px-5 py-1 text-black bg-white rounded-lg shadow-lg top-10'>
                            <div className='px-2 font-bold text-[18px] text-gray-400'>Teams</div>
                            <div className='flex flex-col items-start gap-2'>
                                {isLoading ? (
                                    <div className="px-2 py-2">Loading...</div>
                                ) : teams.length === 0 ? (
                                    <div className="px-2 py-2">No teams found</div>
                                ) : (
                                    teams.map((team) => (
                                        <div 
                                            key={team.id}
                                            onClick={() => {
                                                setSelectedTeam(team);
                                                dispatch(setIsTeamBarOpen(true));
                                                setIsShowTeamDrowDown(false);
                                            }} 
                                            className='flex items-center justify-between w-full px-1 py-2 cursor-pointer rounded-xl hover:bg-gray-300'
                                        >
                                            <div>{team.name}</div>
                                            <LuSettings />
                                        </div>
                                    ))
                                )}
                            </div>
                            <div className='px-2 py-2 rounded-lg hover:bg-gray-500' onClick={() => {
                                setIsShowCreateTeamModal(true);
                                setIsShowTeamDrowDown(false);
                            }}>
                                Create Team +
                            </div>
                        </div>
                    )}
                </div>
                <div className='flex items-center gap-2'>
                    <div className='flex items-center gap-2 bg-blue-300 rounded-3xl px-2 py-1 font-bold cursor-pointer shadow-lg' onClick={() => {
                        navigate('/bots')
                    }}>
                        Chatbots
                    </div>
                    <div className='relative'>
                        <div className='flex items-center px-2 py-1 cursor-pointer rounded-3xl hover:bg-gray-400' onClick={() => {
                            setIsShowUserDrowDown(true)
                        }}>
                            <FaRegUserCircle size={30} />
                            <FaAngleDown />
                        </div>
                        {isShowUserDrowDown && <div className='absolute right-0 w-[250px] flex flex-col gap-1 px-5 py-1 text-black bg-white rounded-lg shadow-lg top-10'>
                            <div className='px-2 cursor-pointer font-bold text-[16px] text-gray-400'>Accounts</div>
                            <div className='px-2 cursor-pointer font-bold text-[16px] text-gray-700 hover:bg-gray-300 py-2 rounded-2xl'>Settings</div>
                            <div className='w-full h-[1px] bg-gray-500'></div>
                            <div className='px-2 cursor-pointer font-bold text-[16px] text-gray-400'>Team/Default Team</div>
                            <div className='px-2 cursor-pointer font-bold text-[16px] text-gray-700 hover:bg-gray-300 py-2 rounded-2xl' onClick={() => {
                                navigate('/subscription-plans')
                            }}>Subscription</div>
                            <div className='px-2 cursor-pointer font-bold text-[16px] text-gray-700 hover:bg-gray-300 py-2 rounded-2xl'>Settings</div>
                            <div className='px-2 cursor-pointer font-bold text-[16px] text-gray-700 hover:bg-gray-300 py-2 rounded-2xl'>Members</div>
                            <div className='px-2 cursor-pointer font-bold text-[16px] text-gray-700 hover:bg-gray-300 py-2 rounded-2xl'>API Access</div>
                            <div className='w-full h-[1px] bg-gray-500'></div>
                            <div className='px-2 cursor-pointer py-2 rounded-lg cursor-pointer hover:bg-gray-500' onClick={signOut}>
                                Sign Out
                            </div>
                        </div>}
                    </div>
                </div>
            </div>
            <Outlet />
            {/* Create Team Modal */}
            {isShowCreateTeamModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setIsShowCreateTeamModal(false)}>
                    <div className="bg-white rounded-lg p-6 w-[400px]" onClick={(e) => e.stopPropagation()}>
                        <h2 className="text-xl font-bold mb-4">Create New Team</h2>
                        <input
                            type="text"
                            value={newTeamName}
                            onChange={(e) => setNewTeamName(e.target.value)}
                            placeholder="Enter team name"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-4"
                            disabled={isLoading}
                        />
                        <div className="flex justify-end gap-2">
                            <button
                                className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                                onClick={() => setIsShowCreateTeamModal(false)}
                                disabled={isLoading}
                            >
                                Cancel
                            </button>
                            <button
                                className={`px-4 py-2 bg-blue-500 text-white rounded-lg ${!isLoading && 'hover:bg-blue-600'}`}
                                onClick={handleCreateTeam}
                                disabled={isLoading}
                            >
                                {isLoading ? 'Creating...' : 'Create'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;