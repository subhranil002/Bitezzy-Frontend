import { useEffect, useState } from "react";
import {
  FaBriefcase,
  FaCalendarAlt,
  FaEdit,
  FaGlobe,
  FaGraduationCap,
  FaHeart,
  FaLink,
  FaLock,
  FaStar,
  FaUsers,
  FaUtensils,
} from "react-icons/fa";
import { useSelector } from "react-redux";

import getMyRecipesApi from "../../apis/user/getMyRecipesApi";
import subscribeApi from "../../apis/user/subscribeApi";
import unsubscribeApi from "../../apis/user/unsubscribeApi";
import EditChefProfileDialog from "../../components/chefProfile/editChefProfileDialog";
import RecipeCard from "../../components/recipe/RecipeCard";
import ChangePasswordDialog from "../../components/userProfile/ChangePasswordDialog";
import ProfileStats from "../../components/userProfile/ProfileStats";
import ProfileTabs from "../../components/userProfile/ProfileTabs";
import HomeLayout from "../../layouts/HomeLayout";

function ChefProfile({ profileData }) {
  const { userData } = useSelector((state) => state.auth);
  const [myRecipes, setMyRecipes] = useState([]);

  useEffect(() => {
    (async () => {
      const res = await getMyRecipesApi(profileData._id.toString());
      if (res.success) {
        setMyRecipes(res.data);
      }
    })();

    return () => {
      setMyRecipes([]);
    };
  }, []);

  const isOwnProfile = userData?._id.toString() === profileData?._id.toString();

  const [subscribed, setSubscribed] = useState(
    userData?.profile?.subscribed?.some(
      (id) => id.toString() === profileData._id.toString(),
    ),
  );
  const [loading, setLoading] = useState(false);

  const getAverageRating = () => {
    if (!myRecipes || myRecipes.length === 0) return "N/A";

    const allRatings = myRecipes.flatMap(
      (recipe) => recipe?.reviews?.map((rev) => rev.rating) || [],
    );

    if (allRatings.length === 0) return "0.0";

    const avgRating =
      allRatings.reduce((sum, rating) => sum + rating, 0) / allRatings.length;

    return avgRating.toFixed(1);
  };

  const stats = [
    {
      label: "Subscribers",
      value: profileData?.chefProfile?.subscribers?.length || 0,
    },
    {
      label: "Recipes",
      value: myRecipes.length || 0,
    },
    {
      label: "Chef Type",
      value:
        profileData?.chefProfile?.subscriptionPrice > 0 ? "Premium" : "Free",
    },
    {
      label: "Recipe Rating",
      value: getAverageRating(),
    },
  ];

  function modifyCloudinaryURL(url) {
    if (url === "" || url === null) return "";
    if (import.meta.env.VITE_IMAGE_TRANSFORMATION === "true") {
      return url.replace(
        "/upload/",
        "/upload/ar_1:1,c_auto,g_auto,w_500/r_max/",
      );
    }
    return url;
  }

  const subscribeToggle = async () => {
    setLoading(true);
    if (!subscribed) {
      const res = await subscribeApi(profileData._id.toString());
      if (res.success) {
        setSubscribed(!subscribed);
      }
    } else {
      const res = await unsubscribeApi(profileData._id.toString());
      if (res.success) {
        setSubscribed(!subscribed);
      }
    }
    setLoading(false);
  };

  return (
    <>
      {isOwnProfile && (
        <>
          <EditChefProfileDialog profileData={userData} />
          <ChangePasswordDialog />
        </>
      )}
      <HomeLayout>
        <div className="min-h-screen bg-linear-to-br from-orange-50 via-rose-50 to-amber-50">
          <div className="container mx-auto px-4 py-10">
            {/* Banner */}
            <div className="relative mb-20">
              <div className="w-full h-64 sm:h-80 lg:h-88 rounded-3xl overflow-hidden shadow-2xl border border-orange-100">
                <img
                  src="https://res.cloudinary.com/dpoqek1ce/image/upload/photo-1504674900247-0877df9cc836_cnclaj.jpg"
                  alt="banner"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent"></div>
              </div>
              <div className="absolute -bottom-16 left-6 sm:left-12">
                <div className="avatar">
                  <div className="w-32 h-32 sm:w-36 sm:h-36 rounded-full ring-4 ring-orange-200 ring-offset-2">
                    {profileData?.profile?.avatar ? (
                      <img
                        alt="Profile Avatar"
                        src={modifyCloudinaryURL(
                          profileData?.profile?.avatar?.secure_url || "",
                        )}
                      />
                    ) : (
                      <div className="bg-orange-100 flex items-center justify-center text-2xl font-semibold text-orange-500">
                        {profileData?.profile?.name?.charAt(0)}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Info */}
            <div className="mt-20 mb-10 flex flex-col md:flex-row md:items-start md:justify-between gap-8">
              <div className="space-y-6 max-w-3xl flex-1">
                {/* Name & Bio */}
                <div>
                  <h1 className="text-3xl sm:text-4xl font-extrabold bg-linear-to-r from-orange-400 via-red-400 to-amber-400 bg-clip-text text-transparent">
                    {profileData?.profile?.name}
                  </h1>
                  <p className="text-gray-600 text-lg leading-relaxed">
                    {profileData?.profile?.bio || "No bio available."}
                  </p>
                </div>

                {/* Specialty & Links */}
                <div className="flex flex-wrap gap-6">
                  <div className="flex flex-col gap-1.5">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                      Specializes In
                    </span>
                    <div className="badge badge-lg h-auto py-2 px-4 gap-2 bg-orange-50 border-orange-200 text-orange-700 shadow-sm rounded-xl">
                      <FaUtensils className="w-3 h-3" />
                      <span className="font-bold text-base">
                        {profileData?.profile?.cuisine || "Multi-Cuisine"}
                      </span>
                    </div>
                  </div>

                  {/* External Links */}
                  {profileData?.chefProfile?.externalLinks?.length > 0 && (
                    <div className="flex flex-col gap-1.5">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1">
                        <FaLink /> Connect
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {profileData.chefProfile.externalLinks.map(
                          (link, index) => (
                            <a
                              key={index}
                              href={link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="badge badge-lg h-auto py-2 px-3 gap-2 bg-white border-gray-200 text-gray-600 hover:border-orange-300 hover:text-orange-600 transition-colors shadow-sm cursor-pointer rounded-xl"
                            >
                              <FaGlobe className="w-3 h-3" />
                              <span className="font-medium text-sm">
                                {new URL(link).hostname.replace("www.", "")}
                              </span>
                            </a>
                          ),
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Joined & Subs */}
                <div className="flex flex-wrap items-center gap-6 pt-4 border-t border-orange-100/60">
                  <div className="flex items-center gap-2 text-sm font-medium text-gray-500">
                    <div className="p-1.5 bg-orange-100 rounded-full text-orange-500">
                      <FaCalendarAlt className="w-3 h-3" />
                    </div>
                    <span>
                      Joined{" "}
                      {new Date(profileData.createdAt).toLocaleDateString(
                        "en-IN",
                        {
                          month: "long",
                          year: "numeric",
                        },
                      )}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-sm font-medium text-gray-500">
                    <div className="p-1.5 bg-rose-100 rounded-full text-rose-500">
                      <FaUsers className="w-3 h-3" />
                    </div>
                    <span>
                      <strong className="text-gray-800">
                        {profileData?.chefProfile?.subscribers?.length || 0}
                      </strong>{" "}
                      Subscribers
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3 w-full md:w-auto shrink-0 min-w-[200px]">
                {isOwnProfile ? (
                  <>
                    {/* Edit Profile */}
                    <button
                      onClick={() =>
                        document
                          .getElementById("edit-chef-profile")
                          ?.showModal()
                      }
                      className="btn btn-primary bg-linear-to-r from-orange-500 to-red-500 border-none text-white font-bold shadow-lg hover:shadow-orange-200 transition-all rounded-2xl w-full"
                    >
                      <FaEdit className="w-4 h-4" />
                      Edit Profile
                    </button>

                    {/* Change Password */}
                    <button
                      onClick={() =>
                        document.getElementById("change-password")?.showModal()
                      }
                      className="btn btn-outline border-orange-200 hover:border-orange-400 hover:bg-orange-50 text-gray-700 font-bold transition-all rounded-2xl w-full flex gap-2 items-center justify-center"
                    >
                      <FaLock className="w-3.5 h-3.5 text-orange-500" />
                      Change Password
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => subscribeToggle()}
                    disabled={loading}
                    className={`btn gap-2 ${
                      subscribed
                        ? "btn-outline border-orange-400 text-orange-600 hover:bg-orange-50"
                        : "bg-linear-to-r from-orange-400 to-red-500 text-white border-none"
                    }`}
                  >
                    <FaHeart
                      className={subscribed ? "text-rose-500" : "text-white"}
                    />
                    {subscribed
                      ? "Unsubscribe"
                      : `Subscribe • $${profileData?.chefProfile?.subscriptionPrice}`}
                  </button>
                )}
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
              {stats.map((stat, i) => (
                <div
                  key={i}
                  className="card bg-base-100 shadow-sm border border-orange-100"
                >
                  <div className="card-body items-center text-center p-4">
                    <div className="card-title text-2xl text-gray-800">
                      {stat.value}
                    </div>
                    <div className="text-sm text-gray-500">{stat.label}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Professional Info Card */}
            {(profileData?.chefProfile?.education?.length > 0 ||
              profileData?.chefProfile?.experience?.length > 0) && (
              <div className="card bg-white shadow-xl border border-orange-100 overflow-hidden mb-10">
                {/* Decorative Gradient */}
                <div className="h-1.5 bg-linear-to-r from-orange-400 via-red-400 to-amber-400"></div>

                <div className="card-body p-6 sm:p-8">
                  {/* Header */}
                  <h3 className="text-xl font-bold text-gray-800 flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-500 shadow-sm">
                      <FaBriefcase className="w-5 h-5" />
                    </div>
                    Professional Background
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Education */}
                    {profileData?.chefProfile?.education?.length > 0 && (
                      <div className="group">
                        <h4 className="font-bold text-gray-400 uppercase tracking-widest text-xs flex items-center gap-2 mb-4">
                          <FaGraduationCap className="text-orange-400 w-4 h-4" />
                          Education & Certifications
                        </h4>

                        <div className="pl-4 border-l-4 border-orange-200 group-hover:border-orange-400 transition-colors space-y-3">
                          {profileData.chefProfile.education.map(
                            (edu, index) => (
                              <p
                                key={`edu-${index}`}
                                className="text-gray-700 text-sm font-medium leading-relaxed"
                              >
                                {edu}
                              </p>
                            ),
                          )}
                        </div>
                      </div>
                    )}

                    {/* Experience */}
                    {profileData?.chefProfile?.experience?.length > 0 && (
                      <div className="group">
                        <h4 className="font-bold text-gray-400 uppercase tracking-widest text-xs flex items-center gap-2 mb-4">
                          <FaBriefcase className="text-amber-400 w-4 h-4" />
                          Work Experience
                        </h4>

                        <div className="pl-4 border-l-4 border-amber-200 group-hover:border-amber-400 transition-colors space-y-3">
                          {profileData.chefProfile.experience.map(
                            (exp, index) => (
                              <p
                                key={`exp-${index}`}
                                className="text-gray-700 text-sm font-medium leading-relaxed whitespace-pre-line"
                              >
                                {exp}
                              </p>
                            ),
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Recipes */}
            <div className="card bg-base-100 shadow">
              <div className="card-body p-0">
                <h3 className="card-title text-gray-800 pt-5 pl-5">
                  <FaUtensils className="text-orange-500" />
                  Recipes by {profileData?.profile?.name}
                </h3>
                {myRecipes.length ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {myRecipes.map((recipe, idx) => (
                      <div className="flex justify-center" key={idx}>
                        <RecipeCard
                          key={recipe._id.toString()}
                          recipe={recipe}
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-10 text-gray-500">
                    No recipes yet
                  </div>
                )}
              </div>
            </div>

            {/* Reviews */}
            <div className="card bg-base-100 shadow mt-8">
              <div className="card-body">
                <h3 className="card-title">What Subscribers Say</h3>
                <div className="space-y-4">
                  {profileData?.chefProfile?.reviews.slice(0, 3).map((rev) => (
                    <div
                      key={rev._id.toString()}
                      className="border-b border-orange-50 pb-3 last:border-b-0"
                    >
                      <div className="flex items-center gap-2">
                        <FaStar className="text-yellow-400" />
                        <span className="font-semibold">{rev.name}</span>
                      </div>
                      <p className="text-gray-600 text-sm mt-1">
                        {rev.message}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Only visible to the chef themselves */}
            {isOwnProfile && (
              <>
                <div className="card glass border mt-4 border-orange-100 shadow-md hover:shadow-orange-300/60 mb-8">
                  <div className="card-body">
                    <ProfileStats profileData={profileData} />
                  </div>
                </div>

                <div className="card glass border border-orange-100 shadow-md hover:shadow-orange-300/60 mb-8">
                  <div className="card-body">
                    <ProfileTabs profileData={profileData} />
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </HomeLayout>
    </>
  );
}

export default ChefProfile;
