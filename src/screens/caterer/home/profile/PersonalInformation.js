import { ActivityIndicator, Image, StyleSheet, Text, View, TextInput, ScrollView, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { Colors } from '../../../../CommonConfig';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const PersonalInformation = ({ navigation, route }) => {

    const { user } = route.params
    // console.log(user);

    const orderTypeHandler = id => {
        switch (id) {
            case 0:
                return 'Delivery'
            case 1:
                return 'Pickup'
            case 2:
                return 'Both'
            default:
                return 'Delivery'
        }
    }

    return (
        <View style={styles.screen}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{paddingBottom:50}}>
                <View style={styles.personalContainer}>
                    <View style={styles.ppContainer}>
                        <Image source={{ uri: user.image }} style={{ flex: 1 }} />
                    </View>

                    <Text style={styles.header}>Personal Information</Text>

                    <Text style={styles.label}>Caterer Name</Text>
                    <View style={styles.textField}>
                        <FontAwesome name="user" color={Colors.ORANGE} size={20} />
                        <TextInput
                            value={user.name}
                            autoCapitalize='none'
                            editable={false}
                            style={styles.textInput}
                        />
                    </View>

                    <Text style={styles.label}>Email</Text>
                    <View style={styles.textField}>
                        <FontAwesome name="envelope" color={Colors.ORANGE} size={20} />
                        <TextInput
                            value={user.email}
                            autoCapitalize='none'
                            editable={false}
                            style={styles.textInput}
                        />
                    </View>

                    <Text style={styles.label}>Phone Number</Text>
                    <View style={styles.textField}>
                        <FontAwesome name="phone" color={Colors.ORANGE} size={20} />
                        <TextInput
                            value={user.countryCode + "   " + user.phoneNumber}
                            autoCapitalize='none'
                            editable={false}
                            style={styles.textInput}
                        />
                    </View>

                </View>

                <View style={styles.personalContainer}>
                    <Text style={styles.header}>Order Type</Text>
                    <Text style={[styles.label, { color: Colors.BLACK }]}>{orderTypeHandler(user.store.order_type)}</Text>
                </View>

                <View style={styles.personalContainer}>
                    <Text style={styles.header}>Business Information</Text>

                    <Text style={styles.label}>Business License Number</Text>
                    <View style={styles.textField}>
                        <TextInput
                            value={user.store.license_num}
                            autoCapitalize='none'
                            editable={false}
                            style={styles.textInput}
                        />
                    </View>

                    <Text style={styles.label}>Business License Photo</Text>
                    <Image source={{ uri: user.store.license_image }} style={{ width: '100%', height: 250, marginVertical: 15, borderRadius: 10 }} resizeMode='stretch' />

                    <Text style={styles.label}>Address</Text>
                    <View style={styles.textField}>
                        <TextInput
                            value={user.store.address}
                            autoCapitalize='none'
                            editable={false}
                            style={styles.textInput}
                        />
                    </View>

                    <Text style={styles.label}>Bio</Text>
                    <View style={styles.textField}>
                        <TextInput
                            value={user.store.bio}
                            autoCapitalize='none'
                            editable={false}
                            style={styles.textInput}
                        />
                    </View>

                </View>

                <View style={styles.personalContainer}>
                    <Text style={styles.header}>Food Category</Text>
                    <View style={styles.textField}>
                        <TextInput
                            value={user.store.category}
                            autoCapitalize='none'
                            editable={false}
                            style={styles.textInput}
                        />
                    </View>
                </View>

                <View style={styles.personalContainer}>
                    <Text style={styles.header}>Driver Info</Text>

                    <Text style={styles.label}>Driver Name</Text>
                    <View style={styles.textField}>
                        <TextInput
                            value={user.driver.name}
                            autoCapitalize='none'
                            editable={false}
                            style={styles.textInput}
                        />
                    </View>

                    <Text style={styles.label}>Driver License Number</Text>
                    <View style={styles.textField}>
                        <TextInput
                            value={user.driver.license_number}
                            autoCapitalize='none'
                            editable={false}
                            style={styles.textInput}
                        />
                    </View>
                    
                    <Text style={styles.label}>Driver License Photo</Text>
                    <Image source={{ uri: user.driver.image }} style={{ width: '100%', height: 250, marginVertical: 15, borderRadius: 10 }} resizeMode='stretch' />
                </View>
            </ScrollView>
            <View style={{position:'absolute', bottom:0, zIndex:1, width:'100%', padding:10, backgroundColor: Colors.BACKGROUND_GREY}}>
                <TouchableOpacity style={styles.btn} activeOpacity={0.6} onPress={() => {
                    navigation.navigate('EditInfo',{ user })
                }}>
                    <Text style={styles.btnText}>Edit Information</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default PersonalInformation

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
    btn:{
        padding:15,
        backgroundColor: Colors.ORANGE,
        borderRadius: 5,
        justifyContent:'center',
        alignItems:'center'
    },
    btnText:{
        fontWeight:'bold',
        color: Colors.WHITE,
        fontSize:20
    }
})