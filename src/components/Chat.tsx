import React, { useState, useEffect, useRef } from 'react';
import { Send, X, MessageCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import { useToast } from '../context/ToastContext';

interface Message {
  id: string;
  sender_id: string;
  sender_name: string;
  sender_avatar?: string;
  content: string;
  timestamp: string;
  room?: string;
}

interface ChatProps {
  isOpen: boolean;
  onClose: () => void;
  room?: string;
}

const Chat: React.FC<ChatProps> = ({ isOpen, onClose, room = 'global' }) => {
  const { user } = useAuth();
  const { socket } = useSocket();
  const { showToast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Listen for messages
  useEffect(() => {
    if (!socket) return;

    setIsLoadingMessages(true);

    // Listen for load-messages event (sent after join-room)
    const handleLoadMessages = (loadedMessages: Message[]) => {
      setMessages(loadedMessages || []);
      setIsLoadingMessages(false);
    };

    // Listen for new messages
    const handleMessage = (message: Message) => {
      setMessages(prev => [...prev, message]);
    };

    // Listen for typing indicator
    const handleUserTyping = () => {
      setIsTyping(true);
      setTimeout(() => setIsTyping(false), 3000);
    };

    // Register listeners BEFORE joining room
    socket.on('load-messages', handleLoadMessages);
    socket.on('new-message', handleMessage);
    socket.on('user-typing', handleUserTyping);

    // Join room (this will trigger 'load-messages' event)
    socket.emit('join-room', room);

    return () => {
      socket.off('load-messages', handleLoadMessages);
      socket.off('new-message', handleMessage);
      socket.off('user-typing', handleUserTyping);
      socket.emit('leave-room', room);
    };
  }, [socket, room]);

  const handleSendMessage = () => {
    if (!inputValue.trim() || !socket || !user) return;

    const message: Message = {
      id: Date.now().toString(),
      sender_id: user?.id || 'unknown',
      sender_name: user?.name || 'Anonymous',
      sender_avatar: user?.avatar,
      content: inputValue,
      timestamp: new Date().toISOString(),
      room
    };

    try {
      socket.emit('send-message', message);
      // Don't add to messages here - let the server broadcast it via new-message event
      setInputValue('');
    } catch (error) {
      console.error('Failed to send message:', error);
      showToast('Failed to send message', 'error');
    }
  };

  const handleTyping = () => {
    if (!socket) return;

    socket.emit('typing', { room, user: user?.name });

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      socket.emit('stop-typing', { room });
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-0 right-4 w-96 h-96 bg-white dark:bg-gray-800 rounded-lg shadow-2xl flex flex-col z-40 border border-gray-200 dark:border-gray-700">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-t-lg">
        <div className="flex items-center gap-2">
          <MessageCircle className="w-5 h-5 text-white" />
          <h3 className="font-bold text-white">Chat - {room}</h3>
        </div>
        <button
          onClick={onClose}
          className="p-1 hover:bg-white hover:bg-opacity-20 rounded transition-colors"
          aria-label="Close chat"
        >
          <X className="w-5 h-5 text-white" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-900">
        {isLoadingMessages ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500 dark:text-gray-400">Loading messages...</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500 dark:text-gray-400">No messages yet. Start the conversation!</p>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-2 ${
                message.sender_id === user?.id
                  ? 'justify-end'
                  : 'justify-start'
              }`}
            >
              {message.sender_id !== user?.id && (
                <img
                  src={message.sender_avatar || 'https://via.placeholder.com/32'}
                  alt={message.sender_name}
                  className="w-8 h-8 rounded-full object-cover"
                />
              )}
              <div
                className={`max-w-xs px-3 py-2 rounded-lg ${
                  message.sender_id === user?.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-600'
                }`}
              >
                {message.sender_id !== user?.id && (
                  <p className="text-xs font-semibold mb-1 opacity-75">
                    {message.sender_name}
                  </p>
                )}
                <p className="text-sm break-words">{message.content}</p>
                <p className="text-xs opacity-70 mt-1">
                  {new Date(message.timestamp).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            </div>
          ))
        )}
        {isTyping && (
          <div className="flex gap-2 items-center">
            <div className="flex gap-1">
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Someone is typing...</p>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-b-lg flex gap-2">
        <textarea
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
            handleTyping();
          }}
          onKeyPress={handleKeyPress}
          placeholder="Type a message..."
          className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white resize-none"
          rows={2}
        />
        <button
          onClick={handleSendMessage}
          disabled={!inputValue.trim()}
          className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
          aria-label="Send message"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default Chat;
