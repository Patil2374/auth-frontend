import React from 'react';
import {
  StyleSheet, Text, TouchableOpacity, View,
  Platform, useWindowDimensions
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useAuth } from '../context/AuthContext';

export default function Header() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isWeb = Platform.OS === 'web';

  const handleLogout = async () => {
    await logout();
    router.replace('/');
  };

  return (
    <View style={styles.wrapper}>
      <LinearGradient
        colors={['#0F172A', '#1E293B']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.container}
      >
        <View style={[styles.inner, isWeb && { maxWidth: 1100, alignSelf: 'center', width: '100%' }]}>
          {/* Logo */}
          <TouchableOpacity onPress={() => router.replace('/dashboard')} style={styles.logoRow}>
            <LinearGradient
              colors={['#6366F1', '#8B5CF6']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.logoIcon}
            >
              <Text style={styles.logoIconText}>A</Text>
            </LinearGradient>
            <Text style={styles.logoText}>AuthApp</Text>
          </TouchableOpacity>

          {/* Right side: user + logout */}
          <View style={styles.rightRow}>
            <TouchableOpacity onPress={() => router.push('/profile')} style={styles.userPill}>
              <LinearGradient
                colors={['#6366F1', '#8B5CF6']}
                style={styles.avatar}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Text style={styles.avatarText}>
                  {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </Text>
              </LinearGradient>
              {isWeb && (
                <Text style={styles.userName} numberOfLines={1}>{user?.name}</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
              <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
      {/* Gradient border bottom */}
      <LinearGradient
        colors={['#6366F1', '#8B5CF6', '#EC4899']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.borderLine}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    zIndex: 100,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  container: {
    paddingTop: Platform.OS === 'android' ? 42 : Platform.OS === 'web' ? 0 : 52,
    paddingBottom: 0,
  },
  inner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    width: '100%',
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logoIcon: {
    width: 34,
    height: 34,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoIconText: {
    color: '#FFF',
    fontWeight: '900',
    fontSize: 18,
  },
  logoText: {
    color: '#F8FAFC',
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  rightRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  userPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(255,255,255,0.06)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  avatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 13,
  },
  userName: {
    color: '#CBD5E1',
    fontSize: 14,
    fontWeight: '600',
    maxWidth: 140,
  },
  logoutBtn: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 8,
    backgroundColor: 'rgba(239,68,68,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(239,68,68,0.25)',
  },
  logoutText: {
    color: '#F87171',
    fontWeight: '700',
    fontSize: 13,
  },
  borderLine: {
    height: 2,
  },
});
