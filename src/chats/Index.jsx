import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Container from './Container';
import History from './History';
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