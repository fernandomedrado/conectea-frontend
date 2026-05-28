import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, Dimensions, Platform } from 'react-native';
import * as Speech from 'expo-speech';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

type Category = 'Todos' | 'Necessidades' | 'Sentimentos' | 'Ações' | 'Respostas' | 'Pessoas';

interface AACItem {
  id: string;
  label: string;
  emoji: string;
  category: Category;
  color: string;
}

const CATEGORIES: Category[] = ['Todos', 'Necessidades', 'Sentimentos', 'Ações', 'Respostas', 'Pessoas'];

const ITEMS: AACItem[] = [
  { id: '1', label: 'Eu', emoji: '🧑', category: 'Pessoas', color: '#a389f4' },
  { id: '2', label: 'Quero', emoji: '✋', category: 'Ações', color: '#33b3e3' },
  { id: '3', label: 'Água', emoji: '💧', category: 'Necessidades', color: '#33b3e3' },
  { id: '4', label: 'Comida', emoji: '🍽️', category: 'Necessidades', color: '#ff7a59' },
  { id: '5', label: 'Banheiro', emoji: '🚽', category: 'Necessidades', color: '#4ae0b0' },
  { id: '6', label: 'Feliz', emoji: '😊', category: 'Sentimentos', color: '#ffc72c' },
  { id: '7', label: 'Triste', emoji: '😢', category: 'Sentimentos', color: '#33b3e3' },
  { id: '8', label: 'Bravo', emoji: '😠', category: 'Sentimentos', color: '#ff7a59' },
  { id: '9', label: 'Sim', emoji: '✅', category: 'Respostas', color: '#4ae0b0' },
  { id: '10', label: 'Não', emoji: '❌', category: 'Respostas', color: '#ff7a59' },
  { id: '11', label: 'Brincar', emoji: '🎲', category: 'Ações', color: '#a389f4' },
  { id: '12', label: 'Dormir', emoji: '😴', category: 'Necessidades', color: '#a389f4' },
  { id: '13', label: 'Mais', emoji: '➕', category: 'Ações', color: '#33b3e3' },
  { id: '14', label: 'Acabou', emoji: '🛑', category: 'Ações', color: '#ff7a59' },
  { id: '15', label: 'Mamãe', emoji: '👩', category: 'Pessoas', color: '#ffc72c' },
  { id: '16', label: 'Papai', emoji: '👨', category: 'Pessoas', color: '#33b3e3' },
];

const READY_PHRASES = [
  { id: 'p1', label: 'Eu preciso de ajuda', emoji: '🆘' },
  { id: 'p2', label: 'Estou com fome', emoji: '🍔' },
  { id: 'p3', label: 'Quero ir ao banheiro', emoji: '🚽' },
  { id: 'p4', label: 'Preciso de um tempo', emoji: '⏳' },
];

