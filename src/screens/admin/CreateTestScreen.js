import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Text, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { testService } from '../../services/testService';
import Header from '../../components/common/Header';
import CustomButton from '../../components/common/CustomButton';
import CustomInput from '../../components/common/CustomInput';
import { colors, spacing } from '../../styles';

const CreateTestScreen = ({ route, navigation }) => {
  const { user } = useContext(AuthContext);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [courseId, setCourseId] = useState('');
  const [duration, setDuration] = useState('30');
  const [totalQuestions, setTotalQuestions] = useState('10');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!title.trim()) newErrors.title = 'Title is required';
    if (!description.trim()) newErrors.description = 'Description is required';
    if (!courseId.trim()) newErrors.courseId = 'Course ID is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreateTest = async () => {
    if (!validateForm()) return;

    setLoading(true);
    const result = await testService.createTest(
      {
        title,
        description,
        courseId,
        duration: parseInt(duration),
        totalQuestions: parseInt(totalQuestions),
        questions: [],
      },
      user?.uid
    );
    setLoading(false);

    if (result.success) {
      Alert.alert('Success', 'Test created. You can now add questions.');
      navigation.goBack();
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <Header title="Create New Test" />

      <ScrollView contentContainerStyle={styles.content}>
        <CustomInput
          label="Test Title"
          placeholder="Enter test title"
          value={title}
          onChangeText={setTitle}
          error={errors.title}
        />

        <CustomInput
          label="Description"
          placeholder="Enter test description"
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={3}
          error={errors.description}
        />

        <CustomInput
          label="Course ID"
          placeholder="Enter the course ID"
          value={courseId}
          onChangeText={setCourseId}
          error={errors.courseId}
        />

        <CustomInput
          label="Duration (minutes)"
          placeholder="30"
          value={duration}
          onChangeText={setDuration}
          keyboardType="numeric"
        />

        <CustomInput
          label="Total Questions"
          placeholder="10"
          value={totalQuestions}
          onChangeText={setTotalQuestions}
          keyboardType="numeric"
        />

        <CustomButton
          title="Create Test"
          onPress={handleCreateTest}
          loading={loading}
        />

        <CustomButton
          title="Cancel"
          variant="outline"
          onPress={() => navigation.goBack()}
        />
      </ScrollView>
    </KeyboardAvoidingView>
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
});

export default CreateTestScreen;