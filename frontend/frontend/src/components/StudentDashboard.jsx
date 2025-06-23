import React, { useState, useEffect } from 'react';
import axios from 'axios';

const StudentDashboard = ({ token }) => {
    const [jobs, setJobs] = useState([]);
    const [applications, setApplications] = useState([]);
    const [profile, setProfile] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const jobsResponse = await axios.get('http://localhost:8080/api/jobs/all', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setJobs(jobsResponse.data);

                const profileResponse = await axios.get(`http://localhost:8080/api/students/profile/${localStorage.getItem('email')}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setProfile(profileResponse.data);

                const applicationsResponse = await axios.get('http://localhost:8080/api/jobs/student-applications', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setApplications(applicationsResponse.data);
            } catch (err) {
                setError('Failed to load data');
            }
        };
        fetchData();
    }, [token]);

    const handleApply = async (jobId) => {
        try {
            await axios.post('http://localhost:8080/api/jobs/apply', {
                jobId,
                studentEmail: localStorage.getItem('email')
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert('Application submitted');
            const applicationsResponse = await axios.get('http://localhost:8080/api/jobs/student-applications', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setApplications(applicationsResponse.data);
        } catch (err) {
            setError('Application failed');
        }
    };

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:8080/api/students/profile', profile, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert('Profile updated');
        } catch (err) {
            setError('Profile update failed');
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-2xl font-bold mb-4">Student Dashboard</h2>
            {error && <p className="text-red-500">{error}</p>}
            <div className="mb-8">
                <h3 className="text-xl font-semibold mb-2">Update Profile</h3>
                {profile && (
                    <form onSubmit={handleProfileUpdate} className="max-w-md">
                        <div className="mb-4">
                            <label className="block text-gray-700">Name</label>
                            <input
                                type="text"
                                value={profile.name}
                                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                                className="w-full p-2 border rounded"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700">Course</label>
                            <input
                                type="text"
                                value={profile.course}
                                onChange={(e) => setProfile({ ...profile, course: e.target.value })}
                                className="w-full p-2 border rounded"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700">University</label>
                            <input
                                type="text"
                                value={profile.university}
                                onChange={(e) => setProfile({ ...profile, university: e.target.value })}
                                className="w-full p-2 border rounded"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700">Resume URL</label>
                            <input
                                type="text"
                                value={profile.resumeUrl}
                                onChange={(e) => setProfile({ ...profile, resumeUrl: e.target.value })}
                                className="w-full p-2 border rounded"
                            />
                        </div>
                        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
                            Update Profile
                        </button>
                    </form>
                )}
            </div>
            <div className="mb-8">
                <h3 className="text-xl font-semibold mb-2">Available Jobs</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {jobs.map(job => (
                        <div key={job.id} className="border p-4 rounded">
                            <h4 className="text-lg font-bold">{job.title}</h4>
                            <p>{job.description}</p>
                            <p><strong>Type:</strong> {job.jobType}</p>
                            <p><strong>Location:</strong> {job.location}</p>
                            <p><strong>Posted:</strong> {job.datePosted}</p>
                            <button
                                onClick={() => handleApply(job.id)}
                                className="bg-green-500 text-white px-4 py-2 rounded mt-2"
                            >
                                Apply
                            </button>
                        </div>
                    ))}
                </div>
            </div>
            <div>
                <h3 className="text-xl font-semibold mb-2">My Applications</h3>
                <ul>
                    {applications.map(app => (
                        <li key={app.id} className="border p-2 mb-2 rounded">
                            Job ID: {app.jobId}, Status: {app.status}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default StudentDashboard;