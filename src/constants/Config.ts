import { Platform } from 'react-native';

// For Android Emulator, 'localhost' refers to the emulator itself.
// To access the host machine's localhost, use '10.0.2.2'.
// For physical devices, use your computer's local IP address (e.g., '192.168.1.XX').
// For production, use your deployed PHP API URL.
const getBackendUrl = () => {
  if (Platform.OS === 'android') {
    // Modify this if you are testing on a physical Android device
    return 'http://10.0.2.2/backend'; 
  }
  return 'http://localhost/backend';
};

export const CONFIG = {
  API_URL: getBackendUrl(),
};
