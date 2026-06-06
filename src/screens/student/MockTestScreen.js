import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Text, TouchableOpacity, FlatList } from 'react-native';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { testService } from '../../services/testService';
import Header from '../../components/common/Header';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { colors, typography, spacing, borderRadius } from '../../styles';

const MockTestScreen = ({ route, navigation }) => {
  const { courseId } = route.params || {};
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTests();
  }, [courseId]);

  const fetchTests = async () => {
    try {
      let result;
      if (courseId) {
        result = await testService.getTestsByCourse(courseId);
      } else {
        result = await testService.getAllTests();
      }
      if (result.success) {
        setTests(result.tests);
      }
    } catch (error) {
      console.error('Error fetching tests:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  const renderTestCard = ({ item }) => (
    <TouchableOpacity
      style={styles.testCard}
      onPress={() =>
        navigation.navigate('TestQuestions', { testId: item.id })
      }
      activeOpacity={0.8}
    >
      <View style={styles.testHeader}>
        <View style={styles.testTitleContainer}>
          <Text style={styles.testTitle}>{item.title}</Text>
          <Text style={styles.testDescription} numberOfLines={1}>
            {item.description}
          </Text>
        </View>
        <View style={styles.difficultyBadge}>
          <Text style={styles.difficultyText}>⭐</Text>
        </View>
      </View>
      <View style={styles.testStats}>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Questions</Text>
          <Text style={styles.statValue}>{item.totalQuestions || 0}</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Duration</Text>
          <Text style={styles.statValue}>{item.duration || 0}m</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Attempts</Text>
          <Text style={styles.statValue}>{item.totalAttempts || 0}</Text>
        </View>
      </View>
      <View style={styles.testFooter}>
        <Text style={styles.startText}>Start Test ›</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Header title="Mock Tests" subtitle={`${tests.length} tests available`} />

      {tests.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>❌</Text>
          <Text style={styles.emptyTitle}>No Tests Available</Text>
          <Text style={styles.emptyText}>Tests will appear here soon</Text>
        </View>
      ) : (
        <FlatList
          data={tests}
          renderItem={renderTestCard}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  listContent: {
    padding: spacing.lg,
  },
  testCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderLeftWidth: 4,
    borderLeftColor: colors.warning,
  },
  testHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  testTitleContainer: {
    flex: 1,
    marginRight: spacing.md,
  },
  testTitle: {
    ...typography.h3,
    color: colors.text,
    fontWeight: '600',
  },
  testDescription: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  difficultyBadge: {
    backgroundColor: colors.warning,
    borderRadius: borderRadius.md,
    padding: spacing.sm,
    minWidth: 40,
    alignItems: 'center',
  },
  difficultyText: {
    fontSize: 16,
  },
  testStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: colors.primaryDark,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  statValue: {
    ...typography.h3,
    color: colors.secondary,
    fontWeight: '600',
    marginTop: spacing.xs,
  },
  testFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  startText: {
    ...typography.body,
    color: colors.secondary,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: spacing.lg,
  },
  emptyTitle: {
    ...typography.h2,
    color: colors.text,
    marginBottom: spacing.md,
  },
  emptyText: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});

export default MockTestScreen;