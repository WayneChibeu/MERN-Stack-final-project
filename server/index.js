import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import connectDB from './config/database.js';
import User from './models/User.js';
import Project from './models/Project.js';
import Contribution from './models/Contribution.js';
import Course from './models/Course.js';
import Enrollment from './models/Enrollment.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import Notification from './models/Notification.js';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import {
  loginLimiter,
  apiLimiter,
  signupLimiter,
  sanitizeData,
  validateEmail,
  validatePassword,
  validateUsername,
  sanitizeString,
  securityHeaders,
  securityLogger,
  preventParameterPollution,
} from './middleware/security.js';

dotenv.config();

// Configure frontend origin via env or fallback to sensible defaults.
// In production set FRONTEND_URL to your deployed frontend (e.g. https://mern-stack-final-project.vercel.app)
const FRONTEND_URL = process.env.FRONTEND_URL || (process.env.NODE_ENV === 'production'
  ? 'https://mern-stack-final-project.vercel.app'
  : 'http://localhost:5173');

const app = express();
const server = http.createServer(app);

// Central CORS options used for both Express and Socket.IO
const corsOptions = {
  origin: function (origin, callback) {
    // In development, allow any origin
    if (process.env.NODE_ENV === 'development') {
      return callback(null, true);
    }
    // In production, be more restrictive
    if (!origin) return callback(null, true);
    if (origin === FRONTEND_URL) return callback(null, true);
    return callback(new Error('Not allowed by CORS'));
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization']
};

const io = new SocketIOServer(server, {
  cors: {
    origin: FRONTEND_URL,
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Store userId <-> socketId mapping and chat rooms
const userSockets = new Map();
const chatRooms = new Map(); // room -> [messages]

io.on('connection', (socket) => {
  // Listen for user identification
  socket.on('identify', (userId) => {
    userSockets.set(userId, socket.id);
  });

  // Chat functionality
  socket.on('join-room', (room) => {
    socket.join(room);
    // Initialize room if doesn't exist
    if (!chatRooms.has(room)) {
      chatRooms.set(room, []);
    }
    // Send existing messages to the user
    socket.emit('load-messages', chatRooms.get(room) || []);
  });

  socket.on('leave-room', (room) => {
    socket.leave(room);
  });

  socket.on('load-messages', (data, callback) => {
    const messages = chatRooms.get(data.room) || [];
    if (callback) callback(messages);
  });

  socket.on('send-message', (message) => {
    const room = message.room || 'global';
    // Store message
    if (!chatRooms.has(room)) {
      chatRooms.set(room, []);
    }
    const messages = chatRooms.get(room);
    messages.push(message);
    // Keep only last 100 messages per room
    if (messages.length > 100) {
      messages.shift();
    }
    // Broadcast to room
    io.to(room).emit('new-message', message);
  });

  socket.on('typing', (data) => {
    socket.to(data.room).emit('user-typing', { user: data.user, room: data.room });
  });

  socket.on('stop-typing', (data) => {
    socket.to(data.room).emit('user-stopped-typing', { room: data.room });
  });

  socket.on('disconnect', () => {
    // Remove user from map on disconnect
    for (const [userId, sockId] of userSockets.entries()) {
      if (sockId === socket.id) userSockets.delete(userId);
    }
  });
});

const PORT = process.env.PORT || 3001;

// Connect to MongoDB
connectDB();

// Middleware
// Use CORS for all routes and explicitly handle preflight requests
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

// Security middleware - IMPORTANT: Order matters!
app.use(securityHeaders); // Set security headers first
app.use(securityLogger); // Log all requests for security audit
app.use(express.json({ limit: '10kb' })); // Limit payload size
app.use(sanitizeData); // Prevent NoSQL injection
app.use(preventParameterPollution); // Prevent parameter pollution
app.use(apiLimiter); // Global rate limiting

// JWT secret
const JWT_SECRET = process.env.JWT_SECRET || 'your-jwt-secret';
const JWT_SECRET_OLD = process.env.JWT_SECRET_OLD || 'your-jwt-secret';

// Auth middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    console.error('No token provided');
    return res.status(401).json({ error: 'Access token required' });
  }

  // Try current secret first
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (!err) {
      req.user = user;
      return next();
    }
    
    // If current secret fails, try old secret for backward compatibility
    jwt.verify(token, JWT_SECRET_OLD, (errOld, userOld) => {
      if (errOld) {
        console.error('Token verification failed:', err.message);
        return res.status(403).json({ error: 'Invalid token', details: err.message });
      }
      req.user = userOld;
      next();
    });
  });
};

