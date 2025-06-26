import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { jobAPI, recruiterAPI } from '../utils/api';
import { 
  FaSearch, 
  FaBriefcase, 
  FaMapMarkerAlt, 
  FaCalendar, 
  FaUser, 
  FaBuilding, 
  FaPlus,
  FaSignOutAlt,
  FaUsers,
  FaFileAlt,
  FaCheckCircle,
  FaClock,
  FaTimesCircle,
  FaEdit,
  FaTrash
} from 'react-icons/fa';

const RecruiterDashboard = () => {
  const { user, logout } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('jobs');
  const [showJobModal, setShowJobModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [applications, setApplications] = useState([]);

  const [jobForm, setJobForm] = useState({
    title: '',
    description: '',
    jobType: '',
    location: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [jobsData, profileData] = await Promise.all([
        jobAPI.getJobsByRecruiter(),
        recruiterAPI.getByEmail(user.email)
      ]);
      
      setJobs(jobsData.data);
      setProfile(profileData.data);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePostJob = async (e) => {
    e.preventDefault();
    try {
      await jobAPI.postJob(jobForm);
      setJobForm({ title: '', description: '', jobType: '', location: '' });
      setShowJobModal(false);
      loadData();
    } catch (error) {
      console.error('Error posting job:', error);
    }
  };

  const handleViewApplications = async (jobId) => {
    try {
      const response = await jobAPI.getApplicationsByJob(jobId);
      setApplications(response.data);
      setSelectedJob(jobs.find(job => job.id === jobId));
      setActiveTab('applications');
    } catch (error) {
      console.error('Error loading applications:', error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'ACCEPTED': return 'text-green-600 bg-green-100';
      case 'REJECTED': return 'text-red-600 bg-red-100';
      case 'REVIEWING': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'ACCEPTED': return <FaCheckCircle className="h-4 w-4" />;
      case 'REJECTED': return <FaTimesCircle className="h-4 w-4" />;
      case 'REVIEWING': return <FaClock className="h-4 w-4" />;
      default: return <FaClock className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <FaBuilding className="h-8 w-8 text-primary-600" />
              <h1 className="text-2xl font-bold text-gray-900">Recruiter Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-600">Welcome, {user?.name || user?.email}</span>
              <button
                onClick={logout}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-800"
              >
                <FaSignOutAlt className="h-5 w-5" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="mb-8">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('jobs')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'jobs'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              My Jobs ({jobs.length})
            </button>
            <button
              onClick={() => setActiveTab('applications')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'applications'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Applications ({applications.length})
            </button>
            <button
              onClick={() => setActiveTab('profile')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'profile'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Profile
            </button>
          </nav>
        </div>

        {/* Content */}
        {activeTab === 'jobs' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Posted Jobs</h2>
              <button
                onClick={() => setShowJobModal(true)}
                className="btn-primary flex items-center space-x-2"
              >
                <FaPlus className="h-4 w-4" />
                <span>Post New Job</span>
              </button>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {jobs.map((job) => (
                <div key={job.id} className="card-hover">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>
                    <FaBriefcase className="h-5 w-5 text-gray-400" />
                  </div>
                  <p className="text-gray-600 mb-4 line-clamp-3">{job.description}</p>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-500">
                      <FaMapMarkerAlt className="h-4 w-4 mr-2" />
                      {job.location}
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <FaCalendar className="h-4 w-4 mr-2" />
                      Posted {new Date(job.datePosted).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleViewApplications(job.id)}
                      className="btn-outline flex-1 flex items-center justify-center space-x-2"
                    >
                      <FaUsers className="h-4 w-4" />
                      <span>View Applications</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'applications' && (
          <div>
            {selectedJob && (
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  Applications for: {selectedJob.title}
                </h2>
                <button
                  onClick={() => {
                    setSelectedJob(null);
                    setApplications([]);
                    setActiveTab('jobs');
                  }}
                  className="text-primary-600 hover:text-primary-700"
                >
                  ← Back to Jobs
                </button>
              </div>
            )}

            <div className="space-y-4">
              {applications.map((application) => (
                <div key={application.id} className="card">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {application.student?.name || 'Unknown Student'}
                      </h3>
                      <p className="text-gray-600 mt-1">{application.student?.email}</p>
                      {application.coverLetter && (
                        <p className="text-gray-600 mt-2 text-sm">
                          "{application.coverLetter}"
                        </p>
                      )}
                      <div className="flex items-center mt-2 text-sm text-gray-500">
                        <FaCalendar className="h-4 w-4 mr-2" />
                        Applied on {new Date(application.applicationDate).toLocaleDateString()}
                      </div>
                    </div>
                    <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(application.status)}`}>
                      {getStatusIcon(application.status)}
                      <span>{application.status}</span>
                    </div>
                  </div>
                </div>
              ))}
              
              {applications.length === 0 && (
                <div className="text-center py-8">
                  <FaUsers className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">
                    {selectedJob ? 'No applications for this job yet.' : 'Select a job to view applications.'}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="max-w-2xl">
            <div className="card">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">Recruiter Profile</h3>
                <button
                  onClick={() => setShowProfileModal(true)}
                  className="btn-outline flex items-center space-x-2"
                >
                  <FaEdit className="h-4 w-4" />
                  <span>Update Profile</span>
                </button>
              </div>
              
              {profile ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Name</label>
                      <p className="mt-1 text-gray-900">{profile.recruiterName}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Email</label>
                      <p className="mt-1 text-gray-900">{profile.recruiterEmail}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Company</label>
                      <p className="mt-1 text-gray-900">{profile.companyName || 'Not specified'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Designation</label>
                      <p className="mt-1 text-gray-900">{profile.designation || 'Not specified'}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <FaUser className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No profile information available</p>
                  <button
                    onClick={() => setShowProfileModal(true)}
                    className="btn-primary mt-4"
                  >
                    Create Profile
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Job Modal */}
      {showJobModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Post New Job</h3>
            <form onSubmit={handlePostJob} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Job Title</label>
                <input
                  type="text"
                  required
                  className="input-field"
                  value={jobForm.title}
                  onChange={(e) => setJobForm({ ...jobForm, title: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  required
                  rows="4"
                  className="input-field"
                  value={jobForm.description}
                  onChange={(e) => setJobForm({ ...jobForm, description: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Job Type</label>
                <select
                  required
                  className="input-field"
                  value={jobForm.jobType}
                  onChange={(e) => setJobForm({ ...jobForm, jobType: e.target.value })}
                >
                  <option value="">Select job type</option>
                  <option value="FULL_TIME">Full Time</option>
                  <option value="PART_TIME">Part Time</option>
                  <option value="INTERNSHIP">Internship</option>
                  <option value="CONTRACT">Contract</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                <input
                  type="text"
                  required
                  className="input-field"
                  value={jobForm.location}
                  onChange={(e) => setJobForm({ ...jobForm, location: e.target.value })}
                />
              </div>
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => setShowJobModal(false)}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary flex-1">
                  Post Job
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecruiterDashboard;