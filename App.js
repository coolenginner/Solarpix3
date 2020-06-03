/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React from 'react';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator} from 'react-navigation-stack';
 
import SignIn from './pages/SignIn';
import JobList from './pages/JobList';
import CreateJob from './pages/CreateJob';
import CategoryList from './pages/CategoryList';
import CategoryEdit from './pages/CategoryEdit';
import BackgroundTimer from 'react-native-background-timer';
import NetInfo from '@react-native-community/netinfo';
import muploadImage from './apis/muploadImage';
import AsyncStorage from '@react-native-community/async-storage';

BackgroundTimer.runBackgroundTimer(async() => {
  const netStatus = await NetInfo.fetch();
  var uploading = await AsyncStorage.getItem('progress');
  if (netStatus.isConnected == true && uploading != 'true') {
    await muploadImage();
    await AsyncStorage.setItem('progress', 'true');
  }
},1000);

const App = createStackNavigator({
  SignIn: {
    screen: SignIn,
    navigationOptions: {
      headerShown : false,
    },
  },
  JobList: {
    screen: JobList,
    navigationOptions: {
      headerShown : false,
    },
  },
  CreateJob: {
    screen: CreateJob,
    navigationOptions: {
      headerShown : false,
    },
  },
  CategoryList: {
    screen: CategoryList,
    navigationOptions: {
      headerShown : false,
    },
  },
  CategoryEdit: {
    screen: CategoryEdit,
    navigationOptions: {
      headerShown : false,
    },
  },
});

export default createAppContainer(App);