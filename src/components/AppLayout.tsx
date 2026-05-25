import React from 'react';
import { StyleSheet, View, ScrollView, Platform, useWindowDimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Header from './Header';
import Footer from './Footer';

interface AppLayoutProps {
  children: React.ReactNode;
  scrollable?: boolean;
}

export default function AppLayout({ children, scrollable = true }: AppLayoutProps) {
  const { width } = useWindowDimensions();
  const isWeb = Platform.OS === 'web';

  const ContentWrapper = scrollable ? ScrollView : View;
  const contentProps = scrollable
    ? { contentContainerStyle: styles.scrollContent, showsVerticalScrollIndicator: false }
    : { style: styles.fill };

  return (
    <LinearGradient
      colors={['#0F172A', '#1E1B4B', '#312E81']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.root}
    >
      <Header />
      <ContentWrapper style={styles.fill} {...contentProps}>
        <View style={[styles.pageContent, isWeb && { maxWidth: 1100, alignSelf: 'center', width: '100%' }]}>
          {children}
        </View>
      </ContentWrapper>
      <Footer />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  fill: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  pageContent: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 28,
    width: '100%',
  },
});
