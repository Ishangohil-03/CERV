import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from 'react-native';
import { TouchableOpacity } from "react-native-gesture-handler";
import Ionicon from 'react-native-vector-icons/Ionicons';

import{ Colors }from '../../../CommonConfig';

const SortScreen = props => {

    const [ratings, setRatings] = useState(false)
    const [priceLH, setPriceLH] = useState(false)
    const [priceHL, setPriceHL] = useState(false)
    const [distance, setDistance] = useState(false)

    const [activeFilter, setActiveFilter] = useState('')

    const ratingFilter = (val) => {
        setRatings(!ratings);
        setPriceHL(false);
        setPriceLH(false);
        setDistance(false);
    };

    const priceLowHighFilter = () => {
        setRatings(false);
        setPriceHL(false);
        setPriceLH(!priceLH);
        setDistance(false);
    };

    const priceHighLowFilter = () => {
        setRatings(false);
        setPriceHL(!priceHL);
        setPriceLH(false);
        setDistance(false);
    };

    const distanceFilter = () => {
        setRatings(false);
        setPriceHL(false);
        setPriceLH(false);
        setDistance(!distance);
    };

    const applyHandler = () => {
        if(ratings===true){
            setActiveFilter('rating')
        } else if(priceLH===true){
            setActiveFilter('priceLH')
        } else if(priceHL===true){
            setActiveFilter('priceHL')
        } else if(distance===true){
            setActiveFilter('distance')
        } else {
            setActiveFilter('')
        }
        props.navigation.navigate('Home');
    };

    


    return(
        <View style={styles.screen}>
            <Text style={{textAlign:'left',fontSize:25,fontWeight:'bold',marginBottom:30,marginLeft:'5%'}}>Sort</Text>
            
            <View style={{alignItems:'center'}}>
                {/* Ratings */}
                <View style={{width:'90%', height:50, borderBottomColor:'#ddd', borderBottomWidth:1,marginVertical:5,flexDirection:'row',justifyContent:'space-between', alignItems:'center'}} >
                    <Text style={{fontSize:18, fontWeight:'bold'}} >Caterers by Ratings</Text>
                    <TouchableOpacity onPress={ratingFilter}>
                        {ratings ? <Ionicon name="radio-button-on-outline" size={25} color={Colors.ORANGE}/>:<Ionicon name="radio-button-off-outline" size={25} color={Colors.GREY}/>}
                    </TouchableOpacity>
                </View>
                
                {/* Price ( L -> H ) */}
                <View style={{width:'90%', height:50, borderBottomColor:'#ddd', borderBottomWidth:1,marginVertical:5,flexDirection:'row',justifyContent:'space-between', alignItems:'center'}} >
                    <Text style={{fontSize:18, fontWeight:'bold'}} >Caterers by Price Low to High</Text>
                    <TouchableOpacity onPress={priceLowHighFilter}>
                        {priceLH ? <Ionicon name="radio-button-on-outline" size={25} color={Colors.ORANGE}/>:<Ionicon name="radio-button-off-outline" size={25} color={Colors.GREY}/>}
                    </TouchableOpacity>
                </View>
                
                {/* Price ( H -> L ) */}
                <View style={{width:'90%', height:50, borderBottomColor:'#ddd', borderBottomWidth:1,marginVertical:5,flexDirection:'row',justifyContent:'space-between', alignItems:'center'}} >
                    <Text style={{fontSize:18, fontWeight:'bold'}} >Caterers by Price High to Low</Text>
                    <TouchableOpacity onPress={priceHighLowFilter}>
                        {priceHL ? <Ionicon name="radio-button-on-outline" size={25} color={Colors.ORANGE}/>:<Ionicon name="radio-button-off-outline" size={25} color={Colors.GREY}/>}
                    </TouchableOpacity>
                </View>
                
                {/* Distance */}
                <View style={{width:'90%', height:50, borderBottomColor:'#ddd', borderBottomWidth:1,marginVertical:5,flexDirection:'row',justifyContent:'space-between', alignItems:'center'}} >
                    <Text style={{fontSize:18, fontWeight:'bold'}} >Caterers by Distance</Text>
                    <TouchableOpacity onPress={distanceFilter}>
                        {distance ? <Ionicon name="radio-button-on-outline" size={25} color={Colors.ORANGE}/>:<Ionicon name="radio-button-off-outline" size={25} color={Colors.GREY}/>}
                    </TouchableOpacity>
                </View>

                {/* Apply Button */}
                <View style={{height:50, width:'90%', marginVertical:10}} >
                    <TouchableOpacity onPress={applyHandler}>
                        <View style={{width:'100%', height:50, backgroundColor: Colors.ORANGE, borderRadius:10, alignItems:'center', justifyContent:'center'}}>
                            <Text style={{color:Colors.WHITE, fontWeight:'bold', fontSize:18}} >Apply</Text>
                        </View>
                    </TouchableOpacity>
                </View>

            </View>
        </View>
    )
};

const styles = StyleSheet.create({
    screen:{
        flex:1,
        justifyContent:'flex-end',
    }
});

export default SortScreen;
