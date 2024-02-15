import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import Ionicon from 'react-native-vector-icons/Ionicons';
import{ Colors }from '../CommonConfig';

const ProfileOption = props => {
    return (
        <View style={styles.screen} >
            <TouchableOpacity onPress={props.onPress}>
                <View style={styles.optionCell} >
                    <View style={styles.leftIcon}>
                        <Ionicon name={props.leftIcon} size={25} color={Colors.ORANGE}/>
                    </View>
                    <View style={{width:'70%'}}>
                        <Text style={styles.title}>{props.title}</Text>
                    </View>
                    <View style={styles.rightIcon}>
                        <Ionicon name={props.rightIcon} size={25} color='#B5ADAD'/>
                    </View>
                </View>
            </TouchableOpacity>
        </View>

    )
};

const styles = StyleSheet.create({
    screen:{
        width:'100%',
    },
    optionCell:{
        flexDirection:'row', 
        backgroundColor:Colors.WHITE,
        height:65,
        alignItems:'center',
        borderBottomColor:'#D4CCCC', 
        borderBottomWidth:1
    },
    leftIcon:{
        marginHorizontal:20
    },
    title:{
        fontSize:18, 
        fontWeight:'bold',
        color:'#282626'
    },
    rightIcon:{
        marginRight:10
    }
});

export default ProfileOption;