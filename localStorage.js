import SyncStorage from 'sync-storage';

//Gets state from localStorage
export const getLocalStorage = () => {
  try {
    const localState = SyncStorage.get('state');
    if (localState === null) {
      return undefined;
    }
    return JSON.parse(localState);
  }catch (err) {
    return undefined;
  }
}

//Saves state to localStorage
export const setLocalStorage = (state) => {
  try{
    const localState = JSON.stringify(state);
    SyncStorage.set('state', localState);
  }catch (err) {
    //write something
  }
}