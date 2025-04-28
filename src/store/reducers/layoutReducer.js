import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isChatbotBarOpen: false,
  isSideBarOpen: false,
  isTeamBarOpen: false,
  isBotBarOpen: false,
  teamName: '',
  teamId: '',
  subscriptionPlan: null,
  botId: '',
  bot: null,
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
    setSubscriptionPlan: (state, action) => {
      state.subscriptionPlan = action.payload;
    },
    setIsChatbotBarOpen: (state, action) => {
      state.isChatbotBarOpen = action.payload;
    },
    setBotId: (state, action) => {
      state.botId = action.payload;
    },
    setBot: (state, action) => {
      state.bot = action.payload;
    },
  },  
});

export const { setIsSideBarOpen, setIsTeamBarOpen, setIsBotBarOpen, setTeamName, setTeamId, setSubscriptionPlan, setIsChatbotBarOpen, setBotId, setBot } = layoutSlice.actions;
export default layoutSlice.reducer; 