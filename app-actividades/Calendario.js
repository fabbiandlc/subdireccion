import React, { useContext, useMemo, memo, useCallback } from "react";
import { View, Text, ScrollView } from "react-native";
import { Calendar } from "react-native-calendars";
import { ActivitiesContext } from "./ActivitiesContext";
import { styles } from "./styles";

const CALENDAR_THEME = {
  calendarBackground: "#fff",
  todayTextColor: "#007BFF",
  dayTextColor: "#2d4150",
  textDisabledColor: "#d9e1e8",
  monthTextColor: "#007BFF",
  arrowColor: "#007BFF",
  dotColor: "#007BFF",
  selectedDayBackgroundColor: "#E8E8E8",
  selectedDayTextColor: "#2d4150",
};

const ActivityItem = memo(({ activity }) => (
  <View style={styles.activityItem}>
    <Text style={styles.activityName}>{activity.activityName}</Text>
    <Text style={styles.activityTime}>
      {new Date(activity.activityTime).toLocaleTimeString("es-MX", {
        hour: "2-digit",
        minute: "2-digit",
      })}
    </Text>
  </View>
));

const ActivitiesList = memo(({ activities, date }) => {
  const formatDate = useCallback((dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-MX");
  }, []);

  return (
    <View style={styles.activitiesContainer}>
      <Text style={styles.activitiesTitle}>
        Actividades para {formatDate(date)}:
      </Text>
      <ScrollView style={styles.activitiesList}>
        {activities.map((activity) => (
          <ActivityItem key={activity.id} activity={activity} />
        ))}
      </ScrollView>
    </View>
  );
});

const Calendario = () => {
  const { activities, selectedDate, setSelectedDate, activitiesForDay } =
    useContext(ActivitiesContext);

  const markedDates = useMemo(() => {
    const dates = {};
    activities.forEach(activity => {
      const date = new Date(activity.activityDate);
      date.setHours(12);
      const dateString = date.toISOString().split('T')[0];
      dates[dateString] = {
        marked: true,
        dotColor: "#007BFF",
        selected: dateString === selectedDate,
        selectedColor: "#E8E8E8",
      };
    });
    return dates;
  }, [activities, selectedDate]);

  const handleDayPress = useCallback((day) => {
    setSelectedDate(day.dateString);
  }, [setSelectedDate]);

  return (
    <View style={styles.container}>
      <Calendar
        markedDates={markedDates}
        markingType="dot"
        onDayPress={handleDayPress}
        theme={CALENDAR_THEME}
      />
      {selectedDate && activitiesForDay.length > 0 && (
        <ActivitiesList activities={activitiesForDay} date={selectedDate} />
      )}
    </View>
  );
};

export default memo(Calendario);