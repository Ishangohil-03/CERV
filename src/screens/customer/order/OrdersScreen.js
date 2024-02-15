import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, Image, StatusBar, TextInput, Modal, Dimensions } from 'react-native';
import { useSelector } from 'react-redux';
import Toast from 'react-native-simple-toast';
import { Rating } from 'react-native-ratings';
import RBSheet from 'react-native-raw-bottom-sheet';

import { Colors } from '../../../CommonConfig';
import { getPostLogin, postPostLogin } from '../../../helpers/ApiHelpers';

const OrdersScreen = props => {

    const [loading, setLoading] = useState(true)
    const [state, setState] = useState('1');
    const [orders, setOrders] = useState([])
    const [length, setLength] = useState(0)

    const reviewModal = useRef(null)
    const [ reviewOrder, setReviewOrder ] = useState({});
    const [ rating, setRating ] = useState(0)
    const [ feedback, setFeedback ] = useState('')
    const [ orderToDelete, setOrderToDelete ] = useState({})
    const [ showDeleteModal, setShowDeleteModal ] = useState(false)

    //Current = 1
    //Past = 2

    useEffect(() => {
        getOrders()
    }, [state, loading])

    const getOrders = async () => {
        const response = await getPostLogin(`/getOrders/${state}`)
        // console.log(`\n\n${state}          \n`,response);
        if (response.success) {
            setLength(response.data.length)
            setOrders(response.data.orders)
            setLoading(false)
        } else {
            console.log(response);
            setLoading(false)
        }
    }

    const cancelOrder = async () => {
        setLoading(true)
        const data = {
            orderId: orderToDelete.id
        }
        const response = await postPostLogin('/cancelOrder', data)
        console.log(response);
        if (response.success) {
            Toast.show('Order cancelled successfully')
            getOrders()
            setShowDeleteModal(false)
        } else {
            Toast.show('Something went wrong!')
            getOrders()
            setShowDeleteModal(false)        }
    }

    const feedbackHandler = async() => {
        setLoading(true)
        reviewModal.current.close()
        // console.log(reviewOrder)
        const params = {
            catererId: reviewOrder.caterer.id,
            rating: rating,
            review: feedback,
            orderId: reviewOrder.id
        }
        const feedbackResponse = await postPostLogin('/post-review', params)
        if(feedbackResponse.success){
            Toast.show(feedbackResponse.data.message)
        } else {
            Toast.show(feedbackResponse.data.message)
        }
    }

    const statusText = (status) => {
        switch (status) {
            case 5:
                return "Cancelled by user"
            case 6:
                return "Rejected by user"
            case 4:
                return "Order Completed"
            default:
                return 'Old Order'
        }
    }

    // useEffect(() => {
    //     console.log(`\n\n${state}        \n`,orders);
    // },[orders])

    // useEffect(() => {
    //     console.log("\n\nPast Orders:         ",pastOrders);
    // },[pastOrders])


    return (
        <View style={styles.screen} >

            <Modal
                visible={showDeleteModal}
                animationType={'fade'}
                transparent={true}
            >
                <View style={{flex:1, justifyContent:'center', alignItems:'center', backgroundColor: 'rgba(0,0,0,0.5)'}}>
                    <StatusBar backgroundColor={'rgba(0,0,0,0.5)'}/>
                    <View style={styles.modal}>
                        <View style={{paddingVertical:50}}>
                            <Text style={styles.text}>Are you sure you want to delete this item ?</Text>
                        </View>
                        <View style={styles.btnContainer}>
                            <TouchableOpacity activeOpacity={0.4} style={[styles.modalBtn,{ borderRightColor: Colors.GREY, borderRightWidth:0.25 }]} onPress={() => {setShowDeleteModal(false)}}>
                                <Text style={[styles.labelModal,{color: Colors.GREY}]}>CANCEL</Text>
                            </TouchableOpacity >
                            <TouchableOpacity activeOpacity={0.4} style={[styles.modalBtn,{ borderLeftColor: Colors.GREY, borderLeftWidth:0.25 }]} onPress={cancelOrder}>
                                <Text style={[styles.labelModal,{color: Colors.ORANGE}]}>OKAY</Text>
                            </TouchableOpacity >
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Current / Past Button */}
            <View style={styles.currentPastButtonContainer}>
                <TouchableOpacity onPress={() => { setState('1'), setLoading(true) }} style={{ ...styles.currentPastButton, borderTopLeftRadius: 5, borderBottomLeftRadius: 5, backgroundColor: state === '1' ? Colors.ORANGE : Colors.WHITE, borderColor: state === '1' ? Colors.ORANGE : Colors.LIGHTER_GREY }}>
                    <Text style={{ ...styles.currentPastButtonText, color: state === '1' ? Colors.WHITE : Colors.LIGHTER_GREY }}>Current Orders</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => { setState('2'), setLoading(true) }} style={{ ...styles.currentPastButton, borderTopRightRadius: 5, borderBottomRightRadius: 5, backgroundColor: state === '2' ? Colors.ORANGE : Colors.WHITE, borderColor: state === '2' ? Colors.ORANGE : Colors.LIGHTER_GREY }}>
                    <Text style={{ ...styles.currentPastButtonText, color: state === '2' ? Colors.WHITE : Colors.LIGHTER_GREY }}>Past Orders</Text>
                </TouchableOpacity>
            </View>

            <View style={{ flex: 10, padding: 10 }}>
                {loading ?
                    (
                        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                            <ActivityIndicator size={65} color={Colors.ORANGE} />
                        </View>
                    )
                    :
                    length === 0 ?
                        (
                            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                                <Text style={{fontSize:22, color: Colors.GREY, fontWeight:"bold"}}>NO ORDERS!</Text>
                            </View>
                        )
                        :
                        state === '1' ?
                            (
                                //Current Orders
                                <ScrollView showsVerticalScrollIndicator={false}>
                                    {orders.map(order => {
                                        // console.log(order);
                                        // console.log(order.orderItems[0]);
                                        return (
                                            <TouchableOpacity onPress={() => { props.navigation.navigate('OrderDetail', { orderObj: order }) }} key={order.id} style={{ padding: 10, marginVertical: 5, backgroundColor: Colors.WHITE, borderRadius: 10, borderColor: Colors.GREY, borderWidth: 0.5 }}>
                                                {/* Caterer Info */}
                                                <View style={{ flexDirection: 'row', borderBottomColor: Colors.GREY, borderBottomWidth: 0.5, paddingVertical: 10 }}>
                                                    <Image source={{ uri: order.caterer.image }} style={{ flex: 1, aspectRatio: 1 }} />
                                                    <View style={{ flex: 5, marginLeft: 10, justifyContent: 'space-evenly' }}>
                                                        <Text style={{ fontWeight: 'bold', fontSize: 18 }}>{order.caterer.store.name}</Text>
                                                        <Text>{order.caterer.store.address}</Text>
                                                    </View>
                                                </View>

                                                {/* Cart Items Details */}
                                                <View style={{ borderBottomColor: Colors.GREY, borderBottomWidth: 0.5, paddingVertical: 10 }}>
                                                    {order.orderItems.map(item => {
                                                        return (
                                                            <View key={item.id} style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                                                <Text style={{ flex: 5, fontWeight: 'bold' }}>{item.item.title}</Text>
                                                                <Text style={{ flex: 1 }}>$ {item.itemTotal.toFixed(2)}</Text>
                                                            </View>
                                                        )
                                                    })}
                                                </View>

                                                {/* Other Details */}
                                                <View style={{ paddingBottom: 10 }}>
                                                    <Text style={styles.label}>ORDER TYPE</Text>
                                                    <Text style={styles.detail}>{order.order_type}</Text>

                                                    <Text style={styles.label}>ORDER PLACED ON</Text>
                                                    <Text style={styles.detail}>{moment(order.createdAt).format('DD MMM YYYY')} at {moment(order.createdAt).format('hh:mm A')}</Text>

                                                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                                        <View>
                                                            <Text style={styles.label}>AMOUNT</Text>
                                                            <Text style={styles.detail}>$ {order.amount.toFixed(2)}</Text>
                                                        </View>
                                                        {order.status < 2 ?
                                                            <TouchableOpacity onPress={() => { 
                                                                setOrderToDelete(order)
                                                                // cancelOrder(order.id) 
                                                                setShowDeleteModal(true)
                                                            }} style={{ backgroundColor: Colors.ERROR_RED, paddingHorizontal: 20, paddingVertical: 10, alignItems: 'center', justifyContent: 'center' }}>
                                                                <Text style={{ fontWeight: 'bold', color: Colors.WHITE }}>Cancel Order</Text>
                                                            </TouchableOpacity>
                                                            :
                                                            <Text style={{ color: Colors.GREEN }}>• In Progress</Text>
                                                        }
                                                    </View>
                                                </View>

                                            </TouchableOpacity>
                                        )
                                    })}
                                </ScrollView>
                            )
                            :
                            (
                                //Past Orders
                                <ScrollView>
                                    {orders.map(order => {
                                        // console.log("\n\n",order)
                                        return (
                                            <View key={order.id} style={{ padding: 10, marginVertical: 5, backgroundColor: Colors.WHITE, borderRadius: 10, borderColor: Colors.GREY, borderWidth: 0.5 }}>

                                                {/* Caterer Info */}
                                                <View style={{ flexDirection: 'row', borderBottomColor: Colors.GREY, borderBottomWidth: 0.5, paddingVertical: 10 }}>
                                                    <Image source={{ uri: order.caterer.image }} style={{ flex: 1, aspectRatio: 1 }} />
                                                    <View style={{ flex: 5, marginLeft: 10, justifyContent: 'space-evenly' }}>
                                                        <Text style={{ fontWeight: 'bold', fontSize: 18 }}>{order.caterer.store.name}</Text>
                                                        <Text>{order.caterer.store.address}</Text>
                                                    </View>
                                                </View>

                                                {/* Cart Items Details */}
                                                <View style={{ borderBottomColor: Colors.GREY, borderBottomWidth: 0.5, paddingVertical: 10 }}>
                                                    {order.orderItems.map(item => {
                                                        return (
                                                            <View key={item.id} style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                                                <Text style={{ flex: 5, fontWeight: 'bold' }}>{item.item.title}</Text>
                                                                <Text style={{ flex: 1 }}>$ {item.item.price.toFixed(2)}</Text>
                                                            </View>
                                                        )
                                                    })}
                                                </View>

                                                {/* Other Details */}
                                                <View style={{ paddingBottom: 10, borderBottomWidth: 0.5, borderBottomColor: Colors.GREY }}>
                                                    <Text style={styles.label}>ORDER PLACED ON</Text>
                                                    <Text style={styles.detail}>{moment(order.createdAt).format('DD MMM YYYY')} at {moment(order.createdAt).format('hh:mm A')}</Text>

                                                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                                        <View>
                                                            <Text style={styles.label}>AMOUNT</Text>
                                                            <Text style={styles.detail}>$ {order.netAmount.toFixed(2)}</Text>
                                                        </View>
                                                    </View>

                                                    <Text style={{ color: order.status === 4 ? Colors.GREEN : Colors.ERROR_RED, fontWeight: 'bold', marginTop: 10 }}>{statusText(order.status)}</Text>
                                                </View>

                                                {order.status === 4 ?
                                                    <View style={{ paddingTop: 10, alignItems: 'flex-end' }}>
                                                        {!order.is_reviewed ?
                                                            <TouchableOpacity onPress={() => { 
                                                                    setReviewOrder(order)
                                                                    setFeedback('')
                                                                    reviewModal.current.open() 
                                                                }}>
                                                                <Text style={{ color: 'blue', fontWeight: 'bold', letterSpacing: -0.5, fontSize: 16 }}>Write a Review</Text>
                                                            </TouchableOpacity>
                                                            :
                                                            <Text>Order Reviewed!</Text>
                                                        }
                                                    </View>
                                                    :
                                                    null
                                                }

                                            </View>
                                        )
                                    })}
                                </ScrollView>
                            )
                }
            </View>
            <RBSheet
                ref={reviewModal}
                closeOnDragDown={false}
                closeOnPressMask={false}
                closeOnPressBack={false}
                dragFromTopOnly
                animationType='fade'
                customStyles={{
                wrapper: {
                    backgroundColor: "rgba(0,0,0,0.5)"
                },
                container:{
                    flex:1,
                    paddingHorizontal:20,
                    backgroundColor: Colors.WHITE,
                    borderTopRightRadius:30,
                    borderTopLeftRadius:30,
                }
                }}
            >
                <StatusBar backgroundColor='rgba(0,0,0,0.5)' />
                <View style={{flex:1, justifyContent:'space-between', paddingVertical:10}}>
                <View style={{alignItems:'center', borderBottomColor:Colors.GREY, borderBottomWidth:0.5, flex:0.8}} >
                    <Text>Give Feedback</Text>
                    <Text>Write your feedback to Caterer</Text>
                    <Rating 
                        minValue={1}
                        imageSize={25}
                        startingValue={0}
                        onFinishRating={(e) => {setRating(e)}}
                    />
                    <TextInput 
                        autoCapitalize='none'
                        style={{borderWidth:0.5, borderColor: Colors.GREY, flex:1, width:'100%', marginVertical:10, padding:10}}
                        onChangeText={c => setFeedback(c)}
                        placeholder='Enter your feedback'
                        value={feedback}
                        multiline
                        textAlignVertical='top'
                    />
                </View>

                <View style={{flexDirection:'row', alignItems:'center', justifyContent:'space-evenly', flex:0.2}}>
                    <TouchableOpacity 
                        style={{flex:1, justifyContent:'center', alignItems:'center', borderRightColor: Colors.GREY, borderRightWidth:0.25}}
                        onPress={() => {
                            setReviewOrder({})
                            reviewModal.current.close()
                        }}>
                        <Text style={[styles.reviewModalButtons,{color:Colors.GREY}]}>CANCEL</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={{flex:1, alignItems:'center', justifyContent:'center', borderLeftColor: Colors.GREY, borderLeftWidth:0.25}}
                        onPress={feedbackHandler}
                        >
                        <Text style={[styles.reviewModalButtons,{color:Colors.ORANGE}]}>SEND REVIEW</Text>
                    </TouchableOpacity>
                </View>
                </View>
            </RBSheet>
        </View>
    );
};

export default OrdersScreen;

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: Colors.BACKGROUND_GREY
    },
    currentPastButtonContainer: {
        paddingHorizontal: 30,
        paddingVertical: 15,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
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
    label: {
        fontWeight: '700',
        color: Colors.GREY,
        marginTop: 10
    },
    reviewModalButtons:{
        fontWeight:'bold',
        fontSize:18
    },
    modal:{
        backgroundColor: Colors.WHITE,
        width: Dimensions.get('screen').width*0.8,
        borderRadius: 10,
        paddingTop:10,
        paddingHorizontal:10,
        alignItems:'center'
    },
    labelModal:{
        fontWeight:'bold',
        fontSize: 18
    },
    text:{
        fontSize: 24,
        textAlign:'center',
    },
    btnContainer:{
        flexDirection:'row', 
        alignItems:'center',
        borderTopColor: Colors.GREY,
        borderTopWidth: 0.5,
        width:'100%',
        paddingVertical:20
    },
    modalBtn:{
        flex:1,
        alignItems:'center',
        justifyContent:'center'
    }
});
