const LABELS = ['$', '$$', '$$$', '$$$$'];

interface PriceLevelProps {
  value: number | null;
  onChange?: (value: number | null) => void;
  display?: boolean;
}

export function PriceLevel({ value, onChange, display = false }: PriceLevelProps) {
  if (display) {
    if (!value) return null;
    return (
      <span className="text-sm font-medium" style={{ color: 'var(--color-olive)' }}>
        {LABELS[value - 1]}
      </span>
    );
  }

  return (
    <div className="flex gap-2">
      {LABELS.map((label, i) => {
        const level = i + 1;
        const selected = value === level;
        return (
          <button
            key={level}
            type="button"
            onClick={() => onChange?.(selected ? null : level)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-all ${
              selected
                ? 'border-transparent text-white'
                : 'border-sand-dark bg-white hover:border-olive'
            }`}
            style={
              selected
                ? { backgroundColor: 'var(--color-olive)', borderColor: 'var(--color-olive)' }
                : { borderColor: 'var(--color-sand-dark)' }
            }
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
