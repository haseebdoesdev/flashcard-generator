interface LevelUpToastProps {
  level: number
  onDismiss: () => void
}

export function LevelUpToast({ level, onDismiss }: LevelUpToastProps) {
  return (
    <div
      className="pointer-events-none fixed inset-x-0 top-[max(5rem,calc(env(safe-area-inset-top)+4rem))] z-50 flex justify-center px-4"
      role="status"
      aria-live="polite"
    >
      <div
        className="animate-level-up pointer-events-auto flex items-center gap-3 rounded-2xl border border-violet-500/40 bg-slate-900/95 px-5 py-3 shadow-2xl shadow-violet-500/20 backdrop-blur-md"
        onAnimationEnd={onDismiss}
      >
        <span className="text-2xl" aria-hidden>
          ⭐
        </span>
        <div className="text-left">
          <p className="text-xs font-semibold uppercase tracking-wider text-violet-400">
            Level up!
          </p>
          <p className="text-lg font-bold text-slate-100">You reached level {level}</p>
        </div>
      </div>
    </div>
  )
}
