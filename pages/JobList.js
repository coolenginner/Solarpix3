import React from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import SyncStorage from 'sync-storage';
import { setCurrentJob, updateJobColor } from '../actions';
import { StyleSheet, Text, View, TouchableOpacity, FlatList, TouchableWithoutFeedback } from 'react-native';

class JobList extends React.Component {
  
  state = {
    toCategories: false,
    toDelete: false,
    toSignin: false,
    jobId: ''
  };

  componentDidMount(){
    //If userData is empty, redirect to Signin page
    try {
      if(String(SyncStorage.get('state')).includes(`"userData":{}`)){
        console.log('entered redirect to signin');
        this.setState({ toSignin: true });
      }
    }
    catch (e){
      console.log("get State error: ",e)
      console.log('entered redirect to signin');
      this.setState({ toSignin: true });
    }

    // try{
    //   for(let i=0; i<this.props.sessionData.length; i++){
    //     this.checkForPhotoCompletion(this.props.sessionData[i].id);
    //   }
    // }
    // catch (e){
    //   console.log(e);
    // }
  }

  checkForPhotoCompletion = async (jobId) => {
    //loop through all existinh job tables and check for any 'norUploaded' photos
    try{
      const uploadedPhotosCount = await db.table(jobId)
        .where('uploadStatus').equals('notUploaded').count();
      const jobPhotosCount = await db.table(jobId).count();
        //console.log('This should be the not uploaded photos: ',localCatPhotosCount);
      if(uploadedPhotosCount === 0 & jobPhotosCount !== 0){
        //all uploaded, go green
        console.log('Green', jobId);
        this.props.updateJobColor(jobId,`rgba(75, 225, 75, 0.2)`);
      }
      else if(uploadedPhotosCount !== 0){
        //some remaining, go red
        this.props.updateJobColor(jobId,`rgba(225, 75, 75, 0.2)`);
      }
    }
    catch (e){
      console.log(e);
    }
  }

  onNewJobClicked = () => {
    console.log('new job button clicked');
    this.props.navigation.navigate('CreateJob');
  }

  onJobClick = async (jobId) => {
    await this.props.setCurrentJob(jobId);
    await this.setState({ toCategories: true, jobId: jobId });
  }

  onDeleteClick = async (jobId) => {
    await this.props.setCurrentJob(jobId);
    this.setState({ toDelete: true, jobId: jobId });
  }

  actionOnRow(item) {
    console.log('Selected Item :',item);
  }

  renderList(){
    if(this.props.sessionData){
      return(
        <FlatList
            data= {this.state.data_list}
            keyExtractor={(item, index) => index.toString() }
            extraData= {this.state}
            renderItem={ ({job, index}) =>
              <TouchableWithoutFeedback onPress={ () => this.actionOnRow(job)}>
                <View key={job.id} style={styles.view_list}>              
                  <Text style={styles.list}>{job.projectName}</Text>
                  <TouchableOpacity style={styles.delete_button} onPress={this.actionOnRow(job)}>
                    <Text style={{color:'white', fontSize:15, fontWeight:"bold", textAlign:'center' }}>Delete</Text>    
                  </TouchableOpacity>
                </View>
              </TouchableWithoutFeedback>
            }
            numColumns={1}
          /> 
      );
    }
  }

  render() {

    // if(this.state.toCategories){
    //   return <Redirect to={`/${this.state.jobId}/categories`} />
    // }
    // else if(this.state.toDelete){
    //   return <Redirect to={'/delete'} />
    // }
    // else if(this.state.toSignin){
    //   return <Redirect to='/' />
    // }

    return (
      <View style={styles.container}>
        <TouchableOpacity style={styles.view_newjob} onPress={this.onNewJobClicked}>
          <Text style={styles.text_newjob}>NEW JOB</Text>
        </TouchableOpacity>
        {this.renderList()}
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
    text: {
      fontSize: 25, fontWeight:'bold', marginLeft: 20,
    },
    text_newjob: {
      fontSize: 18, marginBottom:10, color:'red' , marginLeft: 10,
    },
    view_newjob: {
      marginTop: 25, flexDirection: 'row', marginLeft: 10,
    },
    view_list: {
      height: 50, marginLeft:10, marginRight:10, marginTop: 5, backgroundColor: 'pink', justifyContent:'center', flexDirection: 'row', justifyContent: 'space-between',alignItems: 'center'
    },
    list: {
      fontSize:16, marginLeft:10,
    },
    delete_button: {
      marginRight:10, borderRadius:3, width:70, height:40, backgroundColor:'red', padding:8, justifyContent: 'center',
    },
  });

  const mapStateToProps = (state) => {

    //Check if there are existing jobs.  If not, let joblist be blank
    //_.compact removed undefined values from jobs
    try{
      return{
        userName: state.userData,
        sessionData: _.compact(Object.values(state.sessions.entities.jobs))
      };
    }
    catch (e){
      //console.log(e);
      return{
        userName: state.userData,
      };
    }
  }

  export default connect(mapStateToProps, { setCurrentJob, updateJobColor })(JobList);