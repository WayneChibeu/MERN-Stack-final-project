import React, { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import Navigation from './components/Navigation';
import Dashboard from './components/Dashboard';
import SDGDetail from './components/SDGDetail';
import AuthForm from './components/AuthForm';
import ProjectsList from './components/ProjectsList';

function App() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [selectedSDG, setSelectedSDG] = useState<number>(1);

  const renderCurrentView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard setCurrentView={setCurrentView} setSelectedSDG={setSelectedSDG} />;
      case 'sdg-detail':
        return <SDGDetail sdgId={selectedSDG} setCurrentView={setCurrentView} />;
      case 'projects':
        return <ProjectsList setCurrentView={setCurrentView} />;
      case 'login':
        return <AuthForm type="login" setCurrentView={setCurrentView} />;
      case 'register':
        return <AuthForm type="register" setCurrentView={setCurrentView} />;
      default:
        return <Dashboard setCurrentView={setCurrentView} setSelectedSDG={setSelectedSDG} />;
    }
  };

  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-50">
        <Navigation currentView={currentView} setCurrentView={setCurrentView} />
        {renderCurrentView()}
      </div>
    </AuthProvider>
  );
}

export default App;