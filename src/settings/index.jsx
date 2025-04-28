import { useState } from 'react';
import Menu from './menu';
import { Outlet } from 'react-router-dom';
const Settings = () => {
    const [isShowSettings, setIsShowSettings] = useState(false);
    return (
        <div className='flex flex-row items-start justify-center w-full p-4 bg-gray-50'>
            <Menu />
            <Outlet />
        </div>
    );
}

export default Settings;
