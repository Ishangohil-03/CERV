import React, { useState } from 'react'
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Modal, StatusBar, Image, Dimensions } from 'react-native';
import * as Animatable from 'react-native-animatable';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicon from 'react-native-vector-icons/Ionicons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import ImagePicker from 'react-native-image-crop-picker';
import { Formik } from 'formik';
import { Colors, Images } from '../../CommonConfig';
import SignUpValidationSchema from '../../schema/SignUpValidationSchema';

const SignUpScreen = props => {
    const role = props.route.params.role

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

    const [eyeTouched, setEyeTouched] = useState(true)
    const [eyeCTouched, setEyeCTouched] = useState(true)

    const [tnc, setTnc] = useState(false);
    const [tncTouched, setTncTouched] = useState(false)
    const tncHandler = () => {
        setTncTouched(true)
        setTnc(state => !state);
    };

    return (
        <View>
            <StatusBar backgroundColor={Colors.ORANGE} barStyle='light-content' />
            <KeyboardAwareScrollView>
                <View style={styles.container} >

                    <View style={styles.header}>
                        <View style={{ flex: 0.8 }}>
                            <TouchableOpacity onPress={() => props.navigation.goBack()} style={{ marginVertical: 10 }}>
                                <Ionicon name="arrow-back-outline" size={35} color={Colors.WHITE} />
                            </TouchableOpacity>
                            <Text style={styles.headerLabel}>Let's Start</Text>
                            <Text style={styles.headerText}>Tell us more about you!</Text>
                        </View>
                        <Image source={Images.AUTH_HEADER2} style={styles.image} />
                    </View>

                    <Animatable.View style={styles.footer} animation="fadeInUpBig">

                        {/* PROFILE PICTURE */}
                        <View style={styles.ppContainer}>
                            <View style={styles.profile_picture}>
                                {selectedImage ? <Image source={{ uri: selectedImage.path }} style={{ height: 100, width: 100 }} /> : <Image source={Images.PROFILE_PLACEHOLDER} style={{ height: 100, width: 100 }} />}
                            </View>

                            <View style={styles.add_icon}>
                                <TouchableOpacity onPress={() => { setModalVisible(true) }} >
                                    <Ionicon name="add-outline" color={Colors.ORANGE} size={30} />
                                </TouchableOpacity>
                            </View>
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
                        </View>
                        <Formik
                            initialValues={{
                                username: '',
                                email: '',
                                password: '',
                                confirmPassword: ''
                            }}
                            onSubmit={(values) => {
                                const data = { username: values.username, email: values.email, password: values.password , role ,selectedImage}
                                // dispatch(registerActions.addDetails(data));
                                props.navigation.navigate('NumberVerificationScreen',{ data })
                            }}
                            validationSchema={SignUpValidationSchema}
                        >
                            {({ values, errors, setFieldTouched, touched, handleChange, isValid, handleSubmit }) => (
                                <View>

                                    <Text style={styles.text_footer} >User Name</Text>
                                    <View style={{ ...styles.action, justifyContent: 'space-between' }} >
                                        <View style={{ flexDirection: 'row' }}>
                                            <FontAwesome name="user" color={Colors.ORANGE} size={20} />
                                            <TextInput
                                                onBlur={() => setFieldTouched('username')}
                                                onChangeText={handleChange('username')}
                                                placeholder="Username"
                                                style={styles.textInput}
                                            />
                                        </View>
                                        {touched.username && !errors.username && <Feather name="check-circle" color="green" size={20} />}
                                    </View>
                                    {touched.username && errors.username &&
                                        <Text style={styles.errorMsg}>{errors.username}</Text>
                                    }

                                    <Text style={{ ...styles.text_footer, marginTop: 15 }} >Email</Text>
                                    <View style={{ ...styles.action, justifyContent: 'space-between' }} >
                                        <View style={{ flexDirection: 'row' }}>
                                            <FontAwesome name="envelope" color={Colors.ORANGE} size={20} />
                                            <TextInput
                                                value={values.email}
                                                onBlur={() => setFieldTouched('email')}
                                                onChangeText={handleChange('email')}
                                                placeholder="Email"
                                                style={styles.textInput}
                                                autoCapitalize='none'
                                            />
                                        </View>
                                        {touched.email && !errors.email && <Feather name="check-circle" color="green" size={20} />}
                                    </View>
                                    {touched.email && errors.email &&
                                        <Text style={styles.errorMsg}>{errors.email}</Text>
                                    }

                                    <Text style={{ ...styles.text_footer, marginTop: 15 }} >Password</Text>
                                    <View style={{ ...styles.action, justifyContent: 'space-between' }} >
                                        <View style={{ flexDirection: 'row' }}>
                                            <FontAwesome name="lock" color={Colors.ORANGE} size={20} />
                                            <TextInput
                                                value={values.password}
                                                onBlur={() => setFieldTouched('password')}
                                                onChangeText={handleChange('password')}
                                                placeholder="Password"
                                                style={styles.textInput}
                                                secureTextEntry={eyeTouched ? true : false}
                                            />
                                        </View>
                                        <TouchableOpacity onPress={() => setEyeTouched(!eyeTouched)} >
                                            {!eyeTouched ? <Feather name="eye-off" color={Colors.GREY} size={20} /> : <Feather name="eye" color={Colors.GREY} size={20} />}
                                        </TouchableOpacity>
                                    </View>
                                    {touched.password && errors.password &&
                                        <Text style={styles.errorMsg}>{errors.password}</Text>
                                    }

                                    <Text style={{ ...styles.text_footer, marginTop: 15 }} >Confirm Password</Text>
                                    <View style={{ ...styles.action, justifyContent: 'space-between' }} >
                                        <View style={{ flexDirection: 'row' }}>
                                            <FontAwesome name="lock" color={Colors.ORANGE} size={20} />
                                            <TextInput
                                                onBlur={() => setFieldTouched('confirmPassword')}
                                                onChangeText={handleChange('confirmPassword')}
                                                placeholder="Confirm your password"
                                                style={styles.textInput}
                                                secureTextEntry={eyeCTouched ? true : false}
                                            />
                                        </View>
                                        <TouchableOpacity onPress={() => setEyeCTouched(!eyeCTouched)} >
                                            {!eyeCTouched ? <Feather name="eye-off" color={Colors.GREY} size={20} /> : <Feather name="eye" color={Colors.GREY} size={20} />}
                                        </TouchableOpacity>
                                    </View>
                                    {touched.confirmPassword && errors.confirmPassword &&
                                        <Text style={styles.errorMsg}>{errors.confirmPassword}</Text>
                                    }

                                    <View style={{ flexDirection: 'row', marginTop: 10 }} >
                                        <TouchableOpacity onPress={tncHandler} >
                                            {tnc ? <Ionicon name="checkbox-outline" color="green" size={20} /> : <Ionicon name="square-outline" color={Colors.GREY} size={20} />}
                                        </TouchableOpacity>
                                        <Text style={styles.tandc} >I Agree to the <Text style={styles.sp_tandc} >Terms {'&'} Conditions</Text> and <Text style={styles.sp_tandc}>Privacy Policy</Text></Text>
                                    </View>
                                    {tncTouched ? (tnc ? null : <Text style={styles.errorMsg}>Please check the terms and conditions.</Text>) : null}

                                    <TouchableOpacity style={styles.next} disabled={!isValid} onPress={tnc ? handleSubmit : null}>
                                        <Text style={styles.nextText}>Next</Text>
                                    </TouchableOpacity>


                                </View>)}
                        </Formik>

                    </Animatable.View>
                </View>
            </KeyboardAwareScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.ORANGE,
    },
    next: {
        backgroundColor: Colors.ORANGE,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
        borderRadius: 5,
        marginTop: 15
    },
    nextText: {
        color: Colors.WHITE,
        fontWeight: 'bold',
        letterSpacing: 1,
        fontSize: 20
    },
    header: {
        flex: 1,
        justifyContent: 'space-between',
        flexDirection: 'row',
        paddingHorizontal: 10
    },
    headerLabel: {
        color: Colors.WHITE,
        fontWeight: 'bold',
        fontSize: 26,
    },
    headerText: {
        color: Colors.WHITE,
        fontWeight: '600',
        fontSize: 15,
        width: '100%',
        margin: 10
    },
    footer: {
        flex: 3,
        backgroundColor: '#fff',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingHorizontal: 20,
        paddingVertical: 30
    },
    action: {
        flexDirection: 'row',
        marginTop: 10,
        marginBottom: 5,
        borderBottomWidth: 1,
        borderBottomColor: Colors.GREY,
        paddingBottom: 10
    },
    image: {
        marginVertical: 10,
        marginRight: 5,
        height: 180,
        width: 180
    },
    signIn: {
        width: '100%',
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        backgroundColor: Colors.ORANGE
    },
    textSign: {
        fontSize: 18,
        fontWeight: 'bold'
    },
    headerText: {
        color: Colors.WHITE,
        fontSize: 15
    },
    forgotPassword: {
        textAlign: 'right',
        marginTop: 15,
        fontSize: 15
    },
    footerTitle: {
        fontWeight: 'bold',
        fontSize: 30,
        marginTop: 10
    },
    footerText: {
        fontSize: 18,
        marginTop: 5,
        marginBottom: 40,
        color: Colors.GREY
    },
    signUp: {
        fontSize: 18,
        color: '#131211'
    },
    register: {
        fontWeight: 'bold'
    },
    tandc: {
        color: Colors.BLACK,
        fontSize: 15,
        marginLeft: 10
    },
    sp_tandc: {
        fontWeight: 'bold',
        color: Colors.ORANGE,
    },
    ppContainer: {
        alignItems: 'center',
        marginBottom: 20
    },
    profile_picture: {
        borderRadius: 50,
        borderColor: Colors.GREY,
        borderWidth: 1,
        overflow: 'hidden'
    },
    add_icon: {
        borderRadius: 15,
        backgroundColor: Colors.WHITE,
        shadowColor: '#171717',
        shadowOffset: { width: -2, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 10,
        position: 'absolute',
        bottom: Dimensions.get('window').height * 0.002,
        right: Dimensions.get('window').width * 0.315
    },
    error: {
        color: Colors.ERROR_RED
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
    footerLabel: {
        fontWeight: 'bold',
        color: Colors.BLACK,
        fontSize: 35
    },
    footerText: {
        fontWeight: '800',
        color: Colors.BLACK,
        fontSize: 20
    },
    text_footer: {
        color: Colors.GREY,
        fontSize: 18,
        fontWeight: 'bold',
    },
    textInput: {
        marginHorizontal: 10,
        // flex:1,
        width: '70%'
    },
    errorMsg: {
        fontSize: 11,
        color: Colors.ERROR_RED
    },
    forgotPassword: {
        textAlign: 'right',
        marginTop: 15,
        fontSize: 15
    },
    signIn: {
        width: '100%',
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        backgroundColor: Colors.ORANGE
    },
    textSign: {
        fontSize: 18,
        fontWeight: 'bold'
    },
    signUp: {
        fontSize: 18,
        color: '#131211'
    },
    register: {
        fontWeight: 'bold'
    },
});

export default SignUpScreen;