import type { AbstractPuzzle } from '@/types/abstract';

// ─── RuleShift ────────────────────────────────────────────────────────────────

export const RULE_SHIFT_PUZZLES: AbstractPuzzle[] = [
  // ── Easy: word length ──
  {
    id: 'rs_e1', type: 'ruleShift', difficulty: 'easy',
    question: 'What is the output for: Mango?',
    data: { examples: [{ input: 'Cat', output: '3' }, { input: 'Kite', output: '4' }, { input: 'Apple', output: '5' }], target: 'Mango' },
    options: ['3', '4', '5', '6'], answer: '5',
  },
  {
    id: 'rs_e2', type: 'ruleShift', difficulty: 'easy',
    question: 'What is the output for: Parrot?',
    data: { examples: [{ input: 'Bee', output: '3' }, { input: 'Bird', output: '4' }, { input: 'Mouse', output: '5' }], target: 'Parrot' },
    options: ['4', '5', '6', '7'], answer: '6',
  },
  // ── Easy: vowel count ──
  {
    id: 'rs_e3', type: 'ruleShift', difficulty: 'easy',
    question: 'What is the output for: Eagle?',
    data: { examples: [{ input: 'Cat', output: '1' }, { input: 'Rain', output: '2' }, { input: 'Audio', output: '4' }], target: 'Eagle' },
    options: ['1', '2', '3', '4'], answer: '3',
  },
  {
    id: 'rs_e4', type: 'ruleShift', difficulty: 'easy',
    question: 'What is the output for: Race?',
    data: { examples: [{ input: 'Bee', output: '2' }, { input: 'Cake', output: '2' }, { input: 'Lake', output: '2' }], target: 'Race' },
    options: ['1', '2', '3', '4'], answer: '2',
  },
  // ── Easy: first-letter position (A=1) ──
  {
    id: 'rs_e5', type: 'ruleShift', difficulty: 'easy',
    question: 'What is the output for: Dog?',
    data: { examples: [{ input: 'Apple', output: '1' }, { input: 'Banana', output: '2' }, { input: 'Cat', output: '3' }], target: 'Dog' },
    options: ['3', '4', '5', '6'], answer: '4',
  },
  {
    id: 'rs_e6', type: 'ruleShift', difficulty: 'easy',
    question: 'What is the output for: Horse?',
    data: { examples: [{ input: 'Elk', output: '5' }, { input: 'Fox', output: '6' }, { input: 'Goat', output: '7' }], target: 'Horse' },
    options: ['6', '7', '8', '9'], answer: '8',
  },
  // ── Medium: length × 2 ──
  {
    id: 'rs_m1', type: 'ruleShift', difficulty: 'medium',
    question: 'What is the output for: Mango?',
    data: { examples: [{ input: 'Cat', output: '6' }, { input: 'Kite', output: '8' }, { input: 'Apple', output: '10' }], target: 'Mango' },
    options: ['8', '9', '10', '12'], answer: '10',
  },
  {
    id: 'rs_m2', type: 'ruleShift', difficulty: 'medium',
    question: 'What is the output for: Winter?',
    data: { examples: [{ input: 'Sun', output: '6' }, { input: 'Rain', output: '8' }, { input: 'Storm', output: '10' }], target: 'Winter' },
    options: ['10', '11', '12', '14'], answer: '12',
  },
  // ── Medium: vowels × 2 ──
  {
    id: 'rs_m3', type: 'ruleShift', difficulty: 'medium',
    question: 'What is the output for: Eagle?',
    data: { examples: [{ input: 'Cat', output: '2' }, { input: 'Bead', output: '4' }, { input: 'Audio', output: '8' }], target: 'Eagle' },
    options: ['4', '6', '8', '10'], answer: '6',
  },
  {
    id: 'rs_m4', type: 'ruleShift', difficulty: 'medium',
    question: 'What is the output for: Steam?',
    data: { examples: [{ input: 'Cab', output: '2' }, { input: 'Bead', output: '4' }, { input: 'Create', output: '6' }], target: 'Steam' },
    options: ['2', '4', '6', '8'], answer: '4',
  },
  // ── Medium: consonant count ──
  {
    id: 'rs_m5', type: 'ruleShift', difficulty: 'medium',
    question: 'What is the output for: Stamp?',
    data: { examples: [{ input: 'Bee', output: '1' }, { input: 'Cat', output: '2' }, { input: 'Frog', output: '3' }], target: 'Stamp' },
    options: ['2', '3', '4', '5'], answer: '4',
  },
  {
    id: 'rs_m6', type: 'ruleShift', difficulty: 'medium',
    question: 'What is the output for: Clap?',
    data: { examples: [{ input: 'Bee', output: '1' }, { input: 'Rain', output: '2' }, { input: 'Storm', output: '4' }], target: 'Clap' },
    options: ['2', '3', '4', '5'], answer: '3',
  },
  // ── Hard: length² ──
  {
    id: 'rs_h1', type: 'ruleShift', difficulty: 'hard',
    question: 'What is the output for: Banana?',
    data: { examples: [{ input: 'Cat', output: '9' }, { input: 'Kite', output: '16' }, { input: 'Apple', output: '25' }], target: 'Banana' },
    options: ['25', '36', '49', '64'], answer: '36',
  },
  {
    id: 'rs_h2', type: 'ruleShift', difficulty: 'hard',
    question: 'What is the output for: Penguin?',
    data: { examples: [{ input: 'Kite', output: '16' }, { input: 'Apple', output: '25' }, { input: 'Donkey', output: '36' }], target: 'Penguin' },
    options: ['36', '49', '56', '64'], answer: '49',
  },
  // ── Hard: vowel-position sum (A=1,E=5,I=9,O=15,U=21) ──
  {
    id: 'rs_h3', type: 'ruleShift', difficulty: 'hard',
    question: 'What is the output for: Stone?',
    data: { examples: [{ input: 'Cat', output: '1' }, { input: 'Meet', output: '10' }, { input: 'Tiger', output: '14' }], target: 'Stone' },
    options: ['14', '16', '20', '24'], answer: '20',
  },
  {
    id: 'rs_h4', type: 'ruleShift', difficulty: 'hard',
    question: 'What is the output for: Rein?',
    data: { examples: [{ input: 'Bead', output: '6' }, { input: 'Moat', output: '16' }, { input: 'Suit', output: '30' }], target: 'Rein' },
    options: ['10', '12', '14', '16'], answer: '14',
  },
  // ── Hard: 2×vowels + length ──
  {
    id: 'rs_h5', type: 'ruleShift', difficulty: 'hard',
    question: 'What is the output for: Audio?',
    data: { examples: [{ input: 'Cat', output: '5' }, { input: 'Kite', output: '8' }, { input: 'Piano', output: '11' }], target: 'Audio' },
    options: ['11', '12', '13', '14'], answer: '13',
  },
  {
    id: 'rs_h6', type: 'ruleShift', difficulty: 'hard',
    question: 'What is the output for: Brain?',
    data: { examples: [{ input: 'Dog', output: '5' }, { input: 'Boat', output: '8' }, { input: 'Storm', output: '7' }], target: 'Brain' },
    options: ['7', '8', '9', '10'], answer: '9',
  },
  // ── Easy: last-letter position (A=1…Z=26) ──
  {
    id: 'rs_e7', type: 'ruleShift', difficulty: 'easy',
    question: 'What is the output for: Bus?',
    data: { examples: [{ input: 'Ant', output: '20' }, { input: 'Cab', output: '2' }, { input: 'Ham', output: '13' }], target: 'Bus' },
    options: ['17', '18', '19', '20'], answer: '19',
  },
  // ── Easy: vowel count (variant) ──
  {
    id: 'rs_e8', type: 'ruleShift', difficulty: 'easy',
    question: 'What is the output for: Train?',
    data: { examples: [{ input: 'Pen', output: '1' }, { input: 'Seek', output: '2' }, { input: 'Outer', output: '3' }], target: 'Train' },
    options: ['1', '2', '3', '4'], answer: '2',
  },
  // ── Medium: first + last letter positions (A=1…Z=26) ──
  {
    id: 'rs_m7', type: 'ruleShift', difficulty: 'medium',
    question: 'What is the output for: Fun?',
    data: { examples: [{ input: 'Ace', output: '6' }, { input: 'Cat', output: '23' }, { input: 'Dog', output: '11' }], target: 'Fun' },
    options: ['15', '18', '20', '22'], answer: '20',
  },
  // ── Medium: length + consonant count ──
  {
    id: 'rs_m8', type: 'ruleShift', difficulty: 'medium',
    question: 'What is the output for: Storm?',
    data: { examples: [{ input: 'Cat', output: '5' }, { input: 'Bird', output: '7' }, { input: 'Apple', output: '8' }], target: 'Storm' },
    options: ['7', '8', '9', '10'], answer: '9',
  },
  // ── Hard: length³ ──
  {
    id: 'rs_h7', type: 'ruleShift', difficulty: 'hard',
    question: 'What is the output for: Planet?',
    data: { examples: [{ input: 'Cat', output: '27' }, { input: 'Kite', output: '64' }, { input: 'Apple', output: '125' }], target: 'Planet' },
    options: ['125', '216', '343', '512'], answer: '216',
  },
  // ── Hard: first-letter position × length ──
  {
    id: 'rs_h8', type: 'ruleShift', difficulty: 'hard',
    question: 'What is the output for: Frog?',
    data: { examples: [{ input: 'Cat', output: '9' }, { input: 'Dog', output: '12' }, { input: 'Eagle', output: '25' }], target: 'Frog' },
    options: ['18', '20', '24', '30'], answer: '24',
  },
  // ── Hard: vowel-position sum (A=1,E=5,I=9,O=15,U=21) ──
  {
    id: 'rs_h9', type: 'ruleShift', difficulty: 'hard',
    question: 'What is the output for: Coin?',
    data: { examples: [{ input: 'Moon', output: '30' }, { input: 'Bait', output: '10' }, { input: 'Clue', output: '26' }], target: 'Coin' },
    options: ['20', '24', '26', '30'], answer: '24',
  },
];

