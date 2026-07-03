import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import getFreshAndNewRecipes from "../../apis/home/getFreshAndNewRecipesApi";
import getPremiumRecipesApi from "../../apis/home/getPremiumRecipesApi";
import getQuickAndEasyRecipesApi from "../../apis/home/getQuickAndEasyRecipesApi";
import getRecommendedRecipesApi from "../../apis/home/getRecommendedRecipesApi";
import getTrendingPremiumRecipesApi from "../../apis/home/getTrendingPremiumRecipesApi";
import getTrendingRecipesApi from "../../apis/home/getTrendingRecipesApi";
import { logout } from "./authSlice";

const initialState = {
  trendingPremium: [],
  trendingNow: [],
  freshAndNew: [],
  recommendedForYou: [],
  quickAndEasy: [],
  premiumPicks: [],
  isTrendingPremiumLoading: false,
  isTrendingNowLoading: false,
  isFreshAndNewLoading: false,
  isRecommendedForYouLoading: false,
  isQuickAndEasyLoading: false,
  isPremiumPicksLoading: false,
};

export const getTrendingPremium = createAsyncThunk(
  "recipe/getTrendingPremium",
  async (limit) => {
    try {
      return await getTrendingPremiumRecipesApi(limit);
    } catch (error) {
      console.error(error);
    }
  },
);

export const getTrending = createAsyncThunk(
  "recipe/getTrending",
  async (limit) => {
    try {
      return await getTrendingRecipesApi(limit);
    } catch (error) {
      console.error(error);
    }
  },
);

export const getFreshAndNew = createAsyncThunk(
  "recipe/getFreshAndNew",
  async (limit) => {
    try {
      return await getFreshAndNewRecipes(limit);
    } catch (error) {
      console.error(error);
    }
  },
);

export const getRecommended = createAsyncThunk(
  "recipe/getRecommended",
  async (limit) => {
    try {
      return await getRecommendedRecipesApi(limit);
    } catch (error) {
      console.error(error);
    }
  },
);

export const getQuickAndEasy = createAsyncThunk(
  "recipe/getQuickAndEasy",
  async (limit) => {
    try {
      return await getQuickAndEasyRecipesApi(limit);
    } catch (error) {
      console.error(error);
    }
  },
);

export const getPremium = createAsyncThunk(
  "recipe/getPremium",
  async (limit) => {
    try {
      return await getPremiumRecipesApi(limit);
    } catch (error) {
      console.error(error);
    }
  },
);

const homeSlice = createSlice({
  name: "home",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getTrendingPremium.pending, (state) => {
        state.isTrendingPremiumLoading = true;
      })
      .addCase(getTrending.pending, (state) => {
        state.isTrendingNowLoading = true;
      })
      .addCase(getFreshAndNew.pending, (state) => {
        state.isFreshAndNewLoading = true;
      })
      .addCase(getRecommended.pending, (state) => {
        state.isRecommendedForYouLoading = true;
      })
      .addCase(getQuickAndEasy.pending, (state) => {
        state.isQuickAndEasyLoading = true;
      })
      .addCase(getPremium.pending, (state) => {
        state.isPremiumPicksLoading = true;
      })
      .addCase(getTrendingPremium.fulfilled, (state, action) => {
        state.trendingPremium = action.payload.data;
        state.isTrendingPremiumLoading = false;
      })
      .addCase(getTrending.fulfilled, (state, action) => {
        state.trendingNow = action.payload.data;
        state.isTrendingNowLoading = false;
      })
      .addCase(getFreshAndNew.fulfilled, (state, action) => {
        state.freshAndNew = action.payload.data;
        state.isFreshAndNewLoading = false;
      })
      .addCase(getRecommended.fulfilled, (state, action) => {
        state.recommendedForYou = action.payload?.data;
        state.isRecommendedForYouLoading = false;
      })
      .addCase(getQuickAndEasy.fulfilled, (state, action) => {
        state.quickAndEasy = action.payload.data;
        state.isQuickAndEasyLoading = false;
      })
      .addCase(getPremium.fulfilled, (state, action) => {
        state.premiumPicks = action.payload.data;
        state.isPremiumPicksLoading = false;
      })
      .addCase(logout.fulfilled, (state) => {
        state.recommendedForYou = [];
      });
  },
});

export default homeSlice;
