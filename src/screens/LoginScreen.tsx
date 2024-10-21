import React, { useEffect, useState } from 'react';
import { Text, SafeAreaView, View, StyleSheet, Linking, TouchableOpacity } from 'react-native';
import { useTheme, TextInput, Button, Appbar, ActivityIndicator } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { useKey } from '../Provider/AutoContext';
import { API_URL } from '../api/server';

const handleLogin = async (navigation, login, passphrase) => {
  try {
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ login, passphrase }),
    });

    if (!response.ok) {
      throw new Error('Failed to authenticate');
    }

    const { authenticated, key, redirect_uri } = await response.json();
    if (redirect_uri) {
      console.log('Opening redirect_uri:', redirect_uri);
      Linking.openURL(redirect_uri);
      return;
    }

    if (authenticated && key) {
      localStorage.setItem('key', key);
      navigation.navigate('Dashboard');
      return;
    }

    console.error('Failed to authenticate');
  } catch (error) {
    console.error('Login error:', error);
  }
};

const verifyKey = async (key: string): Promise<boolean> => {
  try {
    const response = await fetch(`${API_URL}/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ key }),
    });

    if (!response.ok) {
      throw new Error('Failed to verify key');
    }
    return true;
  } catch (error) {
    console.error('Verify key error:', error);
    return false;
  }
};

const handleAdmin = (navigation, login, passphrase) => {
  navigation.navigate('Admin');
};

const LoginScreen = () => {
  const [passphrase, setPassphrase] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);
  const [isValid, setIsValid] = useState(false);
  const [login, setLogin] = useState('');
  const theme = useTheme();
  const navigation = useNavigation();
  const autoKey = useKey();

  useEffect(() => {
    const fetchKey = async () => {
      if (autoKey !== '') {
        try {
          const isValid = await verifyKey(autoKey);
          console.log('Key is valid:', isValid);
          if (isValid) {
            localStorage.setItem('key', autoKey);
          }
          setIsValid(isValid);
        } catch (error) {
          console.error('Error verifying key:', error);
        }
      }
      console.log('Setting isLoaded to true');
      setIsLoaded(true);
    };
    fetchKey();
  }, [autoKey]);

  useEffect(() => {
    if (isLoaded && isValid) {
      navigation.navigate('Dashboard');
    }
  }, [isLoaded, isValid, navigation]);

  if (!isLoaded) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <Appbar style={styles.appbar}>
          <Appbar.Content title="Login" titleStyle={styles.appbarTitle} />
        </Appbar>
        <View style={[styles.container, { backgroundColor: theme.colors.background, justifyContent: 'center', alignItems: 'center' }]}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  console.log('LoginScreen render');
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Appbar style={styles.appbar}>
        <Appbar.Content title="Login" titleStyle={styles.appbarTitle} />
      </Appbar>
      <View style={styles.form}>
        <TextInput
          label="Enter login"
          placeholder="Login"
          mode="outlined"
          value={login}
          onChangeText={setLogin}
          style={styles.input}
          theme={{ colors: { primary: theme.colors.primary } }}
        />
        <TextInput
          label="Enter passphrase"
          placeholder="Passphrase"
          mode="outlined"
          secureTextEntry
          value={passphrase}
          onChangeText={setPassphrase}
          style={styles.input}
          theme={{ colors: { primary: theme.colors.primary } }}
        />
        <Button
          mode="contained"
          style={styles.button}
          onPress={() => handleLogin(navigation, login, passphrase)}
          color={theme.colors.primary}
        >
          Login
        </Button>
        <Button
          mode="contained"
          style={styles.button}
          onPress={() => handleAdmin(navigation, login, passphrase)}
        >
          Admin
        </Button>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  appbar: {
  },
  appbarTitle: {
  },
  form: {
    marginTop: 20,
    borderRadius: 8,
    padding: 20,
    elevation: 4, // Shadow effect
    flex: 1, // Allows the form to take up remaining space
    justifyContent: 'center', // Center the contents vertically
  },
  input: {
    marginBottom: 20,
    borderRadius: 4, // Rounded corners for the input
  },
  button: {
    marginTop: 10,
    borderRadius: 4, // Rounded corners for the button
  },
});

export default LoginScreen;
