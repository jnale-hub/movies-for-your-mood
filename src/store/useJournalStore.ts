import { create } from 'zustand';

export type WatchStage = 'before' | 'during' | 'after' | null;

export interface JournalEntry {
  id: string;
  topicId?: number;
  topicType: 'movie' | 'cast' | 'general';
  topicName: string;
  stage: WatchStage;
  text: string;
  createdAt: number;
}

export interface SavedMovie {
  id: number;
  title: string;
  posterPath: string | null;
}

interface JournalStore {
  entries: JournalEntry[];
  watchlist: SavedMovie[];
  
  addEntry: (entry: Omit<JournalEntry, 'id' | 'createdAt'>) => void;
  getEntriesByTopic: (topicId: number, topicType: 'movie' | 'cast') => JournalEntry[];
  toggleWatchlist: (movie: SavedMovie) => void;
  isInWatchlist: (id: number) => boolean;

  // Global Composer UI State
  isComposing: boolean;
  composerContext: { id: number; type: 'movie' | 'cast'; name: string } | null;
  openComposer: (context?: { id: number; type: 'movie' | 'cast'; name: string } | null) => void;
  closeComposer: () => void;
}

export const useJournalStore = create<JournalStore>((set, get) => ({
  entries: [],
  watchlist: [],
  
  addEntry: (entryData) => set((state) => ({
    entries: [{ ...entryData, id: Math.random().toString(36).substring(2, 9), createdAt: Date.now() }, ...state.entries]
  })),
  
  getEntriesByTopic: (topicId, topicType) => {
    return get().entries
      .filter(e => e.topicId === topicId && e.topicType === topicType)
      .sort((a, b) => b.createdAt - a.createdAt);
  },

  toggleWatchlist: (movie) => set((state) => {
    const exists = state.watchlist.some(m => m.id === movie.id);
    if (exists) {
      return { watchlist: state.watchlist.filter(m => m.id !== movie.id) };
    }
    return { watchlist: [movie, ...state.watchlist] };
  }),

  isInWatchlist: (id) => get().watchlist.some(m => m.id === id),

  // Composer Control
  isComposing: false,
  composerContext: null,
  openComposer: (context = null) => set({ isComposing: true, composerContext: context }),
  closeComposer: () => set({ isComposing: false, composerContext: null }),
}));
