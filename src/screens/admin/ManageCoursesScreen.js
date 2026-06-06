import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Text, FlatList, TouchableOpacity, Alert } from 'react-native';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { courseService } from '../../services/courseService';
import Header from '../../components/common/Header';
import CustomButton from '../../components/common/CustomButton';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { colors, typography, spacing, borderRadius } from '../../styles';

const ManageCoursesScreen = ({ navigation }) => {
  const { user } = useContext(AuthContext);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourses();
  }, [user?.uid]);

  const fetchCourses = async () => {
    try {
      const result = await courseService.getCoursesByAdmin(user?.uid);
      if (result.success) {
        setCourses(result.courses);
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCourse = (courseId) => {
    Alert.alert(
      'Delete Course',
      'Are you sure you want to delete this course? This action cannot be undone.',
      [
        { text: 'Cancel', onPress: () => {} },
        {
          text: 'Delete',
          onPress: async () => {
            const result = await courseService.deleteCourse(courseId);
            if (result.success) {
              setCourses(courses.filter(c => c.id !== courseId));
              Alert.alert('Success', 'Course deleted successfully');
            }
          },
          style: 'destructive',
        },
      ]
    );
  };

  if (loading) return <LoadingSpinner />;

  const renderCourseItem = ({ item }) => (
    <View style={styles.courseCard}>
      <View style={styles.courseHeader}>
        <View style={styles.courseInfo}>
          <Text style={styles.courseTitle}>{item.title}</Text>
          <Text style={styles.courseLevel}>{item.level}</Text>
        </View>
        <View style={styles.enrollBadge}>
          <Text style={styles.enrollText}>{item.enrolledStudents} students</Text>
        </View>
      </View>
      <Text style={styles.description} numberOfLines={2}>
        {item.description}
      </Text>
      <View style={styles.cardFooter}>
        <CustomButton
          title="Edit"
          variant="secondary"
          size="small"
          onPress={() => navigation.navigate('CreateCourse', { courseId: item.id })}
          style={styles.actionButton}
        />
        <CustomButton
          title="Delete"
          variant="error"
          size="small"
          onPress={() => handleDeleteCourse(item.id)}
          style={styles.actionButton}
        />
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Header title="Manage Courses" subtitle={`${courses.length} courses`} />

      <CustomButton
        title="+ Create New Course"
        onPress={() => navigation.navigate('CreateCourse')}
        style={styles.createButton}
      />

      {courses.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>📚</Text>
          <Text style={styles.emptyTitle}>No Courses Yet</Text>
          <Text style={styles.emptyText}>Create your first course to get started</Text>
        </View>
      ) : (
        <FlatList
          data={courses}
          renderItem={renderCourseItem}
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
  courseInfo: {
    flex: 1,
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
  },
  enrollBadge: {
    backgroundColor: colors.secondary,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  enrollText: {
    ...typography.caption,
    color: colors.text,
    fontWeight: '600',
  },
  description: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginBottom: spacing.md,
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

export default ManageCoursesScreen;