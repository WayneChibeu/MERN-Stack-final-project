import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Course from './models/Course.js';

dotenv.config();

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/sdg-platform');
    console.log('Connected to MongoDB');

    // Clear existing courses
    await Course.deleteMany({});
    console.log('Cleared existing courses');

    // Create a sample teacher user first
    let teacher = await User.findOne({ email: 'teacher@example.com' });
    if (!teacher) {
      teacher = await User.create({
        name: 'Sarah Teacher',
        email: 'teacher@example.com',
        password: 'hashed_password_here', // In real app, this would be hashed
        role: 'teacher',
        avatar: 'https://via.placeholder.com/100'
      });
      console.log('Created sample teacher');
    }

    // Sample courses
    const courses = [
      {
        title: 'Introduction to English Literature',
        description: 'Explore classic and modern literature with engaging discussions and analysis.',
        instructor_id: teacher._id,
        category: 'primary',
        subject: 'Literature',
        level: 'beginner',
        duration: 12,
        price: 0,
        rating: 4.8,
        students_count: 2340,
        image_url: 'https://via.placeholder.com/300x200?text=English+Literature',
        lessons: 24,
        certificate: true
      },
      {
        title: 'Basic Mathematics Fundamentals',
        description: 'Master core mathematical concepts with practical examples and exercises.',
        instructor_id: teacher._id,
        category: 'primary',
        subject: 'Mathematics',
        level: 'beginner',
        duration: 15,
        price: 0,
        rating: 4.7,
        students_count: 3100,
        image_url: 'https://via.placeholder.com/300x200?text=Mathematics',
        lessons: 30,
        certificate: true
      },
      {
        title: 'Science Exploration for Young Learners',
        description: 'Discover the wonders of science through hands-on experiments and activities.',
        instructor_id: teacher._id,
        category: 'stem',
        subject: 'Science',
        level: 'beginner',
        duration: 18,
        price: 0,
        rating: 4.9,
        students_count: 1950,
        image_url: 'https://via.placeholder.com/300x200?text=Science',
        lessons: 28,
        certificate: true
      },
      {
        title: 'Advanced Python Programming',
        description: 'Deep dive into Python with advanced concepts, design patterns, and best practices.',
        instructor_id: teacher._id,
        category: 'stem',
        subject: 'Programming',
        level: 'advanced',
        duration: 24,
        price: 49.99,
        rating: 4.9,
        students_count: 1240,
        image_url: 'https://via.placeholder.com/300x200?text=Python',
        lessons: 45,
        certificate: true
      },
      {
        title: 'Web Development Masterclass',
        description: 'Build modern, responsive websites using HTML, CSS, JavaScript, and React.',
        instructor_id: teacher._id,
        category: 'secondary',
        subject: 'Web Development',
        level: 'intermediate',
        duration: 30,
        price: 59.99,
        rating: 4.8,
        students_count: 2100,
        image_url: 'https://via.placeholder.com/300x200?text=Web+Dev',
        lessons: 50,
        certificate: true
      },
      {
        title: 'Data Science Fundamentals',
        description: 'Learn data analysis, visualization, and machine learning basics with Python.',
        instructor_id: teacher._id,
        category: 'secondary',
        subject: 'Data Science',
        level: 'intermediate',
        duration: 28,
        price: 69.99,
        rating: 4.7,
        students_count: 890,
        image_url: 'https://via.placeholder.com/300x200?text=Data+Science',
        lessons: 40,
        certificate: true
      },
      {
        title: 'Professional Business Communication',
        description: 'Master workplace communication, presentation skills, and professional writing.',
        instructor_id: teacher._id,
        category: 'vocational',
        subject: 'Business Skills',
        level: 'intermediate',
        duration: 10,
        price: 39.99,
        rating: 4.6,
        students_count: 1560,
        image_url: 'https://via.placeholder.com/300x200?text=Business',
        lessons: 20,
        certificate: true
      },
      {
        title: 'Digital Marketing Strategy',
        description: 'Learn SEO, social media marketing, content strategy, and analytics.',
        instructor_id: teacher._id,
        category: 'digital',
        subject: 'Marketing',
        level: 'intermediate',
        duration: 14,
        price: 49.99,
        rating: 4.7,
        students_count: 1340,
        image_url: 'https://via.placeholder.com/300x200?text=Marketing',
        lessons: 28,
        certificate: true
      },
      {
        title: 'Project Management Essentials',
        description: 'Master agile, scrum, and project management methodologies for leaders.',
        instructor_id: teacher._id,
        category: 'vocational',
        subject: 'Management',
        level: 'advanced',
        duration: 16,
        price: 59.99,
        rating: 4.8,
        students_count: 980,
        image_url: 'https://via.placeholder.com/300x200?text=Project+Mgmt',
        lessons: 32,
        certificate: true
      },
      {
        title: 'English Language Mastery',
        description: 'Complete English language course covering grammar, writing, and speaking.',
        instructor_id: teacher._id,
        category: 'language',
        subject: 'English',
        level: 'beginner',
        duration: 20,
        price: 29.99,
        rating: 4.6,
        students_count: 1120,
        image_url: 'https://via.placeholder.com/300x200?text=English',
        lessons: 35,
        certificate: true
      }
    ];

    // Insert courses
    const createdCourses = await Course.insertMany(courses);
    console.log(`✅ Successfully seeded ${createdCourses.length} courses!`);

    // Display summary
    console.log('\n📚 Course Summary:');
    courses.forEach(course => {
      console.log(`  - ${course.title} (${course.category})`);
    });

    await mongoose.connection.close();
    console.log('\n✅ Seeding complete!');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
