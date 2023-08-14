import React, { useState } from 'react';
import { styles } from "./styleComfirlmModal.js"
import { Modal, Text, Pressable, View, TouchableOpacity ,PermissionsAndroid} from 'react-native';
import CheckBox from 'expo-checkbox';
import { Entypo, AntDesign, MaterialIcons, Ionicons } from '@expo/vector-icons';
import InforInput from './InforInput'
import * as ImagePicker from "expo-image-picker";
import * as Permissions from "expo-permissions";const ConfirmModal = ({ show, handlerShowComfirmModal, ...prop }) => {
  const [toggleCheckBox, setToggleCheckBox] = useState(false)
  const handleTextPress = () => {
    setToggleCheckBox(!toggleCheckBox);
  };

  const [image, setImage] = useState(null);
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
        // fetch("http://192.168.2.111:8080/", {
        //   method: "POST",
        //   headers: {
        //     Accept: "application/json",
        //     "Content-Type": "application/json",
        //   },
        //   // send our base64 string as POST request
        //   body: JSON.stringify({
        //     imgsource: image.base64,
        //   }),
        // });
        setImage(result.assets[0].uri);
      }
    }
  };

  // let options = {
  //   saveToPhotos :true,
  //   mediaType:'photo'
  // }
  // const openCamera = async ()=>{
  //   const granted = await PermissionsAndroid.request(
  //     PermissionsAndroid.PERMISSIONS.CAMERA
  //   )
  //   if(granted === PermissionsAndroid.RESULTS.GRANTED){
  //     const result =await launchCamera({
  //       saveToPhotos :true,
  //       mediaType:'photo'
  //     })
  //     setImage(result.assets[0].uri)
  //   }
  // }
  
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
              <View style={{ width: '100%', flexDirection: 'row', alignItems: 'center' }}>
                <View style={styles.cancelImage}>
                  <MaterialIcons name="cancel" size={30} color="black" />
                </View>
                <TouchableOpacity style={styles.wrapButtonCamera}
                onPress={openCamera}>
                  <AntDesign name="camera" size={24} color="white" />
                  <Text style={{ color: 'white', fontWeight: '600', marginLeft: 10 }}>
                    Chụp Hình
                  </Text>
                </TouchableOpacity>
                <View style={styles.cancelImage}>
                  <Ionicons name="md-checkmark-done-circle-outline" size={30 } color="#F94C10" />
                </View>
              </View>
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
