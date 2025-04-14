import { useState } from 'react';
import Menu from './menu';
import General from './general';
const Settings = () => {
    const [isShowSettings, setIsShowSettings] = useState(false);
    return (
        <div className='flex flex-row items-start justify-center w-full p-4 bg-gray-50'>
            <Menu />
            <General />
        </div>
    );
}

export default Settings;
