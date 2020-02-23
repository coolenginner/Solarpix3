// import files from '../apis/files';
import { normalize } from 'normalizr';
import { job } from '../schemas/schemas';
// import db from '../database/db';
import uploadImage from '../apis/uploadImage';

//types.js just has action name/types for easier bug catching
import {
  ADD_JOB,
  READ_TXT_FILE,
  GEN_DUMMY,
  GET_CATEGORY,
  ADD_PHOTO,
  TO_UPLOAD,
  UPDATE_PHOTOQTY,
  DELETE_JOB,
  UPDATE_CATUPLOADSTATUS,
  SAVE_PAGELOCATION,
  SET_USERNAME,
  CREATE_JOBLIST,
  SET_CURRENTJOB,
  SET_JOBCOUNTER,
  UPLOAD_ALLIMAGES,
  UPLOAD_ALLIMAGES_STATUS,
  UPDATE_JOBCOLOR
} from './types';

var categoryListFile_install = ['0Rack-A+F,CloseUp|Close picture of a single anchor / flashing assembly installed on the roof','0Rack-A+F,GenArea|General picture of a subarray worth of anchor / flashing assemblies installed','0Rack-Rails|Racking/rails installed for each subarray, prior to module install','1Elect-CondPen|Conduit rooftop penetration','1Elect-Ground,Rails|Rail ground system: N-S rail rail connections, rail splice grounding, for each array, prior to module install','1Elect-JB,Mount+Signage|Junction/combiner box(s) covered showing attachment / mounting / support & EmPower signage for each array','1Elect-JB,Uncovered|Junction/combiner box(s) UNcovered showing grounding & all conductors, demonstrates strain relief, for each array','1Elect-ModLabel|Module manufacturer label including make, model, serial number & wattage','1Elect-WireMgt|Wire management, firmly supported by zip ties, etc, prior to module install','2Inv-Ext+Label|Micro or string inverter exterior & manufacturer labeling','2Inv-Int+Term,Grd|If applicable, string inverter interior showing terminations & grounding (Not applicable for AC modules)','2Inv-Signage|If applicable, any signage installed on a string inverter (ex, DC disco on SMA, SolarEdge, etc)','3Arry-EndClip|Pic of module end clips, after mod install','3Arry-Grounding|Generic picture(s) showing how modules are grounded method','3Arry-Horizon,South|View of horizon facing South, taken from top center of array','3Arry-ModCount|Single or multiple pictures of array(s) such that modules can be counted','3Arry-ModLayoutMap|Pic of cardboard (or other) that shows mod serial number layout.','3Arry-WireMgt|Good wire management & support, each subarray, after mod install, looking under the array','4Comb-ConduitSeal|For every penetration to conditioned space, sealed (duck seal & geocel around condutors in conduit)','4Comb-GEC-Path|Pic sequence showing GEC path from inverter &/or combi/disco to grounding electrode, including irreversible splices & taps','4Comb-Interior|AC comb, interior, showing bus, breakers, & label with bus rating','4Comb-Label|AC comb manufacturer label with bus rating, etc','4Comb-Signage|AC comb EmPower signage','5Disc-Full+Signage|AC disco, exterior, showing any added EmPower signage.  See desired position of switch in work pkg.','5Disc-Interior|AC disco, interior, showing all wiring, grounding & OCPD','5Disc-Label|AC disco, showing manuf label w/ NEMA rating','6Grid-Full+Signage|MSP or Tap exterior pic of EmPower signage','6Grid-Interior|MSP or Tap JB interior, overall pic','6Grid-Label|MSP or other label showing bus rating, specs, etc (as applicable)','6Grid-Meter|Picture of meter so values and labels can be read','6Grid-Tap,CTs|MSP or Tap JB interior, closeup of tap & CTs','7Data-Data,Equip|Pic of interior of data enclosure (PVS5,6,etc).','7Data-Data,Router|Client router with ethernet cable plugged into visible port number & labeled','8House-Address|Verification of home address taken from street view','8House-Array|Aesthetically pleasing, overall house & array photos (best pic gets $100 every 6mo from marketing)','8House-EquipFull|One full fame pic of elect equip, inverters (if applicable) & visible signage','8House-EquipLocation|Wide view of elect equipment making clear where elect equip is mounted / located on property','8House-LawnSign|Pic of lawn sign in front of house with as much array in photo as possible (included in best pic contest)','9Spec-Battery|Battery Back-Up Photos - Photo showing battery back-up system and racking.','9Spec-KneeWall|Knee wall pics','9Spec-Misc|Misc pics not in other category.  PLEASE CONFIRM PIC NOT IN OTHER CATEGORY.  If a new category is needed the please let us know.'];
var categoryListFile_pcsv = ['1Gen-ArrayHouseFront+Nu|Front showing array area & whole house & house number','1Gen-ArrayHouseLeft|From left showing array area & whole house (take on angle if necessary)','1Gen-ArrayHouseRear|From rear showing array area & whole house','1Gen-ArrayHouseRight|From right showing array area & whole house (take on angle if necessary)','1Gen-NeighborFront|From ground level below array or any eq facing adjacent property, even if obstructed. (Oy Bay, Scarsdale, etc)','1Gen-NeighborLeft|From ground level below array or any eq facing adjacent property, even if obstructed. (Oy Bay, Scarsdale, etc)','1Gen-NeighborRear|From ground level below array or any eq facing adjacent property, even if obstructed. (Oy Bay, Scarsdale, etc)','1Gen-NeighborRight|From ground level below array or any eq facing adjacent property, even if obstructed. (Oy Bay, Scarsdale, etc)','1Gen-OtherFront|2nd Building or structure (garage, other)','1Gen-OtherLeft|2nd Building or structure (garage, other)','1Gen-OtherRear|2nd Building or structure (garage, other)','1Gen-OtherRight|2nd Building or structure (garage, other)','2EServ-Ext-GrndElectConnect|Close up of supplemental grounding electrode connection','2EServ-Ext-GrndElectPathway|Wide angle of supplemental grounding electrode showing path of conductor','2EServ-Ext-MeterCondLabel|Close up of conductor labeling inside meter enclosure line side','2EServ-Ext-MeterEnclsure+Nu|Close up of meter enclosure showing meter number','2EServ-Ext-MeterLugsLine|Close up of line side lugs inside meter enclosure interior with cover off','2EServ-Ext-MeterLugsLoad|Close up of load side lugs inside meter enclosure interior with cover off','2EServ-Ext-POA-CloseUp|Close up of point of attachment','2EServ-Ext-Riser+POA|Electric Service Riser & Point of attachment  showing entire service','2EServ-Ext-ServiceEnt-CloseUp|Close up showing size of service entrance conduit','2EServ-Ext-ServiceEnt+Space|Wide angle showing conduit for service entrance conductors showing length and surrounding space','2EServ-Ext-Straps+Attachment|Close up of conduit straps or other method of securing','3EServ-ATS-Breaker|ATS close up breaker','3EServ-ATS-CondLabelLine|Close up of conductor labeling inside ATS line side','3EServ-ATS-CondLabelLoad|Close up of conductor labeling inside ATS load side','3EServ-ATS-Interior|ATS interior','3EServ-ATS-Labels|ATS label','3EServ-ATS-LugsLIne|Close up of line side lugs inside ATS interior with cover off','3EServ-ATS-LugsLoad|Close up of load side lugs inside ATS interior with cover off','3EServ-ATS-Wide+ConduitPaths|ATS exterior, wide angle showing surrounding area and conduit paths','4EServ-Net-Router+Ports|Router showing available ports','4EServ-Net-WIFI-Info|Router showing wi-fi info','4EServ-Pnls-BeakerLabelsEtc|Main electrical panel label','4EServ-Pnls-BusRating|Main electrical panel label close up of bus rating','4EServ-Pnls-DoorClosed|Close up of area of main electrical panel','4EServ-Pnls-DoorOpen|Main electrical panel with cover open','4EServ-Pnls-ElectRoom|Wide angle shots of room where main electrical panel is','4EServ-Pnls-GEC-Path|Wide angle showing GEC Pathway','4EServ-Pnls-GroundClamp|Water main grounding clamp','4EServ-Pnls-InteriorCoverOff|Main electrical panel interior with cover off','4EServ-Pnls-InteriorSpaceBtm|Main electrical panel interior with cover off, bottom gutter space','4EServ-Pnls-InteriorSpaceLeft|Main electrical panel interior with cover off, left gutter space','4EServ-Pnls-InteriorSpaceRight|Main electrical panel interior with cover off, right gutter space','4EServ-Pnls-InteriorSpaceTop|Main electrical panel interior with cover off, top gutter space','4EServ-Pnls-MainBkrRating|Main electrical panel label close up of main breaker rating','5PvEq-AcCombiLoc|Wide angle of AC combiner location','5PvEq-AcConduitRun1|Wide angle of AC conduit run route','5PvEq-AcConduitRun2|Wide angle of AC conduit run #2 route','5PvEq-DataLoc|Wide angle of PVS-5 location if different then AC combiner','5PvEq-EthernetRoute|Ethernet route','6BattEq-EquipLocationWide|Wide angle of All Equipment Location','6BattEq-GenerationPnl|Wide angle Location of Generation Panel','6BattEq-NewMainDisco|Wide angle of Location of new Main Service Disconnect','6BattEq-Other|Wide angle Location of Ill Panel','6BattEq-TPW-Gateway|Wide angle Location of Tesla Gateway','6BattEq-TPW#1Loc|Wide angle Location of Tesla powerwall','6BattEq-TPW#2Loc|Wide angle Location of Tesla powerwall #2','7StructRaftA-Ceiling|Roof #1 Ceiling from room below','7StructRaftA-CollarTie|Roof #1 Collar Tie','7StructRaftA-Damage|Roof #1 Damage(Cracks, Splits, Water, Other)','7StructRaftA-HangingEq|Roof #1 Hanging Equipment','7StructRaftA-KneeWall|Roof #1 Knee Wall','7StructRaftA-Rafters|Roof #1 Rafters','7StructRaftB-Ceiling|Roof #2 Ceiling from room below','7StructRaftB-CollarTie|Roof #2 Collar Tie','7StructRaftB-Damage|Roof #2 Damage(Cracks, Splits, Water, Other)','7StructRaftB-HangingEq|Roof #2 Hanging Equipment','7StructRaftB-KneeWall|Roof #2 Knee Wall','7StructRaftB-Rafters|Roof #2 Rafters','7StructRaftC-Ceiling|Roof #3 Ceiling from room below','7StructRaftC-CollarTie|Roof #3 Collar Tie','7StructRaftC-Damage|Roof #3 Damage(Cracks, Splits, Water, Other)','7StructRaftC-HangingEq|Roof #3 Hanging Equipment','7StructRaftC-KneeWall|Roof #3 Knee Wall','7StructRaftC-Rafters|Roof #3 Rafters','7StructRaftD-Ceiling|Roof #4 Ceiling from room below','7StructRaftD-CollarTie|Roof #4 Collar Tie','7StructRaftD-Damage|Roof #4 Damage(Cracks, Splits, Water, Other)','7StructRaftD-HangingEq|Roof #4 Hanging Equipment','7StructRaftD-KneeWall|Roof #4 Knee Wall','7StructRaftD-Rafters|Roof #4 Rafters','7StrcutRaftE-GenerationPnl|Roof #5 Ceiling from room below','7StrcutRaftE-NewMainDisco|Roof #5 Collar Tie','7StrcutRaftE-Other|Roof #5 Damage(Cracks, Splits, Water, Other)','7StrcutRaftE-TPW-Gateway|Roof #5 Hanging Equipment','7StrcutRaftE-TPW#1Loc|Roof #5 Knee Wall','7StrcutRaftE-TPW#2Loc|Roof #5 Rafters','7StructRaftF-Ceiling|Roof #6 Ceiling from room below','7StructRaftF-CollarTie|Roof #6 Collar Tie','7StructRaftF-Damage|Roof #6 Damage(Cracks, Splits, Water, Other)','7StructRaftF-HangingEq|Roof #6 Hanging Equipment','7StructRaftF-KneeWall|Roof #6 Knee Wall','7StructRaftF-Rafters|Roof #6 Rafters','7StructRaftG-Ceiling|Roof #7  Ceiling from room below','7StructRaftG-CollarTie|Roof #7  Collar Tie','7StructRaftG-Damage|Roof #7  Damage(Cracks, Splits, Water, Other)','7StructRaftG-HangingEq|Roof #7  Hanging Equipment','7StructRaftG-KneeWall|Roof #7  Knee Wall','7StructRaftG-Rafters|Roof #7 Rafters'];
var categoryListFile_salessv = ['1Elec-ElectRoom|Wide angle shots of room where main electrical panel is','1Elec-DoorClosed|Close up of area of main electrical panel','1Elec-DoorOpen|Main electrical panel with cover open','1Elec-MainBkrRating|Main electrical panel label close up of main breaker rating','1Elec-MeterFar|Distant shot of electric meter, including mast and meter pan','1Elec-MeterClose|Close shot of meter showing meter number','2Docs-BillFront|Page 1 of electric bill','2Docs-BillBack|Page 2 of electric bill','2Docs-SARequestForm_SLR|Photo of Signed Site Audit Request form','2Docs-SARequestForm_Batt|Photo of Signed Battery Site Audit Request form','2Docs-CompQuote|Shot(s) of competitor quote(s)','3Exterior-Tree|Distant shot of trees needing trimming or removal','3Exterior-ShallowRoof|Shot(s) of any roofs that may be considered "shallow pitch" (under 14 degrees)','3Exterior-SteepRoof|Shot(s) of any roofs that may be considered "steep pitch"','3Exterior-ShingleEdge|Close up shot of rake showing shingle layers','3Exterior-RoofCondition|Shot(s) showing general roof condition','3Exterior-PermittingFlag|Shot(s) showing any possible permitting concerns (pools, decks, etc.)','3Exterior-TrenchLocation|Shot(s) showing any possible trenching locations','4Batt-HeatSysFar|Shot(s) of home heating system','4Batt-HeatSysSpecs|Close up shot of any visible heat system specifications','4Batt-HeatSysRoom|Wide angle shot(s) of heating system room / enclosure','4Batt-InstallLocation|Shot(s) of potential battery installation location(s)'];

