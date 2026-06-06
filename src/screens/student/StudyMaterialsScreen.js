import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Text, FlatList, TouchableOpacity } from 'react-native';
import { useContext } from 'react';
import { materialService } from '../../services/materialService';
import Header from '../../components/common/Header';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { colors, typography, spacing, borderRadius } from '../../styles';

const StudyMaterialsScreen = ({ route, navigation }) => {
  const { courseId } = route.params || {};
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMaterials();
  }, [courseId]);

  const fetchMaterials = async () => {
    try {
      let result;
      if (courseId) {
        result = await materialService.getMaterialsByCourse(courseId);
      } else {
        result = await materialService.getAllMaterials();
      }
      if (result.success) {
        setMaterials(result.materials);
      }
    } catch (error) {
      console.error('Error fetching materials:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  const renderMaterialCard = ({ item }) => (
    <TouchableOpacity
      style={styles.materialCard}
      onPress={() => {
        // Open PDF or download file
      }}
      activeOpacity={0.8}
    >
      <View style={styles.materialHeader}>
        <Text style={styles.fileIcon}>📄</Text>
        <View style={styles.materialInfo}>
          <Text style={styles.materialTitle} numberOfLines={2}>
            {item.title}
          </Text>
          <Text style={styles.materialType}>{item.fileType?.toUpperCase()}</Text>
        </View>
        <Text style={styles.downloads}>{item.downloadCount || 0}</Text>
      </View>
      <Text style={styles.description} numberOfLines={2}>
        {item.description}
      </Text>
      <View style={styles.footer}>
        <Text style={styles.size}>
          {Math.round(item.fileSize / 1024)} KB
        </Text>
        <Text style={styles.downloadText}>Download ↓</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Header
        title="Study Materials"
        subtitle={`${materials.length} materials`}
      />

      {materials.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>📚</Text>
          <Text style={styles.emptyTitle}>No Materials Available</Text>
          <Text style={styles.emptyText}>
            Study materials will appear here soon
          </Text>
        </View>
      ) : (
        <FlatList
          data={materials}
          renderItem={renderMaterialCard}
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
  materialCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderLeftWidth: 4,
    borderLeftColor: colors.success,
  },
  materialHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  fileIcon: {
    fontSize: 32,
    marginRight: spacing.md,
  },
  materialInfo: {
    flex: 1,
  },
  materialTitle: {
    ...typography.body,
    color: colors.text,
    fontWeight: '600',
  },
  materialType: {
    ...typography.caption,
    color: colors.secondary,
    marginTop: spacing.xs,
    fontWeight: '500',
  },
  downloads: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  description: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  size: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  downloadText: {
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

export default StudyMaterialsScreen;