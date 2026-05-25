import { Slot, useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';
import { AuthProvider, useAuth } from '../context/AuthContext';
import { ActivityIndicator, View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

function RootLayoutNav() {
  const { token, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;
    const inAuthGroup = segments.includes('dashboard') || segments.includes('profile');
    if (!token && inAuthGroup) {
      router.replace('/');
    } else if (token && !inAuthGroup) {
      router.replace('/dashboard');
    }
  }, [token, isLoading, segments]);

  if (isLoading) {
    return (
      <View style={styles.loadingRoot}>
        <LinearGradient
          colors={['#0F172A', '#1E293B']}
          style={StyleSheet.absoluteFillObject}
        />
        <LinearGradient
          colors={['#6366F1', '#8B5CF6']}
          style={styles.loadingLogoIcon}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Text style={styles.loadingLogoText}>A</Text>
        </LinearGradient>
        <Text style={styles.loadingAppName}>AuthApp</Text>
        <ActivityIndicator size="large" color="#6366F1" style={styles.loadingSpinner} />
        <Text style={styles.loadingHint}>Loading your session...</Text>
      </View>
    );
  }

  return <Slot />;
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  loadingRoot: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0F172A',
  },
  loadingLogoIcon: {
    width: 64,
    height: 64,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  loadingLogoText: {
    color: '#FFF',
    fontSize: 32,
    fontWeight: '900',
  },
  loadingAppName: {
    color: '#F8FAFC',
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: -0.5,
    marginBottom: 32,
  },
  loadingSpinner: {
    marginBottom: 16,
  },
  loadingHint: {
    color: '#475569',
    fontSize: 13,
    fontWeight: '500',
  },
});
