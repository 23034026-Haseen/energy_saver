import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";

export default function EditScreen({ route, navigation, api }) {
  const row = route.params?.item;

  if (!row) return null;

  const [item, setItem] = useState(row.item ?? "");
  const [category, setCategory] = useState(row.category ?? "General");
  const [used, setUsed] = useState(String(row.used ?? 0));
  const [goal, setGoal] = useState(String(row.goal ?? 0));
  const [unit, setUnit] = useState(row.unit ?? "");
  const [costPerUnit, setCostPerUnit] = useState(String(row.costPerUnit ?? 0));
  const [loading, setLoading] = useState(false);

  const update = async () => {
    if (!item.trim() || !goal.trim() || !unit.trim()) {
      Alert.alert("Missing Fields", "Please fill in Item, Goal and Unit.");
      return;
    }

    const payload = {
      item: item.trim(),
      category: category?.trim() || "General",
      used: Number(used || 0),
      goal: Number(goal || 0),
      unit: unit.trim(),
      costPerUnit: Number(costPerUnit || 0),
    };

    setLoading(true);
    try {
      await api.update(row.id, payload);
      Alert.alert("✅ Updated", "Item updated successfully!", [
        { text: "OK", onPress: () => navigation.goBack() },
      ]);
    } catch (e) {
      Alert.alert("Update Failed", e.message || "Could not update item");
    } finally {
      setLoading(false);
    }
  };

  const remove = async () => {
    Alert.alert("⚠️ Delete Item?", `Delete "${item}" permanently?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          setLoading(true);
          try {
            await api.remove(row.id);
            Alert.alert("🗑️ Deleted", "Item removed!", [
              { text: "OK", onPress: () => navigation.goBack() },
            ]);
          } catch (e) {
            Alert.alert("Delete Failed", e.message || "Could not delete item");
          } finally {
            setLoading(false);
          }
        },
      },
    ]);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.headerEmoji}>✏️</Text>
          <Text style={styles.title}>Edit Tracker Item</Text>
          <Text style={styles.subtitle}>Update your tracking details</Text>
        </View>

        <View style={styles.formCard}>
          <Text style={styles.label}>📝 Item Name</Text>
          <TextInput 
            style={styles.input} 
            value={item} 
            onChangeText={setItem}
            placeholderTextColor="#95a5a6"
          />

          <Text style={styles.label}>🏷️ Category</Text>
          <TextInput 
            style={styles.input} 
            value={category} 
            onChangeText={setCategory}
            placeholderTextColor="#95a5a6"
          />

          <Text style={styles.label}>📊 Usage Used</Text>
          <TextInput 
            style={styles.input} 
            keyboardType="numeric" 
            value={used} 
            onChangeText={setUsed}
            placeholderTextColor="#95a5a6"
          />

          <Text style={styles.label}>🎯 Goal</Text>
          <TextInput 
            style={styles.input} 
            keyboardType="numeric" 
            value={goal} 
            onChangeText={setGoal}
            placeholderTextColor="#95a5a6"
          />

          <Text style={styles.label}>📏 Unit</Text>
          <TextInput 
            style={styles.input} 
            value={unit} 
            onChangeText={setUnit}
            placeholderTextColor="#95a5a6"
          />

          <Text style={styles.label}>💰 Cost Per Unit</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={costPerUnit}
            onChangeText={setCostPerUnit}
            placeholderTextColor="#95a5a6"
          />
        </View>

        <Pressable 
          style={({ pressed }) => [
            styles.saveButton,
            pressed && styles.saveButtonPressed,
            loading && styles.disabledButton,
          ]} 
          onPress={update} 
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.saveText}>✅ Save Changes</Text>
          )}
        </Pressable>

        <Pressable 
          style={({ pressed }) => [
            styles.deleteButton,
            pressed && styles.deleteButtonPressed,
            loading && styles.disabledButton,
          ]} 
          onPress={remove} 
          disabled={loading}
        >
          <Text style={styles.deleteText}>🗑️ Delete Item</Text>
        </Pressable>

        <Pressable 
          style={({ pressed }) => [
            styles.cancelButton,
            pressed && { opacity: 0.6 },
          ]} 
          onPress={() => navigation.goBack()} 
          disabled={loading}
        >
          <Text style={styles.cancelText}>Cancel</Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f0f4f3" },
  scrollView: { flex: 1 },
  scrollContent: { paddingBottom: 40 },
  header: {
    backgroundColor: "#0d3b2a",
    paddingTop: 30,
    paddingBottom: 40,
    paddingHorizontal: 20,
    alignItems: "center",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerEmoji: {
    fontSize: 48,
    marginBottom: 12,
  },
  title: { 
    fontSize: 26, 
    fontWeight: "900", 
    color: "#fff",
    marginBottom: 6,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 14,
    color: "#2ecc71",
    fontWeight: "600",
  },
  formCard: {
    backgroundColor: "#fff",
    marginHorizontal: 20,
    marginTop: -20,
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  label: { 
    fontSize: 15, 
    fontWeight: "700", 
    color: "#2c3e50", 
    marginBottom: 10,
    marginTop: 16,
  },
  input: {
    borderWidth: 2,
    borderColor: "#e9ecef",
    borderRadius: 14,
    padding: 16,
    fontSize: 16,
    backgroundColor: "#f8f9fa",
    marginBottom: 8,
    color: "#2c3e50",
  },
  saveButton: { 
    backgroundColor: "#2ecc71",
    marginHorizontal: 20,
    marginTop: 24,
    padding: 18,
    borderRadius: 16,
    alignItems: "center",
    shadowColor: "#2ecc71",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 6,
  },
  saveButtonPressed: {
    backgroundColor: "#27ae60",
    transform: [{ scale: 0.98 }],
  },
  saveText: { 
    color: "#fff", 
    fontSize: 18, 
    fontWeight: "900",
    letterSpacing: 0.5,
  },
  deleteButton: { 
    backgroundColor: "#e74c3c",
    marginHorizontal: 20,
    marginTop: 12,
    padding: 18,
    borderRadius: 16,
    alignItems: "center",
    shadowColor: "#e74c3c",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 6,
  },
  deleteButtonPressed: {
    backgroundColor: "#c0392b",
    transform: [{ scale: 0.98 }],
  },
  deleteText: { 
    color: "#fff", 
    fontSize: 18, 
    fontWeight: "900",
    letterSpacing: 0.5,
  },
  cancelButton: { 
    marginHorizontal: 20,
    padding: 16,
    alignItems: "center",
    marginTop: 12,
  },
  cancelText: { 
    color: "#95a5a6", 
    fontSize: 16, 
    fontWeight: "700",
  },
  disabledButton: {
    opacity: 0.6,
  },
});