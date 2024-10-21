import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet, Alert } from 'react-native';
import { useTheme, TextInput, Button, DataTable, Appbar, Card, Title, Paragraph, ActivityIndicator } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { API_URL } from '../api/server';

const AdminScreen = () => {
  const [users, setUsers] = useState([]);
  const [newLogin, setNewLogin] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [adminLogin, setAdminLogin] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const theme = useTheme();
  const navigation = useNavigation();

  const fetchUsers = async () => {
    if (!adminLogin || !adminPassword) {
      Alert.alert('Error', 'Please enter admin credentials before fetching users.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/users`, {
        method: 'Post',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ login: adminLogin, password: adminPassword }),
      });
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }
      const data = await response.json();
      setUsers(data);
      Alert.alert('Success', 'Users fetched successfully');
    } catch (error) {
      console.error('Error fetching users:', error);
      Alert.alert('Error', 'Failed to fetch users. Please check your admin credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const addUser = async () => {
    if (!adminLogin || !adminPassword) {
      Alert.alert('Error', 'Please enter admin credentials before adding a user.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/add-user`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ login: adminLogin, password: adminPassword, userLogin: newLogin, userPassword: newPassword }),
      });
      if (!response.ok) {
        throw new Error('Failed to add user');
      }
      setNewLogin('');
      setNewPassword('');
      fetchUsers();
      Alert.alert('Success', 'User added successfully');
    } catch (error) {
      console.error('Error adding user:', error);
      Alert.alert('Error', 'Failed to add user. Please check your admin credentials and input.');
    } finally {
      setIsLoading(false);
    }
  };

  const deleteUser = async (userLogin) => {
    if (!adminLogin || !adminPassword) {
      Alert.alert('Error', 'Please enter admin credentials before deleting a user.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/delete-user/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ login: adminLogin, password: adminPassword, userLogin }),
      });
      if (!response.ok) {
        throw new Error('Failed to delete user');
      }
      fetchUsers();
      Alert.alert('Success', 'User deleted successfully');
    } catch (error) {
      console.error('Error deleting user:', error);
      Alert.alert('Error', 'Failed to delete user. Please check your admin credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Appbar.Header>
        <Appbar.Content title="Admin Dashboard" />
        <Appbar.Action icon="logout" onPress={() => navigation.goBack()} />
      </Appbar.Header>
      
      <Card style={styles.card}>
        <Card.Content>
          <Title>Admin Credentials</Title>
          <TextInput
            label="Admin Login"
            value={adminLogin}
            onChangeText={setAdminLogin}
            style={styles.input}
            mode="outlined"
          />
          <TextInput
            label="Admin Password"
            value={adminPassword}
            onChangeText={setAdminPassword}
            secureTextEntry
            style={styles.input}
            mode="outlined"
          />
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Title>Add New User</Title>
          <TextInput
            label="New User Login"
            value={newLogin}
            onChangeText={setNewLogin}
            style={styles.input}
            mode="outlined"
          />
          <TextInput
            label="New User Password"
            value={newPassword}
            onChangeText={setNewPassword}
            secureTextEntry
            style={styles.input}
            mode="outlined"
          />
          <Button mode="contained" onPress={addUser} style={styles.button} disabled={isLoading}>
            Add User
          </Button>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Title>User List</Title>
          <Button 
            mode="contained" 
            onPress={fetchUsers} 
            style={styles.button} 
            icon="refresh"
            disabled={isLoading}
          >
            Fetch Users
          </Button>
          {isLoading ? (
            <ActivityIndicator animating={true} color={theme.colors.primary} style={styles.loader} />
          ) : (
            <DataTable>
              <DataTable.Header>
                <DataTable.Title>Login</DataTable.Title>
                <DataTable.Title>Action</DataTable.Title>
              </DataTable.Header>

              <FlatList
                data={users}
                keyExtractor={(item) => item.login}
                renderItem={({ item }) => (
                  <DataTable.Row>
                    <DataTable.Cell>{item.login}</DataTable.Cell>
                    <DataTable.Cell>
                      <Button 
                        mode="outlined" 
                        onPress={() => deleteUser(item.login)} 
                        color={theme.colors.error}
                        disabled={isLoading}
                      >
                        Delete
                      </Button>
                    </DataTable.Cell>
                  </DataTable.Row>
                )}
              />
            </DataTable>
          )}
        </Card.Content>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  card: {
    margin: 16,
    elevation: 4,
  },
  input: {
    marginBottom: 12,
  },
  button: {
    marginTop: 8,
    marginBottom: 8,
  },
  loader: {
    marginTop: 20,
  },
});

export default AdminScreen;