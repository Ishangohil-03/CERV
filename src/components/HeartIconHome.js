import React, { useState } from "react";
import { View, TouchableOpacity } from "react-native";
import Ionicon from 'react-native-vector-icons/Ionicons';

import { Colors } from "../CommonConfig";

const HeartIconHome = props => {

    const [isFavourite, setIsFavourite] = useState(props.initialState);

    return (
        <View>
            <TouchableOpacity onPress={() => setIsFavourite(!isFavourite)} >
                {isFavourite ? <Ionicon name="heart" size={25} color={Colors.ERROR_RED} /> : <Ionicon name="heart-outline" size={25} color={Colors.GREY} />}
            </TouchableOpacity>
        </View>
    );
};

export default HeartIconHome;