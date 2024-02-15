import { StatusBar, StyleSheet, Text, TextInput, View, Modal, Dimensions, TouchableOpacity, Image, Button, ScrollView, ActivityIndicator } from 'react-native'
import React, { useState } from 'react'
import { Colors } from '../../CommonConfig'
import { Formik } from 'formik'
import * as yup from 'yup'
import ImagePicker from 'react-native-image-crop-picker'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Ionicons from 'react-native-vector-icons/Ionicons'
import SimpleToast from 'react-native-simple-toast'
import { CommonActions } from '@react-navigation/native'

const StoreRegister = ({ navigation, route }) => {

    const { catererId } = route.params

    const [loading, setLoading] = useState(false)
    const [selectedImage, setSelectedImage] = useState(null)
    const [modalVisible, setModalVisible] = useState(false);

    const takeFromCamera = () => {
        ImagePicker.openCamera({}).then(image => {
            // dispatch(registerActions.addImage(image))
            setSelectedImage(image)
            setModalVisible(!modalVisible)
        });
    }

    const pickFromGallery = () => {
        ImagePicker.openPicker({}).then(image => {
            // dispatch(registerActions.addImage(image))
            setSelectedImage(image)
            setModalVisible(!modalVisible)
        });
    }

    // Random Name generator
    const makeid = (length) => {
        var result           = '';
        var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for ( var i = 0; i < length; i++ ) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
       return result;
    }

    const storeRegister = async(values) => {
        setLoading(true)
        const registerCaterer = new FormData()
        registerCaterer.append('license_num', values.license_num)
        registerCaterer.append('image',{ uri: values.selectedImage.path, type: values.selectedImage.mime, name: makeid(10) })
        registerCaterer.append('address',values.address)
        registerCaterer.append('latitude', values.latitude)
        registerCaterer.append('longitude', values.longitude)
        registerCaterer.append('bio', values.bio)
        registerCaterer.append('order_type', values.order_type)
        registerCaterer.append('category', values.category)
        registerCaterer.append('catererId', values.catererId)

        const res = await fetch('https://cerv-api.herokuapp.com/users/storeDetails',{
            method: 'POST',
            headers:{
                "Content-Type" : "multipart/form-data"
            },
            body: registerCaterer
        })
        const response = await res.json()

        console.log(response)

        if(response.status === 1) {
            SimpleToast.show('Registration successful!')
            SimpleToast.show('Please wait for admin to grant access!')
            navigation.dispatch(
                CommonActions.reset({
                    index:0 ,
                    routes: [{name: 'Auth'}]
                })
            )
            setLoading(false)
        } else {
            SimpleToast.show('Something went wrong!')
            navigation.dispatch(
                CommonActions.reset({
                    index:0 ,
                    routes: [{name: 'Auth'}]
                })
            )
            setLoading(false)
        }
    }

    if(loading){
        return(
            <View style={styles.loader}>
                <ActivityIndicator size={65} color={Colors.ORANGE}/>
            </View>
        )
    }

    return (
        <View style={styles.screen}>
            <StatusBar backgroundColor={Colors.WHITE} barStyle={'dark-content'} />
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
                        <TouchableOpacity
                            style={[styles.buttonModal, styles.buttonClose]}
                            onPress={pickFromGallery}
                        >
                            <Text style={styles.textStyle}>Choose from gallery</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.buttonModal, styles.buttonClose]}
                            onPress={takeFromCamera}
                        >
                            <Text style={styles.textStyle}>Use Camera</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.buttonModal, styles.buttonClose]}
                            onPress={() => { setModalVisible(false) }}
                        >
                            <Text style={styles.textStyle}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            <Formik
                initialValues={{
                    license_num: '',
                    address: '',
                    latitude: 21.1475640,
                    longitude: 72.7916070,
                    bio: '',
                    order_type: 0,
                    category: ''
                }}

                onSubmit={(values) => { storeRegister({...values, selectedImage, catererId}) }}

                validationSchema={
                    yup.object().shape({
                        license_num: yup.string().min(10, "License number should be atleast 10 digits long").max(12, "License number should be atmost 12 digits long").required('License number is mandatory.'),
                        address: yup.string().required('Address is mandatory.'),
                        bio: yup.string().required('Please add a little about your store.'),
                        category: yup.string().required('Please select atleast 1 food category'),
                        order_type: yup.number().required('Please select a type of order.')
                    })}
            >
                {({ values, errors, setFieldTouched, setFieldValue, touched, handleChange, isValid, handleSubmit }) => (
                    <View>
                        <KeyboardAwareScrollView>
                            <View style={styles.sectionContainer}>
                                <Text style={styles.title}>Business Information</Text>

                                <Text style={styles.inputLabel}>Business License Number</Text>
                                <View style={styles.inputContainer}>
                                    <TextInput
                                        value={values.license_num}
                                        onBlur={() => setFieldTouched('license_num')}
                                        onChangeText={handleChange('license_num')}
                                        maxLength={12}
                                        keyboardType='number-pad'
                                        style={{ flex: 1 }}
                                    />
                                </View>
                                {touched.license_num && errors.license_num && <Text style={styles.error}>{errors.license_num}</Text>}

                                <Text style={styles.inputLabel}>Business License Image</Text>
                                <TouchableOpacity style={[styles.licenseImageContainer, !selectedImage ? {alignItems:'center', justifyContent:'center'} : {}]} onPress={() => { setModalVisible(true) }}>
                                    {!selectedImage && <Ionicons name='camera' size={50} color={Colors.WHITE}/>}
                                    {selectedImage && <Image source={{ uri: selectedImage.path }} style={{ flex: 1 }} />}
                                </TouchableOpacity>

                                <Text style={styles.inputLabel}>Address</Text>
                                <View style={styles.inputContainer}>
                                    <TextInput
                                        value={values.address}
                                        onBlur={() => setFieldTouched('address')}
                                        onChangeText={handleChange('address')}
                                        keyboardType='default'
                                        style={{ flex: 1 }}
                                    />
                                </View>
                                {touched.address && errors.address && <Text style={styles.error}>{errors.address}</Text>}

                                <Text style={styles.inputLabel}>Bio</Text>
                                <View style={styles.inputContainer}>
                                    <TextInput
                                        value={values.bio}
                                        onBlur={() => setFieldTouched('bio')}
                                        onChangeText={handleChange('bio')}
                                        keyboardType='default'
                                        multiline
                                        style={{ flex: 1 }}
                                    />
                                </View>
                                {touched.bio && errors.bio && <Text style={styles.error}>{errors.bio}</Text>}

                            </View>

                            <View style={styles.sectionContainer}>
                                <Text style={styles.title}>Order Type</Text>
                                <View style={styles.radioContainer}>

                                    <View style={[styles.radioBtn, { justifyContent: 'center' }]} >
                                        <TouchableOpacity onPress={() => {
                                            setFieldTouched('order_type')
                                            setFieldValue('order_type', 0)
                                        }}>
                                            {values.order_type === 0 ?
                                                <Ionicons name={'radio-button-on'} color={Colors.ORANGE} size={25} />
                                                :
                                                <Ionicons name={'radio-button-off'} color={Colors.GREY} size={25} />
                                            }
                                        </TouchableOpacity>
                                        <Text style={[styles.title,{fontSize:18}]}>Delivery</Text>
                                    </View>

                                    <View style={[styles.radioBtn, { justifyContent: 'center' }]} >
                                        <TouchableOpacity onPress={() => {
                                            setFieldTouched('order_type')
                                            setFieldValue('order_type', 1)
                                        }}>
                                            {values.order_type === 1 ?
                                                <Ionicons name={'radio-button-on'} color={Colors.ORANGE} size={25} />
                                                :
                                                <Ionicons name={'radio-button-off'} color={Colors.GREY} size={25} />
                                            }
                                        </TouchableOpacity>
                                        <Text style={[styles.title,{fontSize:18}]}>Pickup</Text>
                                    </View>

                                    <View style={[styles.radioBtn, { justifyContent: 'center' }]} >
                                        <TouchableOpacity onPress={() => {
                                            setFieldTouched('order_type')
                                            setFieldValue('order_type', 2)
                                        }}>
                                            {values.order_type === 2 ?
                                                <Ionicons name={'radio-button-on'} color={Colors.ORANGE} size={25} />
                                                :
                                                <Ionicons name={'radio-button-off'} color={Colors.GREY} size={25} />
                                            }
                                        </TouchableOpacity>
                                        <Text style={[styles.title,{fontSize:18}]}>Both</Text>
                                    </View>

                                </View>
                            </View>

                            <View style={styles.sectionContainer}>

                                <Text style={styles.title}>Food Category</Text>
                                <View style={styles.inputContainer}>
                                    <Text style={[styles.title,{fontSize:18}]}>{values.category}</Text>
                                </View>
                                <View style={styles.cardForm}>

                                    <View style={styles.radioBtn} >
                                        <TouchableOpacity onPress={() => {
                                            setFieldTouched('category')
                                            setFieldValue('category', 'Chinese')
                                        }}>
                                            {values.category === 'Chinese' ?
                                                <Ionicons name={'radio-button-on'} color={Colors.ORANGE} size={25} />
                                                :
                                                <Ionicons name={'radio-button-off'} color={Colors.GREY} size={25} />
                                            }
                                        </TouchableOpacity>
                                        <Text>Chinese</Text>
                                    </View>

                                    <View style={styles.radioBtn} >
                                        <TouchableOpacity onPress={() => {
                                            setFieldTouched('category')
                                            setFieldValue('category', 'Indian')
                                        }}>
                                            {values.category === 'Indian' ?
                                                <Ionicons name={'radio-button-on'} color={Colors.ORANGE} size={25} />
                                                :
                                                <Ionicons name={'radio-button-off'} color={Colors.GREY} size={25} />
                                            }
                                        </TouchableOpacity>
                                        <Text>Indian</Text>
                                    </View>

                                    <View style={styles.radioBtn} >
                                        <TouchableOpacity onPress={() => {
                                            setFieldTouched('category')
                                            setFieldValue('category', 'Thai')
                                        }}>
                                            {values.category === 'Thai' ?
                                                <Ionicons name={'radio-button-on'} color={Colors.ORANGE} size={25} />
                                                :
                                                <Ionicons name={'radio-button-off'} color={Colors.GREY} size={25} />
                                            }
                                        </TouchableOpacity>
                                        <Text>Thai</Text>
                                    </View>

                                    <View style={styles.radioBtn} >
                                        <TouchableOpacity onPress={() => {
                                            setFieldTouched('category')
                                            setFieldValue('category', 'Italian')
                                        }}>
                                            {values.category === 'Italian' ?
                                                <Ionicons name={'radio-button-on'} color={Colors.ORANGE} size={25} />
                                                :
                                                <Ionicons name={'radio-button-off'} color={Colors.GREY} size={25} />
                                            }
                                        </TouchableOpacity>
                                        <Text>Italian</Text>
                                    </View>

                                    <View style={styles.radioBtn} >
                                        <TouchableOpacity onPress={() => {
                                            setFieldTouched('category')
                                            setFieldValue('category', 'Mexican')
                                        }}>
                                            {values.category === 'Mexican' ?
                                                <Ionicons name={'radio-button-on'} color={Colors.ORANGE} size={25} />
                                                :
                                                <Ionicons name={'radio-button-off'} color={Colors.GREY} size={25} />
                                            }
                                        </TouchableOpacity>
                                        <Text>Mexican</Text>
                                    </View>

                                    <View style={styles.radioBtn} >
                                        <TouchableOpacity onPress={() => {
                                            setFieldTouched('category')
                                            setFieldValue('category', 'Korean')
                                        }}>
                                            {values.category === 'Korean' ?
                                                <Ionicons name={'radio-button-on'} color={Colors.ORANGE} size={25} />
                                                :
                                                <Ionicons name={'radio-button-off'} color={Colors.GREY} size={25} />
                                            }
                                        </TouchableOpacity>
                                        <Text>Korean</Text>
                                    </View>

                                </View>
                            </View>

                            <View style={styles.footer}>
                                <TouchableOpacity style={styles.saveBtn} onPress={handleSubmit} disabled={!selectedImage || !isValid}>
                                    <Text style={styles.saveBtnText}>Save</Text>
                                </TouchableOpacity>
                            </View>

                        </KeyboardAwareScrollView>
                    </View>
                )}
            </Formik>

        </View>
    )
}

