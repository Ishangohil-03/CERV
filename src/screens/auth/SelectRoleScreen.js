import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Image, StatusBar } from 'react-native';
import * as Animatable from 'react-native-animatable';

import * as registerActions from '../../store/actions/register';
import Button from '../../components/Button';
import{ Colors, Images }from '../../CommonConfig';
import { useDispatch } from 'react-redux';

const SelectRoleScreen = props => {

    const dispatch = useDispatch();

    const [customerActive, setCustomerActive] = useState(false);
    const [catererActive, setCatererActive] = useState(false);
    const [showButton, setShowButton] = useState(false);

    const customerActiveHandler = () => {
        setCustomerActive(true);
        setCatererActive(false);
        setShowButton(true);
    }

    const catererActiveHandler = () => {
        setCustomerActive(false);
        setCatererActive(true);
        setShowButton(true);
    }


    return(
        <View style={styles.screen}>
            <StatusBar backgroundColor={Colors.WHITE} barStyle='dark-content'/>
            {/* Header (Title) */}
            <View style={{flex:1,width:'100%', padding:10}}>
                <Text style={{fontWeight:'bold',fontSize:40}}>Select your Role</Text>
            </View>

            {/* Body (Options) */}
            <View style={{flex:8}}>
                <View style={{flex:4, justifyContent:'center', alignItems:'center'}}>
                    <TouchableOpacity onPress={customerActiveHandler}>
                        <View style={ {...styles.roleButton , borderColor:customerActive? Colors.ORANGE : '#ccc'}}>
                            <Image source={Images.CUSTOMER_ROLE} style={{height:150, width:150, opacity: customerActive ? 1:0.3}}/>
                        </View>
                    </TouchableOpacity>
                </View>
                <View style={{flex:4, justifyContent:'center', alignItems:'center'}}>
                    <TouchableOpacity onPress={catererActiveHandler}>
                        <View style={{...styles.roleButton , borderColor:catererActive ? Colors.ORANGE :'#ccc'}}>
                            <Image source={Images.CATERER_ROLE} style={{height:150, width:150,opacity: catererActive ? 1:0.3}}/>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Footer (Button) */}
            <View style={{flex:1 ,width:'100%', paddingHorizontal:15, paddingBottom:10,justifyContent:'center'}}>
                {showButton ? <Button 
                    onPress={ () => {
                        dispatch(registerActions.setUserRole(customerActive? 1 : 0))
                        props.navigation.navigate('SignInScreen',{ role: customerActive ? 1 : 0 })
                    }}
                    title = { customerActive ? " I'm Customer" : "I'm Caterer" }
                /> : null }
            </View>

        </View>
    );
};

const styles = StyleSheet.create({
    screen:{
        flex:1,
        alignItems:'center',
        justifyContent:'center',
        backgroundColor:'#fff'
    },
    roleButton:{
        alignItems:'center',
        justifyContent:'center', 
        borderRadius:125, 
        height:250, 
        width:250, 
        borderWidth:3
    }
});

export default SelectRoleScreen;
