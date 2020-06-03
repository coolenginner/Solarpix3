import React from 'react';
import { connect } from 'react-redux';
import {StyleSheet, View, Alert, Text} from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import Mybutton from './components/Mybutton';
import { setUsername } from '../actions';
import AsyncStorage from '@react-native-community/async-storage';

let userpass = ''
class SignIn extends React.Component {

  state = { uname: "", wlimit: 3,pass: ""};

  componentDidMount = async () => {

    try {
      const value = await AsyncStorage.getItem('state');

      if (value !== null && !value.includes(`"userData":{}`)) {
        this.props.navigation.navigate('JobList');
      }
      else
      {
        fetch('http://hydrogen.empower-solar.com/solarpix/dev/superduper.txt')
        .then((r) => r.text())
        .then(text  => {
          userpass = text;
        })
      }
    } catch (error) {
      console.log(error);
    }
  }

  onSubmit = () => {
    if (String(this.state.uname).length <= this.state.wlimit && String(this.state.uname).length > 0) {
      if(this.state.pass == userpass)
      {
        this.props.setUsername(this.state.uname.toUpperCase());
        this.props.navigation.navigate('JobList');
      }
      else
      {
        Alert.alert('Alert','Please enter correct unlock key.');
      }
    }else {
      Alert.alert('Alert','You must enter a User Name (Max 3 characters)');
    }
  }
 
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>SolarPix</Text>
        <Text style={styles.title_des}>Please email solarpix@empower-solar.com with any questions accessing or using this application.</Text>
        <Text style={styles.user_input}>User Initials</Text>
        <TextInput value={this.state.uname.toUpperCase().trim()} onChangeText={(text) => this.setState({ uname: text })} style={styles.text_input}></TextInput>
        <Text style={styles.user_input_bottom}>Unlock Key</Text>
        <TextInput value={this.state.pass.trim()} onChangeText={(text) => this.setState({ pass: text })} style={styles.text_input}></TextInput>
        <Mybutton title="Submit" customClick = {this.onSubmit}/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1, marginTop: 50,
  },
  title: {
    textAlign: 'center',fontSize: 25, fontWeight:'bold',
  },
  title_des: {
    textAlign: 'center',marginTop: 20, marginLeft:20, marginRight:20, fontWeight:'bold',
  },
  user_input: {
    marginTop: 20,marginLeft:25, fontWeight:'bold',
  },
  user_input_bottom: {
    marginTop: -15,marginLeft:25, fontWeight:'bold',
  },
  text_input: {
    paddingLeft:5, margin:25, marginTop:10, height: 40, borderColor: 'gray', borderWidth: 1,borderRadius:5
  },
});

export default connect(null, { setUsername })(SignIn);