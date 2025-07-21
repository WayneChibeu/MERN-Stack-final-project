import React, { useState, useEffect } from 'react';

const NOTIFICATION_SOUNDS = [
  {
    label: 'Chime',
    url: 'https://cdn.pixabay.com/audio/2022/10/16/audio_12b6fae7b2.mp3',
  },
  {
    label: 'Pop',
    url: 'https://cdn.pixabay.com/audio/2022/03/15/audio_115b9b6b7e.mp3',
  },
  {
    label: 'Bell',
    url: 'https://cdn.pixabay.com/audio/2022/10/16/audio_12b6fae7b2.mp3',
  },
];

const NotificationSettings: React.FC = () => {
  const [soundEnabled, setSoundEnabled] = useState(() => {
    const stored = localStorage.getItem('notification-sound-enabled');
    return stored === null ? true : stored === 'true';
  });
  const [selectedSound, setSelectedSound] = useState(() => {
    return localStorage.getItem('notification-sound-url') || NOTIFICATION_SOUNDS[0].url;
  });
  const [pushEnabled, setPushEnabled] = useState(() => {
    return localStorage.getItem('notification-push-enabled') === 'true';
  });
  const [pushSupported, setPushSupported] = useState(false);
  const [permission, setPermission] = useState(Notification.permission);

  useEffect(() => {
    setPushSupported('Notification' in window && 'serviceWorker' in navigator);
  }, []);

  useEffect(() => {
    localStorage.setItem('notification-sound-enabled', String(soundEnabled));
  }, [soundEnabled]);

  useEffect(() => {
    localStorage.setItem('notification-sound-url', selectedSound);
  }, [selectedSound]);

  useEffect(() => {
    localStorage.setItem('notification-push-enabled', String(pushEnabled));
  }, [pushEnabled]);

  const requestPushPermission = async () => {
    if (!pushSupported) return;
    const result = await Notification.requestPermission();
    setPermission(result);
    if (result === 'granted') {
      setPushEnabled(true);
      localStorage.setItem('notification-push-enabled', 'true');
    } else {
      setPushEnabled(false);
      localStorage.setItem('notification-push-enabled', 'false');
    }
  };

  const sendTestNotification = () => {
    if (pushSupported && permission === 'granted') {
      navigator.serviceWorker.getRegistration().then(reg => {
        if (reg) {
          reg.showNotification('EduConnect Test Notification', {
            body: 'This is a test push notification!',
            icon: '/favicon.ico',
          });
        } else {
          // fallback to Notification API
          new Notification('EduConnect Test Notification', {
            body: 'This is a test push notification!',
            icon: '/favicon.ico',
          });
        }
      });
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-xl shadow mt-8">
      <h2 className="text-2xl font-bold mb-4">Notification Settings</h2>
      <div className="mb-6">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={soundEnabled}
            onChange={e => setSoundEnabled(e.target.checked)}
            className="form-checkbox h-5 w-5 text-blue-600"
          />
          <span className="text-gray-800">Enable notification sounds</span>
        </label>
        <div className="mt-2">
          <label className="block text-sm text-gray-600 mb-1">Notification sound</label>
          <select
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={selectedSound}
            onChange={e => setSelectedSound(e.target.value)}
            disabled={!soundEnabled}
          >
            {NOTIFICATION_SOUNDS.map((sound) => (
              <option key={sound.url} value={sound.url}>{sound.label}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="mb-6">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={pushEnabled}
            onChange={e => {
              if (e.target.checked) requestPushPermission();
              else {
                setPushEnabled(false);
                localStorage.setItem('notification-push-enabled', 'false');
              }
            }}
            className="form-checkbox h-5 w-5 text-blue-600"
            disabled={!pushSupported}
          />
          <span className="text-gray-800">Enable browser push notifications</span>
        </label>
        <div className="mt-2 text-xs text-gray-500">
          {pushSupported ? (
            permission === 'granted' ? 'Push notifications are enabled.' : 'You will be prompted for permission.'
          ) : (
            'Push notifications are not supported in this browser.'
          )}
        </div>
        {pushEnabled && permission === 'granted' && (
          <button
            className="mt-3 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onClick={sendTestNotification}
            type="button"
          >
            Send Test Notification
          </button>
        )}
      </div>
    </div>
  );
};

export default NotificationSettings; 