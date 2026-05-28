import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useAuth } from '../auth/AuthContext';

export function HomeScreen({ navigation }: any) {
  const { user, logout } = useAuth();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Olá, {user?.name || 'Tutor'}! 👋</Text>
      <Text style={styles.subtitle}>Conecta TEA - Painel de Controle</Text>
      <Text style={styles.roleBadge}>Perfil: {user?.role === 'Guardian' ? 'Responsável / Tutor' : 'Profissional da Saúde'}</Text>
      
      <TouchableOpacity style={styles.logoutButton} onPress={logout}>
        <Text style={styles.logoutButtonText}>Sair da Conta</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: '#F0F4F8',
    padding: 20,
  },
  title: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    color: '#1E293B', 
    marginBottom: 8 
  },
  subtitle: { 
    fontSize: 16, 
    color: '#64748B',
    marginBottom: 8,
  },
  roleBadge: {
    fontSize: 14,
    color: '#1A73E8',
    backgroundColor: '#E0EEFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    fontWeight: '600',
    marginBottom: 32,
  },
  logoutButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: '#EF4444',
    borderRadius: 12,
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 2,
  },
  logoutButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 15,
  },
});
