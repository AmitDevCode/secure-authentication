import axios from 'axios';
import { api } from '../urlConfig';

const token: string | null = window.localStorage.getItem('accessToken');

const axiosInstance = axios.create({
    baseURL: api,
    headers: {
        'Authorization': token ? `Bearer ${token}` : ''
    }
});

axiosInstance.interceptors.request.use((req) => {
    if(token) req.headers.Authorization = `Bearer ${token}`;
    return req;
})

axiosInstance.interceptors.response.use((res) => {
    return res;
}, (error) => {
    console.log(error.response);
    const status = error.response ? error.response.status : 500;
    if(status && status === 500){
        localStorage.clear();
    }
    return Promise.reject(error);
})

export default axiosInstance;