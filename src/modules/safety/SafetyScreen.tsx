import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import io from 'socket.io-client';

const SOCKET_SERVER_URL = 'http://localhost:3000'; // Update with your local IP when testing on mobile

export const SafetyScreen = () => {
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    // Connect to websocket server
    const socket = io(SOCKET_SERVER_URL);

    // Join room for specific profile (e.g., profileId: 1)
    socket.emit('joinProfileRoom', { profileId: 1 });

    socket.on('locationUpdated', (data) => {
      console.log('Received new location:', data);
      setLocation({ lat: data.lat, lng: data.lng });
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Rastreamento em Tempo Real</Text>
      {location ? (
        <View style={styles.card}>
          <Text style={styles.text}>Latitude: {location.lat}</Text>
          <Text style={styles.text}>Longitude: {location.lng}</Text>
        </View>
      ) : (
        <Text style={styles.text}>Aguardando atualizações de localização...</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F5F5F5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  card: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  text: {
    fontSize: 16,
    marginBottom: 10,
  },
});
