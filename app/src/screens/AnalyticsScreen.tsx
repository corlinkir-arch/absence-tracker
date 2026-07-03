import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { AppHeader } from '../components/ui/AppHeader';
import { Card } from '../components/ui/Card';
import { ScreenContainer } from '../components/ui/ScreenContainer';
import { SectionHeader } from '../components/ui/SectionHeader';
import { colors, spacing, typography } from '../theme';

export function AnalyticsScreen() {
  return (
    <ScreenContainer style={styles.screen}>
      <AppHeader title="Insights" subtitle="Emotional patterns become visible over time." />
      <View style={styles.container}>
        <SectionHeader title="Reflection" hint="A growing view of your inner rhythm." />
        <Card style={styles.card}>
          <Text style={styles.title}>Mood and reflection trends</Text>
          <Text style={styles.body}>Charts and insights will be added here as the experience grows.</Text>
        </Card>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  screen: { paddingTop: 0 },
  container: { flex: 1, paddingHorizontal: spacing.lg, paddingTop: spacing.md },
  card: { marginTop: spacing.md },
  title: { color: colors.textPrimary, fontSize: typography.subtitle, fontWeight: '600', marginBottom: 6 },
  body: { color: colors.textSecondary, fontSize: typography.body, lineHeight: 20 },
});
