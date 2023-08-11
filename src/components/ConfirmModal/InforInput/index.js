import React, { useState } from 'react';
import { styles } from "../styleComfirlmModal.js"
import { Text, View } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
const InforInput = (prop) => {
    return (
        <View style={{ width: '100%' }}>
            <View style={styles.wrapInput}>
                <Text style={styles.lableInput}>
                    {prop.lable}
                </Text>
                <View style={styles.wrapTextInput}>
                    <TextInput
                        placeholder={prop.placeholderInput}
                        style={styles.textInput}
                    />
                </View>
            </View>
        </View>
    );
}



export default InforInput;
