import React, { useState } from 'react';
import {
  StyleSheet, Text, TextInput, TouchableOpacity, View,
  ActivityIndicator, Platform, useWindowDimensions
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import AppLayout from '../components/AppLayout';
import LoadingOverlay from '../components/LoadingOverlay';

export default function ProfileScreen() {
  const { user, updateProfile } = useAuth();
  const { width } = useWindowDimensions();
  const isWide = Platform.OS === 'web' && width >= 760;

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const startEdit = () => {
    setName(user?.name || '');
    setPhone(user?.phone || '');
    setBio(user?.bio || '');
    setError('');
    setSuccess('');
    setIsEditing(true);
  };

  const handleSave = async () => {
    setError('');
    if (!name.trim()) { setError('Name cannot be empty.'); return; }
    setLoading(true);
    const result = await updateProfile(name.trim(), phone.trim(), bio.trim());
    if (result.success) {
      setSuccess('Profile updated!');
      setTimeout(() => { setIsEditing(false); setSuccess(''); }, 1500);
    } else {
      setError(result.message);
    }
    setLoading(false);
  };

  return (
    <AppLayout>
      <LoadingOverlay visible={loading} message="Saving your profile..." />
      <StatusBar style="light" />

      <View style={[styles.pageGrid, isWide && styles.pageGridWide]}>
        {/* ── Left column: Avatar card ── */}
        <View style={[styles.avatarCol, isWide && styles.avatarColWide]}>
          <View style={styles.avatarCard}>
            <LinearGradient
              colors={['#6366F1', '#EC4899']}
              style={styles.avatarCircle}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Text style={styles.avatarLetter}>
                {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </Text>
            </LinearGradient>
            <Text style={styles.avatarName}>{user?.name}</Text>
            <Text style={styles.avatarEmail}>{user?.email}</Text>

            <LinearGradient
              colors={['rgba(99,102,241,0.2)', 'rgba(236,72,153,0.15)']}
              style={styles.memberBadge}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={styles.memberBadgeText}>✦ Active Member</Text>
            </LinearGradient>

            {!isEditing && (
              <TouchableOpacity style={styles.editBtn} onPress={startEdit}>
                <LinearGradient
                  colors={['#6366F1', '#8B5CF6']}
                  style={styles.editBtnGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  <Text style={styles.editBtnText}>✏️ Edit Profile</Text>
                </LinearGradient>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* ── Right column: Details ── */}
        <View style={styles.detailsCol}>
          <View style={styles.detailsCard}>
            <Text style={styles.detailsTitle}>
              {isEditing ? '✏️ Edit your details' : 'Profile Details'}
            </Text>

            <LinearGradient
              colors={['#6366F1', '#EC4899']}
              style={styles.titleUnderline}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            />

            {/* View mode */}
            {!isEditing && (
              <View style={styles.infoList}>
                {[
                  { label: 'Full Name', value: user?.name, icon: '👤', iconColor: '#6366F1' },
                  { label: 'Email Address', value: user?.email, icon: '✉️', iconColor: '#8B5CF6' },
                  { label: 'Phone Number', value: user?.phone || 'Not added yet', icon: '📞', iconColor: '#10B981' },
                  { label: 'Bio', value: user?.bio || 'No bio yet. Click "Edit Profile" to add one.', icon: '📝', iconColor: '#EC4899' },
                ].map((item, i) => (
                  <View key={i} style={styles.infoItem}>
                    <View style={[styles.infoItemIconWrapper, { backgroundColor: item.iconColor + '1A' }]}>
                      <Text style={styles.infoItemIcon}>{item.icon}</Text>
                    </View>
                    <View style={styles.infoItemText}>
                      <Text style={styles.infoLabel}>{item.label}</Text>
                      <Text style={styles.infoValue}>{item.value}</Text>
                    </View>
                  </View>
                ))}
              </View>
            )}

            {/* Edit mode */}
            {isEditing && (
              <View>
                <Text style={styles.inputLabel}>Full Name</Text>
                <TextInput
                  style={styles.input}
                  value={name}
                  onChangeText={setName}
                  placeholder="Your full name"
                  placeholderTextColor="#818CF8"
                  editable={!loading}
                />

                <Text style={styles.inputLabel}>Phone Number</Text>
                <TextInput
                  style={styles.input}
                  value={phone}
                  onChangeText={setPhone}
                  placeholder="+91 98765 43210"
                  placeholderTextColor="#818CF8"
                  keyboardType="phone-pad"
                  editable={!loading}
                />

                <Text style={styles.inputLabel}>Bio</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  value={bio}
                  onChangeText={setBio}
                  placeholder="Tell us something about yourself..."
                  placeholderTextColor="#818CF8"
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                  editable={!loading}
                />

                {error ? (
                  <View style={styles.errorBox}>
                    <Text style={styles.errorText}>⚠️ {error}</Text>
                  </View>
                ) : null}
                {success ? (
                  <View style={styles.successBox}>
                    <Text style={styles.successText}>✅ {success}</Text>
                  </View>
                ) : null}

                <View style={styles.editActionRow}>
                  <TouchableOpacity
                    style={styles.cancelBtn}
                    onPress={() => { setIsEditing(false); setError(''); }}
                    disabled={loading}
                  >
                    <Text style={styles.cancelBtnText}>Cancel</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.saveBtnWrap}
                    onPress={handleSave}
                    disabled={loading}
                  >
                    <LinearGradient
                      colors={loading ? ['#334155', '#334155'] : ['#10B981', '#059669']}
                      style={styles.saveBtn}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                    >
                      {loading
                        ? <ActivityIndicator size="small" color="#FFF" />
                        : <Text style={styles.saveBtnText}>Save Changes</Text>
                      }
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        </View>
      </View>
    </AppLayout>
  );
}

const styles = StyleSheet.create({
  pageGrid: { flexDirection: 'column', gap: 20 },
  pageGridWide: { flexDirection: 'row', alignItems: 'flex-start' },

  avatarCol: { width: '100%' },
  avatarColWide: { width: 280, flexShrink: 0 },

  avatarCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 5,
  },
  avatarCircle: {
    width: 100, height: 100, borderRadius: 50,
    justifyContent: 'center', alignItems: 'center', marginBottom: 16,
    shadowColor: '#EC4899',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  avatarLetter: { color: '#FFF', fontSize: 40, fontWeight: '900' },
  avatarName: { color: '#FFF', fontSize: 20, fontWeight: '800', textAlign: 'center', marginBottom: 4 },
  avatarEmail: { color: '#A5B4FC', fontSize: 13, textAlign: 'center', marginBottom: 16, fontWeight: '500' },
  memberBadge: {
    paddingHorizontal: 14, paddingVertical: 7,
    borderRadius: 100, borderWidth: 1,
    borderColor: 'rgba(165, 180, 252, 0.3)', marginBottom: 20,
  },
  memberBadgeText: { color: '#A5B4FC', fontSize: 12, fontWeight: '700' },
  editBtn: { width: '100%', borderRadius: 10, overflow: 'hidden' },
  editBtnGradient: { paddingVertical: 13, alignItems: 'center' },
  editBtnText: { color: '#FFF', fontWeight: '700', fontSize: 14 },

  detailsCol: { flex: 1 },
  detailsCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderRadius: 20,
    padding: 28,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 5,
  },
  detailsTitle: { color: '#F472B6', fontSize: 18, fontWeight: '800', marginBottom: 10 },
  titleUnderline: { height: 3, borderRadius: 2, marginBottom: 24, width: 60 },

  infoList: { gap: 20 },
  infoItem: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  infoItemIconWrapper: {
    width: 40, height: 40, borderRadius: 10,
    justifyContent: 'center', alignItems: 'center',
  },
  infoItemIcon: { fontSize: 18 },
  infoItemText: { flex: 1 },
  infoLabel: { color: '#C4B5FD', fontSize: 11, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 },
  infoValue: { color: '#FFF', fontSize: 15, fontWeight: '600', lineHeight: 22 },

  inputLabel: { color: '#C4B5FD', fontSize: 12, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8, marginTop: 16 },
  input: { 
    backgroundColor: '#1E1B4B', borderRadius: 10, height: 48, 
    paddingHorizontal: 16, fontSize: 15, color: '#FFF', 
    borderWidth: 1, borderColor: 'rgba(167, 139, 250, 0.3)',
    fontWeight: '500'
  },
  textArea: { height: 100, paddingTop: 12 },

  errorBox: { backgroundColor: 'rgba(239,68,68,0.15)', borderRadius: 8, padding: 12, marginTop: 16, borderWidth: 1, borderColor: 'rgba(239,68,68,0.3)' },
  errorText: { color: '#FCA5A5', fontSize: 13, fontWeight: '500' },
  successBox: { backgroundColor: 'rgba(16,185,129,0.15)', borderRadius: 8, padding: 12, marginTop: 16, borderWidth: 1, borderColor: 'rgba(16,185,129,0.3)' },
  successText: { color: '#6EE7B7', fontSize: 13, fontWeight: '500' },

  editActionRow: { flexDirection: 'row', gap: 12, marginTop: 24 },
  cancelBtn: { flex: 1, height: 46, borderRadius: 10, borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)', justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.05)' },
  cancelBtnText: { color: '#CBD5E1', fontWeight: '700', fontSize: 14 },
  saveBtnWrap: { flex: 1, borderRadius: 10, overflow: 'hidden' },
  saveBtn: { height: 46, justifyContent: 'center', alignItems: 'center' },
  saveBtnText: { color: '#FFF', fontWeight: '700', fontSize: 14 },
});
