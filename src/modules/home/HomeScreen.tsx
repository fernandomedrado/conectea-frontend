import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';

export function HomeScreen({ navigation }: any) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Autism Bridge Hub</Text>
      <Text style={styles.subtitle}>A safe place for the community</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F8F9FA' },
  title: { fontSize: 22, fontWeight: 'bold', color: '#1A73E8', marginBottom: 10 },
  subtitle: { fontSize: 16, color: '#5F6368' },
});
