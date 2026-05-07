import { SUPABASE_URL, SUPABASE_ANON_KEY } from './supabase';
import type { PlaceResult } from './types';

const PROXY_URL = `${SUPABASE_URL}/functions/v1/places-proxy`;

async function callProxy(body: object): Promise<unknown> {
  const res = await fetch(PROXY_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      apikey: SUPABASE_ANON_KEY,
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error((err as { error?: string }).error ?? 'Places proxy error');
  }
  return res.json();
}

export async function searchRestaurants(query: string): Promise<PlaceResult[]> {
  const data = (await callProxy({ action: 'search', query })) as { places: PlaceResult[] };
  return data.places ?? [];
}

export async function getPlaceDetails(placeId: string): Promise<PlaceResult> {
  const data = (await callProxy({ action: 'details', placeId })) as { place: PlaceResult };
  return data.place;
}
