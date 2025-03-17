import React, { useCallback, useState } from "react";
import { View, TouchableOpacity, Text, Alert, StyleSheet } from "react-native";
import * as FileSystem from "expo-file-system";
import * as DocumentPicker from "expo-document-picker";
import * as Sharing from "expo-sharing";
import { exportBackup, importBackup, fetchAll } from "./Database";
import { useDataContext } from "./DataContext";
import { useContext } from "react";
import { ActivitiesContext } from "./ActivitiesContext";

const BackupScreen = () => {
  const { setDocentes, setMaterias, setGrupos, setHorarios } = useDataContext();
  const { setActivities } = useContext(ActivitiesContext);
  const [isLoading, setIsLoading] = useState(false);

  const loadData = useCallback(async () => {
    try {
      const [docentes, materias, grupos, horarios, activities] = await Promise.all([
        fetchAll("Docentes"),
        fetchAll("Materias"),
        fetchAll("Grupos"),
        fetchAll("Horarios"),
        fetchAll("Activities"),
      ]);
      console.log("Loaded data after import:", { activities }); // Debug log
      setDocentes(docentes);
      setMaterias(materias);
      setGrupos(grupos);
      setHorarios(horarios);
      setActivities(activities);
    } catch (error) {
      console.error("Error loading data:", error);
      Alert.alert("Error", "Failed to load data");
    }
  }, [setDocentes, setMaterias, setGrupos, setHorarios, setActivities]);

  const handleExport = useCallback(async () => {
    try {
      setIsLoading(true);
      const backup = await exportBackup();
      if (!backup || backup === "{}") {
        Alert.alert("Info", "No data to export");
        return;
      }

      const tempUri = `${FileSystem.documentDirectory}backup.json`;
      await FileSystem.writeAsStringAsync(tempUri, backup);
      await Sharing.shareAsync(tempUri, {
        mimeType: "application/json",
        dialogTitle: "Save backup",
      });
    } catch (error) {
      console.error("Export error:", error);
      Alert.alert("Error", "Failed to export backup");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleImport = useCallback(async () => {
    try {
      setIsLoading(true);
      const result = await DocumentPicker.getDocumentAsync({
        type: "application/json",
      });
      if (result.type !== "success") {
        Alert.alert("Error", "No file selected");
        return;
      }

      const content = await FileSystem.readAsStringAsync(result.uri);
      console.log("Importing backup content:", content); // Debug log

      const success = await importBackup(content);
      if (!success) {
        Alert.alert("Error", "Failed to import backup");
        return;
      }

      await loadData();
      Alert.alert("Success", "Backup imported successfully");
    } catch (error) {
      console.error("Import error:", error);
      Alert.alert("Error", `Failed to import backup: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  }, [loadData]);

  return (
    <View style={styles.container}>
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Procesando...</Text>
        </View>
      ) : (
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={handleExport}>
            <Text style={styles.buttonText}>Exportar Copia de Seguridad</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={handleImport}>
            <Text style={styles.buttonText}>Importar Copia de Seguridad</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  buttonContainer: {
    width: "100%",
    alignItems: "center",
  },
  button: {
    backgroundColor: "#007BFF",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginVertical: 10,
    width: "80%",
    alignItems: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  loadingContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 18,
    color: "#666",
    fontWeight: "500",
  },
});

export default BackupScreen;