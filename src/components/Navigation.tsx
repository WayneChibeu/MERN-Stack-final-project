import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, Trash2, CheckSquare, Bell, Moon, Sun, MessageCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import { useToast, ToastType } from '../context/ToastContext';
import { useDarkMode } from '../context/DarkModeContext';
import { User } from '../types';
import Chat from './Chat';
import type { Socket } from 'socket.io-client';

const NOTIFICATION_SOUNDS = [
  {
    label: 'Chime',
    url: '/audio_12b6fae7b2.mp3',
  },
  {
    label: 'Pop',
    url: '/audio_12b6fae7b2.mp3',
  },
  {
    label: 'Bell',
    url: '/audio_12b6fae7b2.mp3',
  },
];

// Notification type
interface NotificationType {
  _id: string;
  message: string;
  createdAt: string;
  read?: boolean;
  type?: string;
  userId?: string;
}

// Helper to group notifications by day
function groupNotificationsByDay(notifications: NotificationType[]): Record<string, NotificationType[]> {
  const groups: Record<string, NotificationType[]> = {};
  notifications.forEach((n: NotificationType) => {
    const date = new Date(n.createdAt);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);
    const label = date.toDateString() === today.toDateString()
      ? 'Today'
      : date.toDateString() === yesterday.toDateString()
      ? 'Yesterday'
      : date.toLocaleDateString();
    if (!groups[label]) groups[label] = [];
    groups[label].push(n);
  });
  return groups;
}

