import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { jobAPI, studentAPI } from '../utils/api';
import { 
  FaSearch, 
  FaBriefcase, 
  FaMapMarkerAlt, 
  FaCalendar, 
  FaUser, 
  FaGraduationCap, 
  FaFileAlt, 
  FaSignOutAlt,
  FaEye,
  FaPlus,
  FaCheckCircle,
  FaClock,
  FaTimesCircle
} from 'react-icons/fa';

const StudentDashboard = () => {
  const { user, logout } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('jobs');
  const [showProfileModal, setShowProfileModal] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [jobsData, applicationsData, profileData] = await Promise.all([
        jobAPI.getAllJobs(),
        jobAPI.getApplicationsByStudent(),
        studentAPI.getProfile(user.email)
      ]);
      
      setJobs(jobsData.data);
      setApplications(applicationsData.data);
      setProfile(profileData.data);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async (jobId) => {
    try {
      await jobAPI.applyForJob({
        student: profile.id,
        job: jobId,
        coverLetter: 'I am interested in this position and would love to be considered for this opportunity.'
      });
      loadData(); // Reload data to update applications
    } catch (error) {
      console.error('Error applying for job:', error);
    }
  };

  const filteredJobs = jobs.filter(job =>
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
              <FaGraduationCap className="h-8 w-8 text-primary-600" />
              <h1 className="text-2xl font-bold text-gray-900">Student Dashboard</h1>
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
        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search jobs by title, description, or location..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

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
              Available Jobs ({filteredJobs.length})
            </button>
            <button
              onClick={() => setActiveTab('applications')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'applications'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              My Applications ({applications.length})
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
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredJobs.map((job) => (
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
                <button
                  onClick={() => handleApply(job.id)}
                  className="btn-primary w-full"
                >
                  Apply Now
                </button>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'applications' && (
          <div className="space-y-4">
            {applications.map((application) => (
              <div key={application.id} className="card">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {application.job?.title}
                    </h3>
                    <p className="text-gray-600 mt-1">{application.job?.description}</p>
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
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="max-w-2xl">
            <div className="card">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">Student Profile</h3>
                <button
                  onClick={() => setShowProfileModal(true)}
                  className="btn-outline flex items-center space-x-2"
                >
                  <FaPlus className="h-4 w-4" />
                  <span>Update Profile</span>
                </button>
              </div>
              
              {profile ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Name</label>
                      <p className="mt-1 text-gray-900">{profile.name}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Email</label>
                      <p className="mt-1 text-gray-900">{profile.email}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">University</label>
                      <p className="mt-1 text-gray-900">{profile.university || 'Not specified'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Major</label>
                      <p className="mt-1 text-gray-900">{profile.major || 'Not specified'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Course</label>
                      <p className="mt-1 text-gray-900">{profile.course || 'Not specified'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">GPA</label>
                      <p className="mt-1 text-gray-900">{profile.gpa || 'Not specified'}</p>
                    </div>
                  </div>
                  {profile.resumeUrl && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Resume</label>
                      <a
                        href={profile.resumeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-1 text-primary-600 hover:text-primary-700 flex items-center space-x-2"
                      >
                        <FaFileAlt className="h-4 w-4" />
                        <span>View Resume</span>
                      </a>
                    </div>
                  )}
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
    </div>
  );
};

export default StudentDashboard;