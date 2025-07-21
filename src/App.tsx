import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider, useToast } from './context/ToastContext';
import ToastList from './components/Toast';
import Navigation from './components/Navigation';
import Dashboard from './components/Dashboard';
import CourseCatalog from './components/CourseCatalog';
import CourseDetail from './components/CourseDetail';
import CreateCourse from './components/CreateCourse';
import MyLearning from './components/MyLearning';
import TeacherDashboard from './components/TeacherDashboard';
import AuthForm from './components/AuthForm';
import Profile from './components/Profile';
import CreateProject from './components/CreateProject';
import ProjectsList from './components/ProjectsList';
import { SocketProvider } from './context/SocketContext';
import Footer from './components/Footer';

// Route protection wrappers
const RequireAuth = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  return user ? <>{children}</> : <Navigate to="/login" replace />;
};

const RequireTeacher = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  return user && user.role === 'teacher' ? <>{children}</> : <Navigate to="/dashboard" replace />;
};

const DashboardRedirect = () => {
  const { user } = useAuth();
  if (!user) return null;
  if (user.role === 'teacher') {
    return <Navigate to="/teacher/dashboard" replace />;
  }
  return <Navigate to="/dashboard/student" replace />;
};

function App() {
  return (
    <AuthProvider>
      <SocketProvider>
        <ToastProvider>
          <ToastListWrapper />
          <Router>
            <div className="min-h-screen bg-gray-50 flex flex-col">
              <nav role="navigation">
                <Navigation />
              </nav>
              <main role="main" className="flex-grow">
                <Routes>
                  <Route path="/" element={<Navigate to="/dashboard" replace />} />
                  <Route path="/dashboard" element={<RequireAuth><DashboardRedirect /></RequireAuth>} />
                  <Route path="/dashboard/student" element={<RequireAuth><Dashboard /></RequireAuth>} />
                  <Route path="/courses" element={<RequireAuth><CourseCatalog /></RequireAuth>} />
                  <Route path="/course/:id" element={<RequireAuth><CourseDetail /></RequireAuth>} />
                  <Route path="/my-learning" element={<RequireAuth><MyLearning /></RequireAuth>} />
                  <Route path="/projects" element={<RequireAuth><ProjectsList /></RequireAuth>} />
                  <Route path="/create-project" element={<RequireAuth><CreateProject /></RequireAuth>} />
                  <Route path="/profile" element={<RequireAuth><Profile /></RequireAuth>} />
                  {/* Teacher-only routes */}
                  <Route path="/teacher/dashboard" element={<RequireTeacher><TeacherDashboard /></RequireTeacher>} />
                  <Route path="/teacher/create-course" element={<RequireTeacher><CreateCourse /></RequireTeacher>} />
                  {/* Auth routes */}
                  <Route path="/login" element={<AuthForm type="login" />} />
                  <Route path="/register" element={<AuthForm type="register" />} />
                  {/* Fallback */}
                  <Route path="*" element={<Navigate to="/dashboard" replace />} />
                </Routes>
              </main>
              <Footer />
            </div>
          </Router>
        </ToastProvider>
      </SocketProvider>
    </AuthProvider>
  );
}

// ToastList needs to be outside the main layout div for proper fixed positioning
const ToastListWrapper = () => {
  const { toasts, removeToast } = useToast();
  return <ToastList toasts={toasts} removeToast={removeToast} />;
};

export default App;