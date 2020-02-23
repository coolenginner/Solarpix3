import React from 'react';
import { connect } from 'react-redux';
import {StyleSheet, View, Alert} from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import Mybutton from './components/Mybutton';
import { setUsername } from '../actions';
import SyncStorage from 'sync-storage';

class SignIn extends React.Component {

  state = { toJobList: false, toSignIn: false, uname: "", wlimit: 3 };

  componentDidMount(){
    try {
      if (!String(SyncStorage.get('state')).includes(`"sessions":{}`) & !String(SyncStorage.get('state')).includes(`"userData":{}`)) {
        console.log('going to joblist');
        this.setState({ toJobList: true });
      }
    } catch (error) {
      console.log('SignIn SyncStorage check failed: ',error);
    }
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
        <TextInput value={this.state.uname} placeholder='User Initials' onChangeText={(text) => this.setState({ uname: text })} style={styles.text_input}></TextInput>
        <Mybutton title="Submit" customClick = {this.onSubmit}/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        flexDirection: 'column',
    },
    text_input: {
        paddingLeft:5, 
        marginLeft:25,
        marginRight:25, 
        marginTop:40, 
        height: 40, 
        borderColor: 'gray', 
        borderWidth: 1,
        borderRadius:5,
    },
  });

  export default connect(null, { setUsername })(SignIn);