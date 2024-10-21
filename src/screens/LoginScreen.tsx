import React, { useEffect, useState } from 'react';
import { Text, SafeAreaView, View, StyleSheet, Linking, Pressable } from 'react-native';
import { useTheme, TextInput, Button, Appbar } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { API_URL } from '../api/server';
import TabView from '../components/TabView';

const LoginScreen = () => {
  const [passphrase, setPassphrase] = useState('');
  const [login, setLogin] = useState('');
  const theme = useTheme();
  const navigation = useNavigation();
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleLogin = async (navigation: any, login: string, passphrase: string) => {
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ login, passphrase }),
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to authenticate, network error');
      }

      const { authenticated, is_admin, redirect_uri } = await response.json();
      if (redirect_uri) {
        Linking.openURL(redirect_uri);
        return;
      }

      if (authenticated) {
        localStorage.setItem('is_admin', is_admin);
        navigation.navigate('Dashboard');
        return;
      }

      setErrorMessage('Failed to authenticate, wrong credentials');
      setLogin('');
      setPassphrase('');
    } catch (error) {
      setErrorMessage('Failed to authenticate, network error');
      setLogin('');
      setPassphrase('');
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
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
          label="Enter password"
          placeholder="Password"
          mode="outlined"
          secureTextEntry
          value={passphrase}
          onChangeText={setPassphrase}
          style={styles.input}
          theme={{ colors: { primary: theme.colors.primary } }}
        />
        {errorMessage ? (
          <Text style={{ color: 'red', marginBottom: 10 }}>{errorMessage}</Text>
        ) : null}
        <Button
          mode="contained"
          style={styles.button}
          onPress={() => handleLogin(navigation, login, passphrase)}
          buttonColor={theme.colors.onBackground}
          textColor={theme.colors.background}
          disabled={login.length < 1 || passphrase.length < 1}
        >
          Login
        </Button>
      </View>
    </SafeAreaView>
  );
};


const RegisterScreen = () => {
  const [login, setLogin] = useState('');
  const [passphrase, setPassphrase] = useState('');
  const [superkey, setSuperkey] = useState('');
  const [registerMessage, setRegisterMessage] = useState<[boolean, string]>([true, '']);
  const theme = useTheme();

  const handleRegister = async (login: string, passphrase: string, superkey: string) => {
    try {
      const response = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ login, passphrase, superkey }),
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to register, network error');
      }

      const { registered } = await response.json();
      if (registered) {
        setRegisterMessage([true, 'Registration successful!']);
      } else {
        setRegisterMessage([false, 'Registration failed, please try again']);
      }
    } catch (error) {
      console.error('Registration error:', error);
      setRegisterMessage([false, 'Registration failed, please try another username or superkey.']);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
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
          label="Enter password"
          placeholder="Password"
          mode="outlined"
          secureTextEntry
          value={passphrase}
          onChangeText={setPassphrase}
          style={styles.input}
          theme={{ colors: { primary: theme.colors.primary } }}
        />
        <TextInput
          label="Enter superkey"
          placeholder="Superkey"
          mode="outlined"
          secureTextEntry
          value={superkey}
          onChangeText={setSuperkey}
          style={styles.input}
          theme={{ colors: { primary: theme.colors.primary } }}
        />
        {registerMessage[0] ? (
          <Text style={{ color: 'green', marginBottom: 10 }}>{registerMessage[1]}</Text>
        ) : (
          <Text style={{ color: 'red', marginBottom: 10 }}>{registerMessage[1]}</Text>
        )}
        <Button
          mode="contained"
          style={styles.button}
          onPress={() => handleRegister(login, passphrase, superkey)}
          buttonColor={theme.colors.onBackground}
          textColor={theme.colors.background}
          disabled={login.length < 1 || passphrase.length < 1 || superkey.length !== 64}
        >
          Register
        </Button>
      </View>
    </SafeAreaView>
  );
};

const MainScreen = () => {
  const autoLogin = async (): Promise<[boolean, boolean]> => {
    try {
      const response = await fetch(`${API_URL}/verify`, {
        method: 'GET',
        credentials: 'include',
      });

      if (!response.ok || response.status != 200) {
        throw new Error('impossible to log via the session cookie');
      }

      const res = await response.json();
      localStorage.setItem('is_admin', res.is_admin);
      return [res.authenticated, res.is_admin];

    } catch (error) {
      console.error('autoLogin failled:', error);
      return [false, false];
    }
  };

  const theme = useTheme();
  const navigation = useNavigation();

  useEffect(() => {
    autoLogin().then(([authenticated, _]) => {
      if (authenticated) {
        navigation.navigate('Dashboard' as never);
      }
    });
  }, [navigation]);

  const tabs = [
    {
      title: 'Login',
      content: LoginScreen(),
    },
    {
      title: 'Register',
      content: RegisterScreen(),
    },
  ];
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Appbar style={{ backgroundColor: theme.colors.background }}>
        <Appbar.Content title="Connection" titleStyle={{ color: theme.colors.onBackground }} />
      </Appbar>
      <TabView tabs={tabs}></TabView>
    </SafeAreaView >
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  form: {
    marginTop: 20,
    borderRadius: 8,
    padding: 20,
    flex: 1,
    justifyContent: 'center',
  },
  input: {
    marginBottom: 20,
    borderRadius: 4,
  },
  button: {
    marginTop: 10,
    borderRadius: 4,
  },
});

export default MainScreen;
