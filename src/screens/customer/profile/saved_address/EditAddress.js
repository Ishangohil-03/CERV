import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View, TextInput, ScrollView } from 'react-native'
import React, { useState } from 'react'
import { deletePostLogin, putPostLogin } from '../../../../helpers/ApiHelpers'
import { Formik } from 'formik'
import * as yup from 'yup';
import Ionicon from 'react-native-vector-icons/Ionicons';
import Toast from 'react-native-simple-toast';

import addressIcon from '../../../../model/addressIcon';
import { Colors } from '../../../../CommonConfig'

const EditAddress = props => {

    const addressObj = props.route.params.item
    // console.log("ADDRESS SENT TO SCREEN:            ",addressObj);

    const [ radio, setRadio ] = useState( addressObj.address_type );

    const [ delLoader, setDelLoader ] = useState(false)
    const [ editLoader, setEditLoader ] = useState(false)

    const onPressDelete = async() => {
        setDelLoader(true)
        const data = {
            addressId: addressObj.id
        }

        const deleteResponse = await deletePostLogin('/delete-address', data)
        if(!deleteResponse.success) {
            console.log(deleteResponse.data)
        } else {
            props.navigation.goBack()
        }
        setDelLoader(false)
    }

    const onPressSave = async(values) => {
        setEditLoader(true)
        const data = {
            addressId: addressObj.id,
            address_type: values.address_type,
            address: values.address,
            icon: values.icon
        }

        const saveResponse = await putPostLogin('/edit-address', data)
        // console.log(saveResponse);
        if(!saveResponse.success){
            console.log(saveResponse.data);
        } else {
            Toast.show('Address edited successfully.')
            props.navigation.goBack();
        }
        setEditLoader(false)
    }

    return (
        <View style={styles.screen}>
            <Formik
                initialValues={{
                    address_type: addressObj.address_type,
                    address: addressObj.address,
                    icon:addressObj.icon
                }}
                onSubmit = { values => onPressSave(values) }
                validationSchema = { 
                    yup.object().shape({
                        address_type: yup.number(),
                        address: yup.string(),
                        icon: yup.string() 
                    })
                }
            >
                {  ({ values, errors, setFieldTouched, touched, handleChange, setFieldValue ,isValid, handleSubmit }) => ( 
                    <>
                        {/* Edit Details */}
                        <View style={styles.inputContainer}>
                            
                            <Text style={styles.title}>TAG</Text>
                            <View style={{flexDirection:'row', justifyContent:'space-evenly', alignItems:'center'}}>
                                <View style={styles.radioBtnContainer}>
                                    {radio === 0 ? 
                                        <Ionicon name='radio-button-on' size={25} color={Colors.ORANGE}/> 
                                        : 
                                        <TouchableOpacity onPress={ () => {
                                            setRadio(0)
                                            setFieldTouched('address_type')
                                            setFieldValue('address_type',0)
                                        } }>
                                            <Ionicon name='radio-button-off' size={25} color={Colors.GREY}/> 
                                        </TouchableOpacity>
                                        }
                                    <Text style={styles.radioBtnText}>Home</Text>
                                </View>

                                <View style={styles.radioBtnContainer}>
                                    {radio === 1 ? 
                                        <Ionicon name='radio-button-on' size={25} color={Colors.ORANGE}/> 
                                        : 
                                        <TouchableOpacity onPress={ () => {
                                            setRadio(1)
                                            setFieldTouched('address_type')
                                            setFieldValue('address_type',1)
                                        } }>
                                            <Ionicon name='radio-button-off' size={25} color={Colors.GREY}/> 
                                        </TouchableOpacity>
                                        }
                                    <Text style={styles.radioBtnText}>Work</Text>
                                </View>


                                <View style={styles.radioBtnContainer}>
                                    {radio === 2 ? 
                                        <Ionicon name='radio-button-on' size={25} color={Colors.ORANGE}/> 
                                        : 
                                        <TouchableOpacity onPress={ () => {
                                            setRadio(2)
                                            setFieldTouched('address_type')
                                            setFieldValue('address_type',2)
                                        } }>
                                            <Ionicon name='radio-button-off' size={25} color={Colors.GREY}/> 
                                        </TouchableOpacity>
                                        }
                                    <Text style={styles.radioBtnText}>Other</Text>
                                </View>
                            </View>

                            <Text style={styles.title}>ADDRESS</Text>
                            <View style={styles.container}>
                                <TextInput 
                                    value={values.address}
                                    onBlur={ () => setFieldTouched('address')}
                                    onChangeText={handleChange('address')}
                                    placeholder="Enter address"
                                    keyboardType='default'
                                />
                            </View>

                            <Text style={styles.title} >ICON</Text>
                            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                <View style={{flexDirection:'row'}}> 
                                    {addressIcon.map( (item,index) => {
                                        return (
                                            <View key={index}>
                                                <TouchableOpacity style={{...styles.iconContainer, borderColor: values.icon === item.name ? Colors.ORANGE : Colors.LIGHTER_GREY}} onPress={ () => setFieldValue('icon', item.name) }>
                                                    <Ionicon name={item.name} size={25} color={Colors.GREY}/>
                                                </TouchableOpacity>
                                            </View>
                                        )
                                    } )}
                                </View>
                            </ScrollView>

                        </View>

                        {/* Buttons */}
                        <View style={styles.buttonContainer}>
                            <TouchableOpacity style={styles.buttons} onPress={onPressDelete}>
                                {delLoader ? <ActivityIndicator size={25} color={Colors.WHITE}/> : <Text style={styles.buttonText}>Delete</Text>}
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.buttons} onPress={handleSubmit}>
                                {editLoader ? <ActivityIndicator size={25} color={Colors.WHITE}/> :<Text style={styles.buttonText}>Save</Text>}
                            </TouchableOpacity>
                        </View>
                    </>
                )}
            </Formik>
        </View>
    )
}

const styles = StyleSheet.create({
    screen:{
        flex:1,
        paddingTop:10,
        paddingHorizontal:10,
        paddingBottom:25,
        justifyContent:'space-between'
    },
    buttons:{
        padding:10,
        backgroundColor: Colors.ORANGE,
        borderRadius:10,
        flex:1,
        marginHorizontal:10,
        alignItems:'center',
        justifyContent:'center'
    },
    buttonText:{
        fontWeight: 'bold',
        fontSize:20,
        color: Colors.WHITE
    },
    buttonContainer:{
        justifyContent:'space-evenly',
        flexDirection:'row',
        alignItems:'center',
        flex:0.2,
        alignItems:'flex-end',
        // backgroundColor:Colors.STAR_YELLOW
    },
    inputContainer:{
        flex:0.8
    },
    title:{
        fontSize:18,
        fontWeight:'700',
        color:'#999',
        marginTop:15
    },
    radioBtnContainer:{
        flexDirection:'row', 
        alignItems:'center'
    },
    radioBtnText:{
        fontWeight:'bold', 
        fontSize:20
    },
    container:{
        flexDirection:'row', 
        borderColor:Colors.BLACK, 
        borderWidth:1, 
        justifyContent:'space-between', 
        padding:15, 
        borderRadius:5, 
        marginTop:10
    },
    iconContainer:{
        height:50,
        width:50,
        borderRadius:25,
        borderWidth:2, 
        alignItems:'center',
        justifyContent:'center',
        margin: 5
    },
})

export default EditAddress
