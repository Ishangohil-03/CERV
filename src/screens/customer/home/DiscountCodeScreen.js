import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react'

import DiscountCoupon from '../../../components/DiscountCoupon';
import{ Colors }from '../../../CommonConfig';
import discounts from '../../../model/discounts';
import * as cartActions from '../../../store/actions/cart';
import { useDispatch } from 'react-redux';
import { getPostLogin } from '../../../helpers/ApiHelpers';
import SimpleToast from 'react-native-simple-toast';

const DiscountCodeScreen = props => {

    const [ loading, setLoading ] = useState(true)
    const [ coupons, setCoupons ] = useState([])

    const { catererId } = props.route.params
    // console.log(catererId);

    const dispatch = useDispatch();

    useEffect(() => {
        const unsubscribe = props.navigation.addListener('focus',() => {
            getCoupons()
        })

        return unsubscribe
    },[props.navigation]) 

    const getCoupons = async() => {
        setLoading(true)
        const response = await getPostLogin(`/getCoupons/${catererId}`)
        // console.log(response.data.data);
        if(response.success) {
            setCoupons(response.data.data.coupons)
            setLoading(false)
        } else {
            SimpleToast.show('Something went wrong!')
            setLoading(false)
        }
    }

    const pressHandler = (code) => {
        dispatch(cartActions.applyDiscount(code));
        props.navigation.goBack();
    }

    if(loading){
        return(
            <View style={styles.loader}>
                <ActivityIndicator size={65} color={Colors.ORANGE} />
            </View>
        )
    }

    return (
        <View style={styles.screen}>
            { coupons.length > 0 &&
            <ScrollView showsVerticalScrollIndicator={false}>
            {coupons.map( item => {
                // console.log(item);
                return(
                    <View key={item.id}>
                        <DiscountCoupon 
                            offer = {item.description}
                            code = {item.code}
                            onPress = { () => {pressHandler(item)} }
                        />
                    </View>
                )
            } )}
            </ScrollView>}
            {
                coupons.length === 0 &&
                    <View style={styles.loader}>
                        <Text style={{fontSize:24, fontWeight:'bold', color: Colors.LIGHTER_GREY}}>No Coupons found!</Text>
                    </View>
            }
        </View>
    )
};

const styles = StyleSheet.create({
    screen:{
        flex:1,
        padding:20,
        backgroundColor: Colors.WHITE
    },
    loader:{
        flex:1,
        backgroundColor: Colors.WHITE,
        justifyContent:'center',
        alignItems:'center'
    }
});

export default DiscountCodeScreen;
