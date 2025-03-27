import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isSideBarOpen: false,
  isTeamBarOpen: false,
  isBotBarOpen: false,
  teamName: '',
  teamId: '',
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
    setTeamName: (state, action) => {
      state.teamName = action.payload;
    },
    setTeamId: (state, action) => {
      state.teamId = action.payload;
    },
  },
});

export const { setIsSideBarOpen, setIsTeamBarOpen, setIsBotBarOpen, setTeamName, setTeamId } = layoutSlice.actions;
export default layoutSlice.reducer; 