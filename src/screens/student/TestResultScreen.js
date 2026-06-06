import React from 'react';
import { View, ScrollView, StyleSheet, Text, TouchableOpacity } from 'react-native';
import Header from '../../components/common/Header';
import CustomButton from '../../components/common/CustomButton';
import ProgressBar from '../../components/common/ProgressBar';
import { colors, typography, spacing, borderRadius } from '../../styles';

const TestResultScreen = ({ route, navigation }) => {
  const { result, testId } = route.params;

  const getGradeColor = (percentage) => {
    if (percentage >= 80) return colors.success;
    if (percentage >= 60) return colors.warning;
    return colors.error;
  };

  const getGrade = (percentage) => {
    if (percentage >= 90) return 'A+';
    if (percentage >= 80) return 'A';
    if (percentage >= 70) return 'B';
    if (percentage >= 60) return 'C';
    return 'D';
  };

  return (
    <View style={styles.container}>
      <Header title="Test Result" />

      <ScrollView contentContainerStyle={styles.content}>
        {/* Score Card */}
        <View style={styles.scoreCard}>
          <View
            style={[
              styles.scoreCircle,
              { borderColor: getGradeColor(result.percentage) },
            ]}
          >
            <Text style={styles.scorePercentage}>{result.percentage}%</Text>
            <Text
              style={[
                styles.scoreGrade,
                { color: getGradeColor(result.percentage) },
              ]}
            >
              {getGrade(result.percentage)}
            </Text>
          </View>
        </View>

        {/* Performance Summary */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Performance Summary</Text>

          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Correct Answers</Text>
            <Text style={[styles.summaryValue, { color: colors.success }]}>
              {result.correctAnswers}/{result.totalMarks}
            </Text>
          </View>

          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Incorrect Answers</Text>
            <Text style={[styles.summaryValue, { color: colors.error }]}>
              {result.incorrectAnswers}/{result.totalMarks}
            </Text>
          </View>

          <ProgressBar
            percentage={result.percentage}
            label="Overall Score"
            showPercentage={false}
          />
        </View>

        {/* Feedback */}
        <View style={styles.feedbackCard}>
          <Text style={styles.feedbackTitle}>Feedback</Text>
          {result.percentage >= 80 ? (
            <Text style={styles.feedbackText}>
              🎉 Excellent performance! Keep up the great work and continue
              practicing.
            </Text>
          ) : result.percentage >= 60 ? (
            <Text style={styles.feedbackText}>
              👍 Good effort! Review the incorrect answers and practice more.
            </Text>
          ) : (
            <Text style={styles.feedbackText}>
              📚 Don't give up! Review the study materials and try again.
            </Text>
          )}
        </View>

        {/* Answer Review */}
        <View style={styles.answerSection}>
          <Text style={styles.answerSectionTitle}>Answer Review</Text>
          {result.answers.map((answer, index) => (
            <View key={index} style={styles.answerCard}>
              <View style={styles.answerHeader}>
                <Text style={styles.questionNumber}>Q{index + 1}</Text>
                <View
                  style={[
                    styles.resultBadge,
                    answer.isCorrect
                      ? styles.correctBadge
                      : styles.incorrectBadge,
                  ]}
                >
                  <Text style={styles.resultText}>
                    {answer.isCorrect ? '✓' : '✗'}
                  </Text>
                </View>
              </View>
              <Text style={styles.studentAnswer}>
                Your answer: {answer.studentAnswer}
              </Text>
              {!answer.isCorrect && (
                <Text style={styles.correctAnswer}>
                  Correct answer: {answer.correctAnswer}
                </Text>
              )}
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Action Buttons */}
      <View style={styles.actionContainer}>
        <CustomButton
          title="Back to Course"
          variant="outline"
          onPress={() => navigation.goBack()}
          style={styles.button}
        />
        <CustomButton
          title="Retake Test"
          onPress={() => navigation.goBack()}
          style={styles.button}
        />
      </View>
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
  scoreCard: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  scoreCircle: {
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.surface,
  },
  scorePercentage: {
    ...typography.h1,
    color: colors.text,
    fontWeight: 'bold',
  },
  scoreGrade: {
    ...typography.h2,
    fontWeight: 'bold',
    marginTop: spacing.sm,
  },
  summaryCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    borderLeftWidth: 4,
    borderLeftColor: colors.secondary,
  },
  summaryTitle: {
    ...typography.h3,
    color: colors.text,
    fontWeight: '600',
    marginBottom: spacing.md,
  },
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    marginBottom: spacing.md,
  },
  summaryLabel: {
    ...typography.body,
    color: colors.textSecondary,
  },
  summaryValue: {
    ...typography.h3,
    fontWeight: 'bold',
  },
  feedbackCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  feedbackTitle: {
    ...typography.h3,
    color: colors.text,
    fontWeight: '600',
    marginBottom: spacing.md,
  },
  feedbackText: {
    ...typography.body,
    color: colors.text,
    lineHeight: 20,
  },
  answerSection: {
    marginBottom: spacing.lg,
  },
  answerSectionTitle: {
    ...typography.h3,
    color: colors.text,
    fontWeight: '600',
    marginBottom: spacing.md,
  },
  answerCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  answerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  questionNumber: {
    ...typography.body,
    color: colors.secondary,
    fontWeight: 'bold',
  },
  resultBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  correctBadge: {
    backgroundColor: colors.success,
  },
  incorrectBadge: {
    backgroundColor: colors.error,
  },
  resultText: {
    ...typography.body,
    color: colors.text,
    fontWeight: 'bold',
  },
  studentAnswer: {
    ...typography.bodySmall,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  correctAnswer: {
    ...typography.bodySmall,
    color: colors.success,
    fontWeight: '600',
  },
  actionContainer: {
    padding: spacing.lg,
    gap: spacing.md,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  button: {
    marginBottom: spacing.sm,
  },
});

export default TestResultScreen;