export function CommunicationScreen() {
  const [selectedCategory, setSelectedCategory] = useState<Category>('Todos');
  const [message, setMessage] = useState<AACItem[]>([]);

  const speak = (text: string) => {
    Speech.speak(text, { language: 'pt-BR' });
  };

  const handleItemClick = (item: AACItem) => {
    setMessage([...message, item]);
    speak(item.label);
  };

  const handlePhraseClick = (phrase: string) => {
    speak(phrase);
  };

  const clearMessage = () => {
    setMessage([]);
  };

  const speakMessage = () => {
    if (message.length > 0) {
      const fullMessage = message.map(item => item.label).join(' ');
      speak(fullMessage);
    }
  };

  const filteredItems = selectedCategory === 'Todos' 
    ? ITEMS 
    : ITEMS.filter(item => item.category === selectedCategory);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Comunicação (AAC)</Text>
      </View>

      <View style={styles.messageBuilder}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          style={styles.messageScroll}
          contentContainerStyle={styles.messageContent}
        >
          {message.length === 0 ? (
            <Text style={styles.placeholderText}>Minha mensagem...</Text>
          ) : (
            message.map((item, index) => (
              <View key={`${item.id}-${index}`} style={styles.messageItem}>
                <Text style={styles.messageEmoji}>{item.emoji}</Text>
                <Text style={styles.messageLabel}>{item.label}</Text>
              </View>
            ))
          )}
        </ScrollView>
        <View style={styles.messageActions}>
          <TouchableOpacity style={styles.iconButton} onPress={clearMessage}>
            <Ionicons name="trash-outline" size={24} color="#ff7a59" />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.iconButton, styles.playButton]} onPress={speakMessage}>
            <Ionicons name="volume-high" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.categoryContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {CATEGORIES.map(category => (
            <TouchableOpacity 
              key={category} 
              style={[styles.categoryTab, selectedCategory === category && styles.categoryTabActive]}
              onPress={() => setSelectedCategory(category)}
            >
              <Text style={[styles.categoryText, selectedCategory === category && styles.categoryTextActive]}>
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView style={styles.gridContainer}>
        <View style={styles.grid}>
          {filteredItems.map(item => (
            <TouchableOpacity 
              key={item.id} 
              style={[styles.card, { backgroundColor: item.color + '20', borderColor: item.color }]}
              onPress={() => handleItemClick(item)}
            >
              <Text style={styles.cardEmoji}>{item.emoji}</Text>
              <Text style={styles.cardLabel}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
        
        <View style={styles.phrasesSection}>
          <Text style={styles.sectionTitle}>Frases Prontas</Text>
          {READY_PHRASES.map(phrase => (
            <TouchableOpacity 
              key={phrase.id} 
              style={styles.phraseCard}
              onPress={() => handlePhraseClick(phrase.label)}
            >
              <Text style={styles.phraseEmoji}>{phrase.emoji}</Text>
              <Text style={styles.phraseText}>{phrase.label}</Text>
              <Ionicons name="volume-medium" size={24} color="#0369A1" />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#F8FAFC' 
  },
  header: {
    padding: 16,
    paddingTop: Platform.OS === 'android' ? 40 : 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  messageBuilder: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    margin: 16,
    borderRadius: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    alignItems: 'center',
    minHeight: 80,
  },
  messageScroll: {
    flex: 1,
  },
  messageContent: {
    alignItems: 'center',
    paddingRight: 16,
  },
  placeholderText: {
    color: '#94A3B8',
    fontSize: 16,
    fontStyle: 'italic',
  },
  messageItem: {
    alignItems: 'center',
    marginRight: 12,
    backgroundColor: '#F1F5F9',
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  messageEmoji: {
    fontSize: 24,
  },
  messageLabel: {
    fontSize: 12,
    color: '#334155',
    fontWeight: '600',
    marginTop: 4,
  },
  messageActions: {
    flexDirection: 'row',
    alignItems: 'center',
    borderLeftWidth: 1,
    borderLeftColor: '#E2E8F0',
    paddingLeft: 12,
  },
  iconButton: {
    padding: 8,
    borderRadius: 8,
    marginLeft: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playButton: {
    backgroundColor: '#0369A1',
  },
  categoryContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  categoryTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#E2E8F0',
    marginRight: 8,
  },
  categoryTabActive: {
    backgroundColor: '#0369A1',
  },
  categoryText: {
    color: '#64748B',
    fontWeight: '600',
    fontSize: 14,
  },
  categoryTextActive: {
    color: '#fff',
  },
  gridContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingBottom: 24,
  },
  card: {
    width: (width - 48) / 3, // 3 columns, 16px padding on sides + 8px gap
    aspectRatio: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  cardEmoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  cardLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
    textAlign: 'center',
  },
  phrasesSection: {
    marginTop: 8,
    paddingBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0F172A',
    marginBottom: 12,
  },
  phraseCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  phraseEmoji: {
    fontSize: 24,
    marginRight: 12,
  },
  phraseText: {
    flex: 1,
    fontSize: 16,
    color: '#334155',
    fontWeight: '500',
  },
});
