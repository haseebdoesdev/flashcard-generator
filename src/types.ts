export interface Flashcard {
  id: string
  front: string
  back: string
  tags?: string[]
}

export interface Deck {
  deckName: string
  description?: string
  cards: Flashcard[]
}

export interface CardProgress {
  cardId: string
  easeFactor: number
  intervalDays: number
  repetitions: number
  nextReview: number
}

export type Rating = 'again' | 'hard' | 'good' | 'easy'

export interface UserStats {
  xp: number
  level: number
  streak: number
  lastStudyDate: string | null
  totalReviews: number
  cardsMastered: number
}

export interface SessionStats {
  reviewed: number
  correct: number
  xpEarned: number
}

export type ProgressMap = Record<string, CardProgress>
