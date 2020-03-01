import React, {Component} from 'react';
import { connect } from 'react-redux';
import {StyleSheet, Text, View, FlatList, TouchableWithoutFeedback, Button } from 'react-native';
import Mybutton from './components/Mybutton';
import { readTextFile } from '../actions';

class CategoryList extends Component {
 
  onBackClicked = () => {
    this.props.navigation.navigate('JobList');
  }

  onUploadClicked = () => {
    console.log('upload button clicked');
  }

  actionOnRow = async () => {
    this.props.navigation.navigate('CategoryEdit');
  }

  renderList(){
    if(this.props.categories){
        return(
          <View style = {{flex:11}}>
            <FlatList
              data= {this.props.categories}
              keyExtractor={(item, index) => index.toString() }
              extraData= {this.state}
              renderItem={ ({item, index}) =>
                <TouchableWithoutFeedback onPress={ () => this.actionOnRow()}>
                  <View key={index} style={{height: 100, borderRadius:10,marginHorizontal: 10, marginTop: 4, backgroundColor: `rgba(${item.cellColor[0]},${item.cellColor[1]},${item.cellColor[2]},${item.cellColor[3]})`, flexDirection: 'row',alignItems: 'center'}}>
                    <View style={{flex:1}}>           
                      <Text style={styles.title}>{item.title}</Text>
                      <Text style={styles.list}>{item.description}</Text>
                    </View>
                    <View style = {{paddingRight:20}}>
                      <Text>Pics</Text>
                      <Text style={{fontSize:16, alignSelf: 'center'}}>{item.photoQty}</Text>
                    </View>
                  </View>
                </TouchableWithoutFeedback>
              }
              numColumns={1}
            />
          </View>
        );
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Category List</Text>
        {this.renderList()}
        <View style={styles.upload}>
          <View style={styles.buttonContainer}>
            <Mybutton title="Back" customClick = {this.onBackClicked}/>
          </View>
          <View style={styles.buttonContainer}>
            <Mybutton title="Upload All" customClick = {this.onUploadClicked}/>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 14,
    marginTop: 50,
    justifyContent: 'center',
    flexDirection: 'column',
  },
  text: {
    fontSize: 25, fontWeight:'bold', marginLeft:25,flex:1
  },
  upload: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize:16, marginLeft:10,marginRight:40,fontWeight:'bold'
  },
  list: {
    fontSize:16, marginLeft:10,marginRight:40
  },
  backButton: {
    margin:15, marginBottom:20, height: 40, borderRadius:5, borderColor:'lightgrey', borderWidth:1
  },
  uploadButton: {
    marginHorizontal:15, height: 40, borderRadius:5, borderColor:'lightgrey', borderWidth:1
  },
  buttonContainer: {
    flex: 1,
  }
});

const mapStateToProps = (state) => {
  const currentJobId = state.jobMeta.currentJob;
  const currentPictureReqs = state.sessions.entities.jobs[currentJobId].pictureReqs;

  return{
    userName: state.userData,
    job: state.sessions.entities.jobs[currentJobId],
    categories: Object.values(state.sessions.entities.pictureReqs[currentPictureReqs].categories)
  };
}

export default connect(mapStateToProps, { readTextFile })(CategoryList);