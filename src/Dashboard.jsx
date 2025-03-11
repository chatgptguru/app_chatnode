import React, { useState, useCallback, useEffect } from 'react';
import LogOut from './assets/logout.svg'
import 'react-tooltip/dist/react-tooltip.css'
import axios from 'axios';
import { toast } from 'react-toastify';
import { HiOutlineSelector } from "react-icons/hi";
import { LuSettings } from "react-icons/lu";
import { FaRegUserCircle } from "react-icons/fa";
import { FaAngleDown } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import Bot from './bot/Index';
import Team from './team/Index';

const Dashboard = () => {
    const navigate = useNavigate();
    const signOut = async () => {
        await localStorage.removeItem('token');
        await localStorage.removeItem('isSigned');
        navigate('/signin');
    }
    const [isShowUserDrowDown, setIsShowUserDrowDown] = useState(false)
    const [isShowTeamDrowDown, setIsShowTeamDrowDown] = useState(false)
    const allHideDropDown = () => {
        if (isShowUserDrowDown)
            setIsShowUserDrowDown(false)
        if (isShowTeamDrowDown)
            setIsShowTeamDrowDown(false)
    }
    return (
        <div style={{ width: '100vw', height: '100vh' }} onClick={allHideDropDown}>
            <div className='flex items-center justify-between p-5 text-white bg-blue-500'>
                <div className='text-[20px]'>RAG System</div>
                <div className='relative'>
                    <div className='flex items-center px-3 py-2 rounded-lg cursor-pointer hover:bg-gray-300' onClick={() => {
                        setIsShowTeamDrowDown(true)
                    }}>
                        <div>Default Team</div>
                        <HiOutlineSelector />
                    </div>
                    {isShowTeamDrowDown && <div className='absolute w-[200px] flex flex-col gap-2 px-5 py-1 text-black bg-white rounded-lg shadow-lg top-10'>
                        <div className='px-2 font-bold text-[18px] text-gray-400'>Teams</div>
                        <div className='flex flex-col items-start gap-2'>
                            <div className='flex items-center justify-start w-full px-1 py-2 cursor-pointer rounded-xl hover:bg-gray-300'>
                                <div>Team 1</div><LuSettings />
                            </div>
                            <div className='flex items-center justify-start w-full px-1 py-2 cursor-pointer rounded-xl hover:bg-gray-300'>
                                <div>Team 2</div><LuSettings />
                            </div>
                        </div>
                        <div className='px-2 py-2 rounded-lg hover:bg-gray-500'>
                            Create Team +
                        </div>
                    </div>}
                </div>
                <div>
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
            <Bot/>
            {/* <Team /> */}
        </div>
    );
};

export default Dashboard;