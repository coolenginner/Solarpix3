import React from 'react';
import { connect } from 'react-redux';
import {StyleSheet, View, Alert, Text} from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import Mybutton from './components/Mybutton';
import { setUsername } from '../actions';
import AsyncStorage from '@react-native-community/async-storage';

class SignIn extends React.Component {

  state = { toJobList: false, uname: "", wlimit: 3 };

  check_user = async () => {
    try {
      const value = await AsyncStorage.getItem('state');
      if (value !== null) {
        if(!value.includes(`"userData":{}`))this.setState({ toJobList: true });        
      }
    } catch (error) {
      console.log(error);
    }
  };

  componentDidMount()
  {
    this.check_user();
  }

  onSubmit = () => {
    if (String(this.state.uname).length <= this.state.wlimit && String(this.state.uname).length > 0) {
      this.props.setUsername(this.state.uname.toUpperCase());
      this.setState({ toJobList: true });
    }else {
      Alert.alert('Alert','You must enter a User Name (Max 3 characters)');
    }
  }

  render() {

    if(this.state.toJobList){
        this.props.navigation.navigate('JobList');
    }

    return (
      <View style={styles.container}>
        <Text style={styles.title}>SolarPix 3.0</Text>
        <Text style={styles.title_des}>Please Login In with your Initials</Text>
        <Text style={styles.user_input}>User Initials</Text>
        <TextInput value={this.state.uname} onChangeText={(text) => this.setState({ uname: text })} style={styles.text_input}></TextInput>
        <Mybutton title="Submit" customClick = {this.onSubmit}/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1, marginTop: 80,
  },
  title: {
    textAlign: 'center',fontSize: 25, fontWeight:'bold',
  },
  title_des: {
    textAlign: 'center',marginTop: 20, fontWeight:'bold',
  },
  user_input: {
    marginTop: 20,marginLeft:25, fontWeight:'bold',
  },
  text_input: {
    paddingLeft:5, margin:25, marginTop:10, height: 40, borderColor: 'gray', borderWidth: 1,borderRadius:5
  },
});

export default connect(null, { setUsername })(SignIn);