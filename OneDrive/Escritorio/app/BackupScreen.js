import React, { useCallback, useEffect, useState } from 'react';
import { View, TouchableOpacity, Text, Alert, StyleSheet, ActivityIndicator } from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as DocumentPicker from 'expo-document-picker';
import * as Sharing from 'expo-sharing';
import { exportBackup, importBackup, fetchAll, initDatabase } from './Database';
import { useDataContext } from './DataContext';

const BackupScreen = () => {
  const { setDocentes, setMaterias, setGrupos, setHorarios, setActivities } = useDataContext();
  const [isLoading, setIsLoading] = useState(false);

  // Inicializa la base de datos y carga datos al inicio
  useEffect(() => {
    const initialize = async () => {
      await initDatabase();
      await loadData();
    };
    
    initialize();
  }, []);

  // Función para cargar datos desde la base de datos
  const loadData = useCallback(async () => {
    try {
      // Cargamos datos de todas las tablas en paralelo
      const [docentes, materias, grupos, horarios, activities] = await Promise.all([
        fetchAll("Docentes"),
        fetchAll("Materias"),
        fetchAll("Grupos"),
        fetchAll("Horarios"),
        fetchAll("Activities"),
      ]);
      
      // Actualizamos el contexto
      setDocentes(docentes);
      setMaterias(materias);
      setGrupos(grupos);
      setHorarios(horarios);
      setActivities(activities);
      
    } catch (error) {
      // No mostramos alerta para no molestar al usuario
      console.log("Error al cargar datos iniciales");
    }
  }, [setDocentes, setMaterias, setGrupos, setHorarios, setActivities]);

  const handleExport = useCallback(async () => {
    try {
      setIsLoading(true);
      
      const backup = await exportBackup();
      if (!backup || backup === "{}") {
        Alert.alert("Información", "No hay datos para exportar");
        setIsLoading(false);
        return;
      }

      // Guardar en archivo temporal
      const tempUri = `${FileSystem.documentDirectory}backup.json`;
      await FileSystem.writeAsStringAsync(tempUri, backup);
      
      // Compartir archivo
      await Sharing.shareAsync(tempUri, { 
        mimeType: 'application/json', 
        dialogTitle: 'Guardar copia de seguridad' 
      });
      
    } catch (error) {
      console.log("Error en exportación");
      Alert.alert("Error", "No se pudo exportar la copia de seguridad");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleImport = useCallback(async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({ type: 'application/json' });
      if (result.type !== 'success') return;
      
      setIsLoading(true);
      
      const content = await FileSystem.readAsStringAsync(result.uri);
      const success = await importBackup(content);
      
      if (success) {
        await loadData();
        Alert.alert("Éxito", "Datos restaurados correctamente");
      } else {
        Alert.alert("Error", "El archivo de respaldo no es válido");
      }
    } catch (error) {
      console.log("Error en importación");
      Alert.alert("Error", "No se pudo importar la copia de seguridad");
    } finally {
      setIsLoading(false);
    }
  }, [loadData]);

  return (
    <View style={styles.container}>
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007BFF" />
          <Text style={styles.loadingText}>Procesando...</Text>
        </View>
      ) : (
        <>
          <TouchableOpacity 
            onPress={handleExport} 
            style={styles.button}
          >
            <Text style={styles.buttonText}>Exportar Copia de Seguridad</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={handleImport} 
            style={styles.button}
          >
            <Text style={styles.buttonText}>Importar Copia de Seguridad</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },
  button: {
    backgroundColor: '#007BFF',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    width: '80%',
    alignItems: 'center'
  },
  buttonText: {
    color: '#fff',
    fontSize: 16
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666'
  }
});

export default BackupScreen;