import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { Ionicons } from '@expo/vector-icons';

const EventCard = ({ event }: { event: any }) => (
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
      <Ionicons name="calendar-outline" size={14} color="#8E8E93" />
      <Text style={styles.eventMetaText}>
        {event.includesSaturday && event.includesSunday ? 'Weekend' : 
         event.includesSaturday ? 'Saturday' : 'Sunday'}
      </Text>
      {!event.isAllDay && (
        <>
          <Ionicons name="time-outline" size={14} color="#8E8E93" style={{ marginLeft: 12 }} />
          <Text style={styles.eventMetaText}>
            {event.startTime} - {event.endTime}
          </Text>
        </>
      )}
    </View>
  </View>
);

const MonthSection = ({ year, month, events }: { year: number; month: number; events: any[] }) => {
  const monthName = new Date(year, month - 1).toLocaleString('default', { month: 'long', year: 'numeric' });
  const monthEvents = events.filter(e => e.year === year && e.month === month);
  
  if (monthEvents.length === 0) return null;
  
  return (
    <View style={styles.monthSection}>
      <Text style={styles.monthTitle}>{monthName}</Text>
      {monthEvents.map((event, index) => (
        <EventCard key={event._id || index} event={event} />
      ))}
    </View>
  );
};

export default function Calendar() {
  const events = useQuery(api.events.getDashboardEvents);
  
  if (!events) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.loadingText}>Loading calendar...</Text>
      </SafeAreaView>
    );
  }

  // Group events by year and month
  const currentDate = new Date();
  const months = [];
  
  for (let i = 0; i < 12; i++) {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth() + i, 1);
    months.push({
      year: date.getFullYear(),
      month: date.getMonth() + 1,
    });
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Calendar</Text>
        <Text style={styles.subtitle}>Your Weekend Plans</Text>
        
        {events.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="calendar-outline" size={64} color="#3A3A3C" />
            <Text style={styles.emptyText}>No events scheduled</Text>
            <Text style={styles.emptySubtext}>Add your first weekend plan!</Text>
          </View>
        ) : (
          months.map(({ year, month }) => (
            <MonthSection 
              key={`${year}-${month}`} 
              year={year} 
              month={month} 
              events={events} 
            />
          ))
        )}
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
  },
  loadingText: {
    fontSize: 18,
    color: '#FFFFFF',
    textAlign: 'center',
    marginTop: 50,
  },
  monthSection: {
    marginBottom: 30,
  },
  monthTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 15,
  },
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
    marginLeft: 4,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 100,
  },
  emptyText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '600',
    marginTop: 20,
  },
  emptySubtext: {
    color: '#8E8E93',
    fontSize: 16,
    marginTop: 8,
  },
});