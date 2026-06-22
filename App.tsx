import 'react-native-url-polyfill/auto'; 

import React, { Suspense, lazy, useEffect, useState, useTransition } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen'; 
import './global.css';

import { VibeCheck } from './src/screens/VibeCheck'; 
import { Vibe } from './src/types/movie.types';
import { useJournalStore } from './src/store/useJournalStore';

// Lazy Loaded Screens
const Feed = lazy(() => import('./src/screens/Feed').then(m => ({ default: m.Feed })));
const MovieDetail = lazy(() => import('./src/screens/MovieDetail').then(m => ({ default: m.MovieDetail })));
const CastDetail = lazy(() => import('./src/screens/CastDetail').then(m => ({ default: m.CastDetail })));
const MyLibrary = lazy(() => import('./src/screens/MyLibrary').then(m => ({ default: m.MyLibrary })));
const JournalComposer = lazy(() => import('./src/components/JournalComposer').then(m => ({ default: m.JournalComposer })));

SplashScreen.preventAutoHideAsync();
const queryClient = new QueryClient();

const ScreenLoader = () => (
  <View className="flex-1 bg-art-sand justify-center items-center">
    <ActivityIndicator size="large" color="#1E2326" />
  </View>
);

export default function App() {
  const [currentVibe, setCurrentVibe] = useState<Vibe | null>(null);
  const [selectedMovieId, setSelectedMovieId] = useState<number | null>(null);
  const [selectedCastId, setSelectedCastId] = useState<number | null>(null);
  const [showLibrary, setShowLibrary] = useState(false);

  const [isPending, startTransition] = useTransition();

  const isLoaded = useJournalStore(state => state.isLoaded);

  useEffect(() => {
    if (isLoaded) {
      setTimeout(() => {
        SplashScreen.hideAsync();
      }, 100); 
    }
  }, [isLoaded]);

  const navigateToLibrary = (show: boolean) => startTransition(() => setShowLibrary(show));
  const navigateToVibe = (vibe: Vibe | null) => startTransition(() => setCurrentVibe(vibe));
  const navigateToMovie = (id: number | null) => startTransition(() => setSelectedMovieId(id));
  const navigateToCast = (id: number | null) => startTransition(() => setSelectedCastId(id));

  const renderScreen = () => {
    if (showLibrary) {
      return (
        <MyLibrary 
          onBack={() => navigateToLibrary(false)}
          onMovieSelect={(id) => {
            navigateToLibrary(false);
            navigateToMovie(id);
          }}
        />
      );
    }

    if (selectedCastId) {
      return (
        <CastDetail 
          personId={selectedCastId} 
          onBack={() => navigateToCast(null)}
          onMovieSelect={(id) => {
            navigateToCast(null); 
            navigateToMovie(id);
          }}
        />
      );
    }

    if (selectedMovieId) {
      return (
        <MovieDetail 
          movieId={selectedMovieId} 
          onBack={() => navigateToMovie(null)} 
          onActorSelect={(id) => navigateToCast(id)}
        />
      );
    }

    if (currentVibe) {
      return (
        <Feed 
          vibe={currentVibe} 
          onBack={() => navigateToVibe(null)} 
          onMovieSelect={(id) => navigateToMovie(id)} 
          onOpenLibrary={() => navigateToLibrary(true)}
        />
      );
    }

    return (
      <VibeCheck 
        onSelectVibe={(vibe) => navigateToVibe(vibe)} 
        onOpenLibrary={() => navigateToLibrary(true)} 
      />
    );
  };

  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <StatusBar style="dark" />
        
        <Suspense fallback={<ScreenLoader />}>
          <View className="flex-1">
            {renderScreen()}
    
            {isPending && (
              <View className="absolute top-12 right-6 z-50 p-2 bg-black/20 rounded-full">
                 <ActivityIndicator size="small" color="#FDFBF7" />
              </View>
            )}
          </View>
          <JournalComposer />
        </Suspense>

      </QueryClientProvider>
    </SafeAreaProvider>
  );
}
