import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, ActivityIndicator, Dimensions } from 'react-native';
import Ionicon from 'react-native-vector-icons/Ionicons';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { useDispatch, useSelector } from 'react-redux';
import RBSheet from 'react-native-raw-bottom-sheet';
import { Rating } from 'react-native-ratings';

import * as orderActions from '../../../store/actions/order';
import * as cartActions from '../../../store/actions/cart';
import Caterer from '../../../model/caterer';
import { Colors } from '../../../CommonConfig';
import { getWithParams } from '../../../helpers/ApiHelpers';
import moment from 'moment';

const windowWidth = Dimensions.get('window').width

const DetailScreen = props => {

    const catererId = props.route.params.catererId;
    const currentCaterer = props.route.params.caterer

    
    const dispatch = useDispatch();

    //Date Time Picker
    const initialDate = moment(new Date()).format('DD MMM YYYY')
    const initialTime = moment(new Date()).format('hh:mm A')
    const [showPicker, setShowPicker] = useState(false)
    const [ selectedDateTime, setSelectedDateTime ] = useState();
    const [x ,setX] = useState();

    const showDateTimePicker = () => {
        setShowPicker(true)
    }
    const hideDateTimePicker = () => {
        setShowPicker(false)
    }
    const handleConfirm = (dateTime) => {
        setX(moment(dateTime).format('YYYY-MM-DD HH:mm:ss'))
        //Send X to API
        // console.log(x);
        setSelectedDateTime(dateTime)
    }
    

    // Delivery Type Logic
    const [deliverySelected, setDeliverySelected] = useState(false);
    const [orderSelected, setOrderSelected] = useState(false);
    const [orderType, setOrderType] = useState();

    const deliverySelectHandler = () => {
        setDeliverySelected(true);
        setOrderSelected(false);
        setOrderType('Delivery');
        dispatch(cartActions.setOrderType('Delivery'));
    }

    const orderSelectHandler = () => {
        setOrderSelected(true);
        setDeliverySelected(false);
        setOrderType('PickUp');
        dispatch(cartActions.setOrderType('PickUp'));
    }

    const navigateHandler = () => {
        // dispatch(orderActions.setDate(selectedDate))
        // dispatch(orderActions.setTime(selectedTime))
        dispatch(orderActions.setDateTime(x))
        dispatch(cartActions.setTotal(total));
        props.navigation.navigate('OrderReceipt');
    }

    // Rendering Menu
    const [activeCategory, setActiveCategory] = useState(currentCaterer.caterer.categories[0] ? currentCaterer.caterer.categories[0] : {} )
    
    const dishes = activeCategory?.items


    //Diff Caterer Logic
    const refRBSheet = useRef();
    const cartCatererId = useSelector(state => state.Cart.catererId ? state.Cart.catererId : null)
    const openHandler = (dish, cid) => {
        if (cartCatererId === null) {
            dispatch(cartActions.setCaterer(cid))
            dispatch(cartActions.addToCart(dish))
        } else if (catererId !== cartCatererId) {
            refRBSheet.current.open()
        } else {
            dispatch(cartActions.addToCart(dish))
        }
    }

    const clearCartHandler = () => {
        dispatch(cartActions.clearCart());
        dispatch(cartActions.setCaterer(catererId));
        refRBSheet.current.close();
    }

    //Cart Logic
    const cartItems = useSelector(state => {
        const updatedCartItems = [];
        for (const key in state.Cart.items) {
            updatedCartItems.push({
                ...state.Cart.items[key]
            });
        }
        return updatedCartItems.sort((a, b) => a.id > b.id ? 1 : -1);
    })

    const order = useSelector(state => state.Cart.orderType)
    const deliveryFee = (order === 'Delivery') ? 5 : 0
    const serviceCharge = 1.00
    const subTotal = (cartItems.length ? cartItems.reduce((a, c) => a + c.qty * c.price, serviceCharge) : 0) + deliveryFee;
    const total = cartItems.length ? subTotal + 5.10 : 0;

    return (
        <View style={{ flex: 1, backgroundColor: Colors.WHITE }}>
            <View style={{ flex: 0.93 }}>
                <ScrollView>
                    {/* Caterer Details */}
                    <View style={styles.screen}>
                        <Image source={{ uri: currentCaterer.caterer.image }} style={styles.image} />
                        <Text style={styles.name}>{currentCaterer.name}</Text>
                        <Text style={styles.address}>{currentCaterer.address}</Text>
                        <View style={{ marginTop: 3, alignItems: 'flex-start' }} >
                            <Rating
                                ratingColor={Colors.STAR_YELLOW}
                                readonly
                                startingValue={currentCaterer.rating}
                                imageSize={20}
                            />
                        </View>
                    </View>

                    {/* Date & Time */}
                    <View style={styles.screen}>
                        <Text style={styles.label}>Date and Time</Text>
                        <View style={{ flexDirection: "row", alignItems: 'center', justifyContent: 'space-evenly', paddingVertical: 10 }}>
                            <View style={styles.dateTimeContainer}>
                                <TouchableOpacity style={styles.dateTimeTouchable} onPress={showDateTimePicker}>
                                    <Text>{ selectedDateTime ? moment(selectedDateTime).format('DD MMM YYYY')  : initialDate}</Text>
                                    <Ionicon name="calendar" size={30} color={Colors.ORANGE} />
                                </TouchableOpacity>
                            </View>
                            <View style={styles.dateTimeContainer}>
                                <TouchableOpacity style={styles.dateTimeTouchable} onPress={showDateTimePicker}>
                                    <Text>{ selectedDateTime ? moment(selectedDateTime).format('hh:mm A')  : initialTime}</Text>
                                    <Ionicon name="time" size={30} color={Colors.ORANGE} />
                                </TouchableOpacity>
                            </View>
                            <DateTimePickerModal
                                isVisible={showPicker}
                                mode='datetime'
                                onConfirm={handleConfirm}
                                onCancel={hideDateTimePicker}
                            />
                        </View>
                    </View>

                    {/* Category, Bio */}
                    <View style={styles.screen}>
                        <View style={styles.food_category}>
                            <Text style={styles.label}>Food Category</Text>
                            <Text style={styles.categoryBioText}>{currentCaterer.category} Food</Text>
                        </View>
                        <Text style={styles.label}>Bio</Text>
                        <Text style={styles.categoryBioText}>{currentCaterer.bio}</Text>
                    </View>

                    {/* Order Type */}
                    <View style={styles.orderTypeContainer}>
                        <Text style={styles.label} >Order Type</Text>

                        {/* Options */}
                        <View style={styles.optionContainer}>

                            {/* Delivery */}
                            <View style={styles.orderTypeLabelContainer}>
                                <TouchableOpacity onPress={deliverySelectHandler} >
                                    {deliverySelected ? <Ionicon name="radio-button-on-outline" size={25} color={Colors.ORANGE} /> : <Ionicon name="radio-button-off-outline" size={25} color={Colors.GREY} />}
                                </TouchableOpacity>
                                <Text style={styles.orderTypeLabel}>Delivery</Text>
                            </View>
                            {/* Pick Up */}
                            <View style={styles.orderTypeLabelContainer}>
                                <TouchableOpacity onPress={orderSelectHandler} >
                                    {orderSelected ? <Ionicon name="radio-button-on-outline" size={25} color={Colors.ORANGE} /> : <Ionicon name="radio-button-off-outline" size={25} color={Colors.GREY} />}
                                </TouchableOpacity>
                                <Text style={styles.orderTypeLabel}>Pick Up</Text>
                            </View>
                        </View>
                        {orderType ? null : <Text style={{ color: Colors.ERROR_RED, marginTop: 10 }} >Please select an order Type</Text>}
                    </View>

                    {/* Menu Module */}
                    <View style={styles.menu}>

                    { currentCaterer.caterer.categories.length !== 0  && dishes.length !== 0 ?  
                    <>
                        <Text style={styles.menuTitle}>Menu</Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{marginBottom:20}}>
                            {currentCaterer.caterer.categories.map( category => {
                                return (
                                    <TouchableOpacity key={category.id} style={activeCategory.id === category.id ? styles.activeMenuItem : styles.inactiveMenuItem} onPress={() => { setActiveCategory(category)}}>
                                        <Text style={activeCategory.id === category.id ? styles.activeMenuItemTitle : styles.inactiveMenuItemTitle}>{category.title}</Text>
                                    </TouchableOpacity>
                                )
                            } )}
                        </ScrollView>

                        <Text style={styles.menuTitle}>Dishes</Text>
                        {dishes.map(item => {
                            // console.log("Dish   ",item);
                            const itemObj = cartItems?.find(dish => { return (dish.id === item.id) })
                            return (
                                <View key={item.id} style={styles.dishItemContainer}>
                                    <Image source={{ uri: item.image }} style={styles.dishImage} />
                                    <View style={styles.dishTextContainer}>
                                        <Text style={styles.dishName}>{item.title}</Text>
                                        <Text style={styles.dishDesc} numberOfLines={2} ellipsizeMode='tail'>{item.description}</Text>
                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', margin: 2, marginTop: 10 }}>
                                            <Text>$ {item.price.toFixed(2)}</Text>
                                            {itemObj ?
                                                <View style={styles.dishCartButton}>
                                                    <TouchableOpacity onPress={() => { dispatch(cartActions.removeFromCart(itemObj)) }} ><Ionicon name="remove-outline" size={25} color={Colors.ERROR_RED} /></TouchableOpacity>
                                                    <Text style={{marginHorizontal:5}}>{itemObj?.qty}</Text>
                                                    <TouchableOpacity onPress={() => { dispatch(cartActions.addToCart(item)) }}><Ionicon name="add-outline" size={25} color={Colors.GREEN} /></TouchableOpacity>
                                                </View>
                                                :
                                                <TouchableOpacity onPress={() => openHandler(item, catererId)} style={styles.dishCartButton} >
                                                    <Ionicon name="cart-outline" size={25} color={Colors.ORANGE} />
                                                    <Text style={{marginLeft:5}}>Add</Text>
                                                </TouchableOpacity>}
                                        </View>
                                    </View>
                                </View>
                            )
                        })}
                    </> 
                    :
                    <>
                        <Text style={styles.menuTitle}>Menu</Text>
                        <View style={styles.backDropContainer} >
                            <Text style={{...styles.backDropText, fontSize:25}}>NO DISHES FOUND</Text>
                            <Text style={{...styles.backDropText, fontSize:15}}>Wait for the caterer to add some.</Text>
                        </View>
                    </>
                    }
                    </View>


                </ScrollView>
            </View>

            {/* Footer */}
            <View style={styles.footerContainer}>
                <View style={styles.footerButton}>
                    <Text style={styles.footerText}>Item Total: $ {total.toFixed(2)}</Text>
                </View>
                <View style={styles.whiteLine}></View>
                <View style={styles.footerButton}>
                    <TouchableOpacity onPress={navigateHandler} disabled={cartItems.length ? false : true}>
                        <Text style={styles.footerText}>MAKE PAYMENT</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <RBSheet
                ref={refRBSheet}
                closeOnDragDown={true}
                closeOnPressMask={true}
                customStyles={{
                    wrapper: {
                        backgroundColor: "rgba(0,0,0,0.5)"
                    },
                    draggableIcon: {
                        backgroundColor: "#ccc",
                        width: 100
                    },
                    container: {
                        paddingHorizontal: 20,
                        backgroundColor: Colors.WHITE,
                        borderTopRightRadius: 30,
                        borderTopLeftRadius: 30,
                    }
                }}
            >
                <Text style={{ marginTop: 30, fontWeight: 'bold' }} >You are about to add items from a caterer different from that in your cart already. Do you wish to clear earlier items?</Text>
                <View style={styles.rbButtonContainer}>
                    <TouchableOpacity style={styles.rbButton} onPress={clearCartHandler}><Text style={styles.rbButtonText}>Yes, clear cart.</Text></TouchableOpacity>
                    <TouchableOpacity style={styles.rbButton} onPress={() => { refRBSheet.current.close() }}><Text style={styles.rbButtonText}>No.</Text></TouchableOpacity>
                </View>
            </RBSheet>
        </View>
    );
};

