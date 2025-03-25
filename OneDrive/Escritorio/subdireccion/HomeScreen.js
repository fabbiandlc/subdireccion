import React, { useState, useContext, useCallback, memo } from "react";
import {
  ScrollView,
  Modal,
  Text,
  TouchableOpacity,
  View,
  Alert,
  FlatList,
} from "react-native";
import { ActivitiesContext } from "./ActivitiesContext";
import { useDataContext } from "./DataContext";
import ActivityForm from "./ActivityForm";
import { styles } from "./styles"; // Importing from your styles.js
import { v4 as uuidv4 } from "uuid";

const ActionButton = memo(({ onPress, style, children }) => (
  <TouchableOpacity style={style} onPress={onPress}>
    <Text style={styles.buttonText}>{children}</Text>
  </TouchableOpacity>
));

const ActivitySummary = ({ activity, onClose }) => {
  const notes = Array.isArray(activity.notes) ? activity.notes : [];

  return (
    <View style={styles.modalContent}>
      <Text style={styles.summaryTitle}>{activity.activityName}</Text>
      <Text style={styles.summaryDateTime}>
        Fecha: {new Date(activity.activityDate).toLocaleDateString("es-MX")}
      </Text>
      <Text style={styles.summaryDateTime}>
        Hora:{" "}
        {new Date(activity.activityTime).toLocaleTimeString("es-MX", {
          hour: "2-digit",
          minute: "2-digit",
        })}
      </Text>
      <Text style={styles.sectionTitle}>Notas:</Text>
      {notes.length > 0 ? (
        <FlatList
          data={notes}
          renderItem={({ item }) => (
            <View style={styles.summaryNoteContainer}>
              <Text style={styles.summaryNoteText}>{item.content || item}</Text>
            </View>
          )}
          keyExtractor={(item, index) => index.toString()}
        />
      ) : (
        <Text style={styles.summaryNoteText}>
          No hay notas disponibles.
        </Text>
      )}
      <TouchableOpacity style={styles.summaryCloseButton} onPress={onClose}>
        <Text style={styles.buttonText}>Cerrar</Text>
      </TouchableOpacity>
    </View>
  );
};

const ActivityCard = memo(
  ({ activity, onEdit, onDelete, onViewSummary, index }) => {
    const listItems = Array.isArray(activity.notes)
      ? activity.notes.filter((note) => note.content && note.content.trim() !== "")
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
          <Text style={styles.cardText}>Notas: {listItems.length}</Text>
        )}
        <View style={styles.cardButtons}>
          <ActionButton
            style={styles.viewButton}
            onPress={() => onViewSummary(index)}
          >
            Resumen
          </ActionButton>
          <ActionButton
            style={styles.editButton}
            onPress={() => onEdit(index)}
          >
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

const HomeScreen = ({ userRole }) => {
  const { activities, setActivities } = useContext(ActivitiesContext);
  const { deleteItem } = useDataContext();
  const [modalVisible, setModalVisible] = useState(false);
  const [summaryModalVisible, setSummaryModalVisible] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);
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
          { text: "Cancelar", style: "cancel" },
          {
            text: "Eliminar",
            onPress: async () => {
              try {
                const activityId = activities[index].id;
                await deleteItem("Activities", activityId);
                setActivities((prev) => {
                  const newActivities = [...prev];
                  newActivities.splice(index, 1);
                  return newActivities;
                });
              } catch (error) {
                console.error("Error al eliminar la actividad:", error);
                Alert.alert("Error", "No se pudo eliminar la actividad");
              }
            },
          },
        ]
      );
    },
    [activities, deleteItem, setActivities]
  );

  const handleViewSummary = useCallback(
    (index) => {
      setSelectedActivity({ ...activities[index] });
      setSummaryModalVisible(true);
    },
    [activities]
  );

  const handleModalClose = useCallback(() => {
    setModalVisible(false);
    setEditIndex(null);
  }, []);

  const handleAddActivity = useCallback(() => {
    setEditIndex(null);
    setModalVisible(true);
  }, []);

  const handleFormSubmit = useCallback(
    (activityData) => {
      const newActivity = {
        id: editIndex !== null ? activities[editIndex].id : uuidv4(),
        activityName: activityData.activityName,
        activityDate: activityData.activityDate,
        activityTime: activityData.activityTime,
        notes: Array.isArray(activityData.notes) ? activityData.notes : [],
      };
      if (editIndex !== null) {
        setActivities((prev) =>
          prev.map((act, idx) => (idx === editIndex ? newActivity : act))
        );
      } else {
        setActivities((prev) => [...prev, newActivity]);
      }
      setModalVisible(false);
      setEditIndex(null);
    },
    [editIndex, activities, setActivities]
  );

  return (
    <View style={styles.container}>
      <ScrollView style={styles.activitiesContainer}>
        {activities.map((activity, index) => (
          <ActivityCard
            key={`activity-${activity.id}`}
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
        <View style={styles.modalContainer}>
          <ActivityForm
            setModalVisible={setModalVisible}
            editIndex={editIndex}
            setEditIndex={setEditIndex}
            onSubmit={handleFormSubmit}
            initialData={editIndex !== null ? activities[editIndex] : undefined}
          />
        </View>
      </Modal>
      <Modal
        animationType="slide"
        transparent={true}
        visible={summaryModalVisible}
        onRequestClose={() => setSummaryModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          {selectedActivity && (
            <ActivitySummary
              activity={selectedActivity}
              onClose={() => setSummaryModalVisible(false)}
            />
          )}
        </View>
      </Modal>
    </View>
  );
};

export default memo(HomeScreen);