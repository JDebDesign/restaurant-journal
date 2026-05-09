import { SUPABASE_URL, SUPABASE_ANON_KEY } from './supabase';
import type { GifResult } from './types';

const PROXY_URL = `${SUPABASE_URL}/functions/v1/giphy-proxy`;

export async function searchGifs(query: string, limit = 20): Promise<GifResult[]> {
  const res = await fetch(PROXY_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      apikey: SUPABASE_ANON_KEY,
    },
    body: JSON.stringify({ query, limit }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error((err as { error?: string }).error ?? 'Giphy proxy error');
  }
  const data = (await res.json()) as { gifs: GifResult[] };
  return data.gifs ?? [];
}
