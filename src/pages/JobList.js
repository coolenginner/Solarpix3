import React from 'react';
import { StyleSheet, View, Alert, Text } from 'react-native';
// import FloatingButton from '../components/FloatingButton'

export class JobList extends React.Component {

    onAddJob = () => {
        this.props.navigation.navigate('CreateJob')
    }

    render() {

        return (
            <View style = { styles.container }>
                <Text style={{ fontSize: 28, fontWeight:'bold' }}>Job List</Text>
                <View className="item" key='warning'>Limit 10 jobs.  Delete jobs to make space.</View>
                {/* <FloatingButton actionOnPress={this.onAddJob} /> */}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1, 
        marginTop: 50, 
        marginLeft:15, 
        marginRight:15
    }
})