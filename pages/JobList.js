import React from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import Database from '../Database';
import Modal from "react-native-modal";
import Mydelete from './components/Mydelete';
import Mycancel from './components/Mycancel';
import { setCurrentJob, updateJobColor , deleteJob} from '../actions';
import { StyleSheet, Text, View, TouchableOpacity, FlatList, TouchableWithoutFeedback, BackHandler} from 'react-native';

const db = new Database();
class JobList extends React.Component {
  
  state = {
    currentVersion:'Version 3.4.1',
    toDelete: false,
    jobIdtoDel: '',
    pictureReqtoDel:'',
    delVisisble: false,
    products:[]
  };
  
  componentDidMount = async () => {

    BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);

    try
    {
      fetch('http://hydrogen.empower-solar.com/solarpix/dev/versioncheck.txt')
      .then((r) => r.text())
      .then(text  => {
        const serial = text.split('-');
        if(serial[0] != '3' || serial[1] != '4' || serial[2] != '1')
        {
          this.setState({ currentVersion: this.state.currentVersion + ' - OUT OF DATE, UPDATE ASAP.' });
        }
      })
    } catch (error) {
      this.setState({ currentVersion: this.state.currentVersion + ' - Unable to check latest version.' });
    }
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
  }

  handleBackButton() {
    return true;
  }

  onNewJobClicked = async() => {
    this.props.navigation.navigate('CreateJob');
  }

  onJobClick = async (jobId) => {
    await this.props.setCurrentJob(jobId);
    await this.setState({ jobId: jobId });
    if(!this.state.delVisisble){
      this.props.navigation.navigate('CategoryList');
    }
  }

  onDeleteClick = async (jobId) => {
    await this.setState({ delVisisble: true });
    await this.props.setCurrentJob(jobId);
  }

  onDeleteConfirmClick = async () => {
    const jobId = this.props.currentJobId;
    const pictureReq = this.props.currentPictureReq;

    try{
      this.props.setCurrentJob('');
      await db.deleteProduct(jobId);
      await this.props.deleteJob(jobId, pictureReq);
      await this.setState({ delVisisble: false });
    }
    catch (e){
      console.log('Not available to delete', e);
      await this.setState({ delVisisble: false });
    }
  }

  onBackClicked = async (jobId) => {
    await this.setState({ delVisisble: false });
  }

  renderList(){
    if(this.props.sessionData){
      return this.props.sessionData.map( job => {
        return(
            <View key={job.id} style={{height: 50, margin: 4, borderRadius:5, marginLeft:15, marginRight:15, backgroundColor: `${job.color}`, justifyContent:'center', flexDirection: 'row', justifyContent: 'space-between',alignItems: 'center'}}>
              <TouchableWithoutFeedback onPress={ () => this.onJobClick(job.id)}>
                <Text style={styles.list}>{job.projectName}</Text>
              </TouchableWithoutFeedback>
              <TouchableOpacity style={styles.delete_button} onPress={ () => this.onDeleteClick(job.id)}>
                <Text style={{color:'white', fontSize:12}}>Delete</Text>    
              </TouchableOpacity>           
            </View>
        );
      });
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <Modal isVisible={this.state.delVisisble}>
          <View style={{backgroundColor:'white', borderRadius:10}}>
            <Text style={styles.del_text}>Delete Job:{this.props.currentJob === '' ? this.props.currentJob.projectName : ''}</Text>
            <Text style = {styles.del_newjob}>Please ensure all photos are uploaded for this job.  You will lose all the photos for this job.</Text>
            <View style={styles.del_set}>
              <View style={styles.buttonContainer}>
                <Mydelete title="Delete Job" customClick = {this.onDeleteConfirmClick}/>
              </View>
              <View style={styles.buttonContainer}>
                <Mycancel title="Cancel" customClick = {this.onBackClicked}/>
              </View>
            </View>
          </View>
        </Modal>
        <Text style={styles.text}>Job List</Text>
        <TouchableOpacity style={styles.view_newjob} onPress={this.onNewJobClicked}>
          <Text style={styles.text_newjob}>New Job</Text>     
        </TouchableOpacity>
        {this.renderList()}
        <Text style={[this.state.currentVersion.includes('OUT OF DATE, UPDATE ASAP') ? styles.versionfailetext : styles.versiontext]}>{this.state.currentVersion}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 30,
  },
  versiontext: {
    fontSize: 15, marginLeft: 20, bottom :20, position:'absolute'
  },
  versionfailetext: {
    fontSize: 15, color:'#ff0000', marginLeft: 20, bottom :20, position:'absolute'
  },
  text: {
    fontSize: 20, fontWeight:'bold', marginLeft: 15,
  },
  text_newjob: {
    fontSize: 18, color:'#0089C0', marginLeft: 10,marginBottom:10, fontWeight: 'bold'
  },
  view_newjob: {
    marginTop: 20, flexDirection: 'row', marginLeft: 10,
  },
  view_list: {
    height: 50, margin: 4, marginLeft:15, marginRight:15, backgroundColor: 'white', justifyContent:'center', flexDirection: 'row', justifyContent: 'space-between',alignItems: 'center'
  },
  list: {
    fontSize:16, marginLeft:10,
  },
  delete_button: {
    marginRight:10, height:32, backgroundColor:'red', padding:8, justifyContent: 'center',borderRadius:5
  },
  del_text: {
    fontSize: 20, fontWeight:'bold', marginLeft: 20, marginRight: 20, marginTop:20, marginBottom:10
  },
  del_newjob: {
    fontSize: 16, marginLeft: 15, marginRight: 15
  },
  buttonContainer: {
    flex: 1,
  },
  del_set: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop:10,
    marginBottom:10
  },
});

const mapStateToProps = (state) => {
  try{

    if(state.jobMeta.currentJob){
      const currentJobId = state.jobMeta.currentJob;
      const currentJob = state.sessions.entities.jobs[currentJobId];
      const currentPictureReq = state.sessions.entities.jobs[currentJobId].pictureReqs;

      return{
        userName: state.userData,
        sessionData: _.compact(Object.values(state.sessions.entities.jobs)),
        currentJobId: currentJobId,
        currentJob: currentJob,
        currentPictureReq: currentPictureReq
      };
    }
    else
    {
      return{
        userName: state.userData,
        sessionData: _.compact(Object.values(state.sessions.entities.jobs)),
        currentJobId: '',
        currentJob: '',
        currentPictureReq: ''
      };
    }
  }
  catch (e){
    //console.log(e);
    return{
      userName: state.userData,
    };
  }
}

export default connect(mapStateToProps, { setCurrentJob, deleteJob, updateJobColor })(JobList);