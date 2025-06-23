import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import StudentDashboard from './components/StudentDashboard';
import RecruiterDashboard from './components/RecruiterDashboard';
import AdminDashboard from './components/AdminDashboard'; // Add this line
import './App.css';

// ... rest of the code remains the same

const ProtectedRoute = ({ children, expectedRole }) => {
    const [isAuthorized, setIsAuthorized] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const payload = JSON.parse(atob(token.split('.')[1]));
                const role = payload.role;
                setIsAuthorized(role === expectedRole);
            } catch (e) {
                console.error('Token parsing error:', e);
                setIsAuthorized(false);
            }
        }
    }, [location]);

    // Initial check before useEffect updates
    const token = localStorage.getItem('token');
    if (token && !isAuthorized) {
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            if (payload.role === expectedRole) return children;
        } catch (e) {
            console.error('Initial token parsing error:', e);
        }
    }

    if (!isAuthorized) {
        return <Navigate to="/" replace />;
    }
    return children;
};
function App() {
    return (
        <div className="p-8 text-center">
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route
                    path="/student"
                    element={
                        <ProtectedRoute expectedRole="STUDENT">
                            <StudentDashboard />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/recruiter"
                    element={
                        <ProtectedRoute expectedRole="RECRUITER">
                            <RecruiterDashboard />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute expectedRole="STUDENT">
                            <StudentDashboard />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/admin"
                    element={
                        <ProtectedRoute expectedRole="ADMIN">
                            <AdminDashboard />
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </div>
    );
}

export default App;