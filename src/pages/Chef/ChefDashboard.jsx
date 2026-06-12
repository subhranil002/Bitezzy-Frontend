import { useEffect, useRef, useState } from "react";
import {
    FaChartBar,
    FaChartLine,
    FaDollarSign,
    FaEye,
    FaPlus,
    FaStar,
    FaUsers,
    FaHeart,
    FaUtensils,
    FaGraduationCap,
    FaBriefcase,
    FaLink,
    FaCalendarAlt
} from "react-icons/fa";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import getChefDashboardApi from "../../apis/user/getChefDashboardApi";
import RecipeCard from "../../components/recipe/RecipeCard";
import HomeLayout from "../../layouts/HomeLayout";

const ChefDashboard = () => {
    const navigate = useNavigate();
    const { userData: authUser } = useSelector((state) => state.auth);
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let active = true;
        const fetchDashboardData = async () => {
            try {
                const response = await getChefDashboardApi();
                if (response?.success && active) {
                    setDashboardData(response.data);
                }
            } catch (error) {
                console.error("Failed to fetch chef dashboard:", error);
            } finally {
                if (active) setLoading(false);
            }
        };
        fetchDashboardData();
        return () => {
            active = false;
        };
    }, []);

    if (loading || !dashboardData || !authUser) {
        return (
            <HomeLayout>
                <div className="flex justify-center items-center min-h-screen">
                    <span className="loading loading-spinner loading-lg text-orange-500"></span>
                </div>
            </HomeLayout>
        );
    }

    const { profile, _id } = authUser;
    const { stats, topRecipes, recentReviews } = dashboardData;

    return (
        <HomeLayout>
            {/* Note: Standardized to bg-gradient-to-br. If you are using a specific v4 plugin for bg-linear, revert this class */}
            <div className="min-h-screen bg-gradient-to-br from-orange-50 via-rose-50 to-amber-50">
                <div className="container mx-auto px-4 py-8 space-y-10">

                    {/* --- Header Section (Unchanged) --- */}
                    <div className="flex flex-col lg:flex-row gap-8">
                        {/* Chef Profile Card */}
                        <div className="card bg-base-100 shadow-xl border border-orange-100 lg:flex-1">
                            <div className="card-body">
                                <div className="flex flex-col sm:flex-row items-start gap-6">
                                    <div className="avatar">
                                        <div className="w-24 h-24 rounded-full ring-4 ring-orange-200 ring-offset-2">
                                            <img src={profile.avatar?.secure_url} alt={profile.name} />
                                        </div>
                                    </div>
                                    <div className="flex-1">
                                        <h1 className="card-title text-3xl bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                                            {profile.name}
                                        </h1>
                                        <p className="text-gray-600 mt-2">{profile.bio}</p>
                                        <div className="flex flex-wrap gap-2 mt-4">
                                            {[].concat(profile.cuisine || []).map((cuisineItem, index) => (
                                                <div key={index} className="badge badge-outline border-orange-400 text-orange-500">
                                                    {cuisineItem}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="card bg-base-100 shadow-xl border border-orange-100 w-full lg:w-80">
                            <div className="card-body">
                                <h3 className="card-title text-gray-800">Quick Actions</h3>
                                <div className="space-y-3 mt-2">
                                    <button
                                        className="btn w-full gap-2 bg-orange-500 hover:bg-orange-600 border-none text-white"
                                        onClick={() => navigate("/recipe/add")}
                                    >
                                        <FaPlus className="w-4 h-4" />
                                        Add New Recipe
                                    </button>
                                    <button
                                        className="btn btn-outline border-orange-300 text-orange-600 w-full gap-2 hover:bg-orange-50 hover:border-orange-400"
                                        onClick={() => navigate(`/profile/${userData._id}`)}
                                    >
                                        <FaEye className="w-4 h-4" />
                                        View Public Profile
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* --- Main Stats Grid (Unchanged) --- */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            { label: "Total Likes", icon: FaHeart, value: stats.totalLikes.toLocaleString(), color: "text-rose-500" },
                            { label: "Subscribers", icon: FaUsers, value: stats.subscribers.toLocaleString(), color: "text-orange-500" },
                            { label: "Monthly Earnings", icon: FaDollarSign, value: `$${stats.monthlyEarnings.toLocaleString()}`, color: "text-emerald-500" },
                            { label: "Average Rating", icon: FaStar, value: `${stats.averageRating}/5`, color: "text-amber-500" },
                        ].map(({ label, icon: Icon, value, color }) => (
                            <div key={label} className="card bg-base-100 shadow-lg border border-orange-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                                <div className="card-body p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="text-sm font-semibold text-gray-500 uppercase tracking-wider">{label}</div>
                                        <div className={`p-2 rounded-lg bg-orange-50 ${color}`}>
                                            <Icon className="w-5 h-5" />
                                        </div>
                                    </div>
                                    <div className="text-3xl font-bold text-gray-800">
                                        {value}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* --- ENHANCED: Recipes Section (Glassmorphism) --- */}
                    <div className="space-y-6">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-orange-200/50 pb-4">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-800">Your Top Recipes</h2>
                                <p className="text-gray-500 text-sm mt-1">Manage and track your recipe performance</p>
                            </div>
                            <button
                                className="btn btn-primary bg-orange-500 hover:bg-orange-600 border-none text-white gap-2 shadow-md"
                                onClick={() => navigate("/recipe/add")}
                            >
                                <FaPlus className="w-4 h-4" />
                                New Recipe
                            </button>
                        </div>

                        {topRecipes.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pt-2">
                                {topRecipes.map((recipe) => (
                                    <div
                                        key={recipe._id}
                                        className="card bg-white/30 backdrop-blur-md border border-white/50 shadow-lg hover:shadow-2xl hover:bg-white/40 transition-all duration-300 overflow-hidden group rounded-2xl"
                                    >
                                        {/* Ensure your RecipeCard component itself has a transparent background! */}
                                        <RecipeCard recipe={recipe} />

                                        <div className="p-4 bg-white/20 border-t border-white/30 mt-auto">
                                            <div className="flex justify-between items-center text-sm">
                                                <span className={`badge border-none font-medium ${recipe.isPremium ? "bg-amber-100/80 text-amber-800" : "bg-white/50 text-gray-700"}`}>
                                                    {recipe.isPremium ? "Premium" : "Free"}
                                                </span>
                                                <div className="flex items-center gap-4">
                                                    <div className="flex items-center gap-1.5 text-gray-700 group-hover:text-rose-500 transition-colors">
                                                        <FaHeart className="w-4 h-4" />
                                                        <span className="font-semibold">{recipe.likes}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1.5 text-gray-700 group-hover:text-amber-500 transition-colors">
                                                        <FaStar className="w-4 h-4" />
                                                        <span className="font-semibold">{recipe.averageRating}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="card border-2 border-dashed border-orange-200 bg-white/20 backdrop-blur-sm text-center py-16 shadow-none rounded-2xl">
                                <div className="w-20 h-20 bg-orange-100/50 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <FaUtensils className="w-10 h-10 text-orange-400" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-700 mb-2">No recipes yet</h3>
                                <p className="text-gray-500 mb-6 max-w-sm mx-auto">
                                    Start creating amazing recipes to build your subscriber base and showcase your culinary skills.
                                </p>
                                <button
                                    className="btn btn-primary bg-orange-500 hover:bg-orange-600 border-none text-white gap-2"
                                    onClick={() => navigate("/recipe/add")}
                                >
                                    <FaPlus className="w-4 h-4" />
                                    Create Your First Recipe
                                </button>
                            </div>
                        )}
                    </div>

                    {/* --- ENHANCED: Recent Reviews Section --- */}
                    <div className="card bg-base-100 shadow-xl border border-orange-100">
                        <div className="card-body">
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="card-title text-gray-800 flex items-center gap-2">
                                    <FaStar className="text-amber-400 w-5 h-5" />
                                    Recent Reviews
                                </h3>
                            </div>

                            {recentReviews.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
                                    {recentReviews.map((review, index) => (
                                        <div key={index} className="bg-orange-50/50 rounded-2xl p-5 border border-orange-100 transition-transform hover:-translate-y-1">
                                            <div className="flex items-center justify-between mb-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="avatar">
                                                        <div className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center bg-orange-200">
                                                            {review.avatar ? (
                                                                <img src={review.avatar} alt={review.name} className="w-full h-full object-cover" />
                                                            ) : (
                                                                <span className="text-orange-700 font-bold">{review.name.charAt(0).toUpperCase()}</span>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <span className="font-semibold text-gray-800">{review.name}</span>
                                                </div>
                                                <div className="rating rating-sm">
                                                    {[...Array(5)].map((_, i) => (
                                                        <input
                                                            key={i}
                                                            type="radio"
                                                            className="mask mask-star-2 bg-amber-400"
                                                            checked={i < review.rating}
                                                            readOnly
                                                            disabled
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                            <p className="text-gray-600 text-sm italic leading-relaxed">
                                                "{review.message}"
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-500 text-center py-6">No reviews yet. Keep cooking!</p>
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </HomeLayout>
    );
};

export default ChefDashboard;