import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import connectDB from './config/database.js';
import User from './models/User.js';
import Project from './models/Project.js';
import Contribution from './models/Contribution.js';
import multer from 'multer';
import path from 'path';
import Notification from './models/Notification.js';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';

dotenv.config();

const FRONTEND_ORIGIN = process.env.NODE_ENV === 'production'
  ? 'https://mern-stack-final-project.vercel.app'
  : '*';

const app = express();
const server = http.createServer(app);
const io = new SocketIOServer(server, {
  cors: {
    origin: FRONTEND_ORIGIN,
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Store userId <-> socketId mapping
const userSockets = new Map();

io.on('connection', (socket) => {
  // Listen for user identification
  socket.on('identify', (userId) => {
    userSockets.set(userId, socket.id);
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
app.use(cors({
  origin: FRONTEND_ORIGIN,
  credentials: true
}));
app.use(express.json());

// JWT secret
const JWT_SECRET = process.env.JWT_SECRET || 'your-jwt-secret';

// Auth middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

// Multer setup for avatar uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/avatars');
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

// Serve uploads directory as static
app.use('/uploads', express.static('uploads'));

// Avatar upload endpoint
app.post('/api/users/avatar', authenticateToken, upload.single('avatar'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    const avatarUrl = `/uploads/avatars/${req.file.filename}`;
    await User.findByIdAndUpdate(req.user.userId, { avatar: avatarUrl });
    res.json({ avatar: avatarUrl });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Routes

// Auth routes
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, name, role } = req.body;

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

app.post('/api/auth/login', async (req, res) => {
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