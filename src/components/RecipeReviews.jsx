import React, { useCallback, useEffect } from "react";
import { FaRegClock, FaStar, FaSyncAlt } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";

import { fetchRecipeReviews } from "../redux/slices/reviewSlice";

// Memoized Review Card
const ReviewCard = React.memo(({ review }) => {
  const formattedDate = new Date(review.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div
      className="card bg-base-100 w-full flex-col shadow-sm border border-base-200 hover:shadow-md hover:border-warning/50 transition-all duration-300 hover:-translate-y-1 p-5"
      role="article"
      aria-label={`Review by ${review.userId?.profile?.name || "Anonymous"}`}
    >
      <div className="flex items-center gap-3 mb-3">
        <div className="avatar">
          <div className="w-12 h-12 rounded-full ring ring-warning/30 ring-offset-base-100 ring-offset-2 overflow-hidden">
            <img
              src={
                review.userId?.profile?.avatar?.secure_url ||
                `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(
                  review.userId?.profile?.name || "Anonymous"
                )}`
              }
              alt={review.userId?.profile?.name || "Anonymous"}
              className="object-cover w-full h-full"
              loading="lazy"
            />
          </div>
        </div>
        <div>
          <h4 className="font-bold text-base-content text-sm">
            {review.userId?.profile?.name || "Anonymous"}
          </h4>
          <div className="flex items-center gap-1.5 mt-0.5">
            <div className="flex gap-0.5" aria-label={`Rating: ${review.rating} out of 5 stars`}>
              {Array.from({ length: 5 }).map((_, i) => (
                <FaStar
                  key={i}
                  className={`w-3.5 h-3.5 ${
                    i < Math.round(review.rating)
                      ? "text-warning"
                      : "text-base-300"
                  }`}
                />
              ))}
            </div>
            <span className="text-xs font-bold text-base-content/60 ml-1">
              {review.rating} / 5
            </span>
          </div>
        </div>
      </div>

      <p className="text-base-content/80 text-sm leading-relaxed grow line-clamp-3 mb-3 whitespace-pre-line">
        {review.message}
      </p>

      <div className="text-xs text-base-content/40 font-medium text-right mt-auto">
        {formattedDate}
      </div>
    </div>
  );
});

ReviewCard.displayName = "ReviewCard";

// Skeleton Loader Card
const SkeletonCard = React.memo(() => {
  return (
    <div className="card bg-base-100 w-full flex-col shadow-sm border border-base-200 p-5 min-h-[180px]">
      <div className="flex items-center gap-3 mb-3">
        <div className="skeleton w-12 h-12 rounded-full shrink-0"></div>
        <div className="space-y-2">
          <div className="skeleton h-4 w-32"></div>
          <div className="skeleton h-4 w-24"></div>
        </div>
      </div>
      <div className="space-y-2 grow mb-3">
        <div className="skeleton h-4 w-full"></div>
        <div className="skeleton h-4 w-5/6"></div>
        <div className="skeleton h-4 w-4/6"></div>
      </div>
      <div className="skeleton h-4 w-20 self-end mt-auto"></div>
    </div>
  );
});

SkeletonCard.displayName = "SkeletonCard";

const RecipeReviews = ({ recipeId }) => {
  const dispatch = useDispatch();

  // Pulling directly from the live Redux store
  const { reviews, loading, error, pagination } = useSelector(
    (state) => state.review
  );

  const { page, totalPages } = pagination || { page: 1, totalPages: 1 };

  const loadReviews = useCallback(
    (targetPage) => {
      if (!recipeId) return;
      dispatch(fetchRecipeReviews({ recipeId, page: targetPage, limit: 10 }));
    },
    [dispatch, recipeId]
  );

  useEffect(() => {
    loadReviews(1);
  }, [loadReviews]);

  const handlePrevPage = useCallback(() => {
    if (page > 1) loadReviews(page - 1);
  }, [page, loadReviews]);

  const handleNextPage = useCallback(() => {
    if (page < totalPages) loadReviews(page + 1);
  }, [page, totalPages, loadReviews]);

  const handleRetry = useCallback(() => {
    loadReviews(page);
  }, [page, loadReviews]);

  // Loading State
  if (loading) {
    return (
      <div className="card bg-base-100 shadow-lg border border-base-200 rounded-3xl p-6 flex flex-col grow w-full min-h-0">
        <h3 className="text-xl font-bold text-base-content mb-6 shrink-0">Recipe Reviews</h3>
        <div className="flex flex-col gap-4">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="card bg-base-100 shadow-lg border border-base-200 rounded-3xl p-6 flex flex-col grow w-full min-h-0">
        <h3 className="text-xl font-bold text-base-content mb-4 shrink-0">Recipe Reviews</h3>
        <div className="flex flex-col items-center justify-center py-10 text-center space-y-4 m-auto">
          <div className="text-error bg-error/10 p-4 rounded-full">
            <FaSyncAlt className="w-8 h-8 animate-spin" />
          </div>
          <h4 className="text-lg font-bold text-base-content">Failed to load reviews.</h4>
          <p className="text-sm text-base-content/60 max-w-sm">Please try again.</p>
          <button onClick={handleRetry} className="btn btn-sm btn-error text-white mt-2">
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Empty State
  if (!reviews?.reviews || reviews.reviews.length === 0) {
    return (
      <div className="card bg-base-100 shadow-lg border border-base-200 rounded-3xl p-6 flex flex-col grow w-full min-h-0">
        <h3 className="text-xl font-bold text-base-content mb-4 shrink-0">Recipe Reviews</h3>
        <div className="flex flex-col items-center justify-center text-center py-10 space-y-4 m-auto">
          <div className="bg-warning/10 p-5 rounded-full text-warning">
            <FaRegClock className="text-5xl" />
          </div>
          <h4 className="text-2xl font-bold text-base-content">No reviews yet</h4>
          <p className="text-base-content/60 max-w-md">
            Be the first person to review this recipe.
          </p>
        </div>
      </div>
    );
  }

  // Standard Loaded State
  return (
    <div className="card bg-base-100 shadow-lg border border-base-200 rounded-xl p-6 flex flex-col grow w-full min-h-0">
      <h3 className="text-xl font-bold text-base-content mb-6 shrink-0">Recipe Reviews</h3>

      <div className="flex flex-col gap-4 flex-1 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-warning/40 scrollbar-track-transparent min-h-0 pb-2">
        {reviews.reviews.map((review) => (
          <ReviewCard key={review._id} review={review} />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-6 pt-4 border-t border-base-200 shrink-0">
          <span className="text-sm font-semibold text-base-content/60">
            Page {page} of {totalPages}
          </span>

          {/* DaisyUI Join Component for Pagination */}
          <div className="join">
            <button
              disabled={page === 1}
              onClick={handlePrevPage}
              className="join-item btn btn-sm btn-outline btn-warning hover:!text-white"
            >
              «
            </button>
            <button className="join-item btn btn-sm btn-outline btn-warning pointer-events-none">
              {page}
            </button>
            <button
              disabled={page === totalPages}
              onClick={handleNextPage}
              className="join-item btn btn-sm btn-outline btn-warning hover:!text-white"
            >
              »
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default React.memo(RecipeReviews);