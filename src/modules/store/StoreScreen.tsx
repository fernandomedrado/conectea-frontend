import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export function StoreScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Marketplace</Text>
      <Text style={styles.subtitle}>Micro-feature: Store with specialised products</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFF7ED' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#C2410C' },
  subtitle: { fontSize: 14, color: '#EA580C', marginTop: 10 },
});
