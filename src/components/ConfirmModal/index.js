import React, { useRef, useState } from 'react';
import { styles } from "./styleComfirlmModal.js"
import { Modal, Text, Pressable, View, TouchableOpacity } from 'react-native';
import CheckBox from 'expo-checkbox';
import { Entypo, AntDesign, MaterialIcons, Ionicons, EvilIcons } from '@expo/vector-icons';
import InforInput from './InforInput'
import * as ImagePicker from "expo-image-picker";
import * as Permissions from "expo-permissions";
import Sign from './Sign/index.js';


const ConfirmModal = ({ show, handlerShowComfirmModal, ...prop }) => {
  const [toggleCheckBox, setToggleCheckBox] = useState(false)
  const [showSign, isShowSign] = useState(false) // Hiển thị phần ký tên
  const [signature, setSign] = useState(null); // lưu trữ ký tên
  const [image, setImage] = useState(null); // camera chụp ảnh

  const handleTextPress = () => {
    setToggleCheckBox(!toggleCheckBox);
  };

  //Check permission camera
  const askForPermission = async () => {
    const permissionResult = await Permissions.askAsync(Permissions.CAMERA);
    if (permissionResult.status !== "granted") {
      Alert.alert("no permissions to access camera!", [{ text: "ok" }]);
      return false;
    }
    return true;
  };
  // Hàm xử lí chụp ảnh màn hình
  const openCamera = async () => {
    // make sure that we have the permission
    const hasPermission = await askForPermission();
    if (!hasPermission) {
      return;
    } else {
      // launch the camera with the following settings
      let result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
      // make sure a image was taken:
      if (!result.canceled) {
        setImage(result.assets[0].uri);
      }
    }
  };


  const handlerIsShow = () => {
    isShowSign(!showSign)
  }
  const handlerSign = (data) => {
    setSign(!data)
  }


  const dataInput = [{
    lable: 'COD',
    placeholderInput: 'Enter COD'
  }, {
    lable: 'TAX',
    placeholderInput: 'Enter TAX'
  }, {
    lable: 'Tổng cộng',
    placeholderInput: ''
  }, {
    lable: 'Người ký nhận',
    placeholderInput: ''
  },]
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
          {showSign ? <Sign
            handlerIsShow={handlerIsShow}
            handlerSign={handlerSign}
          /> : <View style={styles.centeredView}>
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
              {/* COD,TAX,total,ngưởi nhận Ký */}
              {dataInput.map((data, index) => {
                return <InforInput
                  key={index}
                  lable={data.lable}
                  placeholderInput={data.placeholderInput}
                />
              })}
              <View style={{ width: '100%', flexDirection: 'row', alignItems: 'center', height: 45 }}>
                <View style={styles.cancelImage}>
                  {image !== null ? <MaterialIcons name="cancel" size={30} color="black"
                    onPress={() => setImage(null)} /> : <Text></Text>}
                </View>
                <TouchableOpacity style={styles.wrapButtonCamera}
                  onPress={openCamera}>
                  <AntDesign name="camera" size={24} color="white" />
                  <Text style={{ color: 'white', fontWeight: '600', marginLeft: 10, width: '40%' }}>
                    Chụp Hình
                  </Text>
                </TouchableOpacity>
                <View style={styles.cancelImage}>
                  <Ionicons name="md-checkmark-done-circle-outline" size={30} color={image !== null ? '#F94C10' : 'black'} />
                </View>
              </View>
              {/* sign (ký tên) */}
              <View style={{ width: '100%', flexDirection: 'row', alignItems: 'center', height: 45 }}>
                <View style={styles.cancelImage}>
                  {signature !== null ? <MaterialIcons name="cancel" size={30} color="black"
                    onPress={() => setImage(null)} /> : <Text></Text>}
                </View>
                <TouchableOpacity style={styles.wrapButtonCamera}
                  onPress={handlerIsShow}
                >
                  <EvilIcons name="pencil" size={30} color="white" />
                  <Text style={{ color: 'white', fontWeight: '600', marginLeft: 10, width: '40%' }}>
                    Ký Tên
                  </Text>
                </TouchableOpacity>
                <View style={styles.cancelImage}>
                  <Ionicons name="md-checkmark-done-circle-outline" size={30} color={signature !== null ? '#F94C10' : 'black'} />
                </View>
              </View>
              <View style={{flexDirection:'row',marginTop:10}}>
                <TouchableOpacity
                  style={[styles.button,{marginHorizontal:5}]}
                  onPress={() => handlerShowComfirmModal(!show)}>
                  <Text style={styles.textStyle}>Hủy</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.button, { borderWidth: 1, borderColor: '#F94C10',marginHorizontal:5 }]}
                  onPress={() => handlerShowComfirmModal(!show)}>
                  <Text style={[styles.textStyle, { color: '#F94C10' }]}>Xác nhận</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>}
        </Modal>

      </View>
    </>
  );
}





export default ConfirmModal;
