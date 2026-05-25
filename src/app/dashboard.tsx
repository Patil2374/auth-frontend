import React from 'react';
import {
  StyleSheet, Text, TouchableOpacity, View, Platform, useWindowDimensions
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../context/AuthContext';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import AppLayout from '../components/AppLayout';

export default function DashboardScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isWide = Platform.OS === 'web' && width >= 700;

  const statCards = [
    { label: 'Email', value: user?.email || '—', icon: '✉️' },
    { label: 'Phone', value: user?.phone || 'Not set', icon: '📞' },
    { label: 'Member Since', value: 'Today', icon: '📅' },
  ];

  const quickActions = [
    { title: 'Edit Profile', subtitle: 'Update your information', icon: '👤', colors: ['#6366F1', '#8B5CF6'], route: '/profile' },
    { title: 'Security', subtitle: 'Manage your password', icon: '🔐', colors: ['#10B981', '#059669'], route: null },
    { title: 'Activity', subtitle: 'View recent activity', icon: '⚡', colors: ['#F59E0B', '#D97706'], route: null },
    { title: 'Settings', subtitle: 'App preferences', icon: '⚙️', colors: ['#EC4899', '#BE185D'], route: null },
  ];

  return (
    <AppLayout>
      <StatusBar style="light" />

      {/* Welcome banner */}
      <LinearGradient
        colors={['#1E293B', '#0F172A']}
        style={styles.welcomeBanner}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.welcomeLeft}>
          <Text style={styles.welcomeGreeting}>Good day,</Text>
          <Text style={styles.welcomeName}>{user?.name || 'User'} 👋</Text>
          {user?.bio ? (
            <Text style={styles.welcomeBio} numberOfLines={2}>{user.bio}</Text>
          ) : (
            <TouchableOpacity onPress={() => router.push('/profile')}>
              <Text style={styles.welcomeBioEmpty}>+ Add a bio to your profile</Text>
            </TouchableOpacity>
          )}
        </View>
        <LinearGradient
          colors={['#6366F1', '#8B5CF6']}
          style={styles.welcomeAvatar}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Text style={styles.welcomeAvatarText}>
            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </Text>
        </LinearGradient>
      </LinearGradient>

      {/* Stats row */}
      <View style={[styles.statsRow, isWide && styles.statsRowWide]}>
        {statCards.map((card, i) => (
          <View key={i} style={[styles.statCard, isWide && styles.statCardWide]}>
            <Text style={styles.statIcon}>{card.icon}</Text>
            <Text style={styles.statLabel}>{card.label}</Text>
            <Text style={styles.statValue} numberOfLines={1}>{card.value}</Text>
          </View>
        ))}
      </View>

      {/* Quick Actions */}
      <Text style={styles.sectionTitle}>Quick Actions</Text>
      <View style={[styles.actionsGrid, isWide && styles.actionsGridWide]}>
        {quickActions.map((action, i) => (
          <TouchableOpacity
            key={i}
            style={[styles.actionCard, isWide && styles.actionCardWide]}
            onPress={() => action.route ? router.push(action.route as any) : alert('Coming soon!')}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={action.colors as [string, string]}
              style={styles.actionGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Text style={styles.actionIcon}>{action.icon}</Text>
              <Text style={styles.actionTitle}>{action.title}</Text>
              <Text style={styles.actionSubtitle}>{action.subtitle}</Text>
            </LinearGradient>
          </TouchableOpacity>
        ))}
      </View>
    </AppLayout>
  );
}

const styles = StyleSheet.create({
  welcomeBanner: {
    borderRadius: 20,
    padding: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  welcomeLeft: { flex: 1 },
  welcomeGreeting: { color: '#64748B', fontSize: 14, fontWeight: '500', marginBottom: 4 },
  welcomeName: { color: '#F8FAFC', fontSize: 28, fontWeight: '800', letterSpacing: -0.5, marginBottom: 8 },
  welcomeBio: { color: '#94A3B8', fontSize: 14, lineHeight: 20 },
  welcomeBioEmpty: { color: '#6366F1', fontSize: 14, fontWeight: '600' },
  welcomeAvatar: {
    width: 64, height: 64, borderRadius: 32,
    justifyContent: 'center', alignItems: 'center', marginLeft: 16,
  },
  welcomeAvatarText: { color: '#FFF', fontSize: 26, fontWeight: '900' },

  statsRow: { flexDirection: 'column', gap: 12, marginBottom: 32 },
  statsRowWide: { flexDirection: 'row' },
  statCard: {
    flex: 1,
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  statCardWide: { flex: 1 },
  statIcon: { fontSize: 22, marginBottom: 8 },
  statLabel: { color: '#64748B', fontSize: 11, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 4 },
  statValue: { color: '#F8FAFC', fontSize: 15, fontWeight: '600' },

  sectionTitle: { color: '#F8FAFC', fontSize: 20, fontWeight: '800', marginBottom: 16, letterSpacing: -0.3 },

  actionsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 14 },
  actionsGridWide: {},
  actionCard: { width: '47%', borderRadius: 18, overflow: 'hidden' },
  actionCardWide: { flex: 1, minWidth: 140 },
  actionGradient: { padding: 22, minHeight: 140, justifyContent: 'space-between' },
  actionIcon: { fontSize: 30 },
  actionTitle: { color: '#FFF', fontSize: 16, fontWeight: '700', marginTop: 16 },
  actionSubtitle: { color: 'rgba(255,255,255,0.65)', fontSize: 12, marginTop: 4 },
});