const styles = StyleSheet.create({
    screen: {
        paddingHorizontal: 20,
        paddingVertical: 20,
        borderBottomColor: '#ddd',
        borderBottomWidth: 1
    },
    backDropText:{
        color: Colors.LIGHTER_GREY
    },
    backDropContainer:{
        height:100, 
        alignItems:'center', 
        justifyContent:'center'
    },
    activeMenuItem: {
        backgroundColor: Colors.ORANGE,
        paddingVertical: 10,
        paddingHorizontal: 30,
        marginHorizontal: 10,
        borderRadius: 50
    },
    inactiveMenuItem: {
        borderWidth: 0.5,
        borderColor: Colors.GREY,
        paddingVertical: 10,
        paddingHorizontal: 30,
        marginHorizontal: 10,
        borderRadius: 50
    },
    activeMenuItemTitle: {
        fontWeight: 'bold',
        color: Colors.WHITE,
        fontSize: 16
    },
    inactiveMenuItemTitle: {
        fontWeight: 'bold',
        color: Colors.BLACK,
        fontSize: 16
    },
    rbButtonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 10,
        marginTop: 15
    },
    rbButton: {
        padding: 10,
        backgroundColor: Colors.ORANGE,
        flex: 1,
        alignItems: 'center',
        marginHorizontal: 10,
        borderRadius: 15
    },
    rbButtonText: {
        fontWeight: 'bold',
        color: Colors.WHITE,
        fontSize: 18
    },
    image: {
        height: 200,
        width: '100%',
        borderRadius: 10
    },
    label: {
        fontWeight: 'bold',
        fontSize: 17,
        color: '#aaa'
    },
    categoryBioText: {
        marginTop: 10,
        color: Colors.BLACK,
        fontWeight: 'bold',
        fontSize: 18
    },
    name: {
        fontWeight: 'bold',
        fontSize: 20,
        marginTop: 10
    },
    address: {
        fontWeight: 'bold',
        fontSize: 17,
        color: '#444',
        marginTop: 5
    },
    dateTimeContainer: {
        flex: 1,
        borderRadius: 5,
        borderWidth: 0.5,
        borderColor: Colors.GREY,
        padding: 10,
        marginHorizontal: 10,
        flexDirection: 'row'
    },
    dateTimeTouchable: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        flex: 1
    },
    whiteLine: {
        width: 0,
        height: '100%',
        borderColor: Colors.WHITE,
        borderWidth: 1
    },
    food_category: {
        borderBottomColor: '#ccc',
        borderBottomWidth: 1,
        paddingBottom: 10,
        marginBottom: 5
    },
    orderTypeContainer: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderBottomColor: '#ddd',
        borderBottomWidth: 1,
    },
    orderTypeLabel: {
        color: Colors.BLACK,
        fontSize: 20,
        fontWeight: '900'
    },
    orderTypeLabelContainer: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    optionContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 30,
        paddingTop: 10
    },
    menu: {
        padding: 10,
    },
    menuTitle: {
        color: Colors.BLACK,
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10
    },
    categoryItem: {
        height: 40,
        borderRadius: 20,
        borderColor: '#ccc',
        borderWidth: 1,
        marginHorizontal: 5,
        alignItems: 'center',
        justifyContent: 'center',
    },
    categoryItemTitle: {
        marginHorizontal: 30,
        fontWeight: 'bold',
        fontSize: 15,
        letterSpacing: -0.5
    },
    dishItemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        marginTop: 5,
        borderBottomColor: '#ccc',
        borderBottomWidth: 1,
        padding: 15
    },
    dishTextContainer: {
        flex: 2,
        justifyContent: 'space-evenly',
        padding: 10,
        marginLeft: 10
    },
    dishImage: {
        flex: 1,
        aspectRatio: 1
    },
    dishName: {
        width: '100%',
        margin: 2,
        fontWeight: 'bold'
    },
    dishDesc: {
        width: '100%',
        margin: 2,
        color: '#777'
    },
    dishCartButton: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderColor: '#ccc',
        borderWidth: 1,
        paddingHorizontal: 10,
        height: 40,
        borderRadius: 10
    },
    footerContainer: {
        flex: 0.07,
        width: '100%',
        backgroundColor: Colors.ORANGE,
        marginTop: 10,
        paddingVertical: 10,
        flexDirection: 'row',
        alignItems: 'center'
    },
    footerButton: {
        flex: 1,
        alignItems: 'center'
    },
    footerText: {
        fontWeight: 'bold',
        color: Colors.WHITE,
        fontSize: 18
    }
});

export default DetailScreen;