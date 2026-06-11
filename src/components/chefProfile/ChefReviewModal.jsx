import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaPen, FaStar, FaTimes, FaTrash } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import {
  addChefReview,
  deleteChefReview,
  updateChefReview,
} from "../../redux/slices/reviewSlice";

function ChefReviewModal({
  chef,
  buttonClassName = "",
  buttonLabel,
  onSuccess,
  showButton = true,
}) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { isLoggedIn, userData } = useSelector((state) => state.auth);
  const { isSubmittingChefReview } = useSelector((state) => state.review);

  const [open, setOpen] = useState(false);
  const [chefRating, setChefRating] = useState(0);
  const [chefReviewText, setChefReviewText] = useState("");

  const isOwnChef =
    userData?._id?.toString() === chef?._id?.toString() ||
    userData?._id?.toString() === chef?.chefProfile?.chefId?.toString();

  const existingChefReview = chef?.chefProfile?.reviews?.find(
    (r) =>
      (r.userId?._id || r.userId)?.toString() === userData?._id?.toString(),
  );

  useEffect(() => {
    if (!open) return;

    if (existingChefReview) {
      setChefRating(existingChefReview.rating || 0);
      setChefReviewText(existingChefReview.message || "");
    } else {
      setChefRating(0);
      setChefReviewText("");
    }
  }, [open, existingChefReview]);

  const handleOpen = () => {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }
    setOpen(true);
  };

  const closeModal = () => setOpen(false);

  const handleSubmit = () => {
    if (!isLoggedIn) return navigate("/login");
    if (chefRating === 0) {
      toast.error("Please select a rating");
      return;
    }
    if (!chefReviewText.trim()) {
      toast.error("Please write a review message");
      return;
    }

    const chefId = chef?._id?.toString();
    if (!chefId) return;

    const action = existingChefReview
      ? updateChefReview({
          chefId,
          rating: chefRating,
          message: chefReviewText,
        })
      : addChefReview({
          chefId,
          rating: chefRating,
          message: chefReviewText,
        });

    dispatch(action).then((res) => {
      if (!res.error) {
        setOpen(false);
        onSuccess?.();
      }
    });
  };

  const handleDelete = () => {
    if (!isLoggedIn) return navigate("/login");

    const chefId = chef?._id?.toString();
    if (!chefId) return;

    dispatch(deleteChefReview(chefId)).then((res) => {
      if (!res.error) {
        setOpen(false);
        onSuccess?.();
      }
    });
  };

  if (isOwnChef) return null;

  return (
    <>
      {showButton && (
        <button
          onClick={handleOpen}
          className={
            buttonClassName ||
            "btn btn-sm btn-outline border-orange-200 text-orange-600 hover:bg-orange-50 hover:border-orange-300 gap-2 rounded-xl"
          }
        >
          <FaPen className="w-3 h-3" />
          {buttonLabel ||
            (existingChefReview ? "Edit Chef Review" : "Review Chef")}
        </button>
      )}

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-md">
          <div className="relative w-full max-w-md rounded-3xl overflow-hidden border border-orange-100 bg-white shadow-2xl animate-fadeIn">
            <div className="flex justify-between items-center py-4 px-6 border-b border-orange-50 bg-linear-to-r from-orange-50 to-amber-50">
              <h3 className="text-xl font-bold text-gray-800">
                {existingChefReview
                  ? "Update Review for Chef"
                  : `Review Chef ${chef?.profile?.name || ""}`}
              </h3>
              <button
                onClick={closeModal}
                disabled={isSubmittingChefReview}
                className="btn btn-sm btn-circle btn-ghost text-gray-500 hover:bg-orange-100 disabled:opacity-50"
              >
                <FaTimes />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="flex items-center gap-3 bg-orange-50 p-3 rounded-xl border border-orange-100">
                <div className="avatar">
                  <div className="w-10 h-10 rounded-full overflow-hidden">
                    <img
                      src={chef?.profile?.avatar?.secure_url}
                      alt={chef?.profile?.name || "Chef"}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">
                    Posting Review For
                  </p>
                  <p className="font-bold text-gray-800">
                    {chef?.profile?.name}
                  </p>
                </div>
              </div>

              <div className="text-center">
                <p className="text-sm font-semibold text-gray-600 mb-2">
                  How would you rate this Chef?
                </p>
                <div className="flex justify-center gap-3 text-yellow-400">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <FaStar
                      key={i}
                      onClick={() => {
                        if (!isSubmittingChefReview) setChefRating(i + 1);
                      }}
                      className={`text-4xl cursor-pointer transition-transform duration-200 hover:scale-110 ${
                        i < chefRating
                          ? "opacity-100 drop-shadow-sm"
                          : "opacity-30 hover:opacity-60"
                      }`}
                    />
                  ))}
                </div>
              </div>

              <div className="form-control">
                <textarea
                  value={chefReviewText}
                  onChange={(e) => setChefReviewText(e.target.value)}
                  disabled={isSubmittingChefReview}
                  className="textarea textarea-bordered w-full h-32 rounded-xl focus:border-orange-400 focus:ring-4 focus:ring-orange-100/50 disabled:opacity-50"
                  placeholder="Share your thoughts on the chef's style, consistency, etc..."
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={closeModal}
                  disabled={isSubmittingChefReview}
                  className="btn flex-1 btn-ghost rounded-xl disabled:opacity-50"
                >
                  Cancel
                </button>

                {existingChefReview && (
                  <button
                    onClick={handleDelete}
                    disabled={isSubmittingChefReview}
                    className="btn flex-1 rounded-xl bg-red-100 hover:bg-red-200 text-red-600 font-semibold border-none shadow-md hover:shadow-lg transition-all disabled:opacity-50"
                  >
                    <FaTrash className="w-4 h-4" />
                    Delete Review
                  </button>
                )}

                <button
                  onClick={handleSubmit}
                  disabled={
                    isSubmittingChefReview ||
                    chefRating === 0 ||
                    !chefReviewText.trim()
                  }
                  className="btn flex-1 bg-linear-to-r from-orange-500 to-red-500 border-none text-white rounded-xl disabled:bg-gray-200 disabled:text-gray-400"
                >
                  {isSubmittingChefReview
                    ? "Submitting..."
                    : existingChefReview
                      ? "Update Review"
                      : "Submit Review"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ChefReviewModal;
