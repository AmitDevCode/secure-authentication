import React from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/Dashboard.css';

// Logout Function
const logout = () => {
    localStorage.removeItem('token');
};

const Dashboard: React.FC = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="dashboard-container">
            <nav className="navbar">
                <h1>Dashboard</h1>
                <button onClick={handleLogout}>Logout</button>
            </nav>

            <main className="main-content">
                <h2>Welcome to Your Dashboard</h2>
                <p>Hello, {localStorage.getItem('email') || 'User'}!</p>

                <div className="widgets-container">
                    <div className="widget">
                        <h3>Widget 1</h3>
                        <p>Some information or data here...</p>
                    </div>
                    <div className="widget">
                        <h3>Widget 2</h3>
                        <p>More information or data here...</p>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
