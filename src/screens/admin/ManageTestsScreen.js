import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Text, FlatList, TouchableOpacity, Alert } from 'react-native';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { testService } from '../../services/testService';
import Header from '../../components/common/Header';
import CustomButton from '../../components/common/CustomButton';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { colors, typography, spacing, borderRadius } from '../../styles';

const ManageTestsScreen = ({ navigation }) => {
  const { user } = useContext(AuthContext);
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTests();
  }, [user?.uid]);

  const fetchTests = async () => {
    try {
      const result = await testService.getAllTests();
      if (result.success) {
        setTests(result.tests);
      }
    } catch (error) {
      console.error('Error fetching tests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTest = (testId) => {
    Alert.alert(
      'Delete Test',
      'Are you sure you want to delete this test?',
      [
        { text: 'Cancel' },
        {
          text: 'Delete',
          onPress: async () => {
            const result = await testService.deleteTest(testId);
            if (result.success) {
              setTests(tests.filter(t => t.id !== testId));
            }
          },
          style: 'destructive',
        },
      ]
    );
  };

  if (loading) return <LoadingSpinner />;

  const renderTestItem = ({ item }) => (
    <View style={styles.testCard}>
      <View style={styles.testHeader}>
        <View style={styles.testInfo}>
          <Text style={styles.testTitle}>{item.title}</Text>
          <Text style={styles.testMeta}>
            {item.totalQuestions} questions • {item.duration}m
          </Text>
        </View>
        <View style={styles.attemptBadge}>
          <Text style={styles.attemptText}>{item.totalAttempts} attempts</Text>
        </View>
      </View>
      <View style={styles.cardFooter}>
        <CustomButton
          title="Edit"
          variant="secondary"
          size="small"
          onPress={() => {}}
          style={styles.actionButton}
        />
        <CustomButton
          title="Delete"
          variant="error"
          size="small"
          onPress={() => handleDeleteTest(item.id)}
          style={styles.actionButton}
        />
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Header title="Manage Tests" subtitle={`${tests.length} tests`} />

      <CustomButton
        title="+ Create New Test"
        onPress={() => navigation.navigate('CreateTest')}
        style={styles.createButton}
      />

      {tests.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>📝</Text>
          <Text style={styles.emptyTitle}>No Tests Yet</Text>
        </View>
      ) : (
        <FlatList
          data={tests}
          renderItem={renderTestItem}
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
  createButton: {
    margin: spacing.lg,
  },
  listContent: {
    padding: spacing.lg,
  },
  testCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  testHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  testInfo: {
    flex: 1,
  },
  testTitle: {
    ...typography.h3,
    color: colors.text,
    fontWeight: '600',
  },
  testMeta: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  attemptBadge: {
    backgroundColor: colors.warning,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  attemptText: {
    ...typography.caption,
    color: colors.text,
    fontWeight: '600',
  },
  cardFooter: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  actionButton: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: spacing.lg,
  },
  emptyTitle: {
    ...typography.h2,
    color: colors.text,
  },
});

export default ManageTestsScreen;