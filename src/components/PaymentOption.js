import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import Ionicon from 'react-native-vector-icons/Ionicons';
import { useDispatch, useSelector } from "react-redux";

import * as paymentActions from '../store/actions/paymentMethod';
import { Colors } from "../CommonConfig";

const PaymentOption = (props) => {

    const dispatch = useDispatch();

    const paymentType = props.paymentType;

    let isActive = false;
    const pid = props.id
    const activeMethodID = useSelector( state => state.Payment.activeMethodID )
    isActive = activeMethodID === pid ? true : false;

    const selectable = props.selectable ? true : false ;
    const editable = props.editable ? true : false ;
    
    return (
        <View style={styles.cardItemContainer}>
            <View style={{flex: 3, flexDirection:'row'}}>
                <Image source={ props.logo } style={styles.logo}/>
                <View style={styles.cardDetailContainer}>
                    <View style={{flexDirection:'row', alignItems:'center'}}>
                        <Text style={styles.cardMain}>{props.mainText}</Text>
                        {editable ? <TouchableOpacity onPress={props.onEditPress}><Ionicon name="create-outline" size={20} color={Colors.CREATE_BLUE}/></TouchableOpacity>: null }
                    </View>
                    <Text style={styles.cardText}> {paymentType === 'card' ? "Expires ": null}{props.subText}</Text>
                </View>
            </View>
            {selectable ? <TouchableOpacity onPress={ () => { dispatch(paymentActions.activatePayment(pid)) } } style={styles.iconContainer}><Ionicon name="checkmark-circle" color={ isActive ? Colors.GREEN : Colors.GREY} size={45}/></TouchableOpacity> : null}
        </View>
    )
}

export default PaymentOption

const styles = StyleSheet.create({
    iconContainer:{
        flex:0.5, 
        alignItems:'center', 
        justifyContent:'center'
    },
    logo:{
        flex:0.9,
        maxHeight: 80,
        maxWidth: 80
    },
    cardTextContainer:{
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center',
        marginVertical:10,
    },
    addCard:{
        fontWeight:'bold',
        color: Colors.ORANGE,
        fontSize: 15
    },
    cardItemContainer:{
        flexDirection:'row',
        paddingVertical:10,
        paddingHorizontal:15,
        marginVertical:5,
        alignItems:'center',
        justifyContent:'space-between',
        borderWidth:0.5,
        borderRadius:5,
        borderColor: Colors.GREY
    },
    cardDetailContainer:{
        flex:2,
        justifyContent:'space-evenly',
        alignItems:'flex-start',
        marginLeft:15
    },
    cardMain:{
        fontSize:18,
        fontWeight:'bold',
        marginRight:10
    },
    cardText:{
        color: Colors.GREY,
        fontWeight:'bold'
    }
})