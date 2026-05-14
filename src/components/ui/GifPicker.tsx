import { useEffect, useState } from 'react';
import { searchGifs } from '../../lib/giphy';
import type { GifResult } from '../../lib/types';

interface GifPickerProps {
  value: string | null;
  onChange: (url: string | null) => void;
}

const inputClass =
  'w-full max-w-full px-3 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 transition-shadow';

const inputStyle = {
  borderColor: 'var(--color-sand-dark)',
  backgroundColor: 'white',
};

export function GifPicker({ value, onChange }: GifPickerProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<GifResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    const timer = setTimeout(async () => {
      setLoading(true);
      setError('');
      try {
        const gifs = await searchGifs(query.trim());
        setResults(gifs);
      } catch {
        setError('Search failed. Try again.');
      } finally {
        setLoading(false);
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [query]);

  function handleSelect(gif: GifResult) {
    onChange(gif.fullUrl);
    setQuery('');
    setResults([]);
  }

  return (
    <div className="space-y-3">
      {value ? (
        <div className="relative inline-block rounded-xl overflow-hidden">
          <img src={value} alt="Selected GIF" className="rounded-xl object-cover" style={{ maxHeight: '160px' }} />
          <button
            type="button"
            onClick={() => onChange(null)}
            className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/60 text-white text-xs flex items-center justify-center"
          >
            ✕
          </button>
        </div>
      ) : (
        <>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for a GIF…"
            className={inputClass}
            style={inputStyle}
          />
          {loading && (
            <p className="text-xs" style={{ color: 'var(--color-charcoal-light)' }}>
              Searching…
            </p>
          )}
          {error && (
            <p className="text-xs" style={{ color: 'var(--color-terracotta)' }}>
              {error}
            </p>
          )}
          {!loading && results.length > 0 && (
            <div className="grid grid-cols-3 gap-2 max-h-64 overflow-y-auto rounded-xl">
              {results.map((gif) => (
                <button
                  key={gif.id}
                  type="button"
                  onClick={() => handleSelect(gif)}
                  className="relative rounded-lg overflow-hidden hover:opacity-80 transition-opacity focus:outline-none"
                  style={{ paddingBottom: '100%' }}
                  title={gif.title}
                >
                  <img src={gif.previewUrl} alt={gif.title} className="absolute inset-0 w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
          {!loading && query.trim() && results.length === 0 && !error && (
            <p className="text-xs text-center py-4" style={{ color: 'var(--color-charcoal-light)' }}>
              No GIFs found for "{query}"
            </p>
          )}
        </>
      )}
    </div>
  );
}
