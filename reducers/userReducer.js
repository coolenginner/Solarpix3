import { SET_USERNAME } from '../actions/types'

export default (state = {}, action) => {
  switch (action.type){
    case SET_USERNAME:
      
      let newState = { ...state };
      newState = action.payload;
      return newState;
      
    default:
      return state;
  }
}
