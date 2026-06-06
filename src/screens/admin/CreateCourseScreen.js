import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Text, KeyboardAvoidingView, Platform } from 'react-native';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { courseService } from '../../services/courseService';
import Header from '../../components/common/Header';
import CustomButton from '../../components/common/CustomButton';
import CustomInput from '../../components/common/CustomInput';
import { colors, spacing } from '../../styles';

const CreateCourseScreen = ({ route, navigation }) => {
  const { user } = useContext(AuthContext);
  const courseId = route.params?.courseId;
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [level, setLevel] = useState('Beginner');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!title.trim()) newErrors.title = 'Title is required';
    if (!description.trim()) newErrors.description = 'Description is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreateCourse = async () => {
    if (!validateForm()) return;

    setLoading(true);
    const result = await courseService.createCourse(
      { title, description, level },
      user?.uid
    );
    setLoading(false);

    if (result.success) {
      navigation.goBack();
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <Header title={courseId ? 'Edit Course' : 'Create New Course'} />

      <ScrollView contentContainerStyle={styles.content}>
        <CustomInput
          label="Course Title"
          placeholder="Enter course title"
          value={title}
          onChangeText={setTitle}
          error={errors.title}
        />

        <CustomInput
          label="Description"
          placeholder="Enter course description"
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={4}
          error={errors.description}
        />

        <CustomInput
          label="Level"
          placeholder="Beginner / Intermediate / Advanced"
          value={level}
          onChangeText={setLevel}
        />

        <CustomButton
          title={courseId ? 'Update Course' : 'Create Course'}
          onPress={handleCreateCourse}
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

export default CreateCourseScreen;