import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { useProgress } from '../../hooks/useProgress';
import Header from '../../components/common/Header';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ProgressBar from '../../components/common/ProgressBar';
import { colors, typography, spacing, borderRadius } from '../../styles';

const ProgressScreen = () => {
  const { user } = useContext(AuthContext);
  const { progress, statistics, loading } = useProgress(user?.uid);

  if (loading) return <LoadingSpinner />;

  return (
    <View style={styles.container}>
      <Header title="Your Progress" subtitle="Track your learning journey" />

      <ScrollView contentContainerStyle={styles.content}>
        {/* Overall Stats */}
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statIcon}>📚</Text>
            <Text style={styles.statValue}>
              {statistics?.totalCoursesEnrolled || 0}
            </Text>
            <Text style={styles.statLabel}>Courses</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statIcon}>✅</Text>
            <Text style={styles.statValue}>
              {statistics?.totalTestsCompleted || 0}
            </Text>
            <Text style={styles.statLabel}>Tests</Text>
          </View>
        </View>

        {/* Average Score */}
        <View style={styles.scoreCard}>
          <Text style={styles.scoreLabel}>Average Score</Text>
          <Text style={styles.scoreValue}>
            {statistics?.averageScore || 0}%
          </Text>
          <ProgressBar
            percentage={statistics?.averageScore || 0}
            showPercentage={false}
          />
        </View>

        {/* Course Progress */}
        <Text style={styles.sectionTitle}>Course-wise Progress</Text>
        {progress?.courses && Object.keys(progress.courses).length > 0 ? (
          Object.entries(progress.courses).map(([courseId, courseData]) => (
            <View key={courseId} style={styles.courseProgressCard}>
              <Text style={styles.courseName}>Course {courseId.substring(0, 6)}</Text>
              <ProgressBar
                percentage={courseData.completionPercentage || 0}
                label="Completion"
                showPercentage={true}
              />
              <View style={styles.courseStats}>
                <Text style={styles.courseStat}>
                  Tests: {courseData.testsCompleted || 0}
                </Text>
                <Text style={styles.courseStat}>
                  Score: {Math.round(courseData.averageScore || 0)}%
                </Text>
              </View>
            </View>
          ))
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No course progress yet</Text>
          </View>
        )}

        {/* Learning Streak */}
        <View style={styles.streakCard}>
          <Text style={styles.streakTitle}>🔥 Learning Streak</Text>
          <Text style={styles.streakDays}>0 days</Text>
          <Text style={styles.streakText}>
            Start learning daily to build your streak!
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.lg,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    alignItems: 'center',
    borderTopWidth: 4,
    borderTopColor: colors.secondary,
  },
  statIcon: {
    fontSize: 32,
    marginBottom: spacing.sm,
  },
  statValue: {
    ...typography.h2,
    color: colors.secondary,
    fontWeight: 'bold',
  },
  statLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  scoreCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    borderLeftWidth: 4,
    borderLeftColor: colors.secondary,
  },
  scoreLabel: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  scoreValue: {
    ...typography.h1,
    color: colors.secondary,
    fontWeight: 'bold',
    marginBottom: spacing.md,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.text,
    marginVertical: spacing.md,
    fontWeight: '600',
  },
  courseProgressCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  courseName: {
    ...typography.body,
    color: colors.text,
    fontWeight: '600',
    marginBottom: spacing.md,
  },
  courseStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  courseStat: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  emptyContainer: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    alignItems: 'center',
  },
  emptyText: {
    ...typography.body,
    color: colors.textSecondary,
  },
  streakCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    alignItems: 'center',
    borderTopWidth: 4,
    borderTopColor: colors.warning,
    marginTop: spacing.lg,
  },
  streakTitle: {
    ...typography.h3,
    color: colors.text,
    fontWeight: '600',
    marginBottom: spacing.md,
  },
  streakDays: {
    ...typography.h1,
    color: colors.warning,
    fontWeight: 'bold',
    marginBottom: spacing.sm,
  },
  streakText: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});

export default ProgressScreen;