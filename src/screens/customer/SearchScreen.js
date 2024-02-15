import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, StatusBar, TouchableOpacity, TextInput, Dimensions, ActivityIndicator } from 'react-native';
import Ionicon from 'react-native-vector-icons/Ionicons';
import { getPostLogin } from '../../helpers/ApiHelpers'

import { Colors, Images } from '../../CommonConfig';

const SearchScreen = props => {

    const [loading, setLoading] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')
    const [type, setType] = useState(1)

    const [categories, setCategories] = useState([])
    const [dishes, setDishes] = useState([])
    const [restaurants, setRestaurants] = useState([])

    useEffect(() => {
        if (searchQuery.length !== 0) {
            loadResults()
        }
    }, [type])

    const loadResults = async () => {
        setLoading(true)
        const response = await getPostLogin(`/search/${type}?term=${searchQuery}`)
        // console.log(response.data.results)
        if (response.success) {
            if (type === 1) {
                setCategories(response.data.results)
            }
            if (type === 2) {
                setDishes(response.data.results)
            }
            if (type === 3) {
                setRestaurants(response.data.results)
            }
        } else {
            console.log(response)
        }
        setLoading(false)
    }

    // useEffect( () => {
    //     console.log("Dishes:\n", dishes)
    //     console.log("Categories:\n", categories)
    //     console.log("Restaurants:\n", restaurants)
    // },[ dishes, categories, restaurants ])


    const handleNavigation = async (id) => {
        setLoading(true)
        const response = await getPostLogin(`/catererInfo/${id}`)
        if (response.success) {
            props.navigation.navigate('Details', { caterer: response.data.caterer })
        } else {
            console.log(response)
        }
        setLoading(false)
    }

    return (
        <View style={styles.screen} >
            <StatusBar backgroundColor={Colors.WHITE} barStyle='dark-content' />
            {/* SEARCH BAR */}
            <View style={styles.searchBarContainer}>
                <TextInput
                    value={searchQuery}
                    placeholder='Search'
                    onChangeText={(e) => { setSearchQuery(e) }}
                    autoFocus
                    style={{
                        fontWeight: 'bold',
                        fontSize: 25,
                        width: '80%',
                        paddingHorizontal:10
                    }}
                />
                <View style={{ alignItems: 'center', justifyContent: 'flex-start', flexDirection: 'row' }}>
                    {/* <Text style={{fontSize:20, fontWeight:'bold', marginLeft:10}}>{searchQuery}</Text> */}
                    {searchQuery.length === 0 ? null : <TouchableOpacity onPress={() => { setSearchQuery('') }}><Ionicon name="close" size={Dimensions.get('screen').width * 0.1} color={Colors.GREY} /></TouchableOpacity>}
                    <TouchableOpacity disabled={searchQuery.length === 0 ? true : false} onPress={loadResults} ><Ionicon name="search-outline" size={25} color={Colors.BLACK} /></TouchableOpacity>
                </View>
            </View>

            <View style={styles.bodyContainer}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly', backgroundColor: Colors.WHITE, paddingBottom: 10 }}>
                    <TouchableOpacity
                        onPress={() => { setType(1) }}
                        style={{ ...styles.typeContainer, backgroundColor: type === 1 ? Colors.ORANGE : null, borderColor: type === 1 ? Colors.ORANGE : Colors.GREY }}
                    >
                        <Text style={{ fontWeight: 'bold', fontSize: 16, color: type === 1 ? Colors.WHITE : Colors.BLACK }}>Categories</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => { setType(2) }}
                        style={{ ...styles.typeContainer, backgroundColor: type === 2 ? Colors.ORANGE : null, borderColor: type === 2 ? Colors.ORANGE : Colors.GREY }}
                    >
                        <Text style={{ fontWeight: 'bold', fontSize: 16, color: type === 2 ? Colors.WHITE : Colors.BLACK }}>Dishes</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => { setType(3) }}
                        style={{ ...styles.typeContainer, backgroundColor: type === 3 ? Colors.ORANGE : null, borderColor: type === 3 ? Colors.ORANGE : Colors.GREY }}
                    >
                        <Text style={{ fontWeight: 'bold', fontSize: 16, color: type === 3 ? Colors.WHITE : Colors.BLACK }}>Restaurants</Text>
                    </TouchableOpacity>
                </View>

                <View style={{ flex: 11, padding: 10 }}>
                    {loading ?
                        <ActivityIndicator size={65} style={{ alignSelf: 'center' }} color={Colors.ORANGE} />
                        :
                        searchQuery.length === 0 ?
                            <View style={{ paddingVertical: 25, alignSelf: 'center', flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={{ color: Colors.LIGHTER_GREY, fontWeight: 'bold', fontSize: 25 }}>  Please search something</Text>
                            </View>
                            :
                            <View style={{ flex: 1 }}>
                                <Text style={{ fontWeight: 'bold', fontSize: 17 }}>Search Results</Text>
                                {
                                    type === 1 ?
                                        // Categories ( userId )
                                        <View style={styles.searchResultContainer}>
                                            {categories.map(item => {
                                                return (
                                                    <TouchableOpacity key={item.id} style={styles.searchResultTouchable} onPress={() => { handleNavigation(item.userId) }}>
                                                        <View>
                                                            <Text style={{ fontWeight: 'bold', fontSize: 16 }}>{item.title}</Text>
                                                            <Text style={styles.catererName}>{item.user.name}</Text>
                                                        </View>
                                                        <Ionicon name='chevron-forward' size={25} color={Colors.GREY} />
                                                    </TouchableOpacity>
                                                )
                                            })}
                                        </View>
                                        :
                                        type === 2 ?
                                            // Dishes ( userId )
                                            <View style={styles.searchResultContainer}>
                                                {
                                                    dishes.map(dish => {
                                                        // console.log(dish)
                                                        return (
                                                            <TouchableOpacity key={dish.id} style={styles.searchResultTouchable} onPress={() => { handleNavigation(dish.userId) }}>
                                                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                                    <Image source={{ uri: dish.image }} style={{ aspectRatio: 1, height: 30 }} />
                                                                    <View style={{ marginLeft: 10 }}>
                                                                        <Text style={{ fontWeight: 'bold', fontSize: 16 }}>{dish.title}</Text>
                                                                        <Text style={styles.catererName}>{dish.user.name}</Text>
                                                                    </View>
                                                                </View>
                                                                <Ionicon name='chevron-forward' size={25} color={Colors.GREY} />
                                                            </TouchableOpacity>
                                                        )
                                                    })
                                                }
                                            </View>
                                            :
                                            // Restaurants (catererId)
                                            <View style={styles.searchResultContainer}>
                                                {restaurants.map(item => {
                                                    // console.log(item)
                                                    return (
                                                        <TouchableOpacity key={item.id} style={styles.searchResultTouchable} onPress={() => { handleNavigation(item.catererId) }}>
                                                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                                <Image source={{ uri: item.caterer.image }} style={{ aspectRatio: 1, height: 50, borderRadius: 25 }} />
                                                                <View style={{ marginLeft: 10 }}>
                                                                    <Text style={{ fontWeight: 'bold', fontSize: 16 }}>{item.name}</Text>
                                                                </View>
                                                            </View>
                                                            <Ionicon name='chevron-forward' size={25} color={Colors.GREY} />
                                                        </TouchableOpacity>
                                                    )
                                                })}
                                            </View>
                                }
                            </View>
                    }
                </View>
            </View>

            {/* Top Categories
            <View style={styles.bodyContainer}>
                <Text style={styles.topCategories}>Top Categories</Text>
                <FlatList
                    showsVerticalScrollIndicator={false}
                    data={Categories}
                    numColumns={2}
                    keyExtractor={item => item.id}
                    renderItem={renderGridItem}
                />
            </View> */}
        </View>
    );
};

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: Colors.WHITE
    },
    searchBarContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
        flexDirection: 'row',
        backgroundColor: Colors.WHITE,
        borderColor: Colors.LIGHTER_GREY,
        borderWidth:0.5,
        borderRadius: 50,
        margin:10
    },
    bodyContainer: {
        flex: 12,
        paddingHorizontal: 5,
    },
    topCategories: {
        fontWeight: '900',
        fontSize: 25,
        marginVertical: 10
    },
    itemCard: {
        flex: 1,
        alignItems: 'center',
        margin: 5,
        borderRadius: 15,
        backgroundColor: Colors.WHITE,
        paddingVertical: 10,
        paddingHorizontal: 5
    },
    itemName: {
        fontWeight: 'bold',
        fontSize: 20
    },
    itemImage: {
        height: 140,
        width: 140,
        borderRadius: 15,
        marginBottom: 5
    },
    typeContainer: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderWidth: 0.5,
        borderRadius: 20
    },
    searchResultContainer: {
        alignSelf: 'center',
        width: '100%',
    },
    searchResultTouchable: {
        flexDirection: 'row',
        padding: 15,
        alignItems: 'center',
        justifyContent: 'space-between',
        marginVertical: 5,
        backgroundColor: Colors.WHITE,
        borderRadius: 10,
        elevation:5,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    catererName: {
        color: Colors.ORANGE,
        fontWeight: '200',
        fontSize: 12
    }
});

export default SearchScreen;