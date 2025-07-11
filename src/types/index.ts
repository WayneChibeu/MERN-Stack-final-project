export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: 'student' | 'teacher' | 'admin';
  created_at: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  category: string;
  subject: string;
  instructor_id: string;
  instructor?: User;
  level: 'beginner' | 'intermediate' | 'advanced';
  duration: number; // in hours
  price: number;
  image_url?: string;
  status: 'draft' | 'published' | 'archived';
  enrollment_count: number;
  rating: number;
  created_at: string;
  updated_at: string;
}

export interface Lesson {
  id: string;
  course_id: string;
  title: string;
  description: string;
  content: string;
  video_url?: string;
  duration: number; // in minutes
  order: number;
  is_free: boolean;
  created_at: string;
}

export interface Enrollment {
  id: string;
  user_id: string;
  course_id: string;
  progress: number;
  completed_lessons: string[];
  certificate_issued: boolean;
  enrolled_at: string;
  completed_at?: string;
}

export interface Quiz {
  id: string;
  course_id: string;
  lesson_id?: string;
  title: string;
  description: string;
  questions: QuizQuestion[];
  time_limit?: number; // in minutes
  passing_score: number;
  created_at: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  type: 'multiple_choice' | 'true_false' | 'short_answer';
  options?: string[];
  correct_answer: string | number;
  explanation?: string;
}

export interface QuizAttempt {
  id: string;
  user_id: string;
  quiz_id: string;
  answers: Record<string, any>;
  score: number;
  passed: boolean;
  completed_at: string;
}

export interface Discussion {
  id: string;
  course_id: string;
  user_id: string;
  user?: User;
  title: string;
  content: string;
  replies: DiscussionReply[];
  created_at: string;
}

export interface DiscussionReply {
  id: string;
  discussion_id: string;
  user_id: string;
  user?: User;
  content: string;
  created_at: string;
}

export interface Certificate {
  id: string;
  user_id: string;
  course_id: string;
  course?: Course;
  certificate_url: string;
  issued_at: string;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string, role: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}