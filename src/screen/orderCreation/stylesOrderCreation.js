import {StyleSheet} from "react-native";

export const styles = StyleSheet.create({
    container: {
      flex: 1,
      paddingVertical: 10,
      backgroundColor: "#f7f7f7",
    },
    icon: {
      marginRight: 5,
    },
    big_container: {
      width: "100%",
      backgroundColor: "#fff",
      alignItems: "center",
      marginBottom: 10,
    },
    small_container: {
      width: "90%",
      marginVertical: 10,
    },
    text_container: {
      flexDirection: "row",
      alignItems: "center",
    },
    input_container: {
      width: "100%",
      flexDirection: "row",
      alignItems: "center",
      padding: 5,
      borderColor: "#e0e0e0",
      borderWidth: 1,
      borderRadius: 5,
      marginTop: 10,
    },
    input: {
      flex: 1,
      paddingHorizontal: 5,
      paddingVertical: 5,
    },
    input_error: {
      borderColor: "red",
      borderWidth: 1,
    },
    text_error: {
      color: "red",
    },
    disabled_input: {
      backgroundColor: "lightgray",
    },
    important_input: {
      // borderColor: "crimson",
      borderWidth: 1,
    },
    important_text: {
      color: "crimson",
    },
    counter: {
      flexDirection: "row",
      justifyContent: "flex-end",
      alignItems: "center",
    },
    switch_container: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "flex-end",
      marginTop: 10,
    },
    submit_button: {
      marginTop: 10,
      flexDirection: "row",
      backgroundColor: "orange",
      justifyContent: "center",
      alignItems: "center",
      padding: 15,
      width: "80%",
      borderRadius: 5,
    },
    dropdownText: {
      fontSize: 13,
    },
  
    // hàng hóa DCTUONG
    wrapIconText: {
      alignItems: "center",
    },
    centeredView: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      marginTop: 22,
    },
    modalView: {
      margin: 20,
      backgroundColor: "white",
      borderRadius: 20,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
    },
    titleModal: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "flex-start",
      backgroundColor: "red",
      paddingHorizontal: 5,
      borderTopLeftRadius: 5, // Đặt giá trị cho góc trên bên trái
      borderTopRightRadius: 5, // Đặt giá trị cho góc trên bên phải
    },
    button: {
      borderRadius: 20,
      padding: 5,
      elevation: 2,
    },
    buttonClose: {
      marginLeft: 10,
      color: "white",
      backgroundColor: "transparent",
    },
    textStyle: {
      color: "white",
      fontWeight: "bold",
      textAlign: "center",
    },
    modalText: {
      textAlign: "center",
      color: "white",
      fontWeight: "bold",
      fontSize: 20,
      paddingHorizontal: 30,
      paddingVertical: 10,
    },
    selectOption: {
      padding: 10,
      borderBottomColor: "black",
      borderBottomWidth: 1,
      fontSize: 17,
    },
    productTitle: {
      alignItems: "center",
      paddingTop: 2,
    },
    imageWrapper: {
      width: "90%",
      height: 380,
    },
    btnDelete: {
      height: 27,
      width: "100%",
      textAlign: "right",
    },
    image: {
      width: "100%",
      objectFit: "cover",
      height: 350,
    },
  });