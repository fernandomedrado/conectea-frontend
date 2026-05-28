import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// Import feature modules (Simulating Micro-Frontends)
import { HomeScreen } from './src/modules/home/HomeScreen';
import { CommunicationScreen } from './src/modules/communication/CommunicationScreen';
import { StoreScreen } from './src/modules/store/StoreScreen';
import { ProfessionalsScreen } from './src/modules/professionals/ProfessionalsScreen';
import { SafetyScreen } from './src/modules/safety/SafetyScreen';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
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
    </NavigationContainer>
  );
}
