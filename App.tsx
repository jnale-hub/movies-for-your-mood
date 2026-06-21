import 'react-native-url-polyfill/auto'; 

import { useEffect, useState } from 'react';
import { InteractionManager } from 'react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import './global.css';

import { VibeCheck } from './src/screens/VibeCheck'; 
import { Feed } from './src/screens/Feed';
import { MovieDetail } from './src/screens/MovieDetail'; 
import { CastDetail } from './src/screens/CastDetail';
import { Vibe } from './src/types/movie.types';

import { JournalComposer } from './src/components/JournalComposer';
import { MyLibrary } from './src/screens/MyLibrary';
import { useJournalStore } from '@/store/useJournalStore';

const queryClient = new QueryClient();

export default function App() {
  const [currentVibe, setCurrentVibe] = useState<Vibe | null>(null);
  const [selectedMovieId, setSelectedMovieId] = useState<number | null>(null);
  const [selectedCastId, setSelectedCastId] = useState<number | null>(null);
  const [showLibrary, setShowLibrary] = useState(false);

  const { fetchInitialData } = useJournalStore();

  useEffect(() => {
    const task = InteractionManager.runAfterInteractions(() => {
      fetchInitialData();
    });

    return () => task.cancel();
  }, []); 

  const renderScreen = () => {
    if (showLibrary) {
      return (
        <MyLibrary 
          onBack={() => setShowLibrary(false)}
          onMovieSelect={(id) => {
            setShowLibrary(false);
            setSelectedMovieId(id);
          }}
        />
      );
    }

    if (selectedCastId) {
      return (
        <CastDetail 
          personId={selectedCastId} 
          onBack={() => setSelectedCastId(null)}
          onMovieSelect={(id) => {
            setSelectedCastId(null); 
            setSelectedMovieId(id);
          }}
        />
      );
    }

    if (selectedMovieId) {
      return (
        <MovieDetail 
          movieId={selectedMovieId} 
          onBack={() => setSelectedMovieId(null)} 
          onActorSelect={(id) => setSelectedCastId(id)}
        />
      );
    }

    if (currentVibe) {
      return (
        <Feed 
          vibe={currentVibe} 
          onBack={() => setCurrentVibe(null)} 
          onMovieSelect={(id) => setSelectedMovieId(id)} 
          onOpenLibrary={() => setShowLibrary(true)}
        />
      );
    }

    return <VibeCheck 
        onSelectVibe={(vibe) => setCurrentVibe(vibe)} 
        onOpenLibrary={() => setShowLibrary(true)} 
      />
  };

  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <StatusBar style="dark" />
        
        {renderScreen()}
        
        <JournalComposer />
        
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}
