import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme, Button } from 'react-native-paper';

const ConfirmButton = ({ mainText, CancelText, actionText, action, isDisable}) => {
    const [isVisible, setVisible] = useState(false);
    const theme = useTheme();

    const handleDelete = () => {
        setVisible(true);
    };

    const handleCancel = () => {
        setVisible(false);
    }

    return <View>
        <Button
            mode="contained"
            onPress={() => handleDelete()}
            disabled={isDisable}
            buttonColor='#f44336'
            textColor='black'
            style={styles.actionButton}
            children={mainText}
        />
        {
            isVisible && (
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Button onPress={handleCancel} style={styles.confirmButton} buttonColor={theme.colors.onBackground} textColor={theme.colors.background}>
                        {CancelText}
                    </Button>
                    <Button onPress={() => {
                        action();
                        setVisible(false);
                    }}
                        style={styles.confirmButton}
                        buttonColor='#f44336'
                        textColor='black'>
                        {actionText}
                    </Button>
                </View>
            )
        }
    </View>

}

const styles = StyleSheet.create({
    confirmButton: {
        paddingHorizontal: 32,
        marginTop: 8,
        marginBottom: 8,
    },
    actionButton: {
        padding: 8,
        marginTop: 8,
        marginBottom: 8,
    },
})

export default ConfirmButton;