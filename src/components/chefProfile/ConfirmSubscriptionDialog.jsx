import { AiOutlineClose } from "react-icons/ai";
import { FaRupeeSign, FaStar, FaUsers, FaUtensils } from "react-icons/fa";

function ConfirmSubscriptionDialog({ profileData, onConfirm, loading }) {
  const chefName = profileData?.profile?.name || "-";
  const speciality = profileData?.chefProfile?.speciality || "-";
  const avatarUrl = profileData?.profile?.avatar?.secure_url || "";
  const price = Number(profileData?.chefProfile?.subscriptionPrice || 0);

  const recipeCount = profileData?.recipes?.length || 0;
  const subscriberCount = profileData?.chefProfile?.subscribers?.length || 0;
  const reviewCount = profileData?.chefProfile?.reviews?.length || 0;
  const experienceCount = profileData?.chefProfile?.experience?.length || 0;

  const averageRating = (() => {
    const ratings =
      profileData?.recipes?.flatMap((recipe) =>
        (recipe?.reviews || [])
          .map((rev) => Number(rev?.rating))
          .filter((rating) => Number.isFinite(rating)),
      ) || [];

    if (!ratings.length) return null;

    return (
      ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length
    ).toFixed(1);
  })();

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

  const handleConfirm = async () => {
    document.getElementById("confirm-subscription")?.close();
    onConfirm();
  };

  return (
    <dialog
      id="confirm-subscription"
      role="dialog"
      aria-modal="true"
      className="modal backdrop-blur-sm"
    >
      <div className="modal-box w-full max-w-xl bg-white shadow-2xl border border-orange-100 rounded-3xl p-0 overflow-hidden">
        <div className="bg-linear-to-r from-orange-50 to-amber-50 px-6 py-3 border-b border-orange-100 flex items-center justify-between">
          <h3 className="font-bold text-xl text-gray-800 flex items-center gap-2">
            <FaStar className="text-orange-500" />
            Confirm Subscription
          </h3>

          {/* Close dialog button */}
          <button
            type="button"
            className="btn btn-sm btn-circle btn-ghost text-gray-500 hover:bg-orange-100 hover:text-orange-600"
            onClick={() =>
              document.getElementById("confirm-subscription")?.close()
            }
          >
            <AiOutlineClose className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-5 max-h-[85vh] overflow-y-auto custom-scrollbar">
          {/* Chef Profile Banner */}
          <div className="relative overflow-hidden bg-orange-500 px-5 py-4 rounded-2xl text-white shadow-md mb-4">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.22),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.14),transparent_30%)]" />

            <div className="relative flex items-start justify-between gap-4 min-w-0">
              <div className="flex items-center gap-4 flex-1 min-w-0">
                <div className="avatar shrink-0">
                  <div className="w-16 h-16 rounded-full border-4 border-white/30 shadow-lg overflow-hidden bg-white/20">
                    {avatarUrl ? (
                      <img
                        src={modifyCloudinaryURL(avatarUrl)}
                        alt={chefName}
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center font-extrabold text-2xl text-white">
                        {chefName?.charAt(0)?.toUpperCase()}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-xs uppercase tracking-[0.2em] text-white/80 font-semibold mb-1">
                    Premium Subscription
                  </p>

                  <h3
                    className="text-2xl font-extrabold truncate"
                    title={chefName}
                  >
                    {chefName}
                  </h3>

                  <p className="text-sm text-white/90 mt-1 hidden sm:block">
                    Unlock exclusive recipes, premium content, and chef updates
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Social Proof Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="rounded-2xl border border-orange-100 bg-orange-50 p-3 text-center hidden sm:block">
              <div className="flex items-center justify-center gap-1 text-rose-500 font-bold">
                <FaUsers />
                <span>{subscriberCount}</span>
              </div>
              <p className="text-xs text-gray-500 mt-1 font-medium">
                Subscribers
              </p>
            </div>

            <div className="rounded-2xl border border-orange-100 bg-orange-50 p-3 text-center">
              <div className="flex items-center justify-center gap-1 text-teal-500 font-bold">
                <FaUtensils />
                <span>{recipeCount}</span>
              </div>
              <p className="text-xs text-gray-500 mt-1 font-medium">Recipes</p>
            </div>

            <div className="rounded-2xl border border-orange-100 bg-orange-50 p-3 text-center">
              <div className="flex items-center justify-center gap-1 text-amber-400 font-bold">
                <FaStar />
                <span>{averageRating || "—"}</span>
              </div>
              <p className="text-xs text-gray-500 mt-1 font-medium">
                Avg. Rating
              </p>
            </div>

            <div className="rounded-2xl border border-orange-100 bg-orange-50 p-3 text-center hidden sm:block">
              <div className="flex items-center justify-center gap-1 text-orange-600 font-bold">
                <span>{reviewCount}</span>
              </div>
              <p className="text-xs text-gray-500 mt-1 font-medium">Reviews</p>
            </div>
          </div>

          {/* Value & Pricing Section */}
          <div className="mt-4 rounded-2xl border border-orange-100 bg-linear-to-r from-orange-50 to-rose-50 p-4">
            <div className="flex items-center justify-between gap-3 mb-4">
              <div>
                <p className="text-xs uppercase tracking-widest text-gray-400 font-bold">
                  Speciality
                </p>
                <div className="mt-2 inline-flex items-center gap-2 rounded-xl border border-orange-200 bg-white px-3 py-2 text-sm font-semibold text-orange-500 shadow-sm uppercase">
                  <FaUtensils />
                  {speciality}
                </div>
              </div>

              <div className="text-right">
                <p className="text-xs uppercase tracking-widest text-gray-400 font-bold">
                  Monthly Price
                </p>
                <p className="text-3xl font-black text-gray-800 leading-none mt-2">
                  <FaRupeeSign className="inline-block mb-1" />
                  {new Intl.NumberFormat("en-IN").format(price)}
                </p>
                <p className="text-xs text-gray-500 mt-1 font-medium">
                  Cancel anytime
                </p>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-3 mt-4">
              <div className="rounded-xl bg-white/80 border border-white p-4 shadow-sm">
                <p className="text-sm font-bold text-gray-800">What you get</p>
                <ul className="mt-2 space-y-2 text-sm text-gray-600 font-medium">
                  <li>• Premium recipes not visible to free users</li>
                  <li>• Exclusive chef content and updates</li>
                </ul>
              </div>

              <div className="rounded-xl bg-white/80 border border-white p-4 shadow-sm hidden sm:block">
                <p className="text-sm font-bold text-gray-800">
                  Trust indicators
                </p>
                <ul className="mt-2 space-y-2 text-sm text-gray-600 font-medium">
                  <li>• {subscriberCount}+ people already subscribed</li>
                  <li>• {experienceCount}+ professional experience entries</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Dialog Footer */}
          <div className="flex items-center gap-3 pt-4 mt-4 border-t border-orange-100">
            <form method="dialog" className="w-1/2">
              <button className="btn w-full btn-ghost hover:bg-gray-100 rounded-xl text-gray-700 font-semibold border-slate-300">
                Not now
              </button>
            </form>

            <button
              type="button"
              onClick={handleConfirm}
              disabled={loading}
              className={`btn w-1/2 border-none text-white shadow-lg rounded-xl gap-2 ${
                loading
                  ? "bg-gray-300 cursor-not-allowed text-gray-500 shadow-none"
                  : "bg-linear-to-r from-orange-500 to-red-500 hover:shadow-orange-200 hover:-translate-y-0.5"
              }`}
            >
              {loading ? "Processing..." : "Confirm & Subscribe"}
            </button>
          </div>
        </div>
      </div>

      {/* Backdrop trigger for closing */}
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
}

export default ConfirmSubscriptionDialog;