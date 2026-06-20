import { useQuery } from '@tanstack/react-query';
import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Animated, Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { fetchMoviesByVibe } from '../api/tmdb';
import { FilmGrain } from '../components/FilmGrain';
import { Movie, Vibe } from '../types/movie.types';

const feedThemes: Record<Vibe, { bg: string; title: string; textColor: string }> = {
  laugh: { bg: 'bg-soft-cream', title: 'movies to heal your soul', textColor: 'text-dark-charcoal' },
  adrenaline: { bg: 'bg-vibe-green', title: 'movies packed with pure adrenaline', textColor: 'text-soft-cream' },
  think: { bg: 'bg-dark-charcoal', title: 'movies for the slightly pretentious art hoes', textColor: 'text-soft-cream' },
  cry: { bg: 'bg-twilight-maroon', title: 'movies for when you want a good cry', textColor: 'text-soft-cream' },
  scare: { bg: 'bg-[#2A2A2A]', title: 'movies to watch with the lights off', textColor: 'text-soft-cream' },
  chill: { bg: 'bg-[#A49A87]', title: 'movies that feel like a warm blanket', textColor: 'text-dark-charcoal' },
};

const AnimatedMovieCard = ({ 
  movie, 
  theme, 
  index,
  onPress 
}: { 
  movie: Movie; 
  theme: any; 
  index: number;
  onPress: () => void;
}) => {
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(opacityAnim, {
      toValue: 1,
      duration: 800,
      delay: (index % 4) * 100, 
      useNativeDriver: true,
    }).start();
  },);

  return (
    <View className="w-[48%] md:w-[23%] mb-8">
      <TouchableOpacity activeOpacity={0.8} onPress={onPress}>
        <Animated.View style={{ opacity: opacityAnim }}>
          <View className="w-full aspect-[2/3] rounded-2xl overflow-hidden bg-black/10 shadow-sm mb-2.5">
            {movie.poster_path ? (
              <Image 
                source={{ uri: `https://image.tmdb.org/t/p/w500${movie.poster_path}` }}
                className="w-full h-full"
                resizeMode="cover"
              />
            ) : (
              <View className="flex-1 justify-center items-center p-4">
                <Text className={`font-serif text-center text-sm ${theme.textColor}`}>{movie.title}</Text>
              </View>
            )}
          </View>
          <View className="px-1">
            <Text className={`font-sans text-sm font-semibold tracking-tight ${theme.textColor}`} numberOfLines={1}>{movie.title}</Text>
            <Text className={`font-sans text-[11px] tracking-wider mt-0.5 opacity-60 ${theme.textColor}`}>
              {movie.release_date?.split('-')[0]} • ★ {movie.vote_average.toFixed(1)}
            </Text>
          </View>
        </Animated.View>
      </TouchableOpacity>
    </View>
  );
};

export const Feed = ({ 
  vibe, 
  onBack, 
  onMovieSelect 
}: { 
  vibe: Vibe; 
  onBack: () => void;
  onMovieSelect: (id: number) => void;
}) => {
  const theme = feedThemes[vibe];
  const insets = useSafeAreaInsets(); 
  const [displayLimit, setDisplayLimit] = useState(4);

  const { data, isLoading} = useQuery({
    queryKey: ['movies', vibe],
    queryFn: () => fetchMoviesByVibe(vibe),
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

  return (
    <View className={`flex-1 ${theme.bg} overflow-hidden`}>
      <FilmGrain />
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="w-full max-w-6xl mx-auto px-6" style={{ paddingTop: insets.top + 24, paddingBottom: 48 }}>
          
          <TouchableOpacity onPress={onBack} className="mb-8 self-start">
            <Text className={`font-sans text-sm lowercase tracking-wider opacity-60 ${theme.textColor}`}>← change vibe</Text>
          </TouchableOpacity>
          
          <Text className={`font-serifItalic text-3xl md:text-5xl text-center mb-16 ${theme.textColor}`}>{theme.title}</Text>

          {isLoading && <ActivityIndicator size="small" color={theme.textColor} />}
          
          <View className="flex-row flex-wrap justify-between w-full">
            {data?.results.slice(0, displayLimit).map((movie, index) => (
              <AnimatedMovieCard 
                key={movie.id} 
                movie={movie} 
                theme={theme} 
                index={index} 
                onPress={() => onMovieSelect(movie.id)}
              />
            ))}
          </View>

          {data && displayLimit < data.results.length && (
            <TouchableOpacity onPress={() => setDisplayLimit(prev => prev + 4)} className="py-8 items-center">
              <Text className={`font-sans text-xs tracking-widest uppercase opacity-40 ${theme.textColor}`}>load more</Text>
            </TouchableOpacity>
          )}
          
        </View>
      </ScrollView>
    </View>
  );
};