// Multer setup for avatar uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(process.cwd(), 'uploads', 'avatars');
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, req.user.userId + '-' + Date.now() + ext);
  }
});
const fileFilter = (req, file, cb) => {
  if (/image\/(jpeg|jpg|png|gif)/.test(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};
const upload = multer({ storage, fileFilter });

// Ensure uploads directory exists
const uploadsDir = path.join(process.cwd(), 'uploads');
const avatarsDir = path.join(uploadsDir, 'avatars');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
if (!fs.existsSync(avatarsDir)) {
  fs.mkdirSync(avatarsDir, { recursive: true });
}

// Serve uploads directory as static
app.use('/uploads', express.static(uploadsDir));

// Avatar upload endpoint
app.post('/api/users/avatar', authenticateToken, upload.single('avatar'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    
    const avatarUrl = `/uploads/avatars/${req.file.filename}`;
    const updatedUser = await User.findByIdAndUpdate(
      req.user.userId,
      { avatar: avatarUrl },
      { new: true }
    );
    
    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json({ avatar: avatarUrl, success: true });
  } catch (error) {
    console.error('Avatar upload error:', error);
    res.status(500).json({ error: error.message || 'Failed to upload avatar' });
  }
});

// Handle multer errors
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'FILE_TOO_LARGE') {
      return res.status(400).json({ error: 'File too large' });
    }
    return res.status(400).json({ error: err.message });
  }
  if (err.message === 'Only image files are allowed!') {
    return res.status(400).json({ error: 'Only image files are allowed' });
  }
  next(err);
});

// Routes

