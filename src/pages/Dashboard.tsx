import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { EntryCard } from '../components/EntryCard';
import { getEntries } from '../lib/entries';
import { useAuth } from '../lib/auth-context';
import type { EntryWithRestaurant } from '../lib/types';

export default function Dashboard() {
  const { session } = useAuth();
  const [entries, setEntries] = useState<EntryWithRestaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!session) return;
    getEntries(session.user.id)
      .then(setEntries)
      .catch((err: unknown) => setError(err instanceof Error ? err.message : 'Failed to load entries'))
      .finally(() => setLoading(false));
  }, [session]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="rounded-2xl border h-56 animate-pulse"
            style={{ borderColor: 'var(--color-sand-dark)', backgroundColor: 'var(--color-sand)' }}
          />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <p className="text-sm text-center py-12" style={{ color: 'var(--color-terracotta)' }}>
        {error}
      </p>
    );
  }

  if (entries.length === 0) {
    return (
      <div className="text-center py-24 space-y-4">
        <div className="text-5xl">🍽️</div>
        <h2 className="font-serif text-2xl font-semibold" style={{ color: 'var(--color-charcoal)' }}>
          No entries yet
        </h2>
        <p className="text-sm" style={{ color: 'var(--color-charcoal-light)' }}>
          Start documenting your culinary adventures.
        </p>
        <Link
          to="/new"
          className="inline-block mt-2 px-5 py-2.5 rounded-xl text-sm font-medium text-white transition-opacity hover:opacity-90"
          style={{ backgroundColor: 'var(--color-terracotta)' }}
        >
          Add your first entry
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-baseline justify-between">
        <h1 className="font-serif text-3xl font-bold" style={{ color: 'var(--color-charcoal)' }}>
          Your Journal
        </h1>
        <span className="text-sm" style={{ color: 'var(--color-charcoal-light)' }}>
          {entries.length} {entries.length === 1 ? 'entry' : 'entries'}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {entries.map((entry) => (
          <EntryCard key={entry.id} entry={entry} />
        ))}
      </div>
    </div>
  );
}
