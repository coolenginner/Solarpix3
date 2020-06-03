import React, {Component} from 'react';
import {StyleSheet, View, Text, Picker, BackHandler} from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import Mybutton from './components/Mybutton';
import { connect } from 'react-redux';
import _ from 'lodash';
import Toast from 'react-native-simple-toast';
import AsyncStorage from '@react-native-community/async-storage';
import { addNewJob, createJobList, setCurrentJob, setJobCounter} from '../actions';

class CreateJob extends Component {

state = { jobname: "", jobStyle: "install", jobId: ''};

componentDidMount() {
  BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
}

componentWillUnmount() {
  BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
}

handleBackButton() {
  return true;
}

getOpenJobId = () => {                                               
  const currentJobs = this.props.jobs;
  if(Object.keys(this.props.jobs).length >= 10){
    return null;
  }
  else{
    //Find an available jobId slot (starting from 0, asc);
    for(var i=0; i<10; i++){
      if(!_.findKey(currentJobs, { id: `job${i}` })){
          //console.log(`should be the first non-existing jobId`);
          return i;
      }
    }
  }
}

onSubmit = async () => {
  try {
    const value = await AsyncStorage.getItem('state');
    const projName = this.state.jobname.toUpperCase();

    if (value !== null && String(projName).length > 0) {

      if(value.includes(`"sessions":{}`))
      {
        await this.props.createJobList(projName, this.state.jobStyle, 0);
        await this.props.setCurrentJob(`job0`);
      }
      else
      {
        const jobIdNum = this.getOpenJobId();
        if(Number.isInteger(jobIdNum)){
          await this.props.addNewJob(projName, this.state.jobStyle, jobIdNum);
          await this.props.setCurrentJob(`job${jobIdNum}`);
        }
        else{
          //prevent user from creating another job
          console.log('There are already 10 jobs');
        }
      }

      this.props.navigation.navigate('CategoryList');
    }
    else
    {
      Toast.show('You did not enter the project name!',Toast.LONG);
      this.props.navigation.navigate('JobList');
    }
  } catch (error) {
    console.log(error);
  }
}

render() {  
  return (
      <View style={{ flex: 1, marginTop: 30}}>
        <Text style={{ fontSize: 20, fontWeight:'bold', marginLeft:25}}>New Job</Text>
        <Text style={{ marginTop: 20, fontWeight:'bold', marginLeft:25 }}>Project Name (Use one word for project name. If multiple team members, all use the same word.)</Text>        
        <TextInput value={this.state.jobname} onChangeText={(text) => this.setState({ jobname: text })} style={{paddingLeft:5, margin:25, marginTop:10, height: 40, borderColor: 'gray', borderWidth: 1,borderRadius:5 }}></TextInput>
        <Text style={{marginLeft:25,fontWeight:'bold'}}>Profile</Text>
        <Picker style={styles.pickerStyle}
                selectedValue={this.state.jobStyle}  
                onValueChange={(itemValue, itemPosition) =>this.setState({jobStyle: itemValue})}         >  
            <Picker.Item label="Install" value="install" />
            <Picker.Item label="PCSV" value="pcsv" />
            <Picker.Item label="Sales SV" value="ssv" /> 
        </Picker>
        <Mybutton title="Submit" customClick = {this.onSubmit}/>
      </View>
    );
  }
}

const styles = StyleSheet.create ({  
     container: {  
         flex: 1,  
         alignItems: 'center',  
         justifyContent: 'center',  
     },
    pickerStyle:{
        alignSelf: 'center',  
        height: 50,
        width: "90%",  
        color: '#344953',  
        justifyContent: 'center',  
    }  
})

const mapStateToProps = (state) => {

  try{
    return{
      currentJob: state.jobMeta.currentJob,
      counter: state.jobMeta.jobCounter,
      jobs: _.pickBy(state.sessions.entities.jobs, _.identity),
    }
  }
  catch (e){
    console.log('jobs dont exist yet');
    return{
      currentJob: state.jobMeta.currentJob,
      counter: state.jobMeta.jobCounter,
    }
  }

}

export default connect(mapStateToProps, { addNewJob, createJobList, setCurrentJob, setJobCounter })(CreateJob);