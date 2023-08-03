import React, { useState, useRef } from 'react';
import RadioForm, { RadioButton, RadioButtonInput, RadioButtonLabel } from 'react-native-simple-radio-button';
import { StyleSheet, View, Text, Modal, TouchableWithoutFeedback, TouchableOpacity, Animated, Pressable } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const SelectModal = (props) => {
    // console.log(props)
    const opacity = useRef(new Animated.Value(0)).current;

    const handleClose = () => {
        
    }

    return (
        <>
            <TouchableOpacity
                onPress={() => props.setisShow(true)}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <MaterialCommunityIcons name="format-list-numbered" size={24} color="black" style={styles.icon} />
                    <Text style={styles.input} >{props.items[props.value].label}</Text>
                </View>
            </TouchableOpacity>
            <Modal
                animationType="slide"
                transparent={true}
                visible={props.isShow}
                onRequestClose={() => {
                    props.setisShow(!props.isShow);
                }}>
                <TouchableWithoutFeedback
                    onPress={() => props.setisShow(false)}>
                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                            <View style={styles.titleModal}>
                                <Text style={styles.modalText}>Loại hàng hóa</Text>
                            </View>
                            <View>
                                <RadioForm>
                                    {props.items.map((obj, i) => (
                                        <TouchableOpacity>

                                            <RadioButton key={i}  >
                                                <RadioButtonLabel
                                                    obj={obj}
                                                    index={i}
                                                    labelHorizontal={true}
                                                    onPress={(value) => { props.setValue(value) }}
                                                    labelStyle={{ fontSize: 20, color: 'black', width: 180, alignItems: 'center' }}
                                                    labelWrapStyle={{}}
                                                />
                                                <RadioButtonInput
                                                    obj={obj}
                                                    index={i}
                                                    isSelected={props.value === i}
                                                    onPress={(value) => { props.setValue(value) }}
                                                    borderWidth={1}
                                                    buttonInnerColor={'#e74c3c'}
                                                    buttonOuterColor={props.value === i ? '#2196f3' : '#000'}
                                                    buttonSize={20}
                                                    buttonOuterSize={30}
                                                    buttonStyle={{}}
                                                    buttonWrapStyle={{ paddingRight: 10, paddingVertical: 10 }}
                                                />
                                            </RadioButton>
                                            <View style={{ borderBottomColor: '#e0e0e0', borderBottomWidth: 1 }} />{/*Đường kẻ ngang*/}
                                        </TouchableOpacity>
                                    ))
                                    }
                                </RadioForm>
                            </View>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        </>
    )
}

const styles = StyleSheet.create({
    wrapIconText: {
        alignItems: 'center',
        backgroundColor: 'blue'
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        // marginTop: 22,
    },
    modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 5,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    titleModal: {
        alignItems: 'center',
        backgroundColor: 'red',
        borderTopLeftRadius: 5,   // Đặt giá trị cho góc trên bên trái
        borderTopRightRadius: 5,  // Đặt giá trị cho góc trên bên phải 
    },
    button: {
        borderRadius: 20,
        padding: 5,
        elevation: 2,
    },
    buttonClose: {
        marginLeft: 10,
        color: 'white',
        backgroundColor: 'transparent'
    },
    textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    modalText: {
        textAlign: 'center',
        color: 'white',
        fontWeight: 'bold',
        fontSize: 20,
        paddingHorizontal: 30,
        paddingVertical: 10,
        textAlign: 'center'
    },
    selectOption: {
        padding: 10,
        borderBottomColor: 'black',
        borderBottomWidth: 1,
        fontSize: 17,
    },
    input: {
        // flex: 1,
        paddingHorizontal: 5
    },
    input_container: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        padding: 5,
        borderColor: '#e0e0e0',
        borderWidth: 1,
        borderRadius: 5,
        marginTop: 10
    },
})

export default SelectModal