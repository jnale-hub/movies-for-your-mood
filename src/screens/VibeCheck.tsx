import { EBGaramond_400Regular, EBGaramond_400Regular_Italic, useFonts as useSerifFonts } from '@expo-google-fonts/eb-garamond';
import { Inter_400Regular, useFonts as useInterFonts } from '@expo-google-fonts/inter';
import * as Haptics from 'expo-haptics';
import { useEffect, useRef } from 'react';
import { Animated, Pressable, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { FilmGrain } from '../components/FilmGrain';
import { Vibe } from '../types/movie.types';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useJournalStore } from '@/store/useJournalStore';

const MoodTile = ({ 
  emoji, 
  text, 
  color, 
  textColor = "text-soft-cream",
  delay = 0,
  vibeKey,
  onPress
}: { 
  emoji: string, 
  text: string, 
  color: string, 
  textColor?: string,
  delay: number,
  vibeKey: Vibe,
  onPress: (vibe: Vibe) => void
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  
  const translateYAnim = useRef(new Animated.Value(10)).current;

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
      <Animated.View style={{ flex: 1, opacity: opacityAnim, transform: [{ scale: scaleAnim }, { translateY: translateYAnim }] }}>
        <Pressable 
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          onPress={() => onPress(vibeKey)} 
          className={`flex-1 p-4 rounded-3xl shadow-sm ${color} justify-center items-center`}
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

export const VibeCheck = ({ onSelectVibe }: { onSelectVibe: (vibe: Vibe) => void }) => {
  let [interLoaded] = useInterFonts({ Inter_400Regular });
  let [serifLoaded] = useSerifFonts({ EBGaramond_400Regular, EBGaramond_400Regular_Italic });

  const insets = useSafeAreaInsets(); 
  const { openComposer } = useJournalStore();

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
      <ScrollView className="flex-1" contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }} showsVerticalScrollIndicator={false} bounces={false} overScrollMode="never">
        <View className="w-full max-w-3xl mx-auto px-6 py-12 relative">
          <Animated.View style={{ opacity: titleOpacity }}>
            <Text className="font-serifItalic text-dark-charcoal text-4xl md:text-5xl text-center lowercase tracking-tighter mb-10 md:mb-16">
              what&apos;s the vibe today?
            </Text>
          </Animated.View>

          <View className="flex-row flex-wrap justify-between w-full">
            <MoodTile emoji="😂" color="bg-soft-cream" text="need a good laugh" textColor="text-dark-charcoal" delay={100} vibeKey="laugh" onPress={onSelectVibe} />
            <MoodTile emoji="🍿" color="bg-vibe-green" text="pure adrenaline" delay={200} vibeKey="adrenaline" onPress={onSelectVibe} />
            <MoodTile emoji="🤯" color="bg-dark-charcoal" text="make me think" delay={300} vibeKey="think" onPress={onSelectVibe} />
            <MoodTile emoji="😭" color="bg-twilight-maroon" text="i want to cry" delay={400} vibeKey="cry" onPress={onSelectVibe} />
            <MoodTile emoji="👻" color="bg-[#2A2A2A]" text="scare me" delay={500} vibeKey="scare" onPress={onSelectVibe} />
            <MoodTile emoji="☕" color="bg-[#A49A87]" text="cozy and chill" textColor="text-dark-charcoal" delay={600} vibeKey="chill" onPress={onSelectVibe} />
          </View>
        </View>
      </ScrollView>

      <TouchableOpacity 
        activeOpacity={0.8}
        onPress={() => openComposer()} 
        style={{ bottom: Math.max(insets.bottom + 20, 32), right: 24 }}
        className="absolute bg-dark-charcoal px-5 py-4 rounded-full shadow-2xl flex-row items-center border border-white/10 z-50"
      >
        <Text className="text-soft-cream text-lg mr-2 leading-none">✍🏽</Text>
      </TouchableOpacity>
    </View>
  );
};
