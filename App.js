import { Pressable, StyleSheet, Text, View } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { TouchableOpacity } from 'react-native-web';
import SyncStorage from 'sync-storage';

// Screens
import LoginScreen from './screens/Login/Login';
import TaskScreen from './screens/Tasks/Tasks';
import CreateTaskScreen from './screens/Tasks/CreateTask';

// Create context
export const AppContext = React.createContext();

// Initial state
const initialState = {
  isAuthenticated: false,
  loading: false
};

// Reducer
const reducer = (state, action) => {
  switch (action.type) {
    case 'login':
      return {
        ...state,
        isAuthenticated: true,
      };
    case 'logout':
      return {
        ...state,
        isAuthenticated: false,
      };
      case 'reloadPage':
        return {
          ...state,
          loading: true,
        };

        case 'stopReloadPage':
          return {
            ...state,
            loading: false,
          };

    default:
      return state;
  }
};

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function MyTabs({navigation}) {
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
              //After clearing storage it will navigate to Login Page
              navigation.navigate("Login")
            })
            .catch(error => {
              console.log(error);
            });
          }}
          style={{
            alignItems:'center',
            padding:5
          }}
          >
            <AntDesign name="logout" size={30} color={'#ff0000'}/>
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

export default function App() {
  const [state, dispatch] = React.useReducer(reducer, initialState);
  

  return (
    <AppContext.Provider
      value={{
        state,
        dispatch,
      }}>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Login">
            <Stack.Screen 
            name="Login" 
            component={LoginScreen} 
            // options={{
            //   headerShown:false,
            // }}
            />
            <Stack.Screen 
            name="Home" 
            component={MyTabs} 
            options={{
              headerShown:false,
            }} 
            />
          </Stack.Navigator>
        </NavigationContainer>
    </AppContext.Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
