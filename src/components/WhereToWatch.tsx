import { View, Text, ScrollView, Image, TouchableOpacity, Linking } from 'react-native';

export const WhereToWatch = ({ providers }: { providers: any }) => {
  const userRegion = 'US';
  
  const regionData = providers?.results?.[userRegion]; 
  
  const streamProviders = regionData?.flatrate;

  if (!streamProviders || streamProviders.length === 0) {
    return null; 
  }

  const handleOpenLink = () => {
    if (regionData?.link) {
      Linking.openURL(regionData.link);
    }
  };

  return (
    <View className="mb-12">
      <Text 
        className="font-serifItalic text-xl md:text-2xl text-dark-charcoal/50 mb-6 lowercase"
        accessibilityRole="header"
      >
        where to watch
      </Text>
      
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {streamProviders.map((provider: any) => (
          <View 
            key={provider.provider_id} 
            className="mr-4 items-center"
            accessible={true}
            accessibilityLabel={`Available on ${provider.provider_name}`}
          >
            <View className="w-14 h-14 md:w-16 md:h-16 rounded-xl overflow-hidden bg-black/5 border border-dark-charcoal/10 shadow-sm mb-2">
              <Image 
                source={{ uri: `https://image.tmdb.org/t/p/w200${provider.logo_path}` }}
                className="w-full h-full"
                importantForAccessibility="no"
              />
            </View>
          </View>
        ))}
      </ScrollView>

      <TouchableOpacity 
        onPress={handleOpenLink}
        className="mt-4 self-start border border-dark-charcoal/20 py-2 px-4 rounded-full"
        accessibilityRole="link"
        accessibilityLabel="View all watching options"
        accessibilityHint="Opens a webpage in your browser with all streaming, rental, and purchase options"
      >
        <Text 
          className="font-sans text-[10px] uppercase tracking-widest text-dark-charcoal/80 font-bold"
          importantForAccessibility="no-hide-descendants"
        >
          view all options ↗
        </Text>
      </TouchableOpacity>
    </View>
  );
};
