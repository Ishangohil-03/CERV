import { ActivityIndicator, FlatList, Image, StatusBar, StyleSheet, Text, TouchableOpacity, View, Modal, Dimensions } from 'react-native'
import React, { useEffect, useState } from 'react'
import { getPostLogin, deletePostLogin } from '../../../../helpers/ApiHelpers'
import { Colors } from '../../../../CommonConfig'
import Ionicons from 'react-native-vector-icons/Ionicons';
import Toast from 'react-native-simple-toast'

const MenuScreen = ({navigation}) => {

    const [ loading, setLoading ] = useState(true)
    const [ categories, setCategories ] = useState([])
    const [ categoryToDelete, setCategoryToDelete ] = useState({})
    const [ showDeleteModal, setShowDeleteModal ] = useState(false)

    useEffect(() => {
        const refresh = navigation.addListener('focus', () => {
            getCategories()
        })
        
        return refresh
    },[navigation])
    
    const getCategories = async() => {
        setLoading(true)
        const categoriesResponse = await getPostLogin('/caterer/categories')
        // console.log(categoriesResponse);
        if(categoriesResponse.success) {
            setCategories(categoriesResponse.data.categories)
            setLoading(false)
        } else {
            console.log(categoriesResponse);
            setLoading(false)
        }
    }

    const deleteHandler = async() => {
        setLoading(true)
        const response = await deletePostLogin(`/caterer/delete-category/${categoryToDelete.id}`)
        if(response.success) {
            Toast.show('Category deleted successfully!')
            getCategories()
            setShowDeleteModal(false)
        } else {
            Toast.show('Something went wrong!')
            getCategories()
            setShowDeleteModal(false)
        }
    }

    const renderCategoryItem = ({item}) => {
        return(
            <TouchableOpacity style={styles.categoryItem} activeOpacity={0.6} onPress={() => { 
                navigation.navigate('CategoryItems',{ item })
            }}>
                {/* Image & Title */}
                <View style={{flex:6,flexDirection:'row', alignItems:'center'}}>
                    <Image source={{uri: item.image}} style={styles.categoryImage}/>
                    <Text style={styles.categoryTitle}>{item.title}</Text>
                </View>
                {/* Buttons */}
                <View style={{flex:1, justifyContent:'space-evenly', height:'100%'}}>
                    <TouchableOpacity style={styles.actionBtn} onPress={() => {
                        navigation.navigate('AddEditCategory',{ mode: 'edit', selectedCategory: item })
                    }}>
                        <Ionicons name='pencil' color={Colors.GREEN} size={20}/>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.actionBtn} onPress={() => {
                        setCategoryToDelete(item)
                        setShowDeleteModal(true)
                    }} >
                        <Ionicons name='trash' color={Colors.ERROR_RED} size={20}/>
                    </TouchableOpacity>
                </View>

                <Ionicons name='chevron-forward' color={Colors.GREY} size={25}/>
            </TouchableOpacity>
        )
    }

    if(loading) {
        return (
            <View style={styles.loader}>
                <ActivityIndicator size={65} color={Colors.ORANGE}/>
            </View>
        )
    }

    return (
        <View style={styles.container}>
            <StatusBar barStyle='dark-content' backgroundColor={Colors.WHITE}/>
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
            <FlatList 
                data={categories}
                keyExtractor={item => item.id}
                renderItem={renderCategoryItem}
                ItemSeparatorComponent={() => <View style={styles.separator}/>}
            />
            <TouchableOpacity style={styles.addBtn} onPress={() => {
                navigation.navigate('AddEditCategory', { mode:'add' })
            }}>
                <Ionicons name='add' color={Colors.WHITE} size={60}/>
            </TouchableOpacity>
        </View>
    )
}

export default MenuScreen

const styles = StyleSheet.create({
    loader:{
        flex:1,
        alignItems:'center',
        justifyContent:'center'
    },
    container:{
        flex:1,
        padding:10
    },
    separator:{
        height:10,
        width:'100%',
    },
    categoryItem:{
        width: '100%',
        height: 100,
        backgroundColor: Colors.WHITE,
        padding: 10,
        borderRadius: 10,
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-between'
    },
    categoryTitle:{
        fontWeight:'bold',
        fontSize: 18
    },
    categoryImage:{
        height: '100%', 
        aspectRatio: 1, 
        borderRadius:10, 
        marginRight: 10
    },
    actionBtn:{
        height: 35,
        width:35,
        alignItems:'center',
        justifyContent:'center',
        borderRadius:100,
        borderWidth: 0.5,
        borderColor: Colors.LIGHTER_GREY
    },
    addBtn:{
        backgroundColor: Colors.ORANGE,
        alignItems:'center',
        justifyContent:'center',
        width:70,
        height:70,
        borderRadius: 40,
        position:'absolute',
        zIndex: 10, 
        bottom: 20,
        right: 20,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
    },
    modal:{
        backgroundColor: Colors.WHITE,
        width: Dimensions.get('screen').width*0.8,
        borderRadius: 10,
        paddingTop:10,
        paddingHorizontal:10,
        alignItems:'center'
    },
    label:{
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
})