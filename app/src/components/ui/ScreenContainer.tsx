import React from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { spacing } from '../../theme';

type ScreenContainerProps = {
  children: React.ReactNode;
  style?: ViewStyle;
};

export function ScreenContainer({ children, style }: ScreenContainerProps) {
  return (
    <LinearGradient colors={['#060816', '#101830', '#1d2748']} style={styles.background}>
      <View style={[styles.container, style]}>{children}</View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1 },
  container: {
    flex: 1,
    padding: spacing.lg,
    paddingTop: 56,
  },
});
