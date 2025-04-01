import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthenticationRequest, AuthenticationResponse } from '../models/authentication';
import { login, verifyCode } from '../services/authenticationService';
import { Eye, EyeOff } from 'lucide-react'; // Importing eye icons
import './styles/Login.css';

const Login: React.FC = () => {
    const [authRequest, setAuthRequest] = useState<AuthenticationRequest>({});
    const [authResponse, setAuthResponse] = useState<AuthenticationResponse>({});
    const [otpCode, setOtpCode] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setAuthRequest(prev => ({ ...prev, [name]: value }));
    };

    const authenticate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await login(authRequest);
            setAuthResponse(response);
            if (!response.mfaEnabled) {
                localStorage.setItem('token', response.accessToken as string);
                navigate('/dashboard');
            }
        } catch (error) {
            alert('Login failed');
        }
    };

    const verifyTfa = async () => {
        try {
            const response = await verifyCode({ email: authRequest.email, code: otpCode });
            localStorage.setItem('token', response.accessToken as string);
            navigate('/dashboard');
        } catch (error) {
            alert('Verification failed');
        }
    };

    return (
        <div className="container">
            {!authResponse.mfaEnabled ? (
                <form onSubmit={authenticate}>
                    <h2>Login</h2>
                    <input type="email" name="email" placeholder="Email" onChange={handleChange} required />

                    <div className="password-container">
                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            placeholder="Password"
                            onChange={handleChange}
                            required
                        />
                        <button
                            type="button"
                            className="toggle-password"
                            onClick={() => setShowPassword(prev => !prev)}
                            aria-label={showPassword ? "Hide password" : "Show password"}
                        >
                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                    </div>

                    <button type="submit">Login</button>
                    <a href="/register">Register</a>
                </form>
            ) : (
                <div className="two-fa-setup">
                    <h2>Two-Factor Authentication</h2>
                    <input
                        type="text"
                        placeholder="Validation Code"
                        value={otpCode}
                        onChange={(e) => setOtpCode(e.target.value)}
                        required
                    />
                    <button onClick={verifyTfa} disabled={otpCode.length < 6}>Verify code</button>
                </div>
            )}
        </div>
    );
};

export default Login;
