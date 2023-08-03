import * as ImagePicker from "expo-image-picker";
import * as Permissions from "expo-permissions";
import React, { useMemo, useState } from "react";
import RadioForm, {
  RadioButton,
  RadioButtonInput,
  RadioButtonLabel,
} from "react-native-simple-radio-button"; // import React, { useState } from 'react'
import { Formik } from "formik";
import * as Yup from "yup";
import {
  StyleSheet,
  StatusBar,
  Text,
  View,
  SafeAreaView,
  TextInput,
  ScrollView,
  Switch,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Image,
  Modal,
  Pressable,
} from "react-native";
import {
  AntDesign,
  Feather,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import SelectDropdown from "react-native-select-dropdown";
import CustomModal from "../../components/CustomModal";
import SelectModal from "../../components/SelectModal";

export default function Home({ navigation }) {
  const [inputVUN, setInputVUN] = useState(false); // Dùng để Bật/Tắt(True/False) input VUT Số kiện và Chi phí
  const [inputPhiBaoHiem, setInputPhiBaoHiem] = useState(false); // Dùng để Bật/Tắt(True/False) input Phí bảo hiểm

  const [chieuDai, setChieuDai] = useState("");
  const [chieuRong, setChieuRong] = useState("");
  const [chieuCao, setChieuCao] = useState("");
  const [trongLuongQuyDoi, setTrongLuongQuyDoi] = useState("");

  const [modalVisible, setModalVisible] = useState(false); // Dùng để Bật/Tắt Modal thông báo
  const [modalMessage, setModalMessage] = useState(""); // Dùng để hiển thị nội dung Modal thông báo

  // Hàm xử lí chụp ảnh màn hình
  const askForPermission = async () => {
    const permissionResult = await Permissions.askAsync(Permissions.CAMERA);
    if (permissionResult.status !== "granted") {
      Alert.alert("no permissions to access camera!", [{ text: "ok" }]);
      return false;
    }
    return true;
  };

  handleImageCapture = async () => {
    // make sure that we have the permission
    const hasPermission = await askForPermission();
    if (!hasPermission) {
      return;
    } else {
      // launch the camera with the following settings
      let image = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        aspect: [4, 3],
        quality: 1,
        base64: true,
      });
      // make sure a image was taken:
      if (!image.canceled) {
        fetch("http://192.168.2.111:8080/", {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          // send our base64 string as POST request
          body: JSON.stringify({
            imgsource: image.base64,
          }),
        });
      }
    }
  };

  // Hàm tính trọng lương quy đổi tự động
  const TinhTrongLuongQuyDoi = (chieuDai, chieuRong, chieuCao) => {
    // Kiểm tra số có tồn tại && có phải số && và số dương hay không
    const preCheckNumber = (number) =>
      number && !isNaN(parseFloat(number)) && parseFloat(number) >= 0;
    if (
      preCheckNumber(chieuDai) &&
      preCheckNumber(chieuRong) &&
      preCheckNumber(chieuCao)
    ) {
      // Trọng lượng quy đổi = Dài * Rộng * Cao / 5000
      setTrongLuongQuyDoi(
        (
          (parseFloat(chieuDai) *
            parseFloat(chieuRong) *
            parseFloat(chieuCao)) /
          5000
        )
          .toFixed(2)
          .toString()
      );
    } else setTrongLuongQuyDoi("");
  };

  // Hàm format input tiền tệ
  const formatCurrency = (amount) => {
    //Kiểm tra có null hoặc NaN không, nếu có thì return null
    if (amount == "" || isNaN(parseFloat(amount))) return "";
    else {
      const formattedAmount = new Intl.NumberFormat({
        minimumFractionDigits: 0,
      }).format(amount);
      return formattedAmount;
    }
  };
  // Hàm xóa format input tiền tệ
  const unformatCurrency = (formattedAmount) => {
    // Xóa bỏ dấu các dấu [. , -] ra khỏi chuỗi
    const unformattedAmount = Number(formattedAmount.replace(/[.,-]/g, ""));
    return unformattedAmount;
  };

  const dataPhuongThucVanChuyen = [
    "Dịch vụ chuyển phát tiêu chuẩn",
    "Dịch vụ chuyển phát nhanh",
    "Siêu dịch vụ giao hàng",
    "Giao hàng tươi sống",
  ];

  const validationSchema = Yup.object().shape({
    sdtNguoiGui: Yup.number()
      .integer("Hãy nhập số điện thoại hợp lệ!")
      .required("Hãy nhập vào số điện thoại!")
      .typeError("Hãy nhập số điện thoại hợp lệ!")
      .test(
        "",
        "Số điện thoại phải có ít nhất 9 chữ số",
        (value) => value && value.toString().length >= 9
      ),
    hoTenNguoiGui: Yup.string()
      .required("Hãy nhập họ tên người gửi!")
      .matches(/^[\p{L} ]+$/u, "Hãy nhập tên hợp lệ!"),
    diaChiNguoiGui: Yup.string().required("Hãy nhập địa chỉ người gửi!"),
    diemDiNguoiGui: Yup.string().required("Hãy nhập điểm đi!"),
    sdtNguoiNhan: Yup.number()
      .integer("Hãy nhập số điện thoại hợp lệ!")
      .required("Hãy nhập vào số điện thoại!")
      .typeError("Hãy nhập số điện thoại hợp lệ!")
      .test(
        "",
        "Số điện thoại phải có ít nhất 9 chữ số",
        (value) => value && value.toString().length >= 9
      ),
    hoTenNguoiNhan: Yup.string()
      .required("Hãy nhập họ tên người nhận!")
      .matches(/^[\p{L} ]+$/u, "Hãy nhập tên hợp lệ!"),
    diaChiNguoiNhan: Yup.string().required("Hãy nhập địa chỉ người nhận!"),
    buuCucDen: Yup.string().required("Hãy nhập bưu cục đến!"),
    noiDungHangHoa: Yup.string().required("Hãy nhập nội dung hàng hóa!"),
    giaTriSanPham: Yup.number()
      .required("Hãy nhập giá trị sản phẩm!")
      .test("", "Hãy nhập giá trị sản phẩm!", (value) => value !== 0),
    phuongThucVanChuyen: Yup.string().required(
      "Hãy chọn phương thức vận chuyển!"
    ),
    trongLuong: Yup.number().required("Hãy nhập trọng lượng!"),
    soKien: Yup.number().required("Hãy nhập số kiện!"),
  });

  const initialValues = {
    // Danh sách các giá trị khởi tạo
    sdtNguoiGui: "",
    hoTenNguoiGui: "",
    diaChiNguoiGui: "",
    diemDiNguoiGui: "",
    phuongThucVanChuyen: "",
    sdtNguoiNhan: "",
    hoTenNguoiNhan: "",
    diaChiNguoiNhan: "",
    buuCucDen: "",
    noiDungHangHoa: "",
    giaTriSanPham: "",
    switchGiao1Phan: false,
    switchPhiBaoHiem: false,
    hangHoa: "",
    express: "",
    trongLuong: "",
    soKien: "1",
    chieuDai: "",
    chieuRong: "",
    chieuCao: "",
    trongLuongQuyDoi: "",
    switchVUN: false,
    vunSoKien: "",
    vunChiPhi: "",
    cod: "",
    phiCOD: "",
    tienPhaiThu: "",
    phiBaoHiem: "",
    soTienGiamGia: "",
    cacPhiKhac: "",
    ghiChu: "",
  };
  //DCTUONG
  const [isShow, setisShow] = useState(false); // State control show and hide options
  const [value, setValue] = useState(0); //Index of select
  const items = [
    { label: "Hàng hóa", value: 0 },
    { label: "Fresh", value: 1 },
    { label: "Thư Từ", value: 2 },
  ];
  //EXPRESS
  const [isExpress, setisExpress] = useState(false); // State control show and hide options
  const [valueOfExpress, setValueOfExpress] = useState(0); //Index of select
  const services = [
    {
      label: "EXPRESS",
      value: 0,
      service: "Dịch vụ tiêu chuẩn",
      money: formatCurrency(500),
    },
    {
      label: "FAST",
      value: 1,
      service: "Dịch vụ chuyển nhanh",
      money: formatCurrency(5000),
    },
    {
      label: "SUPER",
      value: 2,
      service: "Dịch vụ hỏa tốc",
      money: formatCurrency(1000),
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar />
      <ScrollView>
        <CustomModal
          modalVisible={modalVisible}
          setModalVisible={setModalVisible}
          modalMessage={modalMessage}
          setModalMessage={setModalMessage}
        />
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={(values) => console.log(values)}
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleSubmit,
            setFieldValue,
          }) => (
            <View>
              <View style={styles.big_container}>
                <View style={styles.small_container}>
                  <View style={styles.text_container}>
                    {/*Khung text*/}
                    <AntDesign
                      name="user"
                      size={24}
                      color="black"
                      style={styles.icon}
                    />
                    <Text>Người gửi</Text>
                  </View>

                  <View
                    style={{
                      borderBottomColor: "#e0e0e0",
                      borderBottomWidth: 1,
                      marginTop: 10,
                    }}
                  />
                  {/*Đường kẻ ngang*/}

                  <View
                    style={[
                      styles.input_container,
                      errors.sdtNguoiGui && touched.sdtNguoiGui
                        ? styles.input_error
                        : null,
                    ]}
                  >
                    {/*Khung input số điện thoại người gửi*/}
                    <Feather
                      name="phone"
                      size={24}
                      color="gray"
                      style={styles.icon}
                    />
                    <TextInput
                      placeholder="Điện thoại"
                      style={styles.input}
                      keyboardType="numeric"
                      maxLength={10}
                      onChangeText={handleChange("sdtNguoiGui")}
                      value={values.sdtNguoiGui}
                    />
                  </View>
                  {errors.sdtNguoiGui && touched.sdtNguoiGui ? (
                    <Text style={styles.text_error}>{errors.sdtNguoiGui}</Text>
                  ) : null}

                  <View
                    style={[
                      styles.input_container,
                      errors.hoTenNguoiGui && touched.hoTenNguoiGui
                        ? styles.input_error
                        : null,
                    ]}
                  >
                    {/*Khung input họ tên người gửi*/}
                    <AntDesign
                      name="user"
                      size={24}
                      color="gray"
                      style={styles.icon}
                    />
                    <TextInput
                      placeholder="Họ tên"
                      autoCapitalize="words"
                      style={styles.input}
                      maxLength={40}
                      onChangeText={handleChange("hoTenNguoiGui")}
                      value={values.hoTenNguoiGui}
                    />
                  </View>
                  {errors.hoTenNguoiGui && touched.hoTenNguoiGui ? (
                    <Text style={styles.text_error}>
                      {errors.hoTenNguoiGui}
                    </Text>
                  ) : null}

                  <View
                    style={[
                      styles.input_container,
                      errors.diaChiNguoiGui && touched.diaChiNguoiGui
                        ? styles.input_error
                        : null,
                    ]}
                  >
                    {/*Khung input text area địa chỉ người gửi*/}
                    <Feather
                      name="map"
                      size={24}
                      color="gray"
                      style={styles.icon}
                    />
                    <View style={{ flex: 1 }}>
                      <TextInput
                        placeholder="Địa chỉ"
                        style={styles.input}
                        autoCapitalize="words"
                        multiline={true}
                        numberOfLines={4}
                        maxLength={250}
                        onChangeText={handleChange("diaChiNguoiGui")}
                        value={values.diaChiNguoiGui}
                      />
                      <View style={styles.counter}>
                        {/*Đếm chiều dài ký tự nhập vào 0/250 của địa chỉ người gửi*/}
                        <Text style={[styles.important_text, { fontSize: 10 }]}>
                          {values.diaChiNguoiGui.length}/250
                        </Text>
                      </View>
                    </View>
                  </View>
                  {errors.diaChiNguoiGui && touched.diaChiNguoiGui ? (
                    <Text style={styles.text_error}>
                      {errors.diaChiNguoiGui}
                    </Text>
                  ) : null}

                  <View
                    style={[
                      styles.input_container,
                      errors.diemDiNguoiGui && touched.diemDiNguoiGui
                        ? styles.input_error
                        : null,
                    ]}
                  >
                    {/*Khung input text area điểm đi của người gửi*/}
                    <Feather
                      name="map-pin"
                      size={24}
                      color="gray"
                      style={styles.icon}
                    />
                    <TextInput
                      placeholder="Điểm đi"
                      style={styles.input}
                      autoCapitalize="words"
                      multiline={true}
                      numberOfLines={3}
                      maxLength={250}
                      onChangeText={handleChange("diemDiNguoiGui")}
                      value={values.diemDiNguoiGui}
                    />
                  </View>
                  {errors.diemDiNguoiGui && touched.diemDiNguoiGui ? (
                    <Text style={styles.text_error}>
                      {errors.diemDiNguoiGui}
                    </Text>
                  ) : null}
                </View>
              </View>

              <View style={styles.big_container}>
                <View style={styles.small_container}>
                  <View style={styles.text_container}>
                    {/*Khung text khách hàng VIP*/}
                    <Image
                      source={require("../../../assets/vip.png")}
                      style={[styles.icon, { width: 24, height: 24 }]}
                    ></Image>
                    <Text>Khách hàng VIP</Text>
                    <Text style={styles.important_text}> *</Text>
                  </View>
                  <View style={styles.input_container}>
                    <TextInput
                      autoCapitalize="none"
                      style={styles.input}
                      maxLength={40}
                    />
                  </View>
                </View>
              </View>

              <View style={styles.big_container}>
                <View style={styles.small_container}>
                  <View style={styles.text_container}>
                    {/*Khung text phương thức thanh toán*/}
                    <MaterialCommunityIcons
                      name="hand-coin-outline"
                      size={24}
                      color="black"
                      style={styles.icon}
                    />
                    <Text>Phương thức thanh toán</Text>
                    <Text style={styles.important_text}> *</Text>
                  </View>
                  <View style={styles.input_container}>
                    <TextInput
                      autoCapitalize="none"
                      style={styles.input}
                      maxLength={40}
                    />
                  </View>
                </View>
              </View>

              <View style={styles.big_container}>
                <View style={styles.small_container}>
                  <View style={styles.text_container}>
                    {/*Khung text phương thức vận chuyển*/}
                    <MaterialCommunityIcons
                      name="truck-outline"
                      size={24}
                      color="black"
                      style={styles.icon}
                    />
                    <Text>Phương thức vận chuyển</Text>
                    <Text style={styles.important_text}> *</Text>
                  </View>
                  <View style={[styles.input_container, styles.disabled_input]}>
                    <TextInput
                      editable={false}
                      autoCapitalize="none"
                      style={styles.input}
                      maxLength={40}
                      value={values.phuongThucVanChuyen}
                    />
                  </View>
                </View>
              </View>

              <View style={styles.big_container}>
                <View style={styles.small_container}>
                  <View style={styles.text_container}>
                    {/*Khung text*/}
                    <AntDesign
                      name="user"
                      size={24}
                      color="black"
                      style={styles.icon}
                    />
                    <Text>Người nhận</Text>
                  </View>

                  <View
                    style={{
                      borderBottomColor: "#e0e0e0",
                      borderBottomWidth: 1,
                      marginTop: 10,
                    }}
                  />
                  {/*Đường kẻ ngang*/}

                  <View
                    style={[
                      styles.input_container,
                      errors.sdtNguoiNhan && touched.sdtNguoiNhan
                        ? styles.input_error
                        : null,
                    ]}
                  >
                    {/*Khung input số điện thoại người nhận*/}
                    <Feather
                      name="phone"
                      size={24}
                      color="gray"
                      style={styles.icon}
                    />
                    <TextInput
                      placeholder="Điện thoại"
                      style={styles.input}
                      keyboardType="numeric"
                      maxLength={10}
                      onChangeText={handleChange("sdtNguoiNhan")}
                      value={values.sdtNguoiNhan}
                    />
                  </View>
                  {errors.sdtNguoiNhan && touched.sdtNguoiNhan ? (
                    <Text style={styles.text_error}>{errors.sdtNguoiNhan}</Text>
                  ) : null}

                  <View
                    style={[
                      styles.input_container,
                      errors.hoTenNguoiNhan && touched.hoTenNguoiNhan
                        ? styles.input_error
                        : null,
                    ]}
                  >
                    {/*Khung input họ tên người nhận*/}
                    <AntDesign
                      name="user"
                      size={24}
                      color="gray"
                      style={styles.icon}
                    />
                    <TextInput
                      placeholder="Họ tên"
                      autoCapitalize="words"
                      style={styles.input}
                      maxLength={40}
                      onChangeText={handleChange("hoTenNguoiNhan")}
                      value={values.hoTenNguoiNhan}
                    />
                  </View>
                  {errors.hoTenNguoiNhan && touched.hoTenNguoiNhan ? (
                    <Text style={styles.text_error}>
                      {errors.hoTenNguoiNhan}
                    </Text>
                  ) : null}

                  <View
                    style={[
                      styles.input_container,
                      errors.diaChiNguoiNhan && touched.diaChiNguoiNhan
                        ? styles.input_error
                        : null,
                    ]}
                  >
                    {/*Khung input text area địa chỉ người nhận*/}
                    <Feather
                      name="map"
                      size={24}
                      color="gray"
                      style={styles.icon}
                    />
                    <View style={{ flex: 1 }}>
                      <TextInput
                        placeholder="Địa chỉ"
                        style={styles.input}
                        autoCapitalize="words"
                        multiline={true}
                        numberOfLines={4}
                        maxLength={250}
                        onChangeText={handleChange("diaChiNguoiNhan")}
                        value={values.diaChiNguoiNhan}
                      />
                      <View style={styles.counter}>
                        {/*Đếm chiều dài ký tự nhập vào 0/250 của địa chỉ người nhận*/}
                        <Text style={[styles.important_text, { fontSize: 10 }]}>
                          {values.diaChiNguoiNhan.length}/250
                        </Text>
                      </View>
                    </View>
                  </View>
                  {errors.diaChiNguoiNhan && touched.diaChiNguoiNhan ? (
                    <Text style={styles.text_error}>
                      {errors.diaChiNguoiNhan}
                    </Text>
                  ) : null}

                  <View
                    style={[
                      styles.input_container,
                      errors.buuCucDen && touched.buuCucDen
                        ? styles.input_error
                        : null,
                    ]}
                  >
                    {/*Khung input text area bưu cục đến của người nhận*/}
                    <Feather
                      name="map-pin"
                      size={24}
                      color="gray"
                      style={styles.icon}
                    />
                    <TextInput
                      placeholder="Bưu cục đến"
                      style={styles.input}
                      autoCapitalize="words"
                      multiline={true}
                      numberOfLines={3}
                      maxLength={250}
                      onChangeText={handleChange("buuCucDen")}
                      value={values.buuCucDen}
                    />
                  </View>
                  {errors.buuCucDen && touched.buuCucDen ? (
                    <Text style={styles.text_error}>{errors.buuCucDen}</Text>
                  ) : null}
                </View>
              </View>

              <View style={styles.big_container}>
                <View style={styles.small_container}>
                  <View style={styles.text_container}>
                    {/*Khung text*/}
                    <MaterialCommunityIcons
                      name="package-variant-closed"
                      size={24}
                      color="black"
                      style={styles.icon}
                    />
                    <Text>Thông tin mục</Text>
                  </View>

                  <View
                    style={{
                      borderBottomColor: "#e0e0e0",
                      borderBottomWidth: 1,
                      marginTop: 10,
                    }}
                  />
                  {/*Đường kẻ ngang*/}

                  <View style={{ flexDirection: "row" }}>
                    <View
                      style={[
                        styles.input_container,
                        styles.important_input,
                        errors.noiDungHangHoa && touched.noiDungHangHoa
                          ? styles.input_error
                          : null,
                        { width: "60%" },
                      ]}
                    >
                      {/*Khung input text area nội dung hàng hóa*/}
                      <MaterialCommunityIcons
                        name="package-variant-closed"
                        size={24}
                        color="gray"
                        style={styles.icon}
                      />
                      <View style={{ flex: 1 }}>
                        <TextInput
                          placeholder="Nội dung hàng hóa"
                          style={styles.input}
                          autoCapitalize="none"
                          multiline={true}
                          numberOfLines={1}
                          maxLength={250}
                          onChangeText={handleChange("noiDungHangHoa")}
                          value={values.noiDungHangHoa}
                        />
                        <View style={styles.counter}>
                          {/*Đếm chiều dài ký tự nhập vào 0/250 của nội dung hàng hóa*/}
                          <Text
                            style={[styles.important_text, { fontSize: 10 }]}
                          >
                            {values.noiDungHangHoa.length}/250
                          </Text>
                        </View>
                      </View>
                    </View>

                    <View style={styles.switch_container}>
                      {/*Khung Switch giao 1 phần*/}
                      <Text>Giao 1 phần</Text>
                      <Switch
                        onValueChange={(value) =>
                          setFieldValue("switchGiao1Phan", value)
                        }
                        value={values.switchGiao1Phan}
                      />
                    </View>
                  </View>
                  {errors.noiDungHangHoa && touched.noiDungHangHoa ? (
                    <Text style={styles.text_error}>
                      {errors.noiDungHangHoa}
                    </Text>
                  ) : null}

                  <View style={{ flexDirection: "row" }}>
                    <View
                      style={[
                        styles.input_container,
                        !inputPhiBaoHiem && styles.disabled_input,
                        errors.giaTriSanPham && touched.giaTriSanPham
                          ? styles.input_error
                          : null,
                        // Check nếu Switch Phí bảo hiểm
                        { width: "60%" },
                      ]}
                    >
                      {/*Khung input text area giá trị sản phẩm*/}
                      <Ionicons
                        name="cash-outline"
                        size={24}
                        color="gray"
                        style={styles.icon}
                      />
                      <TouchableWithoutFeedback
                        onPress={() => {
                          setModalVisible(true);
                          setModalMessage(
                            "Hãy tích chọn Phí bảo hiểm\ntrước khi nhập Giá trị sản phẩm"
                          );
                        }}
                      >
                        <View style={{ flex: 1 }}>
                          <TextInput
                            name="giaTriSanPham"
                            editable={inputPhiBaoHiem}
                            placeholder="Giá trị sản phẩm"
                            style={styles.input}
                            keyboardType="numeric"
                            maxLength={50}
                            onChangeText={(value) =>
                              setFieldValue(
                                "giaTriSanPham",
                                unformatCurrency(value)
                              )
                            }
                            value={formatCurrency(values.giaTriSanPham)}
                          />
                        </View>
                      </TouchableWithoutFeedback>
                    </View>
                    {/* </TouchableWithoutFeedback> */}

                    <View style={styles.switch_container}>
                      {/*Khung Switch phí bảo hiểm*/}
                      <Text>Phí bảo hiểm</Text>
                      <Switch
                        onValueChange={(value) => {
                          setFieldValue("switchPhiBaoHiem", value);
                          setInputPhiBaoHiem(value);
                        }}
                        value={values.switchPhiBaoHiem}
                      />
                    </View>
                  </View>
                  {errors.giaTriSanPham && touched.giaTriSanPham ? (
                    <Text style={styles.text_error}>
                      {errors.giaTriSanPham}
                    </Text>
                  ) : null}

                  <View
                    style={{
                      flex: 1,
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <View
                      style={[
                        styles.input_container,
                        styles.important_input,
                        { width: "48%" },
                      ]}
                    >
                      {/*Khung input HÀNG HÓA*/}
                      {/* <MaterialCommunityIcons name="truck-outline" size={24} color="black" style={styles.icon} /> */}
                      {/* <TextInput
                        placeholder='HÀNG HÓA'
                        autoCapitalize='none'
                        style={styles.input}
                        maxLength={40}
                        onChangeText={handleChange('hangHoa')}
                        value={values.hangHoa} /> */}

                      {/* hàng hóa DCTUONG */}
                      <SelectModal
                        isShow={isShow}
                        setisShow={setisShow}
                        value={value}
                        setValue={setValue}
                        items={items}
                      />
                    </View>
                    {/* END DCTUONG */}

                    {/* //EXPRESS */}

                    <View
                      style={[
                        styles.input_container,
                        styles.important_input,
                        { width: "48%" },
                      ]}
                    >
                      {/*Khung input EXPRESS*/}
                      {/* <MaterialCommunityIcons name="truck-outline" size={24} color="black" style={styles.icon} />
                      <TextInput
                        placeholder='EXPRESS'
                        autoCapitalize='none'
                        style={styles.input}
                        maxLength={40}
                        onChangeText={handleChange('express')}
                        value={values.express} /> */}
                      <View style={styles.wrapIconText}>
                        <Modal
                          animationType="slide"
                          transparent={true}
                          visible={isExpress}
                          onRequestClose={() => {
                            setisExpress(!isExpress);
                          }}
                        >
                          <TouchableWithoutFeedback
                            onPress={() => setisExpress(false)}
                          >
                            <View style={styles.centeredView}>
                              <View style={styles.modalView}>
                                <View style={styles.titleModal}>
                                  <Text
                                    style={[
                                      styles.modalText,
                                      {
                                        justifyContent: "center",
                                        width: "100%",
                                      },
                                    ]}
                                  >
                                    Dịch vụ
                                  </Text>
                                </View>
                                <View>
                                  <RadioForm>
                                    {services.map((obj, i) => (
                                      <TouchableOpacity
                                        onPress={() => {
                                          setValueOfExpress(i);
                                        }}
                                      >
                                        <RadioButton key={i}>
                                          <RadioButtonInput
                                            obj={obj}
                                            index={i}
                                            isSelected={valueOfExpress === i}
                                            onPress={(value) => {
                                              setValueOfExpress(value);
                                            }}
                                            borderWidth={1}
                                            buttonInnerColor={"#e74c3c"}
                                            buttonOuterColor={
                                              valueOfExpress === i
                                                ? "#2196f3"
                                                : "#000"
                                            }
                                            buttonSize={20}
                                            buttonOuterSize={30}
                                            buttonStyle={{}}
                                            buttonWrapStyle={{
                                              paddingLeft: 10,
                                              paddingTop: 5,
                                            }}
                                          />
                                          <View
                                            style={{
                                              justifyContent: "center",
                                              paddingLeft: 10,
                                            }}
                                          >
                                            <RadioButtonLabel
                                              obj={obj}
                                              index={i}
                                              labelHorizontal={true}
                                              onPress={(value) => {
                                                setValueOfExpress(value);
                                              }}
                                              labelStyle={{
                                                fontSize: 20,
                                                color: "black",
                                                width: 180,
                                                paddingVertical: 10,
                                                paddingLeft: 0,
                                              }}
                                              labelWrapStyle={{}}
                                            />
                                            <Text style={{ color: "#91C8E4" }}>
                                              (
                                              <Text style={{ color: "red" }}>
                                                *
                                              </Text>
                                              ){services[i].service}
                                            </Text>
                                          </View>
                                          <View>
                                            <Text style={{ color: "#FD8D14" }}>
                                              {services[i].money} VND
                                            </Text>
                                          </View>
                                        </RadioButton>
                                      </TouchableOpacity>
                                    ))}
                                  </RadioForm>
                                </View>
                              </View>
                            </View>
                          </TouchableWithoutFeedback>
                        </Modal>
                        <Pressable onPress={() => setisExpress(true)}>
                          <View style={{ flexDirection: "row" }}>
                            <MaterialCommunityIcons
                              name="truck-outline"
                              size={24}
                              color="black"
                              style={styles.icon}
                            />
                            <Text style={{ paddingTop: 2 }}>
                              {services[valueOfExpress].label}
                            </Text>
                          </View>
                        </Pressable>
                      </View>
                      {/* // */}
                    </View>
                  </View>
                  <View
                    style={{
                      flex: 1,
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <View
                      style={[
                        styles.input_container,
                        styles.important_input,
                        { width: "48%" },
                        errors.trongLuong && touched.trongLuong
                          ? styles.input_error
                          : null,
                      ]}
                    >
                      {/*Khung input trọng lượng*/}
                      <MaterialCommunityIcons
                        name="weight"
                        size={24}
                        color="black"
                        style={styles.icon}
                      />
                      <TextInput
                        name="trongLuong"
                        placeholder="Trọng lượng"
                        style={styles.input}
                        keyboardType="numeric"
                        maxLength={10}
                        onChangeText={(value) =>
                          setFieldValue(
                            "trongLuong",
                            value.replace(/[^0-9.]/g, "")
                          )
                        }
                        value={values.trongLuong}
                      />
                    </View>

                    <View
                      style={[
                        styles.input_container,
                        { width: "48%" },
                        errors.soKien && touched.soKien
                          ? styles.input_error
                          : null,
                      ]}
                    >
                      {/*Khung input số kiện*/}
                      <MaterialCommunityIcons
                        name="inbox-multiple"
                        size={24}
                        color="black"
                        style={styles.icon}
                      />
                      <TextInput
                        keyboardType="numeric"
                        style={[styles.input, { width: "50%" }]}
                        maxLength={5}
                        onChangeText={(value) =>
                          setFieldValue("soKien", value.replace(/[^0-9]/g, ""))
                        }
                        value={values.soKien}
                      />
                      <Text style={{ color: "gray" }}>Số kiện</Text>
                    </View>
                  </View>
                  <View
                    style={{
                      flex: 1,
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <View style={{ width: "48%" }}>
                      {errors.trongLuong && touched.trongLuong ? (
                        <Text style={styles.text_error}>
                          {errors.trongLuong}
                        </Text>
                      ) : null}
                    </View>

                    <View style={{ width: "48%" }}>
                      {errors.soKien && touched.soKien ? (
                        <Text style={styles.text_error}>{errors.soKien}</Text>
                      ) : null}
                    </View>
                  </View>

                  <View
                    style={{
                      flex: 1,
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <View style={[styles.input_container, { width: "32%" }]}>
                      {/*Khung input chiều dài*/}
                      <TextInput
                        placeholder="Dài (Cm)"
                        keyboardType="numeric"
                        style={styles.input}
                        maxLength={5}
                        onChangeText={(value) => {
                          setChieuDai(value);
                          setFieldValue("chieuDai", value);
                          TinhTrongLuongQuyDoi(value, chieuRong, chieuCao);
                        }}
                        value={chieuDai}
                      />
                    </View>

                    <View style={[styles.input_container, { width: "32%" }]}>
                      {/*Khung input chiều rộng*/}
                      <TextInput
                        placeholder="Rộng (Cm)"
                        keyboardType="numeric"
                        style={styles.input}
                        maxLength={5}
                        onChangeText={(value) => {
                          setChieuRong(value);
                          setFieldValue("chieuRong", value);
                          TinhTrongLuongQuyDoi(chieuDai, value, chieuCao);
                        }}
                        value={chieuRong}
                      />
                    </View>

                    <View style={[styles.input_container, { width: "32%" }]}>
                      {/*Khung input chiều cao*/}
                      <TextInput
                        placeholder="Cao (Cm)"
                        keyboardType="numeric"
                        style={styles.input}
                        maxLength={5}
                        onChangeText={(value) => {
                          setChieuCao(value);
                          setFieldValue("chieuCao", value);
                          TinhTrongLuongQuyDoi(chieuDai, chieuRong, value);
                        }}
                        value={chieuCao}
                      />
                    </View>
                  </View>

                  <View style={[styles.input_container, styles.disabled_input]}>
                    {/*Khung input trọng lượng quy đổi(KG)*/}
                    <TextInput
                      editable={false}
                      placeholder="Trọng lượng quy đổi"
                      style={styles.input}
                      maxLength={10}
                      onChangeText={(value) => {
                        setTrongLuongQuyDoi(value);
                        setFieldValue("trongLuongQuyDoi", value);
                      }}
                      value={trongLuongQuyDoi}
                    />
                    <Text>(Kg)</Text>
                  </View>

                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <View
                      style={[
                        styles.switch_container,
                        {
                          flex: 0,
                          justifyContent: "flex-start",
                          marginRight: 5,
                        },
                      ]}
                    >
                      {/*Khung Switch VUN*/}
                      <Text>VUN</Text>
                      <Switch
                        onValueChange={(value) => {
                          setFieldValue("switchVUN", value);
                          setInputVUN(value);
                        }}
                        value={values.switchVUN}
                      />
                    </View>

                    <View
                      style={[
                        styles.input_container,
                        { flex: 1, marginHorizontal: 5 },
                        !inputVUN && styles.disabled_input,
                      ]}
                    >
                      {/*Khung input VUN số kiện*/}
                      <TextInput
                        editable={inputVUN}
                        placeholder="VUN số kiện"
                        keyboardType="numeric"
                        style={styles.input}
                        maxLength={3}
                        onChangeText={handleChange("vunSoKien")}
                        value={values.vunSoKien}
                      />
                    </View>

                    <View
                      style={[
                        styles.input_container,
                        { flex: 1, marginLeft: 5 },
                        !inputVUN && styles.disabled_input,
                      ]}
                    >
                      {/*Khung input VUN chi phí*/}
                      <TextInput
                        editable={inputVUN}
                        placeholder="VUN chi phí"
                        keyboardType="numeric"
                        style={styles.input}
                        maxLength={3}
                        onChangeText={handleChange("vunChiPhi")}
                        value={values.vunChiPhi}
                      />
                    </View>
                  </View>
                </View>
              </View>

              <View style={styles.big_container}>
                <View style={styles.small_container}>
                  <View style={styles.text_container}>
                    {/*Khung text*/}
                    <Ionicons
                      name="cash-outline"
                      size={24}
                      color="black"
                      style={styles.icon}
                    />
                    <Text>Các phí khác</Text>
                  </View>
                  <View
                    style={{
                      borderBottomColor: "#e0e0e0",
                      borderBottomWidth: 1,
                      marginTop: 10,
                    }}
                  />
                  {/*Đường kẻ ngang*/}

                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    {/*Khung input COD*/}
                    <View style={{ flex: 1 }}>
                      <View
                        style={[styles.input_container, { borderWidth: 0 }]}
                      >
                        <Text style={{ marginRight: 5 }}>COD</Text>
                        <TextInput
                          editable={false}
                          style={[
                            styles.input_container,
                            styles.input,
                            styles.disabled_input,
                            { marginTop: 0 },
                          ]}
                          value={values.cod}
                        />
                      </View>
                    </View>
                    <View style={{ flex: 1 }}>
                      {/*Khung input phí COD*/}
                      <View
                        style={[styles.input_container, { borderWidth: 0 }]}
                      >
                        <Text style={{ marginRight: 5 }}>Phí COD</Text>
                        <TextInput
                          editable={false}
                          style={[
                            styles.input_container,
                            styles.input,
                            styles.disabled_input,
                            { marginTop: 0 },
                          ]}
                          value={values.phiCOD}
                        />
                      </View>
                    </View>
                  </View>

                  <View
                    style={[
                      styles.input_container,
                      { borderWidth: 0, marginTop: 0 },
                    ]}
                  >
                    {/*Khung input tiền phải thu*/}
                    <Text style={{ marginRight: 5 }}>Tiền phải thu</Text>
                    <TextInput
                      editable={false}
                      style={[
                        styles.input_container,
                        styles.input,
                        styles.disabled_input,
                        styles.important_input,
                        { marginTop: 0 },
                      ]}
                      value={values.tienPhaiThu}
                    />
                  </View>

                  <View
                    style={[
                      styles.input_container,
                      { borderWidth: 0, marginTop: 0 },
                    ]}
                  >
                    {/*Khung input phí bảo hiểm*/}
                    <Text style={{ marginRight: 5 }}>Phí bảo hiểm</Text>
                    <TextInput
                      editable={false}
                      style={[
                        styles.input_container,
                        styles.input,
                        styles.disabled_input,
                        { marginTop: 0 },
                      ]}
                      value={values.phiBaoHiem}
                    />
                  </View>

                  <View
                    style={[
                      styles.input_container,
                      { borderWidth: 0, marginTop: 0 },
                    ]}
                  >
                    {/*Khung input số tiền giảm giá*/}
                    <Text style={{ marginRight: 5 }}>Số tiền giảm giá</Text>
                    <TextInput
                      editable={false}
                      style={[
                        styles.input_container,
                        styles.input,
                        styles.disabled_input,
                        { marginTop: 0 },
                      ]}
                      value={values.soTienGiamGia}
                    />
                  </View>

                  <View
                    style={[
                      styles.input_container,
                      { borderWidth: 0, marginTop: 0 },
                    ]}
                  >
                    {/*Khung input các phí khác*/}
                    <Text style={{ marginRight: 5 }}>Các phí khác</Text>
                    <TextInput
                      keyboardType="numeric"
                      style={[
                        styles.input_container,
                        styles.input,
                        { marginTop: 0 },
                      ]}
                      onChangeText={(value) =>
                        setFieldValue("cacPhiKhac", unformatCurrency(value))
                      }
                      value={formatCurrency(values.cacPhiKhac)}
                    />
                  </View>

                  <View style={styles.input_container}>
                    {/*Khung input ghi chú*/}
                    <MaterialCommunityIcons
                      name="note-edit-outline"
                      size={24}
                      color="black"
                      style={styles.icon}
                    />
                    <TextInput
                      placeholder="Ghi chú"
                      autoCapitalize="none"
                      style={styles.input}
                      maxLength={40}
                      onChangeText={handleChange("ghiChu")}
                      value={values.ghiChu}
                    />
                  </View>

                  <View
                    style={[
                      styles.text_container,
                      { marginTop: 10, justifyContent: "space-between" },
                    ]}
                  >
                    <Text>Tổng vận phí:</Text>
                    <View
                      style={{ flexDirection: "row", alignItems: "flex-end" }}
                    >
                      <Text style={{ fontSize: 20, fontWeight: "bold" }}>
                        9,000,000
                      </Text>
                      <Text
                        style={{ color: "orange", marginLeft: 5, fontSize: 20 }}
                      >
                        ₫
                      </Text>
                    </View>
                  </View>
                </View>
              </View>

              <View style={styles.big_container}>
                <TouchableOpacity
                  style={[styles.submit_button, { padding: 9, width: "60%" }]}
                  onPress={handleImageCapture}
                >
                  {/*Nút Submit*/}
                  <AntDesign
                    name="camerao"
                    size={24}
                    color="white"
                    style={styles.icon}
                  />
                  <Text
                    style={{
                      color: "white",
                      fontWeight: "bold",
                      fontSize: 15,
                    }}
                  >
                    Chụp hình
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.submit_button}
                  onPress={handleSubmit}
                >
                  {/*Nút Submit*/}
                  <Text
                    style={{
                      color: "white",
                      fontWeight: "bold",
                      fontSize: 15,
                    }}
                  >
                    In vận đơn
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </Formik>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f7f7f7",
  },
  icon: {
    marginRight: 5,
  },
  big_container: {
    width: "100%",
    backgroundColor: "#fff",
    alignItems: "center",
    marginTop: 10,
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
    borderColor: "crimson",
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
});
