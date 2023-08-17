import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, Text, Modal, TouchableWithoutFeedback, Animated } from 'react-native';

const CustomModal = (props) => {
    const opacity = useRef(new Animated.Value(0)).current;

    // Khi mở model, delay open 1s, hiển thị 3s, tắt trong 1s
    useEffect(() => {
        if (props.modalVisible) {
            handleOpen()
        }
    }, [props.modalVisible])

    const handleOpen = () => {
        Animated.timing(opacity, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
        }).start(() => {
            setTimeout(() => handleClose(), 3000)
        });
    };

    const handleClose = () => {
        Animated.timing(opacity, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
        }).start(() => {
            props.setModalVisible(false);
        });
    };
    return (
        <View>
            <Modal
                visible={props.modalVisible}
                transparent={true}
                onRequestClose={handleClose}>
                <TouchableWithoutFeedback
                    style={{ flex: 1 }}
                    onPress={handleClose}>
                    <Animated.View
                        style={[styles.big_container, { opacity }]}>
                        <View
                            style={styles.text_container}>
                            <Text
                                style={styles.text}>
                                {props.modalMessage}
                            </Text>
                        </View>
                    </Animated.View>
                </TouchableWithoutFeedback>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    big_container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)'
    },
    text_container: {
        backgroundColor: 'black',
        padding: 10,
        borderRadius: 5
    },
    text: {
        textAlign: 'center',
        color: 'white',
        fontWeight: 'bold',
        fontSize: 20
    }
})

export default CustomModal