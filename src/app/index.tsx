import React, { useState } from 'react';
import {
  StyleSheet, Text, TextInput, TouchableOpacity, View,
  ActivityIndicator, KeyboardAvoidingView, Platform,
  ScrollView, useWindowDimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../context/AuthContext';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import LoadingOverlay from '../components/LoadingOverlay';

export default function LoginScreen() {
  const { login } = useAuth();
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isWeb = Platform.OS === 'web';
  const isSplitLayout = isWeb && width >= 900;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPass, setShowPass] = useState(false);

  const handleLogin = async () => {
    setError('');
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }
    setLoading(true);
    const result = await login(email.trim(), password);
    if (!result.success) {
      setError(result.message);
    } else {
      router.replace('/dashboard');
    }
    setLoading(false);
  };

  // ── Inlined form JSX — avoids focus loss on re-render ──
  const formJSX = (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>Welcome back</Text>
      <Text style={styles.cardSubtitle}>Sign in to continue to your account</Text>

      <Text style={styles.label}>Email Address</Text>
      <TextInput
        style={styles.input}
        placeholder="you@example.com"
        placeholderTextColor="#A78BFA"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
        editable={!loading}
      />

      <Text style={styles.label}>Password</Text>
      <View style={styles.passwordRow}>
        <TextInput
          style={[styles.input, styles.passwordInput]}
          placeholder="Your password"
          placeholderTextColor="#A78BFA"
          secureTextEntry={!showPass}
          value={password}
          onChangeText={setPassword}
          editable={!loading}
        />
        <TouchableOpacity style={styles.eyeBtn} onPress={() => setShowPass(p => !p)}>
          <Text style={styles.eyeText}>{showPass ? '🙈' : '👁️'}</Text>
        </TouchableOpacity>
      </View>

      {error ? (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>⚠️  {error}</Text>
        </View>
      ) : null}

      <TouchableOpacity
        style={styles.submitBtnWrap}
        onPress={handleLogin}
        disabled={loading}
        activeOpacity={0.85}
      >
        <LinearGradient
          colors={loading ? ['#4C1D95', '#4C1D95'] : ['#8B5CF6', '#EC4899']}
          style={styles.submitBtn}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          {loading
            ? <ActivityIndicator color="#FFF" size="small" />
            : <Text style={styles.submitBtnText}>Sign In →</Text>
          }
        </LinearGradient>
      </TouchableOpacity>

      <View style={styles.dividerRow}>
        <View style={styles.dividerLine} />
        <Text style={styles.dividerText}>Don't have an account?</Text>
        <View style={styles.dividerLine} />
      </View>

      <TouchableOpacity
        style={styles.altBtn}
        onPress={() => router.push('/register')}
        disabled={loading}
      >
        <Text style={styles.altBtnText}>Create Account</Text>
      </TouchableOpacity>
    </View>
  );

  // ── Split layout (web desktop ≥ 900px) ──
  if (isSplitLayout) {
    return (
      <LinearGradient
        colors={['#1E1B4B', '#4C1D95', '#0F172A']}
        style={styles.splitRoot}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <LoadingOverlay visible={loading} message="Signing you in..." />
        <StatusBar style="light" />

        {/* Left branding panel */}
        <View style={styles.splitLeft}>
          {/* Decorative circles */}
          <View style={styles.decorCircle1} />
          <View style={styles.decorCircle2} />

          <View style={styles.splitLeftContent}>
            <LinearGradient
              colors={['#8B5CF6', '#EC4899']}
              style={styles.splitLogoIcon}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Text style={styles.splitLogoIconText}>A</Text>
            </LinearGradient>
            <Text style={styles.splitAppName}>AuthApp</Text>
            <Text style={styles.splitTagline}>Secure authentication{'\n'}made beautifully simple.</Text>
          </View>
        </View>

        {/* Right form panel */}
        <ScrollView
          style={styles.splitRight}
          contentContainerStyle={styles.splitRightContent}
          keyboardShouldPersistTaps="handled"
        >
          {formJSX}
          <Text style={styles.footerNote}>© {new Date().getFullYear()} AuthApp</Text>
        </ScrollView>
      </LinearGradient>
    );
  }

  // ── Mobile / narrow layout ──
  return (
    <LinearGradient
      colors={['#1E1B4B', '#4C1D95', '#0F172A']}
      style={styles.mobileBg}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      {/* Decorative blobs */}
      <View style={styles.mobileBlob1} />
      <View style={styles.mobileBlob2} />

      <LoadingOverlay visible={loading} message="Signing you in..." />
      <StatusBar style="light" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flex1}
      >
        <ScrollView
          contentContainerStyle={styles.mobileScroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.mobileBrand}>
            <LinearGradient colors={['#8B5CF6', '#EC4899']} style={styles.mobileLogoIcon}>
              <Text style={styles.splitLogoIconText}>A</Text>
            </LinearGradient>
            <Text style={styles.mobileAppName}>AuthApp</Text>
          </View>
          {formJSX}
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  flex1: { flex: 1 },

  // ── Split layout ──
  splitRoot: { flex: 1, flexDirection: 'row' },
  splitLeft: {
    flex: 1, justifyContent: 'center', alignItems: 'flex-start',
    padding: 60, minWidth: 420, overflow: 'hidden',
  },
  splitLeftContent: { zIndex: 1, maxWidth: 380 },
  decorCircle1: {
    position: 'absolute', width: 400, height: 400, borderRadius: 200,
    backgroundColor: 'rgba(139,92,246,0.12)', top: -100, right: -100,
  },
  decorCircle2: {
    position: 'absolute', width: 300, height: 300, borderRadius: 150,
    backgroundColor: 'rgba(236,72,153,0.08)', bottom: 50, left: -80,
  },
  splitLogoIcon: {
    width: 52, height: 52, borderRadius: 14,
    justifyContent: 'center', alignItems: 'center', marginBottom: 20,
  },
  splitLogoIconText: { color: '#FFF', fontSize: 26, fontWeight: '900' },
  splitAppName: { color: '#FFF', fontSize: 36, fontWeight: '900', letterSpacing: -1, marginBottom: 16 },
  splitTagline: { color: 'rgba(253,242,248,0.8)', fontSize: 20, lineHeight: 32, marginBottom: 40 },
  splitRight: { width: 480, backgroundColor: 'transparent' },
  splitRightContent: { flexGrow: 1, justifyContent: 'center', padding: 48, paddingVertical: 60 },
  footerNote: { color: '#B794F4', fontSize: 12, textAlign: 'center', marginTop: 24 },

  // ── Mobile layout ──
  mobileBg: { flex: 1 },
  mobileBlob1: {
    position: 'absolute', width: 300, height: 300, borderRadius: 150,
    backgroundColor: 'rgba(139,92,246,0.15)', top: -80, right: -80,
  },
  mobileBlob2: {
    position: 'absolute', width: 250, height: 250, borderRadius: 125,
    backgroundColor: 'rgba(236,72,153,0.1)', bottom: 100, left: -60,
  },
  mobileScroll: { flexGrow: 1, justifyContent: 'center', padding: 24, paddingTop: 70, paddingBottom: 40 },
  mobileBrand: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 32, alignSelf: 'center' },
  mobileLogoIcon: { width: 40, height: 40, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  mobileAppName: { color: '#FFF', fontSize: 26, fontWeight: '900', letterSpacing: -0.5 },

  // ── Card ──
  card: {
    backgroundColor: 'rgba(76,29,149,0.35)',
    borderRadius: 20, padding: 28,
    borderWidth: 1, borderColor: 'rgba(236,72,153,0.25)',
    shadowColor: '#000', shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.5, shadowRadius: 30, elevation: 10,
  },
  cardTitle: { color: '#FCE7F3', fontSize: 24, fontWeight: '800', letterSpacing: -0.5, marginBottom: 6 },
  cardSubtitle: { color: '#F472B6', fontSize: 14, marginBottom: 24 },
  label: {
    color: '#C4B5FD', fontSize: 11, fontWeight: '700',
    textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 8, marginTop: 14,
  },
  input: {
    backgroundColor: '#1E1B4B', borderRadius: 10, height: 48,
    paddingHorizontal: 16, fontSize: 15, color: '#FCE7F3',
    borderWidth: 1, borderColor: 'rgba(167,139,250,0.2)',
  },
  passwordRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  passwordInput: { flex: 1 },
  eyeBtn: {
    width: 48, height: 48, backgroundColor: '#1E1B4B', borderRadius: 10,
    justifyContent: 'center', alignItems: 'center',
    borderWidth: 1, borderColor: 'rgba(167,139,250,0.2)',
  },
  eyeText: { fontSize: 18 },
  errorBox: {
    backgroundColor: 'rgba(239,68,68,0.15)', borderRadius: 8, padding: 12, marginTop: 12,
    borderWidth: 1, borderColor: 'rgba(239,68,68,0.3)',
  },
  errorText: { color: '#FCA5A5', fontSize: 13, fontWeight: '500' },
  submitBtnWrap: { marginTop: 24, borderRadius: 12, overflow: 'hidden' },
  submitBtn: { height: 50, justifyContent: 'center', alignItems: 'center' },
  submitBtnText: { color: '#FFF', fontSize: 16, fontWeight: '700', letterSpacing: 0.3 },
  dividerRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginVertical: 20 },
  dividerLine: { flex: 1, height: 1, backgroundColor: 'rgba(167,139,250,0.15)' },
  dividerText: { color: '#C4B5FD', fontSize: 12, fontWeight: '500' },
  altBtn: {
    height: 46, borderRadius: 10, borderWidth: 1,
    borderColor: 'rgba(167,139,250,0.4)', justifyContent: 'center', alignItems: 'center',
    backgroundColor: 'rgba(167,139,250,0.08)',
  },
  altBtnText: { color: '#D8B4FE', fontWeight: '700', fontSize: 14 },
});
