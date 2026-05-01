import { createSlice } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from "uuid";

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
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }),
    },
  ],
  toolInUse: {
    isRecipeSearch: false,
    isCookingTip: false,
  },
};

export const getMessageHistory = (messages, userMessage) => {
  const messageHistory = messages.map((msg) => ({
    role: msg.role,
    content: msg.content,
  }));
  return [
    ...messageHistory,
    {
      role: "user",
      content: userMessage,
    },
  ];
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    addUserMessage: (state, action) => {
      state.messages.push({
        id: uuidv4(),
        role: "user",
        content: action.payload,
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }),
      });
    },
    addAssistantMessage: (state, action) => {
      state.messages.push({
        id: uuidv4(),
        role: "assistant",
        content: action.payload.reply,
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }),
        recipes: action.payload.recipes,
      });
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
          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          }),
        },
      ];
      state.toolInUse = {
        isRecipeSearch: false,
        isCookingTip: false,
      };
    },
  },
});

export const {
  addUserMessage,
  addAssistantMessage,
  setRecipeSearchTool,
  setCookingTipTool,
  clearChat,
} = chatSlice.actions;
export default chatSlice;