export default StoreRegister

const styles = StyleSheet.create({
    loader:{
        flex:1,
        alignItems:'center',
        justifyContent:'center',
        backgroundColor: Colors.WHITE
    },
    screen: {
        flex: 1,
    },
    sectionContainer: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        backgroundColor: Colors.WHITE,
        marginBottom: 5
    },
    title: {
        fontWeight: 'bold',
        fontSize: 22
    },
    inputLabel: {
        marginTop: 25,
        fontWeight: 'bold',
        color: Colors.GREY,
        fontSize: 18
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 10,
        borderBottomColor: Colors.GREY,
        borderBottomWidth: 0.5
    },
    error: {
        fontSize: 11,
        color: 'red'
    },
    licenseImageContainer: {
        width: '100%',
        height: 200,
        backgroundColor: Colors.GREY,
        borderRadius: 10,
        marginVertical: 10,
        overflow: 'hidden',
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
        marginVertical: 5,
        width: 200
    },
    buttonOpen: {
        backgroundColor: "#F194FF",
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
        fontWeight: 'bold',
        fontSize: 20
    },
    radioContainer: {
        flexDirection: 'row',
        paddingVertical: 10,
        alignItems: 'center',
        justifyContent: 'space-evenly'
    },
    radioBtn: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical:10,
    },
    cardForm: {
        padding: 10,
        marginVertical: 10,
        elevation: 1,
    },
    footer:{
        backgroundColor: Colors.WHITE,
        width:'100%',
        padding:10,
        alignItems:'center',
        justifyContent:'center'
    },
    saveBtn:{
        padding:15,
        width:'100%',
        backgroundColor: Colors.ORANGE,
        borderRadius: 10,
        alignItems:'center',
        justifyContent:'center'
    }, 
    saveBtnText:{
        fontWeight:'bold',
        fontSize: 18,
        color: Colors.WHITE
    }
})