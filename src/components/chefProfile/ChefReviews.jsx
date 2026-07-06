import { useEffect, useState } from "react";
import { FaArrowRight, FaSearch, FaStar } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { fetchReviewsReceived } from "../../redux/slices/profileSlice";

function ChefReviews() {
  const navigate = useNavigate();
  const { _id, reviewsReceived } = useSelector((state) => state.profile);
  const dispatch = useDispatch();
  const [reviewPage, setReviewPage] = useState(1);

  useEffect(() => {
    dispatch(fetchReviewsReceived({ userId: _id, page: reviewPage, limit: 4 }));
  }, [reviewPage]);

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

  return (
    <div className="card bg-white shadow-xl border border-orange-100 mt-10 overflow-hidden">
      <div className="h-1.5 bg-linear-to-r from-orange-400 via-red-400 to-amber-400"></div>

      <div className="card-body p-6 sm:p-8">
        <h3 className="text-xl font-bold text-gray-800 flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-500 shadow-sm">
            <FaStar className="w-5 h-5" />
          </div>

          <div>
            <p>What People Say</p>

            {reviewsReceived?.meta?.totalReviews > 0 && (
              <p className="text-sm font-normal text-gray-500 mt-1">
                {reviewsReceived.meta.totalReviews} Reviews
              </p>
            )}
          </div>
        </h3>

        {reviewsReceived.loading ? (
          <div className="card bg-base-100 shadow-xl border border-orange-100">
            <div className="card-body text-center py-16">
              <div className="loading loading-spinner loading-lg text-orange-500 mx-auto mb-4"></div>

              <p className="text-gray-500">Loading reviews...</p>
            </div>
          </div>
        ) : reviewsReceived.reviews.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {reviewsReceived.reviews.map((review) => (
                <div
                  key={review._id}
                  className="card bg-base-100 shadow-lg border border-orange-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="card-body p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                      <div className="flex items-center gap-3">
                        <div className="avatar">
                          <div className="w-12 h-12 rounded-full overflow-hidden bg-orange-100 border border-orange-200">
                            {review?.userId?.profile?.avatar?.secure_url ? (
                              <img
                                src={modifyCloudinaryURL(
                                  review.userId.profile.avatar.secure_url,
                                )}
                                alt={review?.userId?.profile?.name || "User"}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-orange-500 font-bold">
                                {(review?.userId?.profile?.name || "A").charAt(
                                  0,
                                )}
                              </div>
                            )}
                          </div>
                        </div>

                        <h4 className="font-bold text-gray-800">
                          {review?.userId?.profile?.name}
                        </h4>
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
                        onClick={() =>
                          review?.userId?._id &&
                          navigate(`/profile/${review.userId._id}`)
                        }
                      >
                        View Profile
                        <FaArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {reviewsReceived.meta.totalPages > 1 && (
              <div className="flex justify-between items-center mt-6 pt-4">
                <button
                  disabled={reviewPage === 1}
                  onClick={() => setReviewPage((prev) => prev - 1)}
                  className="btn btn-sm btn-outline border-orange-200 text-orange-600 hover:bg-orange-50 disabled:opacity-50 rounded-xl px-4 py-2"
                >
                  Previous
                </button>

                <span className="text-sm font-semibold text-gray-600">
                  Page {reviewsReceived.meta.page} of{" "}
                  {reviewsReceived.meta.totalPages}
                </span>

                <button
                  disabled={reviewPage === reviewsReceived.meta.totalPages}
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
                No reviews yet
              </h4>

              <p className="text-gray-500 max-w-md mx-auto">
                Reviews for this chef will appear here.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ChefReviews;
