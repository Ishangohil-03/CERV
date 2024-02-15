import { StyleSheet, Text, View, TouchableOpacity, ActivityIndicator, ScrollView, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Colors } from '../../../../CommonConfig';
import { getPostLogin, postPostLogin, putPostLogin } from '../../../../helpers/ApiHelpers';
import moment from 'moment';
import Toast from 'react-native-simple-toast';

const OrdersScreen = ({navigation, route}) => {

    const [loading, setLoading] = useState(true)
    const [state, setState] = useState('1');
    const [orders, setOrders] = useState([])
    const [length, setLength] = useState(0)

    useEffect( () => {
        const refresh = navigation.addListener('focus',() => {
            setState('1')
            getOrders()
        })
        return refresh
    },[navigation])

    useEffect( () => {
        getOrders()
    },[state])


    const getOrders = async() => {
        setLoading(true)
        const response = await getPostLogin(`/caterer/getOrders/${state}`)
        if (response.success) {
            setLength(response.data.length)
            setOrders(response.data.orders)
            setLoading(false)
        } else {
            console.log(response);
            setLoading(false)
            // }
        }
    }

    const dateFormatter = (date, time) => {
        let dateString = date+'T'+time
        const dateObj = new Date(dateString)
        dateObj.setHours(dateObj.getHours() - 5)
        dateObj.setMinutes(dateObj.getMinutes() - 30)
        return `${moment(dateObj).format('DD/MM/YYYY')} at ${moment(dateObj).format('hh:mm A')}`
    }

    const acceptHandler = async( accOrder ) => {
        // console.log(accOrder);
        setLoading(true)
        const response = await postPostLogin(`/caterer/accept-order/${accOrder.id}`)
        // console.log(response);
        if(response.success){
            Toast.show('Order accepted!')
            getOrders()
        } else {
            Toast.show('Something went wrong!')
            getOrders()
        }
    }

    const rejectHandler = async( rejOrder ) => {
        // console.log(rejOrder);
        setLoading(true)
        const response = await postPostLogin(`/caterer/reject-order/${rejOrder.id}`)
        // console.log(response);
        if(response.success){
            Toast.show('Order rejected!')
            getOrders()
        } else {
            Toast.show('Something went wrong!')
            getOrders()
        }
    }

    const onPressPrepare = async(orderObj) => {
        setLoading(true)
        const data = { 
            orderId: orderObj.id
        }

        const response = await putPostLogin('/caterer/order-preparing', data)
        if(response.success){
            Toast.show('Preparing Order!')
            getOrders()
        } else {
            Toast.show('Something went wrong!')
            getOrders()
        }
    }

    const onPressDispatch = async(orderObj) => {
        setLoading(true)
        const data = { 
            orderId: orderObj.id
        }

        const response = await putPostLogin('/caterer/order-dispatched', data)
        if(response.success){
            Toast.show('Order dispatched!')
            getOrders()
        } else {
            Toast.show('Something went wrong!')
            getOrders()
        }
        
    }

    const onPressComplete = async(orderObj) => {
        setLoading(true)
        const data = { 
            orderId: orderObj.id
        }

        const response = await putPostLogin('/caterer/order-delivered', data)
        if(response.success){
            Toast.show('Order Completed!')
            getOrders()
        } else {
            Toast.show('Something went wrong!')
            getOrders()
        }
    }

    return (
        <View style={styles.screen}>

            {/* Current / Past Button */}
            <View style={styles.currentPastButtonContainer}>
                <TouchableOpacity onPress={() => { setState('1'), setLoading(true) }} style={{ ...styles.currentPastButton, borderTopLeftRadius: 5, borderBottomLeftRadius: 5, backgroundColor: state === '1' ? Colors.ORANGE : Colors.WHITE, borderColor: state === '1' ? Colors.ORANGE : Colors.LIGHTER_GREY }}>
                    <Text style={{ ...styles.currentPastButtonText, color: state === '1' ? Colors.WHITE : Colors.LIGHTER_GREY }}>Current Orders</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => { setState('2'), setLoading(true) }} style={{ ...styles.currentPastButton, borderTopRightRadius: 5, borderBottomRightRadius: 5, backgroundColor: state === '2' ? Colors.ORANGE : Colors.WHITE, borderColor: state === '2' ? Colors.ORANGE : Colors.LIGHTER_GREY }}>
                    <Text style={{ ...styles.currentPastButtonText, color: state === '2' ? Colors.WHITE : Colors.LIGHTER_GREY }}>Past Orders</Text>
                </TouchableOpacity>
            </View>

            <View style={{ flex: 10 }}>
                {loading ? 
                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                        <ActivityIndicator size={65} color={Colors.ORANGE} />
                    </View>
                    :
                    length <= 0 ?
                        <View style={{alignItems:'center', justifyContent:'center', flex:1}}>
                            <Text style={{fontWeight:'bold', fontSize: 24, color: Colors.LIGHTER_GREY}}>No Orders Yet!</Text>
                        </View>
                        :
                        state === '1' ?
                            <ScrollView showsVerticalScrollIndicator={false}>
                                {orders.map( order => {
                                    // console.log(order)
                                    return(
                                        <TouchableOpacity key={order.id} style={styles.currentOrderItemContainer} onPress={() => {
                                            navigation.navigate('OrderDetail', { order, mode: 'current' })
                                        }}>

                                            <View style={{height:75, width:'100%', flexDirection:'row'}}>
                                                <Image source={{uri: order.user.image}} style={{height: '100%', aspectRatio:1}}/>
                                                <View style={{height:'100%', justifyContent:'space-evenly', marginLeft: 10}}>
                                                    <Text style={{fontWeight:'bold', fontSize:18}}>{order.user.name}</Text>
                                                    <Text>{order.address}</Text>
                                                    <Text>{moment(order.date).format('DD/MM/YYYY')}</Text>
                                                </View>
                                            </View>
                                            <View style={{height:0 , width:'100%', borderWidth:0.25, borderColor: Colors.LIGHTER_GREY, marginVertical: 10}} />
                                            {order.orderItems.map( item => {
                                                // console.log(item);
                                                return(
                                                    <View key={item.id} style={{flexDirection:'row', alignItems:'center', justifyContent:'space-between'}}>
                                                        <Text style={{flex:5}}>{item.item?.title}</Text>
                                                        <Text style={{flex:1}}>$ {item?.itemTotal}</Text>
                                                    </View>
                                                )
                                            } )}
                                            <View style={{height:0 , width:'100%', borderWidth:0.25, borderColor: Colors.LIGHTER_GREY, marginVertical: 10}} />

                                            <View style={{flexDirection:'row', alignItems:'center', justifyContent:'space-evenly'}}>
                                                { 
                                                    order.status === 0 && 
                                                    <>
                                                        <TouchableOpacity style={[styles.orderButton,{backgroundColor: Colors.GREEN}]} activeOpacity={0.6} onPress={() => acceptHandler(order)}>
                                                            <Text style={styles.orderButtonText}>ACCEPT ORDER</Text>
                                                        </TouchableOpacity>
                                                        <TouchableOpacity style={[styles.orderButton,{backgroundColor: Colors.ERROR_RED}]} activeOpacity={0.6} onPress={() => rejectHandler(order)}>
                                                            <Text style={styles.orderButtonText}>REJECT ORDER</Text>
                                                        </TouchableOpacity>
                                                    </>
                                                }
                                                { 
                                                    order.status === 1 && 
                                                    <TouchableOpacity style={[styles.orderButton,{backgroundColor: Colors.ORANGE}]} activeOpacity={0.6} onPress={() => onPressPrepare(order)}>
                                                        <Text style={styles.orderButtonText}>START PREPARING</Text>
                                                    </TouchableOpacity>
                                                }
                                                { 
                                                    order.status === 2 && 
                                                    <TouchableOpacity style={[styles.orderButton,{backgroundColor: Colors.ORANGE}]} activeOpacity={0.6} onPress={() => onPressDispatch(order)}>
                                                        <Text style={styles.orderButtonText}>DISPATCH ORDER</Text>
                                                    </TouchableOpacity>
                                                }
                                                { 
                                                    order.status === 3 && 
                                                    <TouchableOpacity style={[styles.orderButton,{backgroundColor: Colors.ORANGE}]} activeOpacity={0.6} onPress={() => onPressComplete(order)}>
                                                        <Text style={styles.orderButtonText}>COMPLETE ORDER</Text>
                                                    </TouchableOpacity>
                                                }
                                            </View>
                                        
                                        </TouchableOpacity>
                                    )
                                } )}
                            </ScrollView>
                            :
                            <ScrollView showsVerticalScrollIndicator={false}>
                                {orders.map( order => {
                                    // console.log(order)
                                    return(
                                        <TouchableOpacity key={order.id} style={styles.currentOrderItemContainer} onPress={() => {
                                            navigation.navigate('OrderDetail', { order, mode: 'past' })
                                        }}>

                                            <View style={{height:75, width:'100%', flexDirection:'row'}}>
                                                <Image source={{uri: order.user.image}} style={{height: '100%', aspectRatio:1}}/>
                                                <View style={{height:'100%', justifyContent:'space-evenly', marginLeft: 10}}>
                                                    <Text style={{fontWeight:'bold', fontSize:18}}>{order.user.name}</Text>
                                                    <Text>{order.address}</Text>
                                                    <Text>{moment(order.date).format('DD/MM/YYYY')}</Text>
                                                </View>
                                            </View>
                                            <View style={{height:0 , width:'100%', borderWidth:0.25, borderColor: Colors.LIGHTER_GREY, marginVertical: 10}} />
                                            {order.orderItems.map( item => {
                                                return(
                                                    <View key={item.id} style={{flexDirection:'row', alignItems:'center', justifyContent:'space-between'}}>
                                                        <Text style={{flex:5}}>{item.item?.title}</Text>
                                                        <Text style={{flex:1}}>$ {item?.itemTotal}</Text>
                                                    </View>
                                                )
                                            } )}
                                            <View style={{height:0 , width:'100%', borderWidth:0.25, borderColor: Colors.LIGHTER_GREY, marginVertical: 10}} />

                                            {order.status === 4 && <Text style={styles.completedOrder}>• Completed on {dateFormatter(order.date, order.time)}</Text>}
                                            {order.status === 5 && <Text style={styles.cancelledOrder}>• Cancelled by user</Text>}
                                            {order.status === 6 && <Text style={styles.rejectedOrder}>• Order rejected</Text>}
                                        
                                        </TouchableOpacity>
                                    )
                                } )}
                            </ScrollView>
                }
            </View>

        </View>
    )
}

export default OrdersScreen

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: Colors.BACKGROUND_GREY,
    },
    currentPastButtonContainer: {
        paddingHorizontal: 30,
        paddingVertical: 15,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 10,
        backgroundColor: Colors.WHITE,
        flex: 1,
        shadowColor: Colors.BLACK,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,

    },
    currentPastButton: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 15,
        borderWidth: 0.5
    },
    currentPastButtonText: {
        fontWeight: 'bold',
        fontSize: 15
    },
    currentOrderItemContainer:{
        padding:10,
        backgroundColor: Colors.WHITE,
        marginHorizontal:10,
        marginBottom:10,
        borderRadius:15,
        borderColor: Colors.LIGHTER_GREY,
        borderWidth:0.5
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
        fontSize: 15,
        color: Colors.WHITE
    },
    completedOrder:{
        fontWeight:'bold',
        color: Colors.GREEN,
        fontSize: 16
    },
    cancelledOrder:{
        fontWeight:'bold',
        color: Colors.ERROR_RED,
        fontSize: 16
    },
    rejectedOrder:{
        fontWeight:'bold',
        color: Colors.ERROR_RED,
        fontSize: 16
    }
})