import { ActivityIndicator, Image, StyleSheet, Text, TouchableOpacity, View, TextInput, Modal } from 'react-native'
import React, { useState } from 'react'
import { Colors } from '../../../../CommonConfig'
import { Formik } from 'formik'
import * as yup from 'yup'
import ImagePicker from 'react-native-image-crop-picker';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage'
import Toast from 'react-native-simple-toast';

const AddEditCategory = ({navigation, route}) => {

    const { mode, selectedCategory } = route.params

    const [loading, setLoading] = useState(false)
    const [selectedImage, setSelectedImage] = useState(null)
    const [modalVisible, setModalVisible] = useState(false)
    const [showError, setShowError] = useState(false)

    const isEditMode = mode === 'edit' ? true : false
    const isAddMode = mode === 'add' ? true : false

    const takeFromCamera = () => {
        ImagePicker.openCamera({
            cropping: true,
        }).then(image => {
            setSelectedImage(image)
            setModalVisible(!modalVisible)
        });
    }

    const pickFromGallery = () => {
        ImagePicker.openPicker({
            cropping: true
        }).then(image => {
            setSelectedImage(image)
            setModalVisible(!modalVisible)
        });
    }

    // Random Name generator for images
    const makeid = (length) => {
        var result           = '';
        var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for ( var i = 0; i < length; i++ ) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
       return result;
    }

    const editCategory = async(values) => {
        setLoading(true)
        const updateCategory = new FormData()
        if(values.selectedImage){
            updateCategory.append('image',{ uri: values.selectedImage.path, type: values.selectedImage.mime, name: makeid(10) })
        }
        updateCategory.append('title', values.categoryName)

        const res = await fetch(`https://cerv-api.herokuapp.com/caterer/edit-category/${selectedCategory.id}`,{
            method: 'PUT',
            headers:{
                "Content-Type" : "multipart/form-data",
                "Authorization" : 'Bearer ' + ( await AsyncStorage.getItem('token') )
            },
            body: updateCategory
        })
        const response = await res.json()

        if(response.status === 1){
            Toast.show("Category updated successfully!")
            navigation.goBack()
            setLoading(false)
        } else {
            Toast.show("Something went wrong!")
            navigation.goBack()
            setLoading(false)
        }
    }

    const addCategory = async(values) => {
        setLoading(true)
        const newCategory = new FormData()
        newCategory.append('image',{ uri: values.selectedImage.path, type: values.selectedImage.mime, name: makeid(10) })
        newCategory.append('title', values.categoryName)

        const res = await fetch('https://cerv-api.herokuapp.com/caterer/add-category',{
            method: 'POST',
            headers:{
                "Content-Type" : "multipart/form-data",
                "Authorization" : 'Bearer ' + ( await AsyncStorage.getItem('token') )
            },
            body: newCategory
        })
        const response = await res.json()

        if(response.status === 1){
            Toast.show("Category added successfully!")
            navigation.goBack()
            setLoading(false)
        } else {
            Toast.show("Something went wrong!")
            navigation.goBack()
            setLoading(false)
        }
    }

    if(loading) {
        return(
            <View style={styles.loader}>
                <ActivityIndicator size={65} color={Colors.ORANGE}/>
            </View>
        )
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
            
            <Text style={styles.label}>Category Photo</Text>
            <View>
                {isEditMode && 
                    <View style={styles.imageContainer}> 
                        <Image source={{uri: selectedImage ? selectedImage.path : selectedCategory.image}} style={{flex:1}}/>
                    </View>
                }
                {isAddMode && ( 
                    selectedImage ? 
                        <View style={styles.imageContainer}> 
                            <Image source={{uri: selectedImage.path }} style={{flex:1}}/> 
                        </View>
                        : 
                        <TouchableOpacity style={[styles.imageContainer,{ backgroundColor: Colors.LIGHTEST_GREY, alignItems:'center', justifyContent:'center'}]} onPress={() => {setModalVisible(true)}}>
                            <Ionicons name={'camera'} size={100} color={Colors.WHITE}/>
                        </TouchableOpacity>
                )}
                { isEditMode && !selectedImage &&
                    //Camera Button
                    <TouchableOpacity style={styles.cameraBtn} onPress={() => {setModalVisible(true)}}>
                        <Ionicons name={'camera'} size={25} color={Colors.WHITE}/>
                    </TouchableOpacity>
                }
                { isEditMode && selectedImage &&
                    //Delete Button
                    <TouchableOpacity style={styles.deleteImageBtn} onPress={() => {setSelectedImage(null)}}>
                        <Ionicons name={'close'} size={25} color={Colors.WHITE}/>
                    </TouchableOpacity>
                }
                { isAddMode && selectedImage &&
                    //Delete Button
                    <TouchableOpacity style={styles.deleteImageBtn} onPress={() => {setSelectedImage(null)}}>
                        <Ionicons name={'close'} size={25} color={Colors.WHITE}/>
                    </TouchableOpacity>
                }
            </View>
            { isAddMode && !selectedImage && showError && <Text style={{ fontSize: 11, color: Colors.ERROR_RED, margin: 10 }}>Please select an image for the category.</Text> }


            <Formik
                initialValues={{
                    categoryName: isAddMode ? "" : selectedCategory.title
                }}

                onSubmit={ (values) => {
                    if(isEditMode) {
                        editCategory({...values, selectedImage})
                    } else if(isAddMode){
                        if(!selectedImage){
                            setShowError(true)
                        } else {
                            setShowError(false)
                            addCategory({...values, selectedImage})
                        }
                    }
                } }

                validationSchema={
                    isAddMode ?
                        yup.object().shape({
                            categoryName: yup.string().min(3, "Category name must have atleast 3 characters").required("Name of category is required")
                        })
                        :
                        yup.object().shape({
                            categoryName: yup.string().min(3, "Category name must have atleast 3 characters")
                        })
                }
            >
                {({ values, errors, setFieldTouched, touched, handleChange, isValid, handleSubmit }) => (
                    <View style={{flex:1, justifyContent:'space-between'}}>

                        <View>
                            <Text style={styles.label}>Category Name</Text>
                            <View style={styles.container}>
                                <TextInput
                                    value={values.categoryName}
                                    editable={ isEditMode || isAddMode}
                                    onBlur={() => setFieldTouched('categoryName')}
                                    onChangeText={handleChange('categoryName')}
                                    keyboardType={'default'}
                                    style={{ flex: 1, color: Colors.BLACK, fontSize:16, fontWeight:'bold' }}
                                />
                            </View>
                            {touched.categoryName && errors.categoryName &&
                                <Text style={{ fontSize: 11, color: Colors.ERROR_RED, margin: 10 }}>{errors.categoryName}</Text>
                            }
                        </View>

                        <TouchableOpacity style={styles.saveBtn} disabled={!isValid} onPress={handleSubmit}>
                            <Text style={styles.saveBtnTxt}>SAVE</Text>
                        </TouchableOpacity>

                    </View>
                )}
            </Formik>

        </View>
    )
}

