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

export default function RegisterScreen() {
  const { register, login } = useAuth();
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isWeb = Platform.OS === 'web';
  const isSplitLayout = isWeb && width >= 900;

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPass, setShowPass] = useState(false);

  const handleRegister = async () => {
    setError('');
    setSuccess('');
    if (!name || !email || !password || !confirmPassword) { setError('Please fill in all fields.'); return; }
    if (!email.includes('@')) { setError('Please enter a valid email address.'); return; }
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    if (password !== confirmPassword) { setError('Passwords do not match.'); return; }

    setLoading(true);
    const result = await register(name.trim(), email.trim(), password);
    if (!result.success) {
      setError(result.message);
      setLoading(false);
    } else {
      setSuccess('Account created! Signing you in...');
      const loginResult = await login(email.trim(), password);
      if (loginResult.success) {
        router.replace('/dashboard');
      } else {
        setTimeout(() => router.replace('/'), 1200);
      }
      setLoading(false);
    }
  };

  // ── Inlined form JSX — avoids focus loss on re-render ──
  const formJSX = (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>Create account</Text>
      <Text style={styles.cardSubtitle}>Get started in just a few seconds</Text>

      <Text style={styles.label}>Full Name</Text>
      <TextInput
        style={styles.input}
        placeholder="John Doe"
        placeholderTextColor="#475569"
        autoCapitalize="words"
        value={name}
        onChangeText={setName}
        editable={!loading && !success}
      />

      <Text style={styles.label}>Email Address</Text>
      <TextInput
        style={styles.input}
        placeholder="you@example.com"
        placeholderTextColor="#475569"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
        editable={!loading && !success}
      />

      <Text style={styles.label}>Password</Text>
      <View style={styles.passwordRow}>
        <TextInput
          style={[styles.input, styles.passwordInput]}
          placeholder="Min. 6 characters"
          placeholderTextColor="#475569"
          secureTextEntry={!showPass}
          value={password}
          onChangeText={setPassword}
          editable={!loading && !success}
        />
        <TouchableOpacity style={styles.eyeBtn} onPress={() => setShowPass(p => !p)}>
          <Text style={styles.eyeText}>{showPass ? '🙈' : '👁️'}</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.label}>Confirm Password</Text>
      <TextInput
        style={styles.input}
        placeholder="Re-enter your password"
        placeholderTextColor="#475569"
        secureTextEntry={!showPass}
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        editable={!loading && !success}
      />

      {error ? (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>⚠️  {error}</Text>
        </View>
      ) : null}
      {success ? (
        <View style={styles.successBox}>
          <Text style={styles.successText}>✅  {success}</Text>
        </View>
      ) : null}

      <TouchableOpacity
        style={styles.submitBtnWrap}
        onPress={handleRegister}
        disabled={loading || !!success}
        activeOpacity={0.85}
      >
        <LinearGradient
          colors={loading || success ? ['#334155', '#334155'] : ['#8B5CF6', '#EC4899']}
          style={styles.submitBtn}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          {loading
            ? <ActivityIndicator color="#FFF" size="small" />
            : <Text style={styles.submitBtnText}>Create Account →</Text>
          }
        </LinearGradient>
      </TouchableOpacity>

      <View style={styles.dividerRow}>
        <View style={styles.dividerLine} />
        <Text style={styles.dividerText}>Already have an account?</Text>
        <View style={styles.dividerLine} />
      </View>

      <TouchableOpacity
        style={styles.altBtn}
        onPress={() => router.replace('/')}
        disabled={loading || !!success}
      >
        <Text style={styles.altBtnText}>Sign In Instead</Text>
      </TouchableOpacity>
    </View>
  );

  // ── Split layout (web desktop ≥ 900px) ──
  if (isSplitLayout) {
    return (
      <View style={styles.splitRoot}>
        <LoadingOverlay visible={loading} message={success ? 'Signing you in...' : 'Creating your account...'} />
        <StatusBar style="light" />

        <LinearGradient
          colors={['#0F172A', '#2D1B69', '#1E1B4B']}
          style={styles.splitLeft}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
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
            <Text style={styles.splitTagline}>Join thousands of users{'\n'}building with confidence.</Text>
            <View style={styles.featureList}>
              {['✅ Free to use forever', '🚀 Deployed in minutes', '🔐 Enterprise-grade security'].map((f, i) => (
                <View key={i} style={styles.featureItem}>
                  <Text style={styles.featureText}>{f}</Text>
                </View>
              ))}
            </View>
          </View>
        </LinearGradient>

        <ScrollView
          style={styles.splitRight}
          contentContainerStyle={styles.splitRightContent}
          keyboardShouldPersistTaps="handled"
        >
          {formJSX}
          <Text style={styles.footerNote}>© {new Date().getFullYear()} AuthApp</Text>
        </ScrollView>
      </View>
    );
  }

  // ── Mobile / narrow layout ──
  return (
    <LinearGradient
      colors={['#0F172A', '#2D1B69', '#0F172A']}
      style={styles.mobileBg}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <View style={styles.mobileBlob1} />
      <View style={styles.mobileBlob2} />

      <LoadingOverlay visible={loading} message={success ? 'Signing you in...' : 'Creating your account...'} />
      <StatusBar style="light" />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.flex1}>
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
  splitRoot: { flex: 1, flexDirection: 'row', backgroundColor: '#0F172A' },
  splitLeft: { flex: 1, justifyContent: 'center', alignItems: 'flex-start', padding: 60, minWidth: 420, overflow: 'hidden' },
  splitLeftContent: { zIndex: 1, maxWidth: 380 },
  decorCircle1: {
    position: 'absolute', width: 400, height: 400, borderRadius: 200,
    backgroundColor: 'rgba(139,92,246,0.15)', top: -100, right: -100,
  },
  decorCircle2: {
    position: 'absolute', width: 300, height: 300, borderRadius: 150,
    backgroundColor: 'rgba(236,72,153,0.1)', bottom: 50, left: -80,
  },
  splitLogoIcon: { width: 52, height: 52, borderRadius: 14, justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
  splitLogoIconText: { color: '#FFF', fontSize: 26, fontWeight: '900' },
  splitAppName: { color: '#FFF', fontSize: 36, fontWeight: '900', letterSpacing: -1, marginBottom: 16 },
  splitTagline: { color: 'rgba(255,255,255,0.8)', fontSize: 20, lineHeight: 32, marginBottom: 40 },
  featureList: { gap: 12 },
  featureItem: { backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 10, paddingHorizontal: 16, paddingVertical: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  featureText: { color: '#E2E8F0', fontSize: 15, fontWeight: '500' },
  splitRight: { width: 480, backgroundColor: '#0F172A' },
  splitRightContent: { flexGrow: 1, justifyContent: 'center', padding: 48, paddingVertical: 60 },
  footerNote: { color: '#334155', fontSize: 12, textAlign: 'center', marginTop: 24 },
  mobileBg: { flex: 1 },
  mobileBlob1: {
    position: 'absolute', width: 300, height: 300, borderRadius: 150,
    backgroundColor: 'rgba(139,92,246,0.2)', top: -80, right: -80,
  },
  mobileBlob2: {
    position: 'absolute', width: 250, height: 250, borderRadius: 125,
    backgroundColor: 'rgba(236,72,153,0.15)', bottom: 100, left: -60,
  },
  mobileScroll: { flexGrow: 1, justifyContent: 'center', padding: 24, paddingTop: 70, paddingBottom: 40 },
  mobileBrand: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 32, alignSelf: 'center' },
  mobileLogoIcon: { width: 40, height: 40, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  mobileAppName: { color: '#FFF', fontSize: 26, fontWeight: '900', letterSpacing: -0.5 },
  card: { backgroundColor: 'rgba(30,41,59,0.9)', borderRadius: 20, padding: 28, borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)', shadowColor: '#000', shadowOffset: { width: 0, height: 20 }, shadowOpacity: 0.5, shadowRadius: 30, elevation: 10 },
  cardTitle: { color: '#F8FAFC', fontSize: 24, fontWeight: '800', letterSpacing: -0.5, marginBottom: 6 },
  cardSubtitle: { color: '#64748B', fontSize: 14, marginBottom: 24 },
  label: { color: '#94A3B8', fontSize: 11, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 8, marginTop: 14 },
  input: { backgroundColor: '#0F172A', borderRadius: 10, height: 48, paddingHorizontal: 16, fontSize: 15, color: '#F8FAFC', borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)' },
  passwordRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  passwordInput: { flex: 1 },
  eyeBtn: { width: 48, height: 48, backgroundColor: '#0F172A', borderRadius: 10, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.08)' },
  eyeText: { fontSize: 18 },
  errorBox: { backgroundColor: 'rgba(239,68,68,0.1)', borderRadius: 8, padding: 12, marginTop: 12, borderWidth: 1, borderColor: 'rgba(239,68,68,0.2)' },
  errorText: { color: '#FCA5A5', fontSize: 13, fontWeight: '500' },
  successBox: { backgroundColor: 'rgba(16,185,129,0.1)', borderRadius: 8, padding: 12, marginTop: 12, borderWidth: 1, borderColor: 'rgba(16,185,129,0.2)' },
  successText: { color: '#6EE7B7', fontSize: 13, fontWeight: '500' },
  submitBtnWrap: { marginTop: 24, borderRadius: 12, overflow: 'hidden' },
  submitBtn: { height: 50, justifyContent: 'center', alignItems: 'center' },
  submitBtnText: { color: '#FFF', fontSize: 16, fontWeight: '700', letterSpacing: 0.3 },
  dividerRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginVertical: 20 },
  dividerLine: { flex: 1, height: 1, backgroundColor: 'rgba(255,255,255,0.07)' },
  dividerText: { color: '#475569', fontSize: 12, fontWeight: '500' },
  altBtn: { height: 46, borderRadius: 10, borderWidth: 1, borderColor: 'rgba(139,92,246,0.4)', justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(139,92,246,0.08)' },
  altBtnText: { color: '#C4B5FD', fontWeight: '700', fontSize: 14 },
});
