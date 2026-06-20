export interface Movie {
  id: number;
  title: string;
  original_title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  genre_ids: number[];
}

export interface MovieResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

export type Vibe = 
  | 'laugh' 
  | 'adrenaline' 
  | 'think' 
  | 'cry' 
  | 'scare' 
  | 'chill';

export interface VibeMapping {
  vibe: Vibe;
  genres: string;
  sortBy: string;
  minRating?: number;
}
