import { useState } from "react";
import {
  FaArrowRight,
  FaCrown,
  FaEye,
  FaRegClock,
  FaUserMinus,
  FaUsers,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function ProfileTabs({ profileData }) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("subscribed");
  
  // --- ADDED: Pagination State for Reviews Given ---
  const [reviewPage, setReviewPage] = useState(1);

  const tabs = [
    { key: "subscribed", label: "Subscribed", icon: FaUsers },
    { key: "reviews", label: "Reviews Given", icon: FaRegClock },
  ];

  // --- ADDED: Review Pagination Logic ---
  const REVIEWS_PER_PAGE = 4;
  const reviewsList = profileData?.reviewsGiven || [];
  const totalReviewPages = Math.ceil(reviewsList.length / REVIEWS_PER_PAGE);
  const currentReviews = reviewsList.slice(
    (reviewPage - 1) * REVIEWS_PER_PAGE,
    reviewPage * REVIEWS_PER_PAGE
  );

  return (
    <div className="w-full">
      <div className="flex flex-wrap justify-center mb-8 gap-3">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
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

      {/* --- Tab Contents --- */}
      <div className="space-y-8 ">
        {/* Subscribed Tab */}
        {activeTab === "subscribed" && (
          <div className="space-y-6">
            {profileData?.profile?.subscribed?.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {profileData?.profile?.subscribed?.map((chef) => (
                  <div
                    key={chef._id.toString()}
                    className="card bg-base-100 shadow-lg border border-orange-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group"
                  >
                    <div className="card-body p-6">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                        <div className="avatar">
                          <div className="w-16 h-16 rounded-full ring-4 ring-orange-200 ring-offset-2">
                            <img
                              src={chef.profile.avatar.secure_url}
                              alt={chef.profile.name}
                              className="object-cover"
                            />
                          </div>
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2 mb-2">
                            <h4 className="text-lg font-bold text-gray-800 truncate">
                              {chef.profile.name}
                            </h4>
                            {chef.isPremium && (
                              <span className="badge bg-linear-to-r from-yellow-500 to-orange-500 text-white border-0 flex items-center gap-1">
                                <FaCrown className="w-3 h-3" /> Premium
                              </span>
                            )}
                          </div>

                          <p className="text-gray-600 line-clamp-2 mb-3 text-sm">
                            {chef.profile.bio}
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
                            View
                          </button>
                          <button
                            className="btn btn-sm border-red-200 bg-red-50 text-red-600 hover:bg-red-100 hover:border-red-300 gap-2"
                            onClick={() =>
                              navigate(`/profile/${chef._id.toString()}`)
                            }
                          >
                            <FaUserMinus className="w-3 h-3" />
                            Unsubscribe
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

        {/* Reviews Tab */}
        {activeTab === "reviews" && (
          <div className="space-y-6">
            {reviewsList.length > 0 ? (
              <>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* CHANGED: Now mapping over currentReviews instead of profileData.reviewsGiven */}
                  {currentReviews.map((review) => {
                    const isRecipeReview = review.targetType === "RECIPE";

                    return (
                      <div
                        key={review._id.toString()}
                        className="card bg-base-100 shadow-lg border border-orange-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                      >
                        <div className="card-body p-6">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                            <div className="flex items-center gap-3">
                              <div className="rating rating-sm">
                                {[...Array(5)].map((_, i) => (
                                  <input
                                    key={i}
                                    type="radio"
                                    className="mask mask-star-2 bg-orange-500"
                                    checked={i < review.rating}
                                    readOnly
                                  />
                                ))}
                              </div>

                              <span className="text-lg font-semibold text-orange-600">
                                {review.rating}
                              </span>

                              <span
                                className={`badge ${
                                  isRecipeReview
                                    ? "badge-warning text-white"
                                    : "badge-info text-white"
                                }`}
                              >
                                {review.targetType}
                              </span>
                            </div>

                            <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                              {new Date(review.createdAt).toLocaleDateString(
                                "en-US",
                                {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                }
                              )}
                            </span>
                          </div>

                          <div className="mb-6">
                            <p className="text-gray-700 leading-relaxed text-lg">
                              "{review.message}"
                            </p>
                          </div>

                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-4 border-t border-orange-100">
                            <button
                              className="btn btn-ghost text-orange-600 gap-2 hover:bg-orange-50 self-start"
                              onClick={() =>
                                navigate(
                                  isRecipeReview
                                    ? `/recipe/${review.targetId}`
                                    : `/profile/${review.targetId}`
                                )
                              }
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

                {/* --- ADDED: Pagination Controls --- */}
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
              <div className="card bg-base-100 shadow-xl border border-orange-100">
                <div className="card-body text-center py-16">
                  <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-orange-50 flex items-center justify-center">
                    <FaRegClock className="w-12 h-12 text-orange-400" />
                  </div>
                  <h4 className="text-2xl font-bold text-gray-800 mb-3">
                    No reviews yet
                  </h4>
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