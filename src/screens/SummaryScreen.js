import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, RefreshControl, Alert } from "react-native";
import { useFocusEffect } from "@react-navigation/native";

export default function SummaryScreen({ api }) {
  const [rows, setRows] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const load = async () => {
    try {
      const data = await api.getAll();
      setRows(Array.isArray(data) ? data : []);
    } catch (e) {
      Alert.alert("Error", e.message || "Failed to load summary");
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

  const toNum = (v) => Number(v || 0);

  const totalUsedCost = rows.reduce((sum, r) => sum + toNum(r.used) * toNum(r.costPerUnit), 0);
  const totalGoalCost = rows.reduce((sum, r) => sum + toNum(r.goal) * toNum(r.costPerUnit), 0);
  const potentialSavings = Math.max(totalGoalCost - totalUsedCost, 0);
  const savingsPercentage = totalGoalCost > 0 ? ((potentialSavings / totalGoalCost) * 100).toFixed(1) : 0;

  // Calculate category breakdown
  const categoryStats = rows.reduce((acc, item) => {
    const cat = item.category || "General";
    if (!acc[cat]) {
      acc[cat] = { count: 0, cost: 0 };
    }
    acc[cat].count += 1;
    acc[cat].cost += toNum(item.used) * toNum(item.costPerUnit);
    return acc;
  }, {});

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 30 }}
      refreshControl={
        <RefreshControl 
          refreshing={refreshing} 
          onRefresh={onRefresh}
          tintColor="#2ecc71"
          colors={["#2ecc71"]}
        />
      }
    >
      <View style={styles.header}>
        <Text style={styles.headerEmoji}>📊</Text>
        <Text style={styles.title}>Usage Summary</Text>
        <Text style={styles.subtitle}>Your energy tracking overview</Text>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.primaryCard}>
          <View style={styles.savingsIcon}>
            <Text style={styles.savingsEmoji}>💰</Text>
          </View>
          <Text style={styles.primaryValue}>${potentialSavings.toFixed(2)}</Text>
          <Text style={styles.primaryLabel}>Potential Savings</Text>
          <View style={styles.percentageBadge}>
            <Text style={styles.percentageText}>{savingsPercentage}% saved</Text>
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.statCard}>
            <Text style={styles.statIcon}>📦</Text>
            <Text style={styles.statValue}>{rows.length}</Text>
            <Text style={styles.statLabel}>Total Items</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statIcon}>📈</Text>
            <Text style={styles.statValue}>${totalUsedCost.toFixed(2)}</Text>
            <Text style={styles.statLabel}>Current Cost</Text>
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.statCard}>
            <Text style={styles.statIcon}>🎯</Text>
            <Text style={styles.statValue}>${totalGoalCost.toFixed(2)}</Text>
            <Text style={styles.statLabel}>Goal Cost</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statIcon}>🌱</Text>
            <Text style={styles.statValue}>
              {Object.keys(categoryStats).length}
            </Text>
            <Text style={styles.statLabel}>Categories</Text>
          </View>
        </View>

        {Object.keys(categoryStats).length > 0 && (
          <View style={styles.categorySection}>
            <Text style={styles.sectionTitle}>📋 Category Breakdown</Text>
            {Object.entries(categoryStats).map(([category, stats]) => (
              <View key={category} style={styles.categoryCard}>
                <View style={styles.categoryHeader}>
                  <Text style={styles.categoryName}>{category}</Text>
                  <Text style={styles.categoryCount}>{stats.count} items</Text>
                </View>
                <Text style={styles.categoryCost}>${stats.cost.toFixed(2)}</Text>
              </View>
            ))}
          </View>
        )}

        <View style={styles.infoCard}>
          <Text style={styles.infoIcon}>💡</Text>
          <Text style={styles.infoText}>
            Keep tracking your usage to maximize savings and reduce your environmental impact!
          </Text>
        </View>

        <Text style={styles.note}>🔄 Pull down to refresh your summary</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#f0f4f3",
  },
  header: {
    backgroundColor: "#0d3b2a",
    paddingTop: 40,
    paddingBottom: 50,
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
    fontSize: 28, 
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
  statsContainer: {
    paddingHorizontal: 20,
    marginTop: -30,
  },
  primaryCard: {
    backgroundColor: "#2ecc71",
    borderRadius: 24,
    padding: 28,
    alignItems: "center",
    marginBottom: 16,
    shadowColor: "#2ecc71",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
  },
  savingsIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  savingsEmoji: {
    fontSize: 32,
  },
  primaryValue: {
    fontSize: 42,
    fontWeight: "900",
    color: "#fff",
    marginBottom: 6,
    letterSpacing: -1,
  },
  primaryLabel: {
    fontSize: 16,
    fontWeight: "700",
    color: "rgba(255, 255, 255, 0.9)",
    marginBottom: 12,
  },
  percentageBadge: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  percentageText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "800",
  },
  row: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  statIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  statValue: {
    fontSize: 22,
    fontWeight: "900",
    color: "#2c3e50",
    marginBottom: 4,
    letterSpacing: -0.5,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: "#95a5a6",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  categorySection: {
    marginTop: 8,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#2c3e50",
    marginBottom: 12,
    marginTop: 8,
  },
  categoryCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  categoryHeader: {
    flex: 1,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: "800",
    color: "#2c3e50",
    marginBottom: 4,
  },
  categoryCount: {
    fontSize: 12,
    fontWeight: "600",
    color: "#95a5a6",
  },
  categoryCost: {
    fontSize: 18,
    fontWeight: "900",
    color: "#2ecc71",
  },
  infoCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    marginTop: 8,
    marginBottom: 16,
    flexDirection: "row",
    alignItems: "center",
    borderLeftWidth: 4,
    borderLeftColor: "#2ecc71",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  infoIcon: {
    fontSize: 32,
    marginRight: 16,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
    color: "#6c757d",
    fontWeight: "600",
  },
  note: { 
    textAlign: "center", 
    color: "#95a5a6",
    fontSize: 13,
    fontWeight: "600",
    marginTop: 8,
  },
});