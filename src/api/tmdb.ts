import { create } from 'axios';
import { Vibe, MovieResponse, MovieDetails } from '../types/movie.types';

type VibeConfig = {
  with_genres: string;
  without_genres?: string;
  sort_by: string;
  'vote_average.gte'?: number;
  'vote_count.gte'?: number;
};

// The Deep-Curation Matrix
const vibeMap: Record<Vibe, VibeConfig> = {
  laugh: { 
    with_genres: '35', 
    without_genres: '18,80,27,99', 
    sort_by: 'vote_average.desc', 
    'vote_average.gte': 7.0, 
    'vote_count.gte': 2500
  },
  
  adrenaline: { 
    with_genres: '28|53', 
    without_genres: '10749,10751', 
    sort_by: 'vote_average.desc', 
    'vote_average.gte': 7.0, 
    'vote_count.gte': 3000 
  },
  
  think: { 
    with_genres: '878|964|80', 
    without_genres: '35,28', 
    sort_by: 'vote_average.desc', 
    'vote_average.gte': 7.6,
    'vote_count.gte': 3000 
  }, 
  
  cry: { 
    with_genres: '18,10749', 
    without_genres: '878,28',
    sort_by: 'vote_average.desc', 
    'vote_average.gte': 7.3, 
    'vote_count.gte': 2000 
  },
  
  scare: { 
    with_genres: '27', 
    without_genres: '35', 
    sort_by: 'vote_average.desc', 
    'vote_average.gte': 6.6, 
    'vote_count.gte': 2000 
  },
  
  chill: { 
    with_genres: '16|10751|35', 
    without_genres: '53,27,28,80', 
    sort_by: 'vote_average.desc', 
    'vote_average.gte': 7.2, 
    'vote_count.gte': 2000 
  },
};

const tmdb = create({
  baseURL: 'https://api.themoviedb.org/3',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${process.env.EXPO_PUBLIC_TMDB_API_TOKEN}`
  }
});

export const fetchMoviesByVibe = async (vibe: Vibe): Promise<MovieResponse> => {
  const config = vibeMap[vibe];
  
  const randomPage = Math.floor(Math.random() * 2) + 1;
  
  const { data } = await tmdb.get<MovieResponse>('/discover/movie', {
    params: {
      include_adult: false,
      include_video: false,
      language: 'en-US',
      page: randomPage, 
      without_poster: false, 
      append_to_response: 'videos,credits,watch/providers',
      ...config,
    }
  });

  if (data && data.results) {
    data.results = data.results.sort(() => Math.random() - 0.5);
  }

  return data;
};

export const fetchMovieDetails = async (movieId: number): Promise<MovieDetails> => {
  const { data } = await tmdb.get<MovieDetails>(`/movie/${movieId}`, {
    params: {
      append_to_response: 'videos,credits',
    }
  });

  return data;
};
