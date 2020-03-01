import React from 'react';
import { connect } from 'react-redux';
import Database from '../Database';
import { getCategory, addPhoto, updatePhotoQty, updateCatUploadStatus } from '../actions';
import {StyleSheet, View, Alert, Text, Image,ScrollView} from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import Mybutton from './components/Mybutton';
import uploadImage from '../apis/uploadImage';
import ImagePicker from 'react-native-image-picker';
import AsyncStorage from '@react-native-community/async-storage';

const db = new Database();

class CategoryEdit extends React.Component {

  _isMounted = false;
  testVar = false;

  state = {
    // categoryId: this.props.match.params.id,
    image: {},
    showImage: '',
    imageTitle: '',
    imageId:'',
    imageQty: '',
    thumbnails: [],
    showModal: 'none',
    content: ''
  };

  componentDidMount = async () =>{
    //Set _isMounted var to true for potential unmount
    // this._isMounted = true;
    // this.getThumbnails();
  }

  //if the component unmounts, cancel any setState calls
  //Update state w/ uploadStatus: unsent:fail, sentAll:success, default:neutral
  componentWillUnmount() {
    // this._isMounted = false;
    // this.countLocalPhotos();
  }

  getThumbnails = async () => {
    console.log('Enter getThumbnails');
  }

  onAddPhoto = async (imgData) => {
    let fileData = imgData;
    let cameraChoice = 'N';

    //If using embedded Camera
    if(typeof imgData == "string"){
      fileData = await this.srcToFile(imgData);
      cameraChoice = 'E';
    }
  }

  onCameraClicked = () => {
    console.log('camera button clicked');
    const options = {
      quality: 1.0,
      maxWidth: 300,
      maxHeight: 300,
      storageOptions: {
        skipBackup: true
      }
    };

    ImagePicker.showImagePicker(options, (response) => {

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
        this.onAddPhoto(response.uri);
      }
    });
}

  render() {

    return (
      <View style={styles.container}>
        {/* <Text style={styles.title}>{this.props.category.title}</Text>
        <Text style={styles.title_des}>{this.props.category.description}</Text> */}
        <Text style={styles.user_input}>User Initials</Text>
        <Mybutton title="Use Camera App" customClick = {this.onCameraClicked}/>
        {/* <Image source={this.state.avatarSource == null ?  null : this.state.avatarSource} style={styles.logoImage}/> */}
        {/* <ScrollView
              contentContainerStyle={styles.scrollView}>
              {
                this.state.photos.map((p, i) => {
                  return (
                    <TouchableHighlight
                      style={{opacity: i === this.state.index ? 0.5 : 1}}
                      key={i}
                      underlayColor='transparent'
                      onPress={() => this.setIndex(i)}
                    >
                      <Image
                        style={{
                          width: width/3,
                          height: width/3
                        }}
                        source={{uri: p.node.image.uri}}
                      />
                    </TouchableHighlight>
                  )
                })
              }
            </ScrollView> */}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1, marginTop: 80,
  },
  title: {
    textAlign: 'center',fontSize: 25, fontWeight:'bold',
  },
  title_des: {
    textAlign: 'center',marginTop: 20, fontWeight:'bold',
  },
  user_input: {
    marginTop: 20,marginLeft:25, fontWeight:'bold',
  },
  text_input: {
    paddingLeft:5, margin:25, marginTop:10, height: 40, borderColor: 'gray', borderWidth: 1,borderRadius:5
  },
  scrollView: {
    flexWrap: 'wrap',
    flexDirection: 'row'
  },
  logoImage: {
    width: 200, height: 200, marginTop: 20, marginLeft: 10,
  },
});

const mapStateToProps = (state, ownProps) => {

  console.log(ownProps);
  const currentJobId = state.jobMeta.currentJob;
  const currentPictureReqs = state.sessions.entities.jobs[currentJobId].pictureReqs;

  return{
    // category: state.sessions.entities.pictureReqs[currentPictureReqs].categories[ownProps.match.params.id],
    job: state.sessions.entities.jobs[currentJobId],
    userName: state.userData,
    currentJob: currentJobId
  };
}

export default connect(mapStateToProps, { getCategory, addPhoto, updatePhotoQty, updateCatUploadStatus })(CategoryEdit);