import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, User, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import { useToast } from '../context/ToastContext';

const SOCKET_URL = import.meta.env.VITE_API_URL?.replace(/^http/, 'ws') || window.location.origin;
const NOTIFICATION_SOUND_URL = 'https://cdn.pixabay.com/audio/2022/10/16/audio_12b6fae7b2.mp3'; // royalty-free chime

const Navigation: React.FC = () => {
  const { user, logout } = useAuth();
  const { showToast } = useToast();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [quickActionsOpen, setQuickActionsOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loadingNotis, setLoadingNotis] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const quickActionsRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [soundEnabled, setSoundEnabled] = useState(() => {
    const stored = localStorage.getItem('notification-sound-enabled');
    return stored === null ? true : stored === 'true';
  });
  const { socket } = useSocket();

  // Teacher links
  const teacherLinks = [
    { to: '/teacher/dashboard', label: 'Dashboard' },
    { to: '/teacher/create-course', label: 'Create Course' },
    { to: '/projects', label: 'Projects' },
    { to: '/profile', label: 'Profile' },
  ];

  // Learner links
  const learnerLinks = [
    { to: '/dashboard', label: 'Dashboard' },
    { to: '/courses', label: 'Courses' },
    { to: '/projects', label: 'Projects' },
    { to: '/my-learning', label: 'My Learning', protected: true },
    { to: '/profile', label: 'Profile', protected: true },
  ];

  // Avatar/initials helper
  const getInitials = (name: string) => {
    if (!name) return '';
    const parts = name.split(' ');
    return parts.map((p) => p[0]).join('').toUpperCase();
  };

  // Fetch notifications when bell is clicked
  const fetchNotifications = async () => {
    if (!user) return;
    setLoadingNotis(true);
    try {
      const res = await fetch('/api/notifications', {
        headers: { Authorization: `Bearer ${localStorage.getItem('auth-token')}` }
      });
      if (res.ok) {
        const data = await res.json();
        setNotifications(data);
      }
    } catch (err) {
      // Optionally handle error
    } finally {
      setLoadingNotis(false);
    }
  };

  // Mark notification as read
  const markAsRead = async (id: string) => {
    try {
      const res = await fetch(`/api/notifications/${id}/read`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${localStorage.getItem('auth-token')}` }
      });
      if (res.ok) {
        setNotifications((prev) => prev.map(n => n._id === id ? { ...n, read: true } : n));
      }
    } catch (err) {}
  };

  // Batch mark all as read
  const markAllAsRead = async () => {
    const unread = notifications.filter((n) => !n.read);
    await Promise.all(
      unread.map((n) =>
        fetch(`/api/notifications/${n._id}/read`, {
          method: 'PATCH',
          headers: { Authorization: `Bearer ${localStorage.getItem('auth-token')}` }
        })
      )
    );
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  // Socket.IO setup for real-time notifications
  useEffect(() => {
    if (!user || !socket) return;
    // Listen for notifications
    socket.on('notification', (notification) => {
      setNotifications((prev) => [notification, ...prev]);
      showToast(notification.message, 'info');
      if (soundEnabled && audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play();
      }
    });
    return () => {
      socket.off('notification');
    };
  }, [user, socket, showToast, soundEnabled]);

  // Update localStorage when soundEnabled changes
  useEffect(() => {
    localStorage.setItem('notification-sound-enabled', String(soundEnabled));
  }, [soundEnabled]);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
      if (quickActionsRef.current && !quickActionsRef.current.contains(e.target as Node)) {
        setQuickActionsOpen(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(e.target as Node)) {
        setNotificationsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  // Quick actions for teachers
  const quickActions = [
    { label: 'Create Course', to: '/teacher/create-course' },
    { label: 'Create Project', to: '/create-project' },
  ];

  // Count unread notifications
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <>
      {/* Notification sound */}
      <audio ref={audioRef} src={NOTIFICATION_SOUND_URL} preload="auto" />
      <nav className="bg-white border-b border-gray-100 px-4 py-2 flex items-center justify-between shadow-sm relative">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-green-500 rounded-full flex items-center justify-center font-bold text-white text-lg">SDG</div>
          <span className="font-bold text-lg text-gray-900 tracking-tight">Global Goals</span>
        </div>
        {/* Desktop Links */}
        <div className="hidden md:flex flex-1 items-center justify-center">
          {user && user.role === 'teacher' ? (
            <div className="flex items-center gap-2">
              {teacherLinks.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-400 ${
                    location.pathname === item.to
                      ? 'bg-indigo-600 text-white shadow'
                      : 'text-indigo-700 hover:bg-indigo-50'
                  }`}
                  tabIndex={0}
                >
                  {item.label}
                </Link>
              ))}
              {/* Quick Actions Dropdown */}
              <div className="relative" ref={quickActionsRef}>
                <button
                  className="ml-2 px-3 py-2 rounded-full bg-indigo-100 text-indigo-700 font-bold text-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  aria-haspopup="true"
                  aria-expanded={quickActionsOpen}
                  aria-label="Quick actions"
                  onClick={() => setQuickActionsOpen((v) => !v)}
                >
                  +
                </button>
                {quickActionsOpen && (
                  <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                    {quickActions.map((action) => (
                      <Link
                        key={action.to}
                        to={action.to}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 focus:bg-indigo-100 focus:outline-none"
                        onClick={() => setQuickActionsOpen(false)}
                      >
                        {action.label}
                      </Link>
                    ))}
                </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              {learnerLinks.map((item) => {
                if (item.protected && !user) return null;
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                      location.pathname === item.to
                        ? 'bg-blue-600 text-white shadow'
                        : 'text-gray-700 hover:bg-blue-50'
                    }`}
                    tabIndex={0}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>
          )}
        </div>
        {/* User Info & Actions */}
        <div className="flex items-center gap-4">
          {/* Notifications Bell */}
          {user && (
            <div className="relative" ref={notificationsRef}>
              <button
                className="relative p-2 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
                aria-label="Notifications"
                tabIndex={0}
                onClick={() => {
                  setNotificationsOpen((v) => !v);
                  if (!notificationsOpen) fetchNotifications();
                }}
              >
                <span className="block w-5 h-5 bg-gray-300 rounded-full" />
                {unreadCount > 0 && (
                  <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border-2 border-white" aria-hidden="true" />
                )}
              </button>
              {notificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 max-h-96 overflow-y-auto bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                  <div className="p-3 border-b font-semibold text-gray-800 flex items-center justify-between">
                    <span>Notifications</span>
                    <div className="flex items-center gap-2">
                      <button
                        className="text-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 rounded p-1"
                        aria-label={soundEnabled ? 'Mute notification sounds' : 'Unmute notification sounds'}
                        title={soundEnabled ? 'Mute notification sounds' : 'Unmute notification sounds'}
                        onClick={() => setSoundEnabled((v) => !v)}
                      >
                        {soundEnabled ? '🔊' : '🔇'}
                      </button>
                      {unreadCount > 0 && (
                        <button
                          className="text-xs px-3 py-1 rounded bg-indigo-100 text-indigo-700 font-semibold hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                          onClick={markAllAsRead}
                        >
                          Mark all as read
                        </button>
                      )}
                    </div>
                  </div>
                  {loadingNotis ? (
                    <div className="p-4 text-center text-gray-500">Loading...</div>
                  ) : notifications.length === 0 ? (
                    <div className="p-4 text-center text-gray-500">No notifications</div>
                  ) : (
                    notifications
                      .sort((a, b) => (a.read === b.read ? 0 : a.read ? 1 : -1))
                      .map((n) => (
                        <div
                          key={n._id}
                          className={`px-4 py-3 border-b last:border-b-0 flex items-start gap-2 ${n.read ? 'bg-gray-50' : 'bg-indigo-50'}`}
                        >
                          <div className="flex-1 text-sm text-gray-800">
                            {n.message}
                            <div className="text-xs text-gray-400 mt-1">{new Date(n.createdAt).toLocaleString()}</div>
                          </div>
                          {!n.read && (
                            <button
                              className="ml-2 px-2 py-1 text-xs rounded bg-indigo-600 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                              onClick={() => markAsRead(n._id)}
                            >
                              Mark as read
                            </button>
                          )}
          </div>
                      ))
                  )}
                </div>
              )}
            </div>
          )}
          {/* Profile Dropdown */}
          {user ? (
            <div className="relative" ref={profileRef}>
              <button
                className="flex items-center gap-2 px-3 py-2 rounded-md bg-gray-50 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
                aria-haspopup="true"
                aria-expanded={profileOpen}
                aria-label="Profile menu"
                onClick={() => setProfileOpen((v) => !v)}
                tabIndex={0}
              >
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt="Your profile"
                    className="w-8 h-8 rounded-full border-2 border-indigo-200 object-cover"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-sm">
                    {getInitials(user.name)}
                  </div>
                )}
                <span className="text-sm font-medium text-gray-900">{user.name}</span>
                {user.role === 'teacher' && (
                  <span className="px-2 py-1 rounded bg-indigo-100 text-indigo-700 text-xs font-semibold ml-1">Teacher</span>
                )}
              </button>
              {profileOpen && (
                <div className="absolute right-0 mt-2 w-44 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 focus:bg-indigo-100 focus:outline-none"
                    onClick={() => setProfileOpen(false)}
                  >
                    Profile
                  </Link>
                  <button
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 focus:bg-indigo-100 focus:outline-none"
                    onClick={() => setProfileOpen(false)}
                  >
                    Settings
                  </button>
                <button
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 focus:bg-red-100 focus:outline-none"
                  onClick={logout}
                >
                    Logout
                </button>
                </div>
              )}
              </div>
            ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                  className="px-4 py-2 rounded-md text-sm font-medium text-blue-600 hover:bg-blue-50 transition-colors"
                >
                  Login
              </Link>
              <Link
                to="/register"
                  className="px-4 py-2 rounded-md text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                >
                  Register
              </Link>
              </div>
            )}
          {/* Hamburger for mobile */}
          <button
            className="md:hidden p-2 rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400 ml-2"
            aria-label="Open menu"
            onClick={() => setIsMenuOpen((v) => !v)}
          >
            <span className="block w-6 h-0.5 bg-gray-700 mb-1" />
            <span className="block w-6 h-0.5 bg-gray-700 mb-1" />
            <span className="block w-6 h-0.5 bg-gray-700" />
          </button>
          </div>
      </nav>
      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-30 flex flex-col items-end">
          <div className="w-64 bg-white h-full shadow-lg p-6 flex flex-col gap-4">
            <button
              className="self-end mb-4 p-2 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
              aria-label="Close menu"
              onClick={() => setIsMenuOpen(false)}
            >
              <span className="block w-6 h-0.5 bg-gray-700 mb-1" />
              <span className="block w-6 h-0.5 bg-gray-700 mb-1" />
              <span className="block w-6 h-0.5 bg-gray-700" />
            </button>
            {user && user.role === 'teacher' ? (
              <>
                {teacherLinks.map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    className={`block px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      location.pathname === item.to
                        ? 'bg-indigo-600 text-white shadow'
                        : 'text-indigo-700 hover:bg-indigo-50'
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
                <div className="border-t border-gray-200 my-2" />
                {quickActions.map((action) => (
                  <Link
                    key={action.to}
                    to={action.to}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 focus:bg-indigo-100 focus:outline-none"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {action.label}
                  </Link>
                ))}
              </>
            ) : (
              <>
                {learnerLinks.map((item) => {
              if (item.protected && !user) return null;
              return (
                    <Link
                      key={item.to}
                      to={item.to}
                      className={`block px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                        location.pathname === item.to
                          ? 'bg-blue-600 text-white shadow'
                          : 'text-gray-700 hover:bg-blue-50'
                      }`}
                      onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                    </Link>
              );
            })}
              </>
            )}
            <div className="border-t border-gray-200 my-2" />
            {user ? (
              <button
                className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 focus:bg-red-100 focus:outline-none"
                onClick={() => { setIsMenuOpen(false); logout(); }}
              >
                Logout
              </button>
            ) : (
              <>
                <Link
                  to="/login"
                  className="block px-4 py-2 rounded-md text-sm font-medium text-blue-600 hover:bg-blue-50 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="block px-4 py-2 rounded-md text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Navigation;