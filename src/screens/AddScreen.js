import React, { useState } from "react";
import {
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  View,
} from "react-native";

export default function AddScreen({ navigation, api }) {
  const [item, setItem] = useState("");
  const [category, setCategory] = useState("General");
  const [used, setUsed] = useState("0");
  const [goal, setGoal] = useState("");
  const [unit, setUnit] = useState("");
  const [costPerUnit, setCostPerUnit] = useState("0");

  const quickUnits = ["kWh", "m³", "liters", "kg", "roll", "bottle", "pieces"];
  const quickCategories = ["Utilities", "Kitchen", "Cleaning", "Bathroom", "General"];

  const save = async () => {
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

    try {
      await api.add(payload);
      Alert.alert("✅ Success", "Tracker item added!", [
        { text: "OK", onPress: () => navigation.goBack() },
      ]);
    } catch (e) {
      Alert.alert("Error", e.message || "Failed to add tracker item");
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.headerEmoji}>🌱</Text>
          <Text style={styles.title}>Add New Tracker Item</Text>
          <Text style={styles.subtitle}>Track your energy consumption</Text>
        </View>

        <View style={styles.formCard}>
          <Text style={styles.label}>📝 Item Name</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., Electricity, Water"
            placeholderTextColor="#95a5a6"
            value={item}
            onChangeText={setItem}
          />

          <Text style={styles.label}>🏷️ Category</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., Utilities"
            placeholderTextColor="#95a5a6"
            value={category}
            onChangeText={setCategory}
          />
          <View style={styles.quickRow}>
            {quickCategories.map((c) => (
              <Pressable
                key={c}
                style={({ pressed }) => [
                  styles.chip,
                  category === c && styles.chipSelected,
                  pressed && styles.chipPressed,
                ]}
                onPress={() => setCategory(c)}
              >
                <Text style={[styles.chipText, category === c && styles.chipTextSelected]}>
                  {c}
                </Text>
              </Pressable>
            ))}
          </View>

          <Text style={styles.label}>📊 Usage Used</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., 210"
            placeholderTextColor="#95a5a6"
            keyboardType="numeric"
            value={used}
            onChangeText={setUsed}
          />

          <Text style={styles.label}>🎯 Goal</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., 350"
            placeholderTextColor="#95a5a6"
            keyboardType="numeric"
            value={goal}
            onChangeText={setGoal}
          />

          <Text style={styles.label}>📏 Unit</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., kWh"
            placeholderTextColor="#95a5a6"
            value={unit}
            onChangeText={setUnit}
          />

          <View style={styles.quickRow}>
            {quickUnits.map((u) => (
              <Pressable
                key={u}
                style={({ pressed }) => [
                  styles.chip,
                  unit === u && styles.chipSelected,
                  pressed && styles.chipPressed,
                ]}
                onPress={() => setUnit(u)}
              >
                <Text style={[styles.chipText, unit === u && styles.chipTextSelected]}>{u}</Text>
              </Pressable>
            ))}
          </View>

          <Text style={styles.label}>💰 Cost Per Unit</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., 0.30"
            placeholderTextColor="#95a5a6"
            keyboardType="numeric"
            value={costPerUnit}
            onChangeText={setCostPerUnit}
          />
        </View>

        <Pressable 
          style={({ pressed }) => [
            styles.saveButton,
            pressed && styles.saveButtonPressed,
          ]} 
          onPress={save}
        >
          <Text style={styles.saveButtonText}>💾 Save Tracker Item</Text>
        </Pressable>

        <Pressable 
          style={({ pressed }) => [
            styles.cancelButton,
            pressed && { opacity: 0.6 },
          ]} 
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
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
  quickRow: { 
    flexDirection: "row", 
    flexWrap: "wrap", 
    gap: 8, 
    marginBottom: 8,
    marginTop: 8,
  },
  chip: {
    backgroundColor: "#f8f9fa",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "#e9ecef",
  },
  chipSelected: { 
    backgroundColor: "#2ecc71",
    borderColor: "#27ae60",
  },
  chipPressed: {
    opacity: 0.7,
    transform: [{ scale: 0.96 }],
  },
  chipText: { 
    fontSize: 13, 
    fontWeight: "700", 
    color: "#6c757d",
  },
  chipTextSelected: { color: "#fff" },
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
  saveButtonText: { 
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
  cancelButtonText: { 
    color: "#95a5a6", 
    fontSize: 16, 
    fontWeight: "700",
  },
});