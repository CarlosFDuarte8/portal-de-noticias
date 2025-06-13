import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 8,
    zIndex: 1,
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
    backgroundColor: "#fff",
  },
  searchInput: {
    backgroundColor: "#fff",
    borderRadius: 8,
  },
  searchInputText: {
    color: "#0f172a",
  },
  listContent: {
    paddingTop: 8,
    paddingBottom: 24,
  },
  listContainer: {
    flex: 1,
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
  scrollToTopButton: {
    position: "absolute",
    top: 70,
    left: 0,
    right: 0,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 5,
  },
  scrollToTopButtonInner: {
    backgroundColor: "#3b82f6",
    width: 150,
    height: 30,
    borderRadius: 8,
    justifyContent: "space-evenly",
    alignItems: "center",
    flexDirection: "row",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 6,
  },
  scrollToTopIcon: {
    color: "#fff",
  },
  scrollToTopText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
});
