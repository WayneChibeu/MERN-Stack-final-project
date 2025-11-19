import mongoose from 'mongoose';
import User from './server/models/User.js';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';

dotenv.config();

const createAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        const adminEmail = 'admin@educonnect.com';
        const adminPassword = 'adminpassword123';

        // Check if admin already exists
        const existingAdmin = await User.findOne({ email: adminEmail });
        if (existingAdmin) {
            console.log('Admin user already exists');
            existingAdmin.role = 'admin';
            await existingAdmin.save();
            console.log('Updated existing user to admin role');
        } else {
            const hashedPassword = await bcrypt.hash(adminPassword, 10);
            const adminUser = new User({
                name: 'Admin User',
                email: adminEmail,
                password: hashedPassword,
                role: 'admin'
            });
            await adminUser.save();
            console.log('Created new admin user');
        }

        process.exit(0);
    } catch (error) {
        console.error('Error creating admin:', error);
        process.exit(1);
    }
};

createAdmin();
