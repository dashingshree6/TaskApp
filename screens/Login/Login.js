import React, { useState } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import { signinApi } from '../../API';
import SyncStorage from 'sync-storage';
import { AppContext } from '../../App';

const LoginScreen = ({ navigation }) => {
  const {dispatch} = React.useContext(AppContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Event handler after login is successful will navigate to Tasks screen 
  const handleLogin = () => {
    let body = {
        email: email,
        password: password
    }

    signinApi(body).then((res)=>{
        SyncStorage.set('userDetails', res.data);
        SyncStorage.set('token', res?.data?.token);
        dispatch({type: 'login'});

        navigation.navigate('Home');
    }).catch(err =>{
        console.log(err)
    })
  };

  return (
    <View>
      <Text>Email:</Text>
      <TextInput
        onChangeText={setEmail}
        value={email}
        placeholder="Enter your email"
      />
      <Text>Password:</Text>
      <TextInput
        onChangeText={setPassword}
        value={password}
        secureTextEntry
        placeholder="Enter your password"
      />
      <Button title="Login" onPress={handleLogin} />
    </View>
  );
};

export default LoginScreen;
