import React from 'react';
import { Navigate } from 'react-router-dom';

const authGuard = (component: JSX.Element) => {
    const token = localStorage.getItem('token');
    if (!token) {
        return <Navigate to="/login" />;
    }
    return component;
};

export default authGuard;
