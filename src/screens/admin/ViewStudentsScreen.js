import React from 'react';
import { View, ScrollView, StyleSheet, Text } from 'react-native';
import Header from '../../components/common/Header';
import { colors, typography, spacing } from '../../styles';

const ViewStudentsScreen = () => {
  return (
    <View style={styles.container}>
      <Header title="View Students" />

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.placeholder}>
          <Text style={styles.icon}>👥</Text>
          <Text style={styles.text}>Students List Coming Soon</Text>
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
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  placeholder: {
    alignItems: 'center',
  },
  icon: {
    fontSize: 64,
    marginBottom: spacing.lg,
  },
  text: {
    ...typography.h3,
    color: colors.text,
    textAlign: 'center',
  },
});

export default ViewStudentsScreen;