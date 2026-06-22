import { useState } from 'react';
import { View, Text, Image, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useJournalStore } from '../store/useJournalStore';
import { AccountBackup } from '../components/AccountBackup';
import { Header } from '@/components/Header';

interface MyLibraryProps {
  onBack: () => void;
  onMovieSelect: (id: number) => void;
}

export const MyLibrary = ({ onBack, onMovieSelect }: MyLibraryProps) => {
  const [activeTab, setActiveTab] = useState<'journal' | 'watchlist'>('journal');
  const [showAccountModal, setShowAccountModal] = useState(false);
  
  const entries = useJournalStore((state) => state.entries) || [];
  const watchlist = useJournalStore((state) => state.watchlist) || [];
  const isLoaded = useJournalStore((state) => state.isLoaded);

  return (
    <View className="flex-1 bg-art-sand overflow-hidden">
      <Header 
        title="my library" 
        onBack={onBack} 
        rightIcon="settings" 
        onRightPress={() => setShowAccountModal(true)} 
      />

      <View className="px-6 w-full max-w-4xl mx-auto border-b border-dark-charcoal/10 pb-4 mb-4">
        <View className="flex-row bg-dark-charcoal/5 p-1 rounded-full w-full max-w-[320px] self-center">
          <TouchableOpacity onPress={() => setActiveTab('journal')} className={`flex-1 py-3 rounded-full items-center ${activeTab === 'journal' ? 'bg-dark-charcoal' : ''}`}>
            <Text className={`font-sans text-[10px] tracking-widest uppercase font-bold ${activeTab === 'journal' ? 'text-soft-cream' : 'text-dark-charcoal/40'}`}>journal ({entries.length})</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setActiveTab('watchlist')} className={`flex-1 py-3 rounded-full items-center ${activeTab === 'watchlist' ? 'bg-dark-charcoal' : ''}`}>
            <Text className={`font-sans text-[10px] tracking-widest uppercase font-bold ${activeTab === 'watchlist' ? 'text-soft-cream' : 'text-dark-charcoal/40'}`}>watchlist ({watchlist.length})</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="w-full max-w-4xl mx-auto px-6 pb-20 pt-4">
          {!isLoaded ? (
            <View className="py-20 items-center">
              <ActivityIndicator size="small" color="#1E2326" />
            </View>
          ) : activeTab === 'journal' ? (
            entries.length > 0 ? (
              entries.map((item, index) => (
                <View key={item.id} className="flex-row mb-8">
                  {/* Timeline Avatar */}
                  <View className="items-center mr-4">
                    <View className="w-10 h-10 rounded-full bg-dark-charcoal flex items-center justify-center z-10">
                      <Feather name="user" size={18} color="#FDFBF7" />
                    </View>
                    {index !== entries.length - 1 && <View className="w-[2px] flex-1 bg-dark-charcoal/10 my-1 rounded-full" />}
                  </View>
                  
                  {/* Journal Entry Content */}
                  <View className="flex-1 pb-2">
                    <TouchableOpacity 
                      onPress={() => item.topicType === 'movie' && item.topicId ? onMovieSelect(item.topicId) : null} 
                      className="bg-dark-charcoal/5 px-2 py-1.5 rounded-md self-start mb-2 flex-row items-center"
                      disabled={!item.topicId}
                    >
                      <Feather 
                        name={item.topicType === 'cast' ? 'user' : 'film'} 
                        size={10} 
                        color="#1E2326" 
                        style={{ opacity: 0.6, marginRight: 6 }} 
                      />
                      <Text className="font-sans font-bold text-dark-charcoal/60 uppercase tracking-widest text-[9px]">
                        {item.topicName}
                      </Text>
                    </TouchableOpacity>
                    <Text className="font-sans text-base text-dark-charcoal/90 leading-relaxed">{item.text}</Text>
                  </View>
                </View>
              ))
            ) : (
              <View className="items-center justify-center mt-16 w-full">
                <Text className="text-4xl mb-4">📓</Text>
                <Text className="text-center opacity-40 font-serifItalic text-xl text-dark-charcoal">
                  your journal is empty.
                </Text>
              </View>
            )
          ) : (
            <View className="flex-row flex-wrap -mx-2 w-full">
              {watchlist.length > 0 ? (
                watchlist.map((item) => (
                  // 🚨 SWAPPED w-[48%] to w-1/2 and added px-2 for clean margins
                  <View key={item.id} className="w-1/2 md:w-1/4 px-2 mb-6">
                    <TouchableOpacity activeOpacity={0.7} onPress={() => onMovieSelect(item.id)}>
                      <View 
                        className="w-full bg-black/10 rounded-2xl overflow-hidden mb-2.5 shadow-sm"
                        style={{ aspectRatio: 2 / 3 }}
                      >
                        {item.posterPath ? (
                          <Image source={{ uri: `https://image.tmdb.org/t/p/w500${item.posterPath}` }} className="w-full h-full" resizeMode="cover" />
                        ) : (
                          <View className="flex-1 items-center justify-center bg-dark-charcoal/5">
                            <Text className="text-dark-charcoal/20 text-xs">No Poster</Text>
                          </View>
                        )}
                      </View>
                      <Text className="font-sans font-semibold text-dark-charcoal text-sm tracking-tight" numberOfLines={1}>{item.title}</Text>
                    </TouchableOpacity>
                  </View>
                ))
              ) : (
                <View className="items-center justify-center mt-16 w-full">
                  <Text className="text-4xl mb-4">🍿</Text>
                  <Text className="text-center opacity-40 font-serifItalic text-xl text-dark-charcoal">
                    your watchlist is empty.
                  </Text>
                </View>
              )}
            </View>
          )}
        </View>
      </ScrollView>

      <AccountBackup 
        visible={showAccountModal} 
        onClose={() => setShowAccountModal(false)} 
      />
    </View>
  );
};
