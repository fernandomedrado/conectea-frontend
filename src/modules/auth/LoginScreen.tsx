import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  SafeAreaView,
} from 'react-native';
import { useAuth } from './AuthContext';
import * as AppleAuthentication from 'expo-apple-authentication';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';

// Configure Google Sign-In if available
try {
  GoogleSignin.configure({
    // webClientId: 'YOUR_WEB_CLIENT_ID.apps.googleusercontent.com', // Replace with your actual web client ID
    offlineAccess: true,
  });
} catch (e) {
  console.warn('Google Sign-in configuration failed or not supported in this client', e);
}

export const LoginScreen = ({ navigation }: any) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const { login, socialLogin, error, clearError } = useAuth();

  const handleEmailLogin = async () => {
    if (!email || !password) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos.');
      return;
    }
    setAuthLoading(true);
    try {
      await login(email, password);
    } catch (err: any) {
      Alert.alert('Erro de Login', err.message || 'Credenciais inválidas.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setAuthLoading(true);
    try {
      // In development/Expo Go, we can offer a mock bypass if Google is not configured
      const hasPlayServices = await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      if (hasPlayServices) {
        const userInfo = await GoogleSignin.signIn();
        if (userInfo.data?.idToken) {
          await socialLogin('google', userInfo.data.idToken);
        } else {
          throw new Error('Nenhum ID Token retornado pelo Google.');
        }
      }
    } catch (err: any) {
      console.warn('Google Sign-In failed, running mock developer bypass', err);
      // Fallback developer mock login
      Alert.alert(
        'Ambiente de Desenvolvimento',
        'O login nativo do Google requer chaves SHA-1 configuradas no console da Google. Deseja simular o login?',
        [
          { text: 'Cancelar', style: 'cancel', onPress: () => setAuthLoading(false) },
          {
            text: 'Sim (Mock)',
            onPress: async () => {
              try {
                // Send mock token to backend
                await socialLogin('google', 'mock_google_token_fernando.medrado@lapm.com.br');
              } catch (mockErr: any) {
                Alert.alert('Erro no Mock', mockErr.message);
              } finally {
                setAuthLoading(false);
              }
            },
          },
        ]
      );
    }
  };

  const handleAppleLogin = async () => {
    setAuthLoading(true);
    try {
      const isAvailable = await AppleAuthentication.isAvailableAsync();
      if (isAvailable) {
        const credential = await AppleAuthentication.signInAsync({
          requestedScopes: [
            AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
            AppleAuthentication.AppleAuthenticationScope.EMAIL,
          ],
        });

        if (credential.identityToken) {
          const name = credential.fullName
            ? `${credential.fullName.givenName || ''} ${credential.fullName.familyName || ''}`.trim()
            : undefined;
          await socialLogin(
            'apple', 
            credential.identityToken, 
            credential.user, 
            name
          );
        } else {
          throw new Error('Sem token retornado da Apple.');
        }
      } else {
        throw new Error('Login da Apple não disponível neste dispositivo.');
      }
    } catch (err: any) {
      console.warn('Apple Sign-In failed, running mock developer bypass', err);
      Alert.alert(
        'Ambiente de Desenvolvimento',
        'O login da Apple requer provisionamento do iOS Developer Portal. Deseja simular o login?',
        [
          { text: 'Cancelar', style: 'cancel', onPress: () => setAuthLoading(false) },
          {
            text: 'Sim (Mock)',
            onPress: async () => {
              try {
                await socialLogin('apple', 'mock_apple_token_fernando.medrado@lapm.com.br', 'mock_apple_user_id');
              } catch (mockErr: any) {
                Alert.alert('Erro no Mock', mockErr.message);
              } finally {
                setAuthLoading(false);
              }
            },
          },
        ]
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <Text style={styles.logoEmoji}>🧩</Text>
            <Text style={styles.title}>Conecta TEA</Text>
            <Text style={styles.subtitle}>Comunicação e conexão para o autismo</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Entrar</Text>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>E-mail</Text>
              <TextInput
                style={styles.input}
                placeholder="Ex: seuemail@provedor.com"
                placeholderTextColor="#94A3B8"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  if (error) clearError();
                }}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Senha</Text>
              <TextInput
                style={styles.input}
                placeholder="Digite sua senha"
                placeholderTextColor="#94A3B8"
                secureTextEntry
                autoCapitalize="none"
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  if (error) clearError();
                }}
              />
            </View>

            {error && <Text style={styles.errorText}>{error}</Text>}

            <TouchableOpacity
              style={styles.primaryButton}
              onPress={handleEmailLogin}
              disabled={authLoading}
            >
              {authLoading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text style={styles.primaryButtonText}>Entrar</Text>
              )}
            </TouchableOpacity>

            <View style={styles.dividerContainer}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>ou continuar com</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Social Logins */}
            <View style={styles.socialContainer}>
              <TouchableOpacity
                style={styles.googleButton}
                onPress={handleGoogleLogin}
                disabled={authLoading}
              >
                <Text style={styles.socialIcon}>🌐</Text>
                <Text style={styles.googleButtonText}>Google</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.appleButton}
                onPress={handleAppleLogin}
                disabled={authLoading}
              >
                <Text style={styles.socialIconWhite}></Text>
                <Text style={styles.appleButtonText}>Apple</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.registerLinkContainer}>
              <Text style={styles.registerText}>Não tem uma conta?</Text>
              <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                <Text style={styles.registerLink}> Cadastre-se</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F4F8', // Calm pastel blue-gray background
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logoEmoji: {
    fontSize: 56,
    marginBottom: 8,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1E293B', // Dark charcoal
  },
  subtitle: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 4,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#0F172A',
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#475569',
    marginBottom: 6,
  },
  input: {
    height: 48,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    color: '#0F172A',
    fontSize: 15,
  },
  errorText: {
    color: '#EF4444',
    fontSize: 14,
    marginBottom: 12,
    fontWeight: '500',
  },
  primaryButton: {
    height: 48,
    backgroundColor: '#1A73E8', // Friendly Google Blue
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    shadowColor: '#1A73E8',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E2E8F0',
  },
  dividerText: {
    fontSize: 13,
    color: '#94A3B8',
    marginHorizontal: 12,
  },
  socialContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  googleButton: {
    flex: 0.48,
    height: 48,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  googleButtonText: {
    color: '#334155',
    fontWeight: '600',
    fontSize: 14,
  },
  appleButton: {
    flex: 0.48,
    height: 48,
    backgroundColor: '#0F172A', // Apple Black
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  appleButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
  socialIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  socialIconWhite: {
    fontSize: 18,
    color: '#FFFFFF',
    marginRight: 8,
    marginTop: -2,
  },
  registerLinkContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  registerText: {
    fontSize: 14,
    color: '#64748B',
  },
  registerLink: {
    fontSize: 14,
    color: '#1A73E8',
    fontWeight: 'bold',
  },
});