// ─── SwapLogic ────────────────────────────────────────────────────────────────

export const SWAP_LOGIC_PUZZLES: AbstractPuzzle[] = [
  // ── Easy: 3 items, 2 swaps ──
  {
    id: 'sl_e1', type: 'swapLogic', difficulty: 'easy',
    question: 'What is the final order after all swaps?',
    data: { initial: ['Pizza', 'Pasta', 'Burger'], steps: ['Swap Pizza & Burger', 'Swap Pasta & Pizza'] },
    options: ['Pizza, Pasta, Burger', 'Burger, Pasta, Pizza', 'Burger, Pizza, Pasta', 'Pasta, Burger, Pizza'],
    answer: 'Burger, Pizza, Pasta',
  },
  {
    id: 'sl_e2', type: 'swapLogic', difficulty: 'easy',
    question: 'What is the final order after all swaps?',
    data: { initial: ['Red', 'Blue', 'Green'], steps: ['Swap Red & Green', 'Swap Blue & Red'] },
    options: ['Red, Blue, Green', 'Green, Blue, Red', 'Blue, Red, Green', 'Green, Red, Blue'],
    answer: 'Green, Red, Blue',
  },
  {
    id: 'sl_e3', type: 'swapLogic', difficulty: 'easy',
    question: 'What is the final order after all swaps?',
    data: { initial: ['Cat', 'Dog', 'Bird'], steps: ['Swap Cat & Bird', 'Swap Dog & Cat'] },
    options: ['Cat, Dog, Bird', 'Bird, Dog, Cat', 'Dog, Cat, Bird', 'Bird, Cat, Dog'],
    answer: 'Bird, Cat, Dog',
  },
  {
    id: 'sl_e4', type: 'swapLogic', difficulty: 'easy',
    question: 'What is the final order after all swaps?',
    data: { initial: ['Sun', 'Moon', 'Star'], steps: ['Swap Sun & Star', 'Swap Moon & Sun'] },
    options: ['Sun, Moon, Star', 'Star, Moon, Sun', 'Moon, Star, Sun', 'Star, Sun, Moon'],
    answer: 'Star, Sun, Moon',
  },
  {
    id: 'sl_e5', type: 'swapLogic', difficulty: 'easy',
    question: 'What is the final order after all swaps?',
    data: { initial: ['Gold', 'Silver', 'Bronze'], steps: ['Swap Gold & Silver', 'Swap Gold & Bronze'] },
    options: ['Gold, Silver, Bronze', 'Silver, Gold, Bronze', 'Bronze, Silver, Gold', 'Silver, Bronze, Gold'],
    answer: 'Silver, Bronze, Gold',
  },
  // ── Medium: 4 items, 3 swaps ──
  {
    id: 'sl_m1', type: 'swapLogic', difficulty: 'medium',
    question: 'What is the final order after all swaps?',
    data: { initial: ['Pizza', 'Burger', 'Pasta', 'Salad'], steps: ['Swap Pizza & Salad', 'Swap Burger & Pasta', 'Swap Salad & Pizza'] },
    options: ['Pizza, Burger, Pasta, Salad', 'Salad, Pasta, Burger, Pizza', 'Pizza, Salad, Burger, Pasta', 'Pizza, Pasta, Burger, Salad'],
    answer: 'Pizza, Pasta, Burger, Salad',
  },
  {
    id: 'sl_m2', type: 'swapLogic', difficulty: 'medium',
    question: 'What is the final order after all swaps?',
    data: { initial: ['Red', 'Blue', 'Green', 'Yellow'], steps: ['Swap Red & Yellow', 'Swap Blue & Green', 'Swap Yellow & Red'] },
    options: ['Red, Blue, Green, Yellow', 'Yellow, Green, Blue, Red', 'Blue, Green, Red, Yellow', 'Red, Green, Blue, Yellow'],
    answer: 'Red, Green, Blue, Yellow',
  },
  {
    id: 'sl_m3', type: 'swapLogic', difficulty: 'medium',
    question: 'What is the final order after all swaps?',
    data: { initial: ['Cat', 'Dog', 'Bird', 'Fish'], steps: ['Swap Cat & Fish', 'Swap Dog & Bird', 'Swap Fish & Cat'] },
    options: ['Cat, Dog, Bird, Fish', 'Fish, Bird, Dog, Cat', 'Dog, Cat, Fish, Bird', 'Cat, Bird, Dog, Fish'],
    answer: 'Cat, Bird, Dog, Fish',
  },
  {
    id: 'sl_m4', type: 'swapLogic', difficulty: 'medium',
    question: 'What is the final order after all swaps?',
    data: { initial: ['Alpha', 'Beta', 'Gamma', 'Delta'], steps: ['Swap Alpha & Delta', 'Swap Beta & Gamma', 'Swap Delta & Alpha'] },
    options: ['Alpha, Beta, Gamma, Delta', 'Delta, Gamma, Beta, Alpha', 'Beta, Gamma, Alpha, Delta', 'Alpha, Gamma, Beta, Delta'],
    answer: 'Alpha, Gamma, Beta, Delta',
  },
  {
    id: 'sl_m5', type: 'swapLogic', difficulty: 'medium',
    question: 'What is the final order after all swaps?',
    data: { initial: ['North', 'South', 'East', 'West'], steps: ['Swap North & West', 'Swap South & East', 'Swap West & North'] },
    options: ['North, South, East, West', 'West, East, South, North', 'South, North, West, East', 'North, East, South, West'],
    answer: 'North, East, South, West',
  },
  // ── Hard: 5 items, 4 swaps ──
  {
    id: 'sl_h1', type: 'swapLogic', difficulty: 'hard',
    question: 'What is the final order after all swaps?',
    data: { initial: ['Pizza', 'Pasta', 'Salad', 'Soup', 'Bread'], steps: ['Swap Pizza & Bread', 'Swap Pasta & Soup', 'Swap Salad & Pasta', 'Swap Bread & Pizza'] },
    options: ['Pizza, Pasta, Salad, Soup, Bread', 'Bread, Soup, Pasta, Salad, Pizza', 'Soup, Pizza, Salad, Pasta, Bread', 'Pizza, Soup, Pasta, Salad, Bread'],
    answer: 'Pizza, Soup, Pasta, Salad, Bread',
  },
  {
    id: 'sl_h2', type: 'swapLogic', difficulty: 'hard',
    question: 'What is the final order after all swaps?',
    data: { initial: ['Red', 'Blue', 'Green', 'Yellow', 'Purple'], steps: ['Swap Red & Purple', 'Swap Blue & Yellow', 'Swap Green & Blue', 'Swap Purple & Red'] },
    options: ['Red, Blue, Green, Yellow, Purple', 'Purple, Yellow, Blue, Green, Red', 'Yellow, Red, Blue, Purple, Green', 'Red, Yellow, Blue, Green, Purple'],
    answer: 'Red, Yellow, Blue, Green, Purple',
  },
  {
    id: 'sl_h3', type: 'swapLogic', difficulty: 'hard',
    question: 'What is the final order after all swaps?',
    data: { initial: ['Mercury', 'Venus', 'Earth', 'Mars', 'Jupiter'], steps: ['Swap Mercury & Jupiter', 'Swap Venus & Mars', 'Swap Earth & Venus', 'Swap Jupiter & Mercury'] },
    options: ['Mercury, Venus, Earth, Mars, Jupiter', 'Jupiter, Mars, Venus, Earth, Mercury', 'Venus, Mars, Mercury, Earth, Jupiter', 'Mercury, Mars, Venus, Earth, Jupiter'],
    answer: 'Mercury, Mars, Venus, Earth, Jupiter',
  },
  {
    id: 'sl_h4', type: 'swapLogic', difficulty: 'hard',
    question: 'What is the final order after all swaps?',
    data: { initial: ['Cat', 'Dog', 'Bird', 'Fish', 'Hamster'], steps: ['Swap Cat & Hamster', 'Swap Dog & Fish', 'Swap Bird & Dog', 'Swap Hamster & Cat'] },
    options: ['Cat, Dog, Bird, Fish, Hamster', 'Hamster, Fish, Dog, Bird, Cat', 'Fish, Cat, Hamster, Bird, Dog', 'Cat, Fish, Dog, Bird, Hamster'],
    answer: 'Cat, Fish, Dog, Bird, Hamster',
  },
  // ── Easy: 3 items, 2 swaps ──
  {
    id: 'sl_e6', type: 'swapLogic', difficulty: 'easy',
    question: 'What is the final order after all swaps?',
    data: { initial: ['Alpha', 'Beta', 'Gamma'], steps: ['Swap Alpha & Gamma', 'Swap Beta & Alpha'] },
    options: ['Alpha, Beta, Gamma', 'Gamma, Beta, Alpha', 'Gamma, Alpha, Beta', 'Beta, Alpha, Gamma'],
    answer: 'Gamma, Alpha, Beta',
  },
  {
    id: 'sl_e7', type: 'swapLogic', difficulty: 'easy',
    question: 'What is the final order after all swaps?',
    data: { initial: ['Rock', 'Paper', 'Scissors'], steps: ['Swap Rock & Scissors', 'Swap Paper & Rock'] },
    options: ['Rock, Paper, Scissors', 'Scissors, Paper, Rock', 'Scissors, Rock, Paper', 'Paper, Rock, Scissors'],
    answer: 'Scissors, Rock, Paper',
  },
  {
    id: 'sl_e8', type: 'swapLogic', difficulty: 'easy',
    question: 'What is the final order after all swaps?',
    data: { initial: ['One', 'Two', 'Three'], steps: ['Swap One & Two', 'Swap Two & Three'] },
    options: ['One, Two, Three', 'Two, Three, One', 'Three, One, Two', 'Two, One, Three'],
    answer: 'Three, One, Two',
  },
  {
    id: 'sl_e9', type: 'swapLogic', difficulty: 'easy',
    question: 'What is the final order after all swaps?',
    data: { initial: ['Apple', 'Mango', 'Grape'], steps: ['Swap Apple & Mango', 'Swap Mango & Grape'] },
    options: ['Apple, Mango, Grape', 'Mango, Apple, Grape', 'Grape, Mango, Apple', 'Grape, Apple, Mango'],
    answer: 'Grape, Apple, Mango',
  },
  // ── Medium: 4 items, 3 swaps ──
  {
    id: 'sl_m6', type: 'swapLogic', difficulty: 'medium',
    question: 'What is the final order after all swaps?',
    data: { initial: ['Fire', 'Water', 'Earth', 'Air'], steps: ['Swap Fire & Air', 'Swap Water & Earth', 'Swap Air & Fire'] },
    options: ['Fire, Water, Earth, Air', 'Air, Earth, Water, Fire', 'Fire, Earth, Water, Air', 'Water, Fire, Air, Earth'],
    answer: 'Fire, Earth, Water, Air',
  },
  {
    id: 'sl_m7', type: 'swapLogic', difficulty: 'medium',
    question: 'What is the final order after all swaps?',
    data: { initial: ['Monday', 'Tuesday', 'Wednesday', 'Thursday'], steps: ['Swap Monday & Thursday', 'Swap Tuesday & Wednesday', 'Swap Thursday & Monday'] },
    options: ['Thursday, Wednesday, Tuesday, Monday', 'Monday, Tuesday, Wednesday, Thursday', 'Monday, Wednesday, Tuesday, Thursday', 'Thursday, Tuesday, Wednesday, Monday'],
    answer: 'Monday, Wednesday, Tuesday, Thursday',
  },
  {
    id: 'sl_m8', type: 'swapLogic', difficulty: 'medium',
    question: 'What is the final order after all swaps?',
    data: { initial: ['Spade', 'Heart', 'Club', 'Diamond'], steps: ['Swap Spade & Diamond', 'Swap Heart & Club', 'Swap Diamond & Spade'] },
    options: ['Diamond, Club, Heart, Spade', 'Spade, Heart, Club, Diamond', 'Diamond, Heart, Club, Spade', 'Spade, Club, Heart, Diamond'],
    answer: 'Spade, Club, Heart, Diamond',
  },
  {
    id: 'sl_m9', type: 'swapLogic', difficulty: 'medium',
    question: 'What is the final order after all swaps?',
    data: { initial: ['Winter', 'Spring', 'Summer', 'Autumn'], steps: ['Swap Winter & Summer', 'Swap Spring & Autumn', 'Swap Summer & Winter'] },
    options: ['Summer, Autumn, Winter, Spring', 'Autumn, Winter, Summer, Spring', 'Winter, Autumn, Summer, Spring', 'Spring, Summer, Autumn, Winter'],
    answer: 'Winter, Autumn, Summer, Spring',
  },
  // ── Hard: 5 items, 4 swaps ──
  {
    id: 'sl_h5', type: 'swapLogic', difficulty: 'hard',
    question: 'What is the final order after all swaps?',
    data: { initial: ['Ace', 'King', 'Queen', 'Jack', 'Ten'], steps: ['Swap Ace & Ten', 'Swap King & Jack', 'Swap Queen & King', 'Swap Ten & Ace'] },
    options: ['Ten, Jack, Queen, King, Ace', 'Ten, Jack, King, Queen, Ace', 'Ace, Jack, Queen, King, Ten', 'Ace, Jack, King, Queen, Ten'],
    answer: 'Ace, Jack, King, Queen, Ten',
  },
  {
    id: 'sl_h6', type: 'swapLogic', difficulty: 'hard',
    question: 'What is the final order after all swaps?',
    data: { initial: ['North', 'South', 'East', 'West', 'Center'], steps: ['Swap North & Center', 'Swap South & East', 'Swap West & South', 'Swap Center & North'] },
    options: ['Center, East, West, South, North', 'North, South, East, West, Center', 'Center, East, South, West, North', 'North, East, West, South, Center'],
    answer: 'North, East, West, South, Center',
  },
  {
    id: 'sl_h7', type: 'swapLogic', difficulty: 'hard',
    question: 'What is the final order after all swaps?',
    data: { initial: ['Lion', 'Tiger', 'Bear', 'Wolf', 'Fox'], steps: ['Swap Lion & Fox', 'Swap Tiger & Wolf', 'Swap Bear & Tiger', 'Swap Fox & Lion'] },
    options: ['Fox, Wolf, Tiger, Bear, Lion', 'Fox, Wolf, Bear, Tiger, Lion', 'Lion, Tiger, Bear, Wolf, Fox', 'Lion, Wolf, Tiger, Bear, Fox'],
    answer: 'Lion, Wolf, Tiger, Bear, Fox',
  },
];

