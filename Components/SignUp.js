
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

        <View style={style.inner}>


            <Text style={style.welcome}>Sign Up!</Text>
            
            <Text style={style.error}>{error}</Text>

            <Text style={style.label}>Name</Text>

            <View style={{width:'100%'}} >
                
                <MaterialIcons name="person" size={20} color="blue" style={style.icon} />
                <TextInput value={form.name} onChangeText={(text)=>UpdateField('name',text)} style={style.input} />
            </View>

            <Text style={style.label}>Email</Text>

            <View style={{width:'100%'}} >
                
                <MaterialIcons name="email" size={20} color="blue" style={style.icon} />
                <TextInput value={form.email} onChangeText={(text)=>UpdateField('email',text)} style={style.input} />
            </View>
            
            
            <Text style={style.label}>Password</Text>

            <View style={{width:'100%'}}>
                
                <MaterialIcons name="key" size={20} color="blue" style={style.icon} />
                <TextInput value={form.password} onChangeText={(text)=>UpdateField('password',text)}  style={style.input} secureTextEntry={notShowPassword} />
                <MaterialIcons name={notShowPassword?'visibility' :'visibility-off'} size={20} color="blue" style={style.icon2} onPress={()=>setNotShowPassword(!notShowPassword)} />

            </View>

            <Text style={style.label}>Confirm Password</Text>

            <View style={{width:'100%'}}>
                
                <MaterialIcons name="key" size={20} color="blue" style={style.icon} />
                <TextInput value={form.confirmPassword} onChangeText={(text)=>UpdateField('confirmPassword',text)}  style={style.input} secureTextEntry={notShowPassword} />
                <MaterialIcons name={notShowPassword?'visibility' :'visibility-off'} size={20} color="blue" style={style.icon2} onPress={()=>setNotShowPassword(!notShowPassword)} />

            </View>

            <Text style={style.label}>Telephone</Text>

            <View style={{width:'100%'}} >
                
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
    container: {
        flex: 1,
        backgroundColor: "#E5F0FF",        // match HomePage
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 20,
    },

    inner: {
        width: "100%",
        backgroundColor: "#FFFFFF",
        borderRadius: 24,
        paddingVertical: 30,
        paddingHorizontal: 20,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 5,
    },

    welcome: {
        fontSize: 28,
        color: "#020C2F",
        alignSelf: "flex-start",
        marginBottom: 10,
        fontWeight: "800",
    },

    label: {
        fontSize: 14,
        alignSelf: "flex-start",
        color: "#111827",
        marginTop: 12,
        marginBottom: 4,
        fontWeight: "600",
    },

    error: {
        color: "#EF4444",
        marginBottom: 6,
        alignSelf: "flex-start",
        fontSize: 13,
    },

    input: {
        borderWidth: 1,
        borderColor: "#D1D5DB",
        backgroundColor: "#FFFFFF",
        borderRadius: 14,
        width: "100%",
        paddingLeft: 44,
        paddingVertical: 10,
        color: "#111827",
        fontSize: 14,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },

    button: {
        backgroundColor: "#2563EB",
        width: "100%",
        paddingVertical: 14,
        borderRadius: 16,
        marginTop: 28,
        shadowColor: "#1D4ED8",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.25,
        shadowRadius: 5,
        elevation: 4,
    },

    buttonText: {
        color: "#FFFFFF",
        textAlign: "center",
        fontWeight: "700",
        fontSize: 16,
    },

    icon: {
        position: "absolute",
        left: 10,
        top: "50%",
        transform: [{ translateY: -14 }],
        zIndex: 1,
        backgroundColor: "#E0ECFF",
        padding: 6,
        borderRadius: 10,
    },

    icon2: {
        position: "absolute",
        right: 10,
        top: "50%",
        transform: [{ translateY: -14 }],
        zIndex: 1,
        backgroundColor: "#E0ECFF",
        padding: 6,
        borderRadius: 10,
    },

    signUp: {
        marginTop: 18,
        fontSize: 14,
        fontWeight: "600",
        color: "#2563EB",
        textDecorationLine: "underline",
    },
});



export default SignUp;