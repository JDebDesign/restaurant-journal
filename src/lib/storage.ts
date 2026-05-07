import { supabase } from './supabase';

const BUCKET = 'entry-photos';

export async function uploadPhoto(userId: string, entryId: string, file: File): Promise<string> {
  const ext = file.name.split('.').pop() ?? 'jpg';
  const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
  });
  const path = `${userId}/${entryId}/${uuid}.${ext}`;
  const contentType = file.type || 'image/jpeg';
  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    contentType,
    upsert: false,
  });
  if (error) throw error;
  return path;
}

export function getPublicUrl(storagePath: string): string {
  const { data } = supabase.storage.from(BUCKET).getPublicUrl(storagePath);
  return data.publicUrl;
}

export async function deletePhoto(storagePath: string): Promise<void> {
  const { error } = await supabase.storage.from(BUCKET).remove([storagePath]);
  if (error) throw error;
}