export default AddEditCategory

const styles = StyleSheet.create({
    loader:{
        flex:1,
        backgroundColor: Colors.WHITE,
        alignItems:'center',
        justifyContent:'center'
    },
    screen:{
        flex:1,
        padding:10,
        backgroundColor: Colors.WHITE
    },
    imageContainer:{
        height:200,
        width: '95%',
        alignSelf:'center',
        borderRadius:10,
        overflow:'hidden',
        marginVertical:10
    },
    label:{
        fontWeight:'bold',
        fontSize:18,
        color: Colors.GREY,
        marginTop: 10
    },
    container: {
        flexDirection: 'row',
        borderBottomColor: Colors.GREY,
        borderBottomWidth: 0.5,
        justifyContent: 'space-between',
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 5,
        marginVertical: 10
    },
    saveBtn:{
        alignItems:'center',
        justifyContent:'center', 
        padding:15,
        backgroundColor: Colors.ORANGE,
        borderRadius: 10
    },
    saveBtnTxt:{
        fontWeight:'bold',
        color: Colors.WHITE,
        fontSize: 18
    },
    deleteImageBtn:{
        backgroundColor: Colors.ERROR_RED, 
        height:40, 
        width:40, 
        alignItems:'center', 
        justifyContent:'center',
        borderRadius:40,
        position:'absolute',
        right:15,
        top:15
    },
    cameraBtn:{
        backgroundColor: Colors.ORANGE, 
        height:40, 
        width:40, 
        alignItems:'center', 
        justifyContent:'center',
        borderRadius:40,
        position:'absolute',
        right:15,
        top:15
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