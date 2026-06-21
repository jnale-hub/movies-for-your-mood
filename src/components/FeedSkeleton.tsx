import { View } from "react-native";

export const FeedSkeleton = ({ theme }: { theme: any }) => (
  <View className="flex-row flex-wrap justify-between w-full">
    {[1, 2, 3, 4].map((i) => (
      <View key={i} className="w-[48%] md:w-[23%] mb-6">
        <View 
          className="w-full rounded-2xl bg-dark-charcoal/5 animate-pulse" 
          style={{ aspectRatio: 2 / 3 }}
        />
        
        <View className={`mt-3 h-4 w-3/4 rounded-full ${theme.bg === 'bg-soft-cream' ? 'bg-dark-charcoal/10' : 'bg-soft-cream/10'}`} />
        
        <View className={`mt-2 h-3 w-1/2 rounded-full ${theme.bg === 'bg-soft-cream' ? 'bg-dark-charcoal/5' : 'bg-soft-cream/5'}`} />
      </View>
    ))}
  </View>
);
