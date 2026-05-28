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

export const RegisterScreen = ({ navigation }: any) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'Guardian' | 'Professional'>('Guardian');
  const [authLoading, setAuthLoading] = useState(false);
  
  const { register, error, clearError } = useAuth();

  const handleRegister = async () => {
    if (!name || !email || !password) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos.');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Erro', 'A senha deve conter no mínimo 6 caracteres.');
      return;
    }

    setAuthLoading(true);
    try {
      await register(name, email, password, role);
      Alert.alert('Sucesso', 'Conta criada com sucesso!');
    } catch (err: any) {
      Alert.alert('Erro no Cadastro', err.message || 'Não foi possível cadastrar.');
    } finally {
      setAuthLoading(false);
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
            <TouchableOpacity 
              style={styles.backButton} 
              onPress={() => {
                clearError();
                navigation.goBack();
              }}
            >
              <Text style={styles.backButtonText}>← Voltar para Login</Text>
            </TouchableOpacity>
            <Text style={styles.title}>Criar Conta</Text>
            <Text style={styles.subtitle}>Junte-se à nossa comunidade de cuidado e apoio</Text>
          </View>

          <View style={styles.card}>
            {/* Role Selection */}
            <Text style={styles.label}>Quem é você?</Text>
            <View style={styles.roleContainer}>
              <TouchableOpacity
                style={[
                  styles.roleCard,
                  role === 'Guardian' && styles.roleCardActive,
                ]}
                onPress={() => setRole('Guardian')}
              >
                <Text style={styles.roleEmoji}>🏡</Text>
                <Text style={[styles.roleTitle, role === 'Guardian' && styles.roleTextActive]}>
                  Tutor / Família
                </Text>
                <Text style={styles.roleSubtitle}>
                  Para pais e responsáveis de crianças
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.roleCard,
                  role === 'Professional' && styles.roleCardActive,
                ]}
                onPress={() => setRole('Professional')}
              >
                <Text style={styles.roleEmoji}>🩺</Text>
                <Text style={[styles.roleTitle, role === 'Professional' && styles.roleTextActive]}>
                  Profissional
                </Text>
                <Text style={styles.roleSubtitle}>
                  Para médicos, terapeutas e fonoaudiólogos
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Nome Completo</Text>
              <TextInput
                style={styles.input}
                placeholder="Digite seu nome"
                placeholderTextColor="#94A3B8"
                value={name}
                onChangeText={(text) => {
                  setName(text);
                  if (error) clearError();
                }}
              />
            </View>

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
                placeholder="Crie uma senha (mín. 6 caracteres)"
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
              onPress={handleRegister}
              disabled={authLoading}
            >
              {authLoading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text style={styles.primaryButtonText}>Registrar</Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F4F8',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },
  header: {
    marginBottom: 24,
  },
  backButton: {
    alignSelf: 'flex-start',
    marginBottom: 16,
  },
  backButtonText: {
    fontSize: 14,
    color: '#1A73E8',
    fontWeight: 'bold',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  subtitle: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 4,
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
  roleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  roleCard: {
    flex: 0.48,
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 12,
    borderWidth: 2,
    borderColor: '#E2E8F0',
    alignItems: 'center',
  },
  roleCardActive: {
    borderColor: '#1A73E8',
    backgroundColor: '#F0F7FF', // Light blue fill for selected role
  },
  roleEmoji: {
    fontSize: 28,
    marginBottom: 6,
  },
  roleTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#475569',
    marginBottom: 4,
    textAlign: 'center',
  },
  roleTextActive: {
    color: '#1A73E8',
  },
  roleSubtitle: {
    fontSize: 10,
    color: '#94A3B8',
    textAlign: 'center',
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
    backgroundColor: '#1A73E8',
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
});
