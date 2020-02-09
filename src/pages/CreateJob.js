import React, { Component } from 'react'
import { View , Text} from 'react-native'
import { Form, Item, Input, Button, Text as NBText } from 'native-base'
import { Dropdown } from 'react-native-material-dropdown';

export class CreateJob extends Component {
	state = {
		text: ''
	}

	onChangeText = event => {
		this.setState({ task: event.nativeEvent.text })
	}

	onAddTask = () => {
		// this.props.navigation.state.params.saveItem(this.state.task)
		this.props.navigation.goBack()
	}

	render() {

        let data = [{
            value: 'Install',
          }, {
            value: 'PCSV',
          }, {
            value: 'Sales SV',
          }];

		return (
			<View style={{ flex: 1, marginTop: 100}}>
                <Text style={{ fontSize: 25, fontWeight:'bold',marginBottom:20, marginLeft:15}}>New Job</Text>
				<View style={{ marginRight: 10 }}>
					<Form>
						<Item>
							<Input
								placeholder='Project Name (try to use one word, all use same)'
								value={this.state.task}
								autoFocus
								clearButtonMode='always'
								autoCorrect={false}
								onChange={this.onChangeText}
								onSubmitEditing={this.onAddTask}
                                returnKeyType={'done'}
                                style={{fontSize:15}}
							/>
						</Item>
					</Form>
				</View>
                <View style={{marginLeft:15, marginRight:15}}>
                    <Dropdown label='Profile' data={data}/>
                </View>
				<View style={{ marginTop: 20 }}>
					<Button
						style={{ backgroundColor: '#2185D0', margin: 25, justifyContent: 'center' }}
						onPress={this.onAddTask}
					>
						<NBText style={{ fontWeight: 'bold' }}>Submit</NBText>
					</Button>
				</View>
			</View>
		)
	}
}

export default CreateJob