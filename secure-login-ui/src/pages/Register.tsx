import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import {RegisterRequest, AuthenticationResponse, Role, Department} from '../models/authentication';
import { register, verifyCode } from '../services/authenticationService';
import './styles/Register.css';

const Register: React.FC = () => {
    const [registerRequest, setRegisterRequest] = useState<RegisterRequest>({});
    const [authResponse, setAuthResponse] = useState<AuthenticationResponse>({});
    const [message, setMessage] = useState('');
    const [otpCode, setOtpCode] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;

        // Type narrowing: Only access 'checked' if it's an input element
        const isCheckbox = e.target instanceof HTMLInputElement && type === 'checkbox';
        setRegisterRequest(prev => ({
            ...prev,
            [name]: isCheckbox
        }));
    };


    const registerUser = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage('');
        try {
            const response = await register(registerRequest);
            if (response.mfaEnabled) {
                setAuthResponse(response);
            } else {
                setMessage('Account created successfully. Redirecting to login...');
                setTimeout(() => navigate('/login'), 3000);
            }
        } catch (error) {
            setMessage('Registration failed.');
        }
    };

    const verifyTfa = async () => {
        setMessage('');
        try {
            const response = await verifyCode({ email: registerRequest.email, code: otpCode });
            localStorage.setItem('token', response.accessToken as string);
            setMessage('Account created successfully. Redirecting to Welcome page...');
            setTimeout(() => navigate('/dashboard'), 3000);
        } catch (error) {
            setMessage('Verification failed.');
        }
    };

    return (
        <div className="container">
            {!authResponse.data?.mfaEnabled ? (
                <form onSubmit={registerUser}>
                    <h2>Register</h2>
                    {message && <div className="success-message">{message}</div>}
                    <input type="text" name="firstname" placeholder="First name" onChange={handleChange} required />
                    <input type="text" name="lastname" placeholder="Last name" onChange={handleChange} required />
                    <input type="email" name="email" placeholder="Email" onChange={handleChange} required />

                    <div className="password-container">
                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            placeholder="Password"
                            onChange={handleChange}
                            required
                        />
                        <span
                            className="toggle-password"
                            onClick={() => setShowPassword(prev => !prev)}
                        >
                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </span>
                    </div>

                    {/* Role Dropdown */}
                    {/*<label>Role:</label>*/}
                    <select name="role" onChange={handleChange} required>
                        <option value="">Select Role</option>
                        {Object.values(Role).map(role => (
                            <option key={role} value={role}>{role}</option>
                        ))}
                    </select>

                    {/* Branch Dropdown */}
                    {/*<label>Branch:</label>*/}
                    <select name="branch" onChange={handleChange} required>
                        <option value="">Select Branch</option>
                        {Object.values(Department).map(dept => (
                            <option key={dept} value={dept}>{dept}</option>
                        ))}
                    </select>

                    <label>
                        <input type="checkbox" name="mfaEnabled" onChange={handleChange} />
                        Enable 2FA
                    </label>

                    <button type="submit">Register</button>
                    <a href="/login">Login</a>
                </form>
            ) : (
                <div className="two-fa-setup">
                    <h2>Set Up Two-Factor Authentication</h2>
                    <img src={authResponse.data?.secretImageUri} alt="QR Code" />
                    <input type="text" placeholder="Validation Code" value={otpCode} onChange={(e) => setOtpCode(e.target.value)} required />
                    <button onClick={verifyTfa} disabled={otpCode.length < 6}>Verify code</button>
                </div>
            )}
        </div>
    );
};

export default Register;
