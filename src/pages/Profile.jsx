import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import getChefRecipesApi from "../apis/user/getChefRecipesApi";
import getSubscribedApi from "../apis/user/getSubscribedApi";
import getSubscribersApi from "../apis/user/getSubscribersApi";
import getUserByIdApi from "../apis/user/getUserByIdApi";
import Loading from "../components/Loading";
import ChefProfile from "./Chef/ChefProfile";
import UserProfile from "./User/UserProfile";

export default function Profile() {
  const { id } = useParams(); // user id from route
  const { userData } = useSelector((state) => state.auth);

  const [currUser, setCurrUser] = useState();
  const [loading, setLoading] = useState(true);

  // Fetch profile data when id changes or user updates
  useEffect(() => {
    if (!userData?._id || !id) return;

    (async () => {
      try {
        setLoading(true);

        // If viewing own profile
        if (userData._id.toString() === id) {
          const updatedUser = {
            ...userData,
            profile: { ...userData.profile },
            chefProfile: { ...userData.chefProfile },
          };

          const subscribedRes = await getSubscribedApi();
          updatedUser.profile.subscribed = subscribedRes.data;

          if (updatedUser.role === "CHEF") {
            const [recipeRes, subscribersRes] = await Promise.all([
              getChefRecipesApi(userData._id.toString()),
              getSubscribersApi(),
            ]);
            updatedUser.chefProfile.recipes = recipeRes.data;
            updatedUser.chefProfile.subscribers = subscribersRes.data;
          }

          setCurrUser(updatedUser);
        } else {
          // Fetch another user's profile
          const res = await getUserByIdApi(id);

          const fetchedUser = {
            ...res.data,
            profile: { ...res.data.profile },
            chefProfile: { ...res.data.chefProfile },
          };

          if (fetchedUser.role === "CHEF") {
            const recipesRes = await getChefRecipesApi(
              fetchedUser._id.toString(),
            );
            fetchedUser.chefProfile.recipes = recipesRes.data;
          }

          setCurrUser(fetchedUser);
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    })();
  }, [id, userData?.updatedAt, userData?.profile?.subscribed?.length]);

  // Show loading spinner while fetching
  if (loading) return <Loading />;

  // Render profile based on role
  if (currUser?.role === "USER" || currUser?.role === "ADMIN") {
    return <UserProfile profileData={currUser} />;
  } else if (currUser?.role === "CHEF") {
    return <ChefProfile profileData={currUser} />;
  }

  return null;
}
