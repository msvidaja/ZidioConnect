import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './components/Login';
import Register from './components/Register';
import StudentDashboard from './components/StudentDashboard';
import RecruiterDashboard from './components/RecruiterDashboard';
import { FaGraduationCap, FaBuilding } from 'react-icons/fa';

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect to appropriate dashboard based on user role
    if (user.role === 'STUDENT') {
      return <Navigate to="/student" replace />;
    } else if (user.role === 'RECRUITER') {
      return <Navigate to="/recruiter" replace />;
    } else {
      return <Navigate to="/login" replace />;
    }
  }

  return children;
};

// Role-based redirect component
const RoleBasedRedirect = () => {
  const { user } = useAuth();

  if (user?.role === 'STUDENT') {
    return <Navigate to="/student" replace />;
  } else if (user?.role === 'RECRUITER') {
    return <Navigate to="/recruiter" replace />;
  } else {
    return <Navigate to="/login" replace />;
  }
};

// Landing Page Component
const LandingPage = () => {
  const { user } = useAuth();

  if (user) {
    // Redirect to appropriate dashboard based on role
    if (user.role === 'STUDENT') {
      return <Navigate to="/student" replace />;
    } else if (user.role === 'RECRUITER') {
      return <Navigate to="/recruiter" replace />;
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <div className="flex justify-center mb-8">
            <div className="flex items-center space-x-3">
              <FaGraduationCap className="h-12 w-12 text-primary-600" />
              <h1 className="text-4xl font-bold text-gray-900">ZIDIO Connect</h1>
            </div>
          </div>
          
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            The premier platform connecting talented students with innovative companies. 
            Find your dream job or discover exceptional talent for your organization.
          </p>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-12">
            <div className="card text-center">
              <FaGraduationCap className="h-12 w-12 text-primary-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">For Students</h3>
              <p className="text-gray-600 mb-4">
                Discover internship and job opportunities from top companies. 
                Build your career with meaningful experiences.
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Browse job listings</li>
                <li>• Apply with one click</li>
                <li>• Track application status</li>
                <li>• Build your professional profile</li>
              </ul>
            </div>

            <div className="card text-center">
              <FaBuilding className="h-12 w-12 text-primary-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">For Recruiters</h3>
              <p className="text-gray-600 mb-4">
                Find talented students and recent graduates for your organization. 
                Streamline your hiring process.
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Post job opportunities</li>
                <li>• Review applications</li>
                <li>• Connect with candidates</li>
                <li>• Manage hiring pipeline</li>
              </ul>
            </div>
          </div>

          <div className="flex justify-center space-x-4">
            <a
              href="/register"
              className="btn-primary px-8 py-3 text-lg"
            >
              Get Started
            </a>
            <a
              href="/login"
              className="btn-outline px-8 py-3 text-lg"
            >
              Sign In
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Student Routes */}
          <Route 
            path="/student" 
            element={
              <ProtectedRoute allowedRoles={['STUDENT']}>
                <StudentDashboard />
              </ProtectedRoute>
            } 
          />
          
          {/* Recruiter Routes */}
          <Route 
            path="/recruiter" 
            element={
              <ProtectedRoute allowedRoles={['RECRUITER']}>
                <RecruiterDashboard />
              </ProtectedRoute>
            } 
          />
          
          {/* Legacy dashboard route - redirects to appropriate role-based route */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <RoleBasedRedirect />
              </ProtectedRoute>
            } 
          />
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;