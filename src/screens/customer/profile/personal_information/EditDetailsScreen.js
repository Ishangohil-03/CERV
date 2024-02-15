import React, { useState } from "react";
import { View, StyleSheet, Image, Text, Modal, TextInput, TouchableOpacity, Dimensions, ActivityIndicator } from "react-native";
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import ImagePicker from 'react-native-image-crop-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-simple-toast';

import{ Colors }from '../../../../CommonConfig';
import { Formik } from "formik";
import * as yup from 'yup';
import { putPostLogin } from "../../../../helpers/ApiHelpers";

const EditDetailScreen = props => {

    const user = props.route.params.user

    const [ selectedImage, setSelectedImage ] = useState(null)
    const [modalVisible, setModalVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false)
    const takeFromCamera = () => {
        ImagePicker.openCamera({
            width: 100,
            height: 100,
            cropping: true,
          }).then(image => {
            setSelectedImage(image)
            setModalVisible(!modalVisible)
          });
    }

    const pickFromGallery = () => {
        ImagePicker.openPicker({
            width: 300,
            height: 400,
            cropping: true
          }).then(image => {
            setSelectedImage(image)
            setModalVisible(!modalVisible)
          });
    }
    
    const onPressSave = async(values) => {
        setIsLoading(true)

        const updateData = new FormData()
        updateData.append('name',values.name)
        updateData.append('email', values.email)
        if(selectedImage){
            updateData.append('image',{ uri: selectedImage.path, type: selectedImage.mime, name: selectedImage.path })
        }

        console.log(updateData._parts);

        const res = await fetch('https://cerv-api.herokuapp.com/edit-profile',{
            method: "PUT",
            headers:{
                "Content-Type" : "multipart/form-data",
                "Authorization" : "Bearer " + ( await AsyncStorage.getItem('token') )
            },
            body: updateData
        })

        const response = await res.json()
        console.log(response);
        // const response = await putPostLogin('/edit-profile', data)
        if(response.status === 1) {
            await AsyncStorage.setItem('userInfo', JSON.stringify(response.data))
            Toast.show('Profile updated successfully!')
            props.navigation.pop(2);
            setIsLoading(false)
        } else {
            Toast.show('Something went wrong!')
            props.navigation.pop(2);
            setIsLoading(false)
        }
    }

    return (
        <View style={styles.screen}>
            <KeyboardAwareScrollView>
                    {/* PROFILE PICTURE */}
                    <View style={styles.ppContainer}>
                        {selectedImage ? <Image source={{ uri: selectedImage.path}} style={{height:180,width:180}}/> : <Image source={{uri: user.image}} style={styles.ppImage}/>}
                    </View>
                    <View style={{height:50,alignItems:'center'}}>
                        <TouchableOpacity  onPress={() => {setModalVisible(true)}} style={styles.ppEdit}>
                            <FontAwesome name="camera" color='white' size={25}/>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.centeredView}>
                        <Modal
                            animationType="slide"
                            transparent={true}
                            visible={modalVisible}
                            onRequestClose={() => {
                                setModalVisible(!modalVisible);
                            }}
                        >
                            <View style={styles.centeredView}>
                                <View style={styles.modalView}>
                                    <Text style={styles.modalText}>Choose option: </Text>
                                    <TouchableOpacity style={[styles.buttonModal, styles.buttonClose]} onPress={pickFromGallery}>   
                                        <Text style={styles.textStyle}>Choose from gallery</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={[styles.buttonModal, styles.buttonClose]} onPress={takeFromCamera}>
                                        <Text style={styles.textStyle}>Use Camera</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={[styles.buttonModal, styles.buttonClose]} onPress={() => {setModalVisible(false)}}>
                                        <Text style={styles.textStyle}>Close</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </Modal>
                    </View>

                    {/* DETAILS */}

                    <Formik
                        initialValues={{
                            name: user.name,
                            email:user.email
                        }}
                        onSubmit={ (values) => onPressSave(values) }
                        validationSchema={ yup.object().shape({
                            name: yup.string(),
                            email: yup.string().email('Please enter a valid email.')
                        }) }
                    >
                        { ({values, handleChange, isValid, handleSubmit, setFieldTouched}) => (
                            <View>
                                <Text style={styles.text_footer}>Username</Text>
                                <View style={styles.action}>
                                    <FontAwesome name="user" color={Colors.ORANGE} size={25}/>
                                    <TextInput 
                                        value={values.name}
                                        onBlur={() => setFieldTouched('name')}
                                        onChangeText={handleChange('name')}
                                        placeholder="Enter username"
                                        style={styles.textInput}
                                    />
                                </View>

                                <Text style={{...styles.text_footer, marginTop:15 }}>Email</Text>
                                <View style={styles.action}>
                                    <FontAwesome name="envelope" color={Colors.ORANGE} size={25}/>
                                    <TextInput 
                                        value={values.email}
                                        onBlur={() => setFieldTouched('email')}
                                        onChangeText={handleChange('email')}
                                        placeholder="Enter email"
                                        style={styles.textInput}
                                    />
                                </View>

                                <TouchableOpacity 
                                    style={{width:'100%', justifyContent:'center', marginTop:25}}    
                                    onPress={ handleSubmit } 
                                    disabled={!isValid}
                                >
                                    { isLoading ? <ActivityIndicator size={25} color={Colors.ORANGE}/> : 
                                    <View style={styles.button}>
                                        <Text style={styles.editText}>Save</Text>
                                    </View>}
                                </TouchableOpacity>

                            </View>
                        ) }
                    </Formik>

                    {/*
                    <View style={styles.detailItem}>
                        <Text style={styles.text_footer}>Username</Text>
                        <View style={styles.action} >
                            <FontAwesome name="user" color={Colors.ORANGE} size={20}/>
                            <View style={styles.input}>
                            <TextInput 
                                    placeholder={user.name}
                                    style={styles.input}
                                />
                            </View>
                        </View>
                    </View>

                    
                    <View style={styles.detailItem}>
                        <Text style={styles.text_footer}>Email</Text>
                        <View style={styles.action} >
                            <FontAwesome name="envelope" color={Colors.ORANGE} size={20}/>
                            <View style={styles.input}>
                            <TextInput 
                                    keyboardType="email-address"
                                    placeholder={Users.email}
                                    style={styles.input}
                                />
                            </View>
                        </View>
                    </View>

                    
                    <View style={styles.detailItem}>
                        <Text style={styles.text_footer}>Phone Number</Text>
                        <View style={styles.action} >
                            <FontAwesome name="phone" color={Colors.ORANGE} size={20}/>
                            <View style={styles.input}>
                            <TextInput 
                                    keyboardType="phone-pad"
                                    placeholder={Users.phone_number}
                                    style={styles.input}
                                />
                            </View>
                        </View>
                    </View>

                    
                    <View style={styles.detailItem}>
                        <Text style={styles.text_footer}>Home Postcode</Text>
                        <View style={styles.action} >
                            <FontAwesome name="home" color={Colors.ORANGE} size={20}/>
                            <View style={styles.input}>
                                <TextInput 
                                    keyboardType="numeric"
                                    placeholder={Users.post_code}
                                    style={styles.input}
                                />
                            </View>
                        </View>
                    </View> */}

                    
                        

                    {/* Save Button */}
                        
            </KeyboardAwareScrollView>
        </View>
    )
};

