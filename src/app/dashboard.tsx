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
    { label: 'Email', value: user?.email || '—', icon: '✉️', cardStyle: styles.statCardEmail, labelStyle: styles.labelColorEmail, valueStyle: styles.valueColorEmail },
    { label: 'Phone', value: user?.phone || 'Not set', icon: '📞', cardStyle: styles.statCardPhone, labelStyle: styles.labelColorPhone, valueStyle: styles.valueColorPhone },
    { label: 'Member Since', value: 'Today', icon: '📅', cardStyle: styles.statCardMember, labelStyle: styles.labelColorMember, valueStyle: styles.valueColorMember },
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
        colors={['#6366F1', '#8B5CF6', '#EC4899']}
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
        <View style={styles.welcomeAvatarOuter}>
          <LinearGradient
            colors={['#FFF', 'rgba(255,255,255,0.7)']}
            style={styles.welcomeAvatar}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Text style={styles.welcomeAvatarText}>
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </Text>
          </LinearGradient>
        </View>
      </LinearGradient>

      {/* Stats row */}
      <View style={[styles.statsRow, isWide && styles.statsRowWide]}>
        {statCards.map((card, i) => (
          <View key={i} style={[styles.statCard, card.cardStyle, isWide && styles.statCardWide]}>
            <Text style={styles.statIcon}>{card.icon}</Text>
            <Text style={[styles.statLabel, card.labelStyle]}>{card.label}</Text>
            <Text style={[styles.statValue, card.valueStyle]} numberOfLines={1}>{card.value}</Text>
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
    borderColor: 'rgba(255,255,255,0.15)',
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
  },
  welcomeLeft: { flex: 1 },
  welcomeGreeting: { color: 'rgba(255,255,255,0.7)', fontSize: 14, fontWeight: '600', marginBottom: 4 },
  welcomeName: { color: '#FFF', fontSize: 28, fontWeight: '900', letterSpacing: -0.5, marginBottom: 8 },
  welcomeBio: { color: '#F1F5F9', fontSize: 14, lineHeight: 20, fontWeight: '500' },
  welcomeBioEmpty: { color: '#FFF', fontSize: 14, fontWeight: '700', textDecorationLine: 'underline' },
  welcomeAvatarOuter: {
    borderRadius: 36,
    padding: 3,
    backgroundColor: 'rgba(255,255,255,0.25)',
    marginLeft: 16,
  },
  welcomeAvatar: {
    width: 60, height: 60, borderRadius: 30,
    justifyContent: 'center', alignItems: 'center',
  },
  welcomeAvatarText: { color: '#8B5CF6', fontSize: 26, fontWeight: '900' },

  statsRow: { flexDirection: 'column', gap: 12, marginBottom: 32 },
  statsRowWide: { flexDirection: 'row' },
  statCard: {
    flex: 1,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  statCardWide: { flex: 1 },
  
  // Custom glowing card overrides
  statCardEmail: {
    backgroundColor: 'rgba(99,102,241,0.15)',
    borderColor: 'rgba(99,102,241,0.3)',
  },
  statCardPhone: {
    backgroundColor: 'rgba(20,184,166,0.15)',
    borderColor: 'rgba(20,184,166,0.3)',
  },
  statCardMember: {
    backgroundColor: 'rgba(245,158,11,0.15)',
    borderColor: 'rgba(245,158,11,0.3)',
  },

  statIcon: { fontSize: 22, marginBottom: 8 },
  statLabel: { fontSize: 11, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 },
  
  labelColorEmail: { color: '#818CF8' },
  labelColorPhone: { color: '#2DD4BF' },
  labelColorMember: { color: '#FBBF24' },

  statValue: { fontSize: 15, fontWeight: '700' },
  
  valueColorEmail: { color: '#E0E7FF' },
  valueColorPhone: { color: '#F0FDFA' },
  valueColorMember: { color: '#FEF3C7' },

  sectionTitle: { color: '#C4B5FD', fontSize: 20, fontWeight: '800', marginBottom: 16, letterSpacing: -0.3 },

  actionsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 14 },
  actionsGridWide: {},
  actionCard: { 
    width: '47%', borderRadius: 18, overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  actionCardWide: { flex: 1, minWidth: 140 },
  actionGradient: { padding: 22, minHeight: 140, justifyContent: 'space-between' },
  actionIcon: { fontSize: 30 },
  actionTitle: { color: '#FFF', fontSize: 16, fontWeight: '800', marginTop: 16 },
  actionSubtitle: { color: 'rgba(255,255,255,0.75)', fontSize: 12, marginTop: 4, fontWeight: '500' },
});
