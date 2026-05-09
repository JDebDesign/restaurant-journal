import { useState } from 'react';
import { StarRating } from './ui/StarRating';
import { PriceLevel } from './ui/PriceLevel';
import { PhotoUploader } from './ui/PhotoUploader';
import { GifPicker } from './ui/GifPicker';
import { getPublicUrl } from '../lib/storage';
import type { EntryFormValues, EntryPhoto } from '../lib/types';

interface EntryFormProps {
  onSubmit: (values: EntryFormValues) => Promise<void>;
  initialValues?: Partial<EntryFormValues>;
  existingPhotos?: EntryPhoto[];
  onRemoveExistingPhoto?: (photo: EntryPhoto) => void;
  submitLabel?: string;
}

const today = new Date().toISOString().split('T')[0];

const defaultValues: EntryFormValues = {
  restaurantName: '',
  restaurantAddress: '',
  visitedAt: today,
  rating: 0,
  comment: '',
  dishesOrdered: '',
  ambianceRating: null,
  serviceRating: null,
  wouldReturn: null,
  priceLevel: null,
  priceNotes: '',
  photos: [],
  gifUrl: null,
};

const inputClass =
  'w-full max-w-full px-3 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 transition-shadow';

const inputStyle = {
  borderColor: 'var(--color-sand-dark)',
  backgroundColor: 'white',
};

function FieldLabel({ children, optional = false }: { children: React.ReactNode; optional?: boolean }) {
  return (
    <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--color-charcoal)' }}>
      {children}
      {optional && (
        <span className="ml-1 text-xs font-normal" style={{ color: 'var(--color-charcoal-light)' }}>
          optional
        </span>
      )}
    </label>
  );
}

