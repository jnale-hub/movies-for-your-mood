import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { VibeCheck } from './src/screens/VibeCheck';
import { Feed } from './src/screens/Feed';
import { Vibe } from './src/types/movie.types';
import './global.css';

const queryClient = new QueryClient();

export default function App() {
  const [currentVibe, setCurrentVibe] = useState<Vibe | null>(null);

  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        {currentVibe === null ? (
          <VibeCheck onSelectVibe={setCurrentVibe} />
        ) : (
          <Feed vibe={currentVibe} onBack={() => setCurrentVibe(null)} />
        )}
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}
