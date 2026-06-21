import { useState } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, useWindowDimensions } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { fetchMovieDetails } from '../api/tmdb';
import { useJournalStore } from '../store/useJournalStore';

import { FilmGrain } from '../components/FilmGrain';
import { MovieDetailSkeleton } from '../components/MovieDetailSkeleton';
import { CastGallery } from '../components/CastGallery';
import { TrailerModal } from '../components/TrailerModal';
import { WhereToWatch } from '../components/WhereToWatch';
import { JournalFeed } from '../components/JournalFeed';

interface MovieDetailProps {
  movieId: number;
  onBack: () => void;
  onActorSelect: (id: number) => void;
}

export const MovieDetail = ({ movieId, onBack, onActorSelect }: MovieDetailProps) => {
  const insets = useSafeAreaInsets();
  
  const { openComposer, toggleWatchlist, isInWatchlist } = useJournalStore();
  const isSaved = isInWatchlist(movieId);
  
  const [showTrailer, setShowTrailer] = useState(false);
  
  const { width } = useWindowDimensions();
  const videoWidth = Math.min(width, 1000); 
  const videoHeight = videoWidth * (9 / 16);

  const { data: movie, isLoading, isError } = useQuery({
    queryKey: ['movie-detail', movieId],
    queryFn: () => fetchMovieDetails(movieId),
  });

  if (isError) {
    return (
      <View className="flex-1 bg-art-sand justify-center items-center px-6">
        <Text className="font-serif text-2xl text-dark-charcoal mb-4">Something went wrong.</Text>
        <Text className="font-sans text-sm text-dark-charcoal/60 text-center mb-8">
          We couldn&apos;t fetch the details for this movie. Check your connection or try again.
        </Text>
        <TouchableOpacity onPress={onBack} className="py-3 px-6 bg-dark-charcoal rounded-full mt-4">
          <Text className="font-sans text-soft-cream text-xs uppercase tracking-widest">Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (isLoading) {
    return <MovieDetailSkeleton />;
  }

  const trailer = movie?.videos?.results?.find((v: any) => v.type === 'Trailer' && v.site === 'YouTube');

  return (
    <View className="flex-1 bg-art-sand overflow-hidden">
      <FilmGrain />
      
      <ScrollView bounces={false} showsVerticalScrollIndicator={false} className="flex-1">
        
        <View className="relative w-full h-[45vh] md:h-[55vh] max-h-[600px]">
          <Image 
            source={{ uri: `https://image.tmdb.org/t/p/original${movie?.backdrop_path}` }}
            className="w-full h-full"
            resizeMode="cover"
          />
          <View pointerEvents="none" className="absolute inset-0">
            <View className="flex-1 bg-gradient-to-t from-art-sand via-art-sand/40 to-transparent" />
          </View>
          
          <TouchableOpacity 
            onPress={onBack}
            style={{ top: Math.max(insets.top + 10, 20), left: 20 }}
            className="absolute p-3 bg-black/30 rounded-full backdrop-blur-md z-10"
          >
            <Text className="text-soft-cream text-xs tracking-widest uppercase font-semibold">← back</Text>
          </TouchableOpacity>
        </View>

        <View className="w-full max-w-4xl mx-auto px-6 md:px-12 -mt-20 md:-mt-32 pb-32">
          
          <View className="flex-row items-end md:items-stretch mb-10 md:mb-14">
            <View className="w-32 md:w-48 aspect-[2/3] rounded-2xl overflow-hidden shadow-2xl border border-white/20 bg-black/20">
              {movie?.poster_path && (
                <Image 
                  source={{ uri: `https://image.tmdb.org/t/p/w500${movie.poster_path}` }}
                  className="w-full h-full"
                />
              )}
            </View>
            
            <View className="flex-1 pl-5 md:pl-8 pb-2 md:pb-4 justify-end">
              <Text className="font-serif text-3xl md:text-5xl lg:text-6xl text-dark-charcoal leading-tight mb-2 md:mb-4">
                {movie?.title}
              </Text>
              <Text className="font-sans text-xs md:text-sm tracking-wider text-dark-charcoal/60 uppercase font-semibold">
                {movie?.release_date?.split('-')[0]} • {movie?.runtime} mins • ★ {movie?.vote_average?.toFixed(1)}
              </Text>
            </View>
          </View>

          <View className="flex-col md:flex-row md:gap-12">
            <View className="flex-1">
              
              <View className="flex-row flex-wrap items-center mb-8 gap-6">
                {trailer && (
                  <TouchableOpacity 
                    activeOpacity={0.7}
                    onPress={() => setShowTrailer(true)}
                    className="flex-row items-center py-1 opacity-60 hover:opacity-100 transition-opacity"
                  >
                    <Text className="text-dark-charcoal text-xs mr-1.5 font-medium">▶</Text>
                    <Text className="font-sans font-bold text-dark-charcoal tracking-widest text-[11px] uppercase">
                      watch trailer
                    </Text>
                  </TouchableOpacity>
                )}

                <TouchableOpacity 
                  onPress={async () => {
                    if (movie) {
                      await toggleWatchlist({ 
                        id: movieId, 
                        title: movie.title, 
                        posterPath: movie.poster_path || null 
                      });
                    }
                  }}
                  className="flex-row items-center py-1 opacity-60 hover:opacity-100 transition-opacity"
                >
                  <Text className="text-dark-charcoal text-sm mr-1.5 font-medium mb-0.5">
                    {isSaved ? '★' : '☆'}
                  </Text>
                  <Text className="font-sans font-bold text-dark-charcoal tracking-widest text-[11px] uppercase">
                    {isSaved ? 'saved to library' : 'add to watchlist'}
                  </Text>
                </TouchableOpacity>
              </View>

              <View className="mb-12">
                <Text className="font-serifItalic text-xl md:text-2xl text-dark-charcoal/50 mb-4 lowercase">the story</Text>
                <Text className="font-sans text-base md:text-lg leading-relaxed text-dark-charcoal/80">
                  {movie?.overview}
                </Text>
              </View>

              <WhereToWatch providers={movie?.['watch/providers']} />

              <JournalFeed topicId={movieId} topicType="movie" />

              <CastGallery 
                cast={movie?.credits?.cast || []} 
                onActorSelect={onActorSelect} 
              />
              
            </View>
          </View>
        </View>
      </ScrollView>

      <TouchableOpacity 
        activeOpacity={0.8}
        onPress={() => openComposer({ id: movieId, type: 'movie', name: movie?.title || 'Unknown' })}
        style={{ bottom: Math.max(insets.bottom + 20, 32), right: 24 }}
        className="absolute bg-dark-charcoal px-5 py-4 rounded-full shadow-2xl flex-row items-center border border-white/10 z-50"
      >
        <Text className="text-soft-cream text-lg mr-2 leading-none">✍🏽</Text>
        <Text className="font-sans text-soft-cream font-bold text-[11px] tracking-widest uppercase mt-0.5">log thought</Text>
      </TouchableOpacity>

      {trailer ? (
        <TrailerModal 
          visible={showTrailer} 
          onClose={() => setShowTrailer(false)} 
          trailerKey={trailer.key} 
          videoWidth={videoWidth} 
          videoHeight={videoHeight} 
        />
      ) : null}

    </View>
  );
};