export const updateJobColor = (job, color) => {

  return {
    type: UPDATE_JOBCOLOR,
    payload: {
      color: color,
      jobId: job
    }
  }
}

export const updateUploadStatus = (status) => {

  return {
    type: UPLOAD_ALLIMAGES_STATUS,
    payload: status
  }
}

/*
Get all photos that are not uploaded,
for loop upload them all.  On success, update the db entry and the category uploadStatus for the photo

*/
export const uploadAllPhotos = () => async (dispatch, getState) => {

  // console.log('entered uploadAllPhotos');
  // if(!db.isOpen()){
  //   db.open();
  // }
  // let photoArray = [];
  // let successArray = [];
  // let failArray = [];
  // let uniqueSuccess = [];
  // let uniqueObjs = [];
  // //See if there are photos w/ "notUploaded" status
  // //const photosToUpload = await db.table().where('uploadStatus').equals('notUploaded').toArray();
  // const tables = db.tables;
  // for(let i=0; i<tables.length; i++){
  //   const tempArray = await db.table(tables[i].name).where('uploadStatus').equals('notUploaded').toArray();
  //   photoArray = photoArray.concat(tempArray);
  // }
  // //console.log('This is photoArray: ', photoArray, photoArray.length);
  // //photoArray now has all photos
  // if(photoArray.length !== 0){
  //   //begin automatic upload
  //   for(let j=0; j<photoArray.length; j++){
  //     const photoData = photoArray[j];
  //     try{
  //       //Upload photo, update db status
  //       dispatch(updateCatUploadStatus(photoData.photoId[0], 'waiting', photoData.pictureReq));
  //       await uploadImage(photoData.photo);
  //       await db.table(photoData.job).update(photoData.photoId, { uploadStatus: 'uploaded' });
  //       successArray.push({ job: photoData.job, pictureReq: photoData.pictureReq, categoryId: photoData.photoId[0] });
  //       //updateCatUploadStatus(categoryId, 'success', photoData.pictureReq);

  //     }
  //     catch (e){
  //       failArray.push({ job: photoData.job, pictureReq: photoData.pictureReq, categoryId: photoData.photoId[0] });
  //       console.log(e);
  //     }
  //   }
  //   console.log('successArray', successArray, 'failArray', failArray);
  //   //After for loop finishes, Get all unique uploads and update all category upload icons (code from CategoryEdit)
  //   try{
  //     uniqueSuccess = [...new Set(successArray.map(x => JSON.stringify(x)))];
  //     uniqueObjs = [...new Set(uniqueSuccess.map(x => JSON.parse(x)))];
  //   }
  //   catch (e){
  //     console.log(e);
  //   }

  //   console.log('uniqueObjs', uniqueObjs);
  //   for(let k=0; k<uniqueObjs.length; k++){
  //     const successUpload = uniqueObjs[k];
  //     let status = 'neutral';

  //     try{
  //       //This query grabs all photos in this category whose uploadStatus is 'notUploaded'
  //       const localCatPhotosCount = await db.table(successUpload.job)
  //         .where('uploadStatus').equals('notUploaded')
  //         .and((result) => {
  //           //console.log('result ',result);
  //           const tempArray = result.photoId.split('_');
  //           return tempArray[0] === `${successUpload.categoryId}`;
  //         })
  //         .count();
  //       //console.log('This is localCatPhotosCount: ', localCatPhotosCount);

  //       //If there are no photos, all photos are uploaded, otherwise, there are still local photos
  //       if(localCatPhotosCount === 0){
  //         //console.log('Query found no photos: Success');
  //         status = 'success';
  //       }
  //       else{
  //         //console.log('Query found photos: Fail');
  //         status = 'fail';
  //       }
  //       //update status
  //       dispatch(updateCatUploadStatus(successUpload.categoryId, status, successUpload.pictureReq));
  //     }
  //     catch (e) {
  //       console.log('Query failed: ',e);
  //     }
  //   }
  //   //dispatch(updateUploadStatus(''));
  // }

  // else{
  //   //dispatch(updateUploadStatus(''));
  // }




  // dispatch({ type: UPLOAD_ALLIMAGES, payload:  0 });

}

