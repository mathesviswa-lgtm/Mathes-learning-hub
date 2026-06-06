import React from 'react';
import { View, ScrollView, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import CustomButton from '../../components/common/CustomButton';
import { colors, typography, spacing, borderRadius } from '../../styles';

const RoleSelectionScreen = ({ navigation }) => {
  const { userData } = useContext(AuthContext);

  React.useEffect(() => {
    if (userData) {
      navigation.replace(userData.role === 'admin' ? 'AdminStack' : 'StudentStack');
    }
  }, [userData]);

  const handleRoleSelect = (role) => {
    // Role is already set during registration
    navigation.replace(role === 'admin' ? 'AdminStack' : 'StudentStack');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Welcome to Mathes Learning Hub</Text>
        <Text style={styles.subtitle}>Select your role to continue</Text>
      </View>

      <View style={styles.rolesContainer}>
        <TouchableOpacity
          style={styles.roleCard}
          onPress={() => handleRoleSelect('student')}
          activeOpacity={0.8}
        >
          <View style={styles.roleIcon}>
            <Text style={styles.iconText}>👨‍🎓</Text>
          </View>
          <Text style={styles.roleName}>Student</Text>
          <Text style={styles.roleDescription}>Learn and practice with courses and tests</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.roleCard}
          onPress={() => handleRoleSelect('admin')}
          activeOpacity={0.8}
        >
          <View style={styles.roleIcon}>
            <Text style={styles.iconText}>👨‍🏫</Text>
          </View>
          <Text style={styles.roleName}>Admin</Text>
          <Text style={styles.roleDescription}>Manage courses, tests, and student progress</Text>
        </TouchableOpacity>
      </View>

      <CustomButton
        title="Continue"
        onPress={() => handleRoleSelect('student')}
        style={styles.button}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: colors.background,
    padding: spacing.lg,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  title: {
    ...typography.h1,
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  rolesContainer: {
    marginBottom: spacing.xl,
    gap: spacing.md,
  },
  roleCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  roleIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  iconText: {
    fontSize: 40,
  },
  roleName: {
    ...typography.h3,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  roleDescription: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  button: {
    marginTop: spacing.lg,
  },
});

export default RoleSelectionScreen;