const Navigation: React.FC = () => {
  // Guard useAuth to avoid test crashes when the auth context/hook isn't
  // available in the test environment.
  let user: User | null = null;
  let logout: (() => void) | null = null;
  try {
    const auth = useAuth();
    user = auth?.user ?? null;
    logout = auth?.logout ?? null;
  } catch {
    user = null;
    logout = null;
  }
  
  // Guard useDarkMode for tests
  let isDarkMode = false;
  let toggleDarkMode = () => {};
  try {
    const darkMode = useDarkMode();
    isDarkMode = darkMode?.isDarkMode ?? false;
    toggleDarkMode = darkMode?.toggleDarkMode ?? (() => {});
  } catch {
    isDarkMode = false;
    toggleDarkMode = () => {};
  }
  
  // Guard useToast and useSocket for tests where providers may not be present
  let showToast: (msg: string, type?: ToastType) => void = () => {};
  try {
    const toast = useToast();
    showToast = toast?.showToast || (() => {});
  } catch {
    showToast = () => {};
  }

  // Keep a ref to the latest showToast so we can use it in effects without
  // forcing those effects to depend on the function identity (which may be
  // unstable in some test setups). This also satisfies the eslint warning
  // about changing effect dependencies.
  const showToastRef = React.useRef<(msg: string, type?: ToastType) => void>(() => {});
  showToastRef.current = showToast;

  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [quickActionsOpen, setQuickActionsOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationType[]>([]);
  const [loadingNotis, setLoadingNotis] = useState<boolean>(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const quickActionsRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [soundEnabled, setSoundEnabled] = useState(() => {
    const stored = localStorage.getItem('notification-sound-enabled');
    return stored === null ? true : stored === 'true';
  });
  let socket: Socket | null = null;
  try {
    const s = useSocket();
    socket = s?.socket ?? null;
  } catch {
    socket = null;
  }
  const [touchStartY, setTouchStartY] = useState<number | null>(null);
  const [touchCurrentY, setTouchCurrentY] = useState<number | null>(null);
  const bottomSheetRef = useRef<HTMLDivElement>(null);
  const [selectedSound, setSelectedSound] = useState(() => {
    return localStorage.getItem('notification-sound-url') || NOTIFICATION_SOUNDS[0].url;
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [selectedNotifications, setSelectedNotifications] = useState<string[]>([]);

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

  // API base (from central config)
  // API_URL is imported at module scope above

  // Fetch notifications when bell is clicked
  const fetchNotifications = async () => {
    if (!user) return;
    setLoadingNotis(true);
    try {
      const dataTyped: NotificationType[] = await (await import('../utils/apiFetch')).apiFetch('/notifications');
      setNotifications(dataTyped);
    } catch (err) {
      // Optionally handle error
      console.error('Failed to fetch notifications', err);
    } finally {
      setLoadingNotis(false);
    }
  };

  // Mark notification as read
  const markAsRead = async (id: string) => {
    try {
      await (await import('../utils/apiFetch')).apiFetch(`/notifications/${id}/read`, { method: 'PATCH' });
      setNotifications((prev: NotificationType[]) => prev.map((n: NotificationType) => n._id === id ? { ...n, read: true } : n));
    } catch (err) {
      console.error('Failed to mark notification as read', err);
    }
  };

  // Batch mark all as read
  const markAllAsRead = async () => {
    const unread = notifications.filter((n: NotificationType) => !n.read);
    await Promise.all(
        unread.map(async (n: NotificationType) =>
          (await import('../utils/apiFetch')).apiFetch(`/notifications/${n._id}/read`, { method: 'PATCH' })
        )
      );
    setNotifications((prev: NotificationType[]) => prev.map((n: NotificationType) => ({ ...n, read: true })));
  };

  // Socket.IO setup for real-time notifications
  useEffect(() => {
    if (!user || !socket) return;
    // Listen for notifications
    const handler = (notification: NotificationType) => {
      setNotifications((prev: NotificationType[]) => [notification, ...prev]);
      // use ref to avoid stale/unstable function in deps
      showToastRef.current(notification.message, 'info');
      if (soundEnabled && audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play();
      }
      // Animate badge
      const badge = document.getElementById('notification-badge');
      if (badge) {
        badge.classList.add('animate-ping');
        setTimeout(() => badge.classList.remove('animate-ping'), 600);
      }
    };
    socket.on('notification', handler);
    return () => {
      socket.off('notification', handler);
    };
  }, [user, socket, soundEnabled]);

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
  const unreadCount = notifications.filter((n: NotificationType) => !n.read).length;

  // Filter notifications based on search and type
  const filteredNotifications = notifications
    .filter((n: NotificationType) => {
      const matchesSearch = n.message.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = filterType === 'all' || n.type === filterType;
      return matchesSearch && matchesType;
    })
    .sort((a: NotificationType, b: NotificationType) => (a.read === b.read ? 0 : a.read ? 1 : -1));

  // Bulk actions
  const handleBulkMarkAsRead = () => {
    selectedNotifications.forEach((id: string) => markAsRead(id));
    setSelectedNotifications([]);
  };

  const handleBulkDelete = async () => {
    // Here you would call your API to delete notifications
    // For now, we'll just remove them from the local state
    setNotifications((prev: NotificationType[]) => prev.filter((n: NotificationType) => !selectedNotifications.includes(n._id)));
    setSelectedNotifications([]);
  };

  useEffect(() => {
    setProfileOpen(false);
  }, [user, location]);

  return (
    <>
      {/* Notification sound */}
      <audio ref={audioRef} src={selectedSound} preload="auto" />
      <nav className="bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 px-4 py-2 flex items-center justify-between shadow-sm relative">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-green-500 rounded-full flex items-center justify-center font-bold text-white text-lg">SDG</div>
          <span className="font-bold text-lg text-gray-900 dark:text-white tracking-tight">Global Goals</span>
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
                  onClick={() => setQuickActionsOpen((v: boolean) => !v)}
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
          {/* Dark Mode Toggle - Modern Animated Switch */}
          <button
            onClick={toggleDarkMode}
            className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-1 dark:focus:ring-offset-gray-900 ${
              isDarkMode ? 'bg-gray-700' : 'bg-gray-300'
            }`}
            aria-label="Toggle dark mode"
            title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {/* Animated toggle circle */}
            <span
              className={`inline-block h-6 w-6 transform rounded-full bg-white shadow-lg transition-transform duration-300 flex items-center justify-center ${
                isDarkMode ? 'translate-x-7' : 'translate-x-1'
              }`}
            >
              {isDarkMode ? (
                <Moon className="w-4 h-4 text-gray-700" />
              ) : (
                <Sun className="w-4 h-4 text-yellow-500" />
              )}
            </span>
          </button>
          
          {/* Chat Button */}
          {user && (
            <button
              onClick={() => setIsChatOpen(!isChatOpen)}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-colors"
              aria-label="Open community chat"
              title="Community Chat"
            >
              <MessageCircle className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            </button>
          )}

          {/* Notifications Bell */}
          {user && (
            <div className="relative" ref={notificationsRef}>
              <button
                className="relative p-2 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400 flex items-center justify-center"
                aria-label={`Notifications (${unreadCount} unread)`}
                title={`Notifications (${unreadCount} unread)`}
                tabIndex={0}
                onClick={() => {
                  setNotificationsOpen((v: boolean) => !v);
                  if (!notificationsOpen) fetchNotifications();
                }}
              >
                <Bell className={`w-6 h-6 ${unreadCount > 0 ? 'text-indigo-600' : 'text-gray-700'}`} />
                {unreadCount > 0 && (
                  <span
                    id="notification-badge"
                    className="absolute -top-1 -right-1 min-w-[18px] h-5 px-1 text-xs leading-5 bg-red-600 text-white rounded-full flex items-center justify-center font-semibold border-2 border-white"
                    aria-live="polite"
                    aria-atomic="true"
                  >
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>
              {/* Notification Dropdown/Bottom Sheet */}
              {notificationsOpen && (
                <div>
                  {/* Desktop Dropdown */}
                  <div className="hidden md:block absolute right-0 mt-2 w-80 max-h-96 overflow-y-auto bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                    {/* ... existing notification dropdown content ... */}
                    <div className="p-3 border-b font-semibold text-gray-800 flex items-center justify-between">
                      <span>Notifications</span>
                      <div className="flex items-center gap-2">
                        <button
                          className="text-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 rounded p-1"
                          aria-label={soundEnabled ? 'Mute notification sounds' : 'Unmute notification sounds'}
                          title={soundEnabled ? 'Mute notification sounds' : 'Unmute notification sounds'}
                          onClick={() => setSoundEnabled((v: boolean) => !v)}
                        >
                          {soundEnabled ? '🔊' : '🔇'}
                        </button>
                        <select
                          className="text-xs px-2 py-1 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                          value={selectedSound}
                          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                            setSelectedSound(e.target.value);
                            localStorage.setItem('notification-sound-url', e.target.value);
                          }}
                          aria-label="Select notification sound"
                        >
                          {NOTIFICATION_SOUNDS.map((sound) => (
                            <option key={sound.url} value={sound.url}>{sound.label}</option>
                          ))}
                        </select>
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
                  {/* Mobile Bottom Sheet */}
                  <div className="md:hidden fixed inset-0 z-50 flex items-end justify-center">
                    <div className="absolute inset-0 bg-black bg-opacity-30" onClick={() => setNotificationsOpen(false)} aria-label="Close notifications overlay" />
                    <div
                      ref={bottomSheetRef}
                      className={`relative w-full max-w-md bg-white rounded-t-2xl shadow-lg border-t border-gray-200 transition-transform duration-300 ${touchCurrentY !== null && touchCurrentY - (touchStartY ?? 0) > 0 ? 'translate-y-[' + (touchCurrentY - (touchStartY ?? 0)) + 'px]' : 'translate-y-0'} animate-slide-up`}
                      style={{ touchAction: 'none' }}
                      onTouchStart={e => setTouchStartY(e.touches[0].clientY)}
                      onTouchMove={e => setTouchCurrentY(e.touches[0].clientY)}
                      onTouchEnd={() => {
                        if (touchStartY !== null && touchCurrentY !== null && touchCurrentY - touchStartY > 80) {
                          setNotificationsOpen(false);
                        }
                        setTouchStartY(null);
                        setTouchCurrentY(null);
                      }}
                    >
                      {/* Header */}
                      <div className="p-4 border-b">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-semibold">Notifications</h3>
                          <button
                            onClick={() => setNotificationsOpen(false)}
                            className="text-gray-400 hover:text-gray-600"
                          >
                            &times;
                          </button>
                        </div>
                        
                        {/* Search and Filter */}
                        <div className="flex gap-2 mb-2">
                          <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                              type="text"
                              placeholder="Search notifications..."
                              value={searchQuery}
                              onChange={(e) => setSearchQuery(e.target.value)}
                              className="w-full pl-9 pr-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                          <select
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value)}
                            className="px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="all">All</option>
                            <option value="system">System</option>
                            <option value="message">Messages</option>
                            <option value="project">Projects</option>
                          </select>
                        </div>

                        {/* Bulk Actions */}
                        {selectedNotifications.length > 0 && (
                          <div className="flex items-center gap-2 mt-2 p-2 bg-gray-50 rounded-lg">
                            <span className="text-sm text-gray-600">{selectedNotifications.length} selected</span>
                            <button
                              onClick={handleBulkMarkAsRead}
                              className="ml-auto px-3 py-1 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                            >
                              <CheckSquare className="w-4 h-4" />
                            </button>
                            <button
                              onClick={handleBulkDelete}
                              className="px-3 py-1 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Notification List */}
                      <div className="max-h-[60vh] overflow-y-auto">
                        {filteredNotifications.length === 0 ? (
                          <div className="p-4 text-center text-gray-500">
                            {searchQuery ? 'No notifications match your search' : 'No notifications'}
                          </div>
                        ) : (
                          Object.entries(groupNotificationsByDay(filteredNotifications)).map(([day, group]) => (
                            <div key={day}>
                              <div className="px-4 py-2 text-xs font-semibold text-gray-500 bg-gray-50 sticky top-0">
                                {day}
                              </div>
                              {group.map((n) => (
                                <div
                                  key={n._id}
                                  className={`group px-4 py-3 border-b flex items-start gap-2 ${
                                    selectedNotifications.includes(n._id)
                                      ? 'bg-blue-50'
                                      : n.read
                                      ? 'bg-white'
                                      : 'bg-gray-50'
                                  }`}
                                >
                                  <input
                                    type="checkbox"
                                    checked={selectedNotifications.includes(n._id)}
                                    onChange={(e) => {
                                      setSelectedNotifications(prev =>
                                        e.target.checked
                                          ? [...prev, n._id]
                                          : prev.filter(id => id !== n._id)
                                      );
                                    }}
                                    className="mt-1 form-checkbox h-4 w-4 text-blue-600 rounded border-gray-300"
                                  />
                                  <div className="flex-1">
                                    <p className="text-sm text-gray-800">{n.message}</p>
                                    <div className="flex items-center gap-2 mt-1">
                                      <span className="text-xs text-gray-400">
                                        {new Date(n.createdAt).toLocaleString()}
                                      </span>
                                      {!n.read && (
                                        <button
                                          onClick={() => markAsRead(n._id)}
                                          className="text-xs text-blue-600 hover:text-blue-700"
                                        >
                                          Mark as read
                                        </button>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ))
                        )}
                      </div>
                      <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto my-2" />
                    </div>
                  </div>
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
                onClick={() => setProfileOpen((v: boolean) => !v)}
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
                  <Link
                    to="/settings/notifications"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 focus:bg-indigo-100 focus:outline-none"
                    onClick={() => setProfileOpen(false)}
                  >
                    Notification Settings
                  </Link>
                  <Link
                    to="/settings"
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 focus:bg-indigo-100 focus:outline-none"
                    onClick={() => setProfileOpen(false)}
                  >
                    Settings
                  </Link>
                <button
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 focus:bg-red-100 focus:outline-none"
                  onClick={() => logout?.()}
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
            onClick={() => setIsMenuOpen((v: boolean) => !v)}
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
                onClick={() => { setIsMenuOpen(false); logout?.(); }}
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
      
      {/* Chat Component */}
      <Chat isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} room="global" />
    </>
  );
};

export default Navigation;