export const setJobCounter = (increment) => {

  return{
    type: SET_JOBCOUNTER,
    payload: increment
  }
}

export const setCurrentJob = (jobId) => {

  return{
    type: SET_CURRENTJOB,
    payload: jobId
  }
}

export const setUsername = (userName) => {
  return{
    type: SET_USERNAME,
    payload: userName
  }
}

//Saves window page y so that users return to the same location on categoryList page
export const saveLocation = (location) => {

  return{
    type: SAVE_PAGELOCATION,
    payload: location
  }
}

//Sets category property 'uploadStatus'.  Used to show unique icon
export const updateCatUploadStatus = (categoryId, status, photoReq) => {

  return{
    type: UPDATE_CATUPLOADSTATUS,
    payload: {
      status: status,
      categoryId: categoryId,
      photoReq: photoReq
    }
  }
}

//Delete job, pictureReqs for jobId (db table deleted in DeleteJob component)
export const deleteJob = (jobId, pictureReq) => {
  //window.localStorage.clear();
  //

  return{
    type: DELETE_JOB,
    payload: {
      jobId: jobId,
      pictureReq: pictureReq
    }
  }
}

/*
//UNUSED: save in case we need upload image response in store
export const uploadImage = (image) => async (dispatch, getState) => {

  //Set up necessary parameters for POST to EmPower server
  const authParam = { username: 'upload', password: 'nD2Qm9t4' };
  //const params = { name: 'upload', filname: 'test_Filename' }
  const url = 'http://upload.empower-solar.com/index2.php';

  //Set up necessary parameters for CORS proxy
  const config = {
    auth: authParam
  }

  const formData = new FormData();
  formData.append('upload',image);

  try{
    const response = await files.post(url, formData, config);
    dispatch({ type: UPLOAD_IMAGE, payload: response.data });
  }
  catch(err){
    console.log('POST failed: ', err);
  }

};
*/

