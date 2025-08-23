import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
    const user = useSelector(state => state.user?.user || state.user);
    const location = useLocation();

    if (!user || !user.id) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // User logged in, render children routes
    return children;
};

export default ProtectedRoute;
