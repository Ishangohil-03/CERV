import React from "react";
import { View, Dimensions, Text, StyleSheet, Image } from "react-native";
import Ionicon from 'react-native-vector-icons/Ionicons';

import{ Colors }from "../../../CommonConfig";
import HeartIconHome from "../../../components/HeartIconHome";
import Caterer from '../../../model/caterer';

const MyFavourites = props => {

    const favCaterers = Caterer.filter(item => { return(item.isFavourite === true)}); 
    
    const windowWidth = Dimensions.get("window").width;

    const Stars = props => {
        let rating = props.rating;
        let disp = []

        for (var i = 1; i <= 5; i++) {
            let star = <Ionicon name="star" size={18} color={Colors.STAR_YELLOW} key={i}/>
            if (i > rating) {
                star = <Ionicon name="star-outline" size={18} color={Colors.GREY} key={i}/>
            }
            disp.push(star);
        }

        return (<View style={{ flexDirection: 'row' }} >{disp}</View>)

    }

    return (
        <View style={styles.screen}>
            {favCaterers.map(function(c){
                        return ( 
                            <View style={{width: windowWidth * 0.9, height:250, marginVertical:5, borderRadius:15,overflow: 'hidden', alignItems:'center'}} key={c.id}>
                                <Image source={{ uri: c.image }} style={styles.image} />
                                <View style={styles.detailContainer}>
                                    <View>
                                        <Text style={{ fontWeight: 'bold' }}>{c.name}</Text>
                                        <Text style={{ fontWeight: '800', marginTop: 3 }} >{c.address}</Text>
                                        <View style={{ marginTop: 3 }} >
                                            <Stars rating={c.rating} />
                                        </View>
                                    </View>
                                    <HeartIconHome initialState={c.isFavourite}/>
                                </View>
                            </View>
                        )
                    })}
        </View>
    )
};

const styles = StyleSheet.create({
    screen:{
        flex:1,
        alignItems:'center',
        backgroundColor:'#DFE6E1',
        paddingVertical:15
    },
    image: { 
        flex: 9, 
        height: 250, 
        width: '100%' 
    },
    detailContainer: { 
        flex: 3, 
        flexDirection: 'row', 
        backgroundColor: 'white', 
        width: '100%', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        padding: 20 
    }
});

export default MyFavourites;