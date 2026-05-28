import { Platform } from 'react-native';

const getBackendUrl = () => {
  // Use Android emulator host loopback or localhost for iOS/Web
  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:3000';
  }
  return 'http://localhost:3000';
};

export const API_URL = getBackendUrl();
