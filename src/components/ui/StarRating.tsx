interface StarRatingProps {
  value: number;
  onChange?: (value: number) => void;
  size?: 'sm' | 'md' | 'lg';
}

const sizes = { sm: 'text-base', md: 'text-2xl', lg: 'text-3xl' };

export function StarRating({ value, onChange, size = 'md' }: StarRatingProps) {
  const interactive = !!onChange;

  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange?.(value === star ? 0 : star)}
          disabled={!interactive}
          className={`${sizes[size]} leading-none transition-transform ${
            interactive ? 'hover:scale-110 cursor-pointer' : 'cursor-default'
          } disabled:cursor-default`}
          aria-label={`${star} star${star !== 1 ? 's' : ''}`}
        >
          <span style={{ color: star <= value ? 'var(--color-terracotta)' : 'var(--color-sand-dark)' }}>
            ★
          </span>
        </button>
      ))}
    </div>
  );
}
