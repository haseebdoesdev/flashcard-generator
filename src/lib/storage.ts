import type { CardProgress, ProgressMap, UserStats } from '../types'

const PROGRESS_KEY = 'flashcard-progress'
const STATS_KEY = 'flashcard-stats'

const DEFAULT_STATS: UserStats = {
  xp: 0,
  level: 1,
  streak: 0,
  lastStudyDate: null,
  totalReviews: 0,
  cardsMastered: 0,
}

function readJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return fallback
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

function writeJson<T>(key: string, value: T): void {
  localStorage.setItem(key, JSON.stringify(value))
}

export function loadProgress(): ProgressMap {
  return readJson<ProgressMap>(PROGRESS_KEY, {})
}

export function saveProgress(progress: ProgressMap): void {
  writeJson(PROGRESS_KEY, progress)
}

export function loadStats(): UserStats {
  return readJson<UserStats>(STATS_KEY, DEFAULT_STATS)
}

export function saveStats(stats: UserStats): void {
  writeJson(STATS_KEY, stats)
}

export function getDefaultProgress(cardId: string): CardProgress {
  return {
    cardId,
    easeFactor: 2.5,
    intervalDays: 0,
    repetitions: 0,
    nextReview: 0,
  }
}

export function countDueCards(
  cardIds: string[],
  progress: ProgressMap,
  now: number = Date.now(),
): number {
  return cardIds.filter((id) => {
    const p = progress[id]
    return !p || p.nextReview <= now
  }).length
}

export function countDueTomorrow(
  cardIds: string[],
  progress: ProgressMap,
  now: number = Date.now(),
): number {
  const tomorrow = now + 24 * 60 * 60 * 1000
  return cardIds.filter((id) => {
    const p = progress[id]
    return p && p.nextReview > now && p.nextReview <= tomorrow
  }).length
}

export function countMastered(progress: ProgressMap): number {
  return Object.values(progress).filter((p) => p.intervalDays >= 21).length
}
