import React, { useState } from 'react';
import { styles } from "./styleComfirlmModal.js"
import { Modal, Text, Pressable, View } from 'react-native';
import { Entypo } from '@expo/vector-icons';
import CheckBox from 'expo-checkbox';
import { TextInput } from 'react-native-gesture-handler';

import InforInput from './InforInput'
const ConfirmModal = ({ show, handlerShowComfirmModal, ...prop }) => {
  const [toggleCheckBox, setToggleCheckBox] = useState(false)
  const handleTextPress = () => {
    setToggleCheckBox(!toggleCheckBox);
  };
  return (
    <>
      <View style={styles.centeredView}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={show}
          onRequestClose={() => {
            handlerShowComfirmModal(!show);
          }}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              {/* //title */}
              <View style={styles.wrapTitle}>
                <Entypo name="popup" size={24} color="black" />
                <View style={[styles.wrapCheckbox]}>
                  <Text style={{ color: '#F94C10' }}>
                    {prop.code}
                  </Text>
                  <View style={styles.checkbox} >
                    <CheckBox
                      value={toggleCheckBox}
                      onValueChange={setToggleCheckBox}
                    />
                    <Text style={{ marginLeft: 5 }}
                      onPress={handleTextPress}
                    >
                      Ký Thay
                    </Text>
                  </View>
                </View>
              </View>
              {/* //end title */}
              {/* COD,TAX,total,ngưởi nhận Ký */}

              <InforInput
                lable={'COD'}
                placeholderInput='Enter COD'
              />
               <InforInput
                lable={'TAX'}
                placeholderInput='Enter TAX'
              />
               <InforInput
                lable={'Tổng cộng'}
              />
               <InforInput
                lable={'Người ký nhận'}
              />

              <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={() => handlerShowComfirmModal(!show)}>
                <Text style={styles.textStyle}>Hide Modal</Text>
              </Pressable>
            </View>
          </View>
        </Modal>

      </View>
    </>
  );
}






export default ConfirmModal;
