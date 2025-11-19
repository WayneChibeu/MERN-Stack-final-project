import express from 'express';
import Enrollment from '../models/Enrollment.js';
import Contribution from '../models/Contribution.js';
import User from '../models/User.js';
import Project from '../models/Project.js';

const router = express.Router();

// Middleware to check if user is admin
const isAdmin = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.userId);
        if (user && user.role === 'admin') {
            next();
        } else {
            res.status(403).json({ error: 'Access denied. Admin only.' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get all pending payments (enrollments and contributions)
router.get('/pending-payments', isAdmin, async (req, res) => {
    try {
        const pendingEnrollments = await Enrollment.find({ payment_status: 'pending' })
            .populate('user_id', 'name email')
            .populate('course_id', 'title price')
            .sort({ createdAt: -1 });

        const pendingContributions = await Contribution.find({
            payment_status: 'pending',
            type: 'monetary'
        })
            .populate('user_id', 'name email')
            .populate('project_id', 'title')
            .sort({ createdAt: -1 });

        res.json({
            enrollments: pendingEnrollments,
            contributions: pendingContributions
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Approve a payment
router.post('/approve-payment', isAdmin, async (req, res) => {
    try {
        const { type, id } = req.body; // type: 'enrollment' or 'contribution'

        if (type === 'enrollment') {
            const enrollment = await Enrollment.findByIdAndUpdate(
                id,
                { payment_status: 'completed', status: 'active' },
                { new: true }
            );
            if (!enrollment) return res.status(404).json({ error: 'Enrollment not found' });
            return res.json({ message: 'Enrollment approved', data: enrollment });
        }

        if (type === 'contribution') {
            const contribution = await Contribution.findByIdAndUpdate(
                id,
                { payment_status: 'completed' },
                { new: true }
            );
            if (!contribution) return res.status(404).json({ error: 'Contribution not found' });

            // Update project stats
            if (contribution.type === 'monetary') {
                const project = await Project.findById(contribution.project_id);
                if (project) {
                    const newAmount = (project.current_amount || 0) + contribution.amount;
                    const newProgress = project.target_amount > 0
                        ? Math.min(Math.round((newAmount / project.target_amount) * 100), 100)
                        : project.progress;

                    await Project.findByIdAndUpdate(contribution.project_id, {
                        current_amount: newAmount,
                        progress: newProgress
                    });
                }
            }

            return res.json({ message: 'Contribution approved', data: contribution });
        }

        res.status(400).json({ error: 'Invalid payment type' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
