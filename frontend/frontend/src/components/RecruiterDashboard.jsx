import React, { useState, useEffect } from 'react';
import axios from 'axios';

const RecruiterDashboard = ({ token }) => {
    const [jobs, setJobs] = useState([]);
    const [applications, setApplications] = useState([]);
    const [profile, setProfile] = useState(null);
    const [newJob, setNewJob] = useState({
        title: '',
        description: '',
        jobType: '',
        location: '',
        datePosted: new Date().toISOString().split('T')[0]
    });
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const jobsResponse = await axios.get('http://localhost:8080/api/jobs/recruiter', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setJobs(jobsResponse.data);

                const profileResponse = await axios.get(`http://localhost:8080/api/recruiters/${localStorage.getItem('email')}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setProfile(profileResponse.data);
            } catch (err) {
                setError('Failed to load data');
            }
        };
        fetchData();
    }, [token]);

    const handleJobSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:8080/api/jobs/post', newJob, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert('Job posted');
            const jobsResponse = await axios.get('http://localhost:8080/api/jobs/recruiter', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setJobs(jobsResponse.data);
        } catch (err) {
            setError('Job posting failed');
        }
    };

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:8080/api/recruiters/profile', profile, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert('Profile updated');
        } catch (err) {
            setError('Profile update failed');
        }
    };

    const fetchApplications = async (jobId) => {
        try {
            const response = await axios.get(`http://localhost:8080/api/jobs/applications/${jobId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setApplications(response.data);
        } catch (err) {
            setError('Failed to load applications');
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-2xl font-bold mb-4">Recruiter Dashboard</h2>
            {error && <p className="text-red-500">{error}</p>}
            <div className="mb-8">
                <h3 className="text-xl font-semibold mb-2">Update Profile</h3>
                {profile && (
                    <form onSubmit={handleProfileUpdate} className="max-w-md">
                        <div className="mb-4">
                            <label className="block text-gray-700">Recruiter Name</label>
                            <input
                                type="text"
                                value={profile.recruiterName}
                                onChange={(e) => setProfile({ ...profile, recruiterName: e.target.value })}
                                className="w-full p-2 border rounded"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700">Company Name</label>
                            <input
                                type="text"
                                value={profile.companyName}
                                onChange={(e) => setProfile({ ...profile, companyName: e.target.value })}
                                className="w-full p-2 border rounded"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700">Designation</label>
                            <input
                                type="text"
                                value={profile.designation}
                                onChange={(e) => setProfile({ ...profile, designation: e.target.value })}
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
                <h3 className="text-xl font-semibold mb-2">Post New Job</h3>
                <form onSubmit={handleJobSubmit} className="max-w-md">
                    <div className="mb-4">
                        <label className="block text-gray-700">Title</label>
                        <input
                            type="text"
                            value={newJob.title}
                            onChange={(e) => setNewJob({ ...newJob, title: e.target.value })}
                            className="w-full p-2 border rounded"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">Description</label>
                        <textarea
                            value={newJob.description}
                            onChange={(e) => setNewJob({ ...newJob, description: e.target.value })}
                            className="w-full p-2 border rounded"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">Job Type</label>
                        <input
                            type="text"
                            value={newJob.jobType}
                            onChange={(e) => setNewJob({ ...newJob, jobType: e.target.value })}
                            className="w-full p-2 border rounded"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">Location</label>
                        <input
                            type="text"
                            value={newJob.location}
                            onChange={(e) => setNewJob({ ...newJob, location: e.target.value })}
                            className="w-full p-2 border rounded"
                            required
                        />
                    </div>
                    <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
                        Post Job
                    </button>
                </form>
            </div>
            <div className="mb-8">
                <h3 className="text-xl font-semibold mb-2">Posted Jobs</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {jobs.map(job => (
                        <div key={job.id} className="border p-4 rounded">
                            <h4 className="text-lg font-bold">{job.title}</h4>
                            <p>{job.description}</p>
                            <p><strong>Type:</strong> {job.jobType}</p>
                            <p><strong>Location:</strong> {job.location}</p>
                            <p><strong>Posted:</strong> {job.datePosted}</p>
                            <button
                                onClick={() => fetchApplications(job.id)}
                                className="bg-purple-500 text-white px-4 py-2 rounded mt-2"
                            >
                                View Applications
                            </button>
                        </div>
                    ))}
                </div>
            </div>
            <div>
                <h3 className="text-xl font-semibold mb-2">Applications</h3>
                <ul>
                    {applications.map(app => (
                        <li key={app.id} className="border p-2 mb-2 rounded">
                            Job ID: {app.jobId}, Student Email: {app.studentEmail}, Status: {app.status}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default RecruiterDashboard;