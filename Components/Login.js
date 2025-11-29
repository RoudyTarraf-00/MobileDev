import { StyleSheet, Text, View,TextInput, TouchableOpacity, KeyboardAvoidingView, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useState } from 'react';
import { ActivityIndicator } from 'react-native';


const Login=({navigation,users,setUsers})=>{


    const [notShowPassword,setNotShowPassword]= useState(true)
    const [error,setError]= useState('')
    const [form,setForm]= useState({
        email:'',
        password:''
    })
    const [loading,setLoading]=useState(false)

    const ValidateForm = async () => {
        setError(''); 
    
        if (form.email === '' || form.password === '') {
            setError('All fields are required');
            return;
        }
    
        try {
            setLoading(true)
            const response = await fetch(
                `https://mobileproject-arbab5hmekdwa0gv.francecentral-01.azurewebsites.net/api/users/login?email=${encodeURIComponent(form.email)}&password=${encodeURIComponent(form.password)}`,
                {
                    method: "POST"
                }
            );
    
            if (response.ok) {
                const user = await response.json();
    
                if (user && Object.keys(user).length > 0) {
                    navigation.replace('HomePage',{user})
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
        finally{
            setLoading(false)
        }
    };
    
    const UpdateField = (field, value) => {
        setForm({ ...form, [field]: value });
    };

    if(loading){
        return(
            <View style={style.container}>
                <ActivityIndicator size={80} />
                <Text>Loading...</Text>
            </View>
        )
    }

    return (
        <KeyboardAvoidingView behavior={'padding'} style={style.container}>
            <View style={style.inner}>
                <Text style={style.welcome}>Welcome to RCB!</Text>
                
                <Text style={style.error}>{error}</Text>

                <Text style={style.label}>Email</Text>
                <View style={{width:'100%'}} >
                    <MaterialIcons name="email" size={20} color="#2563EB" style={style.icon} />
                    <TextInput
                        value={form.email}
                        onChangeText={(text)=>UpdateField('email',text)}
                        style={style.input}
                        placeholder="Enter your email"
                        placeholderTextColor="#9CA3AF"
                    />
                </View>
                
                <Text style={style.label}>Password</Text>
                <View style={{width:'100%'}}>
                    <MaterialIcons name="key" size={20} color="#2563EB" style={style.icon} />
                    <TextInput
                        value={form.password}
                        onChangeText={(text)=>UpdateField('password',text)}
                        style={style.input}
                        secureTextEntry={notShowPassword}
                        placeholder="Enter your password"
                        placeholderTextColor="#9CA3AF"
                    />
                    <MaterialIcons
                        name={notShowPassword ? 'visibility' : 'visibility-off'}
                        size={20}
                        color="#2563EB"
                        style={style.icon2}
                        onPress={()=>setNotShowPassword(!notShowPassword)}
                    />
                </View>

                <TouchableOpacity style={style.button} onPress={ValidateForm}>
                    <Text style={style.buttonText}>Login</Text>
                </TouchableOpacity>

                <Text style={style.signUp} onPress={()=>{navigation.replace('SignUp')}}>
                    Dont have an account? Sign up
                </Text>
            </View>
        </KeyboardAvoidingView>
    )

}


const style = StyleSheet.create({

    container:{
        flex: 1,
        backgroundColor:'#E5F0FF',   // match app background
        justifyContent:'center',
        alignItems:'center',
    },
    inner:{
        width:'85%',
        backgroundColor:'#FFFFFF',
        borderRadius:24,
        paddingVertical:30,
        paddingHorizontal:20,
        alignItems:'center',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 5,
    },
    welcome:{
        fontSize:28,
        color:'#020C2F',
        alignSelf:'flex-start',
        marginBottom: 10,
        fontWeight:'800',
    },
    error:{
        color:'#EF4444',
        marginBottom:10,
        alignSelf:'flex-start',
        fontSize:13,
    },
    label:{
        fontSize:14,
        alignSelf:'flex-start',
        color:'#111827',
        marginTop:14,
        marginBottom:4,
        fontWeight:'600'
    },
    input:{
        borderWidth:1,
        borderColor:'#D1D5DB',
        backgroundColor:'#FFFFFF',
        borderRadius:14,
        width:'100%',
        paddingLeft:44,
        paddingVertical:10,
        color:'#111827',
        fontSize:14,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    button:{
        backgroundColor:'#2563EB',
        width:'100%',
        paddingVertical:14,
        borderRadius:16,
        marginTop:28,
        shadowColor: "#1D4ED8",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.25,
        shadowRadius: 5,
        elevation: 4
    },
    buttonText:{
        color:'#FFFFFF',
        textAlign:'center',
        fontWeight:'700',
        fontSize:16
    },
    icon: {
        position: 'absolute',
        left: 10,
        top: '50%',
        transform: [{ translateY: -14 }],
        zIndex: 1,
        backgroundColor:'#E0ECFF',
        padding:6,
        borderRadius:10
    },
    icon2:{
        position: 'absolute',
        right: 10,
        top: '50%',
        transform: [{ translateY: -14 }],
        zIndex: 1,
        backgroundColor:'#E0ECFF',
        padding:6,
        borderRadius:10
    },
    signUp:{
        textDecorationLine:'underline',
        color:'#2563EB',
        marginTop:18,
        fontSize:14,
        fontWeight:'600'
    }

})


export default Login;
