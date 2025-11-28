
import { StyleSheet, Text, View,TextInput, TouchableOpacity, Button, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useState } from 'react';


const Login=({navigation,users,setUsers})=>{


    const [notShowPassword,setNotShowPassword]= useState(true)
    const [error,setError]= useState('')
    const [form,setForm]= useState({
        email:'',
        password:''
    })




    const ValidateForm = async () => {
    setError(''); 

    
    if (form.email === '' || form.password === '') {
        setError('All fields are required');
        return;
    }

   

    try {
        const response = await fetch(
            `https://mobileproject-arbab5hmekdwa0gv.francecentral-01.azurewebsites.net/api/users/login?email=${encodeURIComponent(form.email)}&password=${encodeURIComponent(form.password)}`,
            {
                method: "POST"
            }
        );

        if (response.ok) {
            const user = await response.json();

            if (user && Object.keys(user).length > 0) {
                navigation.navigate('HomePage',{user})
            } else {
                setError('Email or password is incorrect');
            }
        } else {
            const errText = await response.text();
            setError('Login failed: ' + errText);
        }
    } catch (err) {
        console.error(err);
        setError('Network error: ' + err.message);
    }
};



    const UpdateField = (field, value) => {
    setForm({ ...form, [field]: value });
};


    return (
        

        <KeyboardAvoidingView behavior={'padding'} style={style.container}>

        <View style={style.container}>


            <Text style={style.welcome}>Welcome to RCB!</Text>
            
            <Text style={style.error}>{error}</Text>

            <Text style={style.label}>Email</Text>

            <View style={{width:'80%'}} >
                
                <MaterialIcons name="email" size={20} color="blue" style={style.icon} />
                <TextInput value={form.email} onChangeText={(text)=>UpdateField('email',text)} style={style.input} />
            </View>
            
            
            <Text style={style.label}>Password</Text>

            <View style={{width:'80%'}}>
                
                <MaterialIcons name="key" size={20} color="blue" style={style.icon} />
                <TextInput value={form.password} onChangeText={(text)=>UpdateField('password',text)}  style={style.input} secureTextEntry={notShowPassword} />
                <MaterialIcons name={notShowPassword?'visibility' :'visibility-off'} size={20} color="blue" style={style.icon2} onPress={()=>setNotShowPassword(!notShowPassword)} />

            </View>
            <TouchableOpacity style={style.button} onPress={ValidateForm}>
                <Text style={style.buttonText}>Login</Text>
            </TouchableOpacity>

            <Text style={style.signUp} onPress={()=>{navigation.replace('SignUp')}}>Dont have an account? sign up</Text>
                
        </View>



        </KeyboardAvoidingView>
    )

}


const style = StyleSheet.create({

    container:{
        width:'100%',
        alignItems:'center',
        justifyContent:'center',
        backgroundColor:'#f0f4f8',
        flex: 1,
   
    },
    label:{
        fontSize:20,
        alignSelf:'flex-start',
        marginLeft:'10%',
        color:'#333',
        marginTop:10
    },
    welcome:{
        fontSize:30,
        color:'#0077ff',
        alignSelf:'flex-start',
        marginLeft:'10%',
        marginBottom: 20,
        fontWeight:'bold',
        fontFamily:'Roboto'
    },
    input:{
        borderWidth:1,
        borderColor:'#ccc',
        backgroundColor:'#fff',
        borderRadius:10,
        width:'100%',
        paddingLeft:40,
        color:'#333'
    },
    button:{
        backgroundColor:'#0077ff',
        width:'80%',
        padding:12,
        borderRadius:10,
        marginTop:35,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 3
    },
    buttonText:{
        color:'white',
        textAlign:'center',
        fontWeight:'bold',
        fontSize:18
    },
    icon: {
        position: 'absolute',
        left: 5,            
        top: '50%',          
        transform: [{ translateY: -15 }], 
        zIndex: 1,
        backgroundColor:'#d0ebff',
        padding:5,
        borderRadius:10
    },
    icon2:{
        position: 'absolute',
        right: 5,            
        top: '50%',          
        transform: [{ translateY: -15 }], 
        zIndex: 1,
        backgroundColor:'#d0ebff',
        padding:5,
        borderRadius:10
    },
    error:{
        color:'red',
        marginBottom:10
    },
    signUp:{
        textDecorationLine:'underline',
        color:'blue',
        marginTop:15
    }

})


export default Login;