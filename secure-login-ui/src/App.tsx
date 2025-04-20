import React, { useEffect, useState } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';

const App: React.FC = () => {
    const location = useLocation();
    const [isAuth, setIsAuth] = useState<boolean>(!!localStorage.getItem('token'));

    useEffect(() => {
        // Whenever the route changes, check auth state again
        setIsAuth(!!localStorage.getItem('token'));
    }, [location]);

    const ProtectedRoute: React.FC<{ children: JSX.Element }> = ({ children }) => {
        return isAuth ? children : <Navigate to="/login" replace />;
    };

    return (
        <Routes>
            {/* Public Routes */}
            <Route
                path="/login"
                element={isAuth ? <Navigate to="/dashboard" replace /> : <Login />}
            />
            <Route
                path="/register"
                element={isAuth ? <Navigate to="/dashboard" replace /> : <Register />}
            />

            {/* Protected Route */}
            <Route
                path="/dashboard"
                element={<ProtectedRoute><Dashboard /></ProtectedRoute>}
            />

            {/* Catch-all */}
            <Route
                path="*"
                element={<Navigate to={isAuth ? "/dashboard" : "/login"} replace />}
            />
        </Routes>
    );
};

export default App;
