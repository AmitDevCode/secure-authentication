import React from 'react';
import {Navigate, Route, Routes} from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';

// Utility to check authentication status
const isAuthenticated = (): boolean => {
    return !!localStorage.getItem('token');
}

// Protected Route Wrapper
const ProtectedRoute: React.FC<{ children: JSX.Element }> = ({children}) => {
    return isAuthenticated() ? children : <Navigate to="/login" replace/>;
}

const App: React.FC = () => {
    return (
        <Routes>
            {/* Public Routes */}
            <Route path="/login" element={isAuthenticated() ? <Navigate to="/dashboard" replace/> : <Login/>}/>
            <Route path="/register" element={isAuthenticated() ? <Navigate to="/dashboard" replace/> : <Register/>}/>

            {/* Protected Route */}
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard/></ProtectedRoute>}/>

            {/* Redirect Unknown Routes */}
            <Route path="*" element={<Navigate to={isAuthenticated() ? "/dashboard" : "/login"} replace/>}/>
        </Routes>
    );
}

export default App;
