import React from 'react';
import { createStackNavigator, Header, HeaderBackButton } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Image } from 'react-native';
import { Icon } from 'react-native-elements';
import Feather from 'react-native-vector-icons/Feather';
import Ionicon from 'react-native-vector-icons/Ionicons';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';

import { Colors, Images } from '../../CommonConfig'

// Home Screens
import HomeScreen from'./home/HomeScreen';
import NotificationScreen from './home/NotificationScreen';
import FAQScreen from './home/FAQScreen';
import SortScreen from './home/SortScreen';
import DetailScreen from './home/DetailScreen';
import OrderReceiptScreen from './home/OrderReceiptScreen';
import DiscountCodeScreen from './home/DiscountCodeScreen';

// Search Screens
import SearchScreen from'./SearchScreen';

//Orders Screens
import OrdersScreen from'./order/OrdersScreen';
import OrderDetailScreen from './order/OrderDetailScreen';

//Chat Screens
import ChatScreen from'./chat/ChatScreen';
import MessagesScreen from './chat/MessagesScreen';

//Profile Screens
import ProfileScreen from'./profile/ProfileScreen';
import SavedAddresses from './profile/saved_address/SavedAddresses';
import PersonalInformationScreen from './profile/personal_information/PersonalInformationScreen';
import EditDetailScreen from './profile/personal_information/EditDetailsScreen';
import MyFavourites from './profile/MyFavourites';
import ChangePassword from './profile/ChangePassword';
import SavedCards from './profile/payment/SavedCards';
import AddCard from './profile/payment/AddCard';
import AddAddress from './profile/saved_address/AddAddress';
import EditAddress from './profile/saved_address/EditAddress';



const Tab = createBottomTabNavigator()
const CustomerRoutes = () => {
    const getTabBarVisibility = (route) => {
        const routeName = getFocusedRouteNameFromRoute(route);
        const hideOnScreens = ['Chat','FAQ','Details','OrderDetail','AddAddress','EditAddress','Notification','Discount','AddCard','OrderReceipt','SavedCards','EditDetails','ChangePassword','SavedAddresses','MyFavourites','PersonalInformation']
        if(hideOnScreens.indexOf(routeName) > -1) return false;
        return true;
    }

    return(
        <Tab.Navigator 
            initialRouteName='Home'
            tabBarOptions={{
                activeTintColor: Colors.ORANGE,
            }}
            >
                
            <Tab.Screen 
                name="Home" 
                component={HomeStackScreen}
                options={ ({route}) => ({ 
                    tabBarVisible: getTabBarVisibility(route),
                    tabBarLabel:'Home',
                    tabBarIcon: ({color}) => (
                        <Icon name="home" type='simple-line-icon' color={color} size={25}/>
                    ),
                })}/>
            <Tab.Screen 
                name="Search" 
                component={SearchStackScreen}
                options={{
                    tabBarLabel:'Search',
                    tabBarIcon: ({color}) => (
                        <Icon name="magnifier" type='simple-line-icon' color={color} size={25}/>
                    )
                }}/>
            <Tab.Screen 
                name="Order" 
                component={OrdersStackScreen}
                options={ ({route}) => ({
                    tabBarVisible: getTabBarVisibility(route),
                    tabBarLabel:'Order',
                    tabBarIcon: ({color}) => (
                        <Icon name="handbag" type='simple-line-icon' color={color} size={25}/>
                    )
                })}/>
            <Tab.Screen 
                name="ChatScreen" 
                component={ChatStackScreen}
                options={ ({route}) => ({ 
                    tabBarVisible: getTabBarVisibility(route),
                    tabBarLabel:'Chat',
                    tabBarIcon: ({color}) => (
                        <Icon name="chatbubble-ellipses-outline" type='ionicon' color={color} size={25}/>
                    )
                })}/>
            <Tab.Screen 
                name="Profile" 
                component={ProfileStackScreen}
                options={ ({route}) => ({
                    tabBarVisible: getTabBarVisibility(route),
                    tabBarLabel:'Profile',
                    tabBarIcon: ({color}) => (
                        <Icon name="user" type='simple-line-icon' color={color} size={25}/>
                    )
                    })}/>
        </Tab.Navigator>
    );
};

export default CustomerRoutes;


