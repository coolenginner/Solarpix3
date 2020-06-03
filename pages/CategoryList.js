import React, {Component} from 'react';
import { connect } from 'react-redux';
import {StyleSheet, Text, View, FlatList, TouchableWithoutFeedback, BackHandler} from 'react-native';
import Mybutton from './components/Mybutton';
import muploadImage from '../apis/muploadImage';
import Toast from 'react-native-simple-toast';
import BackgroundTimer from 'react-native-background-timer';
import {updatePhotoQty} from '../actions';
import Database from '../Database';
import NetInfo from '@react-native-community/netinfo';
import {NavigationEvents} from 'react-navigation';

let _interval;
const db = new Database();
class CategoryList extends Component {
  
  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
  }
  
  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
  }
  
  handleBackButton() {
    return true;
  }

  onStart = () => {
    _interval = BackgroundTimer.setInterval(async () => {
      const netStatus = await NetInfo.fetch();
      if (netStatus.isConnected == true) {
        this.getThumbnails();
      }
    }, 3000);
  }

  onPause = () => {
    BackgroundTimer.clearInterval(_interval);
  }

  getThumbnails = async () => {
    let thumbnails = [];
    let keystr = 0;
    let sphotoQty = 0;
    try{
      const qStr = "SELECT * FROM Product WHERE jobId = '" + this.props.currentJobId + "'";
      await db.productByFilters(qStr).then((result) => {
        thumbnails = result;      
        for(var i = 0; i< this.props.categories.length; i++)
        {
          if(this.props.categories[i].photoQty > 0)
          {
            sphotoQty = 0
            keystr = i.toString() + "_"
            for(var j = 0; j< thumbnails.length; j++)
            {
              if(thumbnails[j].photoId.includes(keystr) && thumbnails[j].uploadStatus == 'Uploaded')sphotoQty++;
            }
            if(this.props.categories[i].sphotoQty != sphotoQty)
            {
              this.props.updatePhotoQty(i, this.props.categories[i].photoQty, sphotoQty, thumbnails[0].pictureReq);
            }
          }
        }
      }).catch((err) => {
        console.log(err);
        return;
      })
    }
    catch (e){
      console.log('No Photos', e);
      return;
    }
  }

  onBackClicked = () => {
    this.onPause();
    this.props.navigation.navigate('JobList');
  }

  onUploadClicked = () => {
    Toast.show('Please stand by while uploading all photos');
    muploadImage();
  }

  actionOnRow = async (categoryId) => {
    this.onPause();
    this.props.navigation.navigate('CategoryEdit', {id: categoryId});
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
                <TouchableWithoutFeedback onPress={ () => this.actionOnRow(item.id)}>
                  <View key={index} style={{height: 120, borderRadius:10,marginHorizontal: 10, marginTop: 4, backgroundColor: `rgba(${item.cellColor[0]},${item.cellColor[1]},${item.cellColor[2]},${item.cellColor[3]})`, flexDirection: 'row',alignItems: 'center'}}>
                    <View style={{flex:1}}>           
                      <Text style={styles.title}>{item.title}</Text>
                      <Text style={styles.list}>{item.description}</Text>
                    </View>
                    <View style = {{paddingRight:20}}>
                      <Text>Pics</Text>
                      <Text style={{fontSize:16, alignSelf: 'center'}}>{item.sphotoQty}/{item.photoQty}</Text>
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
        <NavigationEvents onDidFocus={() => this.onStart()} />
        <Text style={styles.text}>Category List: {this.props.job.projectName}</Text>
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
    marginTop: 30,
    justifyContent: 'center',
    flexDirection: 'column',
  },
  text: {
    fontSize: 20, fontWeight:'bold', marginLeft:25, marginRight:25, flex:1,marginBottom:10
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
    currentJobId: currentJobId,
    job: state.sessions.entities.jobs[currentJobId],
    categories: Object.values(state.sessions.entities.pictureReqs[currentPictureReqs].categories)
  };
}

export default connect(mapStateToProps, {updatePhotoQty})(CategoryList);