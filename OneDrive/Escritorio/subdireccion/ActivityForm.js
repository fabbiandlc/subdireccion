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

const ActivityForm = ({ setModalVisible, editIndex, setEditIndex, onSubmit, initialData }) => {
  const { activities } = useContext(ActivitiesContext);
  const [activityName, setActivityName] = useState(initialData?.activityName || "");
  const [activityDate, setActivityDate] = useState(
    initialData ? new Date(initialData.activityDate) : new Date()
  );
  const [activityTime, setActivityTime] = useState(
    initialData ? new Date(initialData.activityTime) : new Date()
  );
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [notes, setNotes] = useState(
    Array.isArray(initialData?.notes) && initialData.notes.length > 0 
      ? initialData.notes 
      : [{ id: Date.now(), content: "" }]
  );
  const scrollViewRef = useRef(null);

  useEffect(() => {
    if (editIndex !== null && activities[editIndex]) {
      const activity = activities[editIndex];
      setActivityName(activity.activityName || "");
      setActivityDate(new Date(activity.activityDate));
      setActivityTime(new Date(activity.activityTime));
      setNotes(Array.isArray(activity.notes) && activity.notes.length > 0 ? activity.notes : [{ id: Date.now(), content: "" }]);
    }
  }, [editIndex, activities]);

  const handleNoteSubmit = (id) => {
    setNotes((prevNotes) => {
      const currentIndex = prevNotes.findIndex((note) => note.id === id);
      if (currentIndex !== -1) {
        const updatedNotes = [...prevNotes];
        updatedNotes.splice(currentIndex + 1, 0, { id: Date.now(), content: "" });
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
    }, 100);
  };

  const handleSave = () => {
    if (!activityName.trim()) {
      alert("Por favor ingrese un nombre para la actividad");
      return;
    }

    const filteredNotes = notes.filter((note) => note.content && note.content.trim() !== "");

    const activityData = {
      activityName: activityName.trim(),
      activityDate: activityDate.toISOString(),
      activityTime: activityTime.toISOString(),
      notes: filteredNotes,
    };

    onSubmit(activityData);
    setModalVisible(false);
    setEditIndex(null);
  };

  const renderNoteItem = (note) => (
    <View key={note.id} style={styles.noteContainer}>
      <TextInput
        style={styles.noteInput}
        multiline
        placeholder="Nota"
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
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
    >
      <View style={styles.modalContent}>
        <ScrollView
          ref={scrollViewRef}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={true}
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
            <Text style={styles.inputText}>{activityDate.toLocaleDateString("es-MX")}</Text>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={activityDate}
              mode="date"
              display={Platform.OS === "ios" ? "inline" : "default"}
              onChange={(event, selectedDate) => {
                setShowDatePicker(Platform.OS === "ios"); // Mantiene el picker visible en iOS hasta cerrar manualmente
                if (selectedDate) setActivityDate(selectedDate);
              }}
            />
          )}
          <TouchableOpacity
            onPress={() => setShowTimePicker(true)}
            style={styles.input}
          >
            <Text style={styles.inputText}>
              {activityTime.toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" })}
            </Text>
          </TouchableOpacity>
          {showTimePicker && (
            <DateTimePicker
              value={activityTime}
              mode="time"
              display={Platform.OS === "ios" ? "inline" : "default"}
              onChange={(event, selectedTime) => {
                setShowTimePicker(Platform.OS === "ios"); // Mantiene el picker visible en iOS hasta cerrar manualmente
                if (selectedTime) setActivityTime(selectedTime);
              }}
            />
          )}
          <View style={styles.notesSection}>
            <Text style={styles.sectionTitle}>Notas</Text>
            {notes.map(renderNoteItem)}
          </View>
        </ScrollView>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => {
              setModalVisible(false);
              setEditIndex(null);
            }}
          >
            <Text style={styles.buttonText}>Cancelar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.buttonText}>Guardar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default ActivityForm;