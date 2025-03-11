import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

const Layout = () => {
    const navigate = useNavigate();
    React.useEffect(() => {
        if (!localStorage.getItem("isSigned"))
            navigate('/signin')
    }, [navigate]);
    return (
        <Outlet />
    );
};

export default Layout;