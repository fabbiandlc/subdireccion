import React, { useState, useContext, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { ActivitiesContext } from "./ActivitiesContext";
import { styles } from "./styles";

function ActivityForm({ setModalVisible, editIndex, setEditIndex }) {
  const { activities, setActivities } = useContext(ActivitiesContext);
  const [activityName, setActivityName] = useState("");
  const [activityDate, setActivityDate] = useState(new Date());
  const [activityTime, setActivityTime] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [notes, setNotes] = useState([]);
  const scrollViewRef = useRef(null);

  useEffect(() => {
    if (editIndex !== null && activities[editIndex]) {
      const activity = activities[editIndex];
      setActivityName(activity.activityName || "");
      setActivityDate(new Date(activity.activityDate));
      setActivityTime(new Date(activity.activityTime));
      setNotes(activity.notes || []);
    } else if (notes.length === 0) {
      setNotes([{ id: Date.now(), content: "" }]);
    }
  }, [editIndex, activities]);

  const handleNoteSubmit = (id) => {
    setNotes((prevNotes) => {
      const currentIndex = prevNotes.findIndex((note) => note.id === id);
      if (currentIndex !== -1) {
        const updatedNotes = [...prevNotes];
        updatedNotes.splice(currentIndex + 1, 0, {
          id: Date.now(),
          content: "",
        });
        return updatedNotes;
      }
      return prevNotes;
    });
    scrollToBottom();
  };

  const updateNote = (id, content) => {
    setNotes((prevNotes) =>
      prevNotes.map((note) => (note.id === id ? { ...note, content } : note))
    );
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      if (scrollViewRef.current) {
        scrollViewRef.current.scrollToEnd({ animated: true });
      }
    }, 0);
  };

  const handleSave = () => {
    if (!activityName.trim()) {
      alert("Por favor ingrese un nombre para la actividad");
      return;
    }

    const filteredNotes = notes.filter((note) => note.content.trim() !== "");

    const newActivity = {
      id: editIndex !== null ? activities[editIndex].id : Date.now(),
      activityName: activityName.trim(),
      activityDate: activityDate.toISOString(),
      activityTime: activityTime.toISOString(),
      notes: filteredNotes,
      createdAt:
        editIndex !== null
          ? activities[editIndex].createdAt
          : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (editIndex !== null) {
      const updatedActivities = [...activities];
      updatedActivities[editIndex] = newActivity;
      setActivities(updatedActivities);
    } else {
      setActivities([...activities, newActivity]);
    }

    setModalVisible(false);
    setEditIndex(null);
  };

  const renderNoteItem = (note) => (
    <View key={note.id} style={styles.noteContainer}>
      <TextInput
        style={styles.noteInput}
        multiline
        placeholder="Agregar nota..."
        value={note.content}
        onChangeText={(content) => updateNote(note.id, content)}
        onSubmitEditing={() => handleNoteSubmit(note.id)}
      />
    </View>
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.modalContainer}
    >
      <View style={styles.modalContent}>
        <ScrollView
          ref={scrollViewRef}
          contentContainerStyle={{ flexGrow: 1 }}
          style={{ maxHeight: 400 }}
          showsVerticalScrollIndicator={false}
        >
          <TextInput
            style={styles.input}
            placeholder="Nombre de la actividad"
            value={activityName}
            onChangeText={setActivityName}
          />
          <TouchableOpacity
            onPress={() => setShowDatePicker(true)}
            style={styles.input}
          >
            <Text>{activityDate.toLocaleDateString()}</Text>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={activityDate}
              mode="date"
              display="default"
              onChange={(event, selectedDate) => {
                setShowDatePicker(false);
                if (selectedDate) setActivityDate(selectedDate);
              }}
            />
          )}
          <TouchableOpacity
            onPress={() => setShowTimePicker(true)}
            style={styles.input}
          >
            <Text>
              {activityTime.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Text>
          </TouchableOpacity>
          {showTimePicker && (
            <DateTimePicker
              value={activityTime}
              mode="time"
              display="default"
              onChange={(event, selectedTime) => {
                setShowTimePicker(false);
                if (selectedTime) setActivityTime(selectedTime);
              }}
            />
          )}
          <View style={styles.notesSection}>
            <Text style={styles.sectionTitle}>Notas</Text>
            {notes.map((note) => renderNoteItem(note))}
          </View>
        </ScrollView>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.buttonText}>Guardar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => {
              setModalVisible(false);
              setEditIndex(null);
            }}
          >
            <Text style={styles.buttonText}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

export default ActivityForm;