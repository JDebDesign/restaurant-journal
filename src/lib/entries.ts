import { supabase } from './supabase';
import { uploadPhoto } from './storage';
import type { EntryFormValues, EntryWithRestaurant } from './types';

function randomUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
  });
}

async function upsertRestaurant(name: string, address: string): Promise<string> {
  const { data, error } = await supabase
    .from('restaurants')
    .insert({
      place_id: randomUUID(),
      name: name.trim(),
      address: address.trim(),
    })
    .select('id')
    .single();
  if (error) throw error;
  return (data as { id: string }).id;
}

export async function createEntry(userId: string, values: EntryFormValues): Promise<string> {
  if (!values.restaurantName.trim()) throw new Error('Restaurant name is required');
  if (!values.rating) throw new Error('Rating is required');
  if (!values.comment.trim()) throw new Error('Comment is required');

  const restaurantId = await upsertRestaurant(values.restaurantName, values.restaurantAddress);

  const { data: entry, error: entryError } = await supabase
    .from('journal_entries')
    .insert({
      user_id: userId,
      restaurant_id: restaurantId,
      visited_at: values.visitedAt,
      rating: values.rating,
      comment: values.comment.trim(),
      dishes_ordered: values.dishesOrdered.trim() || null,
      ambiance_rating: values.ambianceRating,
      service_rating: values.serviceRating,
      would_return: values.wouldReturn,
      price_level: values.priceLevel,
      price_notes: values.priceNotes.trim() || null,
      gif_url: values.gifUrl,
    })
    .select('id')
    .single();
  if (entryError) throw entryError;

  const entryId = (entry as { id: string }).id;

  if (values.photos.length > 0) {
    const results = await Promise.allSettled(
      values.photos.map(async (file) => {
        const path = await uploadPhoto(userId, entryId, file);
        const { error } = await supabase.from('entry_photos').insert({
          entry_id: entryId,
          user_id: userId,
          storage_path: path,
          file_name: file.name,
          file_size: file.size,
          mime_type: file.type || 'image/jpeg',
        });
        if (error) throw error;
      }),
    );
    results.forEach((r, i) => {
      if (r.status === 'rejected') {
        console.error(`Photo ${i + 1} upload failed:`, r.reason);
      }
    });
  }

  return entryId;
}

export async function getEntries(userId: string): Promise<EntryWithRestaurant[]> {
  const { data, error } = await supabase
    .from('journal_entries')
    .select('*, restaurant:restaurants(*), photos:entry_photos(*)')
    .eq('user_id', userId)
    .order('visited_at', { ascending: false });
  if (error) throw error;
  return (data ?? []) as unknown as EntryWithRestaurant[];
}

export async function getEntry(entryId: string): Promise<EntryWithRestaurant> {
  const { data, error } = await supabase
    .from('journal_entries')
    .select('*, restaurant:restaurants(*), photos:entry_photos(*)')
    .eq('id', entryId)
    .single();
  if (error) throw error;
  return data as unknown as EntryWithRestaurant;
}

export async function updateEntry(
  entryId: string,
  restaurantId: string,
  userId: string,
  values: EntryFormValues,
  removedPhotoStoragePaths: string[],
): Promise<void> {
  const { error: restError } = await supabase
    .from('restaurants')
    .update({ name: values.restaurantName.trim(), address: values.restaurantAddress.trim() })
    .eq('id', restaurantId);
  if (restError) throw restError;

  const { error: entryError } = await supabase
    .from('journal_entries')
    .update({
      visited_at: values.visitedAt,
      rating: values.rating,
      comment: values.comment.trim(),
      dishes_ordered: values.dishesOrdered.trim() || null,
      ambiance_rating: values.ambianceRating,
      service_rating: values.serviceRating,
      would_return: values.wouldReturn,
      price_level: values.priceLevel,
      price_notes: values.priceNotes.trim() || null,
      gif_url: values.gifUrl,
    })
    .eq('id', entryId);
  if (entryError) throw entryError;

  if (removedPhotoStoragePaths.length > 0) {
    await supabase.storage.from('entry-photos').remove(removedPhotoStoragePaths);
    await supabase.from('entry_photos').delete().in('storage_path', removedPhotoStoragePaths);
  }

  if (values.photos.length > 0) {
    const results = await Promise.allSettled(
      values.photos.map(async (file) => {
        const path = await uploadPhoto(userId, entryId, file);
        const { error } = await supabase.from('entry_photos').insert({
          entry_id: entryId,
          user_id: userId,
          storage_path: path,
          file_name: file.name,
          file_size: file.size,
          mime_type: file.type || 'image/jpeg',
        });
        if (error) throw error;
      }),
    );
    results.forEach((r, i) => {
      if (r.status === 'rejected') console.error(`Photo ${i + 1} upload failed:`, r.reason);
    });
  }
}

export async function deleteEntry(entryId: string): Promise<void> {
  const { error } = await supabase.from('journal_entries').delete().eq('id', entryId);
  if (error) throw error;
}
