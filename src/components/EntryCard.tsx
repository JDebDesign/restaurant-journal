import { Link } from 'react-router-dom';
import { StarRating } from './ui/StarRating';
import { PriceLevel } from './ui/PriceLevel';
import { getPublicUrl } from '../lib/storage';
import type { EntryWithRestaurant } from '../lib/types';

const WOULD_RETURN_LABELS: Record<string, string> = {
  yes: '↩ Would return',
  no: '✕ Wouldn\'t return',
  maybe: '~ Maybe',
};

const WOULD_RETURN_COLORS: Record<string, string> = {
  yes: 'var(--color-olive)',
  no: 'var(--color-terracotta)',
  maybe: 'var(--color-charcoal-light)',
};

function formatDate(dateStr: string) {
  return new Date(dateStr + 'T12:00:00').toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

interface EntryCardProps {
  entry: EntryWithRestaurant;
}

export function EntryCard({ entry }: EntryCardProps) {
  const previewPhotos = entry.photos.slice(0, 2);

  return (
    <Link
      to={`/entries/${entry.id}`}
      className="block rounded-2xl border overflow-hidden transition-shadow hover:shadow-md group"
      style={{ borderColor: 'var(--color-sand-dark)', backgroundColor: 'white' }}
    >
      {previewPhotos.length === 1 && (
        <div className="aspect-[16/9] overflow-hidden">
          <img
            src={getPublicUrl(previewPhotos[0].storage_path)}
            alt={entry.restaurant.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      )}
      {previewPhotos.length === 2 && (
        <div className="grid grid-cols-2 gap-0.5">
          {previewPhotos.map((photo) => (
            <div key={photo.id} className="aspect-square overflow-hidden">
              <img
                src={getPublicUrl(photo.storage_path)}
                alt={entry.restaurant.name}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
          ))}
        </div>
      )}
      <div className="p-4 space-y-2">
        <div className="flex items-start justify-between gap-2">
          <h3
            className="font-serif font-semibold text-lg leading-tight"
            style={{ color: 'var(--color-charcoal)' }}
          >
            {entry.restaurant.name}
          </h3>
          {entry.price_level && <PriceLevel value={entry.price_level} display />}
        </div>

        <div className="flex items-center gap-2">
          <StarRating value={entry.rating} size="sm" />
          <span className="text-xs" style={{ color: 'var(--color-charcoal-light)' }}>
            {formatDate(entry.visited_at)}
          </span>
        </div>

        <p className="text-sm line-clamp-2 leading-relaxed" style={{ color: 'var(--color-charcoal-light)' }}>
          {entry.comment}
        </p>

        {entry.would_return && (
          <p className="text-xs font-medium" style={{ color: WOULD_RETURN_COLORS[entry.would_return] }}>
            {WOULD_RETURN_LABELS[entry.would_return]}
          </p>
        )}
      </div>
    </Link>
  );
}
