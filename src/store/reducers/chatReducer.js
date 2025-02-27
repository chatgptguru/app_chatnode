import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  topic_id: null,
  messages: [],
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setTopicId: (state, action) => {
      state.topic_id = action.payload;
    },
    setMessages: (state, action) => {
      state.messages = action.payload;
    },
  },
});

export const { setTopicId } = chatSlice.actions;
export default chatSlice.reducer; 