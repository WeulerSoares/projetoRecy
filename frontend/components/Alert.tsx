import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';

const Alert = ({ message, onClose }) => {
    return (
        <View style={styles.alertOverlay}>
            <View style={styles.alertBox}>
                <Text style={styles.alertText}>{message}</Text>
                <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                    <Text style={styles.closeButtonText}>Fechar</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    alertOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        zIndex: 10,
    },
    alertBox: {
        width: '80%',
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 20,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
    },
    alertText: {
        fontSize: 16,
        color: '#333',
        textAlign: 'center',
        marginBottom: 20,
    },
    closeButton: {
        backgroundColor: '#6dc06d',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 5,
    },
    closeButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default Alert;
