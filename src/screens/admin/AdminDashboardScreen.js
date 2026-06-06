import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Text, FlatList, TouchableOpacity } from 'react-native';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import Header from '../../components/common/Header';
import CustomButton from '../../components/common/CustomButton';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { progressService } from '../../services/progressService';
import { colors, typography, spacing, borderRadius } from '../../styles';

const AdminDashboardScreen = ({ navigation }) => {
  const { user } = useContext(AuthContext);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, [user?.uid]);

  const fetchAnalytics = async () => {
    try {
      const result = await progressService.getAdminAnalytics(user?.uid);
      if (result.success) {
        setAnalytics(result.analytics);
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <View style={styles.container}>
      <Header
        title="Admin Dashboard"
        subtitle="Manage your learning platform"
      />

      <ScrollView contentContainerStyle={styles.content}>
        {/* Stats Cards */}
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statIcon}>📚</Text>
            <Text style={styles.statValue}>{analytics?.totalCourses || 0}</Text>
            <Text style={styles.statLabel}>Courses</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statIcon}>👥</Text>
            <Text style={styles.statValue}>
              {analytics?.totalEnrolledStudents || 0}
            </Text>
            <Text style={styles.statLabel}>Students</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statIcon}>📝</Text>
            <Text style={styles.statValue}>{analytics?.totalTests || 0}</Text>
            <Text style={styles.statLabel}>Tests</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statIcon}>📄</Text>
            <Text style={styles.statValue}>
              {analytics?.totalMaterials || 0}
            </Text>
            <Text style={styles.statLabel}>Materials</Text>
          </View>
        </View>

        {/* Quick Actions */}
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionsGrid}>
          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => navigation.navigate('CreateCourse')}
          >
            <Text style={styles.actionIcon}>➕</Text>
            <Text style={styles.actionLabel}>Create Course</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => navigation.navigate('CreateTest')}
          >
            <Text style={styles.actionIcon}>✏️</Text>
            <Text style={styles.actionLabel}>Create Test</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => navigation.navigate('UploadMaterials')}
          >
            <Text style={styles.actionIcon}>📤</Text>
            <Text style={styles.actionLabel}>Upload Material</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => navigation.navigate('ViewStudents')}
          >
            <Text style={styles.actionIcon}>👥</Text>
            <Text style={styles.actionLabel}>View Students</Text>
          </TouchableOpacity>
        </View>

        {/* Management Links */}
        <Text style={styles.sectionTitle}>Management</Text>
        <TouchableOpacity
          style={styles.managementItem}
          onPress={() => navigation.navigate('Manage')}
        >
          <Text style={styles.managementIcon}>📚</Text>
          <View style={styles.managementInfo}>
            <Text style={styles.managementLabel}>Manage Courses</Text>
            <Text style={styles.managementDesc}>
              Edit, delete, or view your courses
            </Text>
          </View>
          <Text style={styles.arrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.managementItem}
          onPress={() => navigation.navigate('ManageTests')}
        >
          <Text style={styles.managementIcon}>📝</Text>
          <View style={styles.managementInfo}>
            <Text style={styles.managementLabel}>Manage Tests</Text>
            <Text style={styles.managementDesc}>
              Create, edit, or delete tests
            </Text>
          </View>
          <Text style={styles.arrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.managementItem}
          onPress={() => navigation.navigate('Analytics')}
        >
          <Text style={styles.managementIcon}>📊</Text>
          <View style={styles.managementInfo}>
            <Text style={styles.managementLabel}>Analytics</Text>
            <Text style={styles.managementDesc}>
              View student performance and insights
            </Text>
          </View>
          <Text style={styles.arrow}>›</Text>
        </TouchableOpacity>
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
    flexWrap: 'wrap',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  statCard: {
    width: '48%',
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
  sectionTitle: {
    ...typography.h3,
    color: colors.text,
    marginVertical: spacing.md,
    fontWeight: '600',
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  actionCard: {
    width: '48%',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 120,
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
    textAlign: 'center',
  },
  managementItem: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
  },
  managementIcon: {
    fontSize: 28,
    marginRight: spacing.md,
  },
  managementInfo: {
    flex: 1,
  },
  managementLabel: {
    ...typography.body,
    color: colors.text,
    fontWeight: '600',
  },
  managementDesc: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  arrow: {
    ...typography.h2,
    color: colors.textSecondary,
  },
});

export default AdminDashboardScreen;