import React, {Component} from 'react';
import {StyleSheet, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

export default class JobList extends Component {
  render() {

    return (
      <View style={{ flex: 1, marginTop: 80}}>
        <Text style={styles.text}>Job List</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 20,
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
  },
  text: {
    textAlign: 'left',fontSize: 25, fontWeight:'bold', marginLeft: 20,
  }
});