export const updatePhotoQty = (categoryId, photoQty, photoReq) => {
  return{
    type: UPDATE_PHOTOQTY,
    payload: {
      categoryId: categoryId,
      photoQty: photoQty,
      photoReq: photoReq
    }
  }
}

//UNUSED
//Add image to uploadQueue
export const toUploadQueue = (id, dataURL) => {

  return {
    type: TO_UPLOAD,
    payload: {
      id: id,
      dataURL: dataURL,
      uploadStatus: false
    }
  }
}

//UNUSED
//Adds photo to photoQueue for specific category
export const addPhoto = (id, photoQty, photoQueue) => {

  return{
    type: ADD_PHOTO,
    payload: {
      id: id,
      photoQty: photoQty,
      photoQueue: photoQueue
    }
  }

}

/*
1.  Create object array using text file based on profileName
2.  For every superCategory, add a unique color to all categories
3.  Create normalized object to put into store (job -> photoReqs)
*/

//TODO:  Perform steps 1 & 2 once for all unique profileNames, then store the data in the store(?) for future use
export const createJobList = (projectName, profileName, jobCounter) => async (dispatch) => {

  //const initialJobId = 'job1';
  let colormap = require('colormap');

  var categoryArray = [];
  var superCatArray = [];
  var counter = 0;

  //Choose which categorylistFile to choose based on profileName
  let textArray;
  switch(profileName){
    case 'install':
      textArray = categoryListFile_install;
      break;

    case 'pcsv':
      textArray = categoryListFile_pcsv;
      break;

    case 'salessv':
      textArray = categoryListFile_salessv;
      break;

    default:
      textArray = categoryListFile_install;
      break;

  }

  //create array of strings
  // var textArray = response.data.split(/\n/);
  //For each String, split string into id/title/description properties
  //id generated by counter (dynamic for categorylist future proofing)
  textArray.forEach( category => {
    //For some reason there's a blank category/newline in the textFile, filter w/ category
    if(category){
      var tempArray = category.split("|");
      var obj = { id:counter, title:tempArray[0], description: tempArray[1], photoQty: 0, catUploadStatus: 'neutral' };
      categoryArray.push(obj);
      superCatArray.push(obj.title[0]);
      counter += 1;
    }
  });

  //Assigning unique colors for each supercategory
  //Color spectrum minimum is 11 colors (Package)
  const uniqueSuperCats = [...new Set(superCatArray)];
  let colorCount = 11
  if(uniqueSuperCats.length > 11){
    colorCount = uniqueSuperCats.length;
  }
  let colors = colormap({
    colormap: 'hsv',
    nshades: colorCount,
    format: 'rgba',
    alpha: 0.2
  })
  //console.log(colors)

  categoryArray.forEach( category => {
    category.cellColor = colors[parseInt(category.title[0])];
  });

  const jobId = `job${jobCounter}`
  const pictureReqId = `pictureReq${jobCounter}`

  const jobData = {
    id: jobId,
    projectName: projectName,
    profileName: profileName,
    pictureReqs: {
        id: pictureReqId, jobId: jobId, categories: categoryArray
      },
    color: ''
  }

  const normalJobData = normalize(jobData, job);
  //console.log(normalJobData);

  dispatch({ type: CREATE_JOBLIST,
    payload: normalJobData
  })
/*

  return{
    type: CREATE_JOBLIST,
    payload:
      { [initialJobId]:
        {
          id: initialJobId,
          projectName: projectName,
          profileName: profileName
        }
      }
  }
*/
}

