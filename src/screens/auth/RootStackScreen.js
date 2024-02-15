import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import SelectRoleScreen from './SelectRoleScreen';
import SignInScreen from './SignInScreen';
import SignUpScreen from './SignUpScreen';
import NumberVerificationScreen from './NumberVerificationScreen';
import VerifyScreen from './VerifyScreen';
import ForgotPasswordScreen from './ForgotPasswordScreen';
import StoreRegister from './StoreRegister';

const RootStack = createStackNavigator();

const RootStackScreen = ({ navigation }) => {
    return(
        <RootStack.Navigator initialRouteName='SelectRoleScreen' >
            <RootStack.Screen name="SelectRoleScreen" component={SelectRoleScreen} options={{ headerShown: false }}/>
            <RootStack.Screen name="SignInScreen" component={SignInScreen} options={{ headerShown: false }}/>
            <RootStack.Screen name="SignUpScreen" component={SignUpScreen} options={{ headerShown: false }}/>
            <RootStack.Screen name="NumberVerificationScreen" component={NumberVerificationScreen} options={{ headerShown: false }}/>
            <RootStack.Screen name="VerifyScreen" component={VerifyScreen} options={{ headerShown: false }}/>
            <RootStack.Screen name="ForgotPassword" component={ForgotPasswordScreen} options={{ headerShown: false }}/>
            <RootStack.Screen name='StoreRegister' component={StoreRegister} options={{
                    headerTitle: 'Add Caterer Store Details',
                    headerTitleAlign:'center',
                    headerStyle: {
                        shadowColor: "#000",
                        shadowOffset: {
                            width: 0,
                            height: 2,
                        },
                        shadowOpacity: 0.1,
                        shadowRadius: 3.84,
                        elevation: 5,
                    },
                }}/>
        </RootStack.Navigator>
    );
};

export default RootStackScreen;