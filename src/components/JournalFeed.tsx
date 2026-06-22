import { View, Text } from 'react-native';
import { useJournalStore } from '../store/useJournalStore';

export const JournalFeed = ({ topicId, topicType }: { topicId: number; topicType: 'movie' | 'cast' }) => {
  const allEntries = useJournalStore(state => state.entries);
  
  const entries = allEntries
    .filter(e => e.topicId === topicId && e.topicType === topicType)
    .sort((a, b) => b.createdAt - a.createdAt);

  if (entries.length === 0) return null;

  return (
    <View className="mb-16">
      <Text 
        className="font-serifItalic text-xl md:text-2xl text-dark-charcoal/50 mb-6 lowercase"
        accessibilityRole="header"
      >
        your thoughts
      </Text>
      
      {entries.map((entry, index) => (
        <View 
          key={entry.id} 
          className="flex-row mb-6"
          accessible={true}
          accessibilityRole="text"
          accessibilityLabel={`Journal entry on ${new Date(entry.createdAt).toLocaleDateString()}. ${entry.stage} watching. Thoughts: ${entry.text}`}
        >
          {/* Avatar & Line */}
          <View className="items-center mr-4" importantForAccessibility="no-hide-descendants">
            <View className="w-10 h-10 rounded-full bg-dark-charcoal flex items-center justify-center z-10">
              <Text className="text-soft-cream font-serifItalic text-lg">Y</Text>
            </View>
            {index !== entries.length - 1 && (
              <View className="w-[2px] flex-1 bg-dark-charcoal/10 my-1 rounded-full" />
            )}
          </View>

          {/* Content */}
          <View className="flex-1 pb-4" importantForAccessibility="no-hide-descendants">
            <View className="flex-row justify-between items-center mb-1">
              <Text className="font-sans font-bold text-dark-charcoal">My Journal</Text>
              <Text className="font-sans text-xs text-dark-charcoal/40">
                {new Date(entry.createdAt).toLocaleDateString()}
              </Text>
            </View>
            
            <View className="self-start bg-dark-charcoal/5 px-2 py-1 rounded-md mb-2">
              <Text className="font-sans font-bold text-dark-charcoal/60 uppercase tracking-widest text-[9px]">
                {entry.stage} watching
              </Text>
            </View>

            <Text className="font-sans text-base leading-relaxed text-dark-charcoal/90">
              {entry.text}
            </Text>
          </View>
        </View>
      ))}
    </View>
  );
};
