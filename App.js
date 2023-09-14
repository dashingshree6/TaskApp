import { NavigationContainer } from '@react-navigation/native';
import React, { useContext } from 'react';
import { Provider } from 'react-redux'
import AppScreen from './AppScreen';
import { store } from './screens/Redux/Store';

export default function App() {
  return (
    <Provider store={store}>
      <AppScreen/>
    </Provider>
  );
}

