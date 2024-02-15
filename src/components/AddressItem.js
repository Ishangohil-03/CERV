import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import Ionicon from 'react-native-vector-icons/Ionicons';
import * as addressActions from '../store/actions/address';
import { useDispatch } from 'react-redux';
import { Col, Row, Grid } from 'react-native-easy-grid';

import {Colors} from '../CommonConfig'; 

const AddressItem = props => {

    const dispatch = useDispatch();

    let tag;
    if(props.address_type === 0) tag = 'Home';
    if(props.address_type === 1) tag = 'Work';
    if(props.address_type === 2) tag = 'Other';

    return (
        <View style={styles.container}>
            <Grid>
                {/* Text */}
                <Col>
                    <Row style={{height:50}} ><Text style={{fontWeight:'bold', fontSize:25}} >{tag}</Text></Row>
                    <Row style={{height:30,marginTop:-10}}><Text style={{fontWeight:'600', fontSize:14}} >{props.address}</Text></Row>
                </Col>
                {/* Radio Button */}
                <Col style={{width:'10%',alignItems:'center',justifyContent:'center'}} >
                    <TouchableOpacity onPress={ () => { dispatch(addressActions.activateAddress(props.id)) } } >
                        { props.isActive ? <Ionicon name="radio-button-on-outline" size={25} color={Colors.ORANGE}/> : <Ionicon name="radio-button-off-outline" size={25} color={Colors.GREY}/> }
                    </TouchableOpacity>
                </Col>
            </Grid>
        </View>
    )
};

const styles = StyleSheet.create({
    container:{
        flexDirection:'row',
        justifyContent:'space-between', 
        borderBottomColor:Colors.GREY,
        borderBottomWidth:1, 
        flex:1, 
        height:100, 
        alignItems:'center',  
        marginHorizontal:10,
        width: Dimensions.get('window').width *0.85
    },
});

export default AddressItem;
