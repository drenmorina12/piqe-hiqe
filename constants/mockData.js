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
      {
        id: '1',
        name: 'Algebra Basics',
        cards: 3,
        completed: 2,
        flashcards: [
          {
            id: '1',
            question: 'What is the quadratic formula?',
            answer:
              'x = (-b ± √(b² - 4ac)) / 2a\n\nUsed to solve equations of the form ax² + bx + c = 0',
            difficulty: 'easy',
          },
          {
            id: '2',
            question: 'Solve for x: 2x + 5 = 13',
            answer: 'x = 4\n\nSubtract 5 from both sides: 2x = 8\nDivide by 2: x = 4',
            difficulty: 'medium',
          },
          {
            id: '3',
            question: 'What is the difference of squares formula?',
            answer: 'a² - b² = (a + b)(a - b)',
            difficulty: null,
          },
        ],
      },
      {
        id: '2',
        name: 'Geometry',
        cards: 2,
        completed: 2,
        flashcards: [
          {
            id: '4',
            question: 'What is the Pythagorean theorem?',
            answer:
              'a² + b² = c²\n\nIn a right triangle, the square of the hypotenuse equals the sum of squares of the other two sides.',
            difficulty: 'easy',
          },
          {
            id: '5',
            question: 'What is the area of a circle?',
            answer: 'A = πr²\n\nWhere r is the radius of the circle',
            difficulty: 'easy',
          },
        ],
      },
      {
        id: '3',
        name: 'Trigonometry',
        cards: 2,
        completed: 0,
        flashcards: [
          {
            id: '6',
            question: 'What is sin²θ + cos²θ equal to?',
            answer: '1\n\nThis is the Pythagorean identity',
            difficulty: null,
          },
          {
            id: '7',
            question: 'What is the value of sin(30°)?',
            answer: '1/2 or 0.5',
            difficulty: null,
          },
        ],
      },
      {
        id: '4',
        name: 'Calculus Intro',
        cards: 2,
        completed: 0,
        flashcards: [
          {
            id: '8',
            question: 'What is the derivative of x²?',
            answer: '2x\n\nUsing the power rule: d/dx(xⁿ) = nxⁿ⁻¹',
            difficulty: null,
          },
          {
            id: '9',
            question: 'What is the derivative of sin(x)?',
            answer: 'cos(x)',
            difficulty: null,
          },
        ],
      },
    ],
  },
  {
    id: '2',
    name: 'Physics',
    icon: 'planet',
    iconBackgroundColor: '#FEF3C7',
    headerColor: '#F59E0B',
    collections: [
      {
        id: '5',
        name: "Newton's Laws",
        cards: 3,
        completed: 2,
        flashcards: [
          {
            id: '10',
            question: "What is Newton's First Law?",
            answer:
              'An object at rest stays at rest and an object in motion stays in motion unless acted upon by an external force.',
            difficulty: 'easy',
          },
          {
            id: '11',
            question: "What is Newton's Second Law?",
            answer: 'F = ma\n\nForce equals mass times acceleration',
            difficulty: 'easy',
          },
          {
            id: '12',
            question: "What is Newton's Third Law?",
            answer: 'For every action, there is an equal and opposite reaction.',
            difficulty: null,
          },
        ],
      },
      {
        id: '6',
        name: 'Thermodynamics',
        cards: 0,
        completed: 0,
        flashcards: [],
      },
      {
        id: '7',
        name: 'Electromagnetism',
        cards: 0,
        completed: 0,
        flashcards: [],
      },
    ],
  },
  {
    id: '3',
    name: 'Chemistry',
    icon: 'flask',
    iconBackgroundColor: '#DCFCE7',
    headerColor: '#10B981',
    collections: [
      {
        id: '8',
        name: 'Periodic Table',
        cards: 2,
        completed: 2,
        flashcards: [
          {
            id: '13',
            question: 'What is the atomic number of Carbon?',
            answer: '6\n\nCarbon has 6 protons in its nucleus',
            difficulty: 'easy',
          },
          {
            id: '14',
            question: 'What is the symbol for Gold?',
            answer: 'Au\n\nFrom the Latin word "Aurum"',
            difficulty: 'easy',
          },
        ],
      },
      {
        id: '9',
        name: 'Chemical Reactions',
        cards: 0,
        completed: 0,
        flashcards: [],
      },
      {
        id: '10',
        name: 'Organic Chemistry',
        cards: 0,
        completed: 0,
        flashcards: [],
      },
    ],
  },
  {
    id: '4',
    name: 'Biology',
    icon: 'leaf',
    iconBackgroundColor: '#E0E7FF',
    headerColor: '#8B5CF6',
    collections: [
      {
        id: '11',
        name: 'Cell Biology',
        cards: 0,
        completed: 0,
        flashcards: [],
      },
      {
        id: '12',
        name: 'Genetics',
        cards: 0,
        completed: 0,
        flashcards: [],
      },
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

// Helper function to get a collection by subject id and collection id
export const getCollectionById = (subjectId, collectionId) => {
  const subject = getSubjectById(subjectId);
  if (!subject) return null;
  return subject.collections.find((collection) => collection.id === collectionId);
};

// Helper function to get all flashcards for a collection
export const getFlashcardsByCollectionId = (subjectId, collectionId) => {
  const collection = getCollectionById(subjectId, collectionId);
  return collection ? collection.flashcards : [];
};
