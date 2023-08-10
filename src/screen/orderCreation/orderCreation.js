import * as ImagePicker from "expo-image-picker";
import * as Permissions from "expo-permissions";
import React, { useEffect, useState } from "react";
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
} from "react-native";
import {
  AntDesign,
  Feather,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";

import {styles} from './stylesOrderCreation'
import CustomModal from "../../components/CustomModal";
import SelectModal from "../../components/selectModal/SelectModal";

export default function OrderCreation() {
  const [inputVUN, setInputVUN] = useState(false); // Dùng để Bật/Tắt(True/False) input VUT Số kiện và Chi phí
  const [inputPhiBaoHiem, setInputPhiBaoHiem] = useState(false); // Dùng để Bật/Tắt(True/False) input Phí bảo hiểm

  const [chieuDai, setChieuDai] = useState("");
  const [chieuRong, setChieuRong] = useState("");
  const [chieuCao, setChieuCao] = useState("");
  const [soluong, setSoluong] = useState("1");
  const [trongLuongQuyDoi, setTrongLuongQuyDoi] = useState("");

  const [modalVisible, setModalVisible] = useState(false); // Dùng để Bật/Tắt Modal thông báo
  const [modalMessage, setModalMessage] = useState(""); // Dùng để hiển thị nội dung Modal thông báo

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
  const handleImageCapture = async () => {
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

  // Hàm tính trọng lương quy đổi tự động
  useEffect(() => {
    TinhTrongLuongQuyDoi();
  }, [chieuDai, chieuRong, chieuCao, soluong]);

  const TinhTrongLuongQuyDoi = () => {
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
            parseFloat(soluong) *
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
    phuongThucThanhToan: 0,
    sdtNguoiNhan: "",
    hoTenNguoiNhan: "",
    diaChiNguoiNhan: "",
    buuCucDen: "",
    noiDungHangHoa: "",
    giaTriSanPham: "",
    switchGiao1Phan: false,
    switchPhiBaoHiem: false,
    hangHoa: 0,
    express: 0,
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

  const items = [
    { label: "HÀNG HÓA", value: 0 },
    { label: "FRESH", value: 1 },
    { label: "THƯ TỪ", value: 2 },
  ];

  const paymentMethods = [
    { label: "Người nhận thanh toán", value: 0 },
    { label: "Người gửi thanh toán", value: 1 },
  ];
  //EXPRESS
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
                      maxLength={11}
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
                    <SelectModal
                      titleModal="Phương thức thanh toán"
                      items={paymentMethods}
                      selectOption={(param) =>
                        setFieldValue("phuongThucThanhToan", param)
                      }
                      value={values.phuongThucThanhToan}
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
                      <Text
                        style={{ width: "60%", justifyContent: "flex-start" }}
                      >
                        Giao 1 phần
                      </Text>
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
                      <Text
                        style={{ width: "60%", justifyContent: "flex-start" }}
                      >
                        Phí bảo hiểm
                      </Text>
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
                      {/* hàng hóa DCTUONG */}
                      <SelectModal
                        titleModal="Loại hàng hóa"
                        items={items}
                        nameIcon="format-list-numbered"
                        selectOption={(param) => {
                          setFieldValue("hangHoa", param);
                        }}
                        value={values.hangHoa}
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
                      <SelectModal
                        items={services}
                        titleModal="Dịch vụ"
                        nameIcon="truck-outline"
                        selectOption={(param) => {
                          setFieldValue("express", param);
                        }}
                        value={values.express}
                      />
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
                        onChangeText={(value) => {
                          setFieldValue("soKien", value.replace(/[^0-9]/g, ""));
                          setSoluong(value);
                        }}
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
                        { flex: 1, marginHorizontal: 5, width: "40%" },
                        !inputVUN && styles.disabled_input,
                      ]}
                    >
                      {/*Khung input VUN số kiện*/}
                      <TextInput
                        editable={inputVUN}
                        placeholder="VUN số kiện"
                        keyboardType="numeric"
                        // style={styles.input}
                        style={[styles.input, { overflow: "hidden" }]}
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
                        style={[styles.input, { overflow: "hidden" }]}
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
                        {services[values.express].money}
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
                {image && (
                  <View style={styles.imageWrapper}>
                    <TouchableOpacity
                      onPress={() => {
                        setImage(null);
                      }}
                    >
                      <MaterialCommunityIcons
                        name="close-circle"
                        size={28}
                        color="black"
                        style={styles.btnDelete}
                      />
                    </TouchableOpacity>
                    <Image source={{ uri: image }} style={styles.image} />
                  </View>
                )}
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



