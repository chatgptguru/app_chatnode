import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './store/reducers/index';

export const store = configureStore({
    reducer: rootReducer,
});