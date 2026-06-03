import { useCallback, useMemo, useState } from 'react'
import type { Flashcard, ProgressMap, Rating, SessionStats, UserStats } from '../types'
import { applyXp, isCorrectRating } from '../lib/gamification'
import {
  countDueCards,
  countDueTomorrow,
  countMastered,
  loadProgress,
  loadStats,
  saveProgress,
  saveStats,
} from '../lib/storage'
import { applyRating } from '../lib/sm2'

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

function buildQueue(cards: Flashcard[], progress: ProgressMap, now: number): Flashcard[] {
  const due = cards.filter((c) => {
    const p = progress[c.id]
    return !p || p.nextReview <= now
  })
  return shuffle(due)
}

interface UseStudySessionOptions {
  cards: Flashcard[]
}

export function useStudySession({ cards }: UseStudySessionOptions) {
  const [progress, setProgress] = useState<ProgressMap>(() => loadProgress())
  const [stats, setStats] = useState<UserStats>(() => loadStats())
  const [queue, setQueue] = useState<Flashcard[]>(() =>
    buildQueue(cards, loadProgress(), Date.now()),
  )
  const [flipped, setFlipped] = useState(false)
  const [session, setSession] = useState<SessionStats>({
    reviewed: 0,
    correct: 0,
    xpEarned: 0,
  })
  const [levelUpLevel, setLevelUpLevel] = useState<number | null>(null)

  const currentCard = queue[0] ?? null
  const isComplete = queue.length === 0

  const dueCount = useMemo(
    () => countDueCards(cards.map((c) => c.id), progress),
    [cards, progress],
  )

  const dueTomorrow = useMemo(
    () => countDueTomorrow(cards.map((c) => c.id), progress),
    [cards, progress],
  )

  const flip = useCallback(() => {
    setFlipped((f) => !f)
  }, [])

  const rate = useCallback(
    (rating: Rating) => {
      if (!currentCard) return

      const now = Date.now()
      const { progress: updated, requeue } = applyRating(
        currentCard.id,
        progress[currentCard.id],
        rating,
        now,
      )

      const newProgress = { ...progress, [currentCard.id]: updated }
      setProgress(newProgress)
      saveProgress(newProgress)

      const oldLevel = stats.level
      let newStats = applyXp(stats, rating)
      newStats = { ...newStats, cardsMastered: countMastered(newProgress) }
      setStats(newStats)
      saveStats(newStats)

      if (newStats.level > oldLevel) {
        setLevelUpLevel(newStats.level)
      }

      const xpGain = rating === 'again' ? 0 : rating === 'hard' ? 5 : rating === 'good' ? 10 : 15
      setSession((s) => ({
        reviewed: s.reviewed + 1,
        correct: s.correct + (isCorrectRating(rating) ? 1 : 0),
        xpEarned: s.xpEarned + xpGain,
      }))

      setQueue((q) => {
        const rest = q.slice(1)
        if (requeue) return [...rest, currentCard]
        return rest
      })
      setFlipped(false)
    },
    [currentCard, progress, stats],
  )

  const dismissLevelUp = useCallback(() => {
    setLevelUpLevel(null)
  }, [])

  const restartSession = useCallback(() => {
    const freshProgress = loadProgress()
    setProgress(freshProgress)
    setQueue(buildQueue(cards, freshProgress, Date.now()))
    setFlipped(false)
    setSession({ reviewed: 0, correct: 0, xpEarned: 0 })
  }, [cards])

  return {
    currentCard,
    flipped,
    queueLength: queue.length,
    isComplete,
    progress,
    stats,
    session,
    dueCount,
    dueTomorrow,
    levelUpLevel,
    flip,
    rate,
    dismissLevelUp,
    restartSession,
  }
}
