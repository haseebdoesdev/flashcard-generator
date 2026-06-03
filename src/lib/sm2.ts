import type { CardProgress, Rating } from '../types'
import { getDefaultProgress } from './storage'

const MS_PER_DAY = 24 * 60 * 60 * 1000

export interface RatingResult {
  progress: CardProgress
  requeue: boolean
}

export function applyRating(
  cardId: string,
  existing: CardProgress | undefined,
  rating: Rating,
  now: number = Date.now(),
): RatingResult {
  const base = existing ?? getDefaultProgress(cardId)
  let { easeFactor, intervalDays, repetitions } = base
  let requeue = false

  switch (rating) {
    case 'again':
      repetitions = 0
      intervalDays = 0
      easeFactor = Math.max(1.3, easeFactor - 0.2)
      requeue = true
      break
    case 'hard':
      easeFactor = Math.max(1.3, easeFactor - 0.15)
      if (repetitions === 0) {
        intervalDays = 1
      } else {
        intervalDays = Math.max(1, Math.round(intervalDays * 1.2))
      }
      repetitions += 1
      break
    case 'good':
      if (repetitions === 0) {
        intervalDays = 1
      } else if (repetitions === 1) {
        intervalDays = 6
      } else {
        intervalDays = Math.max(1, Math.round(intervalDays * easeFactor))
      }
      repetitions += 1
      break
    case 'easy':
      easeFactor += 0.15
      if (repetitions === 0) {
        intervalDays = 4
      } else {
        intervalDays = Math.max(1, Math.round(intervalDays * easeFactor * 1.3))
      }
      repetitions += 1
      break
  }

  const nextReview =
    rating === 'again' ? now : now + intervalDays * MS_PER_DAY

  return {
    progress: {
      cardId,
      easeFactor,
      intervalDays,
      repetitions,
      nextReview,
    },
    requeue,
  }
}

export function formatInterval(days: number): string {
  if (days === 0) return '<1d'
  if (days === 1) return '1d'
  if (days < 30) return `${days}d`
  const months = Math.round(days / 30)
  return months === 1 ? '1mo' : `${months}mo`
}

export function previewInterval(
  existing: CardProgress | undefined,
  cardId: string,
  rating: Rating,
): string {
  const { progress } = applyRating(cardId, existing, rating)
  return formatInterval(progress.intervalDays)
}
