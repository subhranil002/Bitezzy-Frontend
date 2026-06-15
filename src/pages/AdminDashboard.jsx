import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
    FaUtensils,
    FaUsers,
    FaStar,
    FaUserShield,
    FaCrown,
    FaChartLine,
    FaFire,
    FaRegClock,
    FaGlobeAsia
} from "react-icons/fa";
import HomeLayout from "../layouts/HomeLayout";
import getDashboardApi from "../apis/user/getDashboardApi";

const AdminDashboard = () => {
    const { userData } = useSelector((state) => state.auth);
    const [loading, setLoading] = useState(true);
    const [dashboardData, setDashboardData] = useState(null);

    useEffect(() => {
        let active = true;
        const fetchDashboardData = async () => {
            try {
                const response = await getDashboardApi();
                if (response?.success && active) {
                    setDashboardData(response.data);
                }
            } catch (error) {
                console.error("Failed to fetch admin dashboard:", error);
            } finally {
                if (active) setLoading(false);
            }
        };
        fetchDashboardData();
        return () => {
            active = false;
        };
    }, []);

    const systemStats = dashboardData?.stats || {
        totalUsers: 0,
        newUsersToday: 0,
        totalChefs: 0,
        totalRecipes: 0,
        premiumRecipes: 0,
        premiumUsers: 0,
    };

    const recentRecipes = dashboardData?.recentRecipes || [];
    const recentUsers = dashboardData?.recentUsers || [];
    const premiumEcosystem = dashboardData?.premiumEcosystem || { premiumUsers: 0, premiumRecipes: 0 };

    if (loading) {
        return (
            <HomeLayout>
                <div className="flex justify-center items-center min-h-screen">
                    <span className="loading loading-spinner loading-lg text-orange-500"></span>
                </div>
            </HomeLayout>
        );
    }

    return (
        <HomeLayout>
            <div className="min-h-screen bg-gradient-to-br from-orange-50 via-rose-50 to-amber-50">
                <div className="container mx-auto px-4 py-8 space-y-8">

                    {/* --- Header Profile Section --- */}
                    <div className="card bg-white/60 backdrop-blur-lg shadow-xl border border-white/50">
                        <div className="card-body py-6">
                            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                                <div className="flex items-center gap-6">
                                    <div className="avatar">
                                        <div className="w-20 h-20 rounded-full ring-4 ring-orange-200 flex items-center justify-center bg-gradient-to-br from-orange-100 to-rose-100 shadow-inner overflow-hidden">
                                            {userData?.profile?.avatar?.secure_url ? (
                                                <img src={userData.profile.avatar.secure_url} alt={userData.profile.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <FaGlobeAsia className="w-10 h-10 text-orange-500" />
                                            )}
                                        </div>
                                    </div>
                                    <div>
                                        <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                                            Welcome, {userData?.profile?.name || "Admin"}
                                        </h1>
                                        <p className="text-gray-500 mt-1 flex items-center gap-2">
                                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                                            System Operating Nominally
                                        </p>
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <div className="px-4 py-2 bg-orange-100 text-orange-700 rounded-lg font-medium text-sm flex items-center gap-2 shadow-sm">
                                        <FaRegClock /> Live Data Feed
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* --- 6-Grid Stats Section --- */}
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                        {[
                            { label: "Total Users", icon: FaUsers, value: systemStats.totalUsers.toLocaleString(), color: "text-blue-500", bg: "bg-blue-50" },
                            { label: "Registered Chefs", icon: FaUserShield, value: systemStats.totalChefs.toLocaleString(), color: "text-emerald-500", bg: "bg-emerald-50" },
                            { label: "Total Recipes", icon: FaUtensils, value: systemStats.totalRecipes.toLocaleString(), color: "text-orange-500", bg: "bg-orange-50" },
                            { label: "Premium Recipes", icon: FaCrown, value: systemStats.premiumRecipes.toLocaleString(), color: "text-amber-500", bg: "bg-amber-50" },
                            { label: "Premium Subs", icon: FaStar, value: systemStats.premiumUsers.toLocaleString(), color: "text-rose-500", bg: "bg-rose-50" },
                            { label: "New Today", icon: FaChartLine, value: `+${systemStats.newUsersToday}`, color: "text-indigo-500", bg: "bg-indigo-50" },
                        ].map(({ label, icon: Icon, value, color, bg }) => (
                            <div key={label} className="card bg-white/70 backdrop-blur-md shadow-md border border-white/60 hover:-translate-y-1 transition-transform duration-300">
                                <div className="card-body p-5 flex flex-col items-center text-center gap-2">
                                    <div className={`p-3 rounded-xl ${bg} ${color} shadow-inner`}>
                                        <Icon className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <div className="text-2xl font-black text-gray-800">{value}</div>
                                        <div className="text-xs font-bold text-gray-500 uppercase tracking-widest mt-1">{label}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* --- Main Content Split --- */}
                    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                        
                        {/* Left Column: Recent Recipes (Takes up 2/3 width) */}
                        <div className="xl:col-span-2 space-y-4">
                            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2 px-2">
                                <FaFire className="text-orange-500" /> Recently Published Recipes
                            </h2>
                            
                            <div className="bg-white/50 backdrop-blur-xl rounded-3xl border border-white/60 shadow-xl overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="table w-full">
                                        <thead className="bg-white/40 text-gray-700 border-b border-white/60">
                                            <tr>
                                                <th className="font-semibold text-sm rounded-tl-3xl py-4">Recipe Details</th>
                                                <th className="font-semibold text-sm py-4">Chef / Creator</th>
                                                <th className="font-semibold text-sm py-4">Metrics</th>
                                                <th className="font-semibold text-sm rounded-tr-3xl py-4 text-right">Published</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {recentRecipes.map((recipe) => (
                                                <tr key={recipe._id} className="hover:bg-white/60 transition-colors border-b border-white/30 last:border-0">
                                                    <td className="py-4">
                                                        <div className="flex items-center space-x-4">
                                                            <div className="avatar">
                                                                <div className="w-16 h-16 rounded-xl shadow-md">
                                                                    <img src={recipe.thumbnail?.secure_url} alt={recipe.title} className="object-cover" />
                                                                </div>
                                                            </div>
                                                            <div>
                                                                <div className="font-bold text-gray-800 text-base">{recipe.title}</div>
                                                                <div className="flex items-center gap-2 mt-1">
                                                                    <span className="text-xs font-medium px-2 py-1 bg-gray-100 text-gray-600 rounded-md capitalize">
                                                                        {recipe.cuisine}
                                                                    </span>
                                                                    <span className="text-xs text-gray-500 flex items-center gap-1">
                                                                        <FaRegClock /> {recipe.totalCookingTime}m
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div className="font-medium text-gray-800">{recipe.chefId?.profile?.name}</div>
                                                    </td>
                                                    <td>
                                                        <div className="flex flex-col gap-1 items-start">
                                                            <div className="flex items-center gap-1 text-sm font-bold text-gray-700">
                                                                <FaStar className="text-amber-400 w-4 h-4" /> {recipe.averageRating}
                                                            </div>
                                                            {recipe.isPremium ? (
                                                                <span className="badge badge-xs border-none bg-amber-100 text-amber-800 font-bold px-2 py-2">Premium</span>
                                                            ) : (
                                                                <span className="badge badge-xs border-none bg-emerald-100 text-emerald-700 font-bold px-2 py-2">Free</span>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="text-right text-sm text-gray-500 font-medium">
                                                        {new Date(recipe.createdAt).toLocaleDateString()}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Recent Users */}
                        <div className="space-y-4">
                            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2 px-2">
                                <FaUsers className="text-blue-500" /> Newest Accounts
                            </h2>

                            <div className="bg-white/50 backdrop-blur-xl rounded-3xl border border-white/60 shadow-xl p-2">
                                <div className="flex flex-col">
                                    {recentUsers.map((user, index) => (
                                        <div key={user._id} className={`flex items-center justify-between p-4 rounded-2xl transition-all hover:bg-white/60 ${index !== recentUsers.length - 1 ? 'border-b border-white/40' : ''}`}>
                                            <div className="flex items-center gap-4">
                                                <div className={`avatar ${!user.profile?.avatar?.secure_url ? 'placeholder' : ''}`}>
                                                    <div className={`w-12 h-12 rounded-full font-bold text-lg shadow-inner ${
                                                        !user.profile?.avatar?.secure_url ? (user.role === 'CHEF' 
                                                            ? 'bg-emerald-100 text-emerald-700 ring-2 ring-emerald-200' 
                                                            : 'bg-blue-100 text-blue-700 ring-2 ring-blue-200') : ''
                                                    }`}>
                                                        {user.profile?.avatar?.secure_url ? (
                                                            <img src={user.profile.avatar.secure_url} alt={user.profile.name} className="w-full h-full object-cover" />
                                                        ) : (
                                                            <span>{user.profile?.name?.charAt(0) || 'U'}</span>
                                                        )}
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className="font-bold text-gray-800">{user.profile.name}</div>
                                                    <div className="text-xs text-gray-500 font-medium">{new Date(user.createdAt).toLocaleDateString()}</div>
                                                </div>
                                            </div>
                                            <div>
                                                {user.role === 'CHEF' ? (
                                                    <span className="badge border-none bg-emerald-500 text-white font-bold shadow-sm shadow-emerald-200">CHEF</span>
                                                ) : (
                                                    <span className="badge border-none bg-gray-200 text-gray-700 font-bold">USER</span>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Mini Premium Ecosystem Card */}
                            <div className="mt-6 bg-gradient-to-br from-amber-400 to-orange-500 rounded-3xl p-6 shadow-xl shadow-orange-200 text-white relative overflow-hidden">
                                <FaCrown className="absolute -right-4 -bottom-4 w-32 h-32 opacity-20" />
                                <h3 className="text-lg font-bold flex items-center gap-2 mb-4 relative z-10">
                                    <FaCrown /> Premium Ecosystem
                                </h3>
                                <div className="grid grid-cols-2 gap-4 relative z-10">
                                    <div>
                                        <div className="text-amber-100 text-xs font-bold uppercase tracking-wider">Active Subs</div>
                                        <div className="text-2xl font-black">{premiumEcosystem.premiumUsers}</div>
                                    </div>
                                    <div>
                                        <div className="text-amber-100 text-xs font-bold uppercase tracking-wider">Premium Dishes</div>
                                        <div className="text-2xl font-black">{premiumEcosystem.premiumRecipes}</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </HomeLayout>
    );
};

export default AdminDashboard;