// ─── BinaryDecision ───────────────────────────────────────────────────────────

export const BINARY_DECISION_PUZZLES: AbstractPuzzle[] = [
  // ── Easy: 1 hop ──
  {
    id: 'bd_e1', type: 'binaryDecision', difficulty: 'easy',
    question: 'What must be true?',
    data: { conditions: ['If Ravi eats Pizza, then Neha drinks Juice.', 'Ravi eats Pizza.'] },
    options: ['Neha drinks Juice.', 'Ravi drinks Juice.', 'Neha eats Pizza.', 'Arjun drinks Juice.'],
    answer: 'Neha drinks Juice.',
  },
  {
    id: 'bd_e2', type: 'binaryDecision', difficulty: 'easy',
    question: 'What must be true?',
    data: { conditions: ['If it rains, the road gets wet.', 'It rains.'] },
    options: ['The road gets wet.', 'It stops raining.', 'The road stays dry.', 'Puddles form instantly.'],
    answer: 'The road gets wet.',
  },
  {
    id: 'bd_e3', type: 'binaryDecision', difficulty: 'easy',
    question: 'What must be true?',
    data: { conditions: ['If Meera studies, she passes.', 'Meera studies.'] },
    options: ['Meera passes.', 'Meera fails.', 'Meera rests.', 'Meera studies more.'],
    answer: 'Meera passes.',
  },
  {
    id: 'bd_e4', type: 'binaryDecision', difficulty: 'easy',
    question: 'What must be true?',
    data: { conditions: ['If the sun sets, it gets dark.', 'The sun sets.'] },
    options: ['The sun rises.', 'Stars appear.', 'It gets dark.', 'It stays bright.'],
    answer: 'It gets dark.',
  },
  {
    id: 'bd_e5', type: 'binaryDecision', difficulty: 'easy',
    question: 'What must be true?',
    data: { conditions: ['If Arjun wins the race, he gets a trophy.', 'Arjun wins the race.'] },
    options: ['Arjun gets a trophy.', 'Arjun loses the race.', 'Priya gets a trophy.', 'Arjun gets a medal.'],
    answer: 'Arjun gets a trophy.',
  },
  // ── Medium: 2 hops ──
  {
    id: 'bd_m1', type: 'binaryDecision', difficulty: 'medium',
    question: 'What must be true?',
    data: { conditions: ['If Ravi eats Pizza, Neha eats Salad.', 'If Neha eats Salad, Arjun drinks Juice.', 'Ravi eats Pizza.'] },
    options: ['Neha drinks Juice.', 'Ravi drinks Juice.', 'Arjun drinks Juice.', 'Arjun eats Salad.'],
    answer: 'Arjun drinks Juice.',
  },
  {
    id: 'bd_m2', type: 'binaryDecision', difficulty: 'medium',
    question: 'What must be true?',
    data: { conditions: ['If it rains, the road gets wet.', 'If the road gets wet, cars slow down.', 'It rains.'] },
    options: ['Cars slow down.', 'Cars speed up.', 'The road dries.', 'It stops raining.'],
    answer: 'Cars slow down.',
  },
  {
    id: 'bd_m3', type: 'binaryDecision', difficulty: 'medium',
    question: 'What must be true?',
    data: { conditions: ['If Meera studies hard, she passes.', 'If she passes, she gets a scholarship.', 'Meera studies hard.'] },
    options: ['Meera fails.', 'Meera gets a scholarship.', 'Meera gets a medal.', 'Meera takes a break.'],
    answer: 'Meera gets a scholarship.',
  },
  {
    id: 'bd_m4', type: 'binaryDecision', difficulty: 'medium',
    question: 'What must be true?',
    data: { conditions: ['If it snows, the roads freeze.', 'If the roads freeze, schools close.', 'It snows.'] },
    options: ['Schools open early.', 'Roads melt.', 'It rains instead.', 'Schools close.'],
    answer: 'Schools close.',
  },
  {
    id: 'bd_m5', type: 'binaryDecision', difficulty: 'medium',
    question: 'What must be true?',
    data: { conditions: ['If the alarm rings, Sara wakes up.', 'If Sara wakes up, she makes breakfast.', 'The alarm rings.'] },
    options: ['Sara sleeps.', 'Sara makes breakfast.', 'Sara goes for a walk.', 'The alarm breaks.'],
    answer: 'Sara makes breakfast.',
  },
  // ── Hard: 3-4 hops ──
  {
    id: 'bd_h1', type: 'binaryDecision', difficulty: 'hard',
    question: 'What must be true?',
    data: { conditions: ['If Ravi eats Pizza, Neha eats Salad.', 'If Neha eats Salad, Arjun drinks Juice.', 'If Arjun drinks Juice, Priya orders Dessert.', 'Ravi eats Pizza.'] },
    options: ['Arjun orders Dessert.', 'Neha orders Dessert.', 'Priya orders Dessert.', 'Ravi orders Dessert.'],
    answer: 'Priya orders Dessert.',
  },
  {
    id: 'bd_h2', type: 'binaryDecision', difficulty: 'hard',
    question: 'What must be true?',
    data: { conditions: ['If it rains, the road gets wet.', 'If the road gets wet, cars slow down.', 'If cars slow down, traffic builds up.', 'It rains.'] },
    options: ['Cars speed up.', 'The road dries.', 'Traffic clears.', 'Traffic builds up.'],
    answer: 'Traffic builds up.',
  },
  {
    id: 'bd_h3', type: 'binaryDecision', difficulty: 'hard',
    question: 'What must be true?',
    data: { conditions: ['If Meera studies, she passes.', 'If she passes, she gets a scholarship.', 'If she gets a scholarship, she goes abroad.', 'Meera studies.'] },
    options: ['Meera fails.', 'Meera gets a job locally.', 'Meera goes abroad.', 'Meera takes a break.'],
    answer: 'Meera goes abroad.',
  },
  {
    id: 'bd_h4', type: 'binaryDecision', difficulty: 'hard',
    question: 'What must be true?',
    data: { conditions: ['If it snows, the roads freeze.', 'If the roads freeze, schools close.', 'If schools close, children stay home.', 'It snows.'] },
    options: ['Children go to school.', 'Roads melt.', 'Schools open late.', 'Children stay home.'],
    answer: 'Children stay home.',
  },
  {
    id: 'bd_h5', type: 'binaryDecision', difficulty: 'hard',
    question: 'What must be true?',
    data: { conditions: ['If you water the plant, it grows.', 'If the plant grows, flowers bloom.', 'If flowers bloom, bees arrive.', 'You water the plant.'] },
    options: ['The plant wilts.', 'No flowers bloom.', 'The bees leave.', 'Bees arrive.'],
    answer: 'Bees arrive.',
  },
  // ── Easy: 1 hop ──
  {
    id: 'bd_e6', type: 'binaryDecision', difficulty: 'easy',
    question: 'What must be true?',
    data: { conditions: ['If Tom learns piano, he performs on stage.', 'Tom learns piano.'] },
    options: ['Tom performs on stage.', 'Tom learns guitar.', 'Tom buys a piano.', 'Tom quits music.'],
    answer: 'Tom performs on stage.',
  },
  {
    id: 'bd_e7', type: 'binaryDecision', difficulty: 'easy',
    question: 'What must be true?',
    data: { conditions: ['If the power goes out, the lights turn off.', 'The power goes out.'] },
    options: ['The lights stay on.', 'The lights turn off.', 'The power comes back.', 'A generator starts.'],
    answer: 'The lights turn off.',
  },
  {
    id: 'bd_e8', type: 'binaryDecision', difficulty: 'easy',
    question: 'What must be true?',
    data: { conditions: ['If you plant seeds, plants grow.', 'You plant seeds.'] },
    options: ['Seeds disappear.', 'Plants die.', 'Plants grow.', 'The soil hardens.'],
    answer: 'Plants grow.',
  },
  // ── Medium: 2 hops ──
  {
    id: 'bd_m6', type: 'binaryDecision', difficulty: 'medium',
    question: 'What must be true?',
    data: { conditions: ['If the car runs out of fuel, it stops.', 'If it stops, the driver calls for help.', 'The car runs out of fuel.'] },
    options: ['The car refuels itself.', 'The driver speeds up.', 'The driver calls for help.', 'The car slows but continues.'],
    answer: 'The driver calls for help.',
  },
  {
    id: 'bd_m7', type: 'binaryDecision', difficulty: 'medium',
    question: 'What must be true?',
    data: { conditions: ['If Leo practices daily, he improves.', 'If Leo improves, he joins the team.', 'Leo practices daily.'] },
    options: ['Leo joins the team.', 'Leo gets injured.', 'Leo quits training.', 'Leo watches from the sideline.'],
    answer: 'Leo joins the team.',
  },
  {
    id: 'bd_m8', type: 'binaryDecision', difficulty: 'medium',
    question: 'What must be true?',
    data: { conditions: ['If the temperature drops below zero, pipes freeze.', 'If pipes freeze, water stops flowing.', 'The temperature drops below zero.'] },
    options: ['Pipes burst immediately.', 'Water flows faster.', 'The temperature rises.', 'Water stops flowing.'],
    answer: 'Water stops flowing.',
  },
  // ── Hard: 3-4 hops ──
  {
    id: 'bd_h6', type: 'binaryDecision', difficulty: 'hard',
    question: 'What must be true?',
    data: { conditions: ['If a volcano erupts, ash clouds form.', 'If ash clouds form, flights are cancelled.', 'If flights are cancelled, passengers are stranded.', 'A volcano erupts.'] },
    options: ['Ash clouds clear quickly.', 'Flights are delayed but not cancelled.', 'Passengers board early.', 'Passengers are stranded.'],
    answer: 'Passengers are stranded.',
  },
  {
    id: 'bd_h7', type: 'binaryDecision', difficulty: 'hard',
    question: 'What must be true?',
    data: { conditions: ['If Leo practices daily, he improves his skills.', 'If he improves his skills, he wins tournaments.', 'If he wins tournaments, he earns a ranking.', 'If he earns a ranking, he qualifies for nationals.', 'Leo practices daily.'] },
    options: ['Leo misses the tournament.', 'Leo earns a wildcard entry.', 'Leo qualifies for nationals.', 'Leo changes sports.'],
    answer: 'Leo qualifies for nationals.',
  },
  {
    id: 'bd_h8', type: 'binaryDecision', difficulty: 'hard',
    question: 'What must be true?',
    data: { conditions: ['If it rains heavily, rivers overflow.', 'If rivers overflow, fields flood.', 'If fields flood, crops are damaged.', 'It rains heavily.'] },
    options: ['Rivers dry up.', 'Fields drain faster.', 'Crops flourish.', 'Crops are damaged.'],
    answer: 'Crops are damaged.',
  },
  {
    id: 'bd_h9', type: 'binaryDecision', difficulty: 'hard',
    question: 'What must be true?',
    data: { conditions: ['If Mia reads every day, she gains knowledge.', 'If she gains knowledge, she becomes wise.', 'If she becomes wise, others seek her advice.', 'If others seek her advice, she becomes a mentor.', 'Mia reads every day.'] },
    options: ['Mia stops reading.', 'Mia becomes a student again.', 'Mia avoids people.', 'Mia becomes a mentor.'],
    answer: 'Mia becomes a mentor.',
  },
];

