import { ActivityIndicator, Dimensions, FlatList, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import Toast from 'react-native-simple-toast';
import RBSheet from 'react-native-raw-bottom-sheet';

import Ionicons from 'react-native-vector-icons/Ionicons';
import { deletePostLogin, getPostLogin } from '../../../../../helpers/ApiHelpers';
import { Colors } from '../../../../../CommonConfig';
import DiscountCoupon from '../../../../../components/DiscountCoupon';
import ProfileOption from '../../../../../components/profileOption';

const SavedDiscountCodes = ({navigation}) => {

    const [ loading, setLoading ] = useState(true)
    const [ codes, setCodes ] = useState([])
    const [ selectedCode, setSelectedCode ] = useState({})
    const [ refreshScreen, setRefreshScreen ] = useState(false)

    const optionSheet = useRef(null)

    useEffect( () => {
        const refresh = navigation.addListener('focus', () => {
            setLoading(true)
            getCodes()
        })

        return refresh
    },[navigation, refreshScreen])

    const getCodes = async() => {
        const response = await getPostLogin('/caterer/getCoupons')
        // console.log(response.data.data)
        if(response.success) {
            setCodes(response.data.data)
            setLoading(false)
        } else {
            Toast.show('No discount codes available')
            setLoading(false)
        }
    }  

    const deleteCouponHandler = async() => {
        const params = {
            couponId : selectedCode.id
        }

        const response = await deletePostLogin('/caterer/deleteCoupon', params)
        // console.log(response)
        if(response.success){
            Toast.show('Coupon deleted successfully!')
            await optionSheet.current.close()
            navigation.goBack()
        } else {
            Toast.show('Something went wrong!')
            await optionSheet.current.close()
            navigation.goBack()
        }
    } 

    const renderCoupon = ({item}) => {
        return(
            <DiscountCoupon 
                code={item.code}
                offer={item.description}
                onPress={() => {
                    // console.log(item)
                    setSelectedCode(item)
                    optionSheet.current.open()
                }}
            />
        )
    }

    if(loading) {
        return(
            <View style={styles.loader}>
                <ActivityIndicator size={65} color={Colors.ORANGE} />
            </View>
        )
    }

    return (
        <View style={styles.screen}>
            <FlatList 
                data={codes}
                key={item => item.id}
                renderItem={renderCoupon}
                showsVerticalScrollIndicator={false}
            />
            <TouchableOpacity 
                style={styles.addBtn} 
                onPress={() => { navigation.navigate('EditCoupon',{mode: 'add'})}} 
                activeOpacity={0.6}
            >
                <Ionicons name={'add'} color={Colors.WHITE} size={60}/>
            </TouchableOpacity>
            <RBSheet
                    ref={optionSheet}
                    animationType={'slide'}
                    closeOnDragDown={false}
                    closeOnPressMask={false}
                    closeOnPressBack={false}
                    dragFromTopOnly
                    customStyles={{
                    wrapper: {
                        backgroundColor: "rgba(0,0,0,0.5)"
                    },
                    container:{
                        height: 200,
                        paddingHorizontal:20,
                        paddingTop:5,
                        backgroundColor: Colors.WHITE,
                        borderTopRightRadius:20,
                        borderTopLeftRadius:20,
                    }
                    }}
                >
                    <View style={{flex:1}}>
                        <StatusBar backgroundColor={'rgba(0,0,0,0.5)'} barStyle={'default'}/>
                        <ProfileOption 
                            title = "Edit Code"
                            leftIcon = "create-outline"
                            rightIcon = "chevron-forward-outline"
                            onPress={() => {
                                navigation.navigate('EditCoupon',{ selectedCode, mode: 'edit' })
                            }}
                        />
                        <ProfileOption 
                            title = "Delete Code"
                            leftIcon = "trash-outline"
                            rightIcon = "chevron-forward-outline"
                            onPress={deleteCouponHandler}
                        />
                        <ProfileOption 
                            title = "Close"
                            leftIcon = "close-circle-outline"
                            onPress={() => {optionSheet.current.close()}}
                        />
                    </View>
                </RBSheet>
        </View>
    )
}

export default SavedDiscountCodes

const styles = StyleSheet.create({
    loader:{
        flex:1,
        alignItems:'center',
        justifyContent:'center'
    },
    screen:{
        flex:1,
        padding:10,
        backgroundColor: Colors.WHITE
    },
    separator:{
        height:10, 
        width:'100%', 
        backgroundColor: 
        Colors.WHITE
    },
    addBtn:{
        backgroundColor: Colors.GREY,
        borderRadius:100,
        borderWidth:5,
        borderColor: Colors.WHITE,
        width:75,
        height:75,
        alignItems:'center',
        justifyContent:'center',
        position:'absolute',
        bottom:20,
        right:20,
        zIndex:20,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    }
})