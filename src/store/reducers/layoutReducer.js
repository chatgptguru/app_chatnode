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
  defaultSettings: {
    theme: {
      primaryColor: "#4169E1",
      backgroundColor: "#FFFFFF"
    },
    customIcons: {
      enabled: false,
    },
    header: {
      enabled: true,
      title: "AI Chatbot",
      titleColor: "#FFFFFF",
      statusEnabled: true,
      statusText: "Online",
      statusColor: "#4CAF50",
      shadow: "#E5E5E5",
      resetButton: "#FFFFFF",
      background: "#4169E1"
    },
    chatBubbles: {
      greeting: "What can I help you with?",
      botBubbleBg: "#000000",
      botBubbleText: "#FFFFFF",
      userBubbleBg: "#4169E1",
      userBubbleText: "#FFFFFF",
      feedback: true,
      soundEffect: false
    },
    chatInput: {
      text: "",
      textColor: "#000000",
      background: "#FFFFFF",
      border: "#E5E5E5",
      sendButton: "#000000"
    },
    suggestedQuestions: {
      questions: ["Who Are You?", "What is your purpose?"]
    },
    popupMessage: {
      enabled: true,
      message1: "Need help?",
      message2: "Type your message",
      text: "#000000",
      background: "#FFFFFF",
      border: "#E5E5E5"
    },
    popupButton: {
      openByDefault: true,
      buttonOnRight: true,
      background: "#4169E1",
      icon: "#FFFFFF"
    },
    userInfo: {
      collectName: true,
      collectEmail: true,
      collectPhone: true,
      submitButton: "Start Chatting",
      privacyPolicy: true
    }
  }
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
    setDefaultSettings: (state, action) => {
      state.defaultSettings = action.payload;
    },
  },
});

export const { setIsSideBarOpen, setIsTeamBarOpen, setIsBotBarOpen, setTeamName, setTeamId, setSubscriptionPlan, setIsChatbotBarOpen, setBotId, setBot, setDefaultSettings } = layoutSlice.actions;
export default layoutSlice.reducer; 