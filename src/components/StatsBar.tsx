import type { UserStats } from '../types'
import { xpToNextLevel } from '../lib/gamification'

interface StatsBarProps {
  stats: UserStats
  dueCount: number
  deckName: string
}

export function StatsBar({ stats, dueCount, deckName }: StatsBarProps) {
  const { percent } = xpToNextLevel(stats.xp)

  return (
    <header className="shrink-0 border-b border-slate-800 bg-slate-950/90 px-4 pb-3 pt-[max(0.75rem,env(safe-area-inset-top))] backdrop-blur-sm">
      <div className="mb-2 flex items-center justify-between gap-2">
        <div className="min-w-0 text-left">
          <p className="truncate text-xs font-medium uppercase tracking-wider text-slate-500">
            {deckName}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-3">
          <div
            className="flex items-center gap-1 rounded-full bg-orange-500/10 px-2.5 py-1 text-sm font-semibold text-orange-400"
            title="Day streak"
          >
            <span aria-hidden>🔥</span>
            <span>{stats.streak}</span>
          </div>
          <div
            className="flex h-8 w-8 items-center justify-center rounded-full bg-violet-500/20 text-sm font-bold text-violet-300 ring-1 ring-violet-500/40"
            title={`Level ${stats.level}`}
          >
            {stats.level}
          </div>
        </div>
      </div>

      <div className="mb-2">
        <div className="h-1.5 overflow-hidden rounded-full bg-slate-800">
          <div
            className="h-full rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 transition-all duration-500"
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>

      <div className="flex items-center justify-between text-xs text-slate-500">
        <span>{dueCount} due now</span>
        <span>{stats.xp} XP</span>
      </div>
    </header>
  )
}
