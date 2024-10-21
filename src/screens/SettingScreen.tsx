import { useNavigation } from '@react-navigation/native';
import { useTheme, TextInput, Button, Appbar, Card, Title, Text } from 'react-native-paper';
import { StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import ConfirmButton from '../components/ConfirmButton';
import { API_URL } from '../api/server';

const SettingsScreen = () => {
    const theme = useTheme();
    const navigation = useNavigation();
    const [changeMessage, setChangeMessage] = useState<[boolean, string]>([true, '']);
    const [currentPassword, setCurrentPassword] = useState<string>('');
    const [newPassword, setNewPassword] = useState<string>('');
    const [isDisable, setIsDisable] = useState<boolean>(true);

    const changePassword = async (currentPassword: string, newPassword: string) => {
        try {
            const response = await fetch(`${API_URL}/change-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ currentPassword, newPassword }),
                credentials: 'include',
            });

            if (!response.ok) {
                throw new Error('Failed to change password');
            }

            setChangeMessage([true, 'Password changed successfully']);
            setCurrentPassword('');
            setNewPassword('');
            setIsDisable(true);
        } catch (error) {
            setChangeMessage([false, 'Failed to change password']);
            setCurrentPassword('');
            setNewPassword('');
        }

    }

    const arentEmpty = (currentPassword: string, newPassword: string) => {
        if (currentPassword != '' && newPassword != '') {
            setIsDisable(false);
        } else {
            setIsDisable(true);
        }
    }

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <Appbar.Header>
                <Appbar.Action icon="arrow-left" onPress={navigation.goBack} />
                <Appbar.Content title="Settings" />
            </Appbar.Header>
            <ScrollView>
                <Card style={styles.card}>
                    <Card.Content>
                        <Title>Change Password</Title>
                        <TextInput
                            label="Current Password"
                            value={currentPassword}
                            onChangeText={(text) => {
                                setCurrentPassword(text)
                                arentEmpty(currentPassword, newPassword);
                            }}
                            secureTextEntry
                            style={styles.input}
                            mode="outlined"
                        />
                        <TextInput
                            label="New Password"
                            value={newPassword}
                            onChangeText={(text) => {
                                setNewPassword(text)
                                arentEmpty(currentPassword, newPassword);
                            }}
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
                            mainText={`Change password`}
                            CancelText='Cancel'
                            actionText='Change'
                            action={() => changePassword(currentPassword, newPassword)}
                            isDisable={isDisable} />
                    </Card.Content>
                </Card>
            </ScrollView>
        </SafeAreaView>
    );
}

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
});

export default SettingsScreen;