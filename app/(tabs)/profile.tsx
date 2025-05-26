import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { Ionicons } from '@expo/vector-icons';

export default function Profile() {
  const user = useQuery(api.users.getCurrentUser);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkMode, setDarkMode] = useState(true);

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Sign Out', style: 'destructive', onPress: () => console.log('Sign out') }
      ]
    );
  };

  const settingsOptions = [
    {
      icon: 'notifications-outline',
      title: 'Push Notifications',
      hasToggle: true,
      value: notificationsEnabled,
      onToggle: setNotificationsEnabled,
    },
    {
      icon: 'moon-outline',
      title: 'Dark Mode',
      hasToggle: true,
      value: darkMode,
      onToggle: setDarkMode,
    },
    {
      icon: 'time-outline',
      title: 'Default Reminder',
      value: '24 hours before',
      hasArrow: true,
    },
    {
      icon: 'globe-outline',
      title: 'Timezone',
      value: user?.timezone || 'America/New_York',
      hasArrow: true,
    },
  ];

  const supportOptions = [
    {
      icon: 'help-circle-outline',
      title: 'Help & Support',
      hasArrow: true,
    },
    {
      icon: 'document-text-outline',
      title: 'Privacy Policy',
      hasArrow: true,
    },
    {
      icon: 'information-circle-outline',
      title: 'About',
      hasArrow: true,
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Profile</Text>
        
        {/* User Info */}
        <View style={styles.userSection}>
          <View style={styles.avatarContainer}>
            <Ionicons name="person-circle" size={80} color="#007AFF" />
          </View>
          <Text style={styles.userName}>{user?.displayName || 'Weekend Planner'}</Text>
          <Text style={styles.userEmail}>{user?.email || 'test@example.com'}</Text>
        </View>

        {/* Settings Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Settings</Text>
          {settingsOptions.map((option, index) => (
            <TouchableOpacity key={index} style={styles.optionRow}>
              <View style={styles.optionLeft}>
                <Ionicons name={option.icon as any} size={24} color="#007AFF" />
                <Text style={styles.optionText}>{option.title}</Text>
              </View>
              {option.hasToggle ? (
                <Switch
                  value={option.value}
                  onValueChange={option.onToggle}
                  trackColor={{ false: '#3A3A3C', true: '#007AFF' }}
                  thumbColor="#FFFFFF"
                />
              ) : (
                <View style={styles.optionRight}>
                  {option.value && (
                    <Text style={styles.optionValue}>{option.value}</Text>
                  )}
                  {option.hasArrow && (
                    <Ionicons name="chevron-forward" size={20} color="#3A3A3C" />
                  )}
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Support Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support</Text>
          {supportOptions.map((option, index) => (
            <TouchableOpacity key={index} style={styles.optionRow}>
              <View style={styles.optionLeft}>
                <Ionicons name={option.icon as any} size={24} color="#007AFF" />
                <Text style={styles.optionText}>{option.title}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#3A3A3C" />
            </TouchableOpacity>
          ))}
        </View>

        {/* Sign Out Button */}
        <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>

        {/* Version Info */}
        <Text style={styles.versionText}>Version 1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  scrollContent: {
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 30,
  },
  userSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  avatarContainer: {
    marginBottom: 15,
  },
  userName: {
    fontSize: 24,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    color: '#8E8E93',
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#8E8E93',
    marginBottom: 15,
    textTransform: 'uppercase',
  },
  optionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1C1C1E',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  optionText: {
    color: '#FFFFFF',
    fontSize: 16,
    marginLeft: 12,
  },
  optionRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionValue: {
    color: '#8E8E93',
    fontSize: 14,
    marginRight: 8,
  },
  signOutButton: {
    backgroundColor: '#FF3B30',
    borderRadius: 12,
    paddingVertical: 16,
    marginTop: 20,
    marginBottom: 30,
  },
  signOutText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  versionText: {
    color: '#3A3A3C',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
  },
});