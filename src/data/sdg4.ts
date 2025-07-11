export const sdg4Data = {
  id: 4,
  title: "Quality Education",
  description: "Ensure inclusive and equitable quality education and promote lifelong learning opportunities for all",
  color: "#C5192D",
  icon: "GraduationCap",
  targets: [
    "Free, equitable and quality primary and secondary education",
    "Equal access to affordable and quality technical, vocational and tertiary education",
    "Substantially increase the number of youth and adults with relevant skills",
    "Eliminate gender disparities in education and ensure equal access",
    "Ensure all youth and adults achieve literacy and numeracy",
    "Ensure all learners acquire knowledge and skills needed for sustainable development",
    "Build and upgrade education facilities that are child, disability and gender sensitive",
    "Substantially expand globally the number of scholarships available",
    "Substantially increase the supply of qualified teachers"
  ],
  progress: 68,
  globalStats: {
    outOfSchoolChildren: 244000000,
    literacyRate: 86.3,
    completionRatePrimary: 85,
    completionRateSecondary: 73
  }
};

export const educationCategories = [
  {
    id: 'primary',
    name: 'Primary Education',
    description: 'Foundational learning for ages 6-11',
    icon: 'BookOpen',
    color: '#3B82F6'
  },
  {
    id: 'secondary',
    name: 'Secondary Education', 
    description: 'Advanced learning for ages 12-17',
    icon: 'School',
    color: '#8B5CF6'
  },
  {
    id: 'vocational',
    name: 'Vocational Training',
    description: 'Skills-based professional training',
    icon: 'Wrench',
    color: '#F59E0B'
  },
  {
    id: 'higher',
    name: 'Higher Education',
    description: 'University and advanced studies',
    icon: 'GraduationCap',
    color: '#EF4444'
  },
  {
    id: 'adult',
    name: 'Adult Learning',
    description: 'Lifelong learning and literacy',
    icon: 'Users',
    color: '#10B981'
  },
  {
    id: 'digital',
    name: 'Digital Literacy',
    description: 'Technology and digital skills',
    icon: 'Monitor',
    color: '#6366F1'
  }
];

export const courseSubjects = [
  'Mathematics',
  'Science',
  'Language Arts',
  'Social Studies',
  'Technology',
  'Arts & Creativity',
  'Life Skills',
  'Environmental Studies',
  'Health Education',
  'Financial Literacy'
];