export function EntryForm({ onSubmit, initialValues, existingPhotos, onRemoveExistingPhoto, submitLabel = 'Save Entry' }: EntryFormProps) {
  const [values, setValues] = useState<EntryFormValues>(() => ({ ...defaultValues, ...initialValues }));
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  function set<K extends keyof EntryFormValues>(key: K, val: EntryFormValues[K]) {
    setValues((prev) => ({ ...prev, [key]: val }));
  }

  const canSubmit = values.restaurantName.trim().length > 0 && values.rating > 0 && values.comment.trim().length > 0;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit || submitting) return;
    setSubmitting(true);
    setError('');
    try {
      await onSubmit(values);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">

      {/* Restaurant */}
      <div>
        <FieldLabel>Restaurant name</FieldLabel>
        <input
          type="text"
          value={values.restaurantName}
          onChange={(e) => set('restaurantName', e.target.value)}
          placeholder="e.g. Nobu, Le Bernardin, your local pizza spot"
          className={inputClass}
          style={inputStyle}
        />
      </div>

      {/* Address */}
      <div>
        <FieldLabel optional>Address</FieldLabel>
        <input
          type="text"
          value={values.restaurantAddress}
          onChange={(e) => set('restaurantAddress', e.target.value)}
          placeholder="e.g. 105 Hudson St, New York, NY"
          className={inputClass}
          style={inputStyle}
        />
      </div>

      {/* Date */}
      <div>
        <FieldLabel optional>Visit date</FieldLabel>
        <div className="overflow-hidden rounded-xl">
          <input
            type="date"
            value={values.visitedAt}
            onChange={(e) => set('visitedAt', e.target.value)}
            className={inputClass}
            style={inputStyle}
          />
        </div>
      </div>

      {/* Rating */}
      <div>
        <FieldLabel>Overall rating</FieldLabel>
        <StarRating value={values.rating} onChange={(v) => set('rating', v)} size="lg" />
        {values.rating === 0 && (
          <p className="text-xs mt-1" style={{ color: 'var(--color-charcoal-light)' }}>Click a star to rate</p>
        )}
      </div>

      {/* Comment */}
      <div>
        <FieldLabel>Your experience</FieldLabel>
        <textarea
          value={values.comment}
          onChange={(e) => set('comment', e.target.value)}
          placeholder="What did you think? How was the food, the atmosphere, the service?"
          rows={4}
          className={`${inputClass} resize-none`}
          style={inputStyle}
        />
      </div>

      {/* Dishes */}
      <div>
        <FieldLabel optional>What did you order?</FieldLabel>
        <input
          type="text"
          value={values.dishesOrdered}
          onChange={(e) => set('dishesOrdered', e.target.value)}
          placeholder="e.g. Tonkotsu ramen, crispy gyoza, matcha ice cream"
          className={inputClass}
          style={inputStyle}
        />
      </div>

      {/* Ambiance + Service */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <FieldLabel optional>Ambiance</FieldLabel>
          <StarRating value={values.ambianceRating ?? 0} onChange={(v) => set('ambianceRating', v || null)} />
        </div>
        <div>
          <FieldLabel optional>Service</FieldLabel>
          <StarRating value={values.serviceRating ?? 0} onChange={(v) => set('serviceRating', v || null)} />
        </div>
      </div>

      {/* Would return */}
      <div>
        <FieldLabel optional>Would you go back?</FieldLabel>
        <div className="flex gap-2">
          {(['yes', 'maybe', 'no'] as const).map((opt) => {
            const selected = values.wouldReturn === opt;
            const colors: Record<string, string> = {
              yes: 'var(--color-olive)',
              maybe: 'var(--color-charcoal-light)',
              no: 'var(--color-terracotta)',
            };
            return (
              <button
                key={opt}
                type="button"
                onClick={() => set('wouldReturn', selected ? null : opt)}
                className="px-4 py-1.5 rounded-lg text-sm font-medium border capitalize transition-all"
                style={{
                  borderColor: selected ? colors[opt] : 'var(--color-sand-dark)',
                  backgroundColor: selected ? colors[opt] : 'white',
                  color: selected ? 'white' : 'var(--color-charcoal)',
                }}
              >
                {opt}
              </button>
            );
          })}
        </div>
      </div>

      {/* Price level */}
      <div>
        <FieldLabel optional>Price level</FieldLabel>
        <PriceLevel value={values.priceLevel} onChange={(v) => set('priceLevel', v)} />
      </div>

      {/* Price notes */}
      <div>
        <FieldLabel optional>Price thoughts</FieldLabel>
        <input
          type="text"
          value={values.priceNotes}
          onChange={(e) => set('priceNotes', e.target.value)}
          placeholder="e.g. Great value, a bit pricey but worth it"
          className={inputClass}
          style={inputStyle}
        />
      </div>

      {/* Photos */}
      <div>
        <FieldLabel optional>Photos</FieldLabel>
        {existingPhotos && existingPhotos.length > 0 && (
          <div className="grid grid-cols-3 gap-2 mb-3">
            {existingPhotos.map((photo) => (
              <div key={photo.id} className="relative aspect-square rounded-lg overflow-hidden">
                <img
                  src={getPublicUrl(photo.storage_path)}
                  alt={photo.file_name}
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => onRemoveExistingPhoto?.(photo)}
                  className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/60 text-white text-xs flex items-center justify-center"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
        <PhotoUploader files={values.photos} onChange={(f) => set('photos', f)} />
      </div>

      {/* GIF */}
      <div>
        <FieldLabel optional>GIF vibe</FieldLabel>
        <GifPicker value={values.gifUrl} onChange={(url) => set('gifUrl', url)} />
      </div>

      {error && (
        <p className="text-sm px-3 py-2 rounded-lg" style={{ color: 'var(--color-terracotta)', backgroundColor: '#FEF2F0' }}>
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={!canSubmit || submitting}
        className="w-full py-3 rounded-xl font-medium text-sm text-white transition-opacity disabled:opacity-40"
        style={{ backgroundColor: 'var(--color-terracotta)' }}
      >
        {submitting ? 'Saving…' : submitLabel}
      </button>
    </form>
  );
}