// Auth routes
app.post('/api/auth/register', signupLimiter, async (req, res) => {
  try {
    const { email, password, name, role } = req.body;

    // Validate email
    if (!validateEmail(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Validate password strength
    if (!validatePassword(password)) {
      return res.status(400).json({ 
        error: 'Password must be at least 8 characters and include uppercase, lowercase, number, and special character' 
      });
    }

    // Validate name
    if (!name || name.trim().length < 2) {
      return res.status(400).json({ error: 'Name must be at least 2 characters' });
    }

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = new User({
      email,
      password: hashedPassword,
      name,
      role // <-- save the role
    });

    await user.save();

    // Generate token
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '24h' });

    res.json({ 
      token, 
      user: { 
        id: user._id, 
        email: user.email, 
        name: user.name,
        avatar: user.avatar,
        role: user.role
      } 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/auth/login', loginLimiter, async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Generate token
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '24h' });

    res.json({ 
      token, 
      user: { 
        id: user._id, 
        email: user.email, 
        name: user.name,
        avatar: user.avatar,
        role: user.role
      } 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/auth/verify', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) {
      return res.status(400).json({ error: 'User not found' });
    }

    res.json({ 
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
        created_at: user.createdAt
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Project routes
app.get('/api/projects', async (req, res) => {
  try {
    const projects = await Project.find()
      .populate('creator_id', 'name email')
      .sort({ createdAt: -1 });

    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/projects', authenticateToken, async (req, res) => {
  try {
    const { title, description, sdg_id, target_amount, image_url } = req.body;

    const project = new Project({
      title,
      description,
      sdg_id,
      creator_id: req.user.userId,
      target_amount: target_amount || 0,
      image_url: image_url || '',
      status: 'active',
      progress: 0,
      current_amount: 0
    });

    await project.save();
    await project.populate('creator_id', 'name email');

    res.json(project);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/projects/:id', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('creator_id', 'name email');

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.json(project);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/projects/:id', authenticateToken, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    if (project.creator_id.toString() !== req.user.userId) {
      return res.status(403).json({ error: 'Not authorized to update this project' });
    }

    const updatedProject = await Project.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('creator_id', 'name email');

    res.json(updatedProject);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/projects/:id', authenticateToken, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    if (project.creator_id.toString() !== req.user.userId) {
      return res.status(403).json({ error: 'Not authorized to delete this project' });
    }

    await Project.findByIdAndDelete(req.params.id);
    await Contribution.deleteMany({ project_id: req.params.id });

    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Contribution routes
app.post('/api/contributions', authenticateToken, async (req, res) => {
  try {
    const { project_id, amount, type, description } = req.body;

    const contribution = new Contribution({
      user_id: req.user.userId,
      project_id,
      amount,
      type,
      description: description || ''
    });

    await contribution.save();

    // Update project current amount if monetary contribution
    if (type === 'monetary') {
      const project = await Project.findById(project_id);
      if (project) {
        const newAmount = (project.current_amount || 0) + amount;
        const newProgress = project.target_amount > 0 
          ? Math.min(Math.round((newAmount / project.target_amount) * 100), 100)
          : project.progress;

        await Project.findByIdAndUpdate(project_id, {
          current_amount: newAmount,
          progress: newProgress
        });
      }
    }

    await contribution.populate([
      { path: 'user_id', select: 'name email' },
      { path: 'project_id', select: 'title sdg_id' }
    ]);

    res.json(contribution);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/user/contributions', authenticateToken, async (req, res) => {
  try {
    const contributions = await Contribution.find({ user_id: req.user.userId })
      .populate('project_id', 'title sdg_id')
      .sort({ createdAt: -1 });

    res.json(contributions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/projects/:id/contributions', async (req, res) => {
  try {
    const contributions = await Contribution.find({ project_id: req.params.id })
      .populate('user_id', 'name')
      .sort({ createdAt: -1 });

    res.json(contributions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Course routes
app.get('/api/courses', async (req, res) => {
  try {
    const { category, subject, level, search, sortBy } = req.query;
    let query = {};

    if (category && category !== 'all') query.category = category;
    if (subject && subject !== 'all') query.subject = subject;
    if (level && level !== 'all') query.level = level;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    let sortOptions = { createdAt: -1 };
    if (sortBy === 'popular') sortOptions = { students_count: -1 };
    if (sortBy === 'rating') sortOptions = { rating: -1 };
    if (sortBy === 'newest') sortOptions = { createdAt: -1 };

    const courses = await Course.find(query)
      .populate('instructor_id', 'name email avatar')
      .sort(sortOptions);

    res.json(courses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/courses/:id', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('instructor_id', 'name email avatar');

    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    res.json(course);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/courses', authenticateToken, async (req, res) => {
  try {
    const { title, description, category, subject, level, duration, price, image_url, lessons, certificate } = req.body;

    const course = new Course({
      title,
      description,
      instructor_id: req.user.userId,
      category,
      subject,
      level,
      duration,
      price,
      image_url,
      lessons,
      certificate
    });

    await course.save();
    await course.populate('instructor_id', 'name email avatar');

    res.json(course);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/courses/:id', authenticateToken, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    if (course.instructor_id.toString() !== req.user.userId) {
      return res.status(403).json({ error: 'Not authorized to update this course' });
    }

    const updatedCourse = await Course.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('instructor_id', 'name email avatar');

    res.json(updatedCourse);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/courses/:id', authenticateToken, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    if (course.instructor_id.toString() !== req.user.userId) {
      return res.status(403).json({ error: 'Not authorized to delete this course' });
    }

    await Course.findByIdAndDelete(req.params.id);
    await Enrollment.deleteMany({ course_id: req.params.id });

    res.json({ message: 'Course deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Enrollment routes
app.post('/api/enroll', authenticateToken, async (req, res) => {
  try {
    const { course_id } = req.body;

    const course = await Course.findById(course_id);
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    // Check if already enrolled
    const existing = await Enrollment.findOne({ user_id: req.user.userId, course_id });
    if (existing) {
      return res.status(400).json({ error: 'Already enrolled in this course' });
    }

    const enrollment = new Enrollment({
      user_id: req.user.userId,
      course_id,
      total_lessons: course.lessons
    });

    await enrollment.save();

    // Increment student count
    await Course.findByIdAndUpdate(course_id, { $inc: { students_count: 1 } });

    await enrollment.populate([
      { path: 'user_id', select: 'name email' },
      { path: 'course_id', select: 'title description' }
    ]);

    res.json(enrollment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/user/enrolled-courses', authenticateToken, async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ user_id: req.user.userId })
      .populate('course_id')
      .sort({ enrollment_date: -1 });

    res.json(enrollments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/courses/:id/enrollments', async (req, res) => {
  try {
    const enrollments = await Enrollment.find({ course_id: req.params.id })
      .populate('user_id', 'name email')
      .sort({ enrollment_date: -1 });

    res.json(enrollments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/enrollments/:id', authenticateToken, async (req, res) => {
  try {
    const { progress, completed_lessons, time_spent, grade, status } = req.body;

    const enrollment = await Enrollment.findById(req.params.id);
    if (!enrollment) {
      return res.status(404).json({ error: 'Enrollment not found' });
    }

    if (enrollment.user_id.toString() !== req.user.userId) {
      return res.status(403).json({ error: 'Not authorized to update this enrollment' });
    }

    const updatedEnrollment = await Enrollment.findByIdAndUpdate(
      req.params.id,
      {
        progress,
        completed_lessons,
        time_spent,
        grade,
        status,
        last_accessed: new Date(),
        updatedAt: new Date()
      },
      { new: true }
    ).populate('course_id');

    res.json(updatedEnrollment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// SDG routes
app.get('/api/sdgs/:id/projects', async (req, res) => {
  try {
    const projects = await Project.find({ sdg_id: parseInt(req.params.id) })
      .populate('creator_id', 'name email')
      .sort({ createdAt: -1 });

    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// User routes
app.get('/api/user/projects', authenticateToken, async (req, res) => {
  try {
    const projects = await Project.find({ creator_id: req.user.userId })
      .sort({ createdAt: -1 });

    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/user/profile', authenticateToken, async (req, res) => {
  try {
    const { name, avatar } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { name, avatar },
      { new: true, runValidators: true }
    ).select('-password');

    res.json({
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
        created_at: user.createdAt
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Statistics routes
app.get('/api/stats', async (req, res) => {
  try {
    const totalProjects = await Project.countDocuments();
    const activeProjects = await Project.countDocuments({ status: 'active' });
    const completedProjects = await Project.countDocuments({ status: 'completed' });
    const totalUsers = await User.countDocuments();
    const totalContributions = await Contribution.countDocuments();
    
    // Get total monetary contributions
    const monetaryContributions = await Contribution.aggregate([
      { $match: { type: 'monetary' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    const totalFunding = monetaryContributions.length > 0 ? monetaryContributions[0].total : 0;

    // Get SDG distribution
    const sdgDistribution = await Project.aggregate([
      { $group: { _id: '$sdg_id', count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);

    res.json({
      totalProjects,
      activeProjects,
      completedProjects,
      totalUsers,
      totalContributions,
      totalFunding,
      sdgDistribution
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get notifications for logged-in user
app.get('/api/notifications', authenticateToken, async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.user.userId }).sort({ createdAt: -1 });
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create a notification
app.post('/api/notifications', authenticateToken, async (req, res) => {
  try {
    const { message, userId } = req.body;
    if (!message || !userId) return res.status(400).json({ error: 'Message and userId required' });
    const notification = new Notification({ userId, message });
    await notification.save();
    // Emit real-time notification
    const socketId = userSockets.get(userId);
    if (socketId) {
      io.to(socketId).emit('notification', notification);
    }
    res.status(201).json(notification);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Mark a notification as read
app.patch('/api/notifications/:id/read', authenticateToken, async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.userId },
      { read: true },
      { new: true }
    );
    if (!notification) return res.status(404).json({ error: 'Notification not found' });
    res.json(notification);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start the server
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});