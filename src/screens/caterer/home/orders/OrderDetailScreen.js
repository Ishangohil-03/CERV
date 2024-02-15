import { ActivityIndicator, StyleSheet, Text, View, Image, ScrollView, TouchableOpacity, PermissionsAndroid, Alert, Platform } from 'react-native'
import React, { useState } from 'react'
import { Colors, Images } from '../../../../CommonConfig'
import moment from 'moment'
import SimpleToast from 'react-native-simple-toast'
import { getPostLogin, postPostLogin, putPostLogin } from '../../../../helpers/ApiHelpers'
import { Rating } from 'react-native-ratings'
import AsyncStorage from '@react-native-async-storage/async-storage'
import RNFetchBlob from 'react-native-fetch-blob'

const OrderDetailScreen = ({ navigation, route }) => {

    const { order, mode } = route.params

    const [loading, setLoading] = useState(false)
    const [invoiceLoading, setInvoiceLoading] = useState(false)

    const [pdfData, setPdfData] = useState(null)

    const isCurrentMode = mode === 'current' ? true : false
    const isPastMode = mode === 'past' ? true : false

    const onPressAccept = async() => {
        setLoading(true)
        const response = await postPostLogin(`/caterer/accept-order/${order.id}`)
        // console.log(response);
        if(response.success){
            SimpleToast.show('Order accepted!')
            navigation.goBack()
            setLoading(false)
        } else {
            SimpleToast.show('Something went wrong!')
            navigation.goBack()
            setLoading(false)
        }
    }

    const onPressReject = async() => {
        setLoading(true)
        const response = await postPostLogin(`/caterer/reject-order/${order.id}`)
        if(response.success){
            SimpleToast.show('Order rejected!')
            navigation.goBack()
            setLoading(false)
        } else {
            SimpleToast.show('Something went wrong!')
            navigation.goBack()
            setLoading(false)
        }
    }

    const onPressPrepare = async() => {
        setLoading(true)
        const data = {
            orderId: order.id
        }
        const response = await putPostLogin('/caterer/order-preparing', data)
        if(response.success){
            SimpleToast.show('Preparing Order!')
            navigation.goBack()
            setLoading(false)
        } else {
            SimpleToast.show('Something went wrong!')
            navigation.goBack()
            setLoading(false)
        }
    }

    const onPressDispatch = async() => {
        setLoading(true)
        const data = {
            orderId: order.id
        }
        const response = await putPostLogin('/caterer/order-dispatched', data)
        if(response.success){
            SimpleToast.show('Dispatching Order!')
            navigation.goBack()
            setLoading(false)
        } else {
            SimpleToast.show('Something went wrong!')
            navigation.goBack()
            setLoading(false)
        }
    }

    const onPressComplete = async() => {
        setLoading(true)
        const data = {
            orderId: order.id
        }
        const response = await putPostLogin('/caterer/order-delivered', data)
        if(response.success){
            SimpleToast.show('Order Completed!')
            navigation.goBack()
            setLoading(false)
        } else {
            SimpleToast.show('Something went wrong!')
            navigation.goBack()
            setLoading(false)
        }
    }

    const invoiceHandler = async() => {
        setInvoiceLoading(true)
        RNFetchBlob
        .config({
            addAndroidDownloads:{
                useDownloadManager : true,
                notification: true
            }
        })
        .fetch('GET',`https://cerv-api.herokuapp.com/caterer/get-invoice/${order.id}`,{
            Authorization : 'Bearer ' + (await AsyncStorage.getItem('token'))
        })
        .then((res) => {
            res.path()
        })
        setInvoiceLoading(false)
    }

    const statusText = (orderObj) => {
        switch(orderObj.status){
            case 4:
                //Delivered
                return `• Order completed on ${moment(orderObj.date).format('DD/MM/YYYY')}`
            case 5:
                //Cancelled by user
                return '• Order cancelled by customer'
            case 6:
                //Rejected
                return '• Order rejected'
            default:
                return '';
        }
    }

    if (loading) {
        return (
            <View style={styles.loader}>
                <ActivityIndicator size={65} color={Colors.ORANGE} />
            </View>
        )
    }

    return (
        <View style={styles.screen} >
            
             <ScrollView showsVerticalScrollIndicator={false}>
                 <View style={{backgroundColor: Colors.WHITE, marginBottom: 5, padding:10}}>
                    <View style={styles.userContainer}>
                        <Image source={{ uri: order.user.image }} style={{ height: '100%', aspectRatio: 1 }} />
                        <View style={{ height: '100%', justifyContent: 'space-evenly', marginLeft: 10 }}>
                            <Text style={{ fontWeight: 'bold', fontSize: 18 }}>{order.user.name}</Text>
                            <Text>{order.address}</Text>
                            <Text>{moment(order.date).format('DD/MM/YYYY')}</Text>
                        </View>
                    </View>
                    {isPastMode && <Text style={[styles.statusText, { color: order.status === 4 ? Colors.GREEN : Colors.ERROR_RED }]}>{statusText(order)}</Text>}
                </View>

                <View style={styles.orderTypeContainer}>
                    <Text style={styles.label}>Order Type</Text>
                    <Text style={styles.orderType}>{order.order_type}</Text>
                </View>

                {isPastMode && <View style={styles.orderItemsContainer}>
                    <Text style={styles.label}>Order Item Details</Text>
                    {order.orderItems.map(dish => {
                        return (
                            <View key={dish.itemId} style={styles.dishContainer}>
                                <View style={{ flex: 5 }}>
                                    <Text style={styles.title}>{dish.item.title}</Text>
                                    <Text style={styles.quantity}>{dish.quantity} Dishes</Text>
                                </View>
                                <Text style={styles.itemTotal}>$ {dish.itemTotal.toFixed(2)}</Text>
                            </View>
                        )
                    })}
                </View>}

                {isCurrentMode && <View style={[styles.orderItemsContainer, {marginBottom:0}]}>
                    <Text style={styles.label}>Bill Details</Text>
                    {order.orderItems.map(dish => {
                        return (
                            <View key={dish.itemId} style={styles.dishContainer}>
                                <Text style={[styles.itemTotal, { flex: 5 }]}>{dish.item.title} ( {dish.quantity} dishes )</Text>
                                <Text style={styles.itemTotal}>$ {dish.itemTotal.toFixed(2)}</Text>
                            </View>
                        )
                    })}

                    <View style={styles.dishContainer}>
                        <Text style={[styles.itemTotal, { flex: 5 }]}>Service Charge</Text>
                        <Text style={styles.itemTotal}>$ 1.00</Text>
                    </View>

                    <View style={styles.dishContainer}>
                        <Text style={[styles.itemTotal, { flex: 5 }]}>Delivery Charge</Text>
                        <Text style={styles.itemTotal}>$ 5.00</Text>
                    </View>

                    <View style={[styles.dishContainer, { borderTopColor: Colors.LIGHTER_GREY, borderTopWidth: 0.5, paddingVertical: 10 }]}>
                        <Text style={[styles.itemTotal, { flex: 5 }]}>Promo Discount</Text>
                        <Text style={styles.itemTotal}>$ {order.discount}</Text>
                    </View>

                    <View style={[styles.dishContainer, { borderTopColor: Colors.LIGHTER_GREY, borderTopWidth: 0.5, paddingVertical: 10 }]}>
                        <Text style={[styles.itemTotal, { flex: 5 }]}>Subtotal</Text>
                        <Text style={styles.itemTotal}>$ {order.amount.toFixed(2)}</Text>
                    </View>

                    <View style={[styles.dishContainer, { borderTopColor: Colors.LIGHTER_GREY, borderTopWidth: 0.5, paddingVertical: 10 }]}>
                        <Text style={[styles.itemTotal, { flex: 5 }]}>Tax</Text>
                        <Text style={styles.itemTotal}>$ 5.10</Text>
                    </View>

                    <View style={[styles.dishContainer, { borderTopColor: Colors.LIGHTER_GREY, borderTopWidth: 0.5, paddingVertical: 10 }]}>
                        <Text style={[styles.itemTotal, { flex: 5, fontWeight: 'bold' }]}>Total</Text>
                        <Text style={[styles.itemTotal, { fontWeight: 'bold' }]}>$ {order.netAmount.toFixed(2)}</Text>
                    </View>

                </View>}


                {isPastMode && order.is_reviewed === true && 
                    <View style={styles.orderItemsContainer}>
                        <Text style={styles.label}>Rate and reviews</Text>
                        <Text style={[styles.title,{ fontSize:22 }]}>{order.user.name}</Text>
                        <Rating 
                            style={{alignSelf:'flex-start'}}
                            readonly
                            startingValue={order.feedback.rating}
                            imageSize={20}
                            ratingCount={5}
                            ratingColor={Colors.STAR_YELLOW}
                            />
                        <Text style={styles.review}>{order.feedback.review}</Text>
                    </View>
                } 
                
                <Image source={Images.PAPER_TEAR} style={{width:'100%', marginBottom:25, height:35, transform:[{rotate:'180deg'}]}}/>
                

            </ScrollView>

            

            <View style={styles.footer}>
                { 
                    order.status === 0 && 
                    <>
                        <TouchableOpacity style={[styles.orderButton,{backgroundColor: Colors.GREEN}]} activeOpacity={0.6} onPress={onPressAccept}>
                            <Text style={styles.orderButtonText}>Accept Order</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.orderButton,{backgroundColor: Colors.ERROR_RED}]} activeOpacity={0.6} onPress={onPressReject}>
                            <Text style={styles.orderButtonText}>Reject Order</Text>
                        </TouchableOpacity>
                    </>
                }
                { 
                    order.status === 1 && 
                    <TouchableOpacity style={[styles.orderButton,{backgroundColor: Colors.ORANGE}]} activeOpacity={0.6} onPress={onPressPrepare}>
                        <Text style={styles.orderButtonText}>Start Preparing</Text>
                    </TouchableOpacity>
                }
                { 
                    order.status === 2 && 
                    <TouchableOpacity style={[styles.orderButton,{backgroundColor: Colors.ORANGE}]} activeOpacity={0.6} onPress={onPressDispatch}>
                        <Text style={styles.orderButtonText}>Dispatch Order</Text>
                    </TouchableOpacity>
                }
                { 
                    order.status === 3 && 
                    <TouchableOpacity style={[styles.orderButton,{backgroundColor: Colors.ORANGE}]} activeOpacity={0.6} onPress={onPressComplete}>
                        <Text style={styles.orderButtonText}>Complete Order</Text>
                    </TouchableOpacity>
                }
                { 
                    order.status === 4 && 
                    <TouchableOpacity 
                        style={[styles.orderButton,{backgroundColor: Colors.ORANGE}]} 
                        activeOpacity={0.6} 
                        onPress={invoiceHandler}
                        // disabled={invoiceLoading}
                    >
                        { invoiceLoading ?
                            <ActivityIndicator color={Colors.WHITE} size={25}/>
                            :
                            <Text style={styles.orderButtonText}>View Invoice</Text>
                        }
                    </TouchableOpacity>
                }
            </View>
        </View>
    )
}

