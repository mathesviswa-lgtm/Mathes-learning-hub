import React from 'react';
import { View, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { AuthProvider, AuthContext } from './src/context/AuthContext';
import { colors } from './src/styles/colors';

// Auth Screens
import LoginScreen from './src/screens/auth/LoginScreen';
import RegisterScreen from './src/screens/auth/RegisterScreen';
import RoleSelectionScreen from './src/screens/auth/RoleSelectionScreen';

// Student Screens
import StudentDashboard from './src/screens/student/DashboardScreen';
import CoursesScreen from './src/screens/student/CoursesScreen';
import CourseDetailScreen from './src/screens/student/CourseDetailScreen';
import MockTestScreen from './src/screens/student/MockTestScreen';
import TestQuestionsScreen from './src/screens/student/TestQuestionsScreen';
import TestResultScreen from './src/screens/student/TestResultScreen';
import StudyMaterialsScreen from './src/screens/student/StudyMaterialsScreen';
import ProfileScreen from './src/screens/student/ProfileScreen';
import ProgressScreen from './src/screens/student/ProgressScreen';

// Admin Screens
import AdminDashboard from './src/screens/admin/AdminDashboardScreen';
import ManageCoursesScreen from './src/screens/admin/ManageCoursesScreen';
import CreateCourseScreen from './src/screens/admin/CreateCourseScreen';
import UploadMaterialsScreen from './src/screens/admin/UploadMaterialsScreen';
import ManageTestsScreen from './src/screens/admin/ManageTestsScreen';
import CreateTestScreen from './src/screens/admin/CreateTestScreen';
import ViewStudentsScreen from './src/screens/admin/ViewStudentsScreen';
import AnalyticsScreen from './src/screens/admin/AnalyticsScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const navigationOptions = {
  headerStyle: {
    backgroundColor: colors.primary,
  },
  headerTintColor: colors.text,
  headerTitleStyle: {
    fontWeight: 'bold',
  },
};

// Auth Stack
const AuthStack = () => {
  return (
    <Stack.Navigator
      screenOptions={navigationOptions}
    >
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Register"
        component={RegisterScreen}
        options={{ title: 'Create Account' }}
      />
      <Stack.Screen
        name="RoleSelection"
        component={RoleSelectionScreen}
        options={{ title: 'Select Role' }}
      />
    </Stack.Navigator>
  );
};

// Student Bottom Tab Navigator
const StudentTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.primary,
        },
        headerTintColor: colors.text,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        tabBarStyle: {
          backgroundColor: colors.primary,
          borderTopColor: colors.border,
        },
        tabBarActiveTintColor: colors.secondary,
        tabBarInactiveTintColor: colors.textSecondary,
      }}
    >
      <Tab.Screen
        name="StudentDashboard"
        component={StudentDashboard}
        options={{
          title: 'Dashboard',
          tabBarLabel: 'Home',
        }}
      />
      <Tab.Screen
        name="Courses"
        component={CoursesScreen}
        options={{
          title: 'Courses',
          tabBarLabel: 'Courses',
        }}
      />
      <Tab.Screen
        name="Progress"
        component={ProgressScreen}
        options={{
          title: 'Progress',
          tabBarLabel: 'Progress',
        }}
      />
      <Tab.Screen
        name="StudentProfile"
        component={ProfileScreen}
        options={{
          title: 'Profile',
          tabBarLabel: 'Profile',
        }}
      />
    </Tab.Navigator>
  );
};

// Student Stack
const StudentStack = () => {
  return (
    <Stack.Navigator
      screenOptions={navigationOptions}
    >
      <Stack.Screen
        name="StudentTabs"
        component={StudentTabs}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="CourseDetail"
        component={CourseDetailScreen}
        options={{ title: 'Course Details' }}
      />
      <Stack.Screen
        name="MockTest"
        component={MockTestScreen}
        options={{ title: 'Mock Tests' }}
      />
      <Stack.Screen
        name="TestQuestions"
        component={TestQuestionsScreen}
        options={{ title: 'Test' }}
      />
      <Stack.Screen
        name="TestResult"
        component={TestResultScreen}
        options={{ title: 'Test Result' }}
      />
      <Stack.Screen
        name="StudyMaterials"
        component={StudyMaterialsScreen}
        options={{ title: 'Study Materials' }}
      />
    </Stack.Navigator>
  );
};

// Admin Bottom Tab Navigator
const AdminTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.primary,
        },
        headerTintColor: colors.text,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        tabBarStyle: {
          backgroundColor: colors.primary,
          borderTopColor: colors.border,
        },
        tabBarActiveTintColor: colors.secondary,
        tabBarInactiveTintColor: colors.textSecondary,
      }}
    >
      <Tab.Screen
        name="AdminDashboard"
        component={AdminDashboard}
        options={{
          title: 'Dashboard',
          tabBarLabel: 'Home',
        }}
      />
      <Tab.Screen
        name="Manage"
        component={ManageCoursesScreen}
        options={{
          title: 'Manage Courses',
          tabBarLabel: 'Courses',
        }}
      />
      <Tab.Screen
        name="Analytics"
        component={AnalyticsScreen}
        options={{
          title: 'Analytics',
          tabBarLabel: 'Analytics',
        }}
      />
    </Tab.Navigator>
  );
};

// Admin Stack
const AdminStack = () => {
  return (
    <Stack.Navigator
      screenOptions={navigationOptions}
    >
      <Stack.Screen
        name="AdminTabs"
        component={AdminTabs}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="CreateCourse"
        component={CreateCourseScreen}
        options={{ title: 'Create Course' }}
      />
      <Stack.Screen
        name="UploadMaterials"
        component={UploadMaterialsScreen}
        options={{ title: 'Upload Materials' }}
      />
      <Stack.Screen
        name="ManageTests"
        component={ManageTestsScreen}
        options={{ title: 'Manage Tests' }}
      />
      <Stack.Screen
        name="CreateTest"
        component={CreateTestScreen}
        options={{ title: 'Create Test' }}
      />
      <Stack.Screen
        name="ViewStudents"
        component={ViewStudentsScreen}
        options={{ title: 'View Students' }}
      />
    </Stack.Navigator>
  );
};

// Root Navigator
const RootNavigator = () => {
  const { isAuthenticated, isAdmin, loading } = React.useContext(AuthContext);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        {/* Placeholder for loading screen */}
      </View>
    );
  }

  return (
    <NavigationContainer>
      {isAuthenticated ? (
        isAdmin ? <AdminStack /> : <StudentStack />
      ) : (
        <AuthStack />
      )}
    </NavigationContainer>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <RootNavigator />
    </AuthProvider>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default App;