import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar, useColorScheme } from 'react-native';
import LoginScreen from './src/screens/LoginScreen';
import DashboardScreen from './src/screens/DashboardScreen';
import AdminScreen from './src/screens/AdminScreen';
import { Provider as PaperProvider, MD3DarkTheme, MD3LightTheme } from 'react-native-paper';
import { LoginProvider } from './src/Provider/AutoContext';

type RootStackParamList = {
  Login: undefined;
  Dashboard: undefined;
  Admin: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const App: React.FC = () => {
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? MD3DarkTheme : MD3LightTheme;


  return (
    <PaperProvider theme={theme}>
      <LoginProvider>
        <NavigationContainer>
          <StatusBar barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'} />
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Admin" component={AdminScreen} />
            <Stack.Screen name="Dashboard" component={DashboardScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </LoginProvider>
    </PaperProvider>
  );
}

export default App;