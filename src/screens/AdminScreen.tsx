import React, { useEffect, useState } from 'react';
import { View, StyleSheet, SafeAreaView, ScrollView, FlatList, Pressable } from 'react-native';
import { useTheme, TextInput, Button, Appbar, Card, Title, ActivityIndicator, Menu, Text } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { API_URL } from '../api/server';
import * as Clipboard from 'expo-clipboard';
import ConfirmButton from '../components/ConfirmButton';

const SuperkeyList = ({ superkeys }) => {
  const theme = useTheme();
  const handleCopy = async (superkey: string) => {
    await Clipboard.setStringAsync(superkey);
  };

  const renderItem = ({ item, index }) => (
    <Pressable onPress={() => handleCopy(item)} style={({ pressed }) => [{ backgroundColor: pressed ? theme.colors.background : theme.colors.onBackground }, styles.superkeyItem]}>
      <Text style={[styles.superkeyText, { color: theme.colors.background }]}>{item}</Text>
    </Pressable>
  );

  return (
    <FlatList
      data={superkeys}
      keyExtractor={(_, index) => index.toString()}
      renderItem={renderItem}
      contentContainerStyle={styles.listContainer}
    />
  );
};

const AdminScreen = () => {
  const [users, setUsers] = useState([]);
  const [newLogin, setNewLogin] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [superkey, setSuperkey] = useState('');
  const [isSuperkeyDisable, setIsSuperkeyDisable] = useState(true);
  const [superkeyMessage, setSuperkeyMessage] = useState<[boolean, string]>([true, '']);
  const [userPassword, setUserPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isDisableNewUser, setIsDisableNewUser] = useState(true);
  const theme = useTheme();
  const navigation = useNavigation();
  const [addMessage, setAddMessage] = useState<[boolean, string]>([true, '']);
  const [deleteMessage, setDeleteMessage] = useState<[boolean, string]>([true, '']);
  const [changeMessage, setChangeMessage] = useState<[boolean, string]>([true, '']);
  const [menuVisible, setMenuVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [superkeys, setSuperkeys] = useState<string[]>([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/users`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }
      const data = await response.json();
      setUsers(data);
      setSelectedUser(null);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const addUser = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/add-user`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userLogin: newLogin, userPassword: newPassword }),
        credentials: 'include',
      });
      if (!response.ok) {
        throw new Error('Failed to add user');
      }
      setNewLogin('');
      setNewPassword('');
      fetchUsers();
      setAddMessage([true, 'User added successfully']);
    } catch (error) {
      console.error('Error adding user:', error);
      setNewLogin('');
      setNewPassword('');
      setAddMessage([false, 'Failed to add user. Please check your admin credentials.']);
    } finally {
      setIsLoading(false);
    }
  };


  const deleteUser = async (userLogin: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/delete-user/${userLogin}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
      if (!response.ok) {
        throw new Error('Failed to delete user');
      }
      fetchUsers();
      setDeleteMessage([true, 'User deleted successfully']);
      setSelectedUser(null);
    } catch (error) {
      setDeleteMessage([false, 'Failed to delete user']);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectUser = (login: any) => {
    setSelectedUser(login);
    setMenuVisible(false);
  };


  const changePassword = async (userLogin: string, userPassword: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/change-user-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userLogin, userPassword }),
        credentials: 'include',
      });
      if (!response.ok) {
        throw new Error('Failed to change password');
      }
      setUserPassword('');
      setChangeMessage([true, 'Password changed successfully']);
    } catch (error) {
      setUserPassword('');
      setChangeMessage([false, 'Error changing password']);
    } finally {
      setIsLoading(false);
    }

  }

  const addSuperkey = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/add-superkey`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ superkey }),
        credentials: 'include',
      });
      if (!response.ok) {
        throw new Error('Failed to add superkey');
      }
      setSuperkeyMessage([true, 'Superkey added successfully']);
      setSuperkey('');
      setIsSuperkeyDisable(true);
    } catch (error) {
      setSuperkey('');
      setIsSuperkeyDisable(true);
      setSuperkeyMessage([false, 'Failed to add superkey']);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSuperkeys = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/superkeys`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to fetch superkeys');
      }
      const data = await response.json();
      setSuperkeys(data);
    } catch (error) {
      console.error('Error fetching superkeys:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Appbar.Header>
        <Appbar.Action icon="arrow-left" onPress={navigation.goBack} />
        <Appbar.Content title="Admin Dashboard" />
      </Appbar.Header>

      <ScrollView>
        <Card style={styles.card}>
          <Card.Content>
            <Title>Add New User</Title>
            <TextInput
              label="New User Login"
              value={newLogin}
              onChangeText={(text) => {
                setNewLogin(text)
                setIsDisableNewUser(true);
                if (text.length > 0 && newPassword.length > 0) {
                  setIsDisableNewUser(false);
                }
              }
              }
              style={styles.input}
              mode="outlined"
            />
            <TextInput
              label="New User Password"
              value={newPassword}
              onChangeText={
                (text) => {
                  setNewPassword(text)
                  setIsDisableNewUser(true);
                  if (text.length > 0 && newLogin.length > 0) {
                    setIsDisableNewUser(false);
                  }
                }}
              secureTextEntry
              style={styles.input}
              mode="outlined"
            />
            {
              addMessage[1] != '' &&
              (
                <Text style={{ color: addMessage[0] ? 'green' : 'red' }}>
                  {addMessage[1]}
                </Text>
              )
            }
            <Button mode="contained" onPress={addUser} style={styles.button} disabled={isLoading || isDisableNewUser} buttonColor={theme.colors.onBackground} textColor={theme.colors.background}>
              Add User
            </Button>
          </Card.Content>
        </Card>
        <Card style={styles.card}>
          <Card.Content>
            <Title>Add Superkey</Title>
            <TextInput
              label="Superkey (64 characters)"
              value={superkey}
              onChangeText={(text) => {
                setSuperkey(text)
                if (text.length == 64) {
                  setIsSuperkeyDisable(false);
                  return;
                }
                setIsSuperkeyDisable(true);
              }}
              style={styles.input}
              mode="outlined"
            />
            {
              superkeyMessage[1] != '' &&
              (
                <Text style={{ color: superkeyMessage[0] ? 'green' : 'red' }}>
                  {superkeyMessage[1]}
                </Text>
              )
            }
            <Button
              mode="contained"
              onPress={addSuperkey}
              style={styles.button}
              disabled={isLoading || isSuperkeyDisable}
              buttonColor={theme.colors.onBackground}
              textColor={theme.colors.background}>
              Add Superkey
            </Button>
          </Card.Content>
        </Card>
        <Card style={styles.card}>
          <Card.Content>
            <Title>List of Superkeys</Title>
            <SuperkeyList superkeys={superkeys} />
            <Button
              mode="contained"
              onPress={fetchSuperkeys}
              style={styles.button}
              icon="refresh"
              disabled={isLoading}
              buttonColor={theme.colors.onBackground}
              textColor={theme.colors.background}>
              Fetch Superkeys
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
              buttonColor={theme.colors.onBackground}
              textColor={theme.colors.background}
            >
              Fetch Users
            </Button>
            {isLoading ? (
              <ActivityIndicator animating={true} color={theme.colors.primary} style={styles.loader} />
            ) : (
              <>
                <Menu
                  visible={menuVisible}
                  onDismiss={() => setMenuVisible(false)}
                  anchor={<Button onPress={() => setMenuVisible(true)}>{selectedUser ? `Selected: ${selectedUser.login}` : 'Select User'}</Button>}
                >
                  {users.map((user) => (
                    <Menu.Item
                      key={user.login}
                      onPress={() => handleSelectUser(user)}
                      title={user.login}
                      dense={true}
                    />
                  ))}
                </Menu>

                {selectedUser && (
                  <View style={styles.input}>
                    {!selectedUser.isadmin && (
                      <View>
                        {
                          deleteMessage[1] != '' &&
                          (
                            <Text style={{ color: deleteMessage[0] ? 'green' : 'red' }}>
                              {deleteMessage[1]}
                            </Text>
                          )
                        }
                        <ConfirmButton
                          mainText={`Delete ${selectedUser.login}`}
                          CancelText='Cancel'
                          actionText='Delete'
                          action={() => deleteUser(selectedUser.login)}
                          isDisable={isLoading} />
                      </View>
                    )}
                    <TextInput
                      label="New Password"
                      value={userPassword}
                      onChangeText={setUserPassword}
                      secureTextEntry
                      style={styles.input}
                      mode="outlined"
                    />
                    {
                      changeMessage[1] != '' &&
                      (
                        <Text style={{ color: changeMessage[0] ? 'green' : 'red' }}>
                          {changeMessage[1]}
                        </Text>
                      )
                    }
                    <ConfirmButton
                      mainText={`Change ${selectedUser.login}'s password`}
                      CancelText='Cancel'
                      actionText='Change'
                      action={() => changePassword(selectedUser.login, userPassword)}
                      isDisable={isLoading} />
                  </View>
                )}
              </>
            )}
          </Card.Content>
        </Card>

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  card: {
    margin: 16,
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
  listContainer: {
    paddingVertical: 10,
  },
  superkeyItem: {
    padding: 8,
    marginVertical: 8,
    borderRadius: 10,
  },
  superkeyText: {
    fontSize: 16,
    fontWeight: '500',
  },
});

export default AdminScreen;