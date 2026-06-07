import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import getRecipeByIdApi from "../../apis/recipe/getRecipeByIdApi";
import getUserByIdApi from "../../apis/user/getUserByIdApi";

const initialState = {
  recipe: null,
  chef: null,
  error: null,
};

export const getRecipeById = createAsyncThunk(
  "recipe/getRecipeById",
  async (id, thunkAPI) => {
    try {
      return await getRecipeByIdApi(id);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const getChefById = createAsyncThunk(
  "recipe/getChefById",
  async (id, thunkAPI) => {
    try {
      return await getUserByIdApi(id);
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

const recipeSlice = createSlice({
  name: "recipe",
  initialState,
  reducers: {
    resetRecipe: (state) => {
      state.recipe = null;
      state.chef = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getRecipeById.fulfilled, (state, action) => {
        state.recipe = action.payload.data;
        state.chef = action.payload.data.chefId;
      })
      .addCase(getRecipeById.rejected, (state, action) => {
        state.error = action.payload?.response?.data;
      })
      .addCase(getChefById.fulfilled, (state, action) => {
        state.chef = action.payload.data;
      });
  },
});

export const { resetRecipe } = recipeSlice.actions;
export default recipeSlice;
