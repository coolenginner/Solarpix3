import React from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import SyncStorage from 'sync-storage';
import {StyleSheet, View, Alert} from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import { TextInput } from 'react-native-gesture-handler';
import Mybutton from './components/Mybutton';
import { addNewJob, createJobList, setCurrentJob, setJobCounter } from '../actions';

class CreateJob extends React.Component {

    state = { uname: "",profileName: "",toCategories: false,toDelete: false,toSignin: false,jobId: ''}

    componentDidMount(){
        //If userData is empty, redirect to Signin page
        try {
            if(String(SyncStorage.get('state')).includes(`"userData":{}`)){
              console.log('entered redirect');
              this.setState({ toSignin: true });
            }
        }
        catch (e){
            console.log("get State error: ",e)
        }
    }                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           
    getOpenJobId = () => {    
        console.log('currentJob started');                                                
        const currentJobs = this.props.jobs;
        console.log(currentJobs);
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

    onSubmit = () => {
        // this.props.navigation.navigate('JobList');
        const projName = this.state.uname.toUpperCase();
        // If there are no current jobs, create jobList w/ normalized data
        try {
            if(String(SyncStorage.get('state')).includes(`"sessions":{}`)){
              this.props.createJobList(projName, profileName, 0);
              this.props.setCurrentJob(`job0`);
            }
            else
            {
              const jobIdNum = this.getOpenJobId();
              console.log(jobIdNum);
              if(Number.isInteger(jobIdNum)){
                  this.props.addNewJob(projName, profileName, jobIdNum);
                  this.props.setCurrentJob(`job${jobIdNum}`);
              }
              else{
                  //prevent user from creating another job
                  console.log('There are already 10 jobs');
              }
            }
          }
          catch (e){
            console.log("get State error: ",e)
          }

        //set state to true for navigation
        this.setState({ toCategories: true, jobId: this.props.currentJob });
    }
    
    render() {
        if(this.state.toCategories){
            //return <Redirect to={`/${this.state.jobId}/categories`} />
        }
        else if(this.state.toDelete){
           //return <Redirect to='/delete' />
        }
        else if(this.state.toSignin){
           //return <Redirect to='/' />
        }

      return (
          <View style={styles.container}>
            <TextInput value={this.state.uname} placeholder='Project Name (try to use one word, all use same)' onChangeText={(text) => this.setState({ uname: text })} style={styles.text_input}></TextInput>
            <View style={{marginBottom: 10, flexDirection: 'row', marginLeft: 30,}}>
                <RNPickerSelect onValueChange={(value) => this.setState({ profileName: value })}
                    items={[
                        { label: 'Install', value: 'install' },
                        { label: 'PCSV', value: 'pcsv' },
                        { label: 'Sales SV', value: 'ssv' },
                    ]}
                    style = {styles.pickerStyle}
                />
            </View>
            <Mybutton title="Submit" customClick = {this.onSubmit}/>
          </View>
        );
    }
}

const styles = StyleSheet.create ({  
    container: {
       flex: 1,
       backgroundColor: 'white',
       flexDirection: 'column', 
    },
   pickerStyle:{
       margin:25,
   },  
   text_input:{
       paddingLeft:5, 
       margin:25, 
       marginTop:50,
       height:40,
       borderColor: 'gray', 
       borderWidth: 1,
       borderRadius:5
   },
})

const mapStateToProps = (state) => {

    try{
      return{
        currentJob: state.jobMeta.currentJob,
        counter: state.jobMeta.jobCounter,
        jobs: _.pickBy(state.sessions.entities.jobs, undefined),
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
  