import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isSideBarOpen: false,
  isTeamBarOpen: false,
  isBotBarOpen: false,
};

const layoutSlice = createSlice({
  name: 'layout',
  initialState,
  reducers: {
    setIsSideBarOpen: (state, action) => {
      state.isSideBarOpen = action.payload;
    },
    setIsTeamBarOpen: (state, action) => {
      state.isTeamBarOpen = action.payload;
    },
    setIsBotBarOpen: (state, action) => {
      state.isBotBarOpen = action.payload;
    },
  },
});

export const { setIsSideBarOpen, setIsTeamBarOpen, setIsBotBarOpen } = layoutSlice.actions;
export default layoutSlice.reducer; 