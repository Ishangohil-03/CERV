import { Text, View, StyleSheet, Image, ScrollView, TextInput, Dimensions,TouchableOpacity, Alert } from 'react-native';
import React,{ useEffect, useRef, useState } from 'react';
import Ionicon from 'react-native-vector-icons/Ionicons';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import RBSheet from 'react-native-raw-bottom-sheet';
import { StripeProvider, useStripe } from '@stripe/stripe-react-native'

import * as orderActions from '../../../store/actions/order';
import * as cartActions from '../../../store/actions/cart';
import { Colors, Images } from '../../../CommonConfig';
import PaymentOption from '../../../components/PaymentOption';
import CreditCardDisplay from '../../../components/CreditCardDisplay';
import { postPostLogin } from '../../../helpers/ApiHelpers';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ActivityIndicator } from 'react-native';
import SimpleToast from 'react-native-simple-toast';

const OrderReceiptScreen = props => {

    const dispatch = useDispatch()

    const { initPaymentSheet, presentPaymentSheet, retrievePaymentIntent } = useStripe()

    const [ selectedAddress, setSelectedAddress ] = useState({})
    const [ selectedCard, setSelectedCard ] = useState({})
    const [ loading, setLoading ] = useState(true)

    useEffect( () => {
        const refresh = props.navigation.addListener('focus', () => {
            setLoading(true)
            getAddress()
            getPaymentMethod()
            setLoading(false)
        });

        return refresh

    }, [ props.navigation ] ) 

    const getAddress = async() => {
        setSelectedAddress( JSON.parse(await AsyncStorage.getItem('activeAddress')))
        // console.log("getting address\n",selectedAddress)
    }

    const getPaymentMethod = async() => {
        setSelectedCard( JSON.parse(await AsyncStorage.getItem('activeCard')))
    }

    const cartItems = useSelector( state => {
        const updatedCartItems = [];
        for ( const key in state.Cart.items ) {
            updatedCartItems.push({
                ...state.Cart.items[key]
            });
        }
        return updatedCartItems.sort( (a,b) => a.id > b.id ? 1 : -1);
    })

    const deliveryDateTime = useSelector( state => state.Order.deliveryDateTime )

    const orderType = useSelector( state => state.Cart.orderType )
    const deliveryFee = orderType === 'Delivery' ? 5 : 0
    const serviceCharge = 1.00
    const subTotal = (cartItems.length ? cartItems.reduce( (a,c) => a + c.qty*c.price, serviceCharge ) : 0) + deliveryFee ;
    const discountApplied = useSelector(state => (state.Cart.discount ? state.Cart.discount : null ))
    
    const applyDiscount = (discountObj) => {
        if(!discountObj) return 0;
        const isPercent = discountObj.is_percent
        if(isPercent) {
            return subTotal * (discountObj.value/100)
        } else {
            return discountObj.value
        }
    }
    let discountAmount = applyDiscount(discountApplied ? discountApplied : null );

    if ( discountAmount > subTotal ) {
        dispatch(cartActions.removeDiscount())
    }
    // switch(discountApplied){
    //     case 'PAYZP234':
    //         discountAmount = subTotal * 0.4;
    //         break;
    //     case '60GUJFOOD':
    //         discountAmount = 25;
    //         break;
    //     case '15OFF':
    //         discountAmount = 15;
    //         break;
    //     case 'OLA25OFF':
    //         discountAmount = subTotal * 0.25;
    //         break;
    //     case 'TK10OFF':
    //         discountAmount = subTotal * 0.10;
    //         break;
    //     default:
    //         discountAmount = 0;
    // }
    const updatedSubTotal = subTotal - discountAmount
    const total = updatedSubTotal + 5.10;

    const catererId = useSelector(state => state.Cart.catererId)
    const refRBSheet = useRef();
    const [paymentLoader, setPaymentLoader] = useState(false)
    const [instructions, setInstructions] = useState('')

    const orderList = cartItems.map( item => { return {id: item.id, price: item.price, qty: item.qty} } )

    const placeOrderHandler = async() => {
        setPaymentLoader(true)
        const data = {
            totalAmount : total.toFixed(2),
            items: orderList,
            catererId : catererId,
            addressId : selectedAddress.id,
            discount: discountAmount,
            orderType : orderType,
            instructions: instructions,
            dateTime: deliveryDateTime
        }
        
        const response = await postPostLogin('/postOrder', data)
        // console.log(response);
        if(response.success){
            refRBSheet.current.open()
            setPaymentLoader(false)
        } else {
            SimpleToast.show('Something went wrong!')
            setPaymentLoader(false)
        }
    }

    const stripeHandler = async() => {
        

        const params = {
            card_id: selectedCard.id,
            amount: parseFloat(total.toFixed(2))
        }
        // console.log(params)

        setPaymentLoader(true)
        const getPaymentIntentResponse = await postPostLogin('/checkout', params)

        // console.log(getPaymentIntentResponse);

        const client_secret = getPaymentIntentResponse.data.data.client_secret

        // console.log(getPaymentIntentResponse.data)
        setPaymentLoader(false)

        const { error } = await initPaymentSheet({
            customerId: getPaymentIntentResponse.data.data.customerId,
            paymentIntentClientSecret: client_secret,
            customerEphemeralKeySecret: getPaymentIntentResponse.data.data.ephemeralKey,
            merchantDisplayName: 'CERV',
            testEnv: true,
            allowsDelayedPaymentMethods: true
            // customerId: "cus_M3snPrCRjEoj6o",
            // paymentIntentClientSecret: "pi_3LNbz7SJ7crToGEY1rVz4s3O_secret_j4pTsd0bfYNn5zurFhJmV4bCn",
            // customerEphemeralKeySecret: "ek_test_YWNjdF8xS1ltOUFTSjdjclRvR0VZLEpQdWVrZkRnR0g3dGFOV1laNzEyOFJVcDBZWkhUY20_00xAMfhz79",
            // merchantDisplayName: 'CERV',
            // testEnv: true,
            // allowsDelayedPaymentMethods: true
        })

        if(!error) {
            const presentResponse = await presentPaymentSheet({
                client_secret,
                // client_secret:"pi_3LNbz7SJ7crToGEY1rVz4s3O_secret_j4pTsd0bfYNn5zurFhJmV4bCn",
                confirmPayment: false
            }) 
            
            const { error, paymentIntent } = await retrievePaymentIntent(client_secret)
            // console.log(paymentIntent);
            if(error){
                console.log(error);
            } else if ( paymentIntent.status === 'Succeeded' ) {
                console.log("Payment Success!");
                placeOrderHandler()
            } else {
                console.log("Something went wrong during payment!");
            }
        }        
    }

    const rbButtonHandler = () => {
        props.navigation.popToTop()
        dispatch(cartActions.clearCart())
        refRBSheet.current.close()
        props.navigation.navigate('Order')
    }

    if(loading) {
        return( 
            <View style={styles.loader}>
                <ActivityIndicator size={65} color={Colors.ORANGE}/>
            </View>
        )
    }

    return (
        <StripeProvider
            publishableKey='pk_test_51KWJVESJATkWAz1BNwkKHuCnoZ9xLHlWwfucxpzQ8kjiCkWVbjj050t3wy2nupttqkzoppLzmoFg88NZSu2Ony6S00g1IwuVVg'
        >
            <View style={styles.screen}>
                <ScrollView>
                {/* Address */}
                <View style={styles.addressContainer}>
                    <View style={styles.addressTextAlign}>
                        <Text style={styles.label}>Address</Text>
                        <TouchableOpacity onPress={ () => { props.navigation.navigate('Profile', { screen: 'SavedAddresses', initial: false }) } } >
                            <Text style={{...styles.label, color: Colors.ORANGE}}>CHANGE</Text>
                        </TouchableOpacity>
                    </View>
                    { selectedAddress?.address ? <View style={styles.addressIconAlign}>
                        <View style={styles.iconContainer}>
                            <Ionicon name={selectedAddress?.icon}color={Colors.ORANGE} size={25}/>
                        </View>
                        <Text style={styles.addressText} numberOfLines={2}>{selectedAddress.address}</Text>
                    </View>
                    :
                    <View style={styles.backDropContainer} >
                        <Text style={{...styles.backDropText, fontSize:25}}>NO ADDRESS FOUND</Text>
                        <Text style={{...styles.backDropText, fontSize:15}}>Add some addresses now!</Text>
                    </View>
                    }
                </View>

                <View style={styles.billDetailsContainer} >
                        <Text style={styles.label}>Bill Details</Text>
                        { cartItems.map( item => {
                            return(
                                <View key={item.id} style={styles.itemContainer}> 
                                    <View style={styles.textButtonContainer}>
                                        <Text style={{flex:2}}>{item.title}</Text>
                                        <View style={styles.addRemoveContainer}>
                                            <TouchableOpacity onPress={() =>{ dispatch(cartActions.removeFromCart(item)) }} ><Ionicon name="remove-outline" size={20} color={ Colors.ERROR_RED }/></TouchableOpacity>
                                            <Text>{item.qty}</Text>
                                            <TouchableOpacity onPress={() =>{ dispatch(cartActions.addToCart(item)) }}><Ionicon name="add-outline" size={20} color={ Colors.GREEN }/></TouchableOpacity>
                                        </View>
                                    </View>
                                    <View style={{flex:1}}>
                                        <Text>$ {item.itemTotal.toFixed(2)}</Text>
                                    </View>
                                </View>
                            )
                        } ) }

                        { cartItems.length !== 0 ?
                        <View>
                            <View style={styles.serviceChargeContainer}>
                                <Text style={styles.transactionTitle}>Service Charges</Text>
                                <Text style={{flex:1}}>$ 1.00</Text>
                            </View>
                            <View style={styles.deliveryFee}>
                                <Text style={styles.transactionTitle}>Delivery Fee</Text>
                                <Text style={{flex:1}}>$ {deliveryFee.toFixed(2)}</Text>
                            </View>


                            {discountApplied ? 
                            <View style={styles.deliveryFee}>
                                <Text style={styles.discountTitle}>Code <Text style={{fontWeight:'bold'}}>{discountApplied.code}</Text> applied</Text>
                                <View style={{flex:1}}>
                                    <Text style={styles.discountAmount}>- ${discountAmount.toFixed(2)}</Text>
                                    <TouchableOpacity onPress={ () => { dispatch(cartActions.removeDiscount()) }}><Text style={styles.remove}>Remove</Text></TouchableOpacity>
                                </View>
                            </View>   
                            :
                            <TouchableOpacity style={styles.couponCodeContainer} onPress={ () => { props.navigation.navigate('Discount', {catererId}) } } >
                                <Text style={{flex:3,fontWeight:'bold'}}>Apply Coupon Code</Text>
                                <Text style={{...styles.label, color: Colors.ORANGE, flex:1}}>CHECK</Text>
                            </TouchableOpacity>}


                            <View style={styles.subTotal}>
                                <Text style={styles.transactionTitle}>Sub Total</Text>
                                <Text style={{flex:1}}>$ {updatedSubTotal.toFixed(2)}</Text>
                            </View>
                            <View style={styles.tax}>
                                <Text style={styles.transactionTitle}>Tax</Text>
                                <Text style={{flex:1}}>$ 5.10</Text>
                            </View>
                            <View style={styles.total}>
                                <Text style={styles.totalTitle}>Total</Text>
                                <Text style={{flex:1, fontWeight:'bold', fontSize:18}}>$ {total.toFixed(2)}</Text>
                            </View> 
                        </View>
                        :
                        <View style={styles.backDropContainer}>
                            <Text style={{...styles.backDropText, fontSize:25}}>CART EMPTY</Text>
                            <Text style={{...styles.backDropText, fontSize:15}}>Add some dishes now!</Text>
                        </View>}

                    </View>
                    <Image source={Images.PAPER_TEAR} style={{width:'100%', marginBottom:25, height:25, transform:[{rotate:'180deg'}]}}/>
                    
                    <View style={styles.footer}>
                    <View style={styles.addressTextAlign}>
                        <Text style={styles.label}>Payment with</Text>
                        <TouchableOpacity onPress={ () => { props.navigation.navigate('Profile', { screen: 'SavedCards' }) } } >
                            <Text style={{...styles.label, color: Colors.ORANGE}}>CHANGE</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={{paddingVertical:10}}>
                        {selectedCard ? 
                            <View style={styles.cardItemContainer}>
                                <View style={{ flex: 10, alignItems: 'center', flexDirection: 'row' }}>
                                    <Image source={Images.CREDIT_CARD} style={{ height: 80, width: 80 }} />
                                    <View style={{ marginHorizontal: 20 }}>
                                        <Text style={styles.cardNumber}>**** **** **** {selectedCard.last4}</Text>
                                        <Text style={styles.expiry}>Expires {selectedCard.exp_month} / {selectedCard.exp_year}</Text>
                                    </View>
                                </View>
                            </View>
                            :
                            <View style={styles.backDropContainer} >
                                <Text style={{...styles.backDropText, fontSize:25}}>No Active Payment Found</Text>
                                <Text style={{...styles.backDropText, fontSize:15}}>Add some now!</Text>
                            </View>
                        }
                    </View>

                    <View>
                        <Text style={styles.label}>Add Special Instructions</Text>
                        <View style={styles.noteContainer}>
                            <TextInput 
                                placeholder='Add text here...'
                                multiline
                                onChangeText={ text => setInstructions(text) }
                            />
                        </View>
                    </View>
                    <TouchableOpacity style={styles.makePayment} onPress={ stripeHandler } activeOpacity={0.7} disabled={((cartItems.length===0) || (!selectedCard ) || (!selectedAddress) || paymentLoader )? true : false}>
                        { paymentLoader ? 
                            <ActivityIndicator color={Colors.WHITE} size={'small'}/>
                            :
                            <Text style={{...styles.label, color: Colors.WHITE}}>{selectedCard ? "Confirm Order" : "Make Payment"}</Text>
                        }
                    </TouchableOpacity>

                    

                </View>

                <RBSheet
                    ref={refRBSheet}
                    closeOnDragDown={false}
                    closeOnPressMask={false}
                    closeOnPressBack={false}
                    dragFromTopOnly
                    customStyles={{
                    wrapper: {
                        backgroundColor: "rgba(0,0,0,0.5)"
                    },
                    container:{
                        height:'auto',
                        paddingHorizontal:20,
                        backgroundColor: Colors.WHITE,
                        borderTopRightRadius:30,
                        borderTopLeftRadius:30,
                    }
                    }}
                >
                    <View style={{justifyContent:'space-between'}}>
                        <View style={styles.rbView}>
                            <Image source={Images.ORDER_SUCCESSFUL} style={styles.rbImage}/>
                            <Text style={styles.rbText}>Your order was placed successfully!</Text>
                        </View>
                        <View style={styles.rbLine} />
                        <TouchableOpacity style={styles.rbButton} onPress={ rbButtonHandler } >
                            <Text style={styles.rbOk}>OK</Text>
                        </TouchableOpacity>
                    </View>
                </RBSheet>
                </ScrollView>
            </View>
        </StripeProvider>
    )

}

