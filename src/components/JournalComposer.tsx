import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { Keyboard, KeyboardAvoidingView, Modal, Platform, ScrollView, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';

import { searchTMDB } from '../api/tmdb';
import { useJournalStore, WatchStage } from '../store/useJournalStore';

export const JournalComposer = () => {
  const insets = useSafeAreaInsets();
  
  const { isComposing, composerContext, closeComposer, addEntry } = useJournalStore();
  
  const [text, setText] = useState('');
  const [stage, setStage] = useState<WatchStage>(null); 
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedContext, setSelectedContext] = useState<{ id: number; type: 'movie' | 'cast'; name: string } | null>(null);

  const { data: searchResults } = useQuery({
    queryKey: ['search', searchQuery],
    queryFn: () => searchTMDB(searchQuery),
    enabled: searchQuery.length > 2,
  });

  useEffect(() => {
    if (isComposing) {
      setText('');
      setStage(null);
      setSearchQuery('');
      setSelectedContext(null);
    }
  }, [isComposing]);

  const activeContext = composerContext || selectedContext;

  const handlePost = async (keepOpen = false) => {
    if (text.trim().length === 0) return;
    
    await addEntry({
      topicId: activeContext?.id, 
      topicType: activeContext ? activeContext.type : 'general',
      topicName: activeContext ? activeContext.name : 'General Note',
      stage,
      text: text.trim()
    });
    
    if (keepOpen) {
      setText(''); 
    } else {
      closeComposer();
    }
  };

  return (
    <Modal visible={isComposing} animationType='fade' transparent={true} onRequestClose={closeComposer}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1 justify-end md:justify-center bg-black/60 md:p-6"
      >
        <TouchableWithoutFeedback onPress={Platform.OS === 'web' ? undefined : Keyboard.dismiss}>
          
          <View 
            style={{ paddingBottom: Platform.OS === 'ios' ? Math.max(insets.bottom, 20) : 20 }}
            className="w-full md:max-w-2xl md:mx-auto bg-art-sand md:rounded-2xl rounded-t-[32px] shadow-2xl flex-col max-h-[90vh]"
          >
            {/* Header */}
            <View className="flex-row justify-between items-center p-5 md:p-6 border-b border-dark-charcoal/10">
              <TouchableOpacity 
                onPress={closeComposer} 
                className="w-16"
                accessibilityRole="button"
                accessibilityLabel="Cancel"
                accessibilityHint="Closes the composer without saving your entry"
              >
                <Text className="font-sans text-dark-charcoal/60 font-bold uppercase tracking-widest text-[10px] md:text-xs">Cancel</Text>
              </TouchableOpacity>
              <Text 
                className="font-serifItalic text-xl text-dark-charcoal lowercase"
                accessibilityRole="header"
              >
                new entry
              </Text>
              <View className="w-16 items-end" />
            </View>

            <View className="flex-row p-5 md:p-6">
              <View className="items-center mr-4" importantForAccessibility="no-hide-descendants">
                <View className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-dark-charcoal flex items-center justify-center">
                  <Feather name="user" size={18} color="#FDFBF7" />
                </View>
                <View className="w-[2px] flex-1 bg-dark-charcoal/10 my-2 rounded-full" />
              </View>

              <View className="flex-1">
                <View className="mb-3 relative z-50">
                  {activeContext ? (
                    <View className="flex-row items-center flex-wrap">
                      <Text className="font-sans font-bold text-dark-charcoal md:text-base mr-2">My Journal</Text>
                      <View className="bg-dark-charcoal/5 px-2 py-1 rounded-md flex-row items-center">
                        <Text className="font-sans font-bold text-dark-charcoal/60 uppercase tracking-widest text-[9px] md:text-[10px] mr-2" importantForAccessibility="no-hide-descendants">
                          {activeContext.type === 'cast' ? '👤 ' : '🎬 '}{activeContext.name}
                        </Text>
                        {!composerContext && (
                          <TouchableOpacity 
                            onPress={() => setSelectedContext(null)}
                            accessibilityRole="button"
                            accessibilityLabel={`Remove tag for ${activeContext.name}`}
                            accessibilityHint="Removes this tag from your entry"
                          >
                            <Text className="text-dark-charcoal/40 font-bold text-xs" importantForAccessibility="no">✕</Text>
                          </TouchableOpacity>
                        )}
                      </View>
                    </View>
                  ) : (
                    <TextInput
                      className="font-sans text-dark-charcoal font-bold text-sm px-3 py-2 rounded-lg outline-none bg-transparent"
                      placeholder="Tag a movie or actor (optional)..."
                      placeholderTextColor="#1E232660"
                      selectionColor="#1E2326"
                      value={searchQuery}
                      onChangeText={setSearchQuery}
                      style={Platform.OS === 'web' ? { outlineStyle: 'none', backgroundColor: 'transparent' } as any : { backgroundColor: 'transparent' }}
                      accessibilityLabel="Tag a movie or actor"
                      accessibilityHint="Type to search and tag a subject for your journal entry"
                    />
                  )}

                  {!activeContext && searchResults && searchResults.length > 0 && searchQuery.length > 2 && (
                    <View 
                      className="absolute top-[44px] left-0 right-0 z-50 bg-white border border-dark-charcoal/10 rounded-xl max-h-[140px] overflow-hidden shadow-xl"
                      style={Platform.OS === 'android' ? { elevation: 10 } : {}}
                    >
                      <ScrollView keyboardShouldPersistTaps="handled">
                        {searchResults.map((result: any) => (
                          <TouchableOpacity
                            key={result.id}
                            className="py-2.5 px-3 border-b border-dark-charcoal/5 flex-row items-center bg-white"
                            onPress={() => {
                              setSelectedContext({
                                id: result.id,
                                type: result.media_type === 'person' ? 'cast' : 'movie',
                                name: result.title || result.name
                              });
                              setSearchQuery('');
                            }}
                            accessibilityRole="button"
                            accessibilityLabel={`Select ${result.title || result.name}`}
                            accessibilityHint={`Tags ${result.title || result.name} in your entry`}
                          >
                            <Text className="font-sans text-dark-charcoal font-medium text-sm" importantForAccessibility="no-hide-descendants">
                              {result.media_type === 'person' ? '👤 ' : '🎬 '}
                              {result.title || result.name}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </ScrollView>
                    </View>
                  )}
                </View>

                <TextInput
                  className="font-sans text-dark-charcoal text-base md:text-lg min-h-[80px] pt-0 outline-none bg-transparent"
                  placeholder="What's on your mind?"
                  placeholderTextColor="#1E232660"
                  selectionColor="#1E2326"
                  multiline
                  autoFocus
                  value={text}
                  onChangeText={setText}
                  textAlignVertical="top"
                  style={Platform.OS === 'web' ? { outlineStyle: 'none', backgroundColor: 'transparent' } as any : { backgroundColor: 'transparent' }}
                  accessibilityLabel="Journal entry text"
                  accessibilityHint="Type your thoughts here"
                />

                <View className="flex-row items-center mt-4 gap-2">
                  {(['before', 'during', 'after'] as WatchStage[]).map((s) => (
                    <TouchableOpacity
                      key={s!}
                      onPress={() => setStage(stage === s ? null : s)}
                      className={`px-3 py-1.5 rounded-full border ${
                        stage === s ? 'border-dark-charcoal bg-dark-charcoal' : 'border-dark-charcoal/20 bg-transparent'
                      }`}
                      accessibilityRole="button"
                      accessibilityLabel={`Tag as ${s} watching`}
                      accessibilityState={{ selected: stage === s }}
                      accessibilityHint={`Marks this entry as written ${s} watching`}
                    >
                      <Text 
                        className={`font-sans text-[10px] uppercase tracking-widest font-bold ${
                          stage === s ? 'text-soft-cream' : 'text-dark-charcoal/60'
                        }`}
                        importantForAccessibility="no"
                      >
                        {s}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>

            <View className="flex-row justify-between items-center p-5 border-t border-dark-charcoal/5">
              <TouchableOpacity 
                disabled={text.trim().length === 0}
                onPress={() => handlePost(true)}
                className="flex-row items-center py-2"
                activeOpacity={0.6}
                accessibilityRole="button"
                accessibilityLabel="Post and add another"
                accessibilityState={{ disabled: text.trim().length === 0 }}
                accessibilityHint="Saves this entry and keeps the composer open to write another one"
              >
                <Feather name="plus-circle" size={16} color={text.trim().length > 0 ? '#1E2326' : '#1E232660'} importantForAccessibility="no" />
                <Text 
                  className={`ml-2 font-sans text-[10px] md:text-xs uppercase tracking-widest font-bold ${text.trim().length > 0 ? 'text-dark-charcoal' : 'text-dark-charcoal/40'}`}
                  importantForAccessibility="no"
                >
                  Post & Add Another
                </Text>
              </TouchableOpacity>

              <TouchableOpacity 
                disabled={text.trim().length === 0}
                onPress={() => handlePost(false)}
                className={`px-8 py-3 rounded-full ${text.trim().length > 0 ? 'bg-dark-charcoal' : 'bg-dark-charcoal/20'}`}
                activeOpacity={0.8}
                accessibilityRole="button"
                accessibilityLabel="Post"
                accessibilityState={{ disabled: text.trim().length === 0 }}
                accessibilityHint="Saves this entry and closes the composer"
              >
                <Text 
                  className={`font-sans text-xs uppercase tracking-widest font-bold ${text.trim().length > 0 ? 'text-soft-cream' : 'text-dark-charcoal/40'}`}
                  importantForAccessibility="no"
                >
                  Post
                </Text>
              </TouchableOpacity>
            </View>

          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </Modal>
  );
};
