import React from "react";
import { StyleSheet, View, Image } from "react-native";
import Signature from "react-native-signature-canvas";


const Sign = ({handlerIsShow,handlerSign}) => {
 
  const handleOK = (signature) => {
    handlerSign(signature);
    handlerIsShow()
  };
  const handleEmpty = () => {
    alert('sao ko ký gì hết vậy?')
  };
  const style = `
  .m-signature-pad {
    z-index: 3;
    position: absolute;
    font-size: 10px;
    width: '100%';
    height: 89vh;
    top: 0;
    border: 1px solid #e8e8e8;
    background-color: #fff;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.27), 0 0 40px rgba(0, 0, 0, 0.08) inset;
  }
  `;
  return (
    <View style={{ flex: 1 }}>
      {/* <View style={styles.preview}>
        {signature ? (
          <Image
            resizeMode={"contain"}
            style={{ width: 335, height: 114,flex:1 }}
            source={{ uri: signature }}
          />
        ) : null}
      </View> */}
      <Signature
        onOK={handleOK}
        onEmpty={handleEmpty}
        descriptionText="Ký tên"
        clearText="Clear"
        confirmText="Save"
        webStyle={style}
        overlayHeight={90}
      />
    </View>
  );
  
};

const styles = StyleSheet.create({
  // preview: {
  //   width: 335,
  //   height: 114,
  //   backgroundColor: "#F8F8F8",
  //   justifyContent: "center",
  //   alignItems: "center",
  //   marginTop: 15,
  // },
  
});

export default Sign;