import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import NotificationItem from '../../../components/NotificationItem';
import{ Colors }from '../../../CommonConfig';

const NotificationScreen = props => {
    return (
        
        <ScrollView>
            <View style={styles.screen} >
                <NotificationItem 
                    icon="heart"
                    iconBg="#F0105B"
                    notifText="Your Order has been placed successfully"
                    notifTime="10:00 AM"
                />
                <NotificationItem 
                    icon="briefcase-outline"
                    iconBg="#5A6BC4"
                    notifText="Dummy Text for notification on notification screen!"
                    notifTime="2d ago"
                />
                <NotificationItem 
                    icon="alert-circle-outline"
                    iconBg={Colors.ERROR_RED}
                    notifText="Alert! Alert! Alert!"
                    notifTime="2d ago"
                />
                <NotificationItem 
                    icon="construct"
                    iconBg="#42DFE3"
                    notifText="Configure your profile now!"
                    notifTime="3d ago"
                />
                <NotificationItem 
                    icon="cafe-outline"
                    iconBg="#536291"
                    notifText="Claim your discount coupon before it's too late!"
                    notifTime="3d ago"
                />
                <NotificationItem 
                    icon="home"
                    iconBg="#789625"
                    notifText="New Addresses added!"
                    notifTime="5d ago"
                />
                <NotificationItem 
                    icon="briefcase-outline"
                    iconBg="#5A6BC4"
                    notifText="Dummy Text for notification on notification screen!"
                    notifTime="2d ago"
                />
            </View>
        </ScrollView>
        
    );
};

const styles = StyleSheet.create({
    screen:{
        flex:1,
        alignItems:'center',
        paddingTop:15,
        backgroundColor:'#f5f5f5'
    }
});

export default NotificationScreen;