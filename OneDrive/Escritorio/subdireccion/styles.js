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
  // Estilos usados en HomeScreen
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
  addButtonContainer: {
    position: "absolute",
    bottom: SPACING.lg,
    right: SPACING.lg,
  },
  addButton: {
    backgroundColor: COLORS.primary,
    width: 70,
    height: 70,
    borderRadius: 35,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
  },

  // Estilos para ActivityForm
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: 360, // Tamaño fijo en lugar de porcentaje
    height: 600, // Altura fija para un buen tamaño
    backgroundColor: COLORS.white,
    padding: SPACING.xl,
    borderRadius: BORDER_RADIUS.md,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  scrollContent: {
    paddingBottom: SPACING.xl,
    flexGrow: 1, // Permite que el contenido crezca dentro del tamaño fijo
  },
  input: {
    backgroundColor: COLORS.white, // Corregido de COLORS.md a COLORS.white
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: BORDER_RADIUS.sm,
    padding: SPACING.md,
    marginBottom: SPACING.lg,
    fontSize: 16,
    color: COLORS.text,
  },
  inputText: {
    fontSize: 16,
    color: COLORS.text,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: SPACING.lg,
  },
  saveButton: {
    flex: 1,
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.md, // Aumentado para botones más altos
    borderRadius: BORDER_RADIUS.sm,
    alignItems: "center",
    marginLeft: SPACING.md,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: COLORS.danger,
    paddingVertical: SPACING.md, // Aumentado para simetría con saveButton
    borderRadius: BORDER_RADIUS.sm,
    alignItems: "center",
    marginRight: SPACING.md,
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
    textAlign: "center", // Centrado para simetría
  },
  noteContainer: {
    backgroundColor: COLORS.white, // Simplificado, sin flexDirection ya que solo tiene un input
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.lg,
  },
  noteInput: {
    flex: 1,
    fontSize: 16,
    color: COLORS.text,
    padding: SPACING.md, // Padding uniforme
    minHeight: 80, // Aumentado para más espacio en notas
  },

  // Estilos para ActivitySummary
  summaryTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  summaryDateTime: {
    fontSize: 14,
    color: COLORS.gray,
    marginBottom: SPACING.sm,
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
  summaryCloseButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderRadius: BORDER_RADIUS.sm,
    alignItems: "center",
    justifyContent: "center",
  },
});