import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import Ionicon from 'react-native-vector-icons/Ionicons';

import * as paymentAction from '../store/actions/paymentMethod';
import { Images, Colors } from '../CommonConfig';

const CreditCardDisplay = props => {

    const dispatch = useDispatch()

    const activeCard = useSelector(state => state.Payment.activeMethodID)

    const logoSelector = (brand) => {
        if(brand === 'Visa') {
            return Images.VISA
        }
    }

    return (
        <View style={styles.cardItemContainer}>
            <Image source={ logoSelector(props.brand)} style={{height:80, width:80}}/>
            <View style={styles.detailContainer}>
                <View style={{flexDirection:'row'}}>
                    <Text style={styles.cardNumber}>**** **** **** {props.last4}</Text>
                    <TouchableOpacity><Ionicon name="create-outline" size={20} color={ Colors.CREATE_BLUE } /></TouchableOpacity>
                </View>
                <Text style={styles.expiry}>Expires {props.exp_month} / {props.exp_year}</Text>
            </View>
            {props.editable ? <TouchableOpacity onPress={ () => { dispatch(paymentAction.activatePayment(props.id)) } }>
                <Ionicon name="checkmark-circle" size={45} color={ props.id === activeCard  ? Colors.GREEN : Colors.GREY} />
            </TouchableOpacity> : null}
        </View>
    )
}

export default CreditCardDisplay

const styles = StyleSheet.create({
    cardItemContainer:{
        flex:1,
        padding:10,
        height:100,
        elevation:1,
        borderRadius:1, 
        marginVertical:5,
        flexDirection:'row',
        alignItems:'center'
    },
    detailContainer:{
        flex:3,
        marginLeft:20,
        justifyContent:'space-evenly',
        height:'100%'
    },
    cardNumber:{
        fontSize:18,
        fontWeight:'bold',
        marginRight:10
    },
    expiry:{
        fontWeight:'600',
        fontSize:16,
        color: Colors.GREY
    }
})