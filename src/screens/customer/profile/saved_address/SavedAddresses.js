import React, { useEffect, useState } from "react";
import { View, StyleSheet, FlatList, ActivityIndicator, Text, TouchableOpacity } from "react-native";
import Ionicon from 'react-native-vector-icons/Ionicons';
import Toast from 'react-native-simple-toast';

import AsyncStorage from "@react-native-async-storage/async-storage";
import { Colors } from "../../../../CommonConfig";
import { getPostLogin, postPostLogin } from "../../../../helpers/ApiHelpers";

const SavedAddresses = ({navigation, route}) => {

    const [ loading, setLoading ] = useState(true)
    const [ addresses, setAddresses ] = useState([])
    const [ activeAddress, setActiveAddress ] = useState({})

    useEffect( async() => {
        setActiveAddress(JSON.parse( await AsyncStorage.getItem('activeAddress') ))
    },[])

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            getAddresses()
        });
        return unsubscribe;
    },[navigation])

    const getAddresses = async() => {
        setLoading(true)
        const response = await getPostLogin('/get-address')
        if (response.success) {
            setAddresses(response.data.data)
            setLoading(false)
        } else {
            console.log(response);
            setLoading(false)
        }
    }

    const activateAddressHandler = async() => {
        if( Object.keys(activeAddress ? activeAddress : {} ).length === 0 ){
            Toast.show('Please select an address to activate!')
        } else {
            // console.log(activeAddress)
            await AsyncStorage.setItem('activeAddress', JSON.stringify(activeAddress))
            Toast.show('Address activated successfully!')
            navigation.goBack()
        }
    }

    const tag = (address_type) => {
        if(address_type === 0) return "Home"
        if(address_type === 1) return "Work"
        if(address_type === 2) return "Other"
    }
    
    const renderAddressItem = ({item}) => {
        return(
            <TouchableOpacity style={styles.addressItem} onPress={ () => { navigation.navigate('EditAddress', { item }) } } >
                <View style={{flex:5,justifyContent:'space-evenly', height:'100%', paddingHorizontal:10}}>
                    <Text style={styles.addressTag}>{ tag(item.address_type) }</Text>
                    <Text style={styles.address}>{ item.address }</Text>
                </View>
                <View style={{flex:1, alignItems:'center', justifyContent:'center', height:'100%'}}>
                    <TouchableOpacity onPress={() => { setActiveAddress(item) }}>
                        <Ionicon name={'checkmark-circle'} size={30} color={activeAddress?.id === item.id ? Colors.GREEN : Colors.GREY }/>
                    </TouchableOpacity>
                </View>
            </TouchableOpacity>
        )
    }

    if(loading) {
        return(
            <View style={styles.loader}>
                <ActivityIndicator size={65} color={Colors.ORANGE} />
            </View>
        )
    }

    return(
        <View style={styles.screen}>
            <View>
                <Text style={styles.label}>SAVED ADDRESSES</Text>
                {
                    addresses.length > 0 ?
                        //Render Cards
                        <FlatList
                            data={addresses}
                            keyExtractor={item => item.id}
                            renderItem={renderAddressItem}
                        />
                        :
                        //Backdrop Text
                        <View style={styles.backDropContainer}>
                            <Text style={styles.backDropTitle}>No Addresses Saved</Text>
                            <Text style={styles.backDropText}>Add some now!</Text>
                        </View>
                }
            </View>
            {
                addresses.length > 0 &&
                    <TouchableOpacity style={styles.activateBtn} onPress={activateAddressHandler}>
                        <Text style={styles.activateText}>ACTIVATE ADDRESS</Text>
                    </TouchableOpacity>
                    
            }
        </View>
    )

}

const styles = StyleSheet.create({
    loader:{
        flex:1,
        justifyContent:'center',
        alignItems:'center',
        backgroundColor: Colors.WHITE
    },
    screen:{
        flex:1,
        backgroundColor: Colors.WHITE,
        padding:10
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
    addressItem:{
        justifyContent:'space-between',
        alignItems:'center',
        height:90,
        width:'100%',
        // backgroundColor: Colors.STAR_YELLOW,
        flexDirection:'row',
        borderBottomColor: Colors.GREY,
        borderBottomWidth: 0.75,
        marginBottom: 10
    },
    addressTag:{
        fontWeight:'bold',
        fontSize:20,
        flex:1,
        textAlignVertical:'center'
    },
    address:{
        flex:1.5,
        fontSize:16,
        color: Colors.GREY,
    }
})

export default SavedAddresses;

// const [ loading, setLoading ] = useState(true)
// const [ addresses, setAddresses ] = useState([])
// const [ length, setLength ] = useState(0)
// const [ activeAddress, setActiveAddress ] = useState( {} )
// // console.log(activeAddress)

// useEffect( async() => {
//     setActiveAddress( JSON.parse( await AsyncStorage.getItem('activeAddress')))
// },[])

// useEffect( () => {
//     const unsubscribe = props.navigation.addListener('focus', () => {
//         getAddresses()
//     });
//     return unsubscribe;
// }, [ props.navigation ])

// const getAddresses = async() => {
//     setLoading(true)
//     const addressResponse = await getPostLogin('/get-address')
//     // console.log(addressResponse)
//     if(addressResponse.success) {
//         setAddresses(addressResponse.data.data)
//         setLength(addressResponse.data.length)
//         setLoading(false)
//     } else {
//         console.log(addressResponse)
//         setLoading(false)
//     }

// }



// if(loading) {
//     return (
//         <View style={[styles.screen, { alignItems:'center', justifyContent:'center' }]}>
//             <ActivityIndicator size={65} color={Colors.ORANGE}/>
//         </View>
//     )
// }

// return(
//     <View style={styles.screen}>
//         {
//             length > 0 ? 
//                 //Render Addresses
//                 <View>
//                     <FlatList 
//                         data={addresses}
//                         keyExtractor = { item => item.id }
//                         renderItem = { renderAddressItem }
//                     />
//                 </View>
//                 :
//                 //Backdrop Text
//                 <View style={styles.backDropContainer}>
//                     <Text style={styles.backDropTitle}>No Addresses Found</Text>
//                     <Text style={styles.backDropText}>Add some now!</Text>
//                 </View>
//         }
//         {
//             length > 0 ?
//                 //Render Activate
//                 <TouchableOpacity style={styles.activateBtn} onPress={activateAddressHandler}>
//                     <Text style={styles.activateText}>ACTIVATE ADDRESS</Text>
//                 </TouchableOpacity>
//                 :
//                 null
//         }
//     </View>
// )
