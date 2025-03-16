import { StyleSheet } from "react-native";

const COLORS = {
  primary: "#4A90E2",
  danger: "#E94E77",
  success: "#4CAF50",
  background: "#F5F5F5",
  text: "#333",
  border: "#E0E0E0",
  white: "#FFF",
  gray: "#9E9E9E",
};

const SPACING = {
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

const BORDER_RADIUS = {
  sm: 4,
  md: 8,
  lg: 12,
};

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: SPACING.md,
  },
  activitiesContainer: {
    flex: 1,
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  cardText: {
    fontSize: 14,
    color: COLORS.gray,
  },
  cardButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: SPACING.md,
  },
  viewButton: {
    flex: 1,
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.sm,
    alignItems: "center",
    marginRight: SPACING.sm,
  },
  editButton: {
    flex: 1,
    backgroundColor: COLORS.success,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.sm,
    alignItems: "center",
    marginHorizontal: SPACING.sm,
  },
  deleteButton: {
    flex: 1,
    backgroundColor: COLORS.danger,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.sm,
    alignItems: "center",
    marginLeft: SPACING.sm,
  },
  buttonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "600",
  },

  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "80%",
    backgroundColor: COLORS.white,
    padding: SPACING.lg,
    borderRadius: BORDER_RADIUS.md,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  summaryTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  summaryLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  summaryDateTimeContainer: {
    marginBottom: SPACING.md,
  },
  summaryDateTime: {
    fontSize: 14,
    color: COLORS.gray,
  },
  summaryScrollView: {
    maxHeight: 300,
    marginBottom: SPACING.md,
  },
  summarySection: {
    marginBottom: SPACING.md,
  },
  summaryNoteContainer: {
    padding: SPACING.sm,
    borderRadius: BORDER_RADIUS.sm,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.sm,
  },
  summaryNoteText: {
    fontSize: 14,
    color: COLORS.text,
  },
  summaryChecklistItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: SPACING.sm,
    borderRadius: BORDER_RADIUS.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.sm,
  },
  summaryChecklistText: {
    fontSize: 14,
    color: COLORS.text,
    marginLeft: SPACING.sm,
  },
  checkboxIndicator: {
    fontSize: 16,
    color: COLORS.gray,
  },
  completedText: {
    textDecorationLine: "line-through",
    color: COLORS.gray,
  },
  summaryCloseButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderRadius: BORDER_RADIUS.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  noteContainer: {
    padding: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.md,
  },
  noteText: {
    fontSize: 14,
    color: COLORS.text,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "85%",
    backgroundColor: COLORS.white,
    padding: SPACING.lg,
    borderRadius: BORDER_RADIUS.md,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  input: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: BORDER_RADIUS.sm,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    fontSize: 16,
    color: COLORS.text,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: SPACING.md,
  },
  saveButton: {
    flex: 1,
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.sm,
    alignItems: "center",
    marginRight: SPACING.sm,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: COLORS.danger,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.sm,
    alignItems: "center",
    marginLeft: SPACING.sm,
  },
  buttonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "600",
  },
  notesSection: {
    marginTop: SPACING.lg,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  addButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: SPACING.md,
  },
  addButton: {
    flex: 1,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.sm,
    alignItems: "center",
    marginHorizontal: SPACING.sm,
  },
  textButton: {
    backgroundColor: COLORS.primary,
  },
  checklistButton: {
    backgroundColor: COLORS.success,
  },
  addButtonText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: "600",
  },
  noteContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.sm,
    marginBottom: SPACING.md,
  },
  noteInput: {
    flex: 1,
    fontSize: 14,
    color: COLORS.text,
    paddingHorizontal: SPACING.sm,
  },
  removeButton: {
    marginLeft: SPACING.sm,
    backgroundColor: COLORS.danger,
    borderRadius: BORDER_RADIUS.sm,
    padding: SPACING.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  removeButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "bold",
  },
  checklistContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.sm,
    marginBottom: SPACING.md,
  },
  checklistInput: {
    flex: 1,
    fontSize: 14,
    color: COLORS.text,
    paddingHorizontal: SPACING.sm,
  },
  checklistToggle: {
    marginLeft: SPACING.sm,
  },
  checkboxText: {
    fontSize: 16,
    color: COLORS.gray,
  },
  completed: {
    textDecorationLine: "line-through",
    color: COLORS.success,
  },
  addButton: {
    backgroundColor: COLORS.primary,
    width: 70, // Ajusta el tamaño del botón circular
    height: 70, // Ajusta el tamaño del botón circular
    borderRadius: 35, // Asegura que el botón sea circular (la mitad de width/height)
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10, // Asegura que esté por encima de otros elementos
  },

  addButtonContainer: {
    position: "absolute", // Hace que el contenedor sea fijo
    bottom: SPACING.lg, // Coloca el botón hacia la parte inferior
    right: SPACING.lg, // Lo alinea a la derecha
    zIndex: 10, // Asegura que esté por encima de otros elementos
  },

  addButtonText: {
    color: COLORS.white,
    fontSize: 15, // Aumenta el tamaño del texto
    fontWeight: "bold", // Puedes ajustar el peso si lo deseas
  },
  activitiesContainer: {
    marginTop: 20,
    paddingHorizontal: 16,
  },
  activitiesTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  activitiesList: {
    maxHeight: 300, // Altura máxima para el ScrollView
  },
  activityItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 8,
    backgroundColor: "#FFFFFF", // Fondo blanco para cada actividad
    borderRadius: 8, // Bordes redondeados
    borderWidth: 1,
    borderColor: "#E0E0E0", // Borde ligero
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2, // Sombra para Android
  },
  activityName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333", // Texto oscuro para el nombre de la actividad
    flex: 1, // Ocupa el espacio disponible
  },
  activityTime: {
    fontSize: 14,
    fontWeight: "500",
    color: "#007BFF", // Color azul para la hora
    marginLeft: 16,
  },
});
