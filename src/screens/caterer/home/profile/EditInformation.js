import { ActivityIndicator, Image, StyleSheet, Text, View, TextInput, ScrollView, Dimensions, TouchableOpacity, Modal } from 'react-native';
import React, { useState } from 'react'
import { Colors } from '../../../../CommonConfig';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import ImagePicker from 'react-native-image-crop-picker'
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Formik } from 'formik';
import * as yup from 'yup';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SimpleToast from 'react-native-simple-toast';
// import { TouchableOpacity } from 'react-native-gesture-handler';

const EditInformation = ({ navigation, route }) => {

    const { user } = route.params
    // console.log(user);

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

    const onPressSave = async(values) => {
        setLoading(true)

        const editData = new FormData()
        
        if(values.selectedImage){
            editData.append('image',{ uri: values.selectedImage.path, type: values.selectedImage.mime, name: makeid(10) })
        }
        editData.append('name', values.name)
        editData.append('email',values.email)
        editData.append('order_type', values.order_type)
        editData.append('category', values.category)

        const res = await fetch('https://cerv-api.herokuapp.com/caterer/edit-profile',{
            method: 'PUT',
            headers:{
                "Content-Type" : "multipart/form-data",
                "Authorization": 'Bearer ' + (await AsyncStorage.getItem('token'))
            },
            body: editData
        })

        const response = await res.json()

        // console.log(response);
        if(response.status === 1){
            SimpleToast.show('Profile Updated!')
            navigation.pop(2)
            setLoading(false)
        } else {
            SimpleToast.show('Something went wrong!')
            navigation.pop(2)
            setLoading(false)
        }
    }

    return (
        <View style={styles.screen}>
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
                    name: user.name,
                    email: user.email,
                    category: user.store.category,
                    order_type: user.store.order_type
                }}

                onSubmit={(values) => { 
                    const data = { ...values, selectedImage }
                    onPressSave(data) 
                }}

                validationSchema={
                    yup.object().shape({
                        name: yup.string(),
                        email: yup.string().email(),
                        category: yup.string(),
                        order_type: yup.number()
                    })
                }

            >
                {({ values, errors, setFieldTouched, setFieldValue, touched, handleChange, isValid, handleSubmit }) => (
                    <View>
                        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 50 }}>
                            <View style={styles.personalContainer}>
                                <View style={styles.ppContainer}>
                                    {!selectedImage && <Image source={{ uri: user.image }} style={{ flex: 1 }} />}
                                    {selectedImage && <Image source={{ uri: selectedImage.path }} style={{ flex: 1 }} />}
                                </View>
                                <TouchableOpacity style={styles.cameraBtn} onPress={() => {setModalVisible(true)}}>
                                    <FontAwesome name={'camera'} size={25} color={Colors.WHITE}/>
                                </TouchableOpacity>

                            </View>

                            <View style={styles.personalContainer}>
                                <Text style={styles.header}>Personal Information</Text>

                                <Text style={styles.label}>Caterer Name</Text>
                                <View style={styles.textField}>
                                    <FontAwesome name="user" color={Colors.ORANGE} size={20} />
                                    <TextInput
                                        value={values.name}
                                        onBlur={() => { setFieldTouched('name') }}
                                        onChangeText={handleChange('name')}
                                        autoCapitalize='none'
                                        style={styles.textInput}
                                    />
                                </View>

                                <Text style={styles.label}>Email</Text>
                                <View style={styles.textField}>
                                    <FontAwesome name="envelope" color={Colors.ORANGE} size={20} />
                                    <TextInput
                                        value={values.email}
                                        onBlur={() => { setFieldTouched('email') }}
                                        onChangeText={handleChange('email')}
                                        autoCapitalize='none'
                                        style={styles.textInput}
                                    />
                                </View>

                            </View>

                            <View style={styles.personalContainer}>
                            <Text style={styles.header}>Order Type</Text>
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

                            <View style={styles.personalContainer}>
                                <Text style={styles.header}>Food Category</Text>
                                <View style={styles.inputContainer}>
                                    <Text style={{fontSize:18}}>{values.category}</Text>
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

                        </ScrollView>
                        <View style={{ position: 'absolute', bottom: 0, zIndex: 1, width: '100%', padding: 10, backgroundColor: Colors.BACKGROUND_GREY }}>
                            <TouchableOpacity style={styles.btn} activeOpacity={0.6} onPress={handleSubmit} disabled={!isValid || loading}>
                                { loading ?
                                    <ActivityIndicator size={25} color={Colors.WHITE} />
                                    :    
                                    <Text style={styles.btnText}>Save</Text>
                                }
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
            </Formik>
        </View>
    )
}

export default EditInformation

const styles = StyleSheet.create({
    loader: {
        flex: 1,
        backgroundColor: Colors.WHITE,
        justifyContent: 'center',
        alignItems: 'center'
    },
    screen: {
        flex: 1
    },
    personalContainer: {
        backgroundColor: Colors.WHITE,
        padding: 10,
        marginBottom: 5
    },
    ppContainer: {
        alignSelf: 'center',
        height: 200,
        width: 200,
        borderRadius: 250,
        overflow: 'hidden',
        marginVertical: 15
    },
    header: {
        fontWeight: 'bold',
        fontSize: 22,
        marginTop: 10,
        marginBottom: 20
    },
    label: {
        fontWeight: 'bold',
        color: Colors.GREY,
        fontSize: 16
    },
    textField: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        borderBottomColor: Colors.LIGHTER_GREY,
        borderBottomWidth: 1,
        marginBottom: 10
    },
    textInput: {
        marginHorizontal: 10,
        flex: 0.9,
        fontWeight: 'bold',
        color: Colors.BLACK
    },
    btn: {
        padding: 15,
        backgroundColor: Colors.ORANGE,
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center'
    },
    btnText: {
        fontWeight: 'bold',
        color: Colors.WHITE,
        fontSize: 20
    },
    cameraBtn:{
        height:45,
        width:45,
        borderRadius:50,
        justifyContent:'center',
        alignItems:'center',
        backgroundColor: Colors.ORANGE,
        position:'absolute',
        top: Dimensions.get('screen').height * 0.2,
        right: Dimensions.get('screen').width  * 0.3
    },
    error:{
        color: Colors.ERROR_RED
    },
    radioContainer: {
        flexDirection: 'row',
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
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 10,
        borderBottomColor: Colors.GREY,
        borderBottomWidth: 0.5
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
})