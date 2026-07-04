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
  isOwnProfile: false,
  role: "GUEST",
  userProfile: {},
  subscribed: [],
  chefProfile: {},
  recipes: [],
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
        const reviewsGivenRes = await getReviewsGivenApi(1, 4);

        const baseResponse = {
          isOwnProfile: true,
          role: currentUser.role,
          userProfile: currentUser.profile,
          subscribed: subscribedRes.data,
          reviewsGiven: {
            reviews: reviewsGivenRes.data.reviewsGiven,
            meta: reviewsGivenRes.data.meta,
            loading: false,
          },
        };

        if (currentUser.role === "CHEF") {
          const [recipeRes, subscribersRes, reviewsReceivedRes] =
            await Promise.all([
              getChefRecipesApi(currentUser._id.toString()),
              getSubscribersApi(),
              getAllChefReviewsApi(currentUser._id.toString(), 1, 4),
            ]);

          return {
            ...baseResponse,
            chefProfile: currentUser.chefProfile,
            recipes: recipeRes.data,
            subscribers: subscribersRes.data,
            reviewsReceived: {
              reviews: reviewsReceivedRes.data.reviews,
              meta: reviewsReceivedRes.data.meta,
              loading: false,
            },
          };
        }

        return baseResponse;
      }

      // Other user's profile
      const userDataRes = await getUserByIdApi(userId);

      if (userDataRes.data.role === "CHEF") {
        const [recipesRes, reviewsReceivedRes] = await Promise.all([
          getChefRecipesApi(userDataRes.data._id.toString()),
          getAllChefReviewsApi(userDataRes.data._id.toString(), 1, 4),
        ]);

        return {
          isOwnProfile: false,
          role: userDataRes.data.role,
          userProfile: userDataRes.data.profile,
          chefProfile: userDataRes.data.chefProfile,
          recipes: recipesRes.data,
          reviewsReceived: {
            reviews: reviewsReceivedRes.data.reviews,
            meta: reviewsReceivedRes.data.meta,
            loading: false,
          },
        };
      }

      return {
        isOwnProfile: false,
        role: userDataRes.data.role,
        userProfile: userDataRes.data.profile,
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
        })
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
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.isOwnProfile = action.payload?.isOwnProfile;
        state.role = action.payload?.role;
        state.userProfile = action.payload?.userProfile;
        state.subscribed = action.payload?.subscribed || [];
        state.chefProfile = action.payload?.chefProfile || {};
        state.recipes = action.payload?.recipes || [];
        state.subscribers = action.payload?.subscribers || [];
        state.reviewsGiven = action.payload?.reviewsGiven || state.reviewsGiven;
        state.reviewsReceived =
          action.payload?.reviewsReceived || state.reviewsReceived;
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
      })
  },
});

export const { resetProfileState } = profileSlice.actions;
export default profileSlice;
