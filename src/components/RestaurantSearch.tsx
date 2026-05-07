import { useEffect, useRef, useState } from 'react';
import { searchRestaurants } from '../lib/places';
import type { PlaceResult } from '../lib/types';

interface RestaurantSearchProps {
  selected: PlaceResult | null;
  onSelect: (place: PlaceResult) => void;
  onClear: () => void;
}

export function RestaurantSearch({ selected, onSelect, onClear }: RestaurantSearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<PlaceResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!query.trim()) { setResults([]); setOpen(false); return; }

    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const places = await searchRestaurants(query);
        setResults(places);
        setOpen(true);
        setActiveIndex(-1);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [query]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  function handleKeyDown(e: React.KeyboardEvent) {
    if (!open) return;
    if (e.key === 'ArrowDown') { e.preventDefault(); setActiveIndex((i) => Math.min(i + 1, results.length - 1)); }
    if (e.key === 'ArrowUp') { e.preventDefault(); setActiveIndex((i) => Math.max(i - 1, 0)); }
    if (e.key === 'Enter' && activeIndex >= 0) { e.preventDefault(); onSelect(results[activeIndex]); setOpen(false); }
    if (e.key === 'Escape') setOpen(false);
  }

  if (selected) {
    return (
      <div className="flex items-start gap-3 p-3 rounded-xl border" style={{ borderColor: 'var(--color-sand-dark)', backgroundColor: 'var(--color-sand)' }}>
        <div className="flex-1 min-w-0">
          <p className="font-semibold font-serif truncate" style={{ color: 'var(--color-charcoal)' }}>{selected.name}</p>
          <p className="text-sm truncate" style={{ color: 'var(--color-charcoal-light)' }}>{selected.address}</p>
        </div>
        <button
          type="button"
          onClick={onClear}
          className="text-sm shrink-0 mt-0.5 underline"
          style={{ color: 'var(--color-terracotta)' }}
        >
          Change
        </button>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="relative">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => results.length > 0 && setOpen(true)}
          placeholder="Search for a restaurant…"
          className="w-full px-4 py-2.5 pr-10 rounded-xl border text-sm focus:outline-none focus:ring-2 transition-shadow"
          style={{
            borderColor: 'var(--color-sand-dark)',
            backgroundColor: 'white',
            boxShadow: 'none',
          }}
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
          {loading ? (
            <svg className="animate-spin w-4 h-4" style={{ color: 'var(--color-charcoal-light)' }} viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
          ) : (
            <svg className="w-4 h-4" style={{ color: 'var(--color-charcoal-light)' }} viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
            </svg>
          )}
        </div>
      </div>

      {open && results.length > 0 && (
        <ul
          className="absolute z-50 w-full mt-1 rounded-xl border shadow-lg overflow-hidden"
          style={{ borderColor: 'var(--color-sand-dark)', backgroundColor: 'white' }}
        >
          {results.map((place, i) => (
            <li key={place.placeId}>
              <button
                type="button"
                onMouseDown={() => { onSelect(place); setQuery(''); setOpen(false); }}
                className={`w-full text-left px-4 py-3 transition-colors ${i < results.length - 1 ? 'border-b' : ''}`}
                style={{
                  borderColor: 'var(--color-sand)',
                  backgroundColor: i === activeIndex ? 'var(--color-sand)' : 'white',
                }}
              >
                <p className="font-medium text-sm truncate" style={{ color: 'var(--color-charcoal)' }}>{place.name}</p>
                <p className="text-xs truncate mt-0.5" style={{ color: 'var(--color-charcoal-light)' }}>{place.address}</p>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
