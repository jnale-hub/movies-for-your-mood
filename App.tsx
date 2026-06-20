import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import './global.css';

import { VibeCheck } from './src/screens/VibeCheck';
import { Feed } from './src/screens/Feed';
import { MovieDetail } from './src/screens/MovieDetail'; 
import { Vibe } from './src/types/movie.types';

const queryClient = new QueryClient();

export default function App() {
  const [currentVibe, setCurrentVibe] = useState<Vibe | null>(null);
  const [selectedMovieId, setSelectedMovieId] = useState<number | null>(null);

  const renderScreen = () => {
    if (selectedMovieId) {
      return (
        <MovieDetail 
          movieId={selectedMovieId} 
          onBack={() => setSelectedMovieId(null)} 
        />
      );
    }

    if (currentVibe) {
      return (
        <Feed 
          vibe={currentVibe} 
          onBack={() => setCurrentVibe(null)} 
          onMovieSelect={(id) => setSelectedMovieId(id)} 
        />
      );
    }

    return (
      <VibeCheck 
        onSelectVibe={(vibe) => setCurrentVibe(vibe)} 
      />
    );
  };

  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <StatusBar style="light" />
        {renderScreen()}
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}
