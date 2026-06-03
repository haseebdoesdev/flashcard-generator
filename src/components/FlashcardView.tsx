interface FlashcardViewProps {
  front: string
  back: string
  flipped: boolean
  onFlip: () => void
}

export function FlashcardView({ front, back, flipped, onFlip }: FlashcardViewProps) {
  return (
    <button
      type="button"
      onClick={onFlip}
      className="group relative mx-auto flex h-full w-full max-w-md flex-1 cursor-pointer flex-col focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
      aria-label={flipped ? 'Show question' : 'Show answer'}
      style={{ perspective: '1200px' }}
    >
      <div
        className={`card-flip-inner relative h-full min-h-[280px] w-full ${flipped ? 'is-flipped' : ''}`}
      >
        <div className="card-face absolute inset-0 flex flex-col items-center justify-center rounded-2xl border border-slate-700/80 bg-gradient-to-br from-slate-800 to-slate-900 p-6 shadow-xl shadow-black/30">
          <span className="mb-3 text-xs font-semibold uppercase tracking-widest text-violet-400">
            Question
          </span>
          <p className="whitespace-pre-wrap text-center text-xl font-medium leading-relaxed text-slate-100 sm:text-2xl">
            {front}
          </p>
          <span className="mt-auto pt-6 text-xs text-slate-500 group-hover:text-slate-400">
            Tap to reveal answer
          </span>
        </div>

        <div className="card-face card-face-back absolute inset-0 flex flex-col items-center justify-center rounded-2xl border border-emerald-700/40 bg-gradient-to-br from-slate-800 to-emerald-950/40 p-6 shadow-xl shadow-black/30">
          <span className="mb-3 text-xs font-semibold uppercase tracking-widest text-emerald-400">
            Answer
          </span>
          <p className="whitespace-pre-wrap text-center text-xl font-medium leading-relaxed text-slate-100 sm:text-2xl">
            {back}
          </p>
        </div>
      </div>
    </button>
  )
}
