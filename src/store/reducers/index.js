import { combineReducers } from '@reduxjs/toolkit';
import userReducer from './userReducer';
import chatReducer from './chatReducer';
import layoutReducer from './layoutReducer';
const rootReducer = combineReducers({
  user: userReducer,
  chat: chatReducer,
  layout: layoutReducer,
  // Add more reducers here as needed
});

export default rootReducer; 