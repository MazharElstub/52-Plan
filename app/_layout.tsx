import { Stack } from 'expo-router';
import { ConvexProvider, ConvexReactClient } from 'convex/react';
import React from 'react';

const convexUrl = process.env.EXPO_PUBLIC_CONVEX_URL;

if (!convexUrl) {
  throw new Error('Missing EXPO_PUBLIC_CONVEX_URL environment variable');
}

const convex = new ConvexReactClient(convexUrl, {
  unsavedChangesWarning: false,
});

export default function RootLayout() {
  return (
    <ConvexProvider client={convex}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
      </Stack>
    </ConvexProvider>
  );
}
