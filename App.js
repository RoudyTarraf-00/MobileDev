import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import Login from './Components/Login';
import { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SignUp from './Components/SignUp';
import Starter from './Components/Starter';
import HomePage from './Components/HomePage';
import ProfilePage from './Components/ProfilePage';
import TransferPage from './Components/TransferPage';


export default function App() {

  const [users,setUsers]= useState([])

  const Stack = createNativeStackNavigator()

  return (
    <NavigationContainer>

      <Stack.Navigator screenOptions={{headerShown:true}} >

        <Stack.Screen name='Starter' >
          {props => <Starter {...props} />}
        </Stack.Screen>

          <Stack.Screen name='Login' >
          {props => <Login {...props} users={users} setUsers={setUsers} />}
        </Stack.Screen>

        <Stack.Screen name='SignUp' >
          {props => <SignUp {...props} users={users} setUsers={setUsers} />}
        </Stack.Screen>

        <Stack.Screen name='HomePage' options={{ headerShown: false }}  >
          {props => <HomePage {...props} users={users} setUsers={setUsers} />}
        </Stack.Screen>

        <Stack.Screen name='ProfilePage' >
          {props => <ProfilePage {...props} users={users} setUsers={setUsers} />}
        </Stack.Screen>

        <Stack.Screen name='TransferPage' >
          {props => <TransferPage {...props} users={users} setUsers={setUsers} />}
        </Stack.Screen>

      </Stack.Navigator>
      
    </NavigationContainer>
  );
}


