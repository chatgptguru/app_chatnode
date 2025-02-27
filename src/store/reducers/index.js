import { combineReducers } from '@reduxjs/toolkit';
import userReducer from './userReducer';
import chatReducer from './chatReducer';
const rootReducer = combineReducers({
  user: userReducer,
  chat: chatReducer,
  // Add more reducers here as needed
});

export default rootReducer; 