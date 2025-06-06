import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export interface Event {
  title: string;
  description?: string;
  type: 'plan' | 'travel';
  includesSaturday: boolean;
  includesSunday: boolean;
  startTime?: string;
  endTime?: string;
  isAllDay: boolean;
}

export default function EventCard({ event }: { event: Event }) {
  return (
    <View style={styles.eventCard}>
      <View style={styles.eventHeader}>
        <Text style={styles.eventTitle}>{event.title}</Text>
        <View style={[styles.eventType, event.type === 'travel' && styles.travelType]}>
          <Text style={styles.eventTypeText}>{event.type}</Text>
        </View>
      </View>
      {event.description && (
        <Text style={styles.eventDescription}>{event.description}</Text>
      )}
      <View style={styles.eventMeta}>
        <Text style={styles.eventMetaText}>
          {event.includesSaturday && event.includesSunday
            ? 'Weekend'
            : event.includesSaturday
            ? 'Saturday'
            : 'Sunday'}
        </Text>
        {!event.isAllDay && (
          <Text style={[styles.eventMetaText, { marginLeft: 12 }]}> 
            {event.startTime} - {event.endTime}
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  eventCard: {
    backgroundColor: '#1C1C1E',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#2C2C2E',
  },
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    flex: 1,
  },
  eventType: {
    backgroundColor: '#3A3A3C',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 12,
  },
  travelType: {
    backgroundColor: '#FF4444',
  },
  eventTypeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  eventDescription: {
    color: '#8E8E93',
    fontSize: 14,
    marginBottom: 12,
  },
  eventMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  eventMetaText: {
    color: '#8E8E93',
    fontSize: 14,
  },
});
