import axios from 'axios';
import { isAndroid } from 'react-native-device-detection';
import Database from '../Database';

const db = new Database();
const oneUpload = (thumbnails, index) => {
  const url = 'http://upload.empower-solar.com/index2.php';
  const data = new FormData();
  imageurl = thumbnails[index].photo;
  imageTitle = thumbnails[index].fileName;

  if(isAndroid)
  {
    data.append('upload', {
      uri: 'file://' + imageurl,
      type: 'image/jpeg',
      name: imageTitle
    });
  }
  else 
  {
    data.append('upload', {
      uri: imageurl,
      type: 'image/jpeg',
      name: imageTitle
    });
  } 

  axios({
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
  })
  .then(async function (response) {
    if(response.status == 200)await db.updateProduct(thumbnails[index].fileName);
    if(response.status == 200 && index > 0)oneUpload(thumbnails, index - 1);
  })
  .catch(function (error) {
    console.log(error);
  });
}

const muploadImage = async () => {

  let thumbnails = [];
    try
    {
      const qStr = "SELECT * FROM Product WHERE uploadStatus = 'notUploaded'";
      await db.productByFilters(qStr).then(async (result) => {
        thumbnails = result;
        photoQty = thumbnails.length;
        oneUpload(thumbnails, photoQty - 1);
      })
      .catch(async (err) => {
        console.log(err);
        await AsyncStorage.setItem('progress', 'false');
        return;
      })
    }
    catch (e){
      console.log('No Photos', e);
      return;
    }
}

export default muploadImage;