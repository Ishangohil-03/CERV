import React, { useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

import FAQ from '../../../model/FAQ';

const FAQScreen = props => {

    const [currentIndex, setCurrentIndex] = useState(null)

    return (
        <View style={styles.container}>
            <Text style={styles.title} >Frequently Asked Questions</Text>
            {FAQ.map(({title,subCategories,bg,color},index) => {
                return <TouchableOpacity key={title} onPress={() => {
                    setCurrentIndex(index===currentIndex? null : index);
                }} style={styles.cardContainer} activeOpacity={0.9}>
                    <View style={[styles.card, {backgroundColor: bg}]}>
                        <Text style={[styles.heading,{color}]}>{title}</Text>
                        {index === currentIndex && <View style={styles.subCategoriesList}>
                            {subCategories.map(subCategory => (
                                <Text key={subCategory} style={[styles.body,{color}]}>{subCategory}</Text>
                            ))}
                        </View>}
                    </View>
                </TouchableOpacity>
            })}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: '#fff',
        padding:10,
    },
    title:{
        textAlign:'center',
        fontSize:40,
        fontWeight:'bold',
        marginBottom:15
    },
    cardContainer:{
        flexGrow:1,
    },
    card:{
        flexGrow:1,
        borderRadius:10,
        alignItems:'center',
        justifyContent:'center',
        marginVertical:10
    },
    heading:{
        fontSize:25,
        fontWeight:'900',
        textTransform:'capitalize',
        marginBottom:15,
    },
    body:{
        fontSize:18,
        lineHeight: 20 * 1.5,
        textAlign:'center'
    }
});

export default FAQScreen;