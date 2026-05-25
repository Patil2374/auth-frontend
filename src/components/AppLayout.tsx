import React from 'react';
import { StyleSheet, View, ScrollView, Platform, useWindowDimensions } from 'react-native';
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
    <View style={styles.root}>
      <Header />
      <ContentWrapper style={styles.fill} {...contentProps}>
        <View style={[styles.pageContent, isWeb && { maxWidth: 1100, alignSelf: 'center', width: '100%' }]}>
          {children}
        </View>
      </ContentWrapper>
      <Footer />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#0F172A',
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
