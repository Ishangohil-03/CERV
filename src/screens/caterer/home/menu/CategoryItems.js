import { ActivityIndicator, FlatList, Image, StyleSheet, Text, TouchableOpacity, View, Dimensions, Modal, StatusBar } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Colors } from '../../../../CommonConfig'
import { deletePostLogin, getPostLogin, postPostLogin } from '../../../../helpers/ApiHelpers'
import Toast from 'react-native-simple-toast'
import Ionicons from 'react-native-vector-icons/Ionicons';

const CategoryItems = ({ navigation, route }) => {

    const { item } = route.params

    const [ loading, setLoading ] = useState(true)
    const [ dishes, setDishes ] = useState([])
    const [ dishToDelete, setDishToDelete ] = useState({})
    const [ showDeleteModal, setShowDeleteModal ] = useState(false)

    useEffect( () => {
        const refresh = navigation.addListener('focus', () => {
            getDishes()
        })
        
        return refresh
    },[navigation])
    
    const getDishes = async() => {
        setLoading(true)
        const response = await getPostLogin(`/caterer/category/${item.id}`)
        if(response.success){
            setDishes(response.data.category.items)
            setLoading(false)
        } else {
            Toast.show("No Dishes available in selected category!")
            setLoading(false)
        }
    }

    const deleteHandler = async() => {
        setLoading(true)
        // console.log(dishToDelete);
        const response = await deletePostLogin(`/caterer/delete-item/${dishToDelete.id}`)
        if(response.success) {
            Toast.show('Dish deleted successfully!')
            getDishes()
            setShowDeleteModal(false)
        } else {
            Toast.show('Something went wrong!')
            getDishes()
            setShowDeleteModal(false)
        }
    }

    const renderDish = ({item}) => {
        // console.log(item)
        return(
            <TouchableOpacity activeOpacity={0.6} style={styles.dishContainer} onPress={() => {
                navigation.navigate('DishDetail',{ selectedDish: item, mode: 'view' })
            }}>
                <Image source={{uri: item.image}} style={{flex:1, aspectRatio:1}} />
                <View style={styles.dishDetailContainer}>
                    <View style={[styles.labelRow, { width: Dimensions.get('screen').width - 120 }]}>
                        <Text style={styles.dishName}>{item.title}</Text>
                        <TouchableOpacity activeOpacity={0.6} onPress={() => {
                            setDishToDelete(item)
                            setShowDeleteModal(true)
                        }}>
                            <Ionicons name={'trash-outline'} size={30} color={Colors.GREY} />
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.description} ellipsizeMode='tail' numberOfLines={1}>{item.description}</Text>
                    <Text style={styles.price}>$ {(item.price).toFixed(2)}</Text>
                </View>
            </TouchableOpacity >
        )
    }

    if(loading) {
        return(
            <View style={styles.loader}>
                <ActivityIndicator size={65} color={Colors.ORANGE}/>
            </View>
        )
    }

    return (
        <View style={styles.screen}>
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
                                <Text style={[styles.label,{color: Colors.GREY}]}>CANCEL</Text>
                            </TouchableOpacity >
                            <TouchableOpacity activeOpacity={0.4} style={[styles.modalBtn,{ borderLeftColor: Colors.GREY, borderLeftWidth:0.25 }]} onPress={deleteHandler}>
                                <Text style={[styles.label,{color: Colors.ORANGE}]}>OKAY</Text>
                            </TouchableOpacity >
                        </View>
                    </View>
                </View>
            </Modal>
            <View style={styles.labelRow}>
                <Text style={[styles.label,{color: Colors.GREY}]}>Items</Text>
                <TouchableOpacity activeOpacity={0.6} onPress={() => { navigation.navigate('DishDetail',{ mode: 'add', category: item }) }}>
                    <Text style={[styles.label,{ color: Colors.ORANGE }]}>ADD</Text>
                </TouchableOpacity>
            </View>
            <FlatList 
                data={dishes}
                keyExtractor={item => item.id}
                renderItem={renderDish}
            />
        </View>
    )
}

export default CategoryItems

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
    labelRow:{
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-between',
    },
    label:{
        fontWeight:'bold',
        fontSize: 18
    },
    dishContainer:{
        paddingVertical:15,
        borderBottomColor: Colors.GREY,
        borderBottomWidth: 0.5,
        flexDirection:'row'
    },
    dishDetailContainer:{
        flex:3,
        justifyContent:'space-between',
        marginLeft: 10
    },
    dishName:{
        fontWeight:'bold',
        fontSize: 24
    },
    description:{
        color: Colors.GREY,
        fontSize:16,
    },
    modal:{
        backgroundColor: Colors.WHITE,
        width: Dimensions.get('screen').width*0.8,
        borderRadius: 10,
        paddingTop:10,
        paddingHorizontal:10,
        alignItems:'center'
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
})