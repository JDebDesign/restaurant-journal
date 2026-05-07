import { useNavigate, Link } from 'react-router-dom';
import { EntryForm } from '../components/EntryForm';
import { createEntry } from '../lib/entries';
import { useAuth } from '../lib/auth-context';
import type { EntryFormValues } from '../lib/types';

export default function NewEntry() {
  const { session } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(values: EntryFormValues) {
    if (!session) throw new Error('Not authenticated');
    const entryId = await createEntry(session.user.id, values);
    navigate(`/entries/${entryId}`);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link
          to="/"
          className="text-sm transition-colors"
          style={{ color: 'var(--color-charcoal-light)' }}
        >
          ← Back
        </Link>
        <h1 className="font-serif text-2xl font-bold" style={{ color: 'var(--color-charcoal)' }}>
          New Entry
        </h1>
      </div>
      <EntryForm onSubmit={handleSubmit} />
    </div>
  );
}
