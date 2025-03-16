import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  FlatList,
  ScrollView,
  Alert,
  TextInput,
  SafeAreaView,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { Picker } from "@react-native-picker/picker";
import { useDataContext } from "./DataContext";
import { fetchAll, update } from "./Database"; // Import update for direct updates
import { v4 as uuidv4 } from "uuid"; // Use UUID for new IDs
import { stylesHorarios as styles } from "./stylesHorarios";

const HorariosScreen = ({ navigation }) => {
  const {
    docentes,
    setDocentes,
    materias,
    setMaterias,
    grupos,
    horarios,
    setHorarios,
  } = useDataContext();

  const [filteredDocentes, setFilteredDocentes] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [docenteModalVisible, setDocenteModalVisible] = useState(false);
  const [selectedDocente, setSelectedDocente] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentView, setCurrentView] = useState("list");
  const [editingHorario, setEditingHorario] = useState(null);

  const [newDocente, setNewDocente] = useState({
    nombre: "",
    apellido: "",
  });

  const [newHorario, setNewHorario] = useState({
    docenteId: "",
    dia: "Lunes",
    horaInicio: "07:00",
    horaFin: "07:50",
    materiaId: "",
    salonId: "",
    color: "#E3F2FD",
  });

  const coloresDisponibles = [
    { nombre: "Azul Claro", valor: "#E3F2FD" },
    { nombre: "Verde Claro", valor: "#C8E6C9" },
    { nombre: "Amarillo Claro", valor: "#FFF9C4" },
    { nombre: "Rosa Claro", valor: "#F8BBD0" },
    { nombre: "Púrpura Claro", valor: "#D1C4E9" },
    { nombre: "Naranja Claro", valor: "#FFCCBC" },
  ];

  const convertirHoraAMinutos = (hora) => {
    const [horas, minutos] = hora.split(":");
    return parseInt(horas) * 60 + parseInt(minutos);
  };

  const bloquesHorarios = useMemo(
    () => [
      { horaInicio: "07:00", horaFin: "07:50", esReceso: false },
      { horaInicio: "07:50", horaFin: "08:40", esReceso: false },
      { horaInicio: "08:40", horaFin: "09:30", esReceso: false },
      { horaInicio: "09:30", horaFin: "10:20", esReceso: false },
      { horaInicio: "10:20", horaFin: "10:50", esReceso: true },
      { horaInicio: "10:50", horaFin: "11:40", esReceso: false },
      { horaInicio: "11:40", horaFin: "12:30", esReceso: false },
      { horaInicio: "12:30", horaFin: "13:20", esReceso: false },
      { horaInicio: "13:20", horaFin: "14:10", esReceso: false },
      { horaInicio: "14:10", horaFin: "15:00", esReceso: false },
      { horaInicio: "15:00", horaFin: "15:50", esReceso: false },
      { horaInicio: "15:50", horaFin: "16:00", esReceso: false },
      { horaInicio: "16:00", horaFin: "16:30", esReceso: true },
      { horaInicio: "16:30", horaFin: "17:20", esReceso: false },
      { horaInicio: "17:20", horaFin: "18:10", esReceso: false },
      { horaInicio: "18:10", horaFin: "19:00", esReceso: false },
      { horaInicio: "19:00", horaFin: "19:50", esReceso: false },
      { horaInicio: "19:50", horaFin: "20:40", esReceso: false },
      { horaInicio: "20:40", horaFin: "21:30", esReceso: false },
      { horaInicio: "21:30", horaFin: "22:00", esReceso: false },
    ],
    []
  );

  const diasSemana = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"];

  const horasDisponibles = useMemo(() => {
    const horas = [];
    bloquesHorarios.forEach((bloque) => {
      if (!bloque.esReceso) {
        if (!horas.includes(bloque.horaInicio)) horas.push(bloque.horaInicio);
        if (!horas.includes(bloque.horaFin)) horas.push(bloque.horaFin);
      }
    });
    return horas.sort(
      (a, b) => convertirHoraAMinutos(a) - convertirHoraAMinutos(b)
    );
  }, [bloquesHorarios]);

  useEffect(() => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const filtered = docentes.filter(
        (docente) =>
          docente.nombre.toLowerCase().includes(query) ||
          docente.apellido.toLowerCase().includes(query)
      );
      setFilteredDocentes(filtered);
    } else {
      setFilteredDocentes(docentes);
    }
  }, [searchQuery, docentes]);

  const getDocenteNombre = useCallback(
    (docenteId) => {
      const docente = docentes.find((d) => d.id === docenteId);
      return docente
        ? `${docente.nombre} ${docente.apellido}`
        : "Docente no encontrado";
    },
    [docentes]
  );

  const getMateriaNombre = useCallback(
    (materiaId) => {
      const materia = materias.find((m) => m.id === materiaId);
      return materia ? materia.nombre : "Materia no encontrada";
    },
    [materias]
  );

  const getMateriaColor = useCallback(
    (materiaId) => {
      const materia = materias.find((m) => m.id === materiaId);
      return materia && materia.color ? materia.color : "#E3F2FD";
    },
    [materias]
  );

  const getSalonNombre = useCallback(
    (salonId) => {
      const grupo = grupos.find((g) => g.id === salonId);
      return grupo ? grupo.nombre : "Salón no encontrado";
    },
    [grupos]
  );

  const verificarConflictos = useCallback(
    (horario, horarioId = null) => {
      const conflictos = horarios.filter((h) => {
        if (horarioId && h.id === horarioId) return false;
        if (h.dia !== horario.dia) return false;

        const inicio1 = convertirHoraAMinutos(horario.horaInicio);
        const fin1 = convertirHoraAMinutos(horario.horaFin);
        const inicio2 = convertirHoraAMinutos(h.horaInicio);
        const fin2 = convertirHoraAMinutos(h.horaFin);

        return (
          inicio1 < fin2 &&
          fin1 > inicio2 &&
          (h.docenteId === horario.docenteId || h.salonId === horario.salonId)
        );
      });

      return conflictos.length > 0;
    },
    [horarios]
  );

  const handleGuardarDocente = () => {
    if (!newDocente.nombre || !newDocente.apellido) {
      Alert.alert("Error", "Todos los campos son obligatorios");
      return;
    }

    const id = uuidv4(); // Use UUID instead of Date.now()
    const nuevoDocente = { ...newDocente, id };
    setDocentes([...docentes, nuevoDocente]);

    setNewDocente({ nombre: "", apellido: "" });
    setDocenteModalVisible(false);
  };

  const handleGuardarHorario = async () => {
    if (
      !newHorario.docenteId ||
      !newHorario.materiaId ||
      !newHorario.salonId ||
      !newHorario.dia ||
      !newHorario.horaInicio ||
      !newHorario.horaFin ||
      !newHorario.color
    ) {
      Alert.alert("Error", "Todos los campos son obligatorios");
      return;
    }

    const inicioMinutos = convertirHoraAMinutos(newHorario.horaInicio);
    const finMinutos = convertirHoraAMinutos(newHorario.horaFin);
    if (inicioMinutos >= finMinutos) {
      Alert.alert(
        "Error",
        "La hora de entrada debe ser anterior a la hora de salida"
      );
      return;
    }

    if (verificarConflictos(newHorario, editingHorario?.id)) {
      Alert.alert(
        "Conflicto de Horario",
        "Ya existe una clase programada para este docente o salón en el mismo horario"
      );
      return;
    }

    try {
      const materiaSeleccionada = materias.find(
        (m) => m.id === newHorario.materiaId
      );
      if (materiaSeleccionada && !materiaSeleccionada.color) {
        // Directly update the materia in the database
        const updatedMateria = { ...materiaSeleccionada, color: newHorario.color };
        await update("Materias", updatedMateria, updatedMateria.id);
        // Sync materias state with database
        const freshMaterias = await fetchAll("Materias");
        setMaterias(freshMaterias);
      }

      if (editingHorario) {
        setHorarios(
          horarios.map((h) =>
            h.id === editingHorario.id ? { ...newHorario, id: h.id } : h
          )
        );
      } else {
        const id = uuidv4(); // Use UUID for new horarios
        setHorarios([...horarios, { ...newHorario, id }]);
      }

      setNewHorario({
        docenteId: "",
        dia: "Lunes",
        horaInicio: "07:00",
        horaFin: "07:50",
        materiaId: "",
        salonId: "",
        color: "#E3F2FD",
      });
      setEditingHorario(null);
      setModalVisible(false);
    } catch (error) {
      console.error("Error saving horario:", error);
      Alert.alert("Error", "No se pudo guardar el horario. Intenta de nuevo.");
    }
  };

  const handleEditarHorario = (horario) => {
    setEditingHorario(horario);
    setNewHorario({
      docenteId: horario.docenteId,
      dia: horario.dia,
      horaInicio: horario.horaInicio,
      horaFin: horario.horaFin,
      materiaId: horario.materiaId,
      salonId: horario.salonId,
      color: horario.color || getMateriaColor(horario.materiaId),
    });
    setModalVisible(true);
  };

  const handleEliminarHorario = (id) => {
    console.log("Attempting to delete horario with ID:", id);
    console.log("Current horarios:", horarios);

    Alert.alert(
      "Eliminar Horario",
      "¿Estás seguro que deseas eliminar este horario?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          onPress: () => {
            const updatedHorarios = horarios.filter(
              (h) => String(h.id) !== String(id)
            );
            console.log("Updated horarios:", updatedHorarios);
            setHorarios(updatedHorarios);
            if (updatedHorarios.length === horarios.length) {
              console.warn("No horario was deleted. Check ID matching.");
            }
          },
          style: "destructive",
        },
      ]
    );
  };

  const handleSeleccionarDocente = (docente) => {
    setSelectedDocente(docente);
    setCurrentView("schedule");
  };

  const horariosDocente = useMemo(() => {
    if (!selectedDocente) return [];
    return horarios.filter((h) => h.docenteId === selectedDocente.id);
  }, [selectedDocente, horarios]);

  const renderDocenteItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => handleSeleccionarDocente(item)}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>
          {item.nombre} {item.apellido}
        </Text>
        <Text style={styles.cardSubtitle}>
          {horarios.filter((h) => h.docenteId === item.id).length} clases
          programadas
        </Text>
      </View>
      <View style={styles.cardActions}>
        <TouchableOpacity
          style={styles.viewButton}
          onPress={() => handleSeleccionarDocente(item)}
        >
          <Ionicons name="calendar-outline" size={18} color="#fff" />
          <Text style={styles.buttonText}>Ver Horario</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  const renderHorarioCell = (dia, bloque) => {
    const bloqueInicioMin = convertirHoraAMinutos(bloque.horaInicio);
    const bloqueFinMin = convertirHoraAMinutos(bloque.horaFin);

    const clases = horariosDocente.filter((horario) => {
      const horarioInicioMin = convertirHoraAMinutos(horario.horaInicio);
      const horarioFinMin = convertirHoraAMinutos(horario.horaFin);

      return (
        horario.dia === dia &&
        horarioInicioMin < bloqueFinMin &&
        horarioFinMin > bloqueInicioMin
      );
    });

    if (bloque.esReceso) {
      return (
        <View style={styles.recesoCell}>
          <Text style={styles.recesoText}>Receso</Text>
        </View>
      );
    }

    if (clases.length === 0) {
      return <View style={styles.emptyCell} />;
    }

    const clase = clases[0];
    const esInicio =
      convertirHoraAMinutos(clase.horaInicio) === bloqueInicioMin;

    return (
      <TouchableOpacity
        style={[
          styles.classCell,
          {
            height: esInicio ? "auto" : 0,
            borderWidth: esInicio ? 0.5 : 0,
            backgroundColor: clase.color || getMateriaColor(clase.materiaId),
          },
        ]}
        onPress={() => handleEditarHorario(clase)}
      >
        {esInicio && (
          <>
            <Text style={styles.classCellTitle} numberOfLines={1}>
              {getMateriaNombre(clase.materiaId)}
            </Text>
            <Text style={styles.classCellSubtitle} numberOfLines={1}>
              {getSalonNombre(clase.salonId)}
            </Text>
            <Text style={styles.classCellTime}>
              {clase.horaInicio} - {clase.horaFin}
            </Text>
          </>
        )}
      </TouchableOpacity>
    );
  };

  const renderDocenteForm = () => (
    <View style={styles.modalContainer}>
      <View style={styles.modalContent}>
        <Text style={styles.modalTitle}>Nuevo Docente</Text>
        <Text style={styles.inputLabel}>Nombre</Text>
        <TextInput
          style={styles.textInput}
          value={newDocente.nombre}
          onChangeText={(text) =>
            setNewDocente({ ...newDocente, nombre: text })
          }
          placeholder="Ingrese nombre"
        />
        <Text style={styles.inputLabel}>Apellido</Text>
        <TextInput
          style={styles.textInput}
          value={newDocente.apellido}
          onChangeText={(text) =>
            setNewDocente({ ...newDocente, apellido: text })
          }
          placeholder="Ingrese apellido"
        />
        <View style={styles.modalButtons}>
          <TouchableOpacity
            style={[styles.modalButton, styles.cancelButton]}
            onPress={() => {
              setDocenteModalVisible(false);
              setNewDocente({ nombre: "", apellido: "" });
            }}
          >
            <Text style={styles.cancelButtonText}>Cancelar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.modalButton, styles.saveButton]}
            onPress={handleGuardarDocente}
          >
            <Text style={styles.saveButtonText}>Guardar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const renderHorarioForm = () => (
    <View style={styles.modalContainer}>
      <View style={styles.modalContent}>
        <Text style={styles.modalTitle}>
          {editingHorario ? "Editar Horario" : "Nuevo Horario"}
        </Text>
        <Text style={styles.inputLabel}>Docente</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={newHorario.docenteId}
            style={styles.picker}
            onValueChange={(itemValue) =>
              setNewHorario({ ...newHorario, docenteId: itemValue })
            }
          >
            <Picker.Item label="Seleccionar docente" value="" />
            {docentes.map((docente) => (
              <Picker.Item
                key={docente.id}
                label={`${docente.nombre} ${docente.apellido}`}
                value={docente.id}
              />
            ))}
          </Picker>
        </View>
        <Text style={styles.inputLabel}>Materia</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={newHorario.materiaId}
            style={styles.picker}
            onValueChange={(itemValue) => {
              const materia = materias.find((m) => m.id === itemValue);
              setNewHorario({
                ...newHorario,
                materiaId: itemValue,
                color: materia?.color || newHorario.color,
              });
            }}
          >
            <Picker.Item label="Seleccionar materia" value="" />
            {materias.map((materia) => (
              <Picker.Item
                key={materia.id}
                label={`${materia.nombre} (${materia.codigo})`}
                value={materia.id}
              />
            ))}
          </Picker>
        </View>
        <Text style={styles.inputLabel}>Salón</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={newHorario.salonId}
            style={styles.picker}
            onValueChange={(itemValue) =>
              setNewHorario({ ...newHorario, salonId: itemValue })
            }
          >
            <Picker.Item label="Seleccionar salón" value="" />
            {grupos.map((grupo) => (
              <Picker.Item
                key={grupo.id}
                label={grupo.nombre}
                value={grupo.id}
              />
            ))}
          </Picker>
        </View>
        <Text style={styles.inputLabel}>Día</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={newHorario.dia}
            style={styles.picker}
            onValueChange={(itemValue) =>
              setNewHorario({ ...newHorario, dia: itemValue })
            }
          >
            {diasSemana.map((dia) => (
              <Picker.Item key={dia} label={dia} value={dia} />
            ))}
          </Picker>
        </View>
        <View style={styles.timeContainer}>
          <View style={styles.timeField}>
            <Text style={styles.inputLabel}>Hora de Entrada</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={newHorario.horaInicio}
                style={styles.picker}
                onValueChange={(itemValue) => {
                  setNewHorario({ ...newHorario, horaInicio: itemValue });
                  const inicioMin = convertirHoraAMinutos(itemValue);
                  const finMin = convertirHoraAMinutos(newHorario.horaFin);
                  if (finMin <= inicioMin) {
                    const nextHora = horasDisponibles.find(
                      (h) => convertirHoraAMinutos(h) > inicioMin
                    );
                    setNewHorario((prev) => ({
                      ...prev,
                      horaFin: nextHora || prev.horaFin,
                    }));
                  }
                }}
              >
                {horasDisponibles.map((hora) => (
                  <Picker.Item
                    key={`inicio-${hora}`}
                    label={hora}
                    value={hora}
                  />
                ))}
              </Picker>
            </View>
          </View>
          <View style={styles.timeField}>
            <Text style={styles.inputLabel}>Hora de Salida</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={newHorario.horaFin}
                style={styles.picker}
                onValueChange={(itemValue) =>
                  setNewHorario({ ...newHorario, horaFin: itemValue })
                }
              >
                {horasDisponibles
                  .filter(
                    (hora) =>
                      convertirHoraAMinutos(hora) >
                      convertirHoraAMinutos(newHorario.horaInicio)
                  )
                  .map((hora) => (
                    <Picker.Item
                      key={`fin-${hora}`}
                      label={hora}
                      value={hora}
                    />
                  ))}
              </Picker>
            </View>
          </View>
        </View>
        <Text style={styles.inputLabel}>Color</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={newHorario.color}
            style={styles.picker}
            onValueChange={(itemValue) =>
              setNewHorario({ ...newHorario, color: itemValue })
            }
          >
            {coloresDisponibles.map((color) => (
              <Picker.Item
                key={color.valor}
                label={color.nombre}
                value={color.valor}
              />
            ))}
          </Picker>
        </View>
        <View style={styles.modalButtons}>
          <TouchableOpacity
            style={[styles.modalButton, styles.cancelButton]}
            onPress={() => {
              setModalVisible(false);
              setEditingHorario(null);
              setNewHorario({
                docenteId: "",
                dia: "Lunes",
                horaInicio: "07:00",
                horaFin: "07:50",
                materiaId: "",
                salonId: "",
                color: "#E3F2FD",
              });
            }}
          >
            <Text style={styles.cancelButtonText}>Cancelar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.modalButton, styles.saveButton]}
            onPress={handleGuardarHorario}
          >
            <Text style={styles.saveButtonText}>
              {editingHorario ? "Actualizar" : "Guardar"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const renderListView = () => (
    <>
      <View style={styles.searchContainer}>
        <Ionicons
          name="search-outline"
          size={20}
          color="#999"
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar docente..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          clearButtonMode="while-editing"
        />
      </View>
      <FlatList
        data={filteredDocentes}
        renderItem={renderDocenteItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="person-outline" size={64} color="#ccc" />
            <Text style={styles.emptyText}>No hay docentes</Text>
            <Text style={styles.emptySubText}>
              {searchQuery
                ? "Intenta con otra búsqueda"
                : "Agrega docentes usando el botón + de abajo"}
            </Text>
          </View>
        }
      />
      <TouchableOpacity
        style={styles.fab}
        onPress={() => {
          setDocenteModalVisible(true);
        }}
      >
        <Ionicons name="add" size={24} color="#fff" />
      </TouchableOpacity>
    </>
  );

  const renderScheduleView = () => {
    if (!selectedDocente) return null;

    return (
      <View style={styles.scheduleContainer}>
        <View style={styles.scheduleHeader}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => {
              setCurrentView("list");
              setSelectedDocente(null);
            }}
          >
            <Ionicons name="arrow-back" size={24} color="#007BFF" />
          </TouchableOpacity>
          <Text style={styles.scheduleTitle}>
            Horario: {selectedDocente.nombre} {selectedDocente.apellido}
          </Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => {
              setNewHorario({
                ...newHorario,
                docenteId: selectedDocente.id,
              });
              setEditingHorario(null);
              setModalVisible(true);
            }}
          >
            <Ionicons name="add" size={24} color="#007BFF" />
          </TouchableOpacity>
        </View>
        <ScrollView style={styles.scheduleScrollContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.scheduleTable}>
              <View style={styles.tableRow}>
                <View style={styles.timeCell}>
                  <Text style={styles.timeCellText}>Hora</Text>
                </View>
                {diasSemana.map((dia) => (
                  <View key={dia} style={styles.dayHeaderCell}>
                    <Text style={styles.dayHeaderText}>{dia}</Text>
                  </View>
                ))}
              </View>
              {bloquesHorarios.map((bloque) => (
                <View key={bloque.horaInicio} style={styles.tableRow}>
                  <View style={styles.timeCell}>
                    <Text style={styles.timeCellText}>
                      {bloque.horaInicio} - {bloque.horaFin}
                    </Text>
                  </View>
                  {diasSemana.map((dia) => (
                    <View
                      key={`${dia}-${bloque.horaInicio}`}
                      style={styles.tableCell}
                    >
                      {renderHorarioCell(dia, bloque)}
                    </View>
                  ))}
                </View>
              ))}
            </View>
          </ScrollView>
        </ScrollView>
        {horariosDocente.length > 0 && (
          <ScrollView style={styles.legendScrollContainer}>
            <View style={styles.legendContainer}>
              <Text style={styles.legendTitle}>Clases Programadas:</Text>
              {horariosDocente.map((horario) => (
                <View key={horario.id} style={styles.legendItem}>
                  <View
                    style={[
                      styles.legendColor,
                      {
                        backgroundColor:
                          horario.color || getMateriaColor(horario.materiaId),
                      },
                    ]}
                  />
                  <View style={styles.legendInfo}>
                    <Text style={styles.legendText}>
                      {getMateriaNombre(horario.materiaId)} -{" "}
                      {getSalonNombre(horario.salonId)}
                    </Text>
                    <Text style={styles.legendSubtext}>
                      {horario.dia}, {horario.horaInicio} - {horario.horaFin}
                    </Text>
                  </View>
                  <View style={styles.legendActions}>
                    <TouchableOpacity
                      style={styles.legendButton}
                      onPress={() => handleEditarHorario(horario)}
                    >
                      <Ionicons
                        name="create-outline"
                        size={20}
                        color="#007BFF"
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.legendButton}
                      onPress={() => handleEliminarHorario(horario.id)}
                    >
                      <Ionicons
                        name="trash-outline"
                        size={20}
                        color="#FF3B30"
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          </ScrollView>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {currentView === "list" ? renderListView() : renderScheduleView()}
      <Modal
        animationType="slide"
        transparent={true}
        visible={docenteModalVisible}
        onRequestClose={() => {
          setDocenteModalVisible(false);
        }}
      >
        {renderDocenteForm()}
      </Modal>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
          setEditingHorario(null);
        }}
      >
        {renderHorarioForm()}
      </Modal>
    </SafeAreaView>
  );
};

export default HorariosScreen;