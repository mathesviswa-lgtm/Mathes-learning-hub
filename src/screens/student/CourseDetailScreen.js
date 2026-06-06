import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { courseService } from '../../services/courseService';
import { testService } from '../../services/testService';
import { materialService } from '../../services/materialService';
import Header from '../../components/common/Header';
import CustomButton from '../../components/common/CustomButton';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ProgressBar from '../../components/common/ProgressBar';
import { colors, typography, spacing, borderRadius } from '../../styles';

const CourseDetailScreen = ({ route, navigation }) => {
  const { courseId } = route.params;
  const [course, setCourse] = useState(null);
  const [tests, setTests] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourseData();
  }, [courseId]);

  const fetchCourseData = async () => {
    try {
      const courseResult = await courseService.getCourseById(courseId);
      const testsResult = await testService.getTestsByCourse(courseId);
      const materialsResult = await materialService.getMaterialsByCourse(courseId);

      if (courseResult.success) setCourse(courseResult.course);
      if (testsResult.success) setTests(testsResult.tests);
      if (materialsResult.success) setMaterials(materialsResult.materials);
    } catch (error) {
      console.error('Error fetching course data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  if (!course) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Course not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header title={course.title} subtitle={course.level} />

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.descriptionCard}>
          <Text style={styles.descriptionLabel}>About</Text>
          <Text style={styles.description}>{course.description}</Text>
        </View>

        <ProgressBar
          percentage={75}
          label="Course Progress"
          showPercentage={true}
        />

        {/* Study Materials Section */}
        {materials.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>📖 Study Materials</Text>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('StudyMaterials', { courseId })
                }
              >
                <Text style={styles.viewAllText}>View All</Text>
              </TouchableOpacity>
            </View>
            {materials.slice(0, 2).map((material) => (
              <TouchableOpacity
                key={material.id}
                style={styles.materialItem}
                onPress={() =>
                  navigation.navigate('StudyMaterials', { materialId: material.id })
                }
              >
                <Text style={styles.materialIcon}>📄</Text>
                <View style={styles.materialInfo}>
                  <Text style={styles.materialTitle}>{material.title}</Text>
                  <Text style={styles.materialSize}>
                    {Math.round(material.fileSize / 1024)} KB
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Tests Section */}
        {tests.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>✏️ Tests</Text>
              <TouchableOpacity
                onPress={() => navigation.navigate('MockTest', { courseId })}
              >
                <Text style={styles.viewAllText}>View All</Text>
              </TouchableOpacity>
            </View>
            {tests.slice(0, 2).map((test) => (
              <TouchableOpacity
                key={test.id}
                style={styles.testItem}
                onPress={() =>
                  navigation.navigate('TestQuestions', {
                    testId: test.id,
                  })
                }
              >
                <View style={styles.testInfo}>
                  <Text style={styles.testTitle}>{test.title}</Text>
                  <Text style={styles.testMeta}>
                    {test.totalQuestions} questions • {test.duration} mins
                  </Text>
                </View>
                <Text style={styles.arrow}>›</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <CustomButton
          title="Continue Learning"
          onPress={() => navigation.goBack()}
          style={styles.button}
        />
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
  descriptionCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.lg,
    borderLeftWidth: 4,
    borderLeftColor: colors.secondary,
  },
  descriptionLabel: {
    ...typography.bodySmall,
    color: colors.secondary,
    fontWeight: '600',
    marginBottom: spacing.sm,
  },
  description: {
    ...typography.body,
    color: colors.text,
    lineHeight: 20,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.text,
    fontWeight: '600',
  },
  viewAllText: {
    ...typography.bodySmall,
    color: colors.secondary,
    fontWeight: '600',
  },
  materialItem: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
  },
  materialIcon: {
    fontSize: 24,
    marginRight: spacing.md,
  },
  materialInfo: {
    flex: 1,
  },
  materialTitle: {
    ...typography.body,
    color: colors.text,
    fontWeight: '500',
  },
  materialSize: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  testItem: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderLeftWidth: 4,
    borderLeftColor: colors.success,
  },
  testInfo: {
    flex: 1,
  },
  testTitle: {
    ...typography.body,
    color: colors.text,
    fontWeight: '600',
  },
  testMeta: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  arrow: {
    ...typography.h2,
    color: colors.textSecondary,
  },
  button: {
    marginTop: spacing.lg,
  },
  errorContainer: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    ...typography.body,
    color: colors.error,
  },
});

export default CourseDetailScreen;