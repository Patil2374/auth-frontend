import React from 'react';
import { StyleSheet, Text, View, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <View style={styles.wrapper}>
      <LinearGradient
        colors={['#6366F1', '#8B5CF6', '#EC4899']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.borderLine}
      />
      <View style={styles.container}>
        <Text style={styles.text}>© {year} AuthApp · Built with React Native & Expo</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: 'transparent',
  },
  borderLine: {
    height: 2,
  },
  container: {
    paddingVertical: 16,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  text: {
    color: '#475569',
    fontSize: 12,
    fontWeight: '500',
  },
});
