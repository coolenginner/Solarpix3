import React from 'react';
import { StyleSheet, View, Alert, Text } from 'react-native';
import { SwipeListView } from 'react-native-swipe-list-view';

export class JobList extends React.Component {

    onAddJob = () => {
        this.props.navigation.navigate('CreateJob')
    }

    render() {

        return (
            <View style={{ flex: 1, marginTop: 50}}>
                <Text style={{ textAlign: 'left',fontSize: 25, fontWeight:'bold', marginLeft: 20}}>Job List</Text>
                <Text style={{ textAlign: 'center',marginTop: 20, fontWeight:'bold'}}>8888888</Text>
                <SwipeListView
            data={this.state.listViewData}
            renderItem={ (data, rowMap) => (
                <View style={styles.rowFront}>
                    <Text>I am {data.item} in a SwipeListView</Text>
                </View>
            )}
            renderHiddenItem={ (data, rowMap) => (
                <View style={styles.rowBack}>
                    <Text>Left</Text>
                    <Text>Right</Text>
                </View>
            )}
            leftOpenValue={75}
            rightOpenValue={-75}
        />
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