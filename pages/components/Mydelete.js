/*Custom Button*/
import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
const Mydelete = props => {
  return (
    <TouchableOpacity style={styles.button} onPress={props.customClick}>
      <Text style={styles.text}>{props.title}</Text>
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    backgroundColor: 'red',
    color: '#ffffff',
    padding: 10,
    marginTop: 15,
    marginLeft: 25,
    marginRight: 25,
    borderRadius:5,
    height:40,
  },
  text: {
    color: '#ffffff',
  },
});
export default Mydelete;