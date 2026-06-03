import { useEffect, useState } from 'react'
import type { Deck } from '../types'

interface UseDeckResult {
  deck: Deck | null
  loading: boolean
  error: string | null
}

export function useDeck(): UseDeckResult {
  const [deck, setDeck] = useState<Deck | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        const res = await fetch('/flashcards.json')
        if (!res.ok) throw new Error(`Failed to load deck (${res.status})`)
        const data = (await res.json()) as Deck
        if (!data.cards?.length) throw new Error('Deck has no cards')
        if (!cancelled) {
          setDeck(data)
          setError(null)
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to load deck')
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [])

  return { deck, loading, error }
}
