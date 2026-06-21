import { useState } from 'react';
import { View, Text, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useJournalStore } from '../store/useJournalStore';

interface MyLibraryProps {
  onBack: () => void;
  onMovieSelect: (id: number) => void;
}

export const MyLibrary = ({ onBack, onMovieSelect }: MyLibraryProps) => {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<'journal' | 'watchlist'>('journal');
  
  const entries = useJournalStore((state) => state.entries) || [];
  const watchlist = useJournalStore((state) => state.watchlist) || [];
  const isLoaded = useJournalStore((state) => state.isLoaded);

  return (
    <View className="flex-1 bg-art-sand">
      <View 
        className="px-6 mb-8 w-full max-w-4xl mx-auto" 
        style={{ paddingTop: Math.max(insets.top, 20) }}
      >
        <View className="flex-row justify-between items-center mb-6">
          <TouchableOpacity onPress={onBack} className="p-2 -ml-2" activeOpacity={0.6}>
            <Text className="text-dark-charcoal font-sans text-xs tracking-widest uppercase font-bold">← back</Text>
          </TouchableOpacity>
          <Text className="font-serifItalic text-2xl text-dark-charcoal lowercase">my library</Text>
          <View className="w-10" />
        </View>

        <View className="flex-row bg-dark-charcoal/5 p-1 rounded-full">
          <TouchableOpacity onPress={() => setActiveTab('journal')} className={`flex-1 py-3 rounded-full items-center ${activeTab === 'journal' ? 'bg-dark-charcoal' : ''}`}>
            <Text className={`font-sans text-[10px] tracking-widest uppercase font-bold ${activeTab === 'journal' ? 'text-soft-cream' : 'text-dark-charcoal/40'}`}>journal ({entries.length})</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setActiveTab('watchlist')} className={`flex-1 py-3 rounded-full items-center ${activeTab === 'watchlist' ? 'bg-dark-charcoal' : ''}`}>
            <Text className={`font-sans text-[10px] tracking-widest uppercase font-bold ${activeTab === 'watchlist' ? 'text-soft-cream' : 'text-dark-charcoal/40'}`}>watchlist ({watchlist.length})</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View className="w-full max-w-4xl mx-auto px-6 pb-20">
        {!isLoaded ? (
          <View className="py-20 items-center">
            <ActivityIndicator size="small" color="#1E2326" />
          </View>
        ) : activeTab === 'journal' ? (
          entries.length > 0 ? (
            entries.map((item, index) => (
              <View key={item.id} className="flex-row mb-8">
                <View className="items-center mr-4">
                  <View className="w-10 h-10 rounded-full bg-dark-charcoal flex items-center justify-center z-10"><Text className="text-soft-cream font-serifItalic text-lg">Y</Text></View>
                  {index !== entries.length - 1 && <View className="w-[2px] flex-1 bg-dark-charcoal/10 my-1 rounded-full" />}
                </View>
                <View className="flex-1 pb-2">
                  <TouchableOpacity onPress={() => item.topicType === 'movie' && item.topicId ? onMovieSelect(item.topicId) : null} className="bg-dark-charcoal/5 px-2 py-1 rounded-md self-start mb-2">
                    <Text className="font-sans font-bold text-dark-charcoal/60 uppercase tracking-widest text-[9px]">{item.topicType === 'cast' ? '👤 ' : '🎬 '}{item.topicName}</Text>
                  </TouchableOpacity>
                  <Text className="font-sans text-base text-dark-charcoal/90">{item.text}</Text>
                </View>
              </View>
            ))
          ) : (
            <Text className="text-center opacity-40 mt-10 font-sans text-sm">Your journal is empty.</Text>
          )
        ) : (
          <View className="flex-row flex-wrap justify-between w-full">
            {watchlist.length > 0 ? (
              watchlist.map((item) => (
                <View key={item.id} className="w-[48%] md:w-[23%] mb-6">
                  <TouchableOpacity activeOpacity={0.7} onPress={() => onMovieSelect(item.id)}>
                    <View className="w-full aspect-[2/3] bg-black/10 rounded-2xl overflow-hidden mb-2.5 shadow-sm">
                      {item.posterPath ? (
                        <Image source={{ uri: `https://image.tmdb.org/t/p/w500${item.posterPath}` }} className="w-full h-full" resizeMode="cover" />
                      ) : (
                        <View className="flex-1 items-center justify-center bg-dark-charcoal/5"><Text className="text-dark-charcoal/20 text-xs">No Poster</Text></View>
                      )}
                    </View>
                    <Text className="font-sans font-semibold text-dark-charcoal text-sm tracking-tight" numberOfLines={1}>{item.title}</Text>
                  </TouchableOpacity>
                </View>
              ))
            ) : (
              <Text className="text-center w-full opacity-40 mt-10 font-sans text-sm">Your watchlist is empty.</Text>
            )}
          </View>
        )}
      </View>
    </View>
  );
};