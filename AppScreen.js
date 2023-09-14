import { Pressable, StyleSheet, Text, View } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import React, { useContext } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import AntDesign from 'react-native-vector-icons/AntDesign';
import SyncStorage from 'sync-storage';
import { useSelector, useDispatch } from 'react-redux'

// Screens
import LoginScreen from './screens/Login/Login';
import TaskScreen from './screens/Tasks/Tasks';
import CreateTaskScreen from './screens/Tasks/CreateTask';
import { logout } from './screens/Redux/authenticationSlice';
import ActivityLoader from './screens/ActivityLoader';
import SignUpScreen from './screens/Signup/SignUp';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function MyTabs({navigation}) {
  const dispatch = useDispatch()

  return (
    <Tab.Navigator>

      <Tab.Screen 
      name="TaskList" 
      component={TaskScreen} 
      options={{
        tabBarIcon: (props)=> <FontAwesome5 name="tasks" size={30} color={props.color}/>,
        headerRight:()=> (
          <Pressable
          onPress={()=>{
            // It will clear the all values stored in syncstorage 
            SyncStorage.remove('userDetails')
            SyncStorage.remove('token')
            .then(() => {
              // Logout action will dispatched 
              dispatch(logout())
              //After clearing storage it will navigate to Login Page
              navigation.navigate("Login")
            })
            .catch(error => {
              console.log(error);
            });
          }}
          style={{
            alignItems:'center',
            padding:5,
            paddingRight:20
          }}
          >
            <AntDesign name="logout" size={25} color={'#ff0000'}/>
            <Text style={{color:'#ff0000'}}>Logout</Text>
          </Pressable>
          ),
          tabBarActiveTintColor: "#00ace6"
      }}
      />

      <Tab.Screen 
      name="CreateTask" 
      component={CreateTaskScreen} 
      options={{
        tabBarIcon: (props)=> <MaterialIcons name="add-task" size={30} color={props.color} />,
        tabBarActiveTintColor: "#00ace6"
      }}
      />

    </Tab.Navigator>
  );
}

export default function AppScreen() {
  const isAuthenticated = useSelector((state) => state.auth.authenticated)
  const isLoading = useSelector((state) => state.auth.loading)

  return (
        <NavigationContainer>
          {isLoading && <ActivityLoader/>}
          <Stack.Navigator initialRouteName="Login">
            { !isAuthenticated ? 
            
            (
            <>
            <Stack.Screen 
            name="Login" 
            component={LoginScreen} 
            options={{
              headerTitle:"Task Manager",
              headerTintColor:"grey",
              headerTitleAlign:"center",
            }}
            />

          <Stack.Screen 
            name="Signup" 
            component={SignUpScreen} 
            options={{
              headerTitle:"Task Manager",
              headerTintColor:"grey",
              headerTitleAlign:"center",
            }}
            />
            </>
            )
            :
            (
            <Stack.Screen 
            name="Home" 
            component={MyTabs} 
            options={{
              headerShown:false,
            }} 
            />
            )
          }
          </Stack.Navigator>
        </NavigationContainer>
  );
}

