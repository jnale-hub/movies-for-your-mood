import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, ActivityIndicator, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { supabase } from '../lib/supabase';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface AccountBackupProps {
  visible: boolean;
  onClose: () => void;
}

export const AccountBackup = ({ visible, onClose }: AccountBackupProps) => {
  const insets = useSafeAreaInsets();
  const [isLoginMode, setIsLoginMode] = useState(false); 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleAuth = async () => {
    if (!email || !password) {
      setMessage('Please enter an email and password.');
      return;
    }

    setLoading(true);
    setMessage('');

    if (isLoginMode) {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password,
      });

      if (error) {
        setMessage(error.message);
        setIsSuccess(false);
      } else {
        setMessage('Welcome back! Syncing your journal...');
        setIsSuccess(true);
        setTimeout(() => {
          closeAndReset();
        }, 2000);
      }
    } else {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        const { error: anonError } = await supabase.auth.signInAnonymously();
        if (anonError) {
          setMessage("Could not start session.");
          setLoading(false);
          return;
        }
      }

      const { error } = await supabase.auth.updateUser({
        email: email.trim(),
        password: password,
      });

      if (error) {
        setMessage(error.message);
        setIsSuccess(false);
      } else {
        setMessage('Account secured! Your journal is safely backed up.');
        setIsSuccess(true);
        setTimeout(() => {
          closeAndReset();
        }, 2500);
      }
    }
    
    setLoading(false);
  };

  const closeAndReset = () => {
    onClose();
    setTimeout(() => {
      setEmail('');
      setPassword('');
      setMessage('');
      setIsSuccess(false);
      setIsLoginMode(false);
    }, 500);
  };

  return (
    <Modal visible={visible} animationType='fade' transparent>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1 justify-end md:justify-center bg-black/60 md:p-6"
      >
        <TouchableWithoutFeedback onPress={Platform.OS === 'web' ? undefined : Keyboard.dismiss}>
          <View 
            className="w-full md:max-w-md md:mx-auto bg-art-sand rounded-t-[32px] md:rounded-3xl shadow-2xl p-6"
            style={{ paddingBottom: Platform.OS === 'ios' ? Math.max(insets.bottom, 24) + 20 : 24 }}
          >
            <View className="flex-row justify-between items-center mb-6 border-b border-dark-charcoal/10 pb-4">
              <View className="w-8" />
              <Text 
                className="font-serifItalic text-2xl text-dark-charcoal lowercase"
                accessibilityRole="header"
              >
                {isLoginMode ? 'log in' : 'secure account'}
              </Text>
              <TouchableOpacity 
                onPress={closeAndReset} 
                className="w-8 items-end p-2 -mr-2"
                accessibilityRole="button"
                accessibilityLabel="Close modal"
                accessibilityHint="Closes the account settings screen"
              >
                <Feather name="x" size={20} color="#1E2326" />
              </TouchableOpacity>
            </View>

            <Text className="font-sans text-dark-charcoal/80 text-center mb-8 px-4 leading-relaxed">
              {isLoginMode 
                ? 'Welcome back. Enter your email and password to sync your journal.' 
                : "Don't lose your journal. Add an email and password to securely back up your data."}
            </Text>

            <View className="space-y-4 mb-6 gap-4">
              <View className="flex-row items-center bg-dark-charcoal/5 px-4 py-3.5 rounded-xl border border-dark-charcoal/10">
                <Feather name="mail" size={18} color="#1E232680" />
                <TextInput
                  value={email}
                  onChangeText={setEmail}
                  placeholder="Email address"
                  placeholderTextColor="#1E232660"
                  autoCapitalize="none"
                  keyboardType="email-address"
                  autoComplete="off"
                  autoCorrect={false}
                  textContentType="none"
                  importantForAutofill="no"
                  className="flex-1 ml-3 font-sans text-dark-charcoal text-base outline-none"
                  style={Platform.OS === 'web' ? { outlineStyle: 'none', backgroundColor: 'transparent' } as any : { backgroundColor: 'transparent' }}
                  accessibilityLabel="Email address"
                  accessibilityHint="Enter the email address for your account"
                />
              </View>

              <View className="flex-row items-center bg-dark-charcoal/5 px-4 py-3.5 rounded-xl border border-dark-charcoal/10">
                <Feather name="lock" size={18} color="#1E232680" />
                <TextInput
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Password"
                  placeholderTextColor="#1E232660"
                  secureTextEntry
                  autoComplete="new-password"
                  autoCorrect={false}
                  textContentType="none"
                  importantForAutofill="no"
                  className="flex-1 ml-3 font-sans text-dark-charcoal text-base outline-none"
                  style={Platform.OS === 'web' ? { outlineStyle: 'none', backgroundColor: 'transparent' } as any : { backgroundColor: 'transparent' }}
                  accessibilityLabel="Password"
                  accessibilityHint="Enter your account password"
                />
              </View>
            </View>

            {message ? (
              <Text 
                className={`font-sans text-sm text-center mb-4 ${isSuccess ? 'text-vibe-green' : 'text-twilight-maroon'}`}
                accessibilityLiveRegion="polite"
              >
                {message}
              </Text>
            ) : null}

            <TouchableOpacity 
              onPress={handleAuth}
              disabled={loading || isSuccess}
              className={`w-full py-4 rounded-xl flex items-center justify-center mb-4 ${isSuccess ? 'bg-vibe-green' : 'bg-dark-charcoal'}`}
              activeOpacity={0.8}
              accessibilityRole="button"
              accessibilityState={{ disabled: loading || isSuccess }}
              accessibilityLabel={isSuccess ? 'Success' : (isLoginMode ? 'Log In' : 'Back Up My Data')}
              accessibilityHint={isLoginMode ? 'Attempts to log into your account' : 'Saves your email and password to secure your account'}
            >
              {loading ? (
                <ActivityIndicator color="#FDFBF7" accessibilityLabel="Loading" />
              ) : (
                <Text className="font-sans text-soft-cream font-bold uppercase tracking-widest text-xs">
                  {isSuccess ? 'Success' : (isLoginMode ? 'Log In' : 'Back Up My Data')}
                </Text>
              )}
            </TouchableOpacity>

            {!isSuccess && (
              <TouchableOpacity 
                onPress={() => {
                  setIsLoginMode(!isLoginMode);
                  setMessage('');
                }} 
                className="py-2 items-center"
                accessibilityRole="button"
                accessibilityLabel={isLoginMode ? 'Switch to create account mode' : 'Switch to login mode'}
                accessibilityHint="Toggles between backing up a new account and logging into an existing one"
              >
                <Text className="font-sans text-dark-charcoal/60 text-xs font-bold uppercase tracking-widest">
                  {isLoginMode ? 'Need to back up? Create account' : 'Already backed up? Log in'}
                </Text>
              </TouchableOpacity>
            )}

          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </Modal>
  );
};