export default OrderDetailScreen

const styles = StyleSheet.create({
    loader: {
        flex: 1,
        backgroundColor: Colors.WHITE,
        justifyContent: 'center',
        alignItems: 'center'
    },
    screen: {
        flex: 1
    },
    userContainer: {
        height: 100,
        width: '100%',
        flexDirection: 'row',
        backgroundColor: Colors.WHITE,
        marginBottom: 5
    },
    orderTypeContainer: {
        height: 100,
        width: '100%',
        backgroundColor: Colors.WHITE,
        padding: 10,
        marginBottom: 5,
        justifyContent: 'space-evenly'
    },
    orderItemsContainer: {
        width: '100%',
        backgroundColor: Colors.WHITE,
        padding: 10,
    },
    label: {
        fontWeight: 'bold',
        color: Colors.GREY,
        fontSize: 20,
        marginBottom: 10
    },
    orderType: {
        fontSize: 22
    },
    dishContainer: {
        flexDirection: 'row',
        marginVertical: 5,
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold'
    },
    quantity: {
        color: Colors.GREY
    },
    itemTotal: {
        flex: 1,
        fontSize: 16
    },
    footer:{
        width:'100%',
        alignItems:'center',
        justifyContent:'center',
        paddingHorizontal:10,
        paddingVertical:20,
        backgroundColor: Colors.WHITE,
        flexDirection:'row',
        alignItems:'center',
        marginTop:10
    },
    orderButton:{
        width:'45%',
        paddingVertical:10,
        borderRadius: 5,
        alignItems:'center',
        justifyContent:'center'
    },
    orderButtonText:{
        fontWeight:'bold',
        fontSize: 20,
        color: Colors.WHITE
    },
    statusText:{
        fontWeight:'bold',
        fontSize:18
    },
    review:{
        fontWeight:'700',
        color: Colors.GREY,
        fontSize:14,
        marginVertical:10
    }
})