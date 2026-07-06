import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import addChefReviewApi from "../../apis/user/addChefReviewApi";
import deleteChefReviewApi from "../../apis/user/deleteChefReviewApi";
import getAllChefReviewsApi from "../../apis/user/getAllChefReviewsApi";
import getChefRecipesApi from "../../apis/user/getChefRecipesApi";
import getReviewsGivenApi from "../../apis/user/getReviewsGivenApi";
import getSubscribedApi from "../../apis/user/getSubscribedApi";
import getSubscribersApi from "../../apis/user/getSubscribersApi";
import getUserByIdApi from "../../apis/user/getUserByIdApi";
import updateChefReviewApi from "../../apis/user/updateChefReviewApi";

const initialState = {
  _id: null,
  isOwnProfile: false,
  role: "GUEST",
  userProfile: {},
  favourites: [],
  subscribed: [],
  chefProfile: {},
  recipes: [],
  recipesLoading: false,
  averageRecipeRating: 0,
  subscribers: [],

  reviewsGiven: {
    reviews: [],
    meta: {
      page: 1,
      limit: 4,
      totalPages: 0,
      totalReviews: 0,
    },
    loading: false,
  },

  reviewsReceived: {
    reviews: [],
    meta: {
      page: 1,
      limit: 4,
      totalPages: 0,
      totalReviews: 0,
    },
    loading: false,
  },

  loading: false,
  profileCreatedAt: null,
};

export const fetchUserProfile = createAsyncThunk(
  "profile/fetchUserProfile",
  async (userId, { getState, rejectWithValue }) => {
    try {
      const currentUser = getState().auth.userData;
      const isOwnProfile = currentUser?._id?.toString() === userId?.toString();

      // Own profile
      if (isOwnProfile) {
        const subscribedRes = await getSubscribedApi();

        const baseResponse = {
          ...getState().profile,
          _id: currentUser._id,
          isOwnProfile: true,
          role: currentUser.role,
          userProfile: currentUser.profile,
          favourites: currentUser.favourites,
          subscribed: subscribedRes.data,
          profileCreatedAt: currentUser.createdAt,
          loading: false,
        };

        if (currentUser.role === "CHEF") {
          const subscribersRes = await getSubscribersApi()

          return {
            ...baseResponse,
            chefProfile: currentUser.chefProfile,
            subscribers: subscribersRes.data,
          };
        }

        return baseResponse;
      }

      // Other user's profile
      const userDataRes = await getUserByIdApi(userId);

      const finalResponse = {
        ...getState().profile,
        _id: userDataRes.data._id,
        isOwnProfile: false,
        role: userDataRes.data.role,
        userProfile: userDataRes.data.profile,
        chefProfile: userDataRes.data.chefProfile,
        favourites: userDataRes.data.favourites,
        profileCreatedAt: userDataRes.data.createdAt,
        loading: false,
      };

      return finalResponse;
    } catch (error) {
      return rejectWithValue(error?.response?.data || error.message);
    }
  },
);

export const getAverageRecipeRating = (recipes) => {
  if (!recipes || recipes.length === 0) {
    return "0.0";
  }

  const ratedRecipes = recipes.filter(
    (recipe) => Number(recipe.averageRating) > 0,
  );

  const total = ratedRecipes.reduce(
    (sum, recipe) => sum + Number(recipe.averageRating),
    0,
  );

  return (total / ratedRecipes.length).toFixed(1);
};

export const fetchRecipesByChef = createAsyncThunk(
  "profile/fetchRecipesByChef",
  async (chefId, { rejectWithValue }) => {
    try {
      const response = await getChefRecipesApi(chefId);
      return {
        recipes: response.data,
        averageRecipeRating: getAverageRecipeRating(response.data),
      };
    } catch (error) {
      return rejectWithValue(error?.response?.data || error.message);
    }
  },
);

export const fetchReviewsGiven = createAsyncThunk(
  "profile/fetchReviewsGiven",
  async ({ page = 1, limit = 4 }, { rejectWithValue }) => {
    try {
      const response = await getReviewsGivenApi(page, limit);

      return {
        reviews: response.data.reviewsGiven,
        meta: response.data.meta,
      };
    } catch (error) {
      return rejectWithValue(error?.response?.data || error.message);
    }
  },
);

export const fetchReviewsReceived = createAsyncThunk(
  "profile/fetchReviewsReceived",
  async ({ userId, page = 1, limit = 4 }, { rejectWithValue }) => {
    try {
      const response = await getAllChefReviewsApi(userId, page, limit);

      return {
        reviews: response.data.reviews,
        meta: response.data.meta,
      };
    } catch (error) {
      return rejectWithValue(error?.response?.data || error.message);
    }
  },
);

export const addChefReview = createAsyncThunk(
  "profile/addChefReview",
  async ({ chefId, rating, message }, { dispatch, rejectWithValue }) => {
    try {
      const response = await addChefReviewApi(chefId, { rating, message });
      await dispatch(
        fetchReviewsReceived({
          userId: chefId,
          page: 1,
          limit: 4,
        }),
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data || error.message);
    }
  },
);

export const updateChefReview = createAsyncThunk(
  "profile/updateChefReview",
  async ({ chefId, rating, message }, { dispatch, rejectWithValue }) => {
    try {
      const response = await updateChefReviewApi(chefId, {
        rating,
        message,
      });
      await dispatch(
        fetchReviewsReceived({
          userId: chefId,
          page: 1,
          limit: 4,
        }),
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data || error.message);
    }
  },
);

export const deleteChefReview = createAsyncThunk(
  "profile/deleteChefReview",
  async (chefId, { dispatch, rejectWithValue }) => {
    try {
      const response = await deleteChefReviewApi(chefId);
      await dispatch(
        fetchReviewsReceived({
          userId: chefId,
          page: 1,
          limit: 4,
        }),
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data || error.message);
    }
  },
);

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    resetProfileState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUserProfile.fulfilled, (_, action) => {
        return action.payload;
      })
      .addCase(fetchRecipesByChef.pending, (state) => {
        state.recipesLoading = true;
      })
      .addCase(fetchRecipesByChef.fulfilled, (state, action) => {
        state.recipesLoading = false;
        state.recipes = action.payload.recipes;
        state.averageRecipeRating = action.payload.averageRecipeRating;
      })
      .addCase(fetchReviewsGiven.pending, (state) => {
        state.reviewsGiven.loading = true;
      })
      .addCase(fetchReviewsGiven.fulfilled, (state, action) => {
        state.reviewsGiven.loading = false;
        state.reviewsGiven.reviews = action.payload.reviews;
        state.reviewsGiven.meta = action.payload.meta;
      })
      .addCase(fetchReviewsReceived.pending, (state) => {
        state.reviewsReceived.loading = true;
      })
      .addCase(fetchReviewsReceived.fulfilled, (state, action) => {
        state.reviewsReceived.loading = false;
        state.reviewsReceived.reviews = action.payload.reviews;
        state.reviewsReceived.meta = action.payload.meta;
      });
  },
});

export const { resetProfileState } = profileSlice.actions;
export default profileSlice;
