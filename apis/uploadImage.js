import axios from 'axios';
import { isAndroid } from 'react-native-device-detection';

const uploadImage = async (imageurl, imageTitle) => {
  
  const url = 'http://upload.empower-solar.com/index2.php';
  const data = new FormData();

  if(isAndroid)
  {
    data.append('upload', {
      uri: 'file://' + imageurl,
      type: 'image/jpeg',
      name: imageTitle + '.jpg'
    });
  }
  else 
  {
    data.append('upload', {
      uri: imageurl,
      type: 'image/jpeg',
      name: imageTitle + '.jpg'
    });
  } 

  return axios({
    method: 'post',
    url: url,
    data: data,
    headers: {
       "crossDomain":"true",
       "Authorization":"Basic dXBsb2FkOm5EMlFtOXQ0",
       "Content-Type": "multipart/form-data",
       "processData": false,
       "contentType": false,
       "mimeType": "multipart/form-data",
    }
  });
}

export default uploadImage;