const HomeStack = createStackNavigator();
const HomeStackScreen = ({ navigation }) => {
    return(<HomeStack.Navigator
        initialRouteName='Home'
        screenOptions={{
            headerTitleAlign:'center'
        }}
    >
        <HomeStack.Screen 
            name="Home" 
            component={HomeScreen}
            options={{ 
                headerTitle: props => <Image source={Images.LOGO} style={{height:35, width:35}}/>,
                headerLeft: () => 
                <TouchableOpacity style={{marginLeft:15, alignItems:'center'}} onPress={ () => {navigation.navigate('FAQ')} } >
                    <Feather name="help-circle" size={25} color="grey"/>
                </TouchableOpacity>,
                headerRight: () => (
                    <TouchableOpacity style={{marginRight:15, alignItems:'center'}} onPress={ () => {navigation.navigate('Notification')} } >
                        <Feather name="bell" size={25} color="grey"/>
                    </TouchableOpacity>
                )
         }}
        />
        <HomeStack.Screen name="Notification" component={NotificationScreen} options={{
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

        <HomeStack.Screen name="FAQ" component={FAQScreen} />

        <HomeStack.Screen name="Sort" component={SortScreen} options={{headerShown:false}}/>

        <HomeStack.Screen name="Details" component={DetailScreen} options={{
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
        
        <HomeStack.Screen name="Discount" component={DiscountCodeScreen} options={{
            headerTitle:'View Discount Codes',
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
        <HomeStack.Screen name="OrderReceipt" component={OrderReceiptScreen} options={{
            headerTitle:'Order Receipt',
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

    </HomeStack.Navigator>)
};

const SearchStack = createStackNavigator();
const SearchStackScreen = ({ navigation }) => {
    return(<SearchStack.Navigator
            screenOptions={{
                headerShown: false
            }}
        >
        <SearchStack.Screen 
            name="Search" 
            component={SearchScreen}
            options={{
                headerLeft: () => null,
            }}
        />
    </SearchStack.Navigator>)
};


const OrdersStack = createStackNavigator();
const OrdersStackScreen = ({ navigation }) => {
    return(<OrdersStack.Navigator
        screenOptions={{
            headerTitleAlign:'center',
            headerStyle: {
                shadowColor: "#000",
                shadowOffset: {
                    width: 0,
                    height: 0,
                },
                shadowOpacity: 0,
                shadowRadius: 0,
                elevation: 0,
            },
        }}
    >
        <OrdersStack.Screen 
            name="Orders" 
            component={OrdersScreen}
            options={{
                headerLeft: () => null,
            }}
        />

        <OrdersStack.Screen 
            name="OrderDetail"
            component={OrderDetailScreen}
            options={{
                headerTitle: 'Order Details' 
            }}
        />
    </OrdersStack.Navigator>)
};


const ChatStack = createStackNavigator();
const ChatStackScreen = ({ navigation }) => {
    return(<ChatStack.Navigator
        initialRouteName='Messages'
        screenOptions={{
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
            headerTitleAlign:'center'
        }}
    >
        <ChatStack.Screen 
            name="Messages"
            component={MessagesScreen}
            options={{
                headerTitle:'Chat',
                headerLeft: () => null
            }}
        />
        <ChatStack.Screen 
            name="Chat" 
            component={ChatScreen}
            options={ ({route}) => ({ headerTitle: route.params.title}) }
        />
    </ChatStack.Navigator>)
};

const ProfileStack = createStackNavigator();
const ProfileStackScreen = ({ navigation }) => {
    return(
    <ProfileStack.Navigator 
        initialRouteName='Profile'
        screenOptions={{
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
            headerTitleStyle:{
                color:Colors.BLACK,
                fontSize:22,
            },
            headerTitleAlign:'center'
          }}
        >
        <ProfileStack.Screen 
            name="Profile" 
            component={ProfileScreen}
            options={{
                headerLeft: () => null,
            }}
        />
        <ProfileStack.Screen 
            name="PersonalInformation"
            component={PersonalInformationScreen}
            options={{
                headerBackTitleVisible: false,
                headerTitle: "Personal Information"
            }}
        />
        <ProfileStack.Screen 
            name="MyFavourites"
            component={MyFavourites}
            options={{
                headerBackTitleVisible: false,
                headerTitle:"My Favourites"
            }}
        />
        <ProfileStack.Screen 
            name="SavedAddresses"
            component={SavedAddresses}
            options={{
                headerBackTitleVisible: false,
                headerTitle:"Saved Addresses",
                headerRight: () => (
                    <TouchableOpacity style={{marginRight:15, alignItems:'center'}} onPress={ () => { navigation.navigate('AddAddress') } } >
                        <Feather name="plus" size={25} color={Colors.BLACK}/>
                    </TouchableOpacity>
                )
            }}
        />
        <ProfileStack.Screen 
            name="AddAddress"
            component={AddAddress}
            options={{
                headerTitle:"Add New Address"
            }}
        />

        <ProfileStack.Screen 
            name="EditAddress"
            component={EditAddress}
            options={{
                headerTitle:"Edit Address"
            }}
        />
        <ProfileStack.Screen 
            name="ChangePassword"
            component={ChangePassword}
            options={{
                headerBackTitleVisible: false,
                headerTitle:"Change Password"
            }}
        />

        <ProfileStack.Screen 
            name="EditDetails"
            component={EditDetailScreen}
            options={{
                headerBackTitleVisible: false,
                headerTitle:"Edit Information"
            }}
        />

        <ProfileStack.Screen 
            name="SavedCards"
            component={SavedCards}
            options={{
                headerBackTitleVisible: false,
                headerTitle:"Payment Method",
                headerRight: () => (
                    <TouchableOpacity onPress={ () => { navigation.navigate('AddCard')}} style={{marginRight:10}}>
                        <Ionicon name="add-outline" size={30} color={Colors.BLACK}/>
                    </TouchableOpacity>
                )
            }}
        />
        
        <ProfileStack.Screen 
            name="AddCard"
            component={AddCard}
            options={{
                headerBackTitleVisible: false,
                headerTitle:"Add New Card"
            }}
        />
    </ProfileStack.Navigator>)
};

