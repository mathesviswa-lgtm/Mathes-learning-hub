import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Text, FlatList, TouchableOpacity } from 'react-native';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import Header from '../../components/common/Header';
import CustomButton from '../../components/common/CustomButton';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { useCourses } from '../../hooks/useCourses';
import { colors, typography, spacing, borderRadius } from '../../styles';

const DashboardScreen = ({ navigation }) => {
  const { user, userData, logout } = useContext(AuthContext);
  const { courses, loading } = useCourses(user?.uid);

  if (loading) return <LoadingSpinner />;

  const handleLogout = async () => {
    await logout();
  };

  const enrolledCount = courses.length;

  return (
    <View style={styles.container}>
      <Header
        title={`Welcome, ${userData?.name}`}
        subtitle="Continue your learning journey"
        rightIcon={<Text style={styles.headerIcon}>🚪</Text>}
        onRightPress={handleLogout}
      />

      <ScrollView contentContainerStyle={styles.content}>
        {/* Stats Section */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{enrolledCount}</Text>
            <Text style={styles.statLabel}>Enrolled Courses</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>0</Text>
            <Text style={styles.statLabel}>Tests Completed</Text>
          </View>
        </View>

        {/* Quick Actions */}
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate('Courses')}
          >
            <Text style={styles.actionIcon}>📚</Text>
            <Text style={styles.actionLabel}>View Courses</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate('MockTest')}
          >
            <Text style={styles.actionIcon}>📝</Text>
            <Text style={styles.actionLabel}>Take Test</Text>
          </TouchableOpacity>
        </View>

        {/* Recent Courses */}
        <Text style={styles.sectionTitle}>Recent Courses</Text>
        {courses.length > 0 ? (
          <View>
            {courses.slice(0, 3).map((course) => (
              <TouchableOpacity
                key={course.id}
                style={styles.courseItem}
                onPress={() => navigation.navigate('CourseDetail', { courseId: course.id })}
              >
                <View style={styles.courseInfo}>
                  <Text style={styles.courseName}>{course.title}</Text>
                  <Text style={styles.courseLevel}>{course.level}</Text>
                </View>
                <Text style={styles.arrow}>›</Text>
              </TouchableOpacity>
            ))}
          </View>
        ) : (
          <Text style={styles.emptyText}>No enrolled courses yet. Start learning!</Text>
        )}
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
  statsContainer: {
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
    borderLeftWidth: 4,
    borderLeftColor: colors.secondary,
  },
  statValue: {
    ...typography.h2,
    color: colors.secondary,
    fontWeight: 'bold',
  },
  statLabel: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.text,
    marginVertical: spacing.md,
    fontWeight: '600',
  },
  actionsContainer: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  actionButton: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  actionIcon: {
    fontSize: 32,
    marginBottom: spacing.sm,
  },
  actionLabel: {
    ...typography.bodySmall,
    color: colors.text,
    fontWeight: '500',
  },
  courseItem: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderLeftWidth: 4,
    borderLeftColor: colors.secondary,
  },
  courseInfo: {
    flex: 1,
  },
  courseName: {
    ...typography.body,
    color: colors.text,
    fontWeight: '600',
  },
  courseLevel: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  arrow: {
    ...typography.h2,
    color: colors.textSecondary,
  },
  emptyText: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    marginVertical: spacing.lg,
  },
  headerIcon: {
    fontSize: 20,
  },
});

export default DashboardScreen;