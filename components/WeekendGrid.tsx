import React from 'react';
import { View, StyleSheet } from 'react-native';
import StatusDot, { Status } from './StatusDot';

interface Event {
  year: number;
  month: number;
  weekendNumber: number;
  type: 'plan' | 'travel';
}

interface Props {
  events: Event[];
  year: number;
  month: number;
}

function getWeekendStatus(events: Event[], year: number, month: number, weekendNum: number): Status {
  const weekendEvents = events.filter(
    e => e.year === year && e.month === month && e.weekendNumber === weekendNum
  );
  if (weekendEvents.length === 0) return 'free';
  if (weekendEvents.some(e => e.type === 'travel')) return 'travel';
  return 'plans';
}

function getWeekendsInMonth(year: number, month: number) {
  const weekends = [] as { weekendNumber: number; startDate: Date }[];
  const firstDay = new Date(year, month - 1, 1);
  let currentDate = new Date(firstDay);
  while (currentDate.getDay() !== 6) {
    currentDate.setDate(currentDate.getDate() + 1);
  }
  let weekendNumber = 1;
  while (currentDate.getMonth() === month - 1) {
    weekends.push({ weekendNumber, startDate: new Date(currentDate) });
    currentDate.setDate(currentDate.getDate() + 7);
    weekendNumber++;
  }
  return weekends;
}

export default function WeekendGrid({ events, year, month }: Props) {
  const weekends = getWeekendsInMonth(year, month);
  return (
    <View style={styles.container}>
      {weekends.map(weekend => {
        const status = getWeekendStatus(events, year, month, weekend.weekendNumber);
        return <StatusDot key={weekend.weekendNumber} status={status} />;
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
});
