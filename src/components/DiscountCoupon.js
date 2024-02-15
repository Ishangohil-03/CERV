import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';

import {Colors} from '../CommonConfig';

const DiscountCoupon = props => {

    const length = props.offer.length;

    return (
        <TouchableOpacity style={styles.screen} activeOpacity={0.75} onPress={props.onPress}>
            <View style={{...styles.cutOut, left:-20}} ></View>
            <View style={styles.body}>
                <Text style={{...styles.offer, fontSize: length > 15 ? 35 : 50}}>{props.offer}</Text>
                <View style={styles.codeContainer}>
                    <Text style={styles.code}>{props.code}</Text>
                </View>
            </View>
            <View style={{...styles.cutOut, right:-20}} ></View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    screen:{
        height:200,
        backgroundColor: Colors.ORANGE,
        borderRadius: 5,
        flexDirection:'row',
        paddingVertical:10,
        alignItems:'center',
        marginVertical:5
    },
    cutOut:{
        height:50,
        borderRadius:25,
        width:50,
        backgroundColor: Colors.WHITE,
        flex:1,
        position:'absolute'
    },
    body:{
        flex:5,
        alignItems:'center'
    },
    offer:{
        color: Colors.WHITE,
        fontWeight:'bold',
        textAlign:'center'
    },
    codeContainer:{
        borderStyle:'dashed', 
        borderRadius:1, 
        borderWidth:2, 
        borderColor: Colors.WHITE, 
        padding:10, 
        alignItems:'center', 
        justifyContent:'center', 
        marginVertical:15
    },
    code:{
        color: Colors.WHITE,
        fontWeight:'bold',
        fontSize:25
    }
});

export default DiscountCoupon;