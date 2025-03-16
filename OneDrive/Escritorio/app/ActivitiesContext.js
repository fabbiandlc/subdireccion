import React, {
  createContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ActivitiesContext = createContext();

function ActivitiesProvider({ children }) {
  const [activities, setActivities] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);

  useEffect(() => {
    const loadActivities = async () => {
      try {
        const storedActivities = await AsyncStorage.getItem("activities");
        if (storedActivities) {
          const parsedActivities = JSON.parse(storedActivities);
          if (Array.isArray(parsedActivities)) {
            setActivities(parsedActivities);
          }
        }
      } catch (error) {
        console.error("Error al cargar actividades:", error);
      }
    };
    loadActivities();
  }, []);

  const saveActivities = useCallback(async (updatedActivities) => {
    try {
      await AsyncStorage.setItem(
        "activities",
        JSON.stringify(updatedActivities)
      );
    } catch (error) {
      console.error("Error al guardar actividades:", error);
    }
  }, []);

  const handleSetActivities = useCallback(
    (newActivities) => {
      if (typeof newActivities === "function") {
        setActivities((currentActivities) => {
          const updatedActivities = newActivities(currentActivities);
          saveActivities(updatedActivities);
          return updatedActivities;
        });
      } else if (Array.isArray(newActivities)) {
        setActivities(newActivities);
        saveActivities(newActivities);
      }
    },
    [saveActivities]
  );

  const activitiesForDay = useMemo(() => {
    if (!selectedDate) return [];

    return activities.filter((activity) => {
      // Normalizar la fecha a YYYY-MM-DD sin influencia de zona horaria
      const activityDate = new Date(activity.activityDate);
      const year = activityDate.getFullYear();
      const month = String(activityDate.getMonth() + 1).padStart(2, "0"); // Meses son 0-indexados
      const day = String(activityDate.getDate()).padStart(2, "0");
      const normalizedDate = `${year}-${month}-${day}`;
      return normalizedDate === selectedDate;
    });
  }, [activities, selectedDate]);

  return (
    <ActivitiesContext.Provider
      value={{
        activities,
        setActivities: handleSetActivities,
        selectedDate,
        setSelectedDate,
        activitiesForDay,
      }}
    >
      {children}
    </ActivitiesContext.Provider>
  );
}

export { ActivitiesContext, ActivitiesProvider };