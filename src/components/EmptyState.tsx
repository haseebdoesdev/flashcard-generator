import type { SessionStats, UserStats } from '../types'

interface EmptyStateProps {
  stats: UserStats
  session: SessionStats
  dueTomorrow: number
  onStudyMore: () => void
}

export function EmptyState({
  stats,
  session,
  dueTomorrow,
  onStudyMore,
}: EmptyStateProps) {
  const accuracy =
    session.reviewed > 0
      ? Math.round((session.correct / session.reviewed) * 100)
      : 0

  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
      <div className="mb-2 text-5xl" aria-hidden>
        🎉
      </div>
      <h2 className="mb-1 text-2xl font-bold text-slate-100">All caught up!</h2>
      <p className="mb-8 max-w-xs text-sm text-slate-400">
        {dueTomorrow > 0
          ? `${dueTomorrow} card${dueTomorrow === 1 ? '' : 's'} due tomorrow. Great work on the bus ride!`
          : 'No cards due right now. Check back later!'}
      </p>

      {session.reviewed > 0 && (
        <div className="mb-8 grid w-full max-w-xs grid-cols-3 gap-3">
          <StatChip label="Reviewed" value={String(session.reviewed)} />
          <StatChip label="Accuracy" value={`${accuracy}%`} />
          <StatChip label="XP earned" value={`+${session.xpEarned}`} />
        </div>
      )}

      <div className="mb-6 flex flex-wrap justify-center gap-4 text-sm text-slate-500">
        <span>🔥 {stats.streak} day streak</span>
        <span>⭐ Level {stats.level}</span>
        <span>📚 {stats.cardsMastered} mastered</span>
      </div>

      <button
        type="button"
        onClick={onStudyMore}
        className="rounded-xl bg-violet-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-violet-500 active:scale-95"
      >
        Study again
      </button>
    </div>
  )
}

function StatChip({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/80 px-3 py-3">
      <p className="text-lg font-bold text-slate-100">{value}</p>
      <p className="text-[10px] uppercase tracking-wide text-slate-500">{label}</p>
    </div>
  )
}
