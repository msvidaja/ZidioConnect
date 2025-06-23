import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('STUDENT');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:8080/api/auth/register', { name, email, password, role });
            navigate('/login');
        } catch (err) {
            alert('Registration failed: ' + (err.response?.data?.error || err.message));
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-2xl font-bold mb-4">Register</h2>
            <form onSubmit={handleSubmit} className="max-w-md mx-auto">
                <div className="mb-4">
                    <label className="block text-gray-700">Name</label>
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full p-2 border rounded" required />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">Email</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-2 border rounded" required />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">Password</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-2 border rounded" required />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">Role</label>
                    <select value={role} onChange={(e) => setRole(e.target.value)} className="w-full p-2 border rounded">
                        <option value="STUDENT">Student</option>
                        <option value="RECRUITER">Recruiter</option>
                        <option value="ADMIN">Admin</option> {/* Added Admin option */}
                    </select>
                </div>
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Register</button>
            </form>
        </div>
    );
};

export default Register;