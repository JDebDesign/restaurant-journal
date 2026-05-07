import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { EntryForm } from '../components/EntryForm';
import { getEntry, updateEntry } from '../lib/entries';
import { useAuth } from '../lib/auth-context';
import type { EntryFormValues, EntryPhoto, EntryWithRestaurant } from '../lib/types';

export default function EditEntry() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { session } = useAuth();
  const [entry, setEntry] = useState<EntryWithRestaurant | null>(null);
  const [loading, setLoading] = useState(true);
  const [removedPhotos, setRemovedPhotos] = useState<EntryPhoto[]>([]);

  useEffect(() => {
    if (!id) return;
    getEntry(id)
      .then(setEntry)
      .finally(() => setLoading(false));
  }, [id]);

  async function handleSubmit(values: EntryFormValues) {
    if (!entry || !session) throw new Error('Not authenticated');
    await updateEntry(
      entry.id,
      entry.restaurant_id,
      session.user.id,
      values,
      removedPhotos.map((p) => p.storage_path),
    );
    navigate(`/entries/${entry.id}`);
  }

  if (loading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-8 rounded-xl w-2/3" style={{ backgroundColor: 'var(--color-sand)' }} />
        <div className="h-48 rounded-2xl" style={{ backgroundColor: 'var(--color-sand)' }} />
      </div>
    );
  }

  if (!entry) {
    return (
      <p className="text-sm text-center py-12" style={{ color: 'var(--color-terracotta)' }}>
        Entry not found.
      </p>
    );
  }

  const initialValues: EntryFormValues = {
    restaurantName: entry.restaurant.name,
    restaurantAddress: entry.restaurant.address || '',
    visitedAt: entry.visited_at,
    rating: entry.rating,
    comment: entry.comment,
    dishesOrdered: entry.dishes_ordered || '',
    ambianceRating: entry.ambiance_rating,
    serviceRating: entry.service_rating,
    wouldReturn: entry.would_return,
    priceLevel: entry.price_level,
    priceNotes: entry.price_notes || '',
    photos: [],
  };

  const currentPhotos = entry.photos.filter(
    (p) => !removedPhotos.some((r) => r.id === p.id),
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link
          to={`/entries/${entry.id}`}
          className="text-sm transition-colors"
          style={{ color: 'var(--color-charcoal-light)' }}
        >
          ← Back
        </Link>
        <h1 className="font-serif text-2xl font-bold" style={{ color: 'var(--color-charcoal)' }}>
          Edit Entry
        </h1>
      </div>
      <EntryForm
        onSubmit={handleSubmit}
        initialValues={initialValues}
        existingPhotos={currentPhotos}
        onRemoveExistingPhoto={(photo) => setRemovedPhotos((prev) => [...prev, photo])}
        submitLabel="Save Changes"
      />
    </div>
  );
}
