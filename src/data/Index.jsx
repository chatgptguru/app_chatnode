import React, { useState, useCallback, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import Source from './sources';
import Website from './website';
import Document from './document';
import Text from './text';
const Data = () => {
    const navigate = useNavigate();
    const [source, setSource] = useState('document');
    return (
        <div className='flex justify-center w-full gap-2'>
            <div className='flex justify-center gap-10 w-[90%] min-w-[1200px]'>
                <Source setSource={setSource} />
                {source === 'document' && <Document />}
                {source === 'website' && <Website />}
                {source === 'text' && <Text />}
            </div>
        </div>
    );
};

export default Data;