// ─── SetLogic ─────────────────────────────────────────────────────────────────

export const SET_LOGIC_PUZZLES: AbstractPuzzle[] = [
  // ── Easy: 2 premises ──
  {
    id: 'slo_e1', type: 'setLogic', difficulty: 'easy',
    question: 'Which statement must be true?',
    data: { premises: ['All Cats are Mammals.', 'All Mammals are Animals.'] },
    options: ['All Animals are Cats.', 'No Cats are Animals.', 'All Cats are Animals.', 'Some Mammals are not Cats.'],
    answer: 'All Cats are Animals.',
  },
  {
    id: 'slo_e2', type: 'setLogic', difficulty: 'easy',
    question: 'Which statement must be true?',
    data: { premises: ['All Birds have wings.', 'All Eagles are Birds.'] },
    options: ['All Eagles have wings.', 'All Birds are Eagles.', 'No Eagles have wings.', 'Some Eagles are not Birds.'],
    answer: 'All Eagles have wings.',
  },
  {
    id: 'slo_e3', type: 'setLogic', difficulty: 'easy',
    question: 'Which statement must be true?',
    data: { premises: ['No Fish are Mammals.', 'All Dolphins are Mammals.'] },
    options: ['All Dolphins are Fish.', 'No Dolphins are Fish.', 'Some Dolphins are Fish.', 'All Fish are Mammals.'],
    answer: 'No Dolphins are Fish.',
  },
  {
    id: 'slo_e4', type: 'setLogic', difficulty: 'easy',
    question: 'Which statement must be true?',
    data: { premises: ['All Roses are Flowers.', 'All Flowers are Plants.'] },
    options: ['All Plants are Roses.', 'No Roses are Plants.', 'Some Flowers are not Plants.', 'All Roses are Plants.'],
    answer: 'All Roses are Plants.',
  },
  {
    id: 'slo_e5', type: 'setLogic', difficulty: 'easy',
    question: 'Which statement must be true?',
    data: { premises: ['Some Students are Athletes.', 'All Athletes are Fit.'] },
    options: ['All Students are Fit.', 'Some Students are Fit.', 'No Students are Fit.', 'All Fit people are Students.'],
    answer: 'Some Students are Fit.',
  },
  // ── Medium: 3 premises ──
  {
    id: 'slo_m1', type: 'setLogic', difficulty: 'medium',
    question: 'Which statement must be true?',
    data: { premises: ['All Mammals are warm-blooded.', 'All warm-blooded animals have hearts.', 'All Whales are Mammals.'] },
    options: ['Some Whales are cold-blooded.', 'No Whales have hearts.', 'All hearts belong to Whales.', 'All Whales have hearts.'],
    answer: 'All Whales have hearts.',
  },
  {
    id: 'slo_m2', type: 'setLogic', difficulty: 'medium',
    question: 'Which statement must be true?',
    data: { premises: ['No Fish are Mammals.', 'All Dolphins are Mammals.', 'All Mammals are warm-blooded.'] },
    options: ['No Dolphins are warm-blooded.', 'All Dolphins are warm-blooded.', 'Some Dolphins are Fish.', 'All Mammals are Dolphins.'],
    answer: 'All Dolphins are warm-blooded.',
  },
  {
    id: 'slo_m3', type: 'setLogic', difficulty: 'medium',
    question: 'Which statement must be true?',
    data: { premises: ['All Computers need electricity.', 'All Laptops are Computers.', 'Some Laptops have touchscreens.'] },
    options: ['No Laptops need electricity.', 'Some Computers have no electricity.', 'All touchscreen devices are Laptops.', 'All Laptops need electricity.'],
    answer: 'All Laptops need electricity.',
  },
  {
    id: 'slo_m4', type: 'setLogic', difficulty: 'medium',
    question: 'Which statement must be true?',
    data: { premises: ['All Squares are Rectangles.', 'All Rectangles are Parallelograms.', 'All Parallelograms have parallel sides.'] },
    options: ['No Squares have parallel sides.', 'All Parallelograms are Squares.', 'Some Rectangles are not Parallelograms.', 'All Squares have parallel sides.'],
    answer: 'All Squares have parallel sides.',
  },
  {
    id: 'slo_m5', type: 'setLogic', difficulty: 'medium',
    question: 'Which statement must be true?',
    data: { premises: ['Some Artists are Musicians.', 'All Musicians have rhythm.', 'All Rhythm-havers are Creative.'] },
    options: ['All Artists are Creative.', 'No Artists are Creative.', 'All Creative people are Artists.', 'Some Artists are Creative.'],
    answer: 'Some Artists are Creative.',
  },
  // ── Hard: 4 premises ──
  {
    id: 'slo_h1', type: 'setLogic', difficulty: 'hard',
    question: 'Which statement must be true?',
    data: { premises: ['All Mammals are warm-blooded.', 'All warm-blooded animals produce milk.', 'All milk-producers are Vertebrates.', 'All Bats are Mammals.'] },
    options: ['No Bats are Vertebrates.', 'Some Mammals are not warm-blooded.', 'All Vertebrates are Bats.', 'All Bats are Vertebrates.'],
    answer: 'All Bats are Vertebrates.',
  },
  {
    id: 'slo_h2', type: 'setLogic', difficulty: 'hard',
    question: 'Which statement must be true?',
    data: { premises: ['No Plants can move.', 'All Sunflowers are Plants.', 'All things that cannot move are stationary.', 'Some stationary things are beautiful.'] },
    options: ['Some Sunflowers can move.', 'No Sunflowers are Plants.', 'All stationary things are Plants.', 'All Sunflowers are stationary.'],
    answer: 'All Sunflowers are stationary.',
  },
  {
    id: 'slo_h3', type: 'setLogic', difficulty: 'hard',
    question: 'Which statement must be true?',
    data: { premises: ['All Lawyers study law.', 'All law students read cases.', 'All case-readers are analytical.', 'All Judges are Lawyers.'] },
    options: ['No Judges study law.', 'Some Lawyers are not analytical.', 'All analytical people are Judges.', 'All Judges are analytical.'],
    answer: 'All Judges are analytical.',
  },
  {
    id: 'slo_h4', type: 'setLogic', difficulty: 'hard',
    question: 'Which statement must be true?',
    data: { premises: ['All Computers process data.', 'All data processors need memory.', 'All memory-needing devices have chips.', 'All Tablets are Computers.'] },
    options: ['No Tablets process data.', 'Some Computers have no memory.', 'All chips are in Tablets.', 'All Tablets have chips.'],
    answer: 'All Tablets have chips.',
  },
  {
    id: 'slo_h5', type: 'setLogic', difficulty: 'hard',
    question: 'Which statement must be true?',
    data: { premises: ['All Diamonds are hard.', 'All hard things scratch glass.', 'All glass-scratchers are valuable.', 'Some Diamonds are colorless.'] },
    options: ['No Diamonds scratch glass.', 'Some Diamonds are soft.', 'All valuable things are Diamonds.', 'All Diamonds are valuable.'],
    answer: 'All Diamonds are valuable.',
  },
  // ── Easy: 2 premises ──
  {
    id: 'slo_e6', type: 'setLogic', difficulty: 'easy',
    question: 'Which statement must be true?',
    data: { premises: ['All Dogs are Mammals.', 'Some Dogs are friendly.'] },
    options: ['All Mammals are Dogs.', 'No Mammals are friendly.', 'All Mammals are friendly.', 'Some Mammals are friendly.'],
    answer: 'Some Mammals are friendly.',
  },
  {
    id: 'slo_e7', type: 'setLogic', difficulty: 'easy',
    question: 'Which statement must be true?',
    data: { premises: ['No Reptiles are warm-blooded.', 'All Lizards are Reptiles.'] },
    options: ['All Reptiles are Lizards.', 'Some Lizards are warm-blooded.', 'No Lizards are warm-blooded.', 'All warm-blooded animals are Lizards.'],
    answer: 'No Lizards are warm-blooded.',
  },
  {
    id: 'slo_e8', type: 'setLogic', difficulty: 'easy',
    question: 'Which statement must be true?',
    data: { premises: ['All Pilots can fly.', 'All Astronauts are Pilots.'] },
    options: ['All Pilots are Astronauts.', 'All Astronauts can fly.', 'No Astronauts can fly.', 'Some Pilots are not Astronauts.'],
    answer: 'All Astronauts can fly.',
  },
  // ── Medium: 3 premises ──
  {
    id: 'slo_m6', type: 'setLogic', difficulty: 'medium',
    question: 'Which statement must be true?',
    data: { premises: ['All Solar bodies have mass.', 'All Moons are Solar bodies.', 'All things with mass are affected by gravity.'] },
    options: ['No Moons are affected by gravity.', 'All Moons are affected by gravity.', 'Only Moons have mass.', 'Some Solar bodies have no mass.'],
    answer: 'All Moons are affected by gravity.',
  },
  {
    id: 'slo_m7', type: 'setLogic', difficulty: 'medium',
    question: 'Which statement must be true?',
    data: { premises: ['All Doctors study medicine.', 'All medicine students learn anatomy.', 'Some Doctors are surgeons.'] },
    options: ['All surgeons are Doctors.', 'No surgeons learn anatomy.', 'All Doctors are surgeons.', 'Some surgeons learn anatomy.'],
    answer: 'Some surgeons learn anatomy.',
  },
  {
    id: 'slo_m8', type: 'setLogic', difficulty: 'medium',
    question: 'Which statement must be true?',
    data: { premises: ['No Deserts have rivers.', 'Some Parks are in Deserts.', 'All things without rivers are dry.'] },
    options: ['All Parks are dry.', 'No Parks are dry.', 'Some Parks are dry.', 'All Deserts are Parks.'],
    answer: 'Some Parks are dry.',
  },
  // ── Hard: 4 premises ──
  {
    id: 'slo_h6', type: 'setLogic', difficulty: 'hard',
    question: 'Which statement must be true?',
    data: { premises: ['All Musicians practice daily.', 'All daily practitioners improve.', 'All improving people gain confidence.', 'All Pianists are Musicians.'] },
    options: ['No Pianists gain confidence.', 'All Musicians are Pianists.', 'Some Pianists do not improve.', 'All Pianists gain confidence.'],
    answer: 'All Pianists gain confidence.',
  },
  {
    id: 'slo_h7', type: 'setLogic', difficulty: 'hard',
    question: 'Which statement must be true?',
    data: { premises: ['No Oceans are landlocked.', 'All Seas are connected to Oceans.', 'All connected water bodies allow navigation.', 'Some Seas are warm.'] },
    options: ['No Seas allow navigation.', 'All Oceans are landlocked.', 'All warm bodies of water are Seas.', 'All Seas allow navigation.'],
    answer: 'All Seas allow navigation.',
  },
  {
    id: 'slo_h8', type: 'setLogic', difficulty: 'hard',
    question: 'Which statement must be true?',
    data: { premises: ['All Scientists conduct experiments.', 'All experiments require hypotheses.', 'All hypothesis-formulators are logical thinkers.', 'All Chemists are Scientists.'] },
    options: ['No Chemists conduct experiments.', 'All logical thinkers are Chemists.', 'Some Chemists skip experiments.', 'All Chemists are logical thinkers.'],
    answer: 'All Chemists are logical thinkers.',
  },
  {
    id: 'slo_h9', type: 'setLogic', difficulty: 'hard',
    question: 'Which statement must be true?',
    data: { premises: ['Some Engineers are Inventors.', 'All Inventors create new things.', 'All creators of new things contribute to society.', 'All contributions to society are valuable.'] },
    options: ['All Engineers are valuable.', 'No Engineers contribute to society.', 'Some Engineers contribute to society.', 'All Inventors are Engineers.'],
    answer: 'Some Engineers contribute to society.',
  },
];
