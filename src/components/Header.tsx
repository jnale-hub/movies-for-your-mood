import { View, Text, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';

interface HeaderProps {
  title?: string;
  onBack?: () => void;
  backText?: string;
  rightIcon?: keyof typeof Feather.glyphMap;
  onRightPress?: () => void;
  colorHex?: string;
  colorClass?: string;
  isAbsolute?: boolean;
}

export const Header = ({ 
  title, 
  onBack, 
  backText = "back", 
  rightIcon, 
  onRightPress,
  colorHex = "#1E2326",
  colorClass = "text-dark-charcoal",
  isAbsolute = false
}: HeaderProps) => {
  const insets = useSafeAreaInsets();

  return (
    <View 
      className={`px-6 w-full max-w-4xl mx-auto flex-row items-center justify-between z-50 pb-4 ${isAbsolute ? 'absolute top-0 left-0 right-0' : ''}`}
      style={{ paddingTop: Math.max(insets.top, 20) + 8 }}
    >
      {/* LEFT AREA */}
      <View className="w-28 items-start">
        {onBack && (
          <TouchableOpacity 
            onPress={onBack} 
            className="flex-row items-center py-2 -ml-2" 
            activeOpacity={0.6}
            accessibilityRole="button"
          >
            <Feather name="chevron-left" size={20} color={colorHex} />
            <Text className={`font-sans text-[10px] md:text-xs tracking-widest uppercase font-bold ml-1 ${colorClass}`}>
              {backText}
            </Text>
          </TouchableOpacity>
        )}
      </View>
      
      {/* CENTER TITLE */}
      <Text 
        className={`font-serifItalic text-2xl lowercase flex-1 text-center ${colorClass}`}
        numberOfLines={1}
      >
        {title}
      </Text>
      
      {/* RIGHT AREA */}
      <View className="w-28 items-end">
        {onRightPress && rightIcon && (
          <TouchableOpacity 
            onPress={onRightPress} 
            className="w-10 h-10 rounded-full bg-black/10 flex items-center justify-center border border-white/10"
            activeOpacity={0.6}
            accessibilityRole="button"
          >
            <Feather name={rightIcon} size={18} color={colorHex} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};
