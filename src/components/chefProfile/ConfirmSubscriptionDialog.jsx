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
    <dialog id="confirm-subscription" className="modal">
      <div className="modal-box sm:w-[70%] md:w-auto overflow-hidden p-0 bg-base-100">
        {/* Header */}
        <div className="relative overflow-hidden bg-gradient-to-br from-orange-500 via-red-500 to-amber-500 px-5 py-6 text-white">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.22),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.14),transparent_30%)]" />

          <div className="relative flex items-start justify-between gap-4 min-w-0">
            <div className="flex items-center gap-4 flex-1 min-w-0">
              <div className="avatar shrink-0">
                <div className="w-16 h-16 rounded-full ring-4 ring-white/30 overflow-hidden bg-white/20">
                  {avatarUrl ? (
                    <img
                      src={modifyCloudinaryURL(avatarUrl)}
                      alt={chefName}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center font-extrabold text-xl">
                      {chefName?.charAt(0)?.toUpperCase()}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-xs uppercase tracking-[0.2em] text-white/80 font-semibold">
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

        {/* Content */}
        <div className="p-5 sm:p-6">
          {/* Social proof */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="rounded-2xl border border-orange-100 bg-orange-50 p-3 text-center hidden sm:block">
              <div className="flex items-center justify-center gap-1 text-orange-600 font-bold">
                <FaUsers />
                <span>{subscriberCount}</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">Subscribers</p>
            </div>

            <div className="rounded-2xl border border-orange-100 bg-orange-50 p-3 text-center">
              <div className="flex items-center justify-center gap-1 text-orange-600 font-bold">
                <FaUtensils />
                <span>{recipeCount}</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">Recipes</p>
            </div>

            <div className="rounded-2xl border border-orange-100 bg-orange-50 p-3 text-center">
              <div className="flex items-center justify-center gap-1 text-orange-600 font-bold">
                <FaStar />
                <span>{averageRating || "—"}</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">Avg. Rating</p>
            </div>

            <div className="rounded-2xl border border-orange-100 bg-orange-50 p-3 text-center hidden sm:block">
              <div className="flex items-center justify-center gap-1 text-orange-600 font-bold">
                <span>{reviewCount}</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">Reviews</p>
            </div>
          </div>

          {/* Value section */}
          <div className="mt-5 rounded-2xl border border-orange-100 bg-gradient-to-br from-orange-50 to-rose-50 p-4 sm:p-5">
            <div className="flex items-center justify-between gap-3 mb-3">
              <div>
                <p className="text-xs uppercase tracking-widest text-gray-400 font-bold">
                  Speciality
                </p>
                <div className="mt-2 inline-flex items-center gap-2 rounded-xl border border-orange-200 bg-white px-3 py-2 text-sm font-semibold text-orange-700 shadow-sm">
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
                <p className="text-xs text-gray-500 mt-1">Cancel anytime</p>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-3 mt-4">
              <div className="rounded-xl bg-white/80 border border-white p-3">
                <p className="text-sm font-semibold text-gray-800">
                  What you get
                </p>
                <ul className="mt-2 space-y-2 text-sm text-gray-600">
                  <li>• Premium recipes not visible to free users</li>
                  <li>• Exclusive chef content and updates</li>
                </ul>
              </div>

              <div className="rounded-xl bg-white/80 border border-white p-3 hidden sm:block">
                <p className="text-sm font-semibold text-gray-800">
                  Trust indicators
                </p>
                <ul className="mt-2 space-y-2 text-sm text-gray-600">
                  <li>• {subscriberCount}+ people already subscribed</li>
                  <li>• {experienceCount}+ experience entries</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Footer actions */}
          <div className="mt-4 flex flex-col gap-3">
            <form method="dialog" className="w-full">
              <button className="btn w-full rounded-xl btn-outline border-gray-200 text-gray-700 hover:bg-gray-50">
                Not now
              </button>
            </form>

            <button
              type="button"
              onClick={handleConfirm}
              disabled={loading}
              className="btn w-full rounded-xl border-none bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold shadow-lg hover:shadow-orange-200"
            >
              {loading ? "Processing..." : "Confirm & Subscribe"}
            </button>
          </div>
        </div>
      </div>

      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
}

export default ConfirmSubscriptionDialog;
