import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar, Image,TextInput, Alert, ActivityIndicator } from 'react-native';
import Ionicon from 'react-native-vector-icons/Ionicons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useDispatch } from 'react-redux';

import CountryPicker from 'react-native-country-codes-picker';

import * as registerActions from '../../store/actions/register';
import{ Colors, Images }from '../../CommonConfig';
import { postPreLogin } from '../../helpers/ApiHelpers';


const NumberVerificationScreen = props => {

    const params = props.route.params.data
    // console.log(data)
    const [loading, setLoading] = useState(false)
    const [show, setShow] = useState(false);
    const [countryCode, setCountryCode] = useState('+91');
    const [phoneNumber, setPhoneNumber ] = useState('');

    const pressHandler = async(countryCode, phoneNumber) => {
        setLoading(true)
        const OTPData = {
            country_code: countryCode,
            phone_number: phoneNumber,
            channel: "sms"
        }
        const response = await postPreLogin('/users/generateOTP', OTPData);
        console.log(response);
        let errorMsg = 'Something went wrong!';
        if (response.success) {
            props.navigation.navigate('VerifyScreen',{countryCode: countryCode, phoneNumber: phoneNumber, params})
            setLoading(false)
        } else {
            Alert.alert("Error",errorMsg,[{text:"Okay"}])
            setLoading(false)
        }
        // props.navigation.navigate('VerifyScreen',{countryCode: countryCode, phoneNumber: phoneNumber, params})
    }

    return (
        <View style={styles.screen}>
            <KeyboardAwareScrollView>
                <StatusBar backgroundColor={Colors.ORANGE} barStyle='light-content' />

                {/* HEADER */}
                <View style={styles.header}>
                    <View style={{flex:0.8}}>
                        <TouchableOpacity onPress={() => props.navigation.goBack()} style={{marginVertical:10, marginLeft:10}}>
                                <Ionicon name="arrow-back-outline" size={35} color={Colors.WHITE}/>
                        </TouchableOpacity>
                        <Text style={styles.headerLabel}>Phone Number</Text>
                        <Text style={styles.headerText}>Verify your phone number for extra security</Text>
                    </View>
                    <Image source={ Images.AUTH_HEADER1 } style={styles.image}/>
                </View>


                {/* BODY */}
                <View style={{backgroundColor: Colors.ORANGE}}>
                    <View style={styles.body}>

                        <Text style={styles.footerText}>Please enter the email address below, you will receive a link to create a new password via email.</Text>                        
                        <Text style={styles.text_footer} >Phone Number</Text>
                        <View style={styles.action} >
                            <Ionicon name="call" color={Colors.ORANGE} size={20} style={{flex:0.5}}/>
                            <Text style={{flex:0.5, fontWeight:'bold'}}>{countryCode}</Text>
                            <TouchableOpacity onPress={() => setShow(true)} style={{flex: 0.5}}><Ionicon name="caret-down-outline" size={20} color={ Colors.BLACK } /></TouchableOpacity>
                            <View style={{width:0, borderColor: Colors.LIGHTER_GREY, borderWidth:0.7, height:30, marginRight:10}} ></View>
                            <TextInput 
                                style={{flex:3.5}}
                                keyboardType= "phone-pad"
                                maxLength={10}
                                onChangeText = { (val) => {setPhoneNumber(val)} }
                            />
                        </View>

                        <TouchableOpacity style={styles.sendCode} disabled={ phoneNumber.length === 10 ? false : true || loading } onPress={() => pressHandler(countryCode, phoneNumber)}>
                            { loading ?
                                <ActivityIndicator size={20} color={Colors.WHITE}/>
                                :
                                <Text style={styles.sendCodeText}>Send Code</Text>
                            }
                        </TouchableOpacity>
                    </View>
                </View>
            </KeyboardAwareScrollView>
            <CountryPicker
                show={show}
                style={{
                    modal:{
                        height:500,
                        backgroundColor:Colors.LIGHTER_GREY,
                    },
                    countryButtonStyles:{
                        height:80
                    },
                    flag: {
                        fontSize:30
                    },
                    dialCode: {
                        fontSize:20,
                        fontWeight:'bold'
                    },
                    countryName: {
                        fontSize:20
                    }
                }}
                pickerButtonOnPress={(item) => {
                    setCountryCode(item.dial_code);
                    setShow(false);
                }}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    screen:{
        flex:1,
        backgroundColor:Colors.WHITE
    },
    sendCode:{
        backgroundColor: Colors.ORANGE, 
        padding:15, 
        marginTop:50, 
        borderRadius:5,
        alignItems:'center', 
        justifyContent:'center'
    },
    sendCodeText:{
        fontWeight:'bold', 
        color: Colors.WHITE, 
        fontSize:20
    },
    header:{
        flex:1,
        backgroundColor: Colors.ORANGE,
        flexDirection:'row',
        justifyContent:'space-between'
    },
    headerLabel:{
        color:Colors.WHITE,
        fontWeight:'bold',
        fontSize:26,
        margin:10
    },
    headerText:{
        color:Colors.WHITE,
        fontWeight:'600',
        fontSize:15,
        width:'100%',
        marginLeft:10
    },
    body:{
        flex:3,
        backgroundColor:Colors.WHITE,
        borderTopLeftRadius:30,
        borderTopRightRadius:30,
        paddingHorizontal:20,
        paddingVertical:30
    },
    image:{
        marginVertical:10,
        marginRight:5,
        height: 180,
        width:180
    },
    footerText:{
        fontSize:18,
        marginTop:5,
        marginBottom:5,
        color: Colors.GREY
    },
    action:{
        flexDirection:'row',
        marginTop:15,
        borderBottomWidth:1,
        borderBottomColor:Colors.LIGHTER_GREY,
        paddingBottom: 10,
        alignItems:'center',
    },
    text_footer:{
        color:'#05375a',
        fontSize:18,
        fontWeight:'bold',
        marginTop:50
    },
});

export default NumberVerificationScreen;