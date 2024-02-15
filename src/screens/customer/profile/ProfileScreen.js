import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import Users from '../../../model/users';
import { useDispatch, useSelector } from 'react-redux';
import Toast from 'react-native-simple-toast'

import * as authActions from '../../../store/actions/auth';
import * as userActions from '../../../store/actions/user';
import ProfileOption from '../../../components/profileOption';
import{ Colors }from '../../../CommonConfig';
import { getPostLogin, postPostLogin, refreshToken } from '../../../helpers/ApiHelpers';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CommonActions } from '@react-navigation/native';


const ProfileScreen = props => {

    const [isLoading, setIsLoading] = useState(true)
    const [user, setUser] = useState({})

    useEffect( () => {
        const unsubscribe = props.navigation.addListener('focus', () => {
            getProfile()
        });
        return unsubscribe;
    },[props.navigation])
    
    const getProfile = async() => {
        setIsLoading(true)
        setUser(JSON.parse(await AsyncStorage.getItem("userInfo")))   
        setIsLoading(false)
    }

    if( isLoading ) {
        return(
            <View style={{...styles.screen, justifyContent:'center'}}>
                <ActivityIndicator size={60} color={ Colors.ORANGE } />
            </View>
        )
    }

    return (
        <View style={styles.screen} >
            
            {/* PROFILE PICTURE */}
            <View style={styles.ppContainer}>
                <Image source={{uri: user.image }} style={styles.ppImage}/>
            </View>

            {/* OPTIONS */}

            {/* Personal Information */}
            <ProfileOption 
                title = "Personal Information"
                leftIcon = "person-outline"
                rightIcon = "chevron-forward-outline"
                onPress={() => {
                    props.navigation.navigate('PersonalInformation', { user })
                }}
            />

            {/* Payment Method */}
            <ProfileOption 
                title = "Payment Method"
                leftIcon = "wallet-outline"
                rightIcon = "chevron-forward-outline"
                onPress={() => {
                    props.navigation.navigate('SavedCards')
                }}
            />

            {/* My Favourites */}
            <ProfileOption 
                title = "My Favourites"
                leftIcon = "heart-outline"
                rightIcon = "chevron-forward-outline"
                onPress={() => {
                    props.navigation.navigate('MyFavourites')
                }}
            />

            {/* Saved Address */}
            <ProfileOption 
                title = "Saved Addresses"
                leftIcon = "location-outline"
                rightIcon = "chevron-forward-outline"
                onPress={() => {
                    props.navigation.navigate('SavedAddresses')
                }}
            />

            {/* Change Password */}
            <ProfileOption 
                title = "Change Password"
                leftIcon = "lock-open-outline"
                rightIcon = "chevron-forward-outline"
                onPress={() => {
                    props.navigation.navigate('ChangePassword')
                }}
            />

            {/* Log Out */}
            <ProfileOption 
                title = "Log Out"
                leftIcon = "log-out-outline"
                onPress={ () => {
                    AsyncStorage.clear()
                    AsyncStorage.setItem('isLogin', "0")
                    props.navigation.dispatch(
                        CommonActions.reset({
                            index:0,
                            routes:[{name:'Splash'}]
                        })
                    )
                }}
            />

        </View>
    );
};

const styles = StyleSheet.create({
    screen:{
        flex:1,
        alignItems:'center',
        backgroundColor:Colors.WHITE
    },
    ppContainer:{
        borderRadius:90,
        overflow:'hidden',
        marginVertical: 25
    },
    ppImage:{
        height:180,
        width:180
    }
});

export default ProfileScreen;