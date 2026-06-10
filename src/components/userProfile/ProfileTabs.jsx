import { useEffect, useState } from "react";
import {
  FaArrowRight,
  FaCrown,
  FaEye,
  FaRegClock,
  FaSearch,
  FaStar,
  FaUsers,
} from "react-icons/fa";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import getReviewsGivenApi from "../../apis/user/getReviewsGivenApi";

function ProfileTabs({ profileData }) {
  const navigate = useNavigate();
  const { userData } = useSelector((state) => state.auth);

  const isOwnProfile =
    userData?._id?.toString() === profileData?._id?.toString();

  const [activeTab, setActiveTab] = useState(
    profileData?.role === "CHEF" ? "subscribers" : "subscribed",
  );

  const [reviewPage, setReviewPage] = useState(1);
  const [reviewsGiven, setReviewsGiven] = useState([]);
  const [reviewsMeta, setReviewsMeta] = useState({
    page: 1,
    limit: 4,
    totalReviews: 0,
    totalPages: 0,
  });
  const [loadingReviews, setLoadingReviews] = useState(false);

  function modifyCloudinaryURL(url) {
    if (!url) return "";
    if (import.meta.env.VITE_IMAGE_TRANSFORMATION === "true") {
      return url.replace(
        "/upload/",
        "/upload/ar_1:1,c_auto,g_auto,w_500/r_max/",
      );
    }
    return url;
  }

  const tabs = [
    profileData?.role === "CHEF" && {
      key: "subscribers",
      label: "Subscribers",
      icon: FaUsers,
    },
    { key: "subscribed", label: "Subscribed", icon: FaUsers },
    {
      key: "reviews",
      label: "Reviews Given",
      icon: FaRegClock,
    },
  ].filter(Boolean);

  useEffect(() => {
    if (activeTab !== "reviews" || !isOwnProfile) return;

    const fetchReviews = async () => {
      try {
        setLoadingReviews(true);
        const response = await getReviewsGivenApi(reviewPage, 4);

        setReviewsGiven(response?.data?.reviewsGiven);
        setReviewsMeta(response?.data?.meta);
      } catch (error) {
        console.error("Failed to fetch reviews given:", error);
        setReviewsGiven([]);
        setReviewsMeta({
          page: reviewPage,
          limit: 4,
          totalReviews: 0,
          totalPages: 0,
        });
      } finally {
        setLoadingReviews(false);
      }
    };

    fetchReviews();
  }, [activeTab, reviewPage, isOwnProfile]);

  const totalReviewPages = reviewsMeta?.totalPages || 0;

  return (
    <div className="w-full">
      <div className="flex flex-wrap justify-center mb-8 gap-3">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;

          return (
            <button
              key={tab.key}
              onClick={() => {
                setActiveTab(tab.key);
                if (tab.key === "reviews") setReviewPage(1);
              }}
              className={`btn gap-2 rounded-xl font-semibold transition-all duration-300 min-w-[120px] ${
                isActive
                  ? "bg-linear-to-r from-orange-400 to-red-500 text-white shadow-lg scale-105"
                  : "btn-ghost text-gray-700 border border-orange-100 hover:bg-orange-50"
              }`}
            >
              <Icon
                className={`w-4 h-4 ${
                  isActive ? "text-white" : "text-orange-500"
                }`}
              />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      <div className="space-y-8">
        {activeTab === "subscribers" && (
          <div className="space-y-6">
            {profileData?.chefProfile?.subscribers?.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {profileData.chefProfile.subscribers.map((user) => (
                  <div
                    key={user._id.toString()}
                    className="card bg-base-100 shadow-lg border border-orange-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group"
                  >
                    <div className="card-body p-6">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                        <div className="avatar">
                          <div className="w-16 h-16 rounded-full ring-4 ring-orange-200 ring-offset-2 overflow-hidden">
                            {user?.profile?.avatar?.secure_url ? (
                              <img
                                src={modifyCloudinaryURL(
                                  user.profile.avatar.secure_url,
                                )}
                                alt={user?.profile?.name || "User"}
                                className="object-cover w-full h-full"
                              />
                            ) : (
                              <div className="w-full h-full bg-orange-100 flex items-center justify-center text-orange-500 font-bold">
                                {(user?.profile?.name || "U").charAt(0)}
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2 mb-2">
                            <h4 className="text-lg font-bold text-gray-800 truncate">
                              {user?.profile?.name}
                            </h4>
                          </div>

                          <p className="text-gray-600 line-clamp-2 mb-3 text-sm">
                            {user?.profile?.bio || "No bio available."}
                          </p>
                        </div>

                        <div className="flex flex-col gap-2 sm:items-end">
                          <button
                            className="btn btn-sm btn-outline border-orange-300 text-orange-600 hover:bg-orange-50 gap-2"
                            onClick={() =>
                              navigate(`/profile/${user._id.toString()}`)
                            }
                          >
                            <FaEye className="w-3 h-3" />
                            View Profile
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="card bg-base-100 shadow-xl border border-orange-100">
                <div className="card-body text-center py-16">
                  <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-orange-50 flex items-center justify-center">
                    <FaUsers className="w-12 h-12 text-orange-400" />
                  </div>
                  <h4 className="text-2xl font-bold text-gray-800 mb-3">
                    No subscribers yet
                  </h4>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === "subscribed" && (
          <div className="space-y-6">
            {profileData?.profile?.subscribed?.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {profileData.profile.subscribed.map((chef) => (
                  <div
                    key={chef._id.toString()}
                    className="card bg-base-100 shadow-lg border border-orange-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group"
                  >
                    <div className="card-body p-6">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                        <div className="avatar">
                          <div className="w-16 h-16 rounded-full ring-4 ring-orange-200 ring-offset-2 overflow-hidden">
                            {chef?.profile?.avatar?.secure_url ? (
                              <img
                                src={modifyCloudinaryURL(
                                  chef.profile.avatar.secure_url,
                                )}
                                alt={chef?.profile?.name || "Chef"}
                                className="object-cover w-full h-full"
                              />
                            ) : (
                              <div className="w-full h-full bg-orange-100 flex items-center justify-center text-orange-500 font-bold">
                                {(chef?.profile?.name || "C").charAt(0)}
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2 mb-2">
                            <h4 className="text-lg font-bold text-gray-800 truncate">
                              {chef?.profile?.name}
                            </h4>
                            {chef?.isPremium && (
                              <span className="badge bg-linear-to-r from-yellow-500 to-orange-500 text-white border-0 flex items-center gap-1">
                                <FaCrown className="w-3 h-3" /> Premium
                              </span>
                            )}
                          </div>

                          <p className="text-gray-600 line-clamp-2 mb-3 text-sm">
                            {chef?.profile?.bio || "No bio available."}
                          </p>
                        </div>

                        <div className="flex flex-col gap-2 sm:items-end">
                          <button
                            className="btn btn-sm btn-outline border-orange-300 text-orange-600 hover:bg-orange-50 gap-2"
                            onClick={() =>
                              navigate(`/profile/${chef._id.toString()}`)
                            }
                          >
                            <FaEye className="w-3 h-3" />
                            View Profile
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="card bg-base-100 shadow-xl border border-orange-100">
                <div className="card-body text-center py-16">
                  <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-orange-50 flex items-center justify-center">
                    <FaUsers className="w-12 h-12 text-orange-400" />
                  </div>
                  <h4 className="text-2xl font-bold text-gray-800 mb-3">
                    Not subscribed to any chefs
                  </h4>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === "reviews" && isOwnProfile && (
          <div className="space-y-6">
            {loadingReviews ? (
              <div className="card bg-base-100 shadow-xl border border-orange-100">
                <div className="card-body text-center py-16">
                  <div className="loading loading-spinner loading-lg text-orange-500 mx-auto mb-4"></div>
                  <p className="text-gray-500">Loading reviews given...</p>
                </div>
              </div>
            ) : reviewsGiven.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {reviewsGiven.map((review) => {
                    const isRecipeReview = review.targetType === "Recipe";
                    const target = review?.targetId || {};
                    const targetName =
                      target?.profile?.name || target?.title || "Unknown";
                    const targetImage =
                      target?.profile?.avatar?.secure_url ||
                      target?.thumbnail?.secure_url ||
                      "";
                    const targetLink = isRecipeReview
                      ? `/recipe/${target?._id}`
                      : `/profile/${target?._id}`;

                    return (
                      <div
                        key={review._id.toString()}
                        className="card bg-base-100 shadow-lg border border-orange-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                      >
                        <div className="card-body p-6">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                            <div className="flex items-center gap-3">
                              <div className="avatar">
                                <div className="w-12 h-12 rounded-full overflow-hidden bg-orange-100 border border-orange-200">
                                  {targetImage ? (
                                    <img
                                      src={modifyCloudinaryURL(targetImage)}
                                      alt={targetName}
                                      className="w-full h-full object-cover"
                                    />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center text-orange-500 font-bold">
                                      {targetName.charAt(0)}
                                    </div>
                                  )}
                                </div>
                              </div>

                              <div>
                                <h4 className="font-bold text-gray-800">
                                  {targetName}
                                </h4>
                                <span
                                  className={`badge badge-sm ${
                                    isRecipeReview
                                      ? "badge-warning text-white"
                                      : "badge-info text-white"
                                  }`}
                                >
                                  {review.targetType}
                                </span>
                              </div>
                            </div>

                            <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                              {review.createdAt
                                ? new Date(review.createdAt).toLocaleDateString(
                                    "en-IN",
                                    {
                                      year: "numeric",
                                      month: "short",
                                      day: "numeric",
                                    },
                                  )
                                : ""}
                            </span>
                          </div>

                          <div className="mb-4">
                            <div className="flex items-center gap-1 mb-2">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <FaStar
                                  key={i}
                                  className={`w-4 h-4 ${
                                    i < (review.rating || 0)
                                      ? "text-yellow-400"
                                      : "text-gray-200"
                                  }`}
                                />
                              ))}
                              <span className="ml-2 text-sm font-semibold text-gray-600">
                                {review.rating}/5
                              </span>
                            </div>

                            <p className="text-gray-700 leading-relaxed text-base">
                              {review.message}
                            </p>
                          </div>

                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-4 border-t border-orange-100">
                            <button
                              className="btn btn-ghost text-orange-600 gap-2 hover:bg-orange-50 self-start"
                              onClick={() => navigate(targetLink)}
                            >
                              {isRecipeReview ? "View Recipe" : "View Chef"}
                              <FaArrowRight className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {totalReviewPages > 1 && (
                  <div className="flex justify-between items-center mt-6 pt-4">
                    <button
                      disabled={reviewPage === 1}
                      onClick={() => setReviewPage((prev) => prev - 1)}
                      className="btn btn-sm btn-outline border-orange-200 text-orange-600 hover:bg-orange-50 disabled:opacity-50 rounded-xl px-4 py-2"
                    >
                      Previous
                    </button>

                    <span className="text-sm font-semibold text-gray-600">
                      Page {reviewsMeta.page} of {totalReviewPages}
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
              <div className="card bg-base-100 shadow-xl border border-orange-100">
                <div className="card-body text-center py-16">
                  <div className="relative w-24 h-24 mx-auto mb-6">
                    <div className="absolute inset-0 bg-orange-100 rounded-full animate-ping opacity-20"></div>
                    <div className="absolute inset-0 bg-orange-50 rounded-full flex items-center justify-center shadow-inner">
                      <FaSearch className="w-10 h-10 text-orange-300" />
                    </div>
                  </div>
                  <h4 className="text-2xl font-bold text-gray-800 mb-3">
                    No reviews given yet
                  </h4>
                  <p className="text-gray-500 max-w-md mx-auto">
                    Reviews you submit will appear here.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default ProfileTabs;
