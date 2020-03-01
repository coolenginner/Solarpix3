import React from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import Database from '../Database';
import { setCurrentJob, updateJobColor } from '../actions';
import { StyleSheet, Text, View, TouchableOpacity, FlatList, TouchableWithoutFeedback} from 'react-native';

const db = new Database();

class JobList extends React.Component {
  
  state = {
    toCategories: false,
    toDelete: false,
    jobId: '',
    products:[]
  };

  componentDidMount(){

    db.listProduct().then((data) => {
      this.setState({ products: data })
    }).catch((err) => {
      console.log(err);
    })

    try{
      for(let i=0; i<this.props.sessionData.length; i++){
        this.checkForPhotoCompletion(this.props.sessionData[i].id);
      }
    }
    catch (e){
      console.log(e);
    }
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

    // db.productById(navigation.getParam('prodId')).then((data) => {
    //   console.log(data);
    //   product = data;
    //   this.setState({
    //     product,
    //     isLoading: false,
    //     id: product.prodId
    //   });
    // }).catch((err) => {
    //   console.log(err);
    //   this.setState = {
    //     isLoading: false
    //   }
    // })

  }

  onNewJobClicked = () => {
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
    if(this.state.toCategories){
      this.props.navigation.navigate('CategoryList');
    }

    return (
      <View style={styles.container}>
        <Text style={styles.text}>Job List</Text>
        <TouchableOpacity style={styles.view_newjob} onPress={this.onNewJobClicked}>
          <Text style={styles.text_newjob}>New Job</Text>     
        </TouchableOpacity>
        {this.renderList()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 50,
  },
  text: {
    fontSize: 25, fontWeight:'bold', marginLeft: 15,
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
});

const mapStateToProps = (state) => {
  try{
    return{
      userName: state.userData,
      sessionData: _.compact(Object.values(state.sessions.entities.jobs))
    };
  }
  catch (e){
    return{
      userName: state.userData,
    };
  }
}

export default connect(mapStateToProps, { setCurrentJob, updateJobColor })(JobList);