// Mock data for subjects and collections
// This will be replaced with database data later

export const MOCK_SUBJECTS = [
  {
    id: '1',
    name: 'Mathematics',
    icon: 'calculator',
    iconBackgroundColor: '#E0F2FE',
    headerColor: '#3B82F6',
    collections: [
      { id: '1', name: 'Algebra Basics', cards: 45, completed: 32 },
      { id: '2', name: 'Geometry', cards: 38, completed: 38 },
      { id: '3', name: 'Trigonometry', cards: 52, completed: 18 },
      { id: '4', name: 'Calculus Intro', cards: 28, completed: 5 },
    ],
  },
  {
    id: '2',
    name: 'Physics',
    icon: 'planet',
    iconBackgroundColor: '#FEF3C7',
    headerColor: '#F59E0B',
    collections: [
      { id: '5', name: "Newton's Laws", cards: 30, completed: 25 },
      { id: '6', name: 'Thermodynamics', cards: 42, completed: 10 },
      { id: '7', name: 'Electromagnetism', cards: 55, completed: 0 },
    ],
  },
  {
    id: '3',
    name: 'Chemistry',
    icon: 'flask',
    iconBackgroundColor: '#DCFCE7',
    headerColor: '#10B981',
    collections: [
      { id: '8', name: 'Periodic Table', cards: 50, completed: 50 },
      { id: '9', name: 'Chemical Reactions', cards: 35, completed: 20 },
      { id: '10', name: 'Organic Chemistry', cards: 60, completed: 15 },
    ],
  },
  {
    id: '4',
    name: 'Biology',
    icon: 'leaf',
    iconBackgroundColor: '#E0E7FF',
    headerColor: '#8B5CF6',
    collections: [
      { id: '11', name: 'Cell Biology', cards: 40, completed: 30 },
      { id: '12', name: 'Genetics', cards: 48, completed: 12 },
    ],
  },
];

// Helper function to get a subject by id
export const getSubjectById = (id) => {
  return MOCK_SUBJECTS.find((subject) => subject.id === id);
};

// Helper function to get all collections for a subject
export const getCollectionsBySubjectId = (subjectId) => {
  const subject = getSubjectById(subjectId);
  return subject ? subject.collections : [];
};
