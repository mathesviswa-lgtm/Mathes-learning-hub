import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Text, TouchableOpacity, FlatList } from 'react-native';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import Header from '../../components/common/Header';
import CustomButton from '../../components/common/CustomButton';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { useCourses } from '../../hooks/useCourses';
import { colors, typography, spacing, borderRadius } from '../../styles';

const CoursesScreen = ({ navigation }) => {
  const { user } = useContext(AuthContext);
  const { courses, loading } = useCourses(user?.uid);

  if (loading) return <LoadingSpinner />;

  const renderCourseCard = ({ item }) => (
    <TouchableOpacity
      style={styles.courseCard}
      onPress={() => navigation.navigate('CourseDetail', { courseId: item.id })}
      activeOpacity={0.8}
    >
      <View style={styles.courseHeader}>
        <View style={styles.courseTitleContainer}>
          <Text style={styles.courseTitle}>{item.title}</Text>
          <Text style={styles.courseLevel}>{item.level}</Text>
        </View>
        <View style={styles.progressBadge}>
          <Text style={styles.progressText}>{item.progress?.completionPercentage || 0}%</Text>
        </View>
      </View>
      <Text style={styles.courseDescription} numberOfLines={2}>
        {item.description}
      </Text>
      <View style={styles.courseFooter}>
        <Text style={styles.enrolledInfo}>👥 {item.enrolledStudents || 0} students</Text>
        <Text style={styles.continueText}>Continue ›</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Header title="My Courses" subtitle={`${courses.length} courses`} />

      {courses.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>📚</Text>
          <Text style={styles.emptyTitle}>No Courses Yet</Text>
          <Text style={styles.emptyText}>
            Explore available courses to start learning
          </Text>
          <CustomButton
            title="Browse Courses"
            onPress={() => {}}
            style={styles.emptyButton}
          />
        </View>
      ) : (
        <FlatList
          data={courses}
          renderItem={renderCourseCard}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          scrollEnabled={true}
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
  courseCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderLeftWidth: 4,
    borderLeftColor: colors.secondary,
  },
  courseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  courseTitleContainer: {
    flex: 1,
    marginRight: spacing.md,
  },
  courseTitle: {
    ...typography.h3,
    color: colors.text,
    fontWeight: '600',
  },
  courseLevel: {
    ...typography.caption,
    color: colors.secondary,
    marginTop: spacing.xs,
    fontWeight: '500',
  },
  progressBadge: {
    backgroundColor: colors.secondary,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    minWidth: 50,
    alignItems: 'center',
  },
  progressText: {
    ...typography.body,
    color: colors.text,
    fontWeight: '600',
  },
  courseDescription: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  courseFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  enrolledInfo: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  continueText: {
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
    marginBottom: spacing.xl,
  },
  emptyButton: {
    width: '100%',
  },
});

export default CoursesScreen;