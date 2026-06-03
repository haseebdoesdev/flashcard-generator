import { StatsBar } from './components/StatsBar'
import { FlashcardView } from './components/FlashcardView'
import { SRSButtons } from './components/SRSButtons'
import { EmptyState } from './components/EmptyState'
import { LevelUpToast } from './components/LevelUpToast'
import { useDeck } from './hooks/useDeck'
import { useStudySession } from './hooks/useStudySession'

export default function App() {
  const { deck, loading, error } = useDeck()

  if (loading) {
    return (
      <div className="flex h-full min-h-svh items-center justify-center bg-slate-950">
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-2 border-violet-500 border-t-transparent" />
          <p className="text-sm text-slate-400">Loading flashcards…</p>
        </div>
      </div>
    )
  }

  if (error || !deck) {
    return (
      <div className="flex h-full min-h-svh items-center justify-center bg-slate-950 px-6">
        <div className="max-w-sm text-center">
          <p className="mb-2 text-4xl" aria-hidden>
            📭
          </p>
          <h1 className="mb-2 text-xl font-bold text-slate-100">Could not load deck</h1>
          <p className="text-sm text-slate-400">{error ?? 'Unknown error'}</p>
        </div>
      </div>
    )
  }

  return <StudyApp deck={deck} />
}

function StudyApp({ deck }: { deck: NonNullable<ReturnType<typeof useDeck>['deck']> }) {
  const {
    currentCard,
    flipped,
    isComplete,
    progress,
    stats,
    session,
    dueCount,
    dueTomorrow,
    levelUpLevel,
    queueLength,
    flip,
    rate,
    dismissLevelUp,
    restartSession,
  } = useStudySession({ cards: deck.cards })

  return (
    <div className="flex h-full min-h-svh flex-col bg-slate-950">
      <StatsBar stats={stats} dueCount={dueCount} deckName={deck.deckName} />

      {levelUpLevel !== null && (
        <LevelUpToast level={levelUpLevel} onDismiss={dismissLevelUp} />
      )}

      <main className="flex flex-1 flex-col px-4 py-4">
        {isComplete ? (
          <EmptyState
            stats={stats}
            session={session}
            dueTomorrow={dueTomorrow}
            onStudyMore={restartSession}
          />
        ) : currentCard ? (
          <>
            {deck.description && (
              <p className="mb-3 text-center text-xs text-slate-500">{deck.description}</p>
            )}
            <FlashcardView
              front={currentCard.front}
              back={currentCard.back}
              flipped={flipped}
              onFlip={flip}
            />
            <p className="mt-3 text-center text-xs text-slate-600">
              {queueLength} card{queueLength === 1 ? '' : 's'} left in session
            </p>
          </>
        ) : null}
      </main>

      {!isComplete && currentCard && (
        <SRSButtons
          disabled={!flipped}
          cardId={currentCard.id}
          progress={progress[currentCard.id]}
          onRate={rate}
        />
      )}

      {!isComplete && !flipped && currentCard && (
        <p className="pb-2 text-center text-xs text-slate-600">
          Flip the card before rating
        </p>
      )}
    </div>
  )
}
