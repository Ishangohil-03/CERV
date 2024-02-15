import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Ionicon from 'react-native-vector-icons/Ionicons';

import{ Colors }from '../CommonConfig';

const NotificationItem = props => {

    const iconBg = props.iconBg;

    return (
        <View style={styles.container}>
            
            <View style={{flex:0.7,justifyContent:'center', alignItems:'center'}}>
                <View style={{...styles.iconContainer, backgroundColor: iconBg}}>
                    <Ionicon name={props.icon} size={35} color={Colors.WHITE}/>
                </View>
            </View>

            <View style={{flex:2.5,justifyContent:'center',marginHorizontal:10}}>
                <Text style={styles.notifText}>{props.notifText}</Text>
            </View>

            <View style={{flex:0.6,marginRight:10}}>
                <Text style={styles.time}>{props.notifTime}</Text>
            </View>


        </View>
    )
};

const styles = StyleSheet.create({
    container:{
        height:100, 
        padding:15, 
        borderRadius:5, 
        flexDirection:'row', 
        marginHorizontal:15,
        backgroundColor:'#fff',
        marginBottom:10
        // shadowColor: "#ccc",
        // shadowOffset: {
        //     width: 0,
        //     height: 0.1,
        // },
        // shadowOpacity: 0.01,
        // shadowRadius: 3.84,
        // elevation: 5,
    },
    iconContainer:{
        borderRadius:30, 
        height:60,
        width:60, 
        alignItems:'center', 
        justifyContent:'center',
        marginRight:10
    },
    time:{
        color: Colors.GREY, 
        fontSize:12
    },
    notifText:{
        fontSize:16, 
        fontWeight:'700'
    }
});

export default NotificationItem;