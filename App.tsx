import React from 'react';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthProvider, useAuth } from './src/modules/auth/AuthContext';
import { LoginScreen } from './src/modules/auth/LoginScreen';
import { RegisterScreen } from './src/modules/auth/RegisterScreen';

// Import feature modules (Simulating Micro-Frontends)
import { HomeScreen } from './src/modules/home/HomeScreen';
import { CommunicationScreen } from './src/modules/communication/CommunicationScreen';
import { StoreScreen } from './src/modules/store/StoreScreen';
import { ProfessionalsScreen } from './src/modules/professionals/ProfessionalsScreen';
import { SafetyScreen } from './src/modules/safety/SafetyScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function AppContent() {
  const { token, loading } = useAuth();

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1A73E8" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {token ? (
        <Tab.Navigator
          screenOptions={{
            tabBarActiveTintColor: '#1A73E8',
            tabBarInactiveTintColor: 'gray',
          }}
        >
          <Tab.Screen name="Home" component={HomeScreen} />
          <Tab.Screen name="Comunicar" component={CommunicationScreen} />
          <Tab.Screen name="Loja" component={StoreScreen} />
          <Tab.Screen name="Médicos" component={ProfessionalsScreen} />
          <Tab.Screen name="Segurança" component={SafetyScreen} />
        </Tab.Navigator>
      ) : (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F0F4F8',
  },
});

