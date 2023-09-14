import React, { useState } from 'react';
import { View, Text, TextInput, Button, ImageBackground, StyleSheet, TouchableOpacity, Alert, Pressable } from 'react-native';
import { signinApi } from '../../API';
import SyncStorage from 'sync-storage';
import { useSelector, useDispatch } from 'react-redux'
import { loaderOff, loaderOn, login } from '../Redux/authenticationSlice';

const LoginScreen = ({ navigation }) => {
  const dispatch = useDispatch()
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Event handler after login is successful will navigate to Tasks screen 
  const handleLogin = () => {

    if(!email || !password) {
      Alert.alert("Login", "Please provide email and password")
    } else {
      let body = {
        email: email,
        password: password
      }
      dispatch(loaderOn())

      signinApi(body).then((res)=>{
          SyncStorage.set('userDetails', res.data);
          SyncStorage.set('token', res?.data?.token);
          dispatch(login()) 
          dispatch(loaderOff())
          navigation.navigate('Home');
      }).catch(err =>{
          dispatch(loaderOff())
          console.log(err)
      })

    }

  };

  return (
    <View style={styles.mainContainer}>
      <View style={styles.headerContainer}>
        <Text style={styles.welcomeText}>Welcome back!</Text>
        <Text style={styles.loginText}>Login to your existing account</Text>
      </View>
      <View style={styles.container}>
        <Text style={styles.label}>Email:</Text>
        <TextInput
          style={styles.input}
          onChangeText={setEmail}
          value={email}
          placeholder="Enter your email"
        />

        <Text style={styles.label}>Password:</Text>
        <TextInput
          style={styles.input}
          onChangeText={setPassword}
          value={password}
          secureTextEntry
          placeholder="Enter your password"
        />

        <TouchableOpacity
        style={styles.loginBtn}
        onPress={handleLogin}
        >
          <Text>Login</Text>
        </TouchableOpacity>
      </View>
      <Pressable 
      style={styles.bottomCont}
      onPress={()=> navigation.navigate("Signup")}
      >
        <Text>Don't have an account? <Text style={styles.signupText}>Sign Up</Text></Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    justifyContent: 'center', // Center the content vertically
    padding:10
  },
  container: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)', // Semi-transparent white background
    padding: 20,
    borderRadius: 10,
  },
  label: {
    fontSize: 12,
    marginBottom: 4,
    color: 'grey',
  },
  headerContainer: {
    alignItems:'center',
    marginBottom:20
  },
  welcomeText:{
    fontSize:30,
    fontWeight:'bold',
    color:'black'
  },
  loginText:{
    fontSize:10,
    fontWeight:'bold',
    color:'grey'
  },
  input: {
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 24,
    padding: 8,
    marginBottom: 12,
    backgroundColor: 'white',
  },
  loginBtn: {
    alignItems:'center',
    padding:12,
    backgroundColor:'#ffcc00',
    borderRadius:24
  },
  loginText: {
    color:'grey'
  },
  bottomCont: {
    alignItems:'center',
    marginTop:10
  },
  signupText: {
    color:'blue',
    fontWeight:'bold'
  }
});

export default LoginScreen;
