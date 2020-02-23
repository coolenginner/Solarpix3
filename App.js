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
// import ViewUser from './pages/ViewUser';
// import ViewAllUser from './pages/ViewAllUser';
// import DeleteUser from './pages/DeleteUser';
 
const App = createStackNavigator({
  SignIn: {
    screen: SignIn,
    navigationOptions: {
      title: 'SIGN IN',
      headerStyle: { backgroundColor: '#f05555' },
      headerTintColor: '#ffffff',
    },
  },
  JobList: {
    screen: JobList,
    navigationOptions: {
      title: 'JOBLIST',
      headerStyle: { backgroundColor: '#f05555' },
      headerTintColor: '#ffffff',
      headerLeft: null,
    },
  },
  CreateJob: {
    screen: CreateJob,
    navigationOptions: {
      title: 'CreateJob',
      headerStyle: { backgroundColor: '#f05555' },
      headerTintColor: '#ffffff',
      headerLeft: null,
    },
  },
  // Update: {
  //   screen: UpdateUser,
  //   navigationOptions: {
  //     title: 'Update User',
  //     headerStyle: { backgroundColor: '#f05555' },
  //     headerTintColor: '#ffffff',
  //   },
  // },
  // Register: {
  //   screen: RegisterUser,
  //   navigationOptions: {
  //     title: 'Register User',
  //     headerStyle: { backgroundColor: '#f05555' },
  //     headerTintColor: '#ffffff',
  //   },
  // },
  // Delete: {
  //   screen: DeleteUser,
  //   navigationOptions: {
  //     title: 'Delete User',
  //     headerStyle: { backgroundColor: '#f05555' },
  //     headerTintColor: '#ffffff',
  //   },
  // },
});
export default createAppContainer(App);