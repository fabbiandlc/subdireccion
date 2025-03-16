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

  // Cargar actividades desde AsyncStorage al iniciar
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

  // Guardar actividades en AsyncStorage
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
      // Si es una función, ejecutarla con el estado actual
      if (typeof newActivities === "function") {
        setActivities((currentActivities) => {
          const updatedActivities = newActivities(currentActivities);
          saveActivities(updatedActivities);
          return updatedActivities;
        });
      } else if (Array.isArray(newActivities)) {
        // Si es un array, actualizar directamente
        setActivities(newActivities);
        saveActivities(newActivities);
      }
    },
    [saveActivities]
  );

  const activitiesForDay = useMemo(() => {
    if (!selectedDate) return [];

    return activities.filter((activity) => {
      const activityDate = new Date(activity.activityDate);
      activityDate.setHours(12);
      const dateString = activityDate.toISOString().split("T")[0];
      return dateString === selectedDate;
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
