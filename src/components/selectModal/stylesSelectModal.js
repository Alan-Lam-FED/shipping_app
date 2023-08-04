import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 5,
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
    alignItems: "center",
    backgroundColor: "red",
    borderTopLeftRadius: 5, // Đặt giá trị cho góc trên bên trái
    borderTopRightRadius: 5, // Đặt giá trị cho góc trên bên phải
  },
  modalText: {
    textAlign: "center",
    color: "white",
    fontWeight: "bold",
    fontSize: 20,
    paddingHorizontal: 30,
    paddingVertical: 10,
  },
  items: {
    display: "flex",
    justifyContent: "space-between",
    marginTop:5
  },
  leftWrapItem: {
    paddingVertical: 7,
    paddingHorizontal: 5,
    paddingRight: 20,
  },
  leftLabel: {
    fontSize: 18,
    fontWeight: "400",
  },
  leftLabelWrap: {
    width: "100%",
    display: "flex",
  },
  leftNote: { color: "#2196f3", paddingLeft: 5 },
  rightWrapItem: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    paddingRight: 10,
  },
  rightMoney: { paddingRight: 10, color: "orange" },
});
