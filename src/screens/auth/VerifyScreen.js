import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar, Image, Alert, ActivityIndicator } from 'react-native';
import Ionicon from 'react-native-vector-icons/Ionicons';
import OTPInputView from '@twotalltotems/react-native-otp-input';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-simple-toast';
import { CommonActions } from '@react-navigation/native';

import{ Colors, Images }from '../../CommonConfig';
import { postFormDataRequest, postPreLogin } from '../../helpers/ApiHelpers';
import { useSelector } from 'react-redux';

const VerifyScreen = ({navigation, route}) => {

    const [ loading, setLoading ] = useState(false)

    // Random Name generator
    const makeid = (length) => {
        var result           = '';
        var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for ( var i = 0; i < length; i++ ) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
       return result;
    }

    // const user = useSelector(state => state.Register)
    // const userFormData = new FormData();
    // userFormData.append("name",user.name)
    // userFormData.append("email",user.email)
    // userFormData.append("password", user.password)
    // userFormData.append("role", user.role)
    
    // userFormData.append("image", { uri: user.image.path, type: user.image.mime, name: makeid(10) })
    // console.log(userFormData)

    const countryCode = route.params.countryCode;
    const phoneNumber = route.params.phoneNumber;
    const data = route.params.params
    // console.log(data)

    const [ otpValue, setOTPValue ] = useState('');

    const pressHandler = async(otpValue) => {
        // navigation.navigate('StoreRegister')
        setLoading(true)
        const verifyOTP = {
            otpValue: otpValue,
            country_code: countryCode,
            phone_number: phoneNumber
        }
        const response = await postPreLogin('/users/verifyOTP', verifyOTP);
        const resData = response.data
        const errorMsg = 'Something went wrong!'
        if (response.success) {
            const user = new FormData();
            if(data.selectedImage){
                user.append('image',{ uri: data.selectedImage.path, type: data.selectedImage.mime, name: makeid(10) })
            }
            user.append('email', data.email)
            user.append('password', data.password)
            user.append('role', data.role)
            user.append("country_code", countryCode)
            user.append("phone_number", phoneNumber)
            user.append('name', data.username.trim())
            //image, email, password, role, phone & cc , username

            const res = await fetch('https://cerv-api.herokuapp.com/users/register',{
                method: 'POST',
                headers:{
                    "Content-Type" : "multipart/form-data"
                },
                body: user
            })

            const registerResponse = await res.json()
            // console.log(registerResponse)
            if( registerResponse.status === 1 ) {
                if(data.role === 0) {
                    navigation.navigate('StoreRegister', { catererId: registerResponse.user.id })
                }
                
                const loginData = {
                    email: data.email,
                    password: data.password,
                    role: data.role,
                    device_token: JSON.stringify(AsyncStorage.getItem('deviceToken'))
                }
                
                const response = await postPreLogin('/users/login', loginData)
                const resData = response.data
                if( response.success ) {
                    try {
                        await AsyncStorage.setItem('role',resData.user.role.toString())
                        await AsyncStorage.setItem('token', resData.token)
                        await AsyncStorage.setItem('refreshToken', resData.refreshToken)
                        await AsyncStorage.setItem('userInfo', JSON.stringify(resData.user))
                        await AsyncStorage.setItem('isLogin', "1")
                    } catch (error) {
                        console.log(error)
                    }
                    if(resData.user.role === 1) {
                        navigation.dispatch(
                            CommonActions.reset({
                                index:0,
                                routes: [{name: 'Home'}]
                            })
                        )
                        setLoading(false)
                    } 
                } else {
                    if (resData.error === 'User does not exist!') {
                        Toast.show(" User does not exist! ");
                        setLoading(false)
                    } else if (resData.error === 'Invalid Password!') {
                        Toast.show("Incorrect Password")
                        setLoading(false)
                    }
                }

            } else {
                console.log(registerResponse)
                setLoading(false)
            }
        } else {
            if( resData.error ==="Invalid OTP entered!"){
                errorMsg = "Invalid OTP entered!"
            }
            Alert.alert("Error",errorMsg,[{text:"Okay"}])
            setLoading(false)
        }
    }

    // if(loading) {
    //     return(
    //         <View style={styles.loader}>
    //            
    //         </View>
    //     )
    // }

    return (
        <View style={styles.screen}>
            <StatusBar backgroundColor={Colors.ORANGE} barStyle='light-content' />
            {/* HEADER */}
            <View style={styles.header}>
                <View style={{flex:0.9}}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={{marginVertical:10, marginLeft:10}}>
                            <Ionicon name="arrow-back-outline" size={35} color={Colors.WHITE}/>
                    </TouchableOpacity>
                    <Text style={styles.headerLabel} numberOfLines={1}>Verification Code</Text>
                    <Text style={styles.headerText}>We have sent an SMS to {countryCode}-{phoneNumber}. Please enter the code you receive below.</Text>
                </View>
                <Image source={ Images.AUTH_HEADER2 } style={styles.image}/>
            </View>

            {/* BODY */}
            <View style={{backgroundColor: Colors.ORANGE, flex:3}}>
                <View style={styles.body}>
                    <View style={{flex:1}}>
                        <View style={{flex:0.5}}>
                            <OTPInputView 
                                pinCount={4}
                                autoFocusOnLoad
                                codeInputHighlightStyle ={styles.OtpInputCell}
                                codeInputFieldStyle = {styles.OtpInputCellUnfocused}
                                placeholderCharacter="-"
                                onCodeFilled = {(code) => {setOTPValue(code)}}
                            />
                        </View>

                        {/* Resend Code */}
                        <View style={{flex:0.5, flexDirection:'row', justifyContent:'center'}}>
                            <Text style={styles.resend_code}>Didn't Get the Code? </Text>
                            <TouchableOpacity onPress={() => {navigation.navigate('NumberVerificationScreen')}} >
                                <Text style={styles.resend}>Resend Code</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={{flex:0.5}}>
                        <TouchableOpacity activeOpacity={0.7} style={styles.verifyNow} onPress={() => pressHandler(otpValue)}>
                            {loading ? 
                                <ActivityIndicator size={20} color={Colors.WHITE}/>
                                :
                                <Text style={styles.verifyNowText}>Verify Now</Text>
                            }
                        </TouchableOpacity>
                    </View>

                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    loader:{
        alignItems:'center',
        justifyContent:'center',
        flex:1
    },
    screen:{
        flex:1,
        backgroundColor:Colors.WHITE
    },
    resend:{
        color:Colors.ORANGE,
        fontWeight:'bold',
        fontSize: 18
    },
    resend_code:{
        fontWeight:'bold',
        color:Colors.GREY,
        fontSize:18
    },
    verifyNow:{
        alignItems:'center', 
        justifyContent:'center', 
        padding:20, 
        backgroundColor: Colors.ORANGE, 
        borderRadius:5
    },
    verifyNowText:{
        color: Colors.WHITE, 
        fontWeight:'bold', 
        fontSize:20
    },
    OtpInputCell:{
        backgroundColor: Colors.ORANGE,
        borderRadius:5,
        borderWidth:0,
        height:60,
        width:60
    },
    OtpInputCellUnfocused:{
        backgroundColor: Colors.ORANGE,
        borderRadius:5,
        borderWidth:0,
        height:60,
        width:60
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
        paddingHorizontal:10
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
        paddingHorizontal:35,
        paddingTop:30,
        justifyContent:'space-between'
    },
    image:{
        marginVertical:10,
        height: 180,
        width:180,
        marginRight:10
    },
});

export default VerifyScreen;
