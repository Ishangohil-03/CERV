import { ActivityIndicator, Button, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import React, { useState } from 'react';
import { Colors } from '../../../../CommonConfig';
import { Formik } from 'formik';
import { useDispatch } from 'react-redux';
import * as addressActions from '../../../../store/actions/address';
import addressIcon from '../../../../model/addressIcon';
import Ionicon from 'react-native-vector-icons/Ionicons';
import AddressValidationSchema from '../../../../schema/AddressValidationSchema';
import { postPostLogin } from '../../../../helpers/ApiHelpers';
import Toast from 'react-native-simple-toast';


const AddAddress = props => {
    const dispatch = useDispatch();
    const [ isLoading ,setIsLoading ] = useState(false)

    //0-Home, 1-Work, 2-Other
    const [radio , setRadio] = useState()

    const onPressAdd = async(values) => {
        setIsLoading(true)
        const data = {
            address_type: values.address_type,
            address: values.address,
            icon: values.icon
        }

        const response = await postPostLogin('/add-address', data)
        if(response.success) {
            dispatch(addressActions.addAddress(values))
            Toast.show('Address added successfully.')
            props.navigation.navigate('SavedAddresses');
        }
        setIsLoading(false)
    }

    return (
        <View style={styles.screen}>

            <Formik
                initialValues={{
                    address_type:'',
                    address:'',
                    icon:''
                }}
                onSubmit = { values => {
                    // console.log(values);
                    onPressAdd(values)
                }}
                validationSchema={ AddressValidationSchema }
            >
                { ({ values, errors, setFieldTouched, touched, handleChange, setFieldValue ,isValid, handleSubmit }) => (
                    <View>
                        
                        <Text style={styles.title}>TAG</Text>
                        <View style={{flexDirection:'row', justifyContent:'space-evenly', alignItems:'center'}}>
                            {/* <TextInput 
                                value={values.address_type}
                                onBlur={ () => setFieldTouched('address_type')}
                                onChangeText={handleChange('address_type')}
                                placeholder="Enter a address_type"
                                keyboardType='default'
                                maxLength={15}
                            /> */}

                            <View style={{flexDirection:'row', alignItems:'center'}}>
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
                                <Text style={{fontWeight:'bold', fontSize:20}}>Home</Text>
                            </View>

                            <View style={{flexDirection:'row', alignItems:'center'}}>
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
                                <Text style={{fontWeight:'bold', fontSize:20}}>Work</Text>
                            </View>


                            <View style={{flexDirection:'row', alignItems:'center'}}>
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
                                <Text style={{fontWeight:'bold', fontSize:20}}>Other</Text>
                            </View>


                        </View>
                        {touched.address_type && errors.address_type && 
                            <Text style={{ fontSize: 11, color: Colors.ERROR_RED , margin:10 }} >{errors.address_type}</Text>
                        }

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
                        {touched.address && errors.address && 
                            <Text style={{ fontSize: 11, color: Colors.ERROR_RED , margin:10 }} >{errors.address}</Text>
                        }
                        

                        <Text style={styles.title}>ICON</Text>
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
                        {touched.icon && errors.icon && 
                            <Text style={{ fontSize: 11, color: Colors.ERROR_RED , margin:10 }} >{errors.icon}</Text>
                        }
                        </ScrollView>

                        <TouchableOpacity style={styles.addContainer} onPress={handleSubmit} disabled={!isValid} >
                            {isLoading ? <ActivityIndicator size={'small'} color={Colors.WHITE}/> : <Text style={styles.add}>ADD</Text>}
                        </TouchableOpacity>

                    </View>
                ) }
            </Formik>

        </View>
  )
}

const styles = StyleSheet.create({
    screen:{
        flex:1,
        backgroundColor: Colors.WHITE,
        padding:20
    },
    title:{
        fontSize:18,
        fontWeight:'700',
        color:'#999',
        marginTop:15
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
    add:{
        fontWeight:'bold',
        fontSize:20,
        color: Colors.WHITE
    },
    addContainer:{
        padding:20,
        alignItems:'center',
        backgroundColor: Colors.ORANGE,
        borderRadius:5,
        marginTop:25
    }
})

export default AddAddress