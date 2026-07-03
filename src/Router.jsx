import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Route, Routes, useLocation } from "react-router-dom";

import ChefOnly from "./components/auth/ChefOnly";
import RequireAuth from "./components/auth/RequireAuth";
import AboutPage from "./pages/About";
import Chat from "./pages/Bitebot/Chat";
import AddRecipe from "./pages/Chef/AddRecipe";
import EditRecipe from "./pages/Chef/EditRecipe";
import ContactUs from "./pages/ContactUs";
import Dashboard from "./pages/Dashboard";
import ForgotPassword from "./pages/ForgotPassword";
import Home from "./pages/Home";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import Profile from "./pages/Profile";
import RecipeDetail from "./pages/Recipe/RecipeDetail";
import ResetPassword from "./pages/ResetPassword";
import Search from "./pages/Search";
import SignUp from "./pages/Signup";
import TeamPage from "./pages/TeamPage";
import Favorites from "./pages/User/Favourites";
import { getProfile } from "./redux/slices/authSlice";

function Router() {
  const dispatch = useDispatch();
  const location = useLocation();

  const paths = ["/", "/signup", "/login", "/search"];

  useEffect(() => {
    if (!paths.includes(location.pathname)) {
      dispatch(getProfile());
    }
  }, [location.pathname]);

  useEffect(() => {
    dispatch(getProfile());
  }, []);

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/our-team" element={<TeamPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/forgotpassword" element={<ForgotPassword />} />
      <Route path="/resetpassword/:id" element={<ResetPassword />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/search" element={<Search />} />
      <Route element={<RequireAuth />}>
        <Route path="/chat" element={<Chat />} />
        <Route path="/profile/:id" element={<Profile />} />
        <Route path="/profile/:id/favourites" element={<Favorites />} />
        <Route path="/recipe/:id" element={<RecipeDetail />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Route>
      <Route element={<ChefOnly />}>
        <Route path="/recipe/add" element={<AddRecipe />} />
        <Route path="/recipe/edit/:id" element={<EditRecipe />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default Router;