//Submit button saves NewJob data
export const addNewJob = (projectName, profileName, jobCounter) => async (dispatch) => {

  let colormap = require('colormap');
  var categoryArray = [];
  var superCatArray = [];
  var counter = 0;

  //Choose which categorylistFile to choose based on profileName
  let textArray;
  switch(profileName){
    case 'install':
      textArray = categoryListFile_install;
      break;
    case 'pcsv':
      textArray = categoryListFile_pcsv;
      break;
    case 'salessv':
      textArray = categoryListFile_salessv;
      break;
    default:
      textArray = categoryListFile_install;
      break;
  }

  //create array of strings
  //For each String, split string into id/title/description properties
  //id generated by counter (dynamic for categorylist future proofing)
  textArray.forEach( category => {
    //For some reason there's a blank category/newline in the textFile, filter w/ category
    if(category){
      var tempArray = category.split("|");
      var obj = { id:counter, title:tempArray[0], description: tempArray[1], photoQty: 0, catUploadStatus: 'neutral' };
      categoryArray.push(obj);
      superCatArray.push(obj.title[0]);
      counter += 1;
    }
  });

  //Assigning unique colors for each supercategory
  const uniqueSuperCats = [...new Set(superCatArray)];
  let colorCount = 11
  if(uniqueSuperCats.length > 11){
    colorCount = uniqueSuperCats.length;
  }
  let colors = colormap({
    colormap: 'hsv',
    nshades: colorCount,
    format: 'rgba',
    alpha: 0.2
  })
  //console.log(colors)

  categoryArray.forEach( category => {
    category.cellColor = colors[parseInt(category.title[0])];
  });

  const jobId = `job${jobCounter}`
  const pictureReqId = `pictureReq${jobCounter}`

  const jobData = {
    id: jobId,
    projectName: projectName,
    profileName: profileName,
    pictureReqs: pictureReqId,
    color: ''
  }

  const pictureReqData = {
    id: pictureReqId,
    jobId: jobId,
    categories: categoryArray
  }

  //const normalJobData = normalize(jobData, job);
  //console.log(normalJobData);

  dispatch({ type: ADD_JOB,
    payload: {
      jobId: jobId,
      pictureReqId: pictureReqId,
      jobData: jobData,
      pictureReqData: pictureReqData
    }
  })
}

