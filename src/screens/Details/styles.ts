import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  headerBackground: {
    flex: 1,
    borderBottomWidth: 1,
  },
  headerRightContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  imageContainer: {
    width: "100%",
    height: 350,
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  imagePlaceholder: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  imageGradient: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    height: 100,
  },
  contentContainer: {
    padding: 24,
    paddingTop: 16,
    marginTop: -20,
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  sourceContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  sourceText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#3b82f6",
  },
  divider: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#cbd5e1",
    marginHorizontal: 8,
  },
  dateText: {
    fontSize: 14,
    color: "#64748b",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#0f172a",
    lineHeight: 32,
    marginBottom: 16,
  },
  authorContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  authorText: {
    fontSize: 14,
    color: "#64748b",
    marginLeft: 8,
  },
  description: {
    fontSize: 18,
    lineHeight: 28,
    color: "#334155",
    marginBottom: 24,
    fontWeight: "500",
  },
  content: {
    fontSize: 16,
    lineHeight: 26,
    color: "#475569",
    marginBottom: 32,
  },
  readMoreButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 12,
  },
  readMoreText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#3b82f6",
    marginRight: 8,
  },
});