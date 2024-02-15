import { StyleSheet, Image, View, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Colors } from '../../../../CommonConfig'
import AsyncStorage from '@react-native-async-storage/async-storage'
import ProfileOption from '../../../../components/profileOption'
import { CommonActions } from '@react-navigation/native' 
import { getPostLogin } from '../../../../helpers/ApiHelpers'
import SimpleToast from 'react-native-simple-toast'

const ProfileScreen = ({navigation}) => {

    const [loading, setLoading] = useState(true)
    const [ user, setUser ] = useState({})

    useEffect( () => {
        const refresh = navigation.addListener('focus', () => {
            getProfile()
        })
        return refresh
    },[navigation])

    const getProfile = async() => {
        setLoading(true)
        const response = await getPostLogin('/caterer/getProfile')
        // console.log(response);
        if(response.success) {
            setUser(response.data.data)
            setLoading(false)
        } else {
            SimpleToast.show('Something went wrong!\n Logging out!')
            await AsyncStorage.clear()
            await AsyncStorage.setItem('isLogin', "0")
            navigation.dispatch(
                CommonActions.reset({
                    index:0,
                    routes:[{name:'Auth'}]
                })
            )
            setLoading(false)
        }
    }

    if(loading){
        return(
            <View style={styles.loader}>
                <ActivityIndicator size={65} color={Colors.ORANGE}/>
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
                    navigation.navigate('PersonalInformation',{ user })
                }}
            />

            {/* Payment Method */}
            {/* <ProfileOption 
                title = "Payment Method"
                leftIcon = "wallet-outline"
                rightIcon = "chevron-forward-outline"
                onPress={() => {
                }}
            /> */}

            {/* Saved Address */}
            <ProfileOption 
                title = "Discount Codes"
                leftIcon = "film-outline"
                rightIcon = "chevron-forward-outline"
                onPress={() => {
                    navigation.navigate('SavedDiscountCodes')
                }}
            />

            {/* Change Password */}
            <ProfileOption 
                title = "Change Password"
                leftIcon = "lock-open-outline"
                rightIcon = "chevron-forward-outline"
                onPress={() => {
                    navigation.navigate('ChangePassword')
                }}
            />

            {/* Log Out */}
            <ProfileOption 
                title = "Log Out"
                leftIcon = "log-out-outline"
                onPress={ () => {
                    AsyncStorage.clear()
                    AsyncStorage.setItem('isLogin', "0")
                    navigation.dispatch(
                        CommonActions.reset({
                            index:0,
                            routes:[{name:'Splash'}]
                        })
                    )
                }}
            />

        </View>
    )
}

export default ProfileScreen

const styles = StyleSheet.create({
    loader:{
        flex:1,
        alignItems:'center',
        justifyContent:'center',
        backgroundColor: Colors.WHITE
    },
    screen:{
        flex:1,
        alignItems:'center',
        backgroundColor: Colors.WHITE
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
})