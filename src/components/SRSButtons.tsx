import type { Rating } from '../types'
import type { CardProgress } from '../types'
import { previewInterval } from '../lib/sm2'

interface SRSButtonsProps {
  disabled: boolean
  cardId: string
  progress: CardProgress | undefined
  onRate: (rating: Rating) => void
}

const BUTTONS: {
  rating: Rating
  label: string
  sub: string
  className: string
}[] = [
  {
    rating: 'again',
    label: 'Again',
    sub: 'Forgot',
    className:
      'bg-red-500/15 text-red-400 ring-red-500/30 active:bg-red-500/25 hover:bg-red-500/20',
  },
  {
    rating: 'hard',
    label: 'Hard',
    sub: 'Struggled',
    className:
      'bg-orange-500/15 text-orange-400 ring-orange-500/30 active:bg-orange-500/25 hover:bg-orange-500/20',
  },
  {
    rating: 'good',
    label: 'Good',
    sub: 'Got it',
    className:
      'bg-emerald-500/15 text-emerald-400 ring-emerald-500/30 active:bg-emerald-500/25 hover:bg-emerald-500/20',
  },
  {
    rating: 'easy',
    label: 'Easy',
    sub: 'Too easy',
    className:
      'bg-sky-500/15 text-sky-400 ring-sky-500/30 active:bg-sky-500/25 hover:bg-sky-500/20',
  },
]

export function SRSButtons({ disabled, cardId, progress, onRate }: SRSButtonsProps) {
  return (
    <div className="grid shrink-0 grid-cols-4 gap-2 px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-2">
      {BUTTONS.map(({ rating, label, sub, className }) => (
        <button
          key={rating}
          type="button"
          disabled={disabled}
          onClick={() => onRate(rating)}
          className={`flex min-h-12 flex-col items-center justify-center rounded-xl px-1 py-2 text-center ring-1 transition-all active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 ${className}`}
        >
          <span className="text-xs font-bold sm:text-sm">{label}</span>
          <span className="text-[10px] opacity-70 sm:text-xs">{sub}</span>
          {!disabled && (
            <span className="mt-0.5 text-[9px] font-medium opacity-50">
              {previewInterval(progress, cardId, rating)}
            </span>
          )}
        </button>
      ))}
    </div>
  )
}
