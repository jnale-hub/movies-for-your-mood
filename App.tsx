import 'react-native-url-polyfill/auto'; 

import React, { Suspense, lazy, useEffect, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen'; 
import './global.css';

import { VibeCheck } from './src/screens/VibeCheck'; 
import { Vibe } from './src/types/movie.types';
import { useJournalStore } from './src/store/useJournalStore';

const Feed = lazy(() => import('./src/screens/Feed').then(m => ({ default: m.Feed })));
const MovieDetail = lazy(() => import('./src/screens/MovieDetail').then(m => ({ default: m.MovieDetail })));
const CastDetail = lazy(() => import('./src/screens/CastDetail').then(m => ({ default: m.CastDetail })));
const MyLibrary = lazy(() => import('./src/screens/MyLibrary').then(m => ({ default: m.MyLibrary })));
const JournalComposer = lazy(() => import('./src/components/JournalComposer').then(m => ({ default: m.JournalComposer })));

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

export default function App() {
  const [currentVibe, setCurrentVibe] = useState<Vibe | null>(null);
  const [selectedMovieId, setSelectedMovieId] = useState<number | null>(null);
  const [selectedCastId, setSelectedCastId] = useState<number | null>(null);
  const [showLibrary, setShowLibrary] = useState(false);

  const isLoaded = useJournalStore(state => state.isLoaded);

  useEffect(() => {
    if (isLoaded) {
      setTimeout(() => {
        SplashScreen.hideAsync();
      }, 100); 
    }
  }, [isLoaded]);

  const renderScreen = () => {
    if (showLibrary) return <MyLibrary onBack={() => setShowLibrary(false)} onMovieSelect={(id) => { setShowLibrary(false); setSelectedMovieId(id); }} />;
    if (selectedCastId) return <CastDetail personId={selectedCastId} onBack={() => setSelectedCastId(null)} onMovieSelect={(id) => { setSelectedCastId(null); setSelectedMovieId(id); }} />;
    if (selectedMovieId) return <MovieDetail movieId={selectedMovieId} onBack={() => setSelectedMovieId(null)} onActorSelect={(id) => setSelectedCastId(id)} />;
    if (currentVibe) return <Feed vibe={currentVibe} onBack={() => setCurrentVibe(null)} onMovieSelect={(id) => setSelectedMovieId(id)} onOpenLibrary={() => setShowLibrary(true)} />;
    
    return <VibeCheck onSelectVibe={(vibe) => setCurrentVibe(vibe)} onOpenLibrary={() => setShowLibrary(true)} />;
  };

  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <StatusBar style="dark" />
        <Suspense fallback={null}>
          {renderScreen()}
          <JournalComposer />
        </Suspense>

      </QueryClientProvider>
    </SafeAreaProvider>
  );
}