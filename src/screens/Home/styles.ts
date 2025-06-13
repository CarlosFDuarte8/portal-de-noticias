import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    // paddingHorizontal: 8,
  },
  header: {
    paddingTop: 8,
    zIndex: 1,
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
    backgroundColor: "#fff",
  },
  searchInput: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 8,
    // height: 48,
    // shadowColor: "#000",
    // shadowOffset: { width: 0, height: 1 },
    // shadowOpacity: 0.05,
    // shadowRadius: 3,
  },
  searchInputText: {
    color: "#0f172a",
    // fontSize: 16,
  },
  listContent: {
    paddingTop: 16,
    paddingBottom: 24,
  },
  loader: {
    marginVertical: 24,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  errorText: {
    color: "#0f172a",
    fontSize: 16,
    marginTop: 16,
    textAlign: "center",
    lineHeight: 24,
  },
  retryButton: {
    marginTop: 24,
    backgroundColor: "#3b82f6",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 48,
  },
  emptyText: {
    color: "#64748b",
    fontSize: 16,
    marginTop: 16,
    textAlign: "center",
  },
});