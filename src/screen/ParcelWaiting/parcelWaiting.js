import { useState } from "react";
import { styles } from "./stylesParcelWaiting.js";
import { Text } from "react-native";
import { TouchableOpacity } from "react-native";
import ConfirmModal from "../../components/ConfirmModal/index.js";

const ParcelWaiting = () => {
    const [showComfirmModal, setShowComfirmModal] = useState(false)
    const handlerShowComfirmModal = (show) => {
        setShowComfirmModal(show)
    }
    return (
        <TouchableOpacity
            onPress={() => setShowComfirmModal(true)}
        >
            <ConfirmModal
                show={showComfirmModal}
                handlerShowComfirmModal={handlerShowComfirmModal} 
                code={'01644484'}
                />
            <Text style={styles.container}
            >Button</Text>
        </TouchableOpacity>
    );
}

export default ParcelWaiting;