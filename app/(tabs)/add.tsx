import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  Switch,
  Alert,
  ScrollView,
} from 'react-native';
import { useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { router } from 'expo-router';

export default function AddEvent() {
  const createEvent = useMutation(api.events.createEvent);
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<'plan' | 'travel'>('plan');
  const [includesSaturday, setIncludesSaturday] = useState(true);
  const [includesSunday, setIncludesSunday] = useState(true);
  const [isAllDay, setIsAllDay] = useState(true);
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('17:00');
  const [selectedDate, setSelectedDate] = useState(new Date());

  const handleSubmit = async () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Please enter a title for your event');
      return;
    }

    if (!includesSaturday && !includesSunday) {
      Alert.alert('Error', 'Please select at least one day (Saturday or Sunday)');
      return;
    }

    try {
      // Calculate start and end dates based on selected weekend
      const startDate = new Date(selectedDate);
      const endDate = new Date(selectedDate);
      
      // Adjust to weekend dates
      const dayOfWeek = startDate.getDay();
      const daysToSaturday = (6 - dayOfWeek) % 7;
      startDate.setDate(startDate.getDate() + daysToSaturday);
      
      if (includesSunday) {
        endDate.setDate(startDate.getDate() + 1);
      } else {
        endDate.setDate(startDate.getDate());
      }

      await createEvent({
        title: title.trim(),
        description: description.trim() || undefined,
        type,
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0],
        includesSaturday,
        includesSunday,
        startTime: isAllDay ? undefined : startTime,
        endTime: isAllDay ? undefined : endTime,
        isAllDay,
      });

      Alert.alert('Success', 'Event created successfully!', [
        { text: 'OK', onPress: () => router.push('/dashboard') }
      ]);
      
      // Reset form
      setTitle('');
      setDescription('');
      setType('plan');
      setIncludesSaturday(true);
      setIncludesSunday(true);
      setIsAllDay(true);
      
    } catch (error) {
      Alert.alert('Error', 'Failed to create event. Please try again.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>New Event</Text>
        <Text style={styles.subtitle}>Plan a New Weekend Event</Text>

        <View style={styles.form}>
          <Text style={styles.label}>Event Title</Text>
          <TextInput
            style={styles.input}
            value={title}
            onChangeText={setTitle}
            placeholder="Enter event title..."
            placeholderTextColor="#8E8E93"
          />

          <Text style={styles.label}>Description (Optional)</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={description}
            onChangeText={setDescription}
            placeholder="Add more details..."
            placeholderTextColor="#8E8E93"
            multiline
            numberOfLines={3}
          />

          <Text style={styles.label}>Event Type</Text>
          <View style={styles.typeContainer}>
            <TouchableOpacity
              style={[styles.typeButton, type === 'plan' && styles.activeType]}
              onPress={() => setType('plan')}
            >
              <Text style={[styles.typeText, type === 'plan' && styles.activeTypeText]}>
                Plans
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.typeButton, type === 'travel' && styles.activeType]}
              onPress={() => setType('travel')}
            >
              <Text style={[styles.typeText, type === 'travel' && styles.activeTypeText]}>
                Travel
              </Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.label}>Days</Text>
          <View style={styles.dayContainer}>
            <View style={styles.dayRow}>
              <Text style={styles.dayText}>Saturday</Text>
              <Switch
                value={includesSaturday}
                onValueChange={setIncludesSaturday}
                trackColor={{ false: '#3A3A3C', true: '#00C851' }}
                thumbColor="#FFFFFF"
              />
            </View>
            <View style={styles.dayRow}>
              <Text style={styles.dayText}>Sunday</Text>
              <Switch
                value={includesSunday}
                onValueChange={setIncludesSunday}
                trackColor={{ false: '#3A3A3C', true: '#00C851' }}
                thumbColor="#FFFFFF"
              />
            </View>
          </View>

          <View style={styles.dayRow}>
            <Text style={styles.dayText}>All Day Event</Text>
            <Switch
              value={isAllDay}
              onValueChange={setIsAllDay}
              trackColor={{ false: '#3A3A3C', true: '#007AFF' }}
              thumbColor="#FFFFFF"
            />
          </View>

          {!isAllDay && (
            <View style={styles.timeContainer}>
              <View style={styles.timeInput}>
                <Text style={styles.label}>Start Time</Text>
                <TextInput
                  style={styles.input}
                  value={startTime}
                  onChangeText={setStartTime}
                  placeholder="09:00"
                  placeholderTextColor="#8E8E93"
                />
              </View>
              <View style={styles.timeInput}>
                <Text style={styles.label}>End Time</Text>
                <TextInput
                  style={styles.input}
                  value={endTime}
                  onChangeText={setEndTime}
                  placeholder="17:00"
                  placeholderTextColor="#8E8E93"
                />
              </View>
            </View>
          )}

          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitText}>+ Add New Event</Text>
          </TouchableOpacity>
        </View>
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
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: '#8E8E93',
    marginBottom: 30,
    textAlign: 'center',
  },
  form: {
    flex: 1,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 8,
    marginTop: 20,
  },
  input: {
    backgroundColor: '#2C2C2E',
    borderRadius: 8,
    padding: 16,
    color: '#FFFFFF',
    fontSize: 16,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  typeContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  typeButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: '#2C2C2E',
    borderRadius: 8,
    marginHorizontal: 4,
  },
  activeType: {
    backgroundColor: '#007AFF',
  },
  typeText: {
    color: '#8E8E93',
    textAlign: 'center',
    fontWeight: '600',
  },
  activeTypeText: {
    color: '#FFFFFF',
  },
  dayContainer: {
    backgroundColor: '#2C2C2E',
    borderRadius: 8,
    padding: 16,
    marginBottom: 10,
  },
  dayRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  dayText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  timeInput: {
    flex: 1,
    marginHorizontal: 4,
  },
  submitButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    paddingVertical: 16,
    marginTop: 30,
    marginBottom: 40,
  },
  submitText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
});