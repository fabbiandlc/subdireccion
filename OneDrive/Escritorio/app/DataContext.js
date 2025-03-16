import React, { createContext, useState, useEffect } from "react";
import { initDatabase, fetchAll, insert, update, remove } from "./Database";

export const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [docentes, setDocentes] = useState([]);
  const [materias, setMaterias] = useState([]);
  const [grupos, setGrupos] = useState([]);
  const [horarios, setHorarios] = useState([]);
  const [activities, setActivities] = useState([]);

  // Initial data load
  useEffect(() => {
    const loadData = async () => {
      try {
        await initDatabase();
        const [
          docentesData,
          materiasData,
          gruposData,
          horariosData,
          activitiesData,
        ] = await Promise.all([
          fetchAll("Docentes"),
          fetchAll("Materias"),
          fetchAll("Grupos"),
          fetchAll("Horarios"),
          fetchAll("Activities"),
        ]);
        setDocentes(docentesData || []);
        setMaterias(materiasData || []);
        setGrupos(gruposData || []);
        setHorarios(horariosData || []);
        setActivities(activitiesData || []);
      } catch (error) {
        console.error("Error loading initial data:", error);
      }
    };
    loadData();
  }, []);

  const updateTable = async (table, setState, currentState, newData) => {
    try {
      // Fetch current database state to ensure sync
      const dbData = await fetchAll(table);
      const dbIds = dbData.map((item) => item.id);

      // Update state first for UI responsiveness
      setState(newData);

      // Sync with database
      const existingIds = dbIds; // Use database IDs instead of currentState
      const newIds = newData.map((item) => item.id);

      // Insert or update items
      for (const item of newData) {
        const existsInDb = existingIds.includes(item.id);
        if (existsInDb) {
          await update(table, item, item.id);
        } else {
          await insert(table, item);
        }
      }

      // Remove items that are no longer in newData
      const itemsToDelete = dbData.filter((item) => !newIds.includes(item.id));
      for (const item of itemsToDelete) {
        await remove(table, item.id);
      }
    } catch (error) {
      console.error(`Error updating ${table}:`, error);
      setState(currentState); // Rollback on failure
      throw error; // Ensure errors propagate
    }
  };

  // Specific update functions
  const updateDocentes = (newDocentes) =>
    updateTable("Docentes", setDocentes, docentes, newDocentes);
  const updateMaterias = (newMaterias) =>
    updateTable("Materias", setMaterias, materias, newMaterias);
  const updateGrupos = (newGrupos) =>
    updateTable("Grupos", setGrupos, grupos, newGrupos);
  const updateHorarios = (newHorarios) =>
    updateTable("Horarios", setHorarios, horarios, newHorarios);
  const updateActivities = (newActivities) =>
    updateTable("Activities", setActivities, activities, newActivities);

  // Delete function
  const deleteItem = async (table, id) => {
    try {
      await remove(table, id);
      switch (table) {
        case "Docentes":
          setDocentes(docentes.filter((d) => String(d.id) !== String(id)));
          break;
        case "Materias":
          setMaterias(materias.filter((m) => String(m.id) !== String(id)));
          break;
        case "Grupos":
          setGrupos(grupos.filter((g) => String(g.id) !== String(id)));
          break;
        case "Horarios":
          setHorarios(horarios.filter((h) => String(h.id) !== String(id)));
          break;
        case "Activities":
          setActivities(activities.filter((a) => String(a.id) !== String(id)));
          break;
        default:
          console.warn("Unknown table:", table);
      }
    } catch (error) {
      console.error(`Error deleting from ${table}:`, error);
    }
  };

  return (
    <DataContext.Provider
      value={{
        docentes,
        setDocentes: updateDocentes,
        materias,
        setMaterias: updateMaterias,
        grupos,
        setGrupos: updateGrupos,
        horarios,
        setHorarios: updateHorarios,
        activities,
        setActivities: updateActivities,
        deleteItem,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useDataContext = () => React.useContext(DataContext);
