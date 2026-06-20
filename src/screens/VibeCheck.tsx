import { EBGaramond_400Regular, EBGaramond_400Regular_Italic, useFonts as useSerifFonts } from '@expo-google-fonts/eb-garamond';
import { Inter_400Regular, useFonts as useInterFonts } from '@expo-google-fonts/inter';
import * as Haptics from 'expo-haptics';
import { useEffect, useRef } from 'react';
import { Animated, Pressable, ScrollView, Text, View } from 'react-native';
import { FilmGrain } from '../components/FilmGrain';

const MoodTile = ({ 
  emoji, 
  text, 
  color, 
  textColor = "text-soft-cream",
  delay = 0 
}: { 
  emoji: string, 
  text: string, 
  color: string, 
  textColor?: string,
  delay: number 
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const translateYAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 600,
        delay: delay,
        useNativeDriver: true,
      }),
      Animated.timing(translateYAnim, {
        toValue: 0,
        duration: 600,
        delay: delay,
        useNativeDriver: true,
      })
    ]).start();
  });

  const handlePressIn = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Animated.spring(scaleAnim, {
      toValue: 0.95, 
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1, 
      friction: 5,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  return (
    <View className="w-[48%] md:w-[31%] aspect-square mb-4 md:mb-6">
      
      <Animated.View 
        style={{
          flex: 1,
          opacity: opacityAnim,
          transform: [{ scale: scaleAnim }, { translateY: translateYAnim }]
        }}
      >
          <Pressable 
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          className={`flex-1 p-4 rounded-3xl  shadow-sm ${color} justify-center items-center`}
        >
          <Text className="text-4xl md:text-5xl mb-3">{emoji}</Text>
          <Text className={`font-sans text-center text-lg md:text-xl leading-tight tracking-tight lowercase ${textColor}`}>
            {text}
          </Text>
        </Pressable>
      </Animated.View>

    </View>
  );
};

export const VibeCheck = () => {
  let [interLoaded] = useInterFonts({ Inter_400Regular });
  let [serifLoaded] = useSerifFonts({ EBGaramond_400Regular, EBGaramond_400Regular_Italic });

  const titleOpacity = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(titleOpacity, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  });

  if (!interLoaded || !serifLoaded) return null;

  return (
    <View className="flex-1 bg-art-sand overflow-hidden">
      <FilmGrain />

      <ScrollView 
        className="flex-1"
        contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }} 
        showsVerticalScrollIndicator={false}
        bounces={false} 
        overScrollMode="never" 
      >
        <View className="w-full max-w-3xl mx-auto px-6 py-12 relative">
          
          <Animated.View style={{ opacity: titleOpacity }}>
            <Text className="font-serifItalic text-dark-charcoal text-4xl md:text-5xl text-center lowercase tracking-tighter mb-10 md:mb-16">
              what&apos;s the vibe today?
            </Text>
          </Animated.View>

          <View className="flex-row flex-wrap justify-between w-full">
            <MoodTile emoji="😂" color="bg-soft-cream" text="need a good laugh" textColor="text-dark-charcoal" delay={100} />
            <MoodTile emoji="🍿" color="bg-vibe-green" text="pure adrenaline" delay={200} />
            <MoodTile emoji="🤯" color="bg-dark-charcoal" text="make me think" delay={300} />
            <MoodTile emoji="😭" color="bg-twilight-maroon" text="i want to cry" delay={400} />
            <MoodTile emoji="👻" color="bg-[#2A2A2A]" text="scare me" delay={500} />
            <MoodTile emoji="☕" color="bg-[#A49A87]" text="cozy and chill" textColor="text-dark-charcoal" delay={600} />
          </View>

        </View>
      </ScrollView>
    </View>
  );
};
