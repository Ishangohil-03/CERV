import React, { useEffect, useCallback, useState, useRef } from 'react';
import { View, Text, StyleSheet, LogBox, TextInput, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { io } from 'socket.io-client';

import { Colors } from '../../../../CommonConfig';
// import { getPostLogin, postPostLogin } from '../../../helpers/ApiHelpers';
import { getPostLogin, postPostLogin } from '../../../../helpers/ApiHelpers';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';

var socket;

LogBox.ignoreAllLogs()

const ChatScreen = props => {

    const [ loading, setLoading ] = useState(true)
    const messageScroll = useRef(null)
 
    const [user, setUser] = useState({})
    const chatObj = props.route.params.chatObj
    // console.log(chatObj)

    useEffect(async () => {
        setUser(JSON.parse(await AsyncStorage.getItem('userInfo')))
        socket = io('https://cerv-api.herokuapp.com')
        getMessages()
        setLoading(false);
    }, [])

    const [messages, setMessages] = useState([])
    const [chat, setChat] = useState('')

    const getMessages = async () => {
        const response = await getPostLogin(`/message/${chatObj.id}`)
        // console.log(response.data)
        if (response.success) {
            setMessages(response.data.data)
            socket.emit("join chat", chatObj.id);
        } else {
            console.log(response)
        }
    }

    const sendChat = async() => {
        // console.log("Sending Message!", chat)
        const params = {
            content: chat,
            chatId: chatObj.id
        }
        setChat('')
        const response = await postPostLogin('/message', params)
        // console.log(response.data.data)
        socket.emit("new message", response.data.data)
        socket.on("message sent", () => { getMessages() })
        // console.log(response.data.data);
        setMessages([...messages, response.data.data])
    }
    
    return (
        <>
            <View style={styles.screen}>
                { loading ?
                <View>
                    <ActivityIndicator  size={65} color={Colors.ORANGE} />
                </View>
                :
                <View>
                    <ScrollView showsVerticalScrollIndicator={false} ref={messageScroll} onContentSizeChange={() => { messageScroll.current.scrollToEnd({animated: false}) }}>
                    {messages.map((item, index) => {
                        // console.log("Message: \n",item)
                        return (
                            <>
                                <View key={index} style={{ alignSelf: item?.senderId === user.id ? 'flex-end' : 'flex-start', paddingHorizontal:10, paddingVertical:5, marginVertical:5 ,borderRadius:5, maxWidth:'60%' , backgroundColor: item?.senderId !== user.id ? Colors.LIGHTER_GREY : Colors.ORANGE }}>
                                    <Text style={{color: item?.senderId === user.id ? Colors.WHITE : Colors.BLACK, fontSize:18}} >{item?.content}</Text>
                                </View>
                                <Text style={{alignSelf: item?.senderId === user.id ? 'flex-end' : 'flex-start', color: Colors.LIGHTER_GREY, fontSize:12}}>{moment(item.createdAt).format('Do MMM yy, hh:mm A')}</Text>
                            </>
                        )
                    })}
                    </ScrollView>
                </View>
                
                }
            </View>
            <View style={{flexDirection:'row', alignItems:'center', justifyContent:'space-between', paddingVertical:5, paddingHorizontal:10, backgroundColor: Colors.WHITE}}>
                <TextInput
                    value={chat}
                    placeholder='Type your message here ...'
                    onChangeText={(e) => setChat(e)}
                    style={{flex:1 }}
                />
                <TouchableOpacity style={{padding:10, alignItems:'center', backgroundColor: Colors.ORANGE, borderRadius:200}} onPress={sendChat} activeOpacity={0.75} disabled={ chat.length === 0 ? true : false }>
                    <Ionicons name="send" size={25} color={Colors.WHITE} />
                </TouchableOpacity>
            </View>
        </>
    )
}



const styles = StyleSheet.create({
    screen: {
        flex: 1,
        width: '100%',
        padding: 10,
        justifyContent: 'space-between'
    }
});

export default ChatScreen;