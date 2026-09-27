import { Flashcard, GridSize, CardOrientation } from '../types';

/**
 * Modern Fisher-Yates array shuffle
 */
export function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export interface QuizQuestion {
  id: string;
  cardId: string;
  prompt: string; // The term to identify definition for
  correctAnswer: string; // The correct definition
  options: string[]; // Up to 4 options (1 correct + up to 3 distractors)
}

/**
 * Generate multiple choice quiz questions with dynamic distractor sampling
 * Respects user's rule: 4 options is expected and max, determined by available deck cards.
 * Supports standard (Term -> Definition) and swapped (Definition -> Term) orientation.
 */
export function generateQuizQuestions(
  cards: Flashcard[],
  orientation: CardOrientation = 'term-first'
): QuizQuestion[] {
  if (cards.length === 0) return [];

  const shuffledCards = shuffleArray(cards);
  const isReversed = orientation === 'definition-first';

  return shuffledCards.map((currentCard) => {
    const prompt = isReversed ? currentCard.definition : currentCard.term;
    const correctAnswer = isReversed ? currentCard.term : currentCard.definition;

    // Collect alternative definitions/terms as potential distractors
    const otherAnswers = cards
      .filter((c) => 
        c.id !== currentCard.id && 
        (isReversed ? c.term !== currentCard.term : c.definition !== currentCard.definition)
      )
      .map((c) => (isReversed ? c.term : c.definition));

    // Shuffle and pick up to 3 distractors
    const chosenDistractors = shuffleArray(otherAnswers).slice(0, 3);

    // Combine correct answer with distractors and shuffle
    const options = shuffleArray([correctAnswer, ...chosenDistractors]);

    return {
      id: `q-${currentCard.id}`,
      cardId: currentCard.id,
      prompt,
      correctAnswer,
      options,
    };
  });
}

export interface MatchingTile {
  tileId: string;
  cardId: string;
  type: 'term' | 'definition';
  text: string;
  isFlipped: boolean;
  isMatched: boolean;
}

/**
 * Generate tiles for the timed Matching Grid mode based on chosen grid size
 * 2x3 = 6 tiles (3 pairs)
 * 3x4 = 12 tiles (6 pairs)
 * 4x4 = 16 tiles (8 pairs)
 */
export function generateMatchingTiles(cards: Flashcard[], gridSize: GridSize = '2x3'): MatchingTile[] {
  if (cards.length === 0) return [];

  const pairCountMap: Record<GridSize, number> = {
    '2x3': 3,
    '3x4': 6,
    '4x4': 8,
  };

  const targetPairs = Math.min(pairCountMap[gridSize] || 3, cards.length);
  const selectedCards = shuffleArray(cards).slice(0, targetPairs);

  const tiles: MatchingTile[] = [];

  selectedCards.forEach((card) => {
    tiles.push({
      tileId: `term-${card.id}`,
      cardId: card.id,
      type: 'term',
      text: card.term,
      isFlipped: false,
      isMatched: false,
    });
    tiles.push({
      tileId: `def-${card.id}`,
      cardId: card.id,
      type: 'definition',
      text: card.definition,
      isFlipped: false,
      isMatched: false,
    });
  });

  return shuffleArray(tiles);
}
