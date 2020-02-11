import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { createStackNavigator, createAppContainer } from "react-navigation";
import SignIn from './src/pages/SignIn'
import JobList from './src/pages/JobList'

const { width } = Dimensions.get('window');

export default class App extends React.Component {
  render() {
    const AppNavigator = createAppContainer(AppDrawerNavigator);
    return (
      <AppNavigator />
    );
  }
}

createAppContainer

const CustomDrawerComponent = (props) => (
  <SafeAreaView style={{ flex: 1 }}>
    <View style={{
      height: 100, backgroundColor: 'white',
      borderBottomWidth: 2,
      borderBottomColor: 'black'
    }}>
      <Text style={{ textAlign: 'center', fontSize: 40, padding: 20 }}>Menu</Text>
    </View>
    <ScrollView>
      <DrawerItems style={{
        borderBottomWidth: 2,
        borderBottomColor: 'black'
      }} {...props} />
    </ScrollView>
  </SafeAreaView>
)


const AppDrawerNavigator = createDrawerNavigator({
  CreateJob,
  JobList,
  Home,
  Settings,
  LogOut: {
    screen: SignIn,
    navigationOptions: ({ navigation }) => ({
      drawerLockMode: 'locked-closed',
    })
  },
}, {
  initialRouteName: 'LogOut',
  contentComponent: CustomDrawerComponent,
  drawerWidth: width * 2 / 3,
  contentOptions: {
    activeTintColor: 'grey',
    gestureEnabled: false,
    labelStyle: { textTransform: 'uppercase' }
  },
});
