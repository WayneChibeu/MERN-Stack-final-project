# EduConnect SDG 4 Quality Education Platform

> **Note:** This project is required as part of the final project for the PLP Project Africa program, fulfilling the program's requirements for practical application and demonstration of MERN stack skills.

## Table of Contents
- [Project Overview](#project-overview)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Folder Structure](#folder-structure)
- [Setup Instructions](#setup-instructions)
- [Usage Guide](#usage-guide)
- [API Overview](#api-overview)
- [Contribution Guidelines](#contribution-guidelines)
- [License](#license)

---

## Project Overview
EduConnect is a comprehensive MERN stack platform designed to support the United Nations Sustainable Development Goal 4 (SDG 4): Quality Education. The platform enables students, teachers, and administrators to access, create, and manage educational resources, courses, and collaborative projects. It aims to promote inclusive, equitable, and lifelong learning opportunities for all.

## Features
- **User Authentication:** Secure registration, login, and profile management for students, teachers, and admins.
- **Course Catalog:** Browse, search, and filter a wide range of courses by category, subject, and level.
- **Course Creation:** Teachers can create, edit, and manage courses, lessons, and quizzes.
- **My Learning:** Students can enroll in courses, track progress, and earn certificates.
- **Teacher Dashboard:** Analytics and management tools for teachers to monitor courses, students, and earnings.
- **SDG Projects:** Collaborative projects aligned with SDG goals, allowing users to contribute time, resources, or funds.
- **Global Statistics:** Real-time data and progress tracking for SDG 4 targets and global education metrics.
- **Responsive UI:** Modern, mobile-friendly interface built with React and Tailwind CSS.

## Technologies Used
- **Frontend:** React, TypeScript, Vite, Tailwind CSS, Chart.js, React Router
- **Backend:** Node.js, Express.js, MongoDB (Mongoose), JWT, bcryptjs, Multer
- **Real-time:** Socket.io for live updates and collaboration
- **Other:** ESLint, PostCSS, dotenv, lucide-react

## Folder Structure
```
├── server/
│   ├── index.js                # Express server entry point
│   ├── config/database.js      # MongoDB connection setup
│   ├── models/                 # Mongoose models (User, Project, Contribution)
├── src/
│   ├── App.tsx                 # Main React app component
│   ├── components/             # UI components (Dashboard, CourseCatalog, etc.)
│   ├── context/                # React context (AuthContext)
│   ├── data/                   # Static data (SDGs, SDG4 targets)
│   ├── types/                  # TypeScript interfaces
├── package.json                # Project metadata and scripts
├── vite.config.ts              # Vite configuration
├── tailwind.config.js          # Tailwind CSS configuration
├── README.md                   # Project documentation
```

## Setup Instructions
1. **Clone the repository:**
   ```powershell
   git clone <your-repo-url>
   cd MERN-stack-final-project
   ```
2. **Install dependencies:**
   ```powershell
   pnpm install
   ```
3. **Configure environment variables:**
   - Create a `.env` file in the `server/` folder with:
     ```
     MONGODB_URI=<your-mongodb-uri>
     JWT_SECRET=<your-jwt-secret>
     PORT=3001
     ```
4. **Run the development server:**
   ```powershell
   pnpm run dev
   ```
   - This will start both the client (React) and server (Express) concurrently.

## Usage Guide
- **Access the app:** Open [http://localhost:5173](http://localhost:5173) in your browser.
- **Register/Login:** Create an account as a student or teacher.
- **Browse Courses:** Explore available courses, filter by category, and view details.
- **Enroll & Learn:** Enroll in courses, complete lessons, and track your progress.
- **Create Courses:** Teachers can add new courses, lessons, and quizzes from the dashboard.
- **Contribute to Projects:** Join SDG-aligned projects and contribute resources, time, or funds.

## API Overview
- **User Endpoints:** Register, login, profile management
- **Course Endpoints:** List, create, update, delete courses
- **Project Endpoints:** Create, view, and contribute to SDG projects
- **Contribution Endpoints:** Track and manage user contributions

## Contribution Guidelines
1. Fork the repository and create your branch.
2. Follow the code style and naming conventions.
3. Document your code and update the README if necessary.
4. Submit a pull request with a clear description of your changes.

## License
This project is licensed under the MIT License.

---

For more details, refer to the source code and comments throughout the project. For questions or support, contact the project maintainer.
