import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, typography, spacing, borderRadius } from '../../styles';

const ProgressBar = ({ percentage, label, showPercentage = true }) => {
  const clampedPercentage = Math.min(Math.max(percentage, 0), 100);

  const getColorByPercentage = (percent) => {
    if (percent >= 80) return colors.success;
    if (percent >= 60) return colors.warning;
    return colors.error;
  };

  return (
    <View style={styles.container}>
      {label && (
        <View style={styles.labelContainer}>
          <Text style={styles.label}>{label}</Text>
          {showPercentage && (
            <Text style={styles.percentage}>{Math.round(clampedPercentage)}%</Text>
          )}
        </View>
      )}
      <View style={styles.barContainer}>
        <View
          style={[
            styles.bar,
            {
              width: `${clampedPercentage}%`,
              backgroundColor: getColorByPercentage(clampedPercentage),
            },
          ]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },
  labelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  label: {
    ...typography.body,
    color: colors.text,
    fontWeight: '500',
  },
  percentage: {
    ...typography.body,
    color: colors.secondary,
    fontWeight: '600',
  },
  barContainer: {
    height: 8,
    backgroundColor: colors.border,
    borderRadius: borderRadius.round,
    overflow: 'hidden',
  },
  bar: {
    height: '100%',
    borderRadius: borderRadius.round,
  },
});

export default ProgressBar;