import { useState } from "react";
import {
  FaBriefcase,
  FaCalendarAlt,
  FaEdit,
  FaGlobe,
  FaGraduationCap,
  FaHeart,
  FaLink,
  FaLock,
  FaRupeeSign,
  FaStar,
  FaUsers,
  FaUtensils,
} from "react-icons/fa";
import { GiTakeMyMoney } from "react-icons/gi";
import { useDispatch, useSelector } from "react-redux";

import createSubscriptionApi from "../../apis/user/createSubscriptionApi";
import ConfirmSubscriptionDialog from "../../components/chefProfile/ConfirmSubscriptionDialog";
import EditChefProfileDialog from "../../components/chefProfile/editChefProfileDialog";
import RecipeCard from "../../components/recipe/RecipeCard";
import ChangePasswordDialog from "../../components/userProfile/ChangePasswordDialog";
import ProfileStats from "../../components/userProfile/ProfileStats";
import ProfileTabs from "../../components/userProfile/ProfileTabs";
import HomeLayout from "../../layouts/HomeLayout";
import { getProfile } from "../../redux/slices/authSlice";

function ChefProfile({ profileData }) {
  const { userData } = useSelector((state) => state.auth);
  const isOwnProfile = userData?._id.toString() === profileData?._id.toString();
  const dispatch = useDispatch();
  const [subscribed, setSubscribed] = useState(
    userData?.profile?.subscribed?.some(
      (id) => id.toString() === profileData._id.toString(),
    ),
  );
  const [loading, setLoading] = useState(false);
  
  // --- ADDED: Pagination State for Reviews ---
  const [reviewPage, setReviewPage] = useState(1);

  const subscribe = async () => {
    setLoading(true);
    if (!subscribed) {
      const subscription = await createSubscriptionApi({
        chefId: profileData._id,
      });

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY,
        subscription_id: subscription.data.id,
        name: "Bitezzy",
        description: `Subscription to ${profileData.profile.name}`,
        theme: {
          color: "#f97316",
        },
        prefill: {
          name: userData.profile.name,
          email: userData.email,
          contact: "+91",
        },
        handler: async function () {
          setSubscribed(true);
          await dispatch(getProfile());
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    }
    setLoading(false);
  };

  const getAverageRating = () => {
    if (!profileData?.recipes || profileData.recipes.length === 0) return "N/A";

    const allRatings = profileData.recipes.flatMap(
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
      value: profileData?.recipes?.length || 0,
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

  // --- ADDED: Review Pagination Logic ---
  const REVIEWS_PER_PAGE = 4;
  const reviewsList = profileData?.chefProfile?.reviews || [];
  const totalReviewPages = Math.ceil(reviewsList.length / REVIEWS_PER_PAGE);
  const currentReviews = reviewsList.slice(
    (reviewPage - 1) * REVIEWS_PER_PAGE,
    reviewPage * REVIEWS_PER_PAGE
  );

  return (
    <>
      {isOwnProfile && (
        <>
          <EditChefProfileDialog profileData={userData} />
          <ChangePasswordDialog />
        </>
      )}
      <ConfirmSubscriptionDialog
        profileData={profileData}
        loading={loading}
        onConfirm={subscribe}
      />
      <HomeLayout>
        <div className="min-h-screen bg-linear-to-br from-orange-50 via-rose-50 to-amber-50 md:mx-10">
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
                      <span className="font-bold text-base uppercase">
                        {profileData?.chefProfile?.speciality || "-"}
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

                {/* My Subscription Price */}
                {isOwnProfile && (
                  <div className="mt-4 flex flex-col gap-3">
                    <span className="text-sm font-bold text-gray-400 uppercase tracking-widest flex gap-2">
                      <GiTakeMyMoney className="w-6 h-6" />
                      My Subscription Price
                    </span>
                    <div className="badge badge-lg bg-orange-50 border-orange-200 text-orange-700">
                      <FaRupeeSign className="w-3 h-3" />
                      {profileData?.chefProfile?.subscriptionPrice || 0} / month
                    </div>
                  </div>
                )}
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
                    onClick={() =>
                      !subscribed &&
                      document
                        .getElementById("confirm-subscription")
                        ?.showModal()
                    }
                    disabled={loading}
                    className={`btn gap-2 ${
                      subscribed
                        ? "btn-outline border-orange-400 text-orange-600 hover:bg-orange-50"
                        : "bg-linear-to-r from-orange-400 to-red-500 text-white border-none"
                    }`}
                  >
                    <FaHeart
                      className={
                        subscribed
                          ? "text-rose-500 w-5 h-5"
                          : "text-white w-5 h-5"
                      }
                    />

                    {subscribed ? "Subscribed" : "Subscribe"}
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

            {/* Professional Background */}
            {(profileData?.chefProfile?.education?.length > 0 ||
              profileData?.chefProfile?.experience?.length > 0) && (
              <div className="card bg-white shadow-xl border border-orange-100 overflow-hidden mb-10">
                <div className="h-1.5 bg-linear-to-r from-orange-400 via-red-400 to-amber-400"></div>

                <div className="card-body p-6 sm:p-8">
                  <h3 className="text-xl font-bold text-gray-800 flex items-center gap-3 mb-8">
                    <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-500 shadow-sm">
                      <FaBriefcase className="w-5 h-5" />
                    </div>
                    Professional Background
                  </h3>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    {/* Education */}
                    {profileData?.chefProfile?.education?.length > 0 && (
                      <div>
                        <h4 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-orange-500 mb-5">
                          <FaGraduationCap />
                          Education & Certifications
                        </h4>

                        <div className="space-y-5">
                          {profileData.chefProfile.education.map((edu) => (
                            <div
                              key={edu._id}
                              className="relative pl-5 border-l-2 border-orange-200"
                            >
                              <div className="absolute -left-[7px] top-1 w-3 h-3 bg-orange-400 rounded-full"></div>

                              <h5 className="font-semibold text-gray-800">
                                {edu.degree}
                                {edu.fieldOfStudy && (
                                  <span className="text-gray-600">
                                    {" "}
                                    in {edu.fieldOfStudy}
                                  </span>
                                )}
                              </h5>

                              <p className="text-sm text-gray-600">
                                {edu.institution}
                              </p>

                              <p className="text-xs text-gray-500">
                                {edu.startYear} - {edu.endYear || "Present"}
                              </p>

                              {edu.description && (
                                <p className="text-sm text-gray-700 mt-2 leading-relaxed">
                                  {edu.description}
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Experience */}
                    {profileData?.chefProfile?.experience?.length > 0 && (
                      <div>
                        <h4 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-amber-500 mb-5">
                          <FaBriefcase />
                          Professional Experience
                        </h4>

                        <div className="space-y-5">
                          {profileData.chefProfile.experience.map((exp) => (
                            <div
                              key={exp._id}
                              className="relative pl-5 border-l-2 border-amber-200"
                            >
                              <div className="absolute -left-[7px] top-1 w-3 h-3 bg-amber-400 rounded-full"></div>

                              <div className="flex flex-wrap items-center gap-2">
                                <h5 className="font-semibold text-gray-800">
                                  {exp.title}
                                </h5>

                                {exp.employmentType && (
                                  <span className="badge badge-sm bg-amber-50 border-amber-200 text-amber-700">
                                    {exp.employmentType}
                                  </span>
                                )}
                              </div>

                              <p className="text-sm text-gray-600">
                                {exp.companyOrOrganization}
                              </p>

                              <p className="text-xs text-gray-500">
                                {exp.startYear} -{" "}
                                {exp.isCurrenltyWorking
                                  ? "Present"
                                  : exp.endYear || "Present"}
                              </p>

                              {exp.description && (
                                <p className="text-sm text-gray-700 mt-2 leading-relaxed">
                                  {exp.description}
                                </p>
                              )}
                            </div>
                          ))}
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
                {profileData?.recipes?.length ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {profileData.recipes.map((recipe, idx) => (
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

            {/* 🚨 REBUILT: Cool & Paginated Reviews Section 🚨 */}
            <div className="card bg-white shadow-xl border border-orange-100 mt-10 overflow-hidden">
              <div className="h-1.5 bg-linear-to-r from-orange-400 via-red-400 to-amber-400"></div>
              <div className="card-body p-6 sm:p-8">
                <h3 className="text-xl font-bold text-gray-800 flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-500 shadow-sm">
                    <FaStar className="w-5 h-5" />
                  </div>
                  What Subscribers Say
                </h3>

                {currentReviews.length > 0 ? (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {currentReviews.map((rev) => (
                        <div
                          key={rev._id.toString()}
                          className="bg-orange-50/50 rounded-2xl p-6 border border-orange-100 hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col"
                        >
                          <div className="flex items-center gap-3 mb-4">
                            <div className="avatar">
                              <div className="w-10 h-10 rounded-full bg-white border border-orange-200 overflow-hidden">
                                <img
                                  src={rev.userId?.profile?.avatar?.secure_url || `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(rev.name || "Anonymous")}`}
                                  alt={rev.userId?.profile?.name || "Subscriber"}
                                  loading="lazy"
                                />
                              </div>
                            </div>
                            <div>
                              <h4 className="font-bold text-gray-800 text-sm">
                                {rev.userId?.profile?.name || "Anonymous Subscriber"}
                              </h4>
                              <div className="flex gap-0.5 mt-0.5">
                                {Array.from({ length: 5 }).map((_, i) => (
                                  <FaStar
                                    key={i}
                                    className={`w-3 h-3 ${
                                      i < (rev.rating || 5)
                                        ? "text-yellow-400"
                                        : "text-gray-200"
                                    }`}
                                  />
                                ))}
                              </div>
                            </div>
                          </div>
                          <p className="text-gray-600 text-sm italic leading-relaxed grow">
                            "{rev.message}"
                          </p>
                          {rev.createdAt && (
                            <span className="text-xs text-gray-400 mt-4 block text-right font-medium">
                              {new Date(rev.createdAt).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Pagination Controls */}
                    {totalReviewPages > 1 && (
                      <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-100">
                        <button
                          disabled={reviewPage === 1}
                          onClick={() => setReviewPage((prev) => prev - 1)}
                          className="btn btn-sm btn-outline border-orange-200 text-orange-600 hover:bg-orange-50 disabled:opacity-50 rounded-xl px-4 py-2"
                        >
                          Previous
                        </button>
                        
                        <span className="text-sm font-semibold text-gray-600">
                          Page {reviewPage} of {totalReviewPages}
                        </span>
                        
                        <button
                          disabled={reviewPage === totalReviewPages}
                          onClick={() => setReviewPage((prev) => prev + 1)}
                          className="btn btn-sm btn-outline border-orange-200 text-orange-600 hover:bg-orange-50 disabled:opacity-50 rounded-xl px-4 py-2"
                        >
                          Next
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center py-10 text-gray-500 font-medium">
                    No subscriber reviews yet.
                  </div>
                )}
              </div>
            </div>

            {/* Only visible to the chef themselves */}
            {isOwnProfile && (
              <>
                <div className="card glass border mt-8 border-orange-100 shadow-md hover:shadow-orange-300/60 mb-8">
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