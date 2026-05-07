export interface Restaurant {
  id: string;
  place_id: string;
  name: string;
  address: string;
  lat: number | null;
  lng: number | null;
  phone: string | null;
  website: string | null;
  google_maps_url: string | null;
  created_at: string;
}

export interface JournalEntry {
  id: string;
  user_id: string;
  restaurant_id: string;
  visited_at: string;
  rating: 1 | 2 | 3 | 4 | 5;
  comment: string;
  dishes_ordered: string | null;
  ambiance_rating: 1 | 2 | 3 | 4 | 5 | null;
  service_rating: 1 | 2 | 3 | 4 | 5 | null;
  would_return: 'yes' | 'no' | 'maybe' | null;
  price_level: 1 | 2 | 3 | 4 | null;
  price_notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface EntryPhoto {
  id: string;
  entry_id: string;
  user_id: string;
  storage_path: string;
  file_name: string;
  file_size: number | null;
  mime_type: string | null;
  created_at: string;
}

export interface EntryWithRestaurant extends JournalEntry {
  restaurant: Restaurant;
  photos: EntryPhoto[];
}

export interface EntryFormValues {
  restaurantName: string;
  restaurantAddress: string;
  visitedAt: string;
  rating: number;
  comment: string;
  dishesOrdered: string;
  ambianceRating: number | null;
  serviceRating: number | null;
  wouldReturn: 'yes' | 'no' | 'maybe' | null;
  priceLevel: number | null;
  priceNotes: string;
  photos: File[];
}