const styles = StyleSheet.create({
    screen:{
        flex:1,
        backgroundColor:Colors.WHITE,
        paddingVertical:10,
        paddingHorizontal:20
    },
    textInput:{
        marginHorizontal: 10
    },
    detailItem:{
        width:'85%',
        marginTop: 10
    },
    ppContainer:{
        borderRadius:90,
        overflow:'hidden',
        marginVertical: 25,
        alignSelf:'center'
    },
    ppImage:{
        height:180,
        width:180,
        zIndex:5
    },
    text_footer:{
        color:Colors.GREY,
        fontSize:15,
        fontWeight:'bold',
        marginVertical:5
    },
    input:{
        marginLeft: 15,
        fontSize: 15
    },
    action:{
        flexDirection:'row',
        borderBottomWidth:0.5,
        borderBottomColor:Colors.GREY,
        paddingVertical: 10
    },
    value:{
        fontSize:17,
        fontWeight:'700'
    },
    button:{
        backgroundColor:Colors.ORANGE,
        width:'90%',
        height:50,
        justifyContent:'center',
        borderRadius:10,
        marginTop: 5,
        marginHorizontal:'5%'
    },
    editText:{
        textAlign:'center',
        color:Colors.WHITE,
        fontSize:20,
        fontWeight:'700'
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22
    },
    modalView: {
        width:'80%',
        margin: 20,
        backgroundColor: Colors.WHITE,
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    ppEdit:{
        backgroundColor: Colors.ORANGE,
        flexDirection:'row',
        height:50,
        width:50,
        borderRadius:25,
        alignItems:'center',
        justifyContent:'center',
        position:'absolute',
        bottom:Dimensions.get('window').height* 0.1 ,
        right: Dimensions.get('window').width * 0.28
    },
    changePP:{
        textAlign:'center',
        color:Colors.WHITE,
        fontSize:15,
        fontWeight:'700',
        marginHorizontal:5
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22
    },
    modalView: {
        margin: 20,
        backgroundColor: Colors.WHITE,
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    buttonModal: {
        borderRadius: 20,
        padding: 10,
        elevation: 2,
        marginVertical:5,
        width:200
    },
    buttonClose: {
        backgroundColor: Colors.ORANGE,
    },
    textStyle: {
        color: Colors.WHITE,
        fontWeight: "bold",
        textAlign: "center"
    },
    modalText: {
        marginBottom: 15,
        textAlign: "center",
        fontWeight:'bold',
        fontSize:20
    }
});

export default EditDetailScreen;