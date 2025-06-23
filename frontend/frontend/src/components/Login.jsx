import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8080/api/auth/login', { email, password });
            const token = response.data.token;
            console.log('Token received:', token);
            localStorage.setItem('token', token);
            console.log('Navigating to /dashboard');
            navigate('/dashboard', { replace: true }); // Force replace to avoid back navigation
            window.location.href = '/dashboard'; // Fallback redirect
        } catch (err) {
            setError(err.response?.data?.error || 'Invalid credentials');
            console.error('Login error:', err.response?.data || err.message);
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-2xl font-bold mb-4">Login</h2>
            {error && <p className="text-red-500">{error}</p>}
            <form onSubmit={handleSubmit} className="max-w-md mx-auto">
                <div className="mb-4">
                    <label className="block text-gray-700">Email</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-2 border rounded" required />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">Password</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-2 border rounded" required />
                </div>
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Login</button>
            </form>
            <p className="mt-4">Don't have an account? <a href="/register" className="text-blue-500">Register</a></p>
        </div>
    );
};

export default Login;