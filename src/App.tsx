import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider, useToast } from './context/ToastContext';
import { DarkModeProvider } from './context/DarkModeContext';
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
import NotificationSettings from './components/NotificationSettings';
import Settings from './components/Settings';
import AdminPaymentDashboard from './components/AdminPaymentDashboard';

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

const RequireAdmin = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  return user && user.role === 'admin' ? <>{children}</> : <Navigate to="/dashboard" replace />;
};

const DashboardRedirect = () => {
  const { user } = useAuth();
  if (!user) return null;
  if (user.role === 'admin') {
    return <Navigate to="/admin/payments" replace />;
  }
  if (user.role === 'teacher') {
    return <Navigate to="/teacher/dashboard" replace />;
  }
  return <Navigate to="/dashboard/student" replace />;
};

function App() {
  return (
    <DarkModeProvider>
      <AuthProvider>
        <SocketProvider>
          <ToastProvider>
            <ToastListWrapper />
            <Router>
              <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-50 transition-colors duration-300 flex flex-col">
                <nav role="navigation">
                  <Navigation />
                </nav>
                <main role="main" className="flex-grow bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
                  <Routes>
                    <Route path="/" element={<Navigate to="/dashboard" replace />} />
                    <Route path="/dashboard" element={<RequireAuth><DashboardRedirect /></RequireAuth>} />
                    <Route path="/dashboard/student" element={<RequireAuth><Dashboard /></RequireAuth>} />

                    {/* Admin routes */}
                    <Route path="/admin/payments" element={<RequireAdmin><AdminPaymentDashboard /></RequireAdmin>} />

                    {/* Course routes */}
                    <Route path="/courses" element={<RequireAuth><CourseCatalog setCurrentView={() => { }} setSelectedCourse={() => { }} /></RequireAuth>} />
                    <Route path="/course/:id" element={<RequireAuth><CourseDetail courseId="" setCurrentView={() => { }} /></RequireAuth>} />
                    <Route path="/my-learning" element={<RequireAuth><MyLearning setCurrentView={() => { }} setSelectedCourse={() => { }} /></RequireAuth>} />

                    {/* Project routes */}
                    <Route path="/projects" element={<RequireAuth><ProjectsList /></RequireAuth>} />
                    <Route path="/create-project" element={<RequireAuth><CreateProject /></RequireAuth>} />

                    {/* User routes */}
                    <Route path="/profile" element={<RequireAuth><Profile setCurrentView={() => { }} /></RequireAuth>} />
                    <Route path="/settings/notifications" element={<RequireAuth><NotificationSettings /></RequireAuth>} />
                    <Route path="/settings" element={
                      <RequireAuth>
                        <Settings />
                      </RequireAuth>
                    } />

                    {/* Teacher-only routes */}
                    <Route path="/teacher/dashboard" element={<RequireTeacher><TeacherDashboard /></RequireTeacher>} />
                    <Route path="/teacher/create-course" element={<RequireTeacher><CreateCourse /></RequireTeacher>} />

                    {/* Auth routes */}
                    <Route path="/login" element={<AuthForm type="login" setCurrentView={() => { }} />} />
                    <Route path="/register" element={<AuthForm type="register" setCurrentView={() => { }} />} />

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
    </DarkModeProvider>
  );
}

// ToastList needs to be outside the main layout div for proper fixed positioning
const ToastListWrapper = () => {
  const { toasts, removeToast } = useToast();
  return <ToastList toasts={toasts} removeToast={removeToast} />;
};

export default App;