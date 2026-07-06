import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import Loading from "../components/Loading";
import {
  fetchUserProfile,
  resetProfileState,
} from "../redux/slices/profileSlice";
import ChefProfile from "./Chef/ChefProfile";
import UserProfile from "./User/UserProfile";

export default function Profile() {
  const { id } = useParams();
  const { userData } = useSelector((state) => state.auth);
  const { role, loading } = useSelector((state) => state.profile);
  const dispatch = useDispatch();

  // Fetch profile data when id changes or user updates
  useEffect(() => {
    if (!userData?._id || !id) return;
    dispatch(fetchUserProfile(id));

    return () => {
      dispatch(resetProfileState());
    };
  }, [id, userData?.updatedAt, userData?.profile?.subscribed?.length]);

  // Show loading spinner while fetching
  if (loading) return <Loading />;

  // Render profile based on role
  if (role === "USER" || role === "ADMIN") {
    return <UserProfile />;
  } else if (role === "CHEF") {
    return <ChefProfile />;
  }

  return null;
}
