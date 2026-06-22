import { View, Text, ScrollView, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { fetchPersonDetails } from '../api/tmdb';
import { FilmGrain } from '../components/FilmGrain';
import { useJournalStore } from '@/store/useJournalStore';
import { JournalFeed } from '@/components/JournalFeed';
import { Feather } from '@expo/vector-icons';

export const CastDetail = ({ 
  personId, 
  onBack, 
  onMovieSelect 
}: { 
  personId: number; 
  onBack: () => void;
  onMovieSelect: (movieId: number) => void;
}) => {
  const insets = useSafeAreaInsets();

  const { data: person, isLoading, isError } = useQuery({
    queryKey: ['person-detail', personId],
    queryFn: () => fetchPersonDetails(personId),
  });

  const { openComposer } = useJournalStore();

  if (isError) {
    return (
      <View className="flex-1 bg-art-sand justify-center items-center px-6">
        <Text 
          className="font-serif text-2xl text-dark-charcoal mb-4"
          accessibilityRole="header"
        >
          Something went wrong.
        </Text>
        <TouchableOpacity 
          onPress={onBack} 
          className="py-3 px-6 bg-dark-charcoal rounded-full mt-4"
          accessibilityRole="button"
          accessibilityLabel="Go Back"
          accessibilityHint="Returns to the previous screen"
        >
          <Text className="font-sans text-soft-cream text-xs uppercase tracking-widest">Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (isLoading) {
    return (
      <View className="flex-1 bg-art-sand justify-center items-center">
        <ActivityIndicator size="small" color="#1E2326" accessibilityLabel="Loading actor details" />
      </View>
    );
  }

  const knownForMovies = person?.movie_credits?.cast
    ?.sort((a: any, b: any) => b.popularity - a.popularity)
    ?.slice(0, 15) || [];

  return (
    <View className="flex-1 bg-art-sand">
      <FilmGrain />
      
      <View style={{ paddingTop: Math.max(insets.top + 10, 20) }} className="px-6 pb-4 z-10">
       <TouchableOpacity 
          onPress={onBack} 
          className="self-start flex-row items-center py-2 pr-4 opacity-60 hover:opacity-100 -ml-2"
          activeOpacity={0.6}
          accessibilityRole="button"
          accessibilityLabel="Back to movie"
          accessibilityHint="Returns to the movie details screen"
        >
          <Feather name="chevron-left" size={20} color="#1E2326" importantForAccessibility="no" />
          <Text 
            className="font-sans text-dark-charcoal text-xs tracking-widest uppercase font-bold ml-1"
            importantForAccessibility="no-hide-descendants"
          >
            back to movie
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} className="flex-1 px-6 md:max-w-4xl md:mx-auto md:w-full">
        
        <View className="flex-row mt-4 mb-10">
          <View className="w-32 md:w-48 aspect-[2/3] rounded-2xl overflow-hidden shadow-xl bg-black/10 border border-dark-charcoal/10">
            {person?.profile_path ? (
              <Image 
                source={{ uri: `https://image.tmdb.org/t/p/w500${person.profile_path}` }}
                className="w-full h-full"
                accessibilityRole="image"
                accessibilityLabel={`Profile photo of ${person?.name}`}
              />
            ) : (
              <View className="flex-1 justify-center items-center" importantForAccessibility="no-hide-descendants">
                <Text className="text-4xl">👤</Text>
              </View>
            )}
          </View>
          
          <View className="flex-1 pl-6 justify-center">
            <Text 
              className="font-serif text-3xl md:text-5xl text-dark-charcoal leading-tight mb-2"
              accessibilityRole="header"
            >
              {person?.name}
            </Text>
            {person?.birthday && (
              <Text className="font-sans text-xs tracking-wider text-dark-charcoal/60 uppercase mb-1">
                Born: {person.birthday}
              </Text>
            )}
            {person?.place_of_birth && (
              <Text className="font-sans text-xs tracking-wider text-dark-charcoal/60 uppercase">
                {person.place_of_birth}
              </Text>
            )}
          </View>
        </View>

        {person?.biography ? (
          <View className="mb-12">
            <Text 
              className="font-serifItalic text-xl text-dark-charcoal/50 mb-4 lowercase"
              accessibilityRole="header"
            >
              biography
            </Text>
            <Text className="font-sans text-sm md:text-base leading-relaxed text-dark-charcoal/80">
              {person.biography}
            </Text>
          </View>
        ) : null}

        <JournalFeed topicId={personId} topicType="cast" />
        
        <View className="mb-20">
          <Text 
            className="font-serifItalic text-xl text-dark-charcoal/50 mb-6 lowercase"
            accessibilityRole="header"
          >
            known for
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="-mx-6 px-6 md:mx-0 md:px-0">
            {knownForMovies.map((movie: any) => (
              <TouchableOpacity 
                key={`${movie.id}-${movie.credit_id}`}
                className="mr-4 w-28 md:w-36"
                activeOpacity={0.7}
                onPress={() => onMovieSelect(movie.id)} 
                accessibilityRole="button"
                accessibilityLabel={`${movie.title}, ${movie.character ? `played ${movie.character}` : `released in ${movie.release_date?.split('-')[0]}`}`}
                accessibilityHint={`View details for ${movie.title}`}
              >
                <View className="w-full aspect-[2/3] rounded-xl bg-black/10 overflow-hidden mb-2 shadow-sm border border-dark-charcoal/10">
                  {movie.poster_path ? (
                    <Image 
                      source={{ uri: `https://image.tmdb.org/t/p/w342${movie.poster_path}` }}
                      className="w-full h-full"
                      importantForAccessibility="no"
                    />
                  ) : null}
                </View>
                <Text 
                  className="font-sans text-xs font-bold text-dark-charcoal" 
                  numberOfLines={1}
                  importantForAccessibility="no-hide-descendants"
                >
                  {movie.title}
                </Text>
                <Text 
                  className="font-sans text-[10px] text-dark-charcoal/50" 
                  numberOfLines={1}
                  importantForAccessibility="no-hide-descendants"
                >
                  {movie.character ? `as ${movie.character}` : movie.release_date?.split('-')[0]}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

      </ScrollView>

      <TouchableOpacity 
        activeOpacity={0.8}
        onPress={() => openComposer({ id: personId, type: 'cast', name: person?.name || 'Unknown' })}
        style={{ bottom: Math.max(insets.bottom + 20, 32), right: 24 }}
        className="absolute bg-dark-charcoal px-5 py-4 rounded-full shadow-2xl flex-row items-center border border-white/10 z-50"
        accessibilityRole="button"
        accessibilityLabel="Log thought"
        accessibilityHint={`Opens the journal composer to write a note about ${person?.name || 'this person'}`}
      >
        <Text className="text-soft-cream text-lg mr-2 leading-none" importantForAccessibility="no">✍🏽</Text>
        <Text className="font-sans text-soft-cream font-bold text-[11px] tracking-widest uppercase mt-0.5" importantForAccessibility="no-hide-descendants">
          log thought
        </Text>
      </TouchableOpacity>
    </View>
  );
};
