import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Project from './models/Project.js';
import Contribution from './models/Contribution.js';
import bcrypt from 'bcryptjs';

const user = await User.create({
    name: 'Test User',
    email: 'user@test.com',
    password: hashedPassword,
    role: 'user'
});
console.log('✅ Created regular user');

const admin = await User.create({
    name: 'Test Admin',
    email: 'admin@test.com',
    password: hashedPassword,
    role: 'admin'
});
console.log('✅ Created admin user');

// 2. Create Project
console.log('\nprojects Setting up project...');
await Project.deleteMany({ title: 'Verification Project' });
const project = await Project.create({
    title: 'Verification Project',
    description: 'Test project for payment verification',
    sdg_id: 1,
    creator_id: user._id,
    target_amount: 1000,
    current_amount: 0,
    progress: 0,
    status: 'active'
});
console.log('✅ Created test project');

// 3. Submit Contribution (User Action)
console.log('\n💰 Submitting contribution...');
const contributionAmount = 500;
const contribution = await Contribution.create({
    user_id: user._id,
    project_id: project._id,
    amount: contributionAmount,
    type: 'monetary',
    description: 'Test contribution',
    transaction_code: 'TEST_MPESA_123',
    payment_method: 'manual_mpesa',
    payment_status: 'pending'
});
console.log('✅ Contribution created with status:', contribution.payment_status);

// 4. Verify Pending State
console.log('\n🔍 Verifying pending state...');
const projectAfterContrib = await Project.findById(project._id);
if (projectAfterContrib.current_amount === 0 && projectAfterContrib.progress === 0) {
    console.log('✅ Project stats NOT updated (Correct)');
} else {
    console.error('❌ Project stats UPDATED prematurely!');
    console.log('Current Amount:', projectAfterContrib.current_amount);
}

// 5. Admin Approval (Admin Action)
console.log('\n👮 Admin approving payment...');
// Simulate what the admin route does
const updatedContribution = await Contribution.findByIdAndUpdate(
    contribution._id,
    { payment_status: 'completed' },
    { new: true }
);

// Simulate the logic in the admin route that updates the project
if (updatedContribution.type === 'monetary') {
    const p = await Project.findById(updatedContribution.project_id);
    const newAmount = (p.current_amount || 0) + updatedContribution.amount;
    const newProgress = p.target_amount > 0
        ? Math.min(Math.round((newAmount / p.target_amount) * 100), 100)
        : p.progress;

    await Project.findByIdAndUpdate(updatedContribution.project_id, {
        current_amount: newAmount,
        progress: newProgress
    });
}
console.log('✅ Payment approved and logic executed');

// 6. Verify Completed State
console.log('\n🔍 Verifying completed state...');
const projectFinal = await Project.findById(project._id);
if (projectFinal.current_amount === 500 && projectFinal.progress === 50) {
    console.log('✅ Project stats UPDATED correctly');
    console.log(`   Amount: ${projectFinal.current_amount}/1000`);
    console.log(`   Progress: ${projectFinal.progress}%`);
} else {
    console.error('❌ Project stats NOT updated correctly!');
    console.log('Current Amount:', projectFinal.current_amount);
    console.log('Progress:', projectFinal.progress);
}

console.log('\n✨ Verification Complete!');
process.exit(0);

    } catch (error) {
    console.error('❌ Error during verification:', error);
    process.exit(1);
}
};

verifyFlow();
