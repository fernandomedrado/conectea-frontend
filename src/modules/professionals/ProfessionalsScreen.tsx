import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export function ProfessionalsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Professionals</Text>
      <Text style={styles.subtitle}>Micro-feature: Healthcare Directory</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#ECFDF5' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#047857' },
  subtitle: { fontSize: 14, color: '#10B981', marginTop: 10 },
});
