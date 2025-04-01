import axios from 'axios';
import { RegisterRequest, AuthenticationRequest, VerificationRequest } from '../models/authentication';

const API_URL = 'http://localhost:8085/api/v1/auth';  // Update this to your API URL

export const register = async (registerRequest: RegisterRequest) => {
    const response = await axios.post(`${API_URL}/register`, registerRequest);
    return response.data;
};

export const login = async (authRequest: AuthenticationRequest) => {
    const response = await axios.post(`${API_URL}/authenticate`, authRequest);
    return response.data;
};

export const verifyCode = async (verifyRequest: VerificationRequest) => {
    const response = await axios.post(`${API_URL}/verify`, verifyRequest);
    return response.data;
};