const styles = StyleSheet.create({
    loader:{
        flex:1,
        alignItems:'center',
        justifyContent:'center'
    },
    screen:{
        flex:1,
        // backgroundColor: Colors.BACKGROUND_GREY
    },
    backDropText:{
        color: Colors.LIGHTER_GREY
    },
    backDropContainer:{
        height:100, 
        alignItems:'center', 
        justifyContent:'center'
    },
    addressContainer:{
        paddingVertical:0, 
        paddingHorizontal: 15,
        borderBottomColor: Colors.LIGHTER_GREY, 
        borderBottomWidth:1, 
        backgroundColor: Colors.WHITE
    },
    addressTextAlign:{
        flexDirection:'row', 
        justifyContent:'space-between',
        alignItems:'center',
        marginTop: 10
    },
    iconContainer:{
        borderColor: Colors.LIGHTER_GREY, 
        borderWidth:1, 
        padding:10, 
        borderRadius:5, 
        marginRight:10
    },
    addressIconAlign:{
        flexDirection:'row', 
        marginVertical:10
    },
    addressText:{
        fontWeight:'900', 
        width: '70%', 
        fontSize:18,
        color: Colors.BLACK
    },
    label:{
        fontWeight:'bold', 
        fontSize: 18
    },
    rbView:{
        alignItems:'center',
        padding:20
    },
    rbImage:{
        height:Dimensions.get("window").width * 0.4, 
        width:Dimensions.get("window").width * 0.4, 
        marginVertical:10
    },
    rbText:{
        color: Colors.BLACK,
        fontWeight:'bold',
        fontSize:25,
        textAlign:'center'
    },
    rbLine:{
        height:0, 
        width:'100%', 
        borderColor: Colors.LIGHTER_GREY, 
        borderWidth:0.25, 
        marginVertical:10
    },
    rbButton:{
        alignItems:'center', 
        justifyContent:'center', 
        height:50, 
        marginBottom:15
    },
    rbOk:{
        fontSize:25,
        fontWeight:'bold', 
        color: Colors.ORANGE
    },
    
    totalTitle:{
        flex:3, 
        marginRight:10, 
        fontWeight:'bold', 
        fontSize:18
    },
    remove:{
        color: Colors.ERROR_RED
    },
    body:{
        flex:3
    },
    discountAmount:{
        color: Colors.DISCOUNT_BLUE
    },
    transactionTitle:{
        flex:3, 
        marginRight:10
    },
    discountTitle:{
        color: Colors.DISCOUNT_BLUE,
        flex:3
    },
    makePayment:{
        backgroundColor:Colors.ORANGE, 
        borderRadius:5, 
        justifyContent:'center', 
        alignItems:'center', 
        marginTop:15, 
        height:50
    },
    
    subTotal:{
        marginTop:15, 
        flexDirection:'row', 
        alignItems:'center', 
        borderTopColor: Colors.LIGHTER_GREY, 
        borderTopWidth:0.5, 
        padding:10
    },
    noteContainer:{
        padding:10, 
        borderColor: Colors.LIGHTER_GREY , 
        borderWidth:0.5, 
        borderRadius:5,
        marginTop:5,  
        height:75 
    },
    total:{
        flexDirection:'row', 
        alignItems:'center', 
        borderTopColor: Colors.LIGHTER_GREY, 
        borderTopWidth:0.5, 
        padding:10
    },
    tax:{
        flexDirection:'row', 
        alignItems:'center', 
        borderTopColor: Colors.LIGHTER_GREY, 
        borderTopWidth:0.5, 
        padding:10
    },
    serviceChargeContainer:{
        marginTop:10, 
        flexDirection:'row', 
        alignItems:'center'
    },
    deliveryFee:{
        marginTop:15, 
        flexDirection:'row', 
        alignItems:'center'
    },
    couponCodeContainer:{
        borderColor: Colors.LIGHTER_GREY, 
        borderWidth:1, 
        borderRadius:5, 
        alignItems:'center', 
        justifyContent:'space-between', 
        paddingHorizontal:15, 
        flexDirection:'row', 
        height:30, 
        marginTop:15
    },
    footer:{
        flex:1,
        borderTopColor: Colors.LIGHTER_GREY,
        borderTopWidth:0.5,
        backgroundColor:Colors.WHITE,
        padding:20,
        justifyContent:'flex-start'
    },
    billDetailsContainer:{ 
        backgroundColor: Colors.WHITE, 
        padding:20 
    },
    itemContainer:{
        marginTop:10, 
        flexDirection:'row'
    },
    textButtonContainer:{
        flex:3, 
        flexDirection:'row',
        marginRight:10
    },
    addRemoveContainer:{
        flex:0.75,
        flexDirection:'row', 
        alignItems:'center', 
        justifyContent:'space-between', 
        borderColor: Colors.GREY, 
        borderWidth:1, 
        borderRadius: 5
    },
    cardItemContainer: {
        height: 100,
        alignSelf: 'center',
        backgroundColor: Colors.WHITE,
        marginVertical: 5,
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.18,
        shadowRadius: 1.00,
        elevation: 1,
        overflow: 'hidden',
        paddingHorizontal: 10
    },
    cardNumber: {
        fontWeight: 'bold',
        fontSize: 18
    },
    expiry: {
        fontSize: 14,
        color: Colors.GREY
    },
});

export default OrderReceiptScreen;