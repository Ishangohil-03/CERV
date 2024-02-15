import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, ActivityIndicator, ScrollView, FlatList, Dimensions } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { getPostLogin } from "../../../../helpers/ApiHelpers";

import * as paymentActions from '../../../../store/actions/paymentMethod'
import CreditCardDisplay from "../../../../components/CreditCardDisplay";
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Colors, Images } from '../../../../CommonConfig';
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-simple-toast";

const SavedCards = props => {

    const [loading, setLoading] = useState(true)
    const [cards, setCards] = useState([])
    const [activeCard, setActiveCard] = useState({})

    useEffect(async () => {
        setActiveCard(JSON.parse(await AsyncStorage.getItem('activeCard')))
    }, [])

    useEffect(() => {
        const unsubscribe = props.navigation.addListener('focus', () => {
            getCards()
        });
        return unsubscribe;
    }, [props.navigation])

    const getCards = async () => {
        setLoading(true)
        const cardResponse = await getPostLogin('/getCards')
        if (cardResponse.success) {
            setCards(cardResponse.data.message.data)
            setLoading(false)
        } else {
            console.log(cardResponse);
            setLoading(false)
        }
    }

    const activateCardHandler = async() => {
        if(Object.keys(activeCard ? activeCard : {}).length === 0 ){
            Toast.show('Please select a card to activate!')
        } else {
            await AsyncStorage.setItem('activeCard', JSON.stringify(activeCard))
            Toast.show('Card activated successfully!')
            props.navigation.goBack()
        }
    }

    const renderCardItem = (itemData) => {
        const cardObj = itemData.item
        // console.log(cardObj);
        return (
            <View style={styles.cardItemContainer}>
                <View style={{ flex: 10, alignItems: 'center', flexDirection: 'row' }}>
                    <Image source={Images.CREDIT_CARD} style={{ height: 80, width: 80 }} />
                    <View style={{ marginHorizontal: 20 }}>
                        <Text style={styles.cardNumber}>**** **** **** {cardObj.last4}</Text>
                        <Text style={styles.expiry}>Expires {cardObj.exp_month} / {cardObj.exp_year}</Text>
                    </View>
                </View>
                <TouchableOpacity style={{ flex: 1 }} onPress={() => { setActiveCard(cardObj) }}>
                    <Ionicons name="checkmark-circle" color={activeCard?.id === cardObj.id ? Colors.GREEN : Colors.GREY} size={30} />
                </TouchableOpacity>
            </View>
        )
    }

    if (loading) {
        return (
            <View style={[styles.screen, { justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size={65} color={Colors.ORANGE} />
            </View>
        )
    }

    return (
        <View style={styles.screen}>
            <View>
                <Text style={styles.label}>SAVED PAYMENT METHODS</Text>
                {
                    cards.length > 0 ?
                        //Render Cards
                        <FlatList
                            data={cards}
                            keyExtractor={item => item.id}
                            renderItem={renderCardItem}
                        />
                        :
                        //Backdrop Text
                        <View style={styles.backDropContainer}>
                            <Text style={styles.backDropTitle}>No Cards Saved</Text>
                            <Text style={styles.backDropText}>Add some now!</Text>
                        </View>
                }
            </View>
            {
                cards.length > 0 ?
                // Activate Button
                <TouchableOpacity style={styles.activateBtn} onPress={activateCardHandler}>
                        <Text style={styles.activateText}>ACTIVATE CARD</Text>
                    </TouchableOpacity>
                :
                null
            }
        </View>
    )

};

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        padding: 20,
        backgroundColor: Colors.BACKGROUND_GREY
    },
    label: {
        fontWeight: 'bold',
        fontSize: 16,
        color: Colors.GREY,
        marginBottom: 10
    },
    backDropContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    backDropTitle: {
        fontWeight: 'bold',
        fontSize: 30,
        color: Colors.GREY
    },
    backDropText: {
        fontWeight: 'bold',
        fontSize: 20,
        color: Colors.LIGHTER_GREY
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
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
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
    activateBtn:{
        paddingVertical:15,
        backgroundColor: Colors.ORANGE,
        width:'90%',
        alignSelf:'center',
        alignItems:'center',
        justifyContent:'center',
        borderRadius:5,
        position:'absolute',
        bottom:10
    },
    activateText:{
        fontWeight: 'bold',
        color: Colors.WHITE,
        fontSize:18
    },
});

export default SavedCards;

// useEffect( () => {
//     const unsubscribe = props.navigation.addListener('focus', () => {
//         getCards();
//     })
//     return unsubscribe;
// }, [props.navigation])

// const dispatch = useDispatch();

// const [isLoading, setIsLoading] = useState(true);
// const [cardList, setCardList] = useState([])

// const getCards = async() => {
//     const response = await getPostLogin('/getCards')
//     // console.log(response)
//     const tempArray = response.data.message.data
//     setCardList(tempArray)
//     { tempArray.map( item => {
//         return ( dispatch(paymentActions.addCard(item)) )
//     } ) }
//     setIsLoading(false)
// }

// if(isLoading){
//     return (
//         <View style={styles.loader}>
//             <ActivityIndicator size={65} color={Colors.ORANGE}/>
//         </View>
//     )
// }

// return(
//     <View style={styles.screen} > 
//         <View style={styles.cardTextContainer}>
//             <Text style={styles.label}>Saved Payment Methods</Text>   
//         </View>

//         <ScrollView 
//             showsVerticalScrollIndicator={false}
//             // refreshControl
//         >
//             {cardList.map( item => {
//                 return(
//                     <View key={item.id}>
//                         <CreditCardDisplay 
//                             brand = {item.brand}
//                             customer = { item.customer }
//                             exp_month = { item.exp_month }
//                             exp_year = { item.exp_year }
//                             id = { item.id }
//                             last4 = { item.last4 }
//                             name = { item.name }
//                         />
//                     </View>
//                 )
//             } )}
//         </ScrollView>

//     </View>
// )

// screen:{
//     flex:1,
//     padding:20
// },
// loader:{
//     flex:1,
//     justifyContent:'center',
//     alignItems:'center'
// },
// label:{
//     fontWeight:'bold',
//     fontSize:20,
//     marginBottom:10,
//     color: Colors.GREY
// }