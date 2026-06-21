import { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  useWindowDimensions,
  FlatList,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Store
import {
  useJournalStore,
  JournalEntry,
  SavedMovie,
} from '../store/useJournalStore';

interface MyLibraryProps {
  onBack: () => void;
  onMovieSelect: (id: number) => void;
}

export const MyLibrary = ({
  onBack,
  onMovieSelect,
}: MyLibraryProps) => {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();

  const [activeTab, setActiveTab] = useState<'journal' | 'watchlist'>(
    'journal'
  );

  const entries = useJournalStore((state) => state.entries) || [];
  const watchlist = useJournalStore((state) => state.watchlist) || [];

  const numColumns = width > 768 ? 4 : 2;

  const horizontalPadding = 24;
  const itemGap = 12;

  const itemWidth =
    (width -
      horizontalPadding * 2 -
      itemGap * (numColumns - 1)) /
    numColumns;

  const renderJournalEntry = ({
    item,
    index,
  }: {
    item: JournalEntry;
    index: number;
  }) => (
    <View className="flex-row mb-8">
      <View className="items-center mr-4">
        <View className="w-10 h-10 rounded-full bg-dark-charcoal flex items-center justify-center z-10">
          <Text className="text-soft-cream font-serifItalic text-lg">
            Y
          </Text>
        </View>

        {index !== entries.length - 1 ? (
          <View className="w-[2px] flex-1 bg-dark-charcoal/10 my-1 rounded-full" />
        ) : null}
      </View>

      <View className="flex-1 pb-2">
        <View className="flex-row justify-between items-center mb-1 flex-wrap">
          <View className="flex-row items-center flex-1">
            <Text className="font-sans font-bold text-dark-charcoal mr-2">
              My Journal
            </Text>

            <Text className="font-sans text-dark-charcoal/40">
              ›
            </Text>

            <TouchableOpacity
              activeOpacity={0.6}
              onPress={() =>
                item.topicType === 'movie' && item.topicId
                  ? onMovieSelect(item.topicId)
                  : null
              }
              className="bg-dark-charcoal/5 px-2 py-0.5 rounded-md ml-2"
            >
              <Text className="font-sans font-bold text-dark-charcoal/60 uppercase tracking-widest text-[9px]">
                {item.topicType === 'cast' ? '👤 ' : '🎬 '}
                {item.topicName || 'Note'}
              </Text>
            </TouchableOpacity>
          </View>

          <Text className="font-sans text-xs text-dark-charcoal/40 mt-1">
            {new Date(item.createdAt).toLocaleDateString()}
          </Text>
        </View>

        {item.stage ? (
          <View className="self-start mt-1 mb-2">
            <Text className="font-sans font-bold text-dark-charcoal/40 uppercase tracking-widest text-[9px]">
              {item.stage} watching
            </Text>
          </View>
        ) : null}

        <Text className="font-sans text-base leading-relaxed text-dark-charcoal/90 mt-1">
          {item.text}
        </Text>
      </View>
    </View>
  );

  const renderWatchlistMovie = ({
    item,
  }: {
    item: SavedMovie;
  }) => (
    <View
      style={{
        width: itemWidth,
        marginBottom: itemGap,
        marginRight: itemGap,
      }}
    >
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => onMovieSelect(item.id)}
      >
        <View className="aspect-[2/3] bg-black/10 rounded-xl overflow-hidden mb-2 border border-dark-charcoal/5">
          {item.posterPath ? (
            <Image
              source={{
                uri: `https://image.tmdb.org/t/p/w500${item.posterPath}`,
              }}
              className="w-full h-full"
              resizeMode="cover"
            />
          ) : (
            <View className="flex-1 items-center justify-center bg-dark-charcoal/5">
              <Text className="text-dark-charcoal/20 text-xs">
                No Poster
              </Text>
            </View>
          )}
        </View>

        <Text
          className="font-sans font-bold text-dark-charcoal text-xs"
          numberOfLines={1}
        >
          {item.title}
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View className="flex-1 bg-art-sand">
      <View
        style={{
          paddingTop: Math.max(insets.top, 20) + 8,
          zIndex: 50,
        }}
        className="px-6 pb-4 border-b border-dark-charcoal/10 bg-art-sand"
      >
        <View className="flex-row justify-between items-center mb-6">
          <TouchableOpacity
            onPress={onBack}
            activeOpacity={0.6}
            hitSlop={{
              top: 20,
              bottom: 20,
              left: 20,
              right: 20,
            }}
            className="p-2 -ml-2"
          >
            <Text className="text-dark-charcoal font-sans text-xs tracking-widest uppercase font-bold">
              ← back
            </Text>
          </TouchableOpacity>

          <Text className="font-serifItalic text-2xl text-dark-charcoal lowercase">
            my library
          </Text>

          <View className="w-10" />
        </View>

        <View className="flex-row bg-dark-charcoal/5 p-1 rounded-full">
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => setActiveTab('journal')}
            className={`flex-1 py-3 rounded-full items-center justify-center ${
              activeTab === 'journal'
                ? 'bg-dark-charcoal'
                : ''
            }`}
          >
            <Text
              className={`font-sans text-[10px] tracking-widest uppercase font-bold ${
                activeTab === 'journal'
                  ? 'text-soft-cream'
                  : 'text-dark-charcoal/40'
              }`}
            >
              journal ({entries.length})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => setActiveTab('watchlist')}
            className={`flex-1 py-3 rounded-full items-center justify-center ${
              activeTab === 'watchlist'
                ? 'bg-dark-charcoal'
                : ''
            }`}
          >
            <Text
              className={`font-sans text-[10px] tracking-widest uppercase font-bold ${
                activeTab === 'watchlist'
                  ? 'text-soft-cream'
                  : 'text-dark-charcoal/40'
              }`}
            >
              watchlist ({watchlist.length})
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {activeTab === 'journal' ? (
        <FlatList
          // 1. ADD THIS KEY
          key="journal-list" 
          
          data={entries}
          keyExtractor={(item) => item.id}
          renderItem={renderJournalEntry}
          contentContainerStyle={{
            padding: 24,
            paddingBottom: 100,
          }}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <FlatList
          // 2. ADD THIS KEY (Dynamic based on columns)
          key={`watchlist-grid-${numColumns}`} 
          
          data={watchlist}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderWatchlistMovie}
          numColumns={numColumns}
          contentContainerStyle={{
            padding: horizontalPadding,
            paddingBottom: 100,
          }}
          showsVerticalScrollIndicator={false}
          removeClippedSubviews
          initialNumToRender={8}
          maxToRenderPerBatch={8}
          windowSize={5}
          ListEmptyComponent={
            <View className="items-center justify-center py-20 opacity-40 mt-10">
              <Text className="text-4xl mb-4">🍿</Text>
              <Text className="font-serif text-lg text-dark-charcoal">
                Your watchlist is empty.
              </Text>
            </View>
          }
        />
      )}
    </View>
  );
};
