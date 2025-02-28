import React, { useState, useContext, useCallback, memo } from "react";
import {
  ScrollView,
  Modal,
  Text,
  TouchableOpacity,
  View,
  Alert,
} from "react-native";
import Checkbox from "expo-checkbox";
import { ActivitiesContext } from "./ActivitiesContext";
import ActivityForm from "./ActivityForm";
import { styles } from "./styles";

// Componente para el botón de acción
const ActionButton = memo(({ onPress, style, children }) => (
  <TouchableOpacity style={style} onPress={onPress}>
    <Text style={styles.buttonText}>{children}</Text>
  </TouchableOpacity>
));

// Componente para el resumen de la actividad
const ActivitySummary = ({ activity, onClose, onUpdateActivity }) => {
  // Add local state to track changes immediately
  const [localActivity, setLocalActivity] = useState(activity);

  const toggleNoteCompletion = (noteId) => {
    const updatedNotes = localActivity.notes.map((note) => {
      if (note.id === noteId) {
        return { ...note, completed: !note.completed };
      }
      return note;
    });

    // Update both local and parent state
    const updatedActivity = {
      ...localActivity,
      notes: updatedNotes,
    };
    setLocalActivity(updatedActivity);
    onUpdateActivity(updatedActivity);
  };

  const renderNote = (note) => {
    switch (note.type) {
      case "text":
        return (
          <View key={note.id} style={styles.summaryNoteContainer}>
            <Text style={styles.summaryNoteText}>{note.content}</Text>
          </View>
        );
      case "checklist":
        return (
          <TouchableOpacity
            key={note.id}
            style={styles.summaryChecklistItem}
            onPress={() => toggleNoteCompletion(note.id)}
          >
            <Text style={styles.checkboxIndicator}>
              {note.completed ? "✓" : "○"}
            </Text>
            <Text
              style={[
                styles.summaryChecklistText,
                note.completed && styles.completedText,
              ]}
            >
              {note.content}
            </Text>
          </TouchableOpacity>
        );
      default:
        return null;
    }
  };

  const textNotes = localActivity.notes.filter((note) => note.type === "text");
  const checklistNotes = localActivity.notes.filter(
    (note) => note.type === "checklist"
  );

  return (
    <View style={styles.modalContainer}>
      <View style={styles.modalContent}>
        <Text style={styles.summaryTitle}>{localActivity.activityName}</Text>
        <View style={styles.summaryDateTimeContainer}>
          <Text style={styles.summaryLabel}>Fecha y Hora</Text>
          <Text style={styles.summaryDateTime}>
            {new Date(localActivity.activityDate).toLocaleDateString()} -{" "}
            {new Date(localActivity.activityTime).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Text>
        </View>
        <ScrollView
          style={styles.summaryScrollView}
          showsVerticalScrollIndicator={false}
        >
          {textNotes.length > 0 && (
            <View style={styles.summarySection}>
              <Text style={styles.summaryLabel}>Notas</Text>
              {textNotes.map((note) => renderNote(note))}
            </View>
          )}
          {checklistNotes.length > 0 && (
            <View style={styles.summarySection}>
              <Text style={styles.summaryLabel}>Lista de Tareas</Text>
              {checklistNotes.map((note) => renderNote(note))}
            </View>
          )}
        </ScrollView>
        <TouchableOpacity style={styles.summaryCloseButton} onPress={onClose}>
          <Text style={styles.buttonText}>Cerrar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// Componente para la tarjeta de actividad
const ActivityCard = memo(
  ({ activity, onEdit, onDelete, onViewSummary, index }) => {
    // Filtrar items de lista vacíos
    const listItems = Array.isArray(activity.listItems)
      ? activity.listItems.filter((item) => item.text.trim() !== "")
      : [];

    return (
      <View style={styles.card}>
        <Text style={styles.cardTitle}>{activity.activityName}</Text>
        <Text style={styles.cardText}>
          Fecha: {new Date(activity.activityDate).toLocaleDateString("es-MX")}
        </Text>
        <Text style={styles.cardText}>
          Hora:{" "}
          {new Date(activity.activityTime).toLocaleTimeString("es-MX", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </Text>
        {listItems.length > 0 && (
          <Text style={styles.cardText}>
            Items en la lista: {listItems.length}
          </Text>
        )}
        <View style={styles.cardButtons}>
          <ActionButton
            style={styles.viewButton}
            onPress={() => onViewSummary(index)}
          >
            Resumen
          </ActionButton>
          <ActionButton style={styles.editButton} onPress={() => onEdit(index)}>
            Editar
          </ActionButton>
          <ActionButton
            style={styles.deleteButton}
            onPress={() => onDelete(index)}
          >
            Eliminar
          </ActionButton>
        </View>
      </View>
    );
  }
);

const HomeScreen = () => {
  const { activities, setActivities } = useContext(ActivitiesContext);
  const [modalVisible, setModalVisible] = useState(false);
  const [summaryModalVisible, setSummaryModalVisible] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [editIndex, setEditIndex] = useState(null);

  const handleEdit = useCallback((index) => {
    setEditIndex(index);
    setModalVisible(true);
  }, []);

  const handleDelete = useCallback(
    (index) => {
      Alert.alert(
        "Eliminar Actividad",
        "¿Estás seguro de que deseas eliminar esta actividad?",
        [
          {
            text: "Cancelar",
            style: "cancel",
          },
          {
            text: "Eliminar",
            onPress: () => {
              const updatedActivities = activities.filter(
                (_, i) => i !== index
              );
              setActivities(updatedActivities);
            },
          },
        ]
      );
    },
    [activities]
  );
  const handleViewSummary = useCallback(
    (index) => {
      setSelectedActivity({ ...activities[index] }); // Clonar objeto para forzar actualización
      setSelectedIndex(index);
      setSummaryModalVisible(true);
    },
    [activities]
  );

  const handleUpdateActivity = useCallback(
    (updatedActivity) => {
      console.log(
        "Inicio de handleUpdateActivity - prevActivities:",
        activities
      ); // Depuración inicial
      setActivities((prev) => {
        console.log("Dentro de setActivities - prev:", prev); // Depuración dentro de setActivities

        if (typeof prev === "function") {
          console.error("Se pasó una función en lugar de un array:", prev);
          return prev;
        }

        if (!Array.isArray(prev)) {
          console.error("Estado de actividades inválido:", prev);
          return prev;
        }

        const newActivities = [...prev];
        newActivities[selectedIndex] = updatedActivity;

        if (!Array.isArray(newActivities)) {
          console.error("Error al actualizar actividades:", newActivities);
          return prev;
        }

        console.log("Actividades después de actualizar:", newActivities); // Depuración final
        return newActivities;
      });
    },
    [selectedIndex, activities] // Asegúrate de incluir `activities` como dependencia
  );

  const handleModalClose = useCallback(() => {
    setModalVisible(false);
    setEditIndex(null);
  }, []);

  const handleAddActivity = useCallback(() => {
    setEditIndex(null);
    setModalVisible(true);
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView style={styles.activitiesContainer}>
        {activities.map((activity, index) => (
          <ActivityCard
            key={`activity-${index}`}
            activity={activity}
            index={index}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onViewSummary={handleViewSummary}
          />
        ))}
      </ScrollView>
      <View style={styles.addButtonContainer}>
        <ActionButton style={styles.addButton} onPress={handleAddActivity}>
          +
        </ActionButton>
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={handleModalClose}
      >
        <ActivityForm
          setModalVisible={setModalVisible}
          editIndex={editIndex}
          setEditIndex={setEditIndex}
        />
      </Modal>
      <Modal
        animationType="slide"
        transparent={true}
        visible={summaryModalVisible}
        onRequestClose={() => setSummaryModalVisible(false)}
      >
        {selectedActivity && (
          <ActivitySummary
            activity={selectedActivity}
            onClose={() => setSummaryModalVisible(false)}
            onUpdateActivity={handleUpdateActivity}
          />
        )}
      </Modal>
    </View>
  );
};

export default memo(HomeScreen);
