import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Pressable,
  TextInput,
  Alert,
  RefreshControl,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";

export default function HomeScreen({ navigation, api }) {
  const [trackerItems, setTrackerItems] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  const load = async () => {
    try {
      const data = await api.getAll();
      setTrackerItems(Array.isArray(data) ? data : []);
    } catch (e) {
      Alert.alert("Error", e.message || "Failed to load tracker items");
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      load();
    }, [])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  };

  const confirmDelete = (item) => {
    Alert.alert("⚠️ Delete?", `Delete "${item.item}"?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await api.remove(item.id);
            load();
          } catch (e) {
            Alert.alert("Delete Failed", e.message || "Could not delete item");
          }
        },
      },
    ]);
  };

  const filteredItems = trackerItems.filter((t) =>
    (t.item || "").toLowerCase().includes(searchText.toLowerCase())
  );

  const getProgressColor = (used, goal) => {
    const percentage = (used / goal) * 100;
    if (percentage <= 50) return "#2ecc71";
    if (percentage <= 80) return "#f39c12";
    return "#e74c3c";
  };

  const renderItem = ({ item }) => {
    const percentage = ((item.used / item.goal) * 100).toFixed(1);
    const progressColor = getProgressColor(item.used, item.goal);

    return (
      <View style={styles.itemCard}>
        <View style={[styles.progressBar, { backgroundColor: `${progressColor}20` }]}>
          <View 
            style={[
              styles.progressFill, 
              { 
                width: `${Math.min(percentage, 100)}%`,
                backgroundColor: progressColor 
              }
            ]} 
          />
        </View>

        <View style={styles.cardHeader}>
          <View style={styles.itemNameContainer}>
            <Text style={styles.itemName}>{item.item}</Text>
            <View style={[styles.categoryBadge, { backgroundColor: `${progressColor}20` }]}>
              <Text style={[styles.categoryText, { color: progressColor }]}>
                {item.category}
              </Text>
            </View>
          </View>
          <Text style={[styles.percentage, { color: progressColor }]}>
            {percentage}%
          </Text>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Used</Text>
            <Text style={styles.statValue}>{item.used} {item.unit}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Goal</Text>
            <Text style={styles.statValue}>{item.goal} {item.unit}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Cost/Unit</Text>
            <Text style={styles.statValue}>${item.costPerUnit}</Text>
          </View>
        </View>

        <View style={styles.buttonRow}>
          <Pressable 
            style={({ pressed }) => [
              styles.editButton,
              pressed && styles.buttonPressed
            ]} 
            onPress={() => navigation.navigate("Edit", { item })}
          >
            <Text style={styles.buttonText}>✏️ Edit</Text>
          </Pressable>

          <Pressable 
            style={({ pressed }) => [
              styles.deleteButton,
              pressed && styles.buttonPressed
            ]} 
            onPress={() => confirmDelete(item)}
          >
            <Text style={styles.buttonText}>🗑️ Delete</Text>
          </Pressable>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerGradient}>
        <TextInput
          style={styles.searchInput}
          placeholder="🔍 Search items..."
          placeholderTextColor="#95a5a6"
          value={searchText}
          onChangeText={setSearchText}
        />

        <View style={styles.actionButtons}>
          <Pressable 
            style={({ pressed }) => [
              styles.addBtn,
              pressed && styles.buttonPressed
            ]} 
            onPress={() => navigation.navigate("Add")}
          >
            <Text style={styles.addBtnText}>+ Add New Tracker</Text>
          </Pressable>

          <Pressable 
            style={({ pressed }) => [
              styles.summaryBtn,
              pressed && styles.buttonPressed
            ]} 
            onPress={() => navigation.navigate("Summary")}
          >
            <Text style={styles.summaryBtnText}>📊 View Summary</Text>
          </Pressable>
        </View>
      </View>

      <FlatList
        data={filteredItems}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderItem}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh}
            tintColor="#2ecc71"
            colors={["#2ecc71"]}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyEmoji}>🌱</Text>
            <Text style={styles.emptyText}>No items found.</Text>
            <Text style={styles.emptySubtext}>Start tracking your energy usage!</Text>
          </View>
        }
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#f0f4f3",
  },
  headerGradient: {
    backgroundColor: "#fff",
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  searchInput: {
    backgroundColor: "#f8f9fa",
    borderRadius: 16,
    padding: 14,
    fontSize: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: "#e9ecef",
    color: "#2c3e50",
  },
  actionButtons: {
    flexDirection: "row",
    gap: 10,
  },
  addBtn: {
    flex: 1,
    backgroundColor: "#2ecc71",
    padding: 16,
    borderRadius: 16,
    alignItems: "center",
    shadowColor: "#2ecc71",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  addBtnText: { 
    color: "#fff", 
    fontWeight: "900", 
    fontSize: 15,
    letterSpacing: 0.3,
  },
  summaryBtn: {
    flex: 1,
    backgroundColor: "#0d3b2a",
    padding: 16,
    borderRadius: 16,
    alignItems: "center",
    shadowColor: "#0d3b2a",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  summaryBtnText: { 
    color: "#2ecc71", 
    fontWeight: "900", 
    fontSize: 15,
    letterSpacing: 0.3,
  },
  itemCard: {
    backgroundColor: "#fff",
    marginHorizontal: 20,
    marginTop: 16,
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  progressBar: {
    height: 6,
    width: "100%",
    position: "relative",
  },
  progressFill: {
    height: "100%",
    borderRadius: 4,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    padding: 18,
    paddingBottom: 12,
  },
  itemNameContainer: {
    flex: 1,
  },
  itemName: { 
    fontSize: 20, 
    fontWeight: "900", 
    color: "#2c3e50", 
    marginBottom: 8,
    letterSpacing: -0.3,
  },
  categoryBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  percentage: {
    fontSize: 24,
    fontWeight: "900",
    marginLeft: 12,
  },
  statsRow: {
    flexDirection: "row",
    paddingHorizontal: 18,
    paddingVertical: 16,
    backgroundColor: "#f8f9fa",
  },
  statBox: {
    flex: 1,
    alignItems: "center",
  },
  statLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: "#95a5a6",
    marginBottom: 4,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  statValue: {
    fontSize: 14,
    fontWeight: "800",
    color: "#2c3e50",
  },
  divider: {
    width: 1,
    backgroundColor: "#dee2e6",
    marginHorizontal: 8,
  },
  buttonRow: { 
    flexDirection: "row", 
    padding: 18,
    paddingTop: 12,
    gap: 12,
  },
  editButton: { 
    flex: 1,
    backgroundColor: "#f39c12",
    padding: 14,
    borderRadius: 14,
    alignItems: "center",
    shadowColor: "#f39c12",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 2,
  },
  deleteButton: { 
    flex: 1,
    backgroundColor: "#e74c3c",
    padding: 14,
    borderRadius: 14,
    alignItems: "center",
    shadowColor: "#e74c3c",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 2,
  },
  buttonText: { 
    color: "#fff", 
    fontWeight: "900", 
    fontSize: 14,
    letterSpacing: 0.3,
  },
  buttonPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 100,
    paddingHorizontal: 40,
  },
  emptyEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyText: { 
    fontSize: 20,
    fontWeight: "700",
    color: "#95a5a6",
    marginBottom: 8,  
  },
  emptySubtext: {
    fontSize: 14,
    color: "#bdc3c7",
    textAlign: "center",
  },
});