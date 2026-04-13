import type { Case } from '@/types';
import { LINK_GRID_POOL, TIME_TRACE_POOL, TRUE_LIE_POOL, CODE_BREAK_POOL } from './puzzlePools';

/** Seeded Fisher-Yates shuffle — seed changes every 30 min so players get fresh order each session */
function seededShuffle<T>(arr: T[]): T[] {
  const seed = Math.floor(Date.now() / (1000 * 60 * 30));
  const a = [...arr];
  let s = (seed * 1664525 + 1013904223) & 0x7fffffff;
  for (let i = a.length - 1; i > 0; i--) {
    s = (s * 1664525 + 1013904223) & 0x7fffffff;
    const j = s % (i + 1);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export const CASES: Case[] = [
  // ─── Case 1: The Office Heist ────────────────────────────────────────────────
  {
    id: 1,
    title: 'The Office Heist',
    difficulty: 'Easy',
    puzzles: {
      linkGrid: {
        people: ['Asha', 'Ravi', 'Neha'],
        categoryA: ['Window', 'Corner', 'Cabin'],
        categoryB: ['Laptop', 'Phone', 'Tablet'],
        clues: [
          'Asha is not at Window',
          'Ravi is at Corner',
          'Cabin has Laptop',
          'Neha has Tablet',
        ],
        question: 'Who has the Laptop?',
        answer: 'Ravi',
      },
      timeTrace: {
        slots: ['1 PM', '2 PM', '3 PM'],
        entities: ['Asha', 'Ravi', 'Neha'],
        clues: [
          'Ravi came before Neha',
          'Asha was not first',
          'The theft happened at 2 PM',
        ],
        question: 'Who was present at 2 PM?',
        answer: 'Ravi',
      },
      trueLie: {
        statements: [
          { person: 'Asha', text: 'Ravi did it' },
          { person: 'Ravi', text: 'Neha is lying' },
          { person: 'Neha', text: "I didn't do it" },
        ],
        question: 'Who is lying?',
        answer: 'Ravi',
      },
      codeBreak: {
        clues: [
          { guess: '123', hint: '1 correct in right place' },
          { guess: '356', hint: '1 correct but wrong place' },
          { guess: '567', hint: 'none correct' },
        ],
        answer: '132',
      },
    },
    solution: { culprit: 'Ravi', time: '2 PM', location: 'Cabin', code: '132' },
  },

  // ─── Case 2: The Missing Necklace ────────────────────────────────────────────
  {
    id: 2,
    title: 'The Missing Necklace',
    difficulty: 'Easy',
    puzzles: {
      linkGrid: {
        people: ['Lina', 'Arun', 'Kiran'],
        categoryA: ['Hall', 'Kitchen', 'Bedroom'],
        categoryB: ['Necklace', 'Watch', 'Ring'],
        clues: [
          'Lina was not in Kitchen',
          'Bedroom had the Necklace',
          'Arun was in Hall',
          'Kiran had the Ring',
        ],
        question: 'Who had the Necklace?',
        answer: 'Arun',
      },
      timeTrace: {
        slots: ['6 PM', '7 PM', '8 PM'],
        entities: ['Lina', 'Arun', 'Kiran'],
        clues: [
          'Arun arrived before Lina',
          'Kiran was last',
          'The theft happened at 7 PM',
        ],
        question: 'Who was there at 7 PM?',
        answer: 'Lina',
      },
      trueLie: {
        statements: [
          { person: 'Lina', text: 'Arun took it' },
          { person: 'Arun', text: 'I am innocent' },
          { person: 'Kiran', text: 'Lina is lying' },
        ],
        question: 'Who is lying?',
        answer: 'Lina',
      },
      codeBreak: {
        clues: [
          { guess: '789', hint: '1 correct in right place' },
          { guess: '678', hint: '1 correct but wrong place' },
          { guess: '345', hint: 'none correct' },
        ],
        answer: '798',
      },
    },
    solution: { culprit: 'Arun', time: '7 PM', location: 'Bedroom', code: '798' },
  },

  // ─── Case 3: The Library Incident ────────────────────────────────────────────
  {
    id: 3,
    title: 'The Library Incident',
    difficulty: 'Medium',
    puzzles: {
      linkGrid: {
        people: ['Dev', 'Sara', 'Imran'],
        categoryA: ['Desk 1', 'Desk 2', 'Desk 3'],
        categoryB: ['Book', 'Laptop', 'Bag'],
        clues: [
          'Sara was not at Desk 1',
          'Desk 3 had Laptop',
          'Dev had Bag',
          'Imran was at Desk 1',
        ],
        question: 'Who had the Laptop?',
        answer: 'Sara',
      },
      timeTrace: {
        slots: ['10 AM', '11 AM', '12 PM'],
        entities: ['Dev', 'Sara', 'Imran'],
        clues: [
          'Imran came after Dev',
          'Sara was not last',
          'Incident at 11 AM',
        ],
        question: 'Who was there at 11 AM?',
        answer: 'Sara',
      },
      trueLie: {
        statements: [
          { person: 'Dev', text: 'Sara did it' },
          { person: 'Sara', text: "I didn't do it" },
          { person: 'Imran', text: 'Dev is lying' },
        ],
        question: 'Who is lying?',
        answer: 'Dev',
      },
      codeBreak: {
        clues: [
          { guess: '234', hint: '1 correct in right place' },
          { guess: '456', hint: '1 correct but wrong place' },
          { guess: '789', hint: 'none correct' },
        ],
        answer: '254',
      },
    },
    solution: { culprit: 'Sara', time: '11 AM', location: 'Desk 3', code: '254' },
  },

  // ─── Case 4: The Cafe Theft ───────────────────────────────────────────────────
  {
    id: 4,
    title: 'The Cafe Theft',
    difficulty: 'Medium',
    puzzles: {
      linkGrid: {
        people: ['Maya', 'Rohit', 'Zara'],
        categoryA: ['Table 1', 'Table 2', 'Table 3'],
        categoryB: ['Bag', 'Phone', 'Wallet'],
        clues: [
          'Maya not at Table 1',
          'Table 2 had Wallet',
          'Rohit at Table 1',
          'Zara had Phone',
        ],
        question: 'Who had the Wallet?',
        answer: 'Rohit',
      },
      timeTrace: {
        slots: ['4 PM', '5 PM', '6 PM'],
        entities: ['Maya', 'Rohit', 'Zara'],
        clues: [
          'Zara arrived after Maya',
          'Rohit was not last',
          'Theft happened at 5 PM',
        ],
        question: 'Who was there at 5 PM?',
        answer: 'Zara',
      },
      trueLie: {
        statements: [
          { person: 'Maya', text: 'Zara did it' },
          { person: 'Rohit', text: "I didn't do it" },
          { person: 'Zara', text: 'Rohit is lying' },
        ],
        question: 'Who is lying?',
        answer: 'Maya',
      },
      codeBreak: {
        clues: [
          { guess: '321', hint: '1 correct in right place' },
          { guess: '654', hint: '1 correct but wrong place' },
          { guess: '987', hint: 'none correct' },
        ],
        answer: '341',
      },
    },
    solution: { culprit: 'Zara', time: '5 PM', location: 'Table 2', code: '341' },
  },

  // ─── Case 5: The Train Mystery ────────────────────────────────────────────────
  {
    id: 5,
    title: 'The Train Mystery',
    difficulty: 'Medium',
    puzzles: {
      linkGrid: {
        people: ['Amit', 'Priya', 'Seema'],
        categoryA: ['Coach A', 'Coach B', 'Coach C'],
        categoryB: ['Backpack', 'Briefcase', 'Suitcase'],
        clues: [
          'Seema is in Coach A',
          'Coach A has Backpack',
          'Priya has Briefcase',
          'Amit is not in Coach C',
        ],
        question: 'Who is in Coach B?',
        answer: 'Amit',
      },
      timeTrace: {
        slots: ['8 AM', '9 AM', '10 AM'],
        entities: ['Amit', 'Priya', 'Seema'],
        clues: [
          'Seema boarded before Amit',
          'Priya was last to board',
          'The bag went missing at 9 AM',
        ],
        question: 'Who was present at 9 AM?',
        answer: 'Amit',
      },
      trueLie: {
        statements: [
          { person: 'Amit', text: "I didn't go near the luggage rack" },
          { person: 'Priya', text: 'Seema arrived first' },
          { person: 'Seema', text: 'Amit passed by my seat at 9 AM' },
        ],
        question: 'Who is lying?',
        answer: 'Amit',
      },
      codeBreak: {
        clues: [
          { guess: '612', hint: '2 correct in right place' },
          { guess: '435', hint: '1 correct in right place' },
          { guess: '720', hint: 'none correct' },
        ],
        answer: '615',
      },
    },
    solution: { culprit: 'Amit', time: '9 AM', location: 'Coach B', code: '615' },
  },

  // ─── Case 6: The Hotel Room ───────────────────────────────────────────────────
  {
    id: 6,
    title: 'The Hotel Room',
    difficulty: 'Hard',
    puzzles: {
      linkGrid: {
        people: ['Nina', 'Omar', 'Priya'],
        categoryA: ['Room 201', 'Room 202', 'Room 203'],
        categoryB: ['Key', 'Wallet', 'Necklace'],
        clues: [
          'Omar is in Room 201',
          'Room 203 has a Key',
          'Priya has Necklace',
          'Nina is not in Room 202',
        ],
        question: 'Who is in Room 203?',
        answer: 'Nina',
      },
      timeTrace: {
        slots: ['9 PM', '10 PM', '11 PM'],
        entities: ['Nina', 'Omar', 'Priya'],
        clues: [
          'Omar was seen first in the corridor',
          'Priya arrived before Nina',
          'The key went missing at 11 PM',
        ],
        question: 'Who was there at 11 PM?',
        answer: 'Nina',
      },
      trueLie: {
        statements: [
          { person: 'Nina', text: 'Omar was in the hallway all night' },
          { person: 'Omar', text: 'I went to sleep at 9 PM' },
          { person: 'Priya', text: 'Nina knocked on my door at 10 PM' },
        ],
        question: 'Who is lying?',
        answer: 'Nina',
      },
      codeBreak: {
        clues: [
          { guess: '483', hint: '2 correct in right place' },
          { guess: '926', hint: '1 correct but wrong place' },
          { guess: '150', hint: 'none correct' },
        ],
        answer: '482',
      },
    },
    solution: { culprit: 'Nina', time: '11 PM', location: 'Room 203', code: '482' },
  },

  // ─── Case 7: The Art Gallery ──────────────────────────────────────────────────
  {
    id: 7,
    title: 'The Art Gallery',
    difficulty: 'Hard',
    puzzles: {
      linkGrid: {
        people: ['Leo', 'Mia', 'Nora'],
        categoryA: ['Hall A', 'Hall B', 'Hall C'],
        categoryB: ['Painting', 'Sculpture', 'Frame'],
        clues: [
          'Mia is in Hall B',
          'Hall A has Sculpture',
          'Nora has Frame',
          'Leo is not in Hall C',
        ],
        question: 'Who is in Hall A?',
        answer: 'Leo',
      },
      timeTrace: {
        slots: ['2 PM', '3 PM', '4 PM'],
        entities: ['Leo', 'Mia', 'Nora'],
        clues: [
          'Mia arrived first',
          'Nora came after Leo',
          'The painting disappeared at 3 PM',
        ],
        question: 'Who was there at 3 PM?',
        answer: 'Leo',
      },
      trueLie: {
        statements: [
          { person: 'Leo', text: 'I was in Hall C the whole time' },
          { person: 'Mia', text: 'Leo walked past Hall A at 3 PM' },
          { person: 'Nora', text: "I didn't arrive until 4 PM" },
        ],
        question: 'Who is lying?',
        answer: 'Leo',
      },
      codeBreak: {
        clues: [
          { guess: '731', hint: '2 correct in right place' },
          { guess: '895', hint: '1 correct but wrong place' },
          { guess: '240', hint: 'none correct' },
        ],
        answer: '739',
      },
    },
    solution: { culprit: 'Leo', time: '3 PM', location: 'Hall A', code: '739' },
  },

  // ─── Case 8: The Classroom Case ──────────────────────────────────────────────
  {
    id: 8,
    title: 'The Classroom Case',
    difficulty: 'Easy',
    puzzles: {
      linkGrid: {
        people: ['Riya', 'Sam', 'Tina'],
        categoryA: ['Desk 2', 'Desk 3', 'Desk 4'],
        categoryB: ['Pen', 'Eraser', 'Ruler'],
        clues: [
          'Sam is at Desk 2',
          'Desk 4 has Pen',
          'Tina has Ruler',
          'Riya is not at Desk 3',
        ],
        question: 'Who is at Desk 4?',
        answer: 'Riya',
      },
      timeTrace: {
        slots: ['1 PM', '2 PM', '3 PM'],
        entities: ['Riya', 'Sam', 'Tina'],
        clues: [
          'Sam was in class first',
          'Tina came last',
          'The pen disappeared at 2 PM',
        ],
        question: 'Who was there at 2 PM?',
        answer: 'Riya',
      },
      trueLie: {
        statements: [
          { person: 'Riya', text: 'I was at Desk 2 when it happened' },
          { person: 'Sam', text: 'I saw Riya near Desk 4' },
          { person: 'Tina', text: 'I arrived after everyone else' },
        ],
        question: 'Who is lying?',
        answer: 'Riya',
      },
      codeBreak: {
        clues: [
          { guess: '125', hint: '2 correct in right place' },
          { guess: '831', hint: '2 correct but wrong place' },
          { guess: '467', hint: 'none correct' },
        ],
        answer: '128',
      },
    },
    solution: { culprit: 'Riya', time: '2 PM', location: 'Desk 4', code: '128' },
  },

  // ─── Case 9: The Airport Bag ──────────────────────────────────────────────────
  {
    id: 9,
    title: 'The Airport Bag',
    difficulty: 'Medium',
    puzzles: {
      linkGrid: {
        people: ['Kunal', 'Leena', 'Mohan'],
        categoryA: ['Gate 1', 'Gate 2', 'Gate 3'],
        categoryB: ['Luggage', 'Laptop Bag', 'Purse'],
        clues: [
          'Leena is at Gate 1',
          'Gate 3 has Laptop Bag',
          'Mohan has Luggage',
          'Kunal is not at Gate 2',
        ],
        question: 'Who is at Gate 3?',
        answer: 'Kunal',
      },
      timeTrace: {
        slots: ['5 AM', '6 AM', '7 AM'],
        entities: ['Kunal', 'Leena', 'Mohan'],
        clues: [
          'Leena checked in before everyone',
          'Mohan was last to arrive',
          'The bag vanished at 6 AM',
        ],
        question: 'Who was there at 6 AM?',
        answer: 'Kunal',
      },
      trueLie: {
        statements: [
          { person: 'Kunal', text: 'I was at Gate 1 the whole time' },
          { person: 'Leena', text: 'I saw Kunal walking toward Gate 3' },
          { person: 'Mohan', text: "I didn't reach until 7 AM" },
        ],
        question: 'Who is lying?',
        answer: 'Kunal',
      },
      codeBreak: {
        clues: [
          { guess: '561', hint: '2 correct in right place' },
          { guess: '248', hint: '1 correct but wrong place' },
          { guess: '137', hint: 'none correct' },
        ],
        answer: '564',
      },
    },
    solution: { culprit: 'Kunal', time: '6 AM', location: 'Gate 3', code: '564' },
  },

  // ─── Case 10: The Studio Secret ──────────────────────────────────────────────
  {
    id: 10,
    title: 'The Studio Secret',
    difficulty: 'Hard',
    puzzles: {
      linkGrid: {
        people: ['Tara', 'Uma', 'Varun'],
        categoryA: ['Studio 1', 'Studio 2', 'Studio 3'],
        categoryB: ['Camera', 'Microphone', 'Script'],
        clues: [
          'Uma is in Studio 1',
          'Studio 2 has Camera',
          'Varun has Script',
          'Tara is not in Studio 3',
        ],
        question: 'Who is in Studio 2?',
        answer: 'Tara',
      },
      timeTrace: {
        slots: ['7 PM', '8 PM', '9 PM'],
        entities: ['Tara', 'Uma', 'Varun'],
        clues: [
          'Uma arrived first',
          'Varun came after Tara',
          'The camera disappeared at 8 PM',
        ],
        question: 'Who was there at 8 PM?',
        answer: 'Tara',
      },
      trueLie: {
        statements: [
          { person: 'Tara', text: 'I was in Studio 3 recording all night' },
          { person: 'Uma', text: 'Tara stopped by Studio 2 at 8 PM' },
          { person: 'Varun', text: 'I got there after 8 PM' },
        ],
        question: 'Who is lying?',
        answer: 'Tara',
      },
      codeBreak: {
        clues: [
          { guess: '904', hint: '2 correct in right place' },
          { guess: '375', hint: '1 correct but wrong place' },
          { guess: '168', hint: 'none correct' },
        ],
        answer: '907',
      },
    },
    solution: { culprit: 'Tara', time: '8 PM', location: 'Studio 2', code: '907' },
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Returns today's case (rotates through all 10 based on calendar day) */
export function getTodaysCase(): Case {
  const dayIndex = Math.floor(Date.now() / (1000 * 60 * 60 * 24)) % CASES.length;
  return CASES[dayIndex];
}

/** Returns today's date as YYYY-MM-DD */
export function getTodayKey(): string {
  return new Date().toISOString().split('T')[0];
}

export function getCaseById(id: number): Case | undefined {
  return CASES.find((c) => c.id === id);
}

/** Returns a shuffled pool of puzzles of the given type (for Time Attack) */
export function getAllPuzzlesOfType<T extends keyof Case['puzzles']>(
  type: T,
): Case['puzzles'][T][] {
  switch (type) {
    case 'linkGrid':  return seededShuffle(LINK_GRID_POOL)  as Case['puzzles'][T][];
    case 'timeTrace': return seededShuffle(TIME_TRACE_POOL) as Case['puzzles'][T][];
    case 'trueLie':   return seededShuffle(TRUE_LIE_POOL)   as Case['puzzles'][T][];
    case 'codeBreak': return seededShuffle(CODE_BREAK_POOL) as Case['puzzles'][T][];
    default:          return CASES.map(c => c.puzzles[type]);
  }
}

export const PUZZLE_META: Record<
  string,
  { label: string; emoji: string; description: string; color: string }
> = {
  linkGrid: {
    label: 'LinkGrid',
    emoji: '⊞',
    description: 'Eliminate with logic',
    color: '#818CF8',
  },
  timeTrace: {
    label: 'TimeTrace',
    emoji: '◷',
    description: 'Order the timeline',
    color: '#FB923C',
  },
  trueLie: {
    label: 'TrueLie',
    emoji: '⊡',
    description: 'Find the liar',
    color: '#F472B6',
  },
  codeBreak: {
    label: 'CodeBreak',
    emoji: '◈',
    description: 'Crack the code',
    color: '#4ADE80',
  },
};
