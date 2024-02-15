import { Image, StatusBar, StyleSheet, View, ActivityIndicator } from 'react-native'
import React, { useEffect } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CommonActions } from '@react-navigation/native';
import messaging from '@react-native-firebase/messaging';

import { Colors, Images } from '../CommonConfig'

const SplashScreen = ({navigation}) => {

    useEffect( () => {
        messaging().getToken().then( async(token) => { 
            console.log(token)
            await AsyncStorage.setItem('deviceToken', token)
         });
    },[])

    useEffect( () => {
        loadApp()
    },[])

    const loadApp = async() => {

        const isLogin = await AsyncStorage.getItem('isLogin');
        const role = await AsyncStorage.getItem('role');
        if(isLogin === "1") {
            if(role === "0"){
                navigation.dispatch(CommonActions.reset({
                    index:0,
                    routes: [{name:'CatererHome'}]
                }))
            } else if(role === "1") {
                navigation.dispatch(CommonActions.reset({
                    index:0,
                    routes: [{name:'Home'}]
                }))
            } else {
                navigation.dispatch(CommonActions.reset({
                    index:0,
                    routes: [{name:'Auth'}]
                }))
            }
        } else {
            navigation.dispatch(CommonActions.reset({
                index:0,
                routes: [{name:'Auth'}]
            }))
        }
    }

    return (
        <View style={styles.screen}>
            <StatusBar backgroundColor={Colors.ORANGE}/>
            <Image source={Images.LOGO} style={{width: 200, height:200}}/>
            <ActivityIndicator color={Colors.WHITE}  size={50}/>
        </View>
    )
}

export default SplashScreen

const styles = StyleSheet.create({
    screen:{
        flex:1,
        alignItems:'center',
        justifyContent:'space-evenly',
        padding:10,
        backgroundColor: Colors.ORANGE
    }
})