import { ActivityIndicator, StatusBar, StyleSheet, Switch, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { Colors } from '../../../../../CommonConfig'
import { Formik } from 'formik'
import * as yup from 'yup';
import DateTimePicker from 'react-native-modal-datetime-picker';
import moment from 'moment';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { postPostLogin, putPostLogin } from '../../../../../helpers/ApiHelpers';
import Toast from 'react-native-simple-toast';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

const EditCoupons = ({ navigation, route }) => {

    const { mode, selectedCode } = route.params

    const isEditMode = mode === 'edit' ? true : false

    const [loading, setIsLoading] = useState(false)
    const [showDateTimePicker, setShowDateTimePicker] = useState(false)

    const onPressAdd = async (values) => {
        setIsLoading(true)
        const data = {
            title: values.title,
            description: values.description,
            code: values.code,
            is_percent: values.is_percent,
            value: parseInt(values.discount_value),
            expiry: values.expiry,
            is_active: values.is_active
        }

        const response = await postPostLogin('/caterer/addCoupon', data)
        if (response.success) {
            Toast.show("Coupon added Successfully!")
            setIsLoading(false)
            navigation.goBack()
        } else {
            Toast.show("Something went wrong!")
            setIsLoading(false)
            navigation.goBack()
        }
    }

    const onPressSave = async (values) => {
        setIsLoading(true)
        const data = {
            title: values.title,
            description: values.description,
            code: values.code,
            is_percent: values.is_percent,
            value: parseInt(values.discount_value),
            expiry: values.expiry,
            is_active: values.is_active
        }

        // console.log(data)
        const response = await putPostLogin(`/caterer/editCoupon?couponId=${selectedCode.id}`, data)
        if (response.success) {
            Toast.show("Coupon Updated Successfully!")
            setIsLoading(false)
            navigation.goBack()
        } else {
            Toast.show("Something went wrong!")
            setIsLoading(false)
            navigation.goBack()
        }
    }

    if (loading) {
        return (
            <View style={styles.loader}>
                <ActivityIndicator size={65} color={Colors.ORANGE} />
            </View>
        )
    }

    return (
        <View style={styles.screen}>
            <StatusBar backgroundColor={Colors.WHITE} barStyle={'dark-content'} />
            <Formik
                initialValues={{
                    title: isEditMode ? selectedCode.title : "",
                    description: isEditMode ? selectedCode.description : "",
                    code: isEditMode ? selectedCode.code : "",
                    is_percent: isEditMode ? selectedCode.is_percent : false,
                    discount_value: isEditMode ? selectedCode.value : "",
                    expiry: isEditMode ? selectedCode.expiry : new Date(),
                    is_active: isEditMode ? selectedCode.is_active : false
                }}

                onSubmit={(values) => {
                    if (isEditMode) {
                        onPressSave(values)
                    } else {
                        onPressAdd(values)
                    }
                }}

                validationSchema={
                    isEditMode ?
                        yup.object().shape({
                            title: yup.string(),
                            description: yup.string(),
                            code: yup.string(),
                            is_percent: yup.boolean(),
                            discount_value: yup.number()
                                .when("is_percent", {
                                    is: true,
                                    then: yup.number().positive("Discount Value cannot be negative!").max(100, "Discount value cannot be more than 100%"),
                                    otherwise: yup.number().positive("Discount Value cannot be negative!")
                                }),
                            expiry: yup.date()
                        })
                        :
                        yup.object().shape({
                            title: yup.string().required("Title is required!"),
                            description: yup.string().required("Description is required!"),
                            code: yup.string().required("Code id required!"),
                            is_percent: yup.boolean().required(),
                            discount_value: yup.number().required("Discount value is required!")
                                .when("is_percent", {
                                    is: true,
                                    then: yup.number().positive("Discount Value cannot be negative!").max(100, "Discount value cannot be more than 100%").required("Discount value is required!"),
                                    otherwise: yup.number().positive("Discount Value cannot be negative!").required("Discount value is required!")
                                }),
                            expiry: yup.date().required("Date is required!")
                        })
                }
            >
                {({ values, errors, setFieldTouched, touched, handleChange, setFieldValue, isValid, handleSubmit }) => (
                    <KeyboardAwareScrollView>
                        <View style={{ flex: 1, justifyContent: 'space-between' }}>
                            <View>
                                <Text style={styles.title}>Title</Text>
                                <View style={styles.container}>
                                    <TextInput
                                        value={values.title}
                                        onBlur={() => setFieldTouched('title')}
                                        onChangeText={handleChange('title')}
                                        keyboardType={'default'}
                                        style={{ flex: 1 }}
                                    />
                                </View>
                                {touched.title && errors.title &&
                                    <Text style={{ fontSize: 11, color: Colors.ERROR_RED, margin: 10 }}>{errors.title}</Text>
                                }

                                <Text style={styles.title}>Description</Text>
                                <View style={styles.container}>
                                    <TextInput
                                        value={values.description}
                                        onBlur={() => setFieldTouched('description')}
                                        onChangeText={handleChange('description')}
                                        keyboardType={'default'}
                                        style={{ flex: 1 }}
                                    />
                                </View>
                                {touched.description && errors.description &&
                                    <Text style={{ fontSize: 11, color: Colors.ERROR_RED, margin: 10 }}>{errors.description}</Text>
                                }

                                <Text style={styles.title}>Expiry Date</Text>
                                <View style={styles.container}>
                                    <TouchableOpacity style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }} onPress={() => { setShowDateTimePicker(true) }}>
                                        <Text>{moment(values.expiry).format('DD-MM-YYYY')}</Text>
                                        <Ionicons name={'calendar'} size={25} color={Colors.ORANGE} />
                                    </TouchableOpacity>
                                    <DateTimePicker
                                        isVisible={showDateTimePicker}
                                        mode={'date'}
                                        minimumDate={new Date()}
                                        onConfirm={(date) => {
                                            setFieldTouched('expiry')
                                            setFieldValue('expiry', date)
                                            setShowDateTimePicker(false)
                                        }}
                                        onCancel={() => { setShowDateTimePicker(false) }}
                                    />
                                </View>

                                <View style={[styles.container, { borderBottomWidth: 0 }]}>
                                    <Text style={styles.title}>Active</Text>
                                    <Switch
                                        onChange={() => {
                                            setFieldTouched('is_active')
                                            setFieldValue('is_active', !values.is_active)
                                        }
                                        }
                                        value={values.is_active}
                                        trackColor={{ true: Colors.ORANGE, false: Colors.GREY }}
                                        thumbColor={Colors.ORANGE}
                                    />
                                </View>

                                <Text style={styles.title}>Discount Code</Text>
                                <View style={styles.container}>
                                    <TextInput
                                        value={values.code}
                                        onBlur={() => setFieldTouched('code')}
                                        onChangeText={handleChange('code')}
                                        keyboardType={'default'}
                                        style={{ flex: 1 }}
                                    />
                                </View>
                                {touched.code && errors.code &&
                                    <Text style={{ fontSize: 11, color: Colors.ERROR_RED, margin: 10 }}>{errors.code}</Text>
                                }


                                <Text style={styles.title}>Discount Value</Text>
                                <View style={styles.container}>
                                    <TextInput
                                        value={(values.discount_value).toString()}
                                        onBlur={() => setFieldTouched('discount_value')}
                                        onChangeText={handleChange('discount_value')}
                                        keyboardType={'number-pad'}
                                        style={{ flex: 1 }}
                                    />
                                </View>
                                {touched.discount_value && errors.discount_value &&
                                    <Text style={{ fontSize: 11, color: Colors.ERROR_RED, margin: 10 }}>{errors.discount_value}</Text>
                                }

                                <Text style={styles.title}>Type of Discount</Text>
                                <View style={styles.container}>
                                    <Text>{values.is_percent ? "%" : "$"}</Text>
                                    <Switch
                                        onChange={() => {
                                            setFieldTouched('is_percent')
                                            setFieldValue('is_percent', !values.is_percent)
                                        }
                                        }
                                        value={values.is_percent}
                                        trackColor={{ true: Colors.ORANGE, false: Colors.GREY }}
                                        thumbColor={Colors.ORANGE}
                                    />
                                </View>
                            </View>

                            <TouchableOpacity style={styles.saveBtn} disabled={!isValid} onPress={handleSubmit}>
                                <Text style={styles.saveBtnTxt}>{isEditMode ? 'Save' : 'Add Coupon'}</Text>
                            </TouchableOpacity>
                        </View>
                    </KeyboardAwareScrollView>
                )}
            </Formik>
        </View>
    )
}

export default EditCoupons

const styles = StyleSheet.create({
    loader: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.WHITE
    },
    screen: {
        flex: 1,
        backgroundColor: Colors.WHITE,
        padding: 10
    },
    title: {
        fontSize: 18,
        fontWeight: '700',
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
    saveBtn: {
        paddingVertical: 15,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.ORANGE,
        borderRadius: 5
    },
    saveBtnTxt: {
        fontWeight: 'bold',
        color: Colors.WHITE,
        fontSize: 18
    }
})