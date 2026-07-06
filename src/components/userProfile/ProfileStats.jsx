import { useState } from "react";
import {
  FaAllergies,
  FaChevronDown,
  FaChevronUp,
  FaCircle,
  FaGlobe,
  FaHeart,
  FaSeedling,
  FaStar,
  FaTimes,
  FaUsers,
} from "react-icons/fa";
import { useSelector } from "react-redux";

export default function ProfileStats() {
  const [activeItem, setActiveItem] = useState(null);
  const {userProfile, favourites} = useSelector((state) => state.profile);

  const statItems = [
    {
      id: "favourites",
      icon: FaHeart,
      label: "Favorites",
      value: favourites?.length ?? 0,
      iconColor: "text-rose-500",
      iconBg: "bg-rose-50",
    },
    {
      id: "subscribed",
      icon: FaUsers,
      label: "Subscribed",
      value: userProfile?.subscribed?.length ?? 0,
      iconColor: "text-blue-500",
      iconBg: "bg-blue-50",
    },
    {
      id: "reviews",
      icon: FaStar,
      label: "Reviews Given",
      value: userProfile?.reviewsGiven?.length ?? 0,
      iconColor: "text-yellow-500",
      iconBg: "bg-yellow-50",
    },
    {
      id: "cuisine",
      icon: FaGlobe,
      label: "Favourite Cuisine",
      value: userProfile?.cuisine.toUpperCase() || "N/A",
      iconColor: "text-purple-500",
      iconBg: "bg-purple-50",
    },
    {
      id: "dietary",
      icon: FaSeedling,
      label: "Dietary",
      value: userProfile?.dietaryLabels?.length ?? 0,
      iconColor: "text-emerald-500",
      iconBg: "bg-emerald-50",
      hasList: true,
      details:
        userProfile?.dietaryLabels?.length > 0
          ? userProfile?.dietaryLabels
          : ["No dietary preferences"],
    },
    {
      id: "allergens",
      icon: FaAllergies,
      label: "Allergens",
      value: userProfile?.allergens?.length ?? 0,
      iconColor: "text-red-500",
      iconBg: "bg-red-50",
      hasList: true,
      details:
        userProfile?.allergens?.length > 0
          ? userProfile?.allergens
          : ["No allergens listed"],
    },
  ];

  const handleToggle = (item) => {
    if (!item.hasList) return;
    setActiveItem(activeItem?.id === item.id ? null : item);
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {statItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeItem?.id === item.id;
          const isClickable = item.hasList;

          return (
            <div
              key={item.id}
              onClick={() => handleToggle(item)}
              className={`
                card bg-base-100 shadow-sm border-2 transition-all duration-300 relative
                ${
                  isActive
                    ? "border-orange-500 shadow-lg shadow-orange-100 scale-[1.02] -translate-y-1 z-10"
                    : "border-base-200 hover:border-orange-300 hover:shadow-md"
                }
                ${isClickable ? "cursor-pointer group" : "cursor-default"}
              `}
            >
              <div className="card-body p-3 sm:p-5 items-center text-center gap-1">
                <div
                  className={`
                    w-12 h-12 rounded-full flex items-center justify-center mb-1
                    ${item.iconBg} ${item.iconColor}
                    transition-transform duration-300 ${isClickable ? "group-hover:scale-110" : ""}
                  `}
                >
                  <Icon className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-black text-gray-800">
                  {item.value}
                </h2>
                <p className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-gray-400">
                  {item.label}
                </p>

                {isClickable && (
                  <div
                    className={`
                      mt-2 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide flex items-center gap-1 transition-colors
                      ${
                        isActive
                          ? "bg-orange-500 text-white"
                          : "bg-base-200 text-gray-500 group-hover:bg-orange-100 group-hover:text-orange-600"
                      }
                    `}
                  >
                    {isActive ? "Close" : "View"}
                    {isActive ? <FaChevronUp /> : <FaChevronDown />}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* 2. DETAIL PANEL */}
      {activeItem && (
        <div className="animate-in fade-in slide-in-from-top-4 duration-300 origin-top">
          <div className="flex justify-center -mb-px">
            <div className="w-0 h-0 border-l-10 border-l-transparent border-r-10 border-r-transparent border-b-10 border-b-orange-200"></div>
          </div>

          <div className="card bg-orange-50/30 border border-orange-200 shadow-inner">
            <div className="card-body p-6 sm:p-8">
              <div className="flex items-center justify-between pb-4 border-b border-orange-200">
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2 rounded-lg bg-white shadow-sm ${activeItem.iconColor}`}
                  >
                    <activeItem.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-gray-800">
                      {activeItem.label} Details
                    </h3>
                  </div>
                </div>

                <button
                  onClick={() => setActiveItem(null)}
                  className="btn btn-circle btn-sm btn-ghost hover:bg-orange-200 text-gray-500"
                >
                  <FaTimes />
                </button>
              </div>

              {/* Content List */}
              <div className="flex flex-wrap gap-2 pt-4">
                {activeItem.details.map((detail, index) => (
                  <div
                    key={index}
                    className="badge badge-lg h-auto py-3 px-4 bg-white border-orange-100 text-gray-700 shadow-sm gap-2"
                  >
                    <FaCircle className={`w-2 h-2 ${activeItem.iconColor}`} />
                    <span className="font-medium text-sm capitalize">
                      {detail}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
