import { Image, View, useWindowDimensions } from 'react-native';

export const FilmGrain = () => {
  const { width, height } = useWindowDimensions();

  return (
    <View 
      style={{
        position: 'absolute',
        top: -20,
        left: -20,
        width: width + 40,
        height: height + 40,
        zIndex: 50,
      }}
      pointerEvents="none" 
    >
      <Image 
        source={require('../../assets/noise.png')} 
        resizeMode="cover"
        style={{ width: '100%', height: '100%', opacity: 0.06 }} 
      />
    </View>
  );
};
