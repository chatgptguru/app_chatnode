import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
    const isAuthenticated = localStorage.getItem('adminAuthenticated') === 'true';

    if (!isAuthenticated) {
        return <Navigate to="/admin/login" />;
    }

    return children;
};

export default ProtectedRoute; 