//Reads text file using axios.
//Waits for response before dispatching action
//Splits response into objects with proper properties

export const readTextFile = (textFile) => async dispatch => {
    let colormap = require('colormap');

    var categoryArray = [];
    var superCatArray = [];
    var counter = 0;
    //get categories file from component
    const response = await files.get(textFile);
    //create array of strings
    var textArray = response.data.split(/\n/);
    //For each String, split string into id/title/description properties
    //id generated by counter (dynamic for categorylist future proofing)
    textArray.forEach( category => {
      //For some reason there's a blank category/newline in the textFile, filter w/ category
      if(category){
        var tempArray = category.split("|");
        var obj = { id:counter, title:tempArray[0], description: tempArray[1], photoQty: 0, catUploadStatus: 'neutral' };
        categoryArray.push(obj);
        superCatArray.push(obj.title[0]);
        counter += 1;
      }
    });

    //Assigning unique colors for each supercategory
    const uniqueSuperCats = [...new Set(superCatArray)];
    let colorCount = 11
    if(uniqueSuperCats.length > 11){
      colorCount = uniqueSuperCats.length;
    }
    let colors = colormap({
      colormap: 'hsv',
      nshades: colorCount,
      format: 'rgba',
      alpha: 0.2
    })
    //console.log(colors)

    categoryArray.forEach( category => {
      category.cellColor = colors[parseInt(category.title[0])];
    });

    dispatch({ type: READ_TXT_FILE, payload: categoryArray })
}

//Gets individual category data from store
export const getCategory = (id) => (dispatch, getState) => {
  //console.log(getState());
  const currentJobId = getState().currentJob;
  const currentPictureReqs = getState().sessions.entities.jobs[currentJobId].pictureReqs;

  const category = getState().sessions.entities.pictureReqs[currentPictureReqs].categories[id];
  //const category = getState().categories[id];
  //console.log(category);

  dispatch({ type: GET_CATEGORY, payload: category });
}

//Dev action creator, unnecessary
//Provides dummy values (set up before getting readTextFile wired)
export const genDummyValues = () => {
  return{
    type: GEN_DUMMY,
    payload:
      [
        {id:0, title:'Category 1', description: 'a1'},
        {id:1, title:'Category 2', description: 'a2'},
        {id:2, title:'Category 3', description: 'a3'},
        {id:3, title:'Category 1', description: 'a1'},
        {id:4, title:'Category 2', description: 'a2'},
        {id:5, title:'Category 3', description: 'a3'},
        {id:6, title:'Category 1', description: 'a1'},
        {id:7, title:'Category 2', description: 'a2'},
        {id:8, title:'Category 3', description: 'a3'},
        {id:9, title:'Category 1', description: 'a1'},
        {id:10, title:'Category 2', description: 'a2'},
        {id:11, title:'Category 3', description: 'a3'}
      ]
  }
}
