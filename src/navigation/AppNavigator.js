import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import CustomerRoutes from '../screens/customer/CustomerRoutes';
import RootStackScreen from '../screens/auth/RootStackScreen';
import SplashScreen from '../screens/SplashScreen';
import CatererRoutes from '../screens/caterer/home/CatererRoutes';

const AppNavigator = props => {

    const AppStack = createStackNavigator();
    
    return (
        <NavigationContainer>
            <AppStack.Navigator headerMode='none' initialRouteName='Splash'>
                <AppStack.Screen name="Splash" component={SplashScreen}/>
                <AppStack.Screen name="Auth" component={RootStackScreen}/>
                <AppStack.Screen name="Home" component={CustomerRoutes}/>
                <AppStack.Screen name='CatererHome' component={CatererRoutes}/>
            </AppStack.Navigator>
        </NavigationContainer>
    );
};

export default AppNavigator;