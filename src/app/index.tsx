import React, { useState } from 'react';
import {
  StyleSheet, Text, TextInput, TouchableOpacity, View,
  ActivityIndicator, KeyboardAvoidingView, Platform,
  ScrollView, ImageBackground, useWindowDimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../context/AuthContext';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';

// Background image (bundled asset)
const BG_IMAGE = require('../../assets/images/auth_bg.png');

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

  // The form card (shared between layouts)
  const FormCard = () => (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>Welcome back</Text>
      <Text style={styles.cardSubtitle}>Sign in to continue to your account</Text>

      <Text style={styles.label}>Email Address</Text>
      <TextInput
        style={styles.input}
        placeholder="you@example.com"
        placeholderTextColor="#475569"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
        editable={!loading}
      />

      <Text style={styles.label}>Password</Text>
      <View style={styles.passwordRow}>
        <TextInput
          style={[styles.input, { flex: 1, marginBottom: 0 }]}
          placeholder="Your password"
          placeholderTextColor="#475569"
          secureTextEntry={!showPass}
          value={password}
          onChangeText={setPassword}
          editable={!loading}
        />
        <TouchableOpacity style={styles.eyeBtn} onPress={() => setShowPass(!showPass)}>
          <Text style={styles.eyeText}>{showPass ? '🙈' : '👁️'}</Text>
        </TouchableOpacity>
      </View>

      {error ? (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>⚠️ {error}</Text>
        </View>
      ) : null}

      <TouchableOpacity
        style={styles.submitBtnWrap}
        onPress={handleLogin}
        disabled={loading}
        activeOpacity={0.85}
      >
        <LinearGradient
          colors={loading ? ['#334155', '#334155'] : ['#6366F1', '#8B5CF6']}
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

  // Split layout (web desktop)
  if (isSplitLayout) {
    return (
      <View style={styles.splitRoot}>
        <StatusBar style="light" />
        {/* Left panel - branding */}
        <ImageBackground source={BG_IMAGE} style={styles.splitLeft} imageStyle={{ borderRadius: 0 }}>
          <LinearGradient
            colors={['rgba(15,23,42,0.55)', 'rgba(99,102,241,0.5)']}
            style={StyleSheet.absoluteFillObject}
          />
          <View style={styles.splitLeftContent}>
            <LinearGradient
              colors={['#6366F1', '#8B5CF6']}
              style={styles.splitLogoIcon}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Text style={styles.splitLogoIconText}>A</Text>
            </LinearGradient>
            <Text style={styles.splitAppName}>AuthApp</Text>
            <Text style={styles.splitTagline}>Secure authentication{'\n'}made beautifully simple.</Text>
            <View style={styles.featureList}>
              {['🔒 Secure BCrypt Hashing', '⚡ Instant Updates', '📱 Mobile & Web Ready'].map((f, i) => (
                <View key={i} style={styles.featureItem}>
                  <Text style={styles.featureText}>{f}</Text>
                </View>
              ))}
            </View>
          </View>
        </ImageBackground>

        {/* Right panel - form */}
        <ScrollView
          style={styles.splitRight}
          contentContainerStyle={styles.splitRightContent}
          keyboardShouldPersistTaps="handled"
        >
          <FormCard />
          <Text style={styles.footerNote}>© {new Date().getFullYear()} AuthApp</Text>
        </ScrollView>
      </View>
    );
  }

  // Mobile layout
  return (
    <ImageBackground source={BG_IMAGE} style={styles.mobileBg}>
      <LinearGradient
        colors={['rgba(15,23,42,0.7)', 'rgba(15,23,42,0.92)']}
        style={StyleSheet.absoluteFillObject}
      />
      <StatusBar style="light" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.mobileScroll}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.mobileBrand}>
            <LinearGradient colors={['#6366F1', '#8B5CF6']} style={styles.mobileLogoIcon}>
              <Text style={styles.splitLogoIconText}>A</Text>
            </LinearGradient>
            <Text style={styles.mobileAppName}>AuthApp</Text>
          </View>
          <FormCard />
        </ScrollView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  // ── Split layout ──────────────────────────────────────────────
  splitRoot: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#0F172A',
  },
  splitLeft: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
    padding: 60,
    minWidth: 420,
  },
  splitLeftContent: {
    zIndex: 1,
    maxWidth: 380,
  },
  splitLogoIcon: {
    width: 52,
    height: 52,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  splitLogoIconText: {
    color: '#FFF',
    fontSize: 26,
    fontWeight: '900',
  },
  splitAppName: {
    color: '#FFF',
    fontSize: 36,
    fontWeight: '900',
    letterSpacing: -1,
    marginBottom: 16,
  },
  splitTagline: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 20,
    fontWeight: '400',
    lineHeight: 30,
    marginBottom: 40,
  },
  featureList: {
    gap: 12,
  },
  featureItem: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  featureText: {
    color: '#E2E8F0',
    fontSize: 15,
    fontWeight: '500',
  },
  splitRight: {
    width: 480,
    backgroundColor: '#0F172A',
  },
  splitRightContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 48,
    paddingVertical: 60,
  },
  footerNote: {
    color: '#334155',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 24,
  },

  // ── Mobile layout ──────────────────────────────────────────────
  mobileBg: {
    flex: 1,
  },
  mobileScroll: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },
  mobileBrand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 32,
    alignSelf: 'center',
  },
  mobileLogoIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mobileAppName: {
    color: '#FFF',
    fontSize: 26,
    fontWeight: '900',
    letterSpacing: -0.5,
  },

  // ── Card ──────────────────────────────────────────────────────
  card: {
    backgroundColor: 'rgba(30,41,59,0.85)',
    borderRadius: 20,
    padding: 32,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.07)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.4,
    shadowRadius: 30,
    elevation: 10,
    backdropFilter: 'blur(20px)',
  },
  cardTitle: {
    color: '#F8FAFC',
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: -0.5,
    marginBottom: 6,
  },
  cardSubtitle: {
    color: '#64748B',
    fontSize: 14,
    marginBottom: 28,
    fontWeight: '400',
  },
  label: {
    color: '#94A3B8',
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 8,
    marginTop: 16,
  },
  input: {
    backgroundColor: '#1E293B',
    borderRadius: 10,
    height: 48,
    paddingHorizontal: 16,
    fontSize: 15,
    color: '#F8FAFC',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    marginBottom: 4,
  },
  passwordRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  eyeBtn: {
    width: 48,
    height: 48,
    backgroundColor: '#1E293B',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  eyeText: { fontSize: 18 },
  errorBox: {
    backgroundColor: 'rgba(239,68,68,0.1)',
    borderRadius: 8,
    padding: 12,
    marginTop: 12,
    borderWidth: 1,
    borderColor: 'rgba(239,68,68,0.2)',
  },
  errorText: {
    color: '#FCA5A5',
    fontSize: 13,
    fontWeight: '500',
  },
  submitBtnWrap: {
    marginTop: 24,
    borderRadius: 12,
    overflow: 'hidden',
  },
  submitBtn: {
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitBtnText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.07)',
  },
  dividerText: {
    color: '#475569',
    fontSize: 12,
    fontWeight: '500',
  },
  altBtn: {
    height: 46,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(99,102,241,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(99,102,241,0.08)',
  },
  altBtnText: {
    color: '#818CF8',
    fontWeight: '700',
    fontSize: 14,
  },
});
