import React, { useState } from 'react';
import { ArrowLeft, Plus, X, Upload, Video, FileText, HelpCircle, Save } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { educationCategories, courseSubjects } from '../data/sdg4';

interface CreateCourseProps {
  setCurrentView: (view: string) => void;
}

interface Lesson {
  id: string;
  title: string;
  description: string;
  content: string;
  video_url: string;
  duration: number;
  is_free: boolean;
}

interface QuizQuestion {
  id: string;
  question: string;
  type: 'multiple_choice' | 'true_false';
  options: string[];
  correct_answer: number;
  explanation: string;
}

interface Quiz {
  id: string;
  title: string;
  description: string;
  questions: QuizQuestion[];
  time_limit: number;
  passing_score: number;
}

const CreateCourse: React.FC<CreateCourseProps> = ({ setCurrentView }) => {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Course basic info
  const [courseData, setCourseData] = useState({
    title: '',
    description: '',
    category: '',
    subject: '',
    level: 'beginner',
    duration: 0,
    price: 0,
    image_url: ''
  });

  // Lessons
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [currentLesson, setCurrentLesson] = useState<Lesson>({
    id: '',
    title: '',
    description: '',
    content: '',
    video_url: '',
    duration: 0,
    is_free: false
  });

  // Quizzes
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [currentQuiz, setCurrentQuiz] = useState<Quiz>({
    id: '',
    title: '',
    description: '',
    questions: [],
    time_limit: 30,
    passing_score: 70
  });

  const [currentQuestion, setCurrentQuestion] = useState<QuizQuestion>({
    id: '',
    question: '',
    type: 'multiple_choice',
    options: ['', '', '', ''],
    correct_answer: 0,
    explanation: ''
  });

  const addLesson = () => {
    if (currentLesson.title && currentLesson.description) {
      const newLesson = {
        ...currentLesson,
        id: Date.now().toString()
      };
      setLessons([...lessons, newLesson]);
      setCurrentLesson({
        id: '',
        title: '',
        description: '',
        content: '',
        video_url: '',
        duration: 0,
        is_free: false
      });
    }
  };

  const removeLesson = (id: string) => {
    setLessons(lessons.filter(lesson => lesson.id !== id));
  };

  const addQuestion = () => {
    if (currentQuestion.question && currentQuestion.options.some(opt => opt.trim())) {
      const newQuestion = {
        ...currentQuestion,
        id: Date.now().toString()
      };
      setCurrentQuiz({
        ...currentQuiz,
        questions: [...currentQuiz.questions, newQuestion]
      });
      setCurrentQuestion({
        id: '',
        question: '',
        type: 'multiple_choice',
        options: ['', '', '', ''],
        correct_answer: 0,
        explanation: ''
      });
    }
  };

  const removeQuestion = (id: string) => {
    setCurrentQuiz({
      ...currentQuiz,
      questions: currentQuiz.questions.filter(q => q.id !== id)
    });
  };

  const addQuiz = () => {
    if (currentQuiz.title && currentQuiz.questions.length > 0) {
      const newQuiz = {
        ...currentQuiz,
        id: Date.now().toString()
      };
      setQuizzes([...quizzes, newQuiz]);
      setCurrentQuiz({
        id: '',
        title: '',
        description: '',
        questions: [],
        time_limit: 30,
        passing_score: 70
      });
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      // Calculate total duration
      const totalDuration = lessons.reduce((sum, lesson) => sum + lesson.duration, 0);
      
      const coursePayload = {
        ...courseData,
        duration: totalDuration,
        lessons,
        quizzes,
        instructor_id: user?.id
      };

      console.log('Course created:', coursePayload);
      // Here you would send to your API
      
      setCurrentView('teacher-dashboard');
    } catch (error) {
      console.error('Error creating course:', error);
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { id: 1, title: 'Course Info', description: 'Basic course details' },
    { id: 2, title: 'Lessons', description: 'Add course content' },
    { id: 3, title: 'Quizzes', description: 'Create assessments' },
    { id: 4, title: 'Review', description: 'Final review' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => setCurrentView('teacher-dashboard')}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Dashboard
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Create New Course</h1>
          <p className="text-gray-600">Share your knowledge and contribute to quality education</p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                  currentStep >= step.id ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                }`}>
                  {step.id}
                </div>
                <div className="ml-3">
                  <div className="text-sm font-medium text-gray-900">{step.title}</div>
                  <div className="text-xs text-gray-500">{step.description}</div>
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-16 h-1 mx-4 ${
                    currentStep > step.id ? 'bg-blue-600' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          {/* Step 1: Course Info */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">Course Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Course Title *
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={courseData.title}
                    onChange={(e) => setCourseData({...courseData, title: e.target.value})}
                    placeholder="Enter course title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={courseData.category}
                    onChange={(e) => setCourseData({...courseData, category: e.target.value})}
                  >
                    <option value="">Select category</option>
                    {educationCategories.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subject *
                  </label>
                  <select
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={courseData.subject}
                    onChange={(e) => setCourseData({...courseData, subject: e.target.value})}
                  >
                    <option value="">Select subject</option>
                    {courseSubjects.map(subject => (
                      <option key={subject} value={subject}>
                        {subject}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Level *
                  </label>
                  <select
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={courseData.level}
                    onChange={(e) => setCourseData({...courseData, level: e.target.value})}
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price ($)
                  </label>
                  <input
                    type="number"
                    min="0"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={courseData.price}
                    onChange={(e) => setCourseData({...courseData, price: parseFloat(e.target.value) || 0})}
                    placeholder="0 for free course"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Course Image URL
                  </label>
                  <input
                    type="url"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={courseData.image_url}
                    onChange={(e) => setCourseData({...courseData, image_url: e.target.value})}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Course Description *
                </label>
                <textarea
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={courseData.description}
                  onChange={(e) => setCourseData({...courseData, description: e.target.value})}
                  placeholder="Describe what students will learn in this course"
                />
              </div>
            </div>
          )}

          {/* Step 2: Lessons */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">Course Lessons</h2>
                <span className="text-sm text-gray-500">{lessons.length} lessons added</span>
              </div>

              {/* Add Lesson Form */}
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Lesson</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Lesson Title *
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={currentLesson.title}
                      onChange={(e) => setCurrentLesson({...currentLesson, title: e.target.value})}
                      placeholder="Enter lesson title"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Duration (minutes)
                    </label>
                    <input
                      type="number"
                      min="1"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={currentLesson.duration}
                      onChange={(e) => setCurrentLesson({...currentLesson, duration: parseInt(e.target.value) || 0})}
                      placeholder="30"
                    />
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Lesson Description *
                  </label>
                  <textarea
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={currentLesson.description}
                    onChange={(e) => setCurrentLesson({...currentLesson, description: e.target.value})}
                    placeholder="Describe what this lesson covers"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Video URL
                  </label>
                  <input
                    type="url"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={currentLesson.video_url}
                    onChange={(e) => setCurrentLesson({...currentLesson, video_url: e.target.value})}
                    placeholder="https://youtube.com/watch?v=..."
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Lesson Content
                  </label>
                  <textarea
                    rows={6}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={currentLesson.content}
                    onChange={(e) => setCurrentLesson({...currentLesson, content: e.target.value})}
                    placeholder="Enter the lesson content, notes, or transcript"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      checked={currentLesson.is_free}
                      onChange={(e) => setCurrentLesson({...currentLesson, is_free: e.target.checked})}
                    />
                    <span className="ml-2 text-sm text-gray-700">Free preview lesson</span>
                  </label>
                  <button
                    onClick={addLesson}
                    className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Lesson</span>
                  </button>
                </div>
              </div>

              {/* Lessons List */}
              {lessons.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Course Lessons</h3>
                  <div className="space-y-3">
                    {lessons.map((lesson, index) => (
                      <div key={lesson.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium text-blue-600">{index + 1}</span>
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900">{lesson.title}</h4>
                            <p className="text-sm text-gray-500">
                              {lesson.duration} min {lesson.is_free && '• Free preview'}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => removeLesson(lesson.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 3: Quizzes */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">Course Quizzes</h2>
                <span className="text-sm text-gray-500">{quizzes.length} quizzes created</span>
              </div>

              {/* Add Quiz Form */}
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Create Quiz</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Quiz Title *
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={currentQuiz.title}
                      onChange={(e) => setCurrentQuiz({...currentQuiz, title: e.target.value})}
                      placeholder="Enter quiz title"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Time Limit (minutes)
                    </label>
                    <input
                      type="number"
                      min="5"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={currentQuiz.time_limit}
                      onChange={(e) => setCurrentQuiz({...currentQuiz, time_limit: parseInt(e.target.value) || 30})}
                    />
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quiz Description
                  </label>
                  <textarea
                    rows={2}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={currentQuiz.description}
                    onChange={(e) => setCurrentQuiz({...currentQuiz, description: e.target.value})}
                    placeholder="Describe what this quiz covers"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Passing Score (%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={currentQuiz.passing_score}
                    onChange={(e) => setCurrentQuiz({...currentQuiz, passing_score: parseInt(e.target.value) || 70})}
                  />
                </div>

                {/* Add Question Form */}
                <div className="border-t pt-4">
                  <h4 className="font-medium text-gray-900 mb-3">Add Question</h4>
                  <div className="mb-3">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Question *
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={currentQuestion.question}
                      onChange={(e) => setCurrentQuestion({...currentQuestion, question: e.target.value})}
                      placeholder="Enter your question"
                    />
                  </div>
                  <div className="mb-3">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Question Type
                    </label>
                    <select
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={currentQuestion.type}
                      onChange={(e) => setCurrentQuestion({...currentQuestion, type: e.target.value as 'multiple_choice' | 'true_false'})}
                    >
                      <option value="multiple_choice">Multiple Choice</option>
                      <option value="true_false">True/False</option>
                    </select>
                  </div>
                  {currentQuestion.type === 'multiple_choice' && (
                    <div className="mb-3">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Answer Options *
                      </label>
                      {currentQuestion.options.map((option, index) => (
                        <div key={index} className="flex items-center space-x-2 mb-2">
                          <input
                            type="radio"
                            name="correct_answer"
                            checked={currentQuestion.correct_answer === index}
                            onChange={() => setCurrentQuestion({...currentQuestion, correct_answer: index})}
                            className="text-blue-600"
                          />
                          <input
                            type="text"
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={option}
                            onChange={(e) => {
                              const newOptions = [...currentQuestion.options];
                              newOptions[index] = e.target.value;
                              setCurrentQuestion({...currentQuestion, options: newOptions});
                            }}
                            placeholder={`Option ${index + 1}`}
                          />
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="mb-3">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Explanation (optional)
                    </label>
                    <textarea
                      rows={2}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={currentQuestion.explanation}
                      onChange={(e) => setCurrentQuestion({...currentQuestion, explanation: e.target.value})}
                      placeholder="Explain the correct answer"
                    />
                  </div>
                  <button
                    onClick={addQuestion}
                    className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Question</span>
                  </button>
                </div>

                {/* Questions List */}
                {currentQuiz.questions.length > 0 && (
                  <div className="border-t pt-4 mt-4">
                    <h4 className="font-medium text-gray-900 mb-3">Questions ({currentQuiz.questions.length})</h4>
                    <div className="space-y-2">
                      {currentQuiz.questions.map((question, index) => (
                        <div key={question.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div>
                            <span className="text-sm font-medium text-gray-900">
                              {index + 1}. {question.question}
                            </span>
                            <span className="text-xs text-gray-500 ml-2">
                              ({question.type.replace('_', ' ')})
                            </span>
                          </div>
                          <button
                            onClick={() => removeQuestion(question.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex justify-end mt-4">
                  <button
                    onClick={addQuiz}
                    disabled={!currentQuiz.title || currentQuiz.questions.length === 0}
                    className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Quiz</span>
                  </button>
                </div>
              </div>

              {/* Quizzes List */}
              {quizzes.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Course Quizzes</h3>
                  <div className="space-y-3">
                    {quizzes.map((quiz, index) => (
                      <div key={quiz.id} className="p-4 border border-gray-200 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium text-gray-900">{quiz.title}</h4>
                            <p className="text-sm text-gray-500">
                              {quiz.questions.length} questions • {quiz.time_limit} min • {quiz.passing_score}% to pass
                            </p>
                          </div>
                          <button
                            onClick={() => setQuizzes(quizzes.filter(q => q.id !== quiz.id))}
                            className="text-red-600 hover:text-red-700"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 4: Review */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900">Review & Publish</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Course Details</h3>
                    <div className="mt-2 space-y-2 text-sm">
                      <p><span className="font-medium">Title:</span> {courseData.title}</p>
                      <p><span className="font-medium">Category:</span> {educationCategories.find(c => c.id === courseData.category)?.name}</p>
                      <p><span className="font-medium">Subject:</span> {courseData.subject}</p>
                      <p><span className="font-medium">Level:</span> {courseData.level}</p>
                      <p><span className="font-medium">Price:</span> {courseData.price === 0 ? 'Free' : `$${courseData.price}`}</p>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Content Summary</h3>
                    <div className="mt-2 space-y-2 text-sm">
                      <p><span className="font-medium">Lessons:</span> {lessons.length}</p>
                      <p><span className="font-medium">Total Duration:</span> {lessons.reduce((sum, lesson) => sum + lesson.duration, 0)} minutes</p>
                      <p><span className="font-medium">Quizzes:</span> {quizzes.length}</p>
                      <p><span className="font-medium">Total Questions:</span> {quizzes.reduce((sum, quiz) => sum + quiz.questions.length, 0)}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Publishing Checklist</h3>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <div className={`w-4 h-4 rounded-full ${courseData.title ? 'bg-green-500' : 'bg-gray-300'}`} />
                      <span className="text-sm">Course title added</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className={`w-4 h-4 rounded-full ${courseData.description ? 'bg-green-500' : 'bg-gray-300'}`} />
                      <span className="text-sm">Course description added</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className={`w-4 h-4 rounded-full ${lessons.length > 0 ? 'bg-green-500' : 'bg-gray-300'}`} />
                      <span className="text-sm">At least one lesson added</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className={`w-4 h-4 rounded-full ${courseData.category && courseData.subject ? 'bg-green-500' : 'bg-gray-300'}`} />
                      <span className="text-sm">Category and subject selected</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-blue-900 mb-2">Ready to Publish?</h3>
                <p className="text-blue-700 text-sm mb-4">
                  Once published, your course will be available to students worldwide. You can always edit and update your course content later.
                </p>
                <button
                  onClick={handleSubmit}
                  disabled={loading || !courseData.title || !courseData.description || lessons.length === 0}
                  className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                  ) : (
                    <Save className="w-5 h-5" />
                  )}
                  <span>{loading ? 'Publishing...' : 'Publish Course'}</span>
                </button>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
            <button
              onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
              disabled={currentStep === 1}
              className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>
            
            {currentStep < 4 && (
              <button
                onClick={() => setCurrentStep(Math.min(4, currentStep + 1))}
                className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <span>Next</span>
                <ArrowLeft className="w-4 h-4 rotate-180" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateCourse;