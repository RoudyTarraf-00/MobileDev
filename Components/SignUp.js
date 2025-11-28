
import { StyleSheet, Text, View,TextInput, TouchableOpacity, Button, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useState } from 'react';


const SignUp=({navigation,users,setUsers})=>{


    const [notShowPassword,setNotShowPassword]= useState(true)
    const [error,setError]= useState('')
    const [form,setForm]= useState({
        email:'',
        name:'',
        phone:'',
        password:'',
        confirmPassword:'',
    })




    const  ValidateForm= async()=>{

        setError('')

        if(form.email===''||form.password===''||form.confirmPassword===''|| form.phone===''||form.name===''){
            setError('All fields are required');
            return
        }

        if(form.password.length<8){
            setError('Password must be atleast 8 chars');
            return
        }

        if(form.password!==form.confirmPassword){
            setError("Passwords must match");
            return
        }

         const user = users.find((e) => e.email === form.email );

        if (user) {
            setError('Email already in use');
            return
        } 

        const phone = users.find((e) => e.phone === form.phone );

        if (phone) {
            setError('Phone already in use');
            return
        } 

        console.log("Submitting")
try {
    const response = await fetch("https://mobileproject-arbab5hmekdwa0gv.francecentral-01.azurewebsites.net/api/users/register", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            name: form.name,
            email: form.email,
            phone: form.phone,
            password: form.password,
            balance: 0.0 
        })
        
    });

    if (response.ok) {
        const createdUser = await response.json(); 
        Alert.alert("Account Created Successfully");
        navigation.replace("Login");
        setUsers([...users,createdUser])
    } else {
        const errorData = await response.json();
        setError(errorData.message || "Registration failed");
    }
} catch (error) {
    console.error(error);
    setError("Error connecting to server");
}

      

    }
    





    const UpdateField = (field, value) => {
    setForm({ ...form, [field]: value });
};


    return (
        

        <KeyboardAvoidingView behavior={'padding'} style={style.container}>

        <View style={style.container}>


            <Text style={style.welcome}>Sign Up!</Text>
            
            <Text style={style.error}>{error}</Text>

            <Text style={style.label}>Name</Text>

            <View style={{width:'80%'}} >
                
                <MaterialIcons name="person" size={20} color="blue" style={style.icon} />
                <TextInput value={form.name} onChangeText={(text)=>UpdateField('name',text)} style={style.input} />
            </View>

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

            <Text style={style.label}>Confirm Password</Text>

            <View style={{width:'80%'}}>
                
                <MaterialIcons name="key" size={20} color="blue" style={style.icon} />
                <TextInput value={form.confirmPassword} onChangeText={(text)=>UpdateField('confirmPassword',text)}  style={style.input} secureTextEntry={notShowPassword} />
                <MaterialIcons name={notShowPassword?'visibility' :'visibility-off'} size={20} color="blue" style={style.icon2} onPress={()=>setNotShowPassword(!notShowPassword)} />

            </View>

            <Text style={style.label}>Telephone</Text>

            <View style={{width:'80%'}} >
                
                <MaterialIcons name="phone" size={20} color="blue" style={style.icon} />
                <TextInput value={form.phone} onChangeText={(text)=>UpdateField('phone',text)} style={style.input}  keyboardType='numeric'/>
            </View>

            <TouchableOpacity style={style.button} onPress={ValidateForm}>
                <Text style={style.buttonText}>Login</Text>
            </TouchableOpacity>

            <Text style={style.signUp} onPress={()=>{navigation.replace('Login')}}>Already have an account? Login</Text>
                
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
        marginTop:0,
        marginBottom:0
    },
    signUp:{
        textDecorationLine:'underline',
        color:'blue',
        marginTop:15
    }

})


export default SignUp;