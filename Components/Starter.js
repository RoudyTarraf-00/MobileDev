import { Image, StyleSheet, View, Text, TouchableHighlight } from 'react-native'

import pig from '../assets/pig-removebg-preview.png'
import phone from '../assets/phone-removebg-preview.png'
import visa from '../assets/visa-removebg-preview.png'
import { useState } from 'react'

const Starter = ({navigation}) => {

    const array= [
        {
            image: pig,    
            message: "Welcome to RCB Transfer APP!",
            subMessage: "Manage your money easily and securely"   
        },
        {
            image: phone,    
            message: "Use the App from Everywhere",
            subMessage: "Access your account anytime, anywhere"   
        },
        {
            image: visa,
            message: "Request your physical card now",
            subMessage: "Get your card delivered quickly"   
        },
    ]

    const [count,setCount]=useState(0)

    return(
        <View style={style.container}>
            <Image source={array[count].image} style={{ width: 250, height: 200, resizeMode: 'contain' }} />
            
            
            <View>
            <Text style={style.message}>{array[count].message}</Text>
            <Text style={style.subMessage}>{array[count].subMessage}</Text>



            <TouchableHighlight style={style.button} onPress={()=>{
                if(count===2){
                    navigation.replace('Login')
                    return
                }
                setCount(count+1)}}>
               <Text style={style.buttonText}>Get Started</Text>
            </TouchableHighlight>
            </View>
        </View>
    )
}

const style = StyleSheet.create({

    container: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'space-evenly',
        backgroundColor: '#f0f4f8', // softer background
        flex: 1,
        paddingVertical: 40
    },
    message: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#0077ff', // primary blue
        textAlign: 'center',
        marginTop: 20
    },
    subMessage: {
        fontSize: 16,
        color: '#555', // neutral gray
        textAlign: 'center',
        marginTop: 10,
        paddingHorizontal: 20
    },
    button: {
        backgroundColor: '#0077ff', // primary blue
        width: '80%',
        padding: 14,
        borderRadius: 12,
        marginTop: 35,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 3,
        alignItems: 'center',
        marginLeft:'10%'
    },
    buttonText: {
        color: '#fff', // white text
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 18
    },

})


export default Starter;
