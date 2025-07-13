import React, { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
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

function App() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);

  const renderCurrentView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard setCurrentView={setCurrentView} />;
      case 'courses':
        return <CourseCatalog setCurrentView={setCurrentView} setSelectedCourse={setSelectedCourse} />;
      case 'course-detail':
        return <CourseDetail courseId={selectedCourse} setCurrentView={setCurrentView} />;
      case 'create-course':
        return <CreateCourse setCurrentView={setCurrentView} />;
      case 'my-learning':
        return <MyLearning setCurrentView={setCurrentView} setSelectedCourse={setSelectedCourse} />;
      case 'teacher-dashboard':
        return <TeacherDashboard setCurrentView={setCurrentView} setSelectedCourse={setSelectedCourse} />;
      case 'profile':
        return <Profile setCurrentView={setCurrentView} />;
      case 'login':
        return <AuthForm type="login" setCurrentView={setCurrentView} />;
      case 'register':
        return <AuthForm type="register" setCurrentView={setCurrentView} />;
      case 'create-project':
        return <CreateProject setCurrentView={setCurrentView} />;
      default:
        return <Dashboard setCurrentView={setCurrentView} />;
    }
  };

  return (
    <AuthProvider>
      <ToastProvider>
        <ToastListWrapper />
        <div className="min-h-screen bg-gray-50">
          <Navigation currentView={currentView} setCurrentView={setCurrentView} />
          {renderCurrentView()}
        </div>
      </ToastProvider>
    </AuthProvider>
  );
}

// ToastList needs to be outside the main layout div for proper fixed positioning
const ToastListWrapper = () => {
  const { toasts, removeToast } = useToast();
  return <ToastList toasts={toasts} removeToast={removeToast} />;
};

export default App;