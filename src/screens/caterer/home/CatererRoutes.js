import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { Colors } from '../../../CommonConfig';

//Menu Screens
import MenuScreen from './menu/MenuScreen';
import CategoryItems from './menu/CategoryItems';
import DishDetailScreen from './menu/DishDetailScreen';
import AddEditCategory from './menu/AddEditCategory';

//Order Screens
import OrdersScreen from './orders/OrdersScreen';
import OrderDetailScreen from './orders/OrderDetailScreen';

//Chat Screens
import ChatScreen from './chat/ChatScreen';
import MessagesScreen from './chat/MessagesScreen';

//Profile Screens
import ProfileScreen from './profile/ProfileScreen';
import SavedDiscountCodes from './profile/Discount Codes/SavedDiscountCodes';
import EditCoupons from './profile/Discount Codes/EditCoupons';
import ChangePassword from './profile/ChangePassword';
import PersonalInformation from './profile/PersonalInformation';
import EditInformation from './profile/EditInformation';

const MenuStack = createStackNavigator()
const OrderStack = createStackNavigator()
const ChatStack = createStackNavigator()
const ProfileStack = createStackNavigator()

const MenuStackScreen = () => {
    return(
        <MenuStack.Navigator
            initialRouteName='MenuScreen'
            screenOptions={{
                headerTitleAlign:'center'
            }}
        >
            <MenuStack.Screen 
                name='MenuScreen'
                component={MenuScreen}
                options={{
                    headerTitle: 'Menu'
                }}
            />
            <MenuStack.Screen 
                name='CategoryItems'
                component={CategoryItems}
                options={{
                    headerTitle: 'Product',
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
                }}
            />
            <MenuStack.Screen 
                name='DishDetail'
                component={DishDetailScreen}
                options={ ({route}) => ({
                    headerTitle: route.params.mode === 'view' ? 'Product Details' : route.params.mode === 'edit' ? 'Edit Product' : 'Add Product',
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
                })}
            />
            <MenuStack.Screen 
                name='AddEditCategory'
                component={AddEditCategory}
                options={ ({route}) => ({
                    headerTitle: route.params.mode === 'edit' ? 'Edit Category' : 'Add Category',
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
                })}
            />
        </MenuStack.Navigator>
    )
}

const OrderStackScreen = () => {
    return(
        <OrderStack.Navigator
            initialRouteName='MenuScreen'
            screenOptions={{
                headerTitleAlign:'center'
            }}
        >
            <OrderStack.Screen 
                name='OrderScreen'
                component={OrdersScreen}
                options={{
                    headerTitle: 'Home'
                }}
            />
            <OrderStack.Screen 
                name='OrderDetail'
                component={OrderDetailScreen}
                options={{
                    headerTitle: 'Order Details',
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
                }}
            />
        </OrderStack.Navigator>
    )
}

const ChatStackScreen = () => {
    return(
        <ChatStack.Navigator
            initialRouteName='MessagesScreen'
            screenOptions={{
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
            }}
        >
            <ChatStack.Screen 
                name='ChatScreen'
                component={ChatScreen}
                options={ ({route}) => ({ 
                    headerTitle: route.params.title
                }) }
            />
            <ChatStack.Screen 
                name='MessagesScreen'
                component={MessagesScreen}
                options={{
                    headerTitle: 'Chat'
                }}
            />
        </ChatStack.Navigator>
    )
}

const ProfileStackScreen = () => {
    return (
        <ProfileStack.Navigator
            initialRouteName='ProfileScreen'
            screenOptions={{
                headerTitleAlign:'center'
            }}
        >
            <ProfileStack.Screen 
                name='ProfileScreen'
                component={ProfileScreen}
                options={{
                    headerTitle: 'Profile',
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
                }}
            />
            <ProfileStack.Screen 
                name='SavedDiscountCodes'
                component={SavedDiscountCodes}
                options={{
                    headerTitle: 'Discount Codes',
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
                }}
            />
            <ProfileStack.Screen 
                name='EditCoupon'
                component={EditCoupons}
                options={ ({route}) => ({
                    headerTitle: route.params.mode === 'edit' ? 'Edit Discount Code' : 'Create Discount Code',
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
                })}
            />
            <ProfileStack.Screen 
                name='ChangePassword'
                component={ChangePassword}
                options={{
                    headerTitle: 'Change Password',
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
                }}
            />
            <ProfileStack.Screen 
                name='PersonalInformation'
                component={PersonalInformation}
                options={{
                    headerTitle: 'Personal Information',
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
                }}
            />
            <ProfileStack.Screen 
                name='EditInfo'
                component={EditInformation}
                options={{
                    headerTitle: 'Edit Information',
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
                }}
            />
        </ProfileStack.Navigator>
    )
}

const CatererTab = createBottomTabNavigator()
const CatererRoutes = () => {
    const getTabBarVisibility = (route) => {
        const routeName = getFocusedRouteNameFromRoute(route);
        const hideOnScreens = ['CategoryItems','SavedDiscountCodes','EditCoupon','ChangePassword','DishDetail','AddEditCategory','OrderDetail','PersonalInformation','EditInfo','ChatScreen']
        if(hideOnScreens.indexOf(routeName) > -1) return false;
        return true;
    }

    return(
        <CatererTab.Navigator
            initialRouteName='Menu'
            tabBarOptions={{
                activeTintColor: Colors.ORANGE
            }}
        >
            <CatererTab.Screen 
                name='Menu'
                component={MenuStackScreen}
                options={ ({route}) => ({
                    tabBarVisible: getTabBarVisibility(route),
                    tabBarLabel: 'Menu',
                    tabBarIcon: ({color}) => (
                        <MaterialIcons name='menu-book' color={color} size={25} />
                    )
                })}
            />
            <CatererTab.Screen 
                name='Orders'
                component={OrderStackScreen}
                options={ ({route}) => ({
                    tabBarVisible: getTabBarVisibility(route),
                    tabBarLabel: 'Orders',
                    tabBarIcon: ({color}) => (
                        <MaterialIcons name='shopping-bag' color={color} size={25} />
                    )
                })}
            />
            <CatererTab.Screen 
                name='Chat'
                component={ChatStackScreen}
                options={ ({route}) => ({
                    tabBarVisible: getTabBarVisibility(route),
                    tabBarLabel: 'Chat',
                    tabBarIcon: ({color}) => (
                        <MaterialIcons name='chat' color={color} size={25} />
                    )
                })}
            />
            <CatererTab.Screen 
                name='Profile'
                component={ProfileStackScreen}
                options={ ({route}) => ({
                    tabBarVisible: getTabBarVisibility(route),
                    tabBarLabel: 'Profile',
                    tabBarIcon: ({color}) => (
                        <MaterialIcons name='person' color={color} size={25} />
                    )
                })}
            />
        </CatererTab.Navigator>
    )
}

export default CatererRoutes;