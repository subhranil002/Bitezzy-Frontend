import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from "uuid";

import generateResponseApi from "../../apis/chatbot/generateResponseApi";

const getTime = () =>
  new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

const initialState = {
  quickSuggestions: [
    "Search indian chicken recipes",
    "Find veg high protein recipes",
    "Search italian recipes",
    "Find recipes that I can make with eggs?",
  ],
  messages: [
    {
      id: uuidv4(),
      role: "assistant",
      content:
        "Hey there! I’m BiteBot — your smart recipe assistant 🍳\nTell me what ingredients you have or what you’re craving, and I’ll whip up delicious recipes and handy cooking tips just for you!",
      recipes: [],
      time: getTime(),
    },
  ],
  toolInUse: {
    isRecipeSearch: false,
    isCookingTip: false,
  },
  language: "en",
  isLoading: false,
};

export const getMessageHistory = (messages, userMessage) => [
  ...messages.map((msg) => ({
    role: msg.role,
    content: msg.content,
  })),
  { role: "user", content: userMessage },
];

export const sendMessage = createAsyncThunk(
  "chat/sendMessage",
  async ({ userMessage }, { getState, rejectWithValue }) => {
    try {
      const { language, messages, toolInUse } = getState().chat;

      const res = await generateResponseApi({
        messages: getMessageHistory(messages, userMessage),
        toolInUse,
        language,
      });

      return {
        userMessage,
        reply: res?.data?.reply,
        recipes: res?.data?.recipes || [],
      };
    } catch (error) {
      return rejectWithValue(
        "Sorry, I'm having trouble understanding your request. Please try again later.",
      );
    }
  },
);

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setLanguage: (state, action) => {
      state.language = action.payload;
    },
    setRecipeSearchTool: (state, action) => {
      state.toolInUse.isRecipeSearch = action.payload;
      state.toolInUse.isCookingTip = false;
    },
    setCookingTipTool: (state, action) => {
      state.toolInUse.isCookingTip = action.payload;
      state.toolInUse.isRecipeSearch = false;
    },
    clearChat: (state) => {
      state.messages = [
        {
          id: uuidv4(),
          role: "assistant",
          content:
            "Hey there! I’m BiteBot — your smart recipe assistant 🍳\nTell me what ingredients you have or what you’re craving, and I’ll whip up delicious recipes and handy cooking tips just for you!",
          recipes: [],
          time: getTime(),
        },
      ];
      state.toolInUse = {
        isRecipeSearch: false,
        isCookingTip: false,
      };
      state.isLoading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendMessage.pending, (state, action) => {
        state.isLoading = true;
        state.messages.push({
          id: uuidv4(),
          role: "user",
          content: action.meta.arg.userMessage,
          time: getTime(),
        });
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.isLoading = false;
        state.messages.push({
          id: uuidv4(),
          role: "assistant",
          content: action.payload.reply,
          recipes: action.payload.recipes,
          time: getTime(),
        });
      })
      .addCase(sendMessage.rejected, (state) => {
        state.isLoading = false;
        state.messages.push({
          id: uuidv4(),
          role: "assistant",
          content:
            "Sorry, I'm having trouble understanding your request. Please try again later.",
          recipes: [],
          time: getTime(),
        });
      });
  },
});

export const {
  setLanguage,
  setRecipeSearchTool,
  setCookingTipTool,
  clearChat,
} = chatSlice.actions;

export default chatSlice;
