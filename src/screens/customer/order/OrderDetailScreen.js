import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { useSelector } from 'react-redux'
import StepIndicator from 'react-native-step-indicator'
import Ionicon from 'react-native-vector-icons/Ionicons';

import Caterer from '../../../model/caterer'
import { Colors, Images } from '../../../CommonConfig'
import moment from 'moment';
import { postPostLogin } from '../../../helpers/ApiHelpers';
import SimpleToast from 'react-native-simple-toast';

const OrderDetailScreen = props => {

    const selectedOrder = props.route.params.orderObj
    // console.log(selectedOrder);

    const dateTime = selectedOrder.date + " " + selectedOrder.time
    // console.log(dateTime);

    //Progress Steps
    const stepIndicatorStyles = {
        stepIndicatorSize: 10,
        currentStepIndicatorSize: 20,
        currentStepStrokeWidth: 2,
        separatorUnFinishedColor: Colors.LIGHTER_GREY,
        separatorFinishedColor: Colors.ORANGE,
        labelSize: 15,
        labelColor: Colors.LIGHTER_GREY,
        stepIndicatorFinishedColor: Colors.ORANGE,
        stepIndicatorUnFinishedColor: Colors.LIGHTER_GREY,
        stepIndicatorCurrentColor: Colors.ORANGE,
        currentStepStrokeWidth: 0,
        currentStepLabelColor: Colors.ORANGE
    }

    const onPressChat = async() => {
        const data = {
            catererId: selectedOrder.caterer.id
        }

        const response = await postPostLogin('/chat/getChat', data)
        console.log(response.data.chat)
        if(response.success){
            props.navigation.navigate('ChatScreen',{ screen: 'Chat', initial: false, params: {chatObj: response.data.chat, title: response.data.chat.chat_name} })
        } else {
            SimpleToast.show('Something went wrong!')
        }
    }

    return (
        <View style={styles.screen}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={{ backgroundColor: Colors.WHITE, paddingTop: 10, paddingHorizontal: 10 }}>
                    {/* Progress Steps  */}
                    <StepIndicator
                        stepCount={5}
                        labels={['Order Placed', 'Order Accepted', 'Preparing Food', 'Dispatched for Delivery', 'Order Delivered']}
                        customStyles={stepIndicatorStyles}
                        renderStepIndicator={() => { return (<View />) }}
                        // currentPosition={3}
                        currentPosition={selectedOrder.status}
                    />

                    {/* Caterer */}
                    <View style={{ flexDirection: 'row', borderBottomColor: Colors.GREY, borderBottomWidth: 0.5, paddingVertical: 10, marginTop: 15 }}>
                        <Image source={{ uri: selectedOrder.caterer.image }} style={{ flex: 1, aspectRatio: 1 }} />
                        <View style={{ flex: 5, marginLeft: 10, justifyContent: 'space-evenly' }}>
                            <Text style={{ fontWeight: 'bold', fontSize: 18 }}>{selectedOrder.caterer.store.name}</Text>
                            <Text>{selectedOrder.caterer.store.address}</Text>
                        </View>
                    </View>

                    <View style={{ borderBottomColor: Colors.GREY, borderBottomWidth: 0.5, paddingVertical: 10 }}>
                        {selectedOrder.orderItems.map(dish => {
                            // console.log(dish)
                            return (
                                <View key={dish.id} style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <View style={{ flex: 4 }}>
                                        <Text style={{ fontWeight: 'bold', fontSize: 18, marginVertical: 5 }}>{dish.item.title}</Text>
                                        <Text style={{ color: Colors.GREY }}>{dish.quantity} dishes</Text>
                                    </View>
                                    <Text style={{ flex: 1, letterSpacing: -0.5 }}>$ {dish.itemTotal.toFixed(2)}</Text>
                                </View>
                            )
                        })}
                    </View>

                    <View style={{ borderBottomColor: Colors.GREY, borderBottomWidth: 0.5, paddingVertical: 10 }}>
                        <Text style={styles.label}>ORDER TYPE</Text>
                        <Text style={styles.detail}>{selectedOrder.order_type}</Text>

                        {selectedOrder.order_type === 'Delivery' ?
                            (
                                <View style={{ marginVertical: 10 }}>
                                    <Text style={{ fontWeight: 'bold', fontSize: 12, letterSpacing: -0.5, color: Colors.GREY }}>Delivery fee based on how far the customer location is</Text>
                                    <Text>*   Delivery charge $5.00</Text>
                                </View>
                            )
                            :
                            null
                        }

                        <Text style={styles.label}>ORDER PLACED ON</Text>
                        <Text style={styles.detail}>{moment(selectedOrder.createdAt).format('DD MMM YYYY')} at {moment(selectedOrder.createdAt).format('hh:mm A')}</Text>

                        <Text style={styles.label}>AMOUNT</Text>
                        <Text style={styles.detail}>$ {selectedOrder.amount.toFixed(2)}</Text>
                    </View>

                    <View style={{ borderBottomColor: Colors.GREY, borderBottomWidth: 0.5, paddingBottom: 10 }}>
                        <Text style={styles.label}>DELIVERY DATE AND TIME</Text>
                        <Text style={{ marginTop: 5, fontSize: 18, fontWeight: 'bold' }}>{moment(dateTime).format('DD MMM YYYY')}   at   {moment(dateTime).format('hh:mm A')}</Text>
                        {/* <Text>{moment(dateTime).format('hh:mm A')}</Text> */}
                    </View>

                    <View style={{ flexDirection: 'row', alignItems: 'center', borderBottomColor: Colors.GREY, borderBottomWidth: 0.5, justifyContent: 'space-between', paddingVertical: 10 }}>
                        <View style={{ flex: 4 }}>
                            <Text style={styles.label}>DELIVERY PERSON</Text>
                            <Text style={{ fontSize: 18, fontWeight: 'bold', marginTop: 10 }}>John Martyn</Text>
                        </View>
                        <TouchableOpacity onPress={onPressChat} style={{ flex: 1, paddingHorizontal: 10, paddingVertical: 10, backgroundColor: Colors.ORANGE, borderRadius: 5, alignItems: 'center', justifyContent: 'center' }}>
                            <Text style={{ fontWeight: 'bold', color: Colors.WHITE, fontSize: 17 }}>Chat</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={{ paddingVertical: 10 }}>
                        <Text style={{ ...styles.label, marginBottom: 10 }}>Bill Details</Text>
                        {selectedOrder.orderItems.map(dish => {
                            return (
                                <View key={dish.id} style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 5 }}>
                                    <Text style={{ flex: 4 }}>{dish.item.title} ( {dish.quantity} dishes )</Text>
                                    <Text style={{ flex: 1 }}>$ {dish.itemTotal.toFixed(2)}</Text>
                                </View>
                            )
                        })}

                        <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 5 }}>
                            <Text style={{ flex: 4 }}>Service Charge</Text>
                            <Text style={{ flex: 1 }}>$ 1.00</Text>
                        </View>

                        <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 5 }}>
                            <Text style={{ flex: 4 }}>Delivery Charge</Text>
                            <Text style={{ flex: 1 }}>$ {selectedOrder.order_type === 'Delivery' ? '5.00' : '0.00'}</Text>
                        </View>

                        <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 5, borderTopColor: Colors.GREY, borderTopWidth: 0.5, paddingVertical: 10 }}>
                            <Text style={{ flex: 4 }}>Promo Discount</Text>
                            <Text style={{ flex: 1, color: Colors.GREEN }}>- $ {selectedOrder.discount.toFixed(2)}</Text>
                        </View>

                        <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 5, borderTopColor: Colors.GREY, borderTopWidth: 0.5, paddingVertical: 10 }}>
                            <Text style={{ flex: 4 }}>Sub Total</Text>
                            <Text style={{ flex: 1 }}>$ {(selectedOrder.amount - 5.10).toFixed(2)}</Text>
                        </View>

                        <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 5, borderTopColor: Colors.GREY, borderTopWidth: 0.5, paddingVertical: 10 }}>
                            <Text style={{ flex: 4 }}>Tax</Text>
                            <Text style={{ flex: 1 }}>$ 5.10</Text>
                        </View>

                        <View style={{ flexDirection: 'row', alignItems: 'center', borderTopColor: Colors.GREY, borderTopWidth: 0.5, paddingVertical: 10 }}>
                            <Text style={{ flex: 4 }}>Total</Text>
                            <Text style={{ flex: 1 }}>$ {(selectedOrder.amount).toFixed(2)}</Text>
                        </View>
                    </View>

                </View>
                <Image source={Images.PAPER_TEAR} style={{ width: '100%', height:30, marginBottom: 50, transform: [{ rotate: '180deg' }] }} />

                {/* Address Bar */}
                <View style={{padding:10, backgroundColor: Colors.WHITE}}>
                    <View style={{flexDirection:'row', alignItems:'center', justifyContent:'space-between', paddingHorizontal:15}}>
                        <Text>Address</Text>
                        {selectedOrder.status < 2 ? 
                        <TouchableOpacity>
                            <Text style={{color: Colors.ORANGE, fontWeight:'bold', fontSize:18}}>CHANGE</Text>
                        </TouchableOpacity>
                        :
                        null    
                    }
                    </View>
                    <View style={{paddingHorizontal:15, alignItems:'center', flexDirection:'row', justifyContent:'flex-start'}}>
                        <View style={{padding:10, borderRadius:10, borderWidth:0.5, borderColor: Colors.GREY, marginVertical:10}}>
                            <Ionicon name={selectedOrder.address_icon} color={Colors.ORANGE} size={25}/>
                        </View>
                        <Text style={{fontSize:20, marginLeft:10,flex:0.75}} ellipsizeMode={'tail'} numberOfLines={2}>{selectedOrder.address}</Text>
                    </View>
                </View>
            </ScrollView>

            {/*  <ScrollView showsVerticalScrollIndicator={false}>
                {/* Order Details 
                <View style={styles.orderContainer}>
                
                    {/* Caterer Container
                    <View style={styles.catererContainer}>
                        <Image source={{uri: selectedCaterer.image}} style={styles.catererImage}/>
                        <View style={styles.catererTextContainer}>
                            <Text style={styles.catererName}>{selectedCaterer.name}</Text>
                            <Text style={styles.catererAddress}>{selectedCaterer.address}</Text>
                        </View>
                    </View>

                    {/* Items List 
                    <View style={styles.itemListContainer}>
                        {selectedOrder.items.map( item => {
                            return (
                                <View key={item.id} style={styles.itemContainer}>
                                    <View>
                                        <Text style={styles.itemName}>{item.name}</Text>
                                        <Text style={styles.itemQty}>{item.qty} Dishes</Text>
                                    </View>
                                    <Text style={styles.itemPrice}>$ {item.itemTotal}</Text>
                                </View>
                            )
                        } )}
                    </View>

                    {/* Other Details 
                    <View style={styles.otherDetailContainer}>
                        <Text style={styles.otherDetailLabel}>ORDER TYPE</Text>
                        <Text style={styles.otherDetailText}>{selectedOrder.orderType}</Text>

                        {selectedOrder.orderType === 'Delivery' ? (
                            <View style={{marginVertical:10}}>
                                <Text style={{...styles.otherDetailLabel, fontSize:12}}>Delivery Fee based on how far the customer location is</Text>
                                <Text style={{...styles.otherDetailText, marginBottom:5}}>*   5Km distance charge $2.50</Text>
                                <Text style={styles.otherDetailText}>*   10Km distance charge $5.00</Text>
                            </View>
                        ) : null}

                        <Text style={styles.otherDetailLabel}>ORDER PLACED ON</Text>
                        {/* <Text style={styles.otherDetailText}>{orderDate} at {orderTime}</Text> 

                        <Text style={styles.otherDetailLabel}>AMOUNT</Text>
                        <Text style={styles.otherDetailText}>$ {selectedOrder.totalAmount.toFixed(2)}</Text>
                    </View>

                    {/* Delivery Date & Time 
                    <View style={styles.deliveryDetailContainer}>
                        <Text style={styles.deliveryLabel}>Delivery Date and Time</Text>
                        <Text style={styles.deliveryText}>{selectedOrder.deliveryDate} at {selectedOrder.deliveryTime}</Text>
                    </View>

                    {/* Delivery Person 
                    <View style={styles.deliveryPersonContainer}>
                        <View>
                            <Text style={styles.deliveryLabel}>Delivery Person</Text>
                            <Text style={styles.deliveryText}>John Martyn</Text>
                        </View>
                        <TouchableOpacity style={styles.chatButton}>
                            <Text style={styles.chatText}>Chat</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Bill Details 
                    <View style={{borderBottomColor: Colors.LIGHTER_GREY, borderBottomWidth:0.5, paddingVertical:10}}>
                        <Text style={{...styles.otherDetailLabel, marginBottom:10}}>Bill Details</Text>
                        { selectedOrder.items.map( item => {
                            return(
                                <View key={item.id}>
                                    <View style={styles.billDetailRow}>
                                        <Text style={{flex:3}}>{item.name} ({item.qty} Dishes)</Text>
                                        <Text style={{flex:0.5}}>$ {item.itemTotal.toFixed(2)}</Text>
                                    </View>
                                </View>
                            )
                        } ) }

                        <View style={styles.billDetailRow}>
                            <Text style={{flex:3}}>Service Charge</Text>
                            <Text style={{flex:0.5}}>$ 1.00</Text>
                        </View>

                        <View style={styles.billDetailRow}>
                            <Text style={{flex:3}}>Delivery Fee</Text>
                            <Text style={{flex:0.5}}>{selectedOrder.orderType === 'Delivery' ? '$ 2.50' : '$ 0.00' }</Text>
                        </View>
                    </View>

                    <View style={{...styles.billDetailRow, borderBottomColor: Colors.LIGHTER_GREY, borderBottomWidth:0.5, paddingVertical:10}}>
                        <Text style={{flex:3}}>Promo Discount</Text>
                        <Text style={{flex:0.5}}>-$ {selectedOrder.discountAmount.toFixed(2)}</Text>
                    </View>

                    <View style={{...styles.billDetailRow, borderBottomColor: Colors.LIGHTER_GREY, borderBottomWidth:0.5, paddingVertical:10}}>
                        <Text style={{flex:3}}>Sub Total</Text>
                        <Text style={{flex:0.5}}>$ {(selectedOrder.totalAmount.toFixed(2) - 5.10 ).toFixed(2)}</Text>
                    </View>

                    <View style={{...styles.billDetailRow, borderBottomColor: Colors.LIGHTER_GREY, borderBottomWidth:0.5, paddingVertical:10}}>
                        <Text style={{flex:3}}>Tax</Text>
                        <Text style={{flex:0.5}}>$ 5.10</Text>
                    </View>

                    <View style={{...styles.billDetailRow, paddingVertical:10}}>
                        <Text style={{flex:3, fontWeight:'bold', fontSize:20}}>Total</Text>
                        <Text style={{flex:0.7, fontWeight:'bold', fontSize:20}}>$ {selectedOrder.totalAmount.toFixed(2)}</Text>
                    </View>
                </View>
                

                {/* Address Bar 
                <View style={styles.addressContainer}>
                    <View style={{flexDirection:'row', justifyContent:'space-between', alignItems:'center', paddingHorizontal:10}}> 
                        <Text style={styles.addressLabel}>ADDRESS</Text>
                        <TouchableOpacity><Text style={styles.change}>CHANGE</Text></TouchableOpacity>
                    </View>
                    <View style={{flexDirection:'row', alignItems:'center', flex:1, paddingHorizontal:15, marginTop:5}}>
                        <View style={styles.iconContainer}>
                            <Ionicon name={selectedOrder.address.icon} size={30} color={Colors.ORANGE}/>
                        </View>
                        <Text style={styles.address}>{selectedOrder.address.address}</Text>
                    </View>
                </View>
            </ScrollView> */}
        </View>
    )
}

export default OrderDetailScreen

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: Colors.BACKGROUND_GREY,
    },
    label: {
        fontWeight: '700',
        color: Colors.GREY,
        marginTop: 10
    },
    detail: {
        marginTop: 5
    },
})