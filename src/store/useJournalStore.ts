import { create } from 'zustand';
import { supabase } from '../lib/supabase';

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

export interface WatchlistItem {
  id: number;
  title: string;
  posterPath: string | null;
}

interface JournalStore {
  entries: JournalEntry[];
  watchlist: WatchlistItem[];
  isLoaded: boolean;
  isComposing: boolean;
  composerContext: { id: number; type: 'movie' | 'cast'; name: string } | null;

  init: () => void;
  fetchData: () => Promise<void>;
  openComposer: (context?: { id: number; type: 'movie' | 'cast'; name: string }) => void;
  closeComposer: () => void;
  addEntry: (entry: Omit<JournalEntry, 'id' | 'createdAt'>) => Promise<void>;
  toggleWatchlist: (item: WatchlistItem) => Promise<void>;
  isInWatchlist: (id: number) => boolean;
}

export const useJournalStore = create<JournalStore>((set, get) => ({
  entries: [],
  watchlist: [],
  isLoaded: false,
  isComposing: false,
  composerContext: null,

  init: () => {
    get().fetchData();

    supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' || event === 'USER_UPDATED') {
        get().fetchData();
      } else if (event === 'SIGNED_OUT') {
        set({ entries: [], watchlist: [], isLoaded: true });
      }
    });
  },

  fetchData: async () => {
    set({ isLoaded: false });
    
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      await supabase.auth.signInAnonymously();
      set({ isLoaded: true });
      return;
    }

    try {
      const { data: journalData } = await supabase
        .from('journal_entries')
        .select('*')
        .order('created_at', { ascending: false });

      const { data: watchlistData } = await supabase
        .from('watchlist')
        .select('*');

      const mappedEntries: JournalEntry[] = journalData?.map(item => ({
        id: item.id,
        topicId: item.topic_id,
        topicType: item.topic_type as 'movie' | 'cast' | 'general',
        topicName: item.topic_name,
        stage: item.stage as WatchStage,
        text: item.text,
        createdAt: Number(item.created_at),
      })) || [];

      const mappedWatchlist: WatchlistItem[] = watchlistData?.map(item => ({
        id: Number(item.id),
        title: item.title,
        posterPath: item.poster_path,
      })) || [];

      set({ entries: mappedEntries, watchlist: mappedWatchlist, isLoaded: true });
    } catch (error) {
      console.error("Error fetching data:", error);
      set({ isLoaded: true });
    }
  },

  openComposer: (context) => set({ isComposing: true, composerContext: context || null }),
  closeComposer: () => set({ isComposing: false, composerContext: null }),

  addEntry: async (entryData) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const newId = Date.now().toString();
    const newCreatedAt = Date.now();

    const { error } = await supabase
      .from('journal_entries') 
      .insert({
        id: newId,
        user_id: session.user.id,
        topic_id: entryData.topicId || null,
        topic_type: entryData.topicType,
        topic_name: entryData.topicName,
        stage: entryData.stage,
        text: entryData.text,
        created_at: newCreatedAt,
      });

    if (error) {
      console.error("Error saving entry:", error);
      return;
    }

    const newEntry: JournalEntry = {
      id: newId,
      topicId: entryData.topicId,
      topicType: entryData.topicType,
      topicName: entryData.topicName,
      stage: entryData.stage,
      text: entryData.text,
      createdAt: newCreatedAt,
    };
    set((state) => ({ entries: [newEntry, ...state.entries] }));
  },

  toggleWatchlist: async (item) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const state = get();
    const isSaved = state.isInWatchlist(item.id);

    if (isSaved) {
      const { error } = await supabase
        .from('watchlist')
        .delete()
        .eq('id', item.id)
        .eq('user_id', session.user.id); 
        
      if (error) {
        console.error("Error removing from watchlist:", error);
        return;
      }

      set((state) => ({
        watchlist: state.watchlist.filter(w => w.id !== item.id)
      }));
    } else {
      const { error } = await supabase
        .from('watchlist')
        .insert({
          id: item.id,
          user_id: session.user.id,
          title: item.title,
          poster_path: item.posterPath,
        });

      if (error) {
        console.error("Error adding to watchlist:", error);
        return;
      }

      set((state) => ({
        watchlist: [{ ...item }, ...state.watchlist]
      }));
    }
  },

  isInWatchlist: (id) => get().watchlist.some(item => item.id === id),
}));

useJournalStore.getState().init();
