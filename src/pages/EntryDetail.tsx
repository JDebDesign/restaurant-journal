import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { StarRating } from '../components/ui/StarRating';
import { PriceLevel } from '../components/ui/PriceLevel';
import { getEntry, deleteEntry } from '../lib/entries';
import { getPublicUrl } from '../lib/storage';
import type { EntryWithRestaurant } from '../lib/types';

const WOULD_RETURN: Record<string, { label: string; color: string }> = {
  yes: { label: '↩ Would return', color: 'var(--color-olive)' },
  no: { label: "✕ Wouldn't return", color: 'var(--color-terracotta)' },
  maybe: { label: '~ Maybe return', color: 'var(--color-charcoal-light)' },
};

function formatDate(dateStr: string) {
  return new Date(dateStr + 'T12:00:00').toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <dt className="text-xs font-medium uppercase tracking-wider mb-1" style={{ color: 'var(--color-charcoal-light)' }}>
        {label}
      </dt>
      <dd>{children}</dd>
    </div>
  );
}

export default function EntryDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [entry, setEntry] = useState<EntryWithRestaurant | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    getEntry(id)
      .then(setEntry)
      .catch((err: unknown) => setError(err instanceof Error ? err.message : 'Entry not found'))
      .finally(() => setLoading(false));
  }, [id]);

  async function handleDelete() {
    if (!entry) return;
    setDeleting(true);
    try {
      await deleteEntry(entry.id);
      navigate('/', { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete');
      setDeleting(false);
      setConfirmDelete(false);
    }
  }

  if (loading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-8 rounded-xl w-2/3" style={{ backgroundColor: 'var(--color-sand)' }} />
        <div className="h-48 rounded-2xl" style={{ backgroundColor: 'var(--color-sand)' }} />
      </div>
    );
  }

  if (error || !entry) {
    return (
      <p className="text-sm text-center py-12" style={{ color: 'var(--color-terracotta)' }}>
        {error || 'Entry not found.'}
      </p>
    );
  }

  const { restaurant, photos } = entry;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Link to="/" className="text-sm" style={{ color: 'var(--color-charcoal-light)' }}>
          ← Back
        </Link>
        <Link
          to={`/entries/${entry.id}/edit`}
          className="text-sm font-medium px-3 py-1.5 rounded-lg transition-colors"
          style={{ color: 'var(--color-terracotta)', backgroundColor: '#FEF2F0' }}
        >
          Edit
        </Link>
      </div>

      {/* Header */}
      <div className="space-y-1">
        <h1 className="font-serif text-3xl font-bold leading-tight" style={{ color: 'var(--color-charcoal)' }}>
          {restaurant.name}
        </h1>
        <p className="text-sm" style={{ color: 'var(--color-charcoal-light)' }}>
          {restaurant.address}
        </p>
        {(restaurant.phone || restaurant.website || restaurant.google_maps_url) && (
          <div className="flex gap-3 text-xs pt-1">
            {restaurant.phone && (
              <a href={`tel:${restaurant.phone}`} style={{ color: 'var(--color-terracotta)' }}>
                {restaurant.phone}
              </a>
            )}
            {restaurant.website && (
              <a href={restaurant.website} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-terracotta)' }}>
                Website ↗
              </a>
            )}
            {restaurant.google_maps_url && (
              <a href={restaurant.google_maps_url} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-terracotta)' }}>
                Maps ↗
              </a>
            )}
          </div>
        )}
      </div>

      {/* Photos */}
      {photos.length > 0 && (
        <div className={`grid gap-2 ${photos.length === 1 ? 'grid-cols-1' : 'grid-cols-2'}`}>
          {photos.map((photo) => (
            <a key={photo.id} href={getPublicUrl(photo.storage_path)} target="_blank" rel="noopener noreferrer">
              <img
                src={getPublicUrl(photo.storage_path)}
                alt={photo.file_name}
                className="w-full rounded-xl object-cover aspect-[4/3]"
              />
            </a>
          ))}
        </div>
      )}

      {/* GIF */}
      {entry.gif_url && (
        <img
          src={entry.gif_url}
          alt="Entry GIF"
          className="w-full rounded-xl"
          style={{ maxHeight: '240px', objectFit: 'cover' }}
        />
      )}

      {/* Details */}
      <div
        className="rounded-2xl border p-5 space-y-5"
        style={{ borderColor: 'var(--color-sand-dark)', backgroundColor: 'white' }}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <StarRating value={entry.rating} size="md" />
            <p className="text-xs" style={{ color: 'var(--color-charcoal-light)' }}>
              Visited {formatDate(entry.visited_at)}
            </p>
          </div>
          <div className="flex items-center gap-3">
            {entry.price_level && <PriceLevel value={entry.price_level} display />}
            {entry.would_return && (
              <span className="text-xs font-medium" style={{ color: WOULD_RETURN[entry.would_return].color }}>
                {WOULD_RETURN[entry.would_return].label}
              </span>
            )}
          </div>
        </div>

        <dl className="space-y-4">
          <Section label="Experience">
            <p className="text-sm leading-relaxed" style={{ color: 'var(--color-charcoal)' }}>
              {entry.comment}
            </p>
          </Section>

          {entry.dishes_ordered && (
            <Section label="Ordered">
              <p className="text-sm" style={{ color: 'var(--color-charcoal)' }}>{entry.dishes_ordered}</p>
            </Section>
          )}

          {(entry.ambiance_rating || entry.service_rating) && (
            <Section label="Ratings">
              <div className="flex gap-6">
                {entry.ambiance_rating && (
                  <div className="space-y-0.5">
                    <p className="text-xs" style={{ color: 'var(--color-charcoal-light)' }}>Ambiance</p>
                    <StarRating value={entry.ambiance_rating} size="sm" />
                  </div>
                )}
                {entry.service_rating && (
                  <div className="space-y-0.5">
                    <p className="text-xs" style={{ color: 'var(--color-charcoal-light)' }}>Service</p>
                    <StarRating value={entry.service_rating} size="sm" />
                  </div>
                )}
              </div>
            </Section>
          )}

          {entry.price_notes && (
            <Section label="Price notes">
              <p className="text-sm" style={{ color: 'var(--color-charcoal)' }}>{entry.price_notes}</p>
            </Section>
          )}
        </dl>
      </div>

      {/* Delete */}
      <div className="pt-2 border-t" style={{ borderColor: 'var(--color-sand-dark)' }}>
        {!confirmDelete ? (
          <button
            onClick={() => setConfirmDelete(true)}
            className="text-sm transition-colors"
            style={{ color: 'var(--color-charcoal-light)' }}
          >
            Delete entry
          </button>
        ) : (
          <div className="flex items-center gap-3">
            <p className="text-sm" style={{ color: 'var(--color-charcoal)' }}>Are you sure?</p>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="text-sm font-medium"
              style={{ color: 'var(--color-terracotta)' }}
            >
              {deleting ? 'Deleting…' : 'Yes, delete'}
            </button>
            <button
              onClick={() => setConfirmDelete(false)}
              className="text-sm"
              style={{ color: 'var(--color-charcoal-light)' }}
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
