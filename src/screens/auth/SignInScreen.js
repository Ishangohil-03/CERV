import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, StatusBar, Image, ActivityIndicator, Alert } from 'react-native';
import * as Animatable from 'react-native-animatable';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicon from 'react-native-vector-icons/Ionicons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Formik } from 'formik';
import { useDispatch } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-simple-toast';

import{ Colors, Images }from '../../CommonConfig';
import SignInScreenValidationSchema from '../../schema/SignInScreenSchema';
import { postPreLogin } from "../../helpers/ApiHelpers";
import { CommonActions } from '@react-navigation/native';

const LOGIN = 'LOGIN';

const SignInScreen = props => {

    const role = props.route.params.role

    const [eyeTouched, setEyeTouched] = useState(false)
    const [isLoading ,setIsLoading] = useState(false);

    const login = async(values) => {
        setIsLoading(true)
        const data = {
            email: values.email,
            password: values.password,
            role: role,
            device_token: (await AsyncStorage.getItem('deviceToken'))
        };
        // console.log("Login Data: ",(data));
        const response = await postPreLogin('/users/login', data);
        const resData = response.data;
        // console.log(response)
        if (response.success) {
            try {
                await AsyncStorage.setItem('role',resData.user.role.toString())
                await AsyncStorage.setItem('token', resData.token)
                await AsyncStorage.setItem('refreshToken', resData.refreshToken)
                await AsyncStorage.setItem('userInfo', JSON.stringify(resData.user))
                await AsyncStorage.setItem('isLogin', "1")
            } catch (error) {
                console.log(error)
            }
            if(resData.user.role === 0) {
                props.navigation.dispatch(
                    CommonActions.reset({
                        index:0,
                        routes: [{name: 'CatererHome'}]
                    })
                )
            } else {
                props.navigation.dispatch(
                    CommonActions.reset({
                        index:0,
                        routes: [{name: 'Home'}]
                    })
                )
            }
            setIsLoading(false);
        } else {
            if (resData.error === 'User does not exist!') {
                Toast.show(" User does not exist! ");
            } else if (resData.error === 'Invalid Password!') {
                Toast.show("Incorrect Password")
            }
            setIsLoading(false)
        }
    }

    return(
        <View style={styles.screen}>
            <KeyboardAwareScrollView>
                <StatusBar backgroundColor={Colors.ORANGE} barStyle='light-content' />
                {/* HEADER */}
                <View style={styles.header}>
                    <View style={{flex:0.6}}>
                        <TouchableOpacity onPress={() => props.navigation.goBack()} style={{marginVertical:10, marginLeft:10}}>
                                <Ionicon name="arrow-back-outline" size={35} color={Colors.WHITE}/>
                        </TouchableOpacity>
                        <Text style={styles.headerLabel}>Welcome</Text>
                        <Text style={styles.headerText}>Are you a chef, do catering?</Text>
                        <Text style={styles.headerText}>Are you looking for a caterer for an event?</Text>
                        <Text style={{...styles.headerText, marginBottom:10}}>Login or Register Now.</Text>
                    </View>
                    <Image source={Images.AUTH_HEADER1} style={styles.image}/>
                </View>

                {/* BODY */}
                <View style={{backgroundColor: Colors.ORANGE}}>
                    <View style={styles.body}>
                        <Text style={styles.footerLabel}>Login</Text>
                        <Text style={styles.footerText}>Login to your account or Register below</Text>

                        <Formik
                            initialValues={{
                                email: '',
                                password: ''
                            }}
                            onSubmit = {values => login(values)}
                            validationSchema = { SignInScreenValidationSchema }
                        >
                             {({ values, errors, setFieldTouched, touched, handleChange, isValid, handleSubmit }) => (
                                 <View>
                                    <Text style={styles.text_footer} >Email</Text>
                                    <View style={{...styles.action, justifyContent:'space-between'}} >
                                        <View style={{flexDirection:'row'}}>
                                            <FontAwesome name="envelope" color={Colors.ORANGE} size={20}/>
                                            <TextInput
                                                value={values.email}
                                                autoCapitalize='none'
                                                onBlur={() => setFieldTouched('email')}
                                                onChangeText={handleChange('email')}
                                                keyboardType={'email-address'}
                                                placeholder="Email"
                                                style={styles.textInput}
                                            />
                                        </View>
                                        {touched.email && !errors.email && <Feather name="check-circle" color="green" size={20}/>}
                                    </View>
                                    {touched.email && errors.email &&
                                        <Text style={styles.errorMsg}>{errors.email}</Text>
                                    }

                                    <Text style={styles.text_footer} >Password</Text>
                                    <View style={{...styles.action, justifyContent:'space-between'}} >
                                        <View style={{flexDirection:'row'}}>
                                            <FontAwesome name="lock" color={Colors.ORANGE} size={20}/>
                                            <TextInput
                                                value={values.password}
                                                onBlur={() => setFieldTouched('password')}
                                                onChangeText={handleChange('password')}
                                                placeholder="Password"
                                                style={styles.textInput}
                                                secureTextEntry = { eyeTouched ? false : true }
                                            />
                                        </View>
                                        <TouchableOpacity onPress={ () => setEyeTouched(!eyeTouched) } > 
                                            {!eyeTouched ? <Feather name="eye-off" color={Colors.GREY} size={20}/>:<Feather name="eye" color={Colors.GREY} size={20}/>}
                                        </TouchableOpacity>
                                    </View>
                                    {touched.password && errors.password &&
                                        <Text style={styles.errorMsg}>{errors.password}</Text>
                                    }

                                    <TouchableOpacity onPress={()=>{props.navigation.navigate('ForgotPassword')}}>
                                        <Text style={styles.forgotPassword} > Forgot Password ? </Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity onPress={handleSubmit} disabled={!isValid || isLoading}>
                                        <View style={styles.button}>
                                            <View style={styles.signIn}>
                                                {isLoading ? <ActivityIndicator size="small" color={Colors.WHITE} /> :<Text style={[styles.textSign,{color:'#fff'}]} >Login</Text>}
                                            </View>
                                        </View>
                                    </TouchableOpacity>

                                    <Image source={Images.OR} style={{width:'100%', height:30, marginTop:20}}/>

                                    <TouchableOpacity onPress={() => props.navigation.navigate('SignUpScreen', {role})} style={{alignItems:'center', marginTop:25}} >
                                        <Text style={styles.signUp} >Don't have an Account? <Text style={styles.register}>Register</Text></Text>
                                    </TouchableOpacity>

                                 </View>
                             )}
                        </Formik>
                    </View>
                </View>
            </KeyboardAwareScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    screen:{
        flex:1,
        backgroundColor: Colors.WHITE
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
        fontSize:30,
        margin:10
    },
    headerText:{
        color:Colors.WHITE,
        fontWeight:'900',
        fontSize:15,
        marginLeft:10,
    },
    body:{
        flex:3,
        backgroundColor:Colors.WHITE,
        borderTopLeftRadius:30,
        borderTopRightRadius:30,
        paddingHorizontal:20,
        paddingVertical:30,
    },
    image:{
        marginVertical:10,
        height: 180,
        width:180,
        flex:0.45,
        marginRight:10
    },
    footerLabel:{
        fontWeight:'bold',
        color: Colors.BLACK,
        fontSize:35
    },
    footerText:{
        fontWeight:'800',
        color: Colors.BLACK,
        fontSize:20
    },
    text_footer:{
        color: Colors.GREY,
        fontSize:18,
        fontWeight:'bold',
        marginTop:35
    },
    action:{
        flexDirection:'row',
        marginTop:10,
        borderBottomWidth:1,
        borderBottomColor:Colors.GREY,
        paddingBottom: 10,
        marginBottom:5,
        alignItems:'center'
    },
    textInput:{
        marginHorizontal: 10,
        flex:0.9,
    },
    errorMsg:{ 
        fontSize: 11, 
        color: Colors.ERROR_RED 
    },
    forgotPassword:{
        textAlign:'right',
        marginTop: 15,
        fontSize:15
    },
    button:{
        alignItems:'center',
        marginTop: 50,
    },
    signIn:{
        width:'100%',
        height:50,
        justifyContent:'center',
        alignItems:'center',
        borderRadius:10,
        backgroundColor: Colors.ORANGE
    },
    textSign:{
        fontSize:18,
        fontWeight:'bold'
    },
    signUp:{
        fontSize:18,
        color:'#131211'
    },
    register:{
        fontWeight:'bold'
    },
});

export default SignInScreen;