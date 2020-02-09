import React from 'react';
import { StyleSheet, View, Alert, Text } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import { Button } from 'react-native-elements';

export class SignIn extends React.Component {

    state = { toJobList: false, toSignIn: false, uname: "", pass: "", wlimit: 3 };

    isMet = () => {

        // if (String(this.state.uname).length <= this.state.wlimit && String(this.state.uname).length > 0) {
            this.setState({ uname: "", pass: "" });
            // this.props.navigation.navigate('JobList', { name: this.state.uname });
            this.props.navigation.navigate('JobList');
        // } else {
        //     Alert.alert('Alert','You must enter a User Name (Max 3 characters)');
        // }
    }

    render() {

        return (
            <View style={{ flex: 1, marginTop: 100}}>
                <Text style={{ textAlign: 'center',fontSize: 25, fontWeight:'bold' }}>SolarPix 3.0</Text>
                <Text style={{ textAlign: 'center',marginTop: 20, fontWeight:'bold'}}>Please Login In with your Initials</Text>
                <Text style={{ marginTop: 20,marginLeft:15, fontWeight:'bold'}}>User Initials</Text>
                <TextInput value={this.state.uname} onChangeText={(text) => this.setState({ uname: text })} style={{paddingLeft:5, margin:15, marginTop:10, height: 40, borderColor: 'gray', borderWidth: 1,borderRadius:5 }}></TextInput>
                <Button title="Submit" color="#f194ff"
                    style={{ margin:15, marginTop:20, height: 40, backgroundColor: '#2185D0',borderRadius:5}}
                    onPress={this.isMet}></Button>
            </View>
        );
    }
}

// export default connect(null, { setUsername })(SignIn);