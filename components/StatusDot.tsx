import React from 'react';
import { View, StyleSheet } from 'react-native';

export type Status = 'free' | 'plans' | 'travel';

export default function StatusDot({ status }: { status: Status }) {
  const color = {
    free: '#00C851',
    plans: '#AA6C39',
    travel: '#FF4444',
  }[status];

  return <View style={[styles.dot, { backgroundColor: color }]} />;
}

const styles = StyleSheet.create({
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
    marginBottom: 4,
  },
});
