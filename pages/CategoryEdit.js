import React from 'react';
import { connect } from 'react-redux';
import Database from '../Database';
import Modal from "react-native-modal";
import Spinner from 'react-native-loading-spinner-overlay';
import NetInfo from '@react-native-community/netinfo';
import { isAndroid, pixelDensity} from 'react-native-device-detection';
import {updatePhotoQty, updateCatUploadStatus } from '../actions';
import {StyleSheet, View, Alert, Text, Image, ScrollView, TouchableHighlight, Dimensions, BackHandler} from 'react-native';
import Mybutton from './components/Mybutton';
import Mycancel from './components/Mycancel';
import uploadImage from '../apis/uploadImage';
import ImagePicker from 'react-native-image-picker';
import * as RNFS from 'react-native-fs';
import Toast from 'react-native-simple-toast';
import AsyncStorage from '@react-native-community/async-storage';
import BackgroundTimer from 'react-native-background-timer';

const db = new Database();
const screenWidth = Math.round(Dimensions.get('window').width) - 23;
let _interval;

class CategoryEdit extends React.Component {

  state = {
    categoryId:this.props.navigation.state.params.id,
    imageTitle: '',
    imageId:'',
    imageSize: '',
    imageUpload:'',
    imageMtime:'',
    imageQty: 0,
    thumbnails: [],
    showModal: false,
    uploading: false
  };

  componentDidMount = async () =>{
    this.getThumbnails();
    this.onStart();
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

  onBack = () => {
    this.onPause();
    this.props.navigation.navigate('CategoryList');
  }

  onBackClicked = async () =>{
    await this.setState({
      showModal: false
    });
  }

  saveToDb = (imgpath, imageTitle, imageId) => {
    let data = {
      photoId: `${imageId}`,
      fileName: imageTitle + '.jpg',
      uploadStatus: 'notUploaded',
      photo: imgpath,
      jobId:this.props.currentJob, 
      pictureReq: this.props.job.pictureReqs
    }
    //TODO: do we need to refresh db?  Or is this just a chrome not updating thing 'data may be stale'
    db.addProduct(data).then(async (result) => {
      this.getThumbnails();
      await AsyncStorage.setItem('progress', 'false');
    }).catch((err) => {
      console.log(err);
    })
  }

  onGalleryClicked = () => {
    console.log('camera button clicked');
    const options = {
      mediaType: 'photo',
      quality: 1,
      storageOptions: {
        skipBackup: true, path: 'Pictures/', privateDirectory: true
      },
    };
    
    ImagePicker.launchImageLibrary(options, (response) => {
    // ImagePicker.showImagePicker(options, (response) => {      

      if (response.didCancel) {
        console.log('User cancelled photo picker');
      }
      else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      }
      else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      }
      else {
        this.onAddPhoto(response);
      }
    });
}

  onCameraClicked = () => {
    console.log('camera button clicked');
    const options = {
      mediaType: 'photo',
      quality: 1,
      storageOptions: {
        skipBackup: true, path: 'Pictures/', privateDirectory: true
      },
    };
    
    ImagePicker.launchCamera(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled photo picker');
      }
      else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      }
      else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      }
      else {
        this.onAddPhoto(response);
      }
    });
}

onClickThumbnail = (index) => {

  imageurl = this.state.thumbnails[index].photo;
  RNFS.stat(imageurl).then(res => {
    this.setState({
      imageTitle:this.state.thumbnails[index].fileName,
      imageId:this.state.thumbnails[index].photoId,
      img:imageurl,
      imageSize:res.size,
      imageMtime:res.mtime.toString(),
      showModal: true
    });
  })
  .catch(err => {
    console.log(err.message, err.code);
  });
}

