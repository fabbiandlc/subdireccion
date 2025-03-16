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
  const [notes, setNotes] = useState([]); // Estado para notas (inicialmente vacío)
  const scrollViewRef = useRef(null);

  // Cargar datos existentes al editar
  useEffect(() => {
    if (editIndex !== null && activities[editIndex]) {
      const activity = activities[editIndex];
      setActivityName(activity.activityName || "");
      setActivityDate(new Date(activity.activityDate));
      setActivityTime(new Date(activity.activityTime));
      setNotes(activity.notes || []); // Inicializa con las notas existentes o un array vacío
    }
  }, [editIndex, activities]);

  // Agregar una nueva nota o elemento de lista
  const addNote = (type) => {
    const newNote = { id: Date.now(), content: "", type };
    setNotes((prevNotes) => [...prevNotes, newNote]);
    scrollToBottom();
  };

  // Crear una nueva nota o elemento de lista al presionar Enter
  const handleNoteSubmit = (id, type) => {
    setNotes((prevNotes) => {
      const currentIndex = prevNotes.findIndex((note) => note.id === id);
      if (currentIndex !== -1) {
        const updatedNotes = [...prevNotes];
        updatedNotes.splice(currentIndex + 1, 0, {
          id: Date.now(),
          content: "",
          type,
        });
        return updatedNotes;
      }
      return prevNotes;
    });
    scrollToBottom();
  };

  // Actualizar el contenido o estado de una nota
  const updateNote = (id, content, completed = false) => {
    setNotes((prevNotes) =>
      prevNotes.map((note) =>
        note.id === id ? { ...note, content, completed } : note
      )
    );
  };

  // Eliminar una nota
  const removeNote = (id) => {
    setNotes((prevNotes) => prevNotes.filter((note) => note.id !== id));
  };

  // Desplazar el ScrollView hacia abajo
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
      // Modo edición
      const updatedActivities = [...activities];
      updatedActivities[editIndex] = newActivity;
      setActivities(updatedActivities);
    } else {
      // Modo creación
      setActivities([...activities, newActivity]);
    }

    setModalVisible(false);
    setEditIndex(null);
  };

  // Renderizar una nota o elemento de lista
  const renderNoteItem = (note) => {
    switch (note.type) {
      case "text":
        return (
          <View key={note.id} style={styles.noteContainer}>
            <TextInput
              style={styles.noteInput}
              multiline
              placeholder="Agregar nota..."
              value={note.content}
              onChangeText={(content) => updateNote(note.id, content)}
              onSubmitEditing={() => handleNoteSubmit(note.id, "text")}
            />
            <TouchableOpacity onPress={() => removeNote(note.id)}>
              <Text style={styles.removeButtonText}>×</Text>
            </TouchableOpacity>
          </View>
        );
      case "checklist":
        return (
          <View key={note.id} style={styles.checklistContainer}>
            <TextInput
              style={styles.checklistInput}
              placeholder="Agregar elemento de lista..."
              value={note.content}
              onChangeText={(content) => updateNote(note.id, content)}
              onSubmitEditing={() => handleNoteSubmit(note.id, "checklist")}
            />
            <TouchableOpacity
              onPress={() => updateNote(note.id, note.content, !note.completed)}
            >
              <Text
                style={[
                  styles.checkboxText,
                  note.completed && styles.completed,
                ]}
              >
                {note.completed ? "✓" : "○"}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => removeNote(note.id)}>
              <Text style={styles.removeButtonText}>×</Text>
            </TouchableOpacity>
          </View>
        );
      default:
        return null;
    }
  };

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
          {/* Campo de nombre de la actividad */}
          <TextInput
            style={styles.input}
            placeholder="Nombre de la actividad"
            value={activityName}
            onChangeText={setActivityName}
          />

          {/* Selector de fecha */}
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

          {/* Selector de hora */}
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

          {/* Sección de notas y lista de tareas */}
          <View style={styles.notesSection}>
            <Text style={styles.sectionTitle}>Notas y Lista de Tareas</Text>
            <View style={styles.addButtonsContainer}>
              <TouchableOpacity
                style={[styles.addButton, styles.textButton]}
                onPress={() => addNote("text")}
              >
                <Text style={styles.addButtonText}>+ Nota</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.addButton, styles.checklistButton]}
                onPress={() => addNote("checklist")}
              >
                <Text style={styles.addButtonText}>+ Lista</Text>
              </TouchableOpacity>
            </View>
            {notes.map((note) => renderNoteItem(note))}
          </View>
        </ScrollView>

        {/* Botones Guardar y Cancelar */}
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
