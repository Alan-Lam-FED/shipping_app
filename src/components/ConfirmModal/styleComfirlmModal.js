import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0000002e',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 15,
    width: '90%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },

  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  wrapTitle: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  wrapCheckbox: {
    flexDirection: 'row'
  },
  checkbox: {
    flexDirection: 'row',
    display: 'flex',
    marginLeft: 5
  },
  wrapInput: {
    // backgroundColor:'black',
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5
  },
  lableInput: {
    marginRight: 5,
    width: '26%',
    justifyContent: 'flex-end',
    textAlign: 'right'
  },
  wrapTextInput: {
    borderColor: '#EADBC8',
    borderWidth: 1,
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#F8F0E5',
    height: 30
  },
  textInput: {
    height: 30,
    paddingHorizontal: 10,
    width: '100%'
  },
  wrapButtonCamera: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'black',
    width: '60%',
    paddingVertical: 8,
    marginVertical: 10,
    justifyContent: 'center',
    backgroundColor: '#F94C10',
    borderRadius: 5
  },
  cancelImage: {
    width: '15%',
    marginHorizontal: 3,
    paddingVertical: 8,
    marginVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',

  }
});