getThumbnails = async () => {
  let thumbnails = [];
  let photoQty = 0;
  let sphotoQty = 0;
  const categoryId = this.state.categoryId;
  try{
    const qStr = "SELECT * FROM Product WHERE jobId = '" + this.props.currentJob + "' AND photoId LIKE" + " '" + `${categoryId}_%` + "'";
    await db.productByFilters(qStr).then((result) => {
      thumbnails = result;
      photoQty = thumbnails.length;
      for(i = 0; i< photoQty; i++)
      {
        if(thumbnails[i].uploadStatus == 'Uploaded')sphotoQty++;
      }
      console.log(thumbnails)
      this.setState({ imageQty: photoQty, thumbnails: thumbnails });
      this.props.updatePhotoQty(categoryId, this.state.imageQty, sphotoQty, this.props.job.pictureReqs);
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

onFileUpload= async (imgpath, imageTitle) => {
  
  const netStatus = await NetInfo.fetch();
  if (netStatus.isConnected == true) {
    
    this.setState({ uploading: true});
    const response = await uploadImage(imgpath, imageTitle);
    if(response.status == '200')
    {
      await db.updateProduct(imageTitle + '.jpg');
      await this.setState({ uploading: false, showModal: false});
      Toast.show('Upload is successful');
    }
    else
    {
      this.setState({ uploading: false, showModal: false});
      Toast.show('You have slow internet connection. A photo will be uploaded in background.');
    }
  }
  else
  {
    this.setState({ uploading: false, showModal: false});
    Toast.show('You have slow internet connection. A photo will be uploaded in background.');
  }

  this.getThumbnails();
}

onAddPhoto = (response) => {

  const job = this.props.job;
  const userName = this.props.userName;
  const timeStamp = Math.floor(Date.now() / 1000);
  const imageQty = this.state.imageQty + 1;

  let osName = '';
  if(isAndroid)osName = 'and';
  else osName = 'ios';

  const imageTitle = `${job.projectName}-${job.profileName}_${this.props.categories[this.state.categoryId].title}-${imageQty}_${userName}{${osName}_3-4-1_${pixelDensity}}`;
  const imageId = `${this.state.categoryId}_${timeStamp}`;
  const imagePath = `${RNFS.DocumentDirectoryPath}/${imageTitle}.jpg`;

  if(Platform.OS === 'ios') {
    RNFS.copyAssetsFileIOS(response.origURL, imagePath, 0, 0)
    .then(res => {
      try{
        this.saveToDb(imagePath, imageTitle, imageId);
      }catch(error){
        Toast.show(`FAIL: Image NOT Saved.  Error Code: ${error}`, 'error');
        return null;
      }
    })
    .catch(err => {
      Toast.show(`FAIL: Image NOT Saved.  Error Code: ${error}`, 'error');
      console.log(err.message, err.code);
    });
  }
  else if(Platform.OS === 'android') {
    RNFS.copyFile(response.uri, imagePath)
    .then(res => {
      try{
        this.saveToDb(imagePath, imageTitle, imageId);
      }catch(error){
        Toast.show(`FAIL: Image NOT Saved.  Error Code: ${error}`, 'error');
        return null;
      }
    })
    .catch(err => {
        Alert(`FAIL: Image NOT Saved.  Error Code: ${err.code}`, 'error');
        console.log(err.message, err.code);
    });
  }
}

onUploadClicked = async () =>{
  let imageTitle = this.state.imageTitle;
  imageTitle = imageTitle.replace('.jpg','');
  this.onFileUpload(this.state.img,imageTitle);
}

render() {
  return (
    <View style={styles.container}>
      <Spinner
        visible={this.state.uploading}
        textContent={'Uploading...'}
        textStyle={styles.spinnerTextStyle} />
      <Modal
        isVisible={this.state.showModal}
      >
        <View style={{backgroundColor:'white', borderRadius:10}}>
          <View>
            <Text style={styles.modaltitle}>{this.state.imageTitle}</Text>
            <Text style = {styles.modaldesc}>PhotoId:{this.state.imageId}</Text>
            <Text style = {styles.modaldesc}>Size:{this.state.imageSize}</Text>
            <Text style = {styles.modaldesc}>Modified Time:{this.state.imageMtime}</Text>
            <Image source={{uri: Platform.OS === 'ios' ? this.state.img : `file://${this.state.img}`}} style={styles.uploadImage}/>
            <View style={styles.upload}>
              <View style={styles.buttonContainer}>
                <Mybutton title="Upload" customClick = {this.onUploadClicked}/>
              </View>
              <View style={styles.buttonContainer}>
                <Mycancel title="Cancel" customClick = {this.onBackClicked}/>
              </View>
            </View>
          </View>
        </View>
      </Modal>
      <Text style={styles.title}>{this.props.categories[this.state.categoryId].title}</Text>
      <Text style={styles.title_des}>{this.props.categories[this.state.categoryId].description}</Text>
      <View style={{flexDirection:'row', flexWrap:'wrap', marginLeft:20}}>
        <Text style={{fontWeight:'bold'}}>Photos: {this.state.imageQty},   </Text>
        <View style={{flexDirection:'row', flexWrap:'wrap'}}>
          <View style={styles.redtcircle}/><Text style={{fontWeight:'bold'}}>  Not Uploaded,  </Text>
        </View>
        <View style={{flexDirection:'row', flexWrap:'wrap'}}>
          <View style={styles.bluetcircle}/><Text style={{fontWeight:'bold'}}>  Uploaded</Text>
        </View>
      </View>
      <View style={styles.scrollContainer}>
        <ScrollView
            contentContainerStyle={styles.scrollView}>
            {
              this.state.thumbnails.map((p, i) => {
                return (
                  <TouchableHighlight
                    style={{opacity: i === this.state.index ? 0.5 : 1}}
                    key={i}
                    underlayColor='transparent'
                    onPress={() => this.onClickThumbnail(i)}
                  >
                    <View style={{
                        width: screenWidth/3,
                        height: screenWidth/3,
                        padding:5
                    }}>
                      <Image
                      style={{
                        width: screenWidth/3 - 5,
                        height: screenWidth/3 - 5,
                        borderRadius:7
                      }}
                      source={{uri: Platform.OS === 'ios' ? p.photo : `file://${p.photo}`}}
                      />
                      <View style={p.uploadStatus === 'notUploaded' ? styles.redcircle :styles.bluecircle} />
                    </View>
                  </TouchableHighlight>
                )
              })
            }
          </ScrollView>
        </View>
        <Mybutton title="Use Camera App" customClick = {this.onCameraClicked}/>
        <Mybutton title="Choose From Library" customClick = {this.onGalleryClicked}/>
        <Mybutton title="Back" customClick = {() => {
          this.onBack();
        }}/>
    </View>
  );
}
}

const styles = StyleSheet.create({
  spinnerTextStyle: {
    color: '#FFF'
  },
  container: {
    flex: 1, marginTop: 30, marginBottom:10,
  },
  scrollContainer: {
    flex: 1, marginTop: 10, marginLeft:10, marginRight:10,
  },
  title: {
    fontSize: 25, fontWeight:'bold', marginLeft:20, marginRight:20
  },
  title_des: {
    marginTop: 10, fontWeight:'bold', marginLeft:20, marginBottom:20, marginRight:20
  },
  modaltitle: {
    fontSize: 21, fontWeight:'bold', marginLeft:10, marginRight:10, marginTop:10
  },
  modaldesc: {
    fontSize: 15, marginTop:3, marginLeft:10, marginRight:10
  },
  photo_label: {
    fontWeight:'bold'
  },
  scrollView: {
    flexWrap: 'wrap',
    flexDirection: 'row'
  },
  upload: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop:10,
    marginBottom:10
  },
  uploadImage:{
    width: screenWidth - 50, height: screenWidth - 50, marginLeft: 15, marginTop:20, borderRadius:10
  },
  redtcircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'red'
  },
  bluetcircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'blue'
  },
  redcircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    right:-screenWidth/3 + 30, bottom:25,
    backgroundColor: 'red'
  },
  bluecircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    right:-screenWidth/3 + 30, bottom:25,
    backgroundColor: 'blue'
  },
  buttonContainer: {
    flex: 1,
  }
});

const mapStateToProps = (state, ownProps) => {

  const currentJobId = state.jobMeta.currentJob;
  const currentPictureReqs = state.sessions.entities.jobs[currentJobId].pictureReqs;

  return{
    categories: state.sessions.entities.pictureReqs[currentPictureReqs].categories,
    job: state.sessions.entities.jobs[currentJobId],
    userName: state.userData,
    currentJob: currentJobId
  };
}

export default connect(mapStateToProps, {updatePhotoQty, updateCatUploadStatus })(CategoryEdit);