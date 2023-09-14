import React, { useState } from 'react';
import { View, Text, TextInput, Button, ImageBackground, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { signUpApi } from '../../API';
import SyncStorage from 'sync-storage';
import { useSelector, useDispatch } from 'react-redux'
import { loaderOff, loaderOn, login } from '../Redux/authenticationSlice';

const SignUpScreen = ({ navigation }) => {
  const dispatch = useDispatch()
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Event handler for signup
  const handleSignup = () => {

    if(!email || !password) {
      Alert.alert("Login", "Please provide email and password")
    } else {
      let body = {
        email: email,
        password: password
      }
      dispatch(loaderOn())

      signUpApi(body).then((res)=>{
          setEmail("");
          setPassword("")
          dispatch(loaderOff())
          Alert.alert("Create Account","User created successfully")
      }).catch(err =>{
          dispatch(loaderOff())
          console.log(err)
      })

    }

  };

  return (
    <View style={styles.mainContainer}>
      <View style={styles.headerContainer}>
        <Text style={styles.welcomeText}>Let's Get Started!</Text>
        <Text style={styles.loginText}>Create an account to login</Text>
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
        onPress={handleSignup}
        >
          <Text>Create</Text>
        </TouchableOpacity>
      </View>
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
  }
});

export default SignUpScreen;
