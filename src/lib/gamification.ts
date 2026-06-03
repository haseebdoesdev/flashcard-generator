import type { Rating, UserStats } from '../types'

const XP_MAP: Record<Rating, number> = {
  again: 0,
  hard: 5,
  good: 10,
  easy: 15,
}

export function xpForRating(rating: Rating): number {
  return XP_MAP[rating]
}

export function levelFromXp(xp: number): number {
  return Math.floor(Math.sqrt(xp / 50)) + 1
}

export function xpForLevel(level: number): number {
  return Math.pow(level - 1, 2) * 50
}

export function xpToNextLevel(xp: number): {
  current: number
  needed: number
  percent: number
} {
  const level = levelFromXp(xp)
  const currentLevelXp = xpForLevel(level)
  const nextLevelXp = xpForLevel(level + 1)
  const current = xp - currentLevelXp
  const needed = nextLevelXp - currentLevelXp
  const percent = needed > 0 ? Math.min(100, (current / needed) * 100) : 100
  return { current, needed, percent }
}

function todayString(): string {
  return new Date().toISOString().slice(0, 10)
}

function yesterdayString(): string {
  const d = new Date()
  d.setDate(d.getDate() - 1)
  return d.toISOString().slice(0, 10)
}

export function updateStreak(stats: UserStats): UserStats {
  const today = todayString()
  if (stats.lastStudyDate === today) {
    return stats
  }

  const yesterday = yesterdayString()
  let streak = stats.streak

  if (stats.lastStudyDate === yesterday) {
    streak += 1
  } else if (stats.lastStudyDate !== today) {
    streak = 1
  }

  return {
    ...stats,
    streak,
    lastStudyDate: today,
  }
}

export function applyXp(stats: UserStats, rating: Rating): UserStats {
  const xpGain = xpForRating(rating)
  const newXp = stats.xp + xpGain
  const withStreak = updateStreak(stats)

  return {
    ...withStreak,
    xp: newXp,
    level: levelFromXp(newXp),
    totalReviews: stats.totalReviews + 1,
  }
}

export function isCorrectRating(rating: Rating): boolean {
  return rating === 'good' || rating === 'easy'
}
