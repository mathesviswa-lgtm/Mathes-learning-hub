import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Text, TouchableOpacity, Alert } from 'react-native';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { testService } from '../../services/testService';
import Header from '../../components/common/Header';
import CustomButton from '../../components/common/CustomButton';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { colors, typography, spacing, borderRadius } from '../../styles';

const TestQuestionsScreen = ({ route, navigation }) => {
  const { testId } = route.params;
  const { user } = useContext(AuthContext);
  const [test, setTest] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    fetchTestData();
  }, [testId]);

  const fetchTestData = async () => {
    try {
      const testResult = await testService.getTestById(testId);
      const questionsResult = await testService.getTestQuestions(testId);

      if (testResult.success) setTest(testResult.test);
      if (questionsResult.success) setQuestions(questionsResult.questions);
    } catch (error) {
      console.error('Error fetching test data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectAnswer = (questionId, selectedOption) => {
    setAnswers({
      ...answers,
      [questionId]: selectedOption,
    });
  };

  const handleSubmitTest = async () => {
    if (Object.keys(answers).length !== questions.length) {
      Alert.alert('Incomplete', 'Please answer all questions before submitting');
      return;
    }

    const result = await testService.submitTest(user.uid, testId, answers);
    if (result.success) {
      navigation.replace('TestResult', { result: result.result, testId });
    } else {
      Alert.alert('Error', result.error);
    }
  };

  if (loading) return <LoadingSpinner />;

  if (!test || questions.length === 0) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Test not found</Text>
      </View>
    );
  }

  const question = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <View style={styles.container}>
      <Header
        title={test.title}
        subtitle={`Question ${currentQuestion + 1} of ${questions.length}`}
      />

      <ScrollView contentContainerStyle={styles.content}>
        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${progress}%` }]} />
          </View>
          <Text style={styles.progressText}>{Math.round(progress)}%</Text>
        </View>

        {/* Question */}
        <View style={styles.questionContainer}>
          <Text style={styles.questionText}>{question.questionText}</Text>
        </View>

        {/* Options */}
        <View style={styles.optionsContainer}>
          {question.options.map((option, index) => {
            const isSelected = answers[question.id] === option;
            return (
              <TouchableOpacity
                key={index}
                style={[
                  styles.optionButton,
                  isSelected && styles.optionButtonSelected,
                ]}
                onPress={() => handleSelectAnswer(question.id, option)}
                activeOpacity={0.8}
              >
                <View
                  style={[
                    styles.optionBullet,
                    isSelected && styles.optionBulletSelected,
                  ]}
                >
                  <Text style={styles.bulletText}>
                    {String.fromCharCode(65 + index)}
                  </Text>
                </View>
                <Text
                  style={[
                    styles.optionText,
                    isSelected && styles.optionTextSelected,
                  ]}
                >
                  {option}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      {/* Navigation */}
      <View style={styles.navigationContainer}>
        <CustomButton
          title={currentQuestion === 0 ? 'Back' : 'Previous'}
          variant="outline"
          onPress={() =>
            currentQuestion > 0
              ? setCurrentQuestion(currentQuestion - 1)
              : navigation.goBack()
          }
          style={styles.navButton}
        />
        {currentQuestion === questions.length - 1 ? (
          <CustomButton
            title="Submit"
            onPress={handleSubmitTest}
            style={styles.navButton}
          />
        ) : (
          <CustomButton
            title="Next"
            onPress={() => setCurrentQuestion(currentQuestion + 1)}
            style={styles.navButton}
          />
        )}
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
  progressContainer: {
    marginBottom: spacing.lg,
  },
  progressBar: {
    height: 8,
    backgroundColor: colors.border,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: spacing.sm,
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.secondary,
  },
  progressText: {
    ...typography.caption,
    color: colors.secondary,
    fontWeight: '600',
  },
  questionContainer: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    borderLeftWidth: 4,
    borderLeftColor: colors.secondary,
  },
  questionText: {
    ...typography.h3,
    color: colors.text,
    fontWeight: '600',
    lineHeight: 24,
  },
  optionsContainer: {
    marginBottom: spacing.lg,
  },
  optionButton: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.border,
  },
  optionButtonSelected: {
    borderColor: colors.secondary,
    backgroundColor: 'rgba(33, 150, 243, 0.1)',
  },
  optionBullet: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primaryDark,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
    borderWidth: 2,
    borderColor: colors.border,
  },
  optionBulletSelected: {
    backgroundColor: colors.secondary,
    borderColor: colors.secondary,
  },
  bulletText: {
    ...typography.body,
    color: colors.text,
    fontWeight: 'bold',
  },
  optionText: {
    ...typography.body,
    color: colors.text,
    flex: 1,
    fontWeight: '500',
  },
  optionTextSelected: {
    color: colors.secondary,
    fontWeight: '600',
  },
  navigationContainer: {
    flexDirection: 'row',
    padding: spacing.lg,
    gap: spacing.md,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  navButton: {
    flex: 1,
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

export default TestQuestionsScreen;