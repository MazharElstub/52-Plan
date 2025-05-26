import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';

const { width } = Dimensions.get('window');

// Status dot component
const StatusDot = ({ status }: { status: 'free' | 'plans' | 'travel' }) => {
  const getColor = () => {
    switch (status) {
      case 'free': return '#00C851';
      case 'plans': return '#AA6C39';
      case 'travel': return '#FF4444';
      default: return '#00C851';
    }
  };

  return (
    <View style={[styles.statusDot, { backgroundColor: getColor() }]} />
  );
};

// Weekend status calculation
const getWeekendStatus = (events: any[], year: number, month: number, weekendNum: number) => {
  const weekendEvents = events.filter(
    event => event.year === year && event.month === month && event.weekendNumber === weekendNum
  );
  
  if (weekendEvents.length === 0) return 'free';
  if (weekendEvents.some(event => event.type === 'travel')) return 'travel';
  return 'plans';
};

// Get weekends for a month
const getWeekendsInMonth = (year: number, month: number) => {
  const weekends = [];
  const firstDay = new Date(year, month - 1, 1);
  let currentDate = new Date(firstDay);
  
  // Find first Saturday
  while (currentDate.getDay() !== 6) {
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  let weekendNumber = 1;
  while (currentDate.getMonth() === month - 1) {
    weekends.push({
      weekendNumber,
      startDate: new Date(currentDate),
    });
    currentDate.setDate(currentDate.getDate() + 7);
    weekendNumber++;
  }
  
  return weekends;
};

export default function Dashboard() {
  const events = useQuery(api.events.getDashboardEvents);
  
  if (!events) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.loadingText}>Loading...</Text>
      </SafeAreaView>
    );
  }

  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const months = [];
  
  // Generate 12 months starting from current month
  for (let i = 0; i < 12; i++) {
    const date = new Date(currentYear, currentDate.getMonth() + i, 1);
    months.push({
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      name: date.toLocaleString('default', { month: 'long' }),
    });
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Dashboard</Text>
        
        {/* Toggle buttons */}
        <View style={styles.toggleContainer}>
          <TouchableOpacity style={[styles.toggleButton, styles.activeToggle]}>
            <Text style={styles.toggleText}>12-Month View</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.toggleButton}>
            <Text style={styles.toggleTextInactive}>Upcoming</Text>
          </TouchableOpacity>
        </View>

        {/* Legend */}
        <View style={styles.legend}>
          <View style={styles.legendItem}>
            <StatusDot status="free" />
            <Text style={styles.legendText}>Free</Text>
          </View>
          <View style={styles.legendItem}>
            <StatusDot status="plans" />
            <Text style={styles.legendText}>Plans</Text>
          </View>
          <View style={styles.legendItem}>
            <StatusDot status="travel" />
            <Text style={styles.legendText}>Travel</Text>
          </View>
        </View>

        {/* Year headers and month grid */}
        <Text style={styles.yearHeader}>2025</Text>
        
        <View style={styles.monthsGrid}>
          {months.slice(0, 8).map((monthData) => {
            const weekends = getWeekendsInMonth(monthData.year, monthData.month);
            
            return (
              <View key={`${monthData.year}-${monthData.month}`} style={styles.monthCard}>
                <Text style={styles.monthName}>{monthData.name}</Text>
                <View style={styles.dotsContainer}>
                  {weekends.map((weekend) => {
                    const status = getWeekendStatus(events, monthData.year, monthData.month, weekend.weekendNumber);
                    return (
                      <StatusDot
                        key={weekend.weekendNumber}
                        status={status as 'free' | 'plans' | 'travel'}
                      />
                    );
                  })}
                </View>
              </View>
            );
          })}
        </View>

        <Text style={styles.yearHeader}>2026</Text>
        
        <View style={styles.monthsGrid}>
          {months.slice(8).map((monthData) => {
            const weekends = getWeekendsInMonth(monthData.year, monthData.month);
            
            return (
              <View key={`${monthData.year}-${monthData.month}`} style={styles.monthCard}>
                <Text style={styles.monthName}>{monthData.name}</Text>
                <View style={styles.dotsContainer}>
                  {weekends.map((weekend) => {
                    const status = getWeekendStatus(events, monthData.year, monthData.month, weekend.weekendNumber);
                    return (
                      <StatusDot
                        key={weekend.weekendNumber}
                        status={status as 'free' | 'plans' | 'travel'}
                      />
                    );
                  })}
                </View>
              </View>
            );
          })}
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
    marginBottom: 20,
  },
  loadingText: {
    fontSize: 18,
    color: '#FFFFFF',
    textAlign: 'center',
    marginTop: 50,
  },
  toggleContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: '#2C2C2E',
    borderRadius: 8,
    marginHorizontal: 4,
  },
  activeToggle: {
    backgroundColor: '#3A3A3C',
  },
  toggleText: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontWeight: '600',
  },
  toggleTextInactive: {
    color: '#8E8E93',
    textAlign: 'center',
    fontWeight: '600',
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: 30,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  legendText: {
    color: '#FFFFFF',
    marginLeft: 8,
    fontSize: 14,
  },
  yearHeader: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 15,
    marginTop: 10,
  },
  monthsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  monthCard: {
    width: (width - 60) / 2,
    backgroundColor: '#2C2C2E',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  monthName: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  dotsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
    marginBottom: 4,
  },
});