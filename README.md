# EduConnect SDG 4 Quality Education Platform

> **Note:** This project is required as part of the final project for the PLP Project Africa program, fulfilling the program's requirements for practical application and demonstration of MERN stack skills.

## Table of Contents
- [Project Overview](#project-overview)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Folder Structure](#folder-structure)
- [Setup Instructions](#setup-instructions)
- [Environment Variables](#environment-variables)
- [Deployment](#deployment)
- [Usage Guide](#usage-guide)
- [API Overview](#api-overview)
- [FAQ](#faq)
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
### Backend
1. **Clone the repository:**
   ```sh
   git clone <your-repo-url>
   cd MERN-stack-final-project
   ```
2. **Install dependencies:**
   ```sh
   cd server
   npm install
   ```
3. **Configure backend environment variables:**
   - Create a `.env` file in the `server/` folder with:
     ```
     MONGODB_URI=<your-mongodb-uri>
     JWT_SECRET=<your-jwt-secret>
     PORT=3001
     ```
4. **Run the backend server locally:**
   ```sh
   npm start
   ```

### Frontend
1. **Install dependencies:**
   ```sh
   cd .. # from server to project root
   npm install
   ```
2. **Configure frontend environment variables:**
   - Create a `.env` file in the project root with:
     ```
     VITE_API_URL=https://mern-stack-final-project.onrender.com/api
     ```
     - For local development, you can use your local backend URL:
     ```
     VITE_API_URL=http://localhost:3001/api
     ```
3. **Run the frontend locally:**
   ```sh
   npm run dev
   ```
   - Open [http://localhost:5173](http://localhost:5173) in your browser.

## Environment Variables

### Frontend
- `VITE_API_URL`: The base URL for the backend API. Example:
  - For production: `https://mern-stack-final-project.onrender.com/api`
  - For local dev: `http://localhost:3001/api`

### Backend
- `MONGODB_URI`: Your MongoDB connection string
- `JWT_SECRET`: Secret key for JWT authentication
- `PORT`: Port for the backend server (default: 3001)

## Deployment

- **Frontend:** Deploy to Vercel or Netlify. Set the `VITE_API_URL` environment variable in your deployment dashboard to your backend API URL (e.g., `https://mern-stack-final-project.onrender.com/api`).
- **Backend:** Deploy to Render (or similar). Ensure your backend environment variables are set in the Render dashboard.
- **Production URLs:**
  - **Frontend:** [mern-stack-final-project.vercel.app](mern-stack-final-project.vercel.app)
  - **Backend:** [https://mern-stack-final-project.onrender.com](https://mern-stack-final-project.onrender.com)

## Usage Guide
- **Register/Login:** Create an account as a student or teacher.
- **Browse Courses:** Explore available courses, filter by category, and view details.
- **Enroll & Learn:** Enroll in courses, complete lessons, and track your progress.
- **Create Courses:** Teachers can add new courses, lessons, and quizzes from the dashboard.
- **Contribute to Projects:** Join SDG-aligned projects and contribute resources, time, or funds.

## Authentication Flow
- The frontend uses the `VITE_API_URL` environment variable to connect to the backend for authentication and all API requests.
- Register and login are handled via `/api/auth/register` and `/api/auth/login` endpoints.
- On successful login, a JWT token is stored in localStorage and used for authenticated requests.

## API Overview
- **User Endpoints:** Register, login, profile management
- **Course Endpoints:** List, create, update, delete courses
- **Project Endpoints:** Create, view, and contribute to SDG projects
- **Contribution Endpoints:** Track and manage user contributions

## FAQ

### General Questions

**Q: What is this project about?**
A: EduConnect is a MERN stack platform supporting SDG 4 (Quality Education), allowing students and teachers to create, manage, and access educational resources and courses.

**Q: Can I run this project locally?**
A: Yes! Follow the setup instructions above. You'll need Node.js, MongoDB, and to set up environment variables for both frontend and backend.

### Setup & Configuration

**Q: I'm getting "Failed to fetch" errors when trying to log in. What's wrong?**
A: This usually means your frontend can't reach your backend. Check:
- Your `VITE_API_URL` environment variable is set correctly
- Your backend is running (if testing locally)
- Your backend is deployed and accessible (if testing production)
- No CORS issues (backend should allow your frontend domain)

**Q: I see "Invalid credentials" when trying to log in. Is this an error?**
A: No! This means your frontend and backend are communicating correctly. You just need to use the right email/password or register a new account.

**Q: How do I set up environment variables?**
A: Create a `.env` file in the appropriate directory:
- Frontend (project root): `VITE_API_URL=https://your-backend-url.com/api`
- Backend (server folder): `MONGODB_URI=your-mongodb-uri`, `JWT_SECRET=your-secret`

**Q: My backend shows "Cannot GET /" when I visit it in the browser. Is this normal?**
A: Yes! Your backend is API-only, so visiting the root URL will show this message. Test API endpoints with tools like curl or Postman instead.

### Deployment

**Q: Where should I deploy my backend?**
A: Popular options include Render, Railway, Heroku, or Vercel Serverless Functions. This project is deployed on Render.

**Q: Where should I deploy my frontend?**
A: Vercel, Netlify, or GitHub Pages work well. This project uses Vercel.

**Q: Do I need to set environment variables in my deployment platform?**
A: Yes! Set them in your deployment dashboard (Vercel, Render, etc.) for production use.

### Development

**Q: How do I add new features?**
A: Follow the existing code structure, add TypeScript interfaces in `src/types/`, create components in `src/components/`, and add backend routes in `server/index.js`.

**Q: How do I test the API endpoints?**
A: Use curl, Postman, or similar tools. Example:
```sh
curl -X POST https://your-backend-url.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password"}'
```

**Q: I'm getting CORS errors. How do I fix them?**
A: Update your backend CORS configuration in `server/index.js` to allow your frontend domain:
```js
app.use(cors({
  origin: ['https://your-frontend-url.vercel.app', 'http://localhost:5173'],
  credentials: true
}));
```

### Troubleshooting

**Q: My MongoDB connection is failing. What should I check?**
A: Verify your `MONGODB_URI` is correct, your IP is whitelisted in MongoDB Atlas, and your database user has the right permissions.

**Q: I can't log in after deployment. What's wrong?**
A: Check that your frontend's `VITE_API_URL` points to your deployed backend, and that your backend environment variables are set correctly in your deployment platform.

**Q: The app works locally but not in production. Why?**
A: This is usually an environment variable issue. Double-check that all environment variables are set in your deployment platform's dashboard.

## Contribution Guidelines
1. Fork the repository and create your branch.
2. Follow the code style and naming conventions.
3. Document your code and update the README if necessary.
4. Submit a pull request with a clear description of your changes.

## License
This project is licensed under the MIT License.

---

For more details, refer to the source code and comments throughout the project. For questions or support, contact the project maintainer.
