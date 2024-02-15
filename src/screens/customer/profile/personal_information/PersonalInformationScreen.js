import React, { useEffect, useState } from "react";
import { View, StyleSheet, Image, Text, TouchableOpacity } from "react-native";
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';

import{ Colors }from '../../../../CommonConfig';

const PersonalInformationScreen = props => {

    const [user, setUser] = useState({})

    useEffect( () => {
        getProfile()
    },[])
    
    const getProfile = async() => {
        setUser(JSON.parse(await AsyncStorage.getItem("userInfo")))   
    }
   
    return (
        <View style={styles.screen}>
            
            {/* PROFILE PICTURE */}
            <View style={styles.ppContainer}>
                <Image source={{uri: user.image }} style={styles.ppImage}/>
            </View>

            {/* DETAILS */}

            {/* Username */}
            <View style={styles.detailItem}>
                <Text style={styles.text_footer}>Username</Text>
                <View style={styles.action} >
                    <FontAwesome name="user" color={Colors.ORANGE} size={20}/>
                    <View style={styles.input}>
                        <Text style={styles.value}>{user.name}</Text>
                    </View>
                </View>
            </View>

            {/* Email */}
            <View style={styles.detailItem}>
                <Text style={styles.text_footer}>Email</Text>
                <View style={styles.action} >
                    <FontAwesome name="envelope" color={Colors.ORANGE} size={20}/>
                    <View style={styles.input}>
                        <Text style={styles.value}>{user.email}</Text>
                    </View>
                </View>
            </View>

            {/* Phone Number */}
            <View style={styles.detailItem}>
                <Text style={styles.text_footer}>Phone Number</Text>
                <View style={styles.action} >
                    <FontAwesome name="phone" color={Colors.ORANGE} size={20}/>
                    <View style={styles.input}>
                        <Text style={styles.value}>{user.phone_number}</Text>
                    </View>
                </View>
            </View>

            {/* Postcode */}
            <View style={styles.detailItem}>
                <Text style={styles.text_footer}>Home Postcode</Text>
                <View style={styles.action} >
                    <FontAwesome name="home" color={Colors.ORANGE} size={20}/>
                    <View style={styles.input}>
                        <Text style={styles.value}>395006</Text>
                    </View>
                </View>
            </View>

            {/* Edit Info Button */}
            <View style={{width:'100%', justifyContent:'center'}}>
                <TouchableOpacity onPress={() => {
                    props.navigation.navigate('EditDetails', {user})
                }}>
                    <View style={styles.button}>
                        <Text style={styles.editText}>Edit Information</Text>
                    </View>
                </TouchableOpacity>
            </View>
        </View>
    )
};

const styles = StyleSheet.create({
    screen:{
        flex:1,
        alignItems:'center',
        backgroundColor:Colors.WHITE
    },
    detailItem:{
        width:'85%',
        marginTop: 15
    },
    ppContainer:{
        borderRadius:90,
        overflow:'hidden',
        marginVertical: 25
    },
    ppImage:{
        height:180,
        width:180
    },
    text_footer:{
        color:Colors.GREY,
        fontSize:15,
        fontWeight:'bold',
        marginVertical:5
    },
    input:{
        marginLeft: 15
    },
    action:{
        flexDirection:'row',
        marginTop:10,
        borderBottomWidth:0.5,
        borderBottomColor:Colors.GREY,
        paddingBottom: 10
    },
    value:{
        fontSize:17,
        fontWeight:'700'
    },
    button:{
        backgroundColor:Colors.ORANGE,
        width:'90%',
        height:50,
        justifyContent:'center',
        borderRadius:10,
        marginTop: 50,
        marginHorizontal:'5%'
    },
    editText:{
        textAlign:'center',
        color:Colors.WHITE,
        fontSize:20,
        fontWeight:'700'
    }
});

export default PersonalInformationScreen;