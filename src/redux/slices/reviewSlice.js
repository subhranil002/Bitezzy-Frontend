import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import addRecipeReviewApi from "../../apis/recipe/addRecipeReviewApi";
import deleteRecipeReviewApi from "../../apis/recipe/deleteRecipeReviewApi";
import getRecipeReviewsApi from "../../apis/recipe/getRecipeReviewsApi";
import updateRecipeReviewApi from "../../apis/recipe/updateRecipeReviewApi";
import addChefReviewApi from "../../apis/user/addChefReviewApi";
import deleteChefReviewApi from "../../apis/user/deleteChefReviewApi";
import updateChefReviewApi from "../../apis/user/updateChefReviewApi";
import { getChefById, getRecipeById } from "./recipeSlice";

const initialState = {
  reviews: [],
  loading: false,
  error: null,
  isSubmittingRecipeReview: false,
  isSubmittingChefReview: false,
  pagination: {
    page: 1,
    limit: 10,
    totalPages: 1,
    totalReviews: 0,
  },
};

export const fetchRecipeReviews = createAsyncThunk(
  "review/fetchRecipeReviews",
  async ({ recipeId, page, limit }, thunkAPI) => {
    try {
      const response = await getRecipeReviewsApi(recipeId, page, limit);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response?.data || error.message);
    }
  }
);

export const addRecipeReview = createAsyncThunk(
  "review/addRecipeReview",
  async ({ recipeId, rating, message }, thunkAPI) => {
    try {
      const response = await addRecipeReviewApi(recipeId, { rating, message });
      await thunkAPI.dispatch(getRecipeById(recipeId));
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response?.data || error.message);
    }
  }
);

export const updateRecipeReview = createAsyncThunk(
  "review/updateRecipeReview",
  async ({ recipeId, rating, message }, thunkAPI) => {
    try {
      const response = await updateRecipeReviewApi(recipeId, { rating, message });
      await thunkAPI.dispatch(getRecipeById(recipeId));
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response?.data || error.message);
    }
  }
);

export const deleteRecipeReview = createAsyncThunk(
  "review/deleteRecipeReview",
  async (recipeId, thunkAPI) => {
    try {
      const response = await deleteRecipeReviewApi(recipeId);
      await thunkAPI.dispatch(getRecipeById(recipeId));
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response?.data || error.message);
    }
  }
);

export const addChefReview = createAsyncThunk(
  "review/addChefReview",
  async ({ chefId, rating, message }, thunkAPI) => {
    try {
      const response = await addChefReviewApi(chefId, { rating, message });
      await thunkAPI.dispatch(getChefById(chefId));
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response?.data || error.message);
    }
  }
);

export const updateChefReview = createAsyncThunk(
  "review/updateChefReview",
  async ({ chefId, rating, message }, thunkAPI) => {
    try {
      const response = await updateChefReviewApi(chefId, { rating, message });
      await thunkAPI.dispatch(getChefById(chefId));
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response?.data || error.message);
    }
  }
);

export const deleteChefReview = createAsyncThunk(
  "review/deleteChefReview",
  async (chefId, thunkAPI) => {
    try {
      const response = await deleteChefReviewApi(chefId);
      await thunkAPI.dispatch(getChefById(chefId));
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error?.response?.data || error.message);
    }
  }
);

const reviewSlice = createSlice({
  name: "review",
  initialState,
  reducers: {
    resetReviewState: (state) => {
      state.reviews = [];
      state.loading = false;
      state.error = null;
      state.isSubmittingRecipeReview = false;
      state.isSubmittingChefReview = false;
      state.pagination = {
        page: 1,
        limit: 10,
        totalPages: 1,
        totalReviews: 0,
      };
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Recipe Reviews
      .addCase(fetchRecipeReviews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRecipeReviews.fulfilled, (state, action) => {
        state.loading = false;
        const payload = action.payload;
        state.reviews = payload?.data || payload?.reviews || [];
        state.pagination = {
          page: payload?.page || payload?.pagination?.page || 1,
          limit: payload?.limit || payload?.pagination?.limit || 10,
          totalPages: payload?.totalPages || payload?.pagination?.totalPages || 1,
          totalReviews: payload?.totalReviews || payload?.pagination?.totalReviews || 0,
        };
      })
      .addCase(fetchRecipeReviews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to load reviews";
      })

      // Add Recipe Review
      .addCase(addRecipeReview.pending, (state) => {
        state.isSubmittingRecipeReview = true;
      })
      .addCase(addRecipeReview.fulfilled, (state) => {
        state.isSubmittingRecipeReview = false;
      })
      .addCase(addRecipeReview.rejected, (state) => {
        state.isSubmittingRecipeReview = false;
      })

      // Update Recipe Review
      .addCase(updateRecipeReview.pending, (state) => {
        state.isSubmittingRecipeReview = true;
      })
      .addCase(updateRecipeReview.fulfilled, (state) => {
        state.isSubmittingRecipeReview = false;
      })
      .addCase(updateRecipeReview.rejected, (state) => {
        state.isSubmittingRecipeReview = false;
      })

      // Delete Recipe Review
      .addCase(deleteRecipeReview.pending, (state) => {
        state.isSubmittingRecipeReview = true;
      })
      .addCase(deleteRecipeReview.fulfilled, (state) => {
        state.isSubmittingRecipeReview = false;
      })
      .addCase(deleteRecipeReview.rejected, (state) => {
        state.isSubmittingRecipeReview = false;
      })

      // Add Chef Review
      .addCase(addChefReview.pending, (state) => {
        state.isSubmittingChefReview = true;
      })
      .addCase(addChefReview.fulfilled, (state) => {
        state.isSubmittingChefReview = false;
      })
      .addCase(addChefReview.rejected, (state) => {
        state.isSubmittingChefReview = false;
      })

      // Update Chef Review
      .addCase(updateChefReview.pending, (state) => {
        state.isSubmittingChefReview = true;
      })
      .addCase(updateChefReview.fulfilled, (state) => {
        state.isSubmittingChefReview = false;
      })
      .addCase(updateChefReview.rejected, (state) => {
        state.isSubmittingChefReview = false;
      })

      // Delete Chef Review
      .addCase(deleteChefReview.pending, (state) => {
        state.isSubmittingChefReview = true;
      })
      .addCase(deleteChefReview.fulfilled, (state) => {
        state.isSubmittingChefReview = false;
      })
      .addCase(deleteChefReview.rejected, (state) => {
        state.isSubmittingChefReview = false;
      });
  },
});

export const { resetReviewState } = reviewSlice.actions;
export default reviewSlice;