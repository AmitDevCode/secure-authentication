import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/Dashboard.css';

const Dashboard: React.FC = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState<string>('User');

    useEffect(() => {
        const token = localStorage.getItem('token');
        const storedEmail = localStorage.getItem('email');

        if (!token) {
            navigate('/login', { replace: true });
        } else if (storedEmail) {
            setEmail(storedEmail);
        }
    }, [navigate]);

    const handleLogout = useCallback(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('email');
        navigate('/login', { replace: true });
    }, [navigate]);

    return (
        <div className="dashboard-container">
            <nav className="navbar">
                <h1>Dashboard</h1>
                <button onClick={handleLogout} aria-label="Logout Button">
                    Logout
                </button>
            </nav>

            <main className="main-content">
                <h2>Welcome to Your Dashboard</h2>
                <p>Hello, {email}!</p>

                <div className="widgets-container">
                    {['Widget 1', 'Widget 2'].map((title, index) => (
                        <div className="widget" key={index}>
                            <h3>{title}</h3>
                            <p>{index === 0 ? 'Some information or data here...' : 'More information or data here...'}</p>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
