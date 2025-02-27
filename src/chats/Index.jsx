import React, { useState, useCallback, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import Container from './Container';
import Chatbot from './Chatbot';
import History from './history';
const Chats = () => {
    const navigate = useNavigate();
    return (
        <div className='flex justify-center w-full gap-2'>
            <div className='flex justify-center gap-10 w-[90%] min-w-[1200px]'>
                <History />
                <Container />
            </div>
        </div>
    );
};

export default Chats;