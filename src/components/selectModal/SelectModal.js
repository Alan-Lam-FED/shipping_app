import React, { useState, useRef } from "react";
import { styles } from "./stylesSelectModal";
import RadioForm, {
  RadioButton,
  RadioButtonInput,
  RadioButtonLabel,
} from "react-native-simple-radio-button";
import {
  View,
  Text,
  Modal,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Animated,
  Pressable,
  TextInput,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const SelectModal = (props) => {
  const [isShow, setisShow] = useState(false); // State control show and hide options
  const [value, VsetValue] = useState(0); //Index of select
  // console.log(props)
  const opacity = useRef(new Animated.Value(0)).current;

  const handleClose = () => {};

  return (
    <>
      <TouchableOpacity
        onPress={() => setisShow(true)}
        style={{
          width: "100%",
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <MaterialCommunityIcons
            name={props.nameIcon}
            size={24}
            color="black"
            style={styles.icon}
          />
          <Text style={styles.input}>{props.items[props.value].label}</Text>
        </View>
      </TouchableOpacity>
      <Modal
        animationType="slide"
        transparent={true}
        visible={isShow}
        onRequestClose={() => {
          setisShow(!isShow);
        }}
      >
        <TouchableWithoutFeedback onPress={() => setisShow(false)}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <View style={styles.titleModal}>
                <Text style={styles.modalText}>{props.titleModal}</Text>
              </View>
              <View>
                <RadioForm>
                  {props.items.map((obj, i) => (
                    <TouchableOpacity
                      key={i}
                      onPress={() => {
                        props.selectOption(i);
                      }}
                    >
                      <RadioButton style={styles.items} key={i}>
                        <View style={styles.leftWrapItem}>
                          <RadioButtonLabel
                            obj={obj}
                            index={i}
                            labelHorizontal={true}
                            onPress={(value) => {
                              // VsetValue(value);
                              props.selectOption(value);
                            }}
                            labelStyle={styles.leftLabel}
                            labelWrapStyle={styles.leftLabelWrap}
                          />
                          {obj.service && (
                            <Text style={styles.leftNote}>
                              (<Text style={{ color: "red" }}>*</Text>)
                              {obj.service}
                            </Text>
                          )}
                        </View>
                        <View style={styles.rightWrapItem}>
                          {obj.money && (
                            <Text style={styles.rightMoney}>
                              {obj.money} VND
                            </Text>
                          )}
                          <RadioButtonInput
                            obj={obj}
                            index={i}
                            isSelected={props.value === i}
                            onPress={(value) => {
                              props.selectOption(value);
                            }}
                            borderWidth={1}
                            buttonInnerColor={"#e74c3c"}
                            buttonOuterColor={props.value === i ? "#2196f3" : "#000"}
                            buttonSize={20}
                            buttonOuterSize={30}
                            buttonStyle={{}}
                            buttonWrapStyle={{}}
                          />
                        </View>
                      </RadioButton>
                      <View
                        style={{
                          borderBottomColor: "#e0e0e0",
                          borderBottomWidth: 1,
                        }}
                      />
                    </TouchableOpacity>
                  ))}
                </RadioForm>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </>
  );
};

export default SelectModal;
