import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import {
  FaCheckCircle,
  FaClock,
  FaEdit,
  FaFire,
  FaHeart,
  FaPen,
  FaShareAlt,
  FaStar,
  FaTimes,
  FaTrash,
  FaUsers,
} from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";

import likeRecipeApi from "../../apis/recipe/likeRecipeApi";
import unlikeRecipeApi from "../../apis/recipe/unlikeRecipeApi";
import Loading from "../../components/Loading";
import RecipeCarousel from "../../components/recipe/RecipeCarousel";
import HomeLayout from "../../layouts/HomeLayout";
import { getRecipeById, resetRecipe } from "../../redux/slices/recipeSlice";

// --- MOCK DATA FOR TESTING CAROUSEL ---
const dummySimilarRecipes = [
  {
    _id: "mock1",
    chefId: "64xyz123abc",
    title: "Spicy Garlic Butter Shrimp",
    description: "A fast, flavorful seafood dish perfect for weeknights.",
    totalCookingTime: 25,
    servings: 2,
    cuisine: "Asian",
    dietaryLabels: ["Keto", "High-Protein", "Pescatarian"],
    isPremium: true,
    thumbnail: {
      secure_url:
        "https://images.unsplash.com/photo-1625937751876-451522f98642?w=500&q=80",
    },
  },
  {
    _id: "mock2",
    chefId: "64xyz123abc",
    title: "Creamy Tuscan Chicken Miso",
    description: "Rich, creamy chicken infused with incredible umami flavors.",
    totalCookingTime: 40,
    servings: 4,
    cuisine: "Italian-Fusion",
    dietaryLabels: ["Gluten-Free"],
    isPremium: false,
    thumbnail: {
      secure_url:
        "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=500&q=80",
    },
  },
  {
    _id: "mock3",
    chefId: "64xyz123def",
    title: "Roasted Red Pepper Pasta",
    description: "A vibrant, smoky vegan pasta dish that takes 20 minutes.",
    totalCookingTime: 20,
    servings: 3,
    cuisine: "Italian",
    dietaryLabels: ["Vegan", "Dairy-Free"],
    isPremium: false,
    thumbnail: {
      secure_url:
        "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=500&q=80",
    },
  },
  {
    _id: "mock4",
    chefId: "64xyz123ghi",
    title: "Classic Beef Wellington",
    description: "A show-stopping centerpiece for your next dinner party.",
    totalCookingTime: 120,
    servings: 6,
    cuisine: "British",
    dietaryLabels: ["High-Protein"],
    isPremium: true,
    thumbnail: {
      secure_url:
        "https://images.unsplash.com/photo-1600891964092-4316c288032e?w=500&q=80",
    },
  },
];

function RecipeDetail() {
  const { id } = useParams();
  const { recipe, chef, error } = useSelector((state) => state.recipe);
  const { isLoggedIn, userData } = useSelector((state) => state.auth);
  const [isFav, setIsFav] = useState(
    userData?.favourites?.find((fav) => fav.toString() === id),
  );
  const [cost, setCost] = useState({ total: 0, perServing: 0 });
  const [stats, setStats] = useState({
    averageRating: 0,
    reviewCount: 0,
  });
  const [madeIt, setMadeIt] = useState(false);
  const [madeItCount, setMadeItCount] = useState(0);

  // --- Recipe Review State ---
  const [showReview, setShowReview] = useState(false);
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");

  // --- CHEF Review State ---
  const [showChefReview, setShowChefReview] = useState(false);
  const [chefRating, setChefRating] = useState(0);
  const [chefReviewText, setChefReviewText] = useState("");

  // --- Delete Modal State ---
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [checkedIngredients, setCheckedIngredients] = useState([]);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const debounceTimer = useRef(null);

  // Determine if the logged-in user is the author of the recipe
  const isChef = isLoggedIn && userData?._id === chef?._id;

  useEffect(() => {
    if (!id) {
      navigate("/");
      return;
    }
    dispatch(getRecipeById(id));

    return () => {
      dispatch(resetRecipe());
    };
  }, [id]);

  useEffect(() => {
    if (error) {
      toast.error(error?.message || "Something went wrong");
      if (error?.data) {
        toast.error("Please subscribe to this chef to unlock recipe");
        navigate(`/profile/${error.data}`);
      }
    }
  }, [error, navigate]);

  useEffect(() => {
    if (!recipe?.ingredients) return;

    const totalCost = recipe.ingredients.reduce((sum, ing) => {
      const price = Number(ing?.marketPrice) || 0;
      return sum + price;
    }, 0);

    const costPerServing =
      recipe?.servings && recipe.servings > 0
        ? totalCost / recipe.servings
        : totalCost;

    setCost({ total: totalCost, perServing: costPerServing });

    const reviews = recipe?.reviews || [];
    const count = reviews.length;
    const avg =
      count > 0
        ? reviews.reduce((s, r) => s + (Number(r?.rating) || 0), 0) / count
        : 0;

    setStats({ averageRating: Number(avg.toFixed(1)), reviewCount: count });
  }, [recipe]);

  const toggleFav = () => {
    if (!isLoggedIn) return navigate("/login");

    const newState = !isFav;
    setIsFav(newState);

    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(async () => {
      try {
        if (newState) {
          await likeRecipeApi(recipe._id.toString());
        } else {
          await unlikeRecipeApi(recipe._id.toString());
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to update like");
      }
    }, 1000);
  };

  useEffect(() => {
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, []);

  const handleChefReviewSubmit = () => {
    console.log("Submitting Chef Review:", {
      chefId: chef?._id,
      rating: chefRating,
      text: chefReviewText,
    });
    toast.success("Thanks for reviewing the Chef!");
    setShowChefReview(false);
    setChefRating(0);
    setChefReviewText("");
  };

  const handleDeleteRecipe = () => {
    console.log("Deleting recipe:", recipe._id);
    setShowDeleteModal(false);
    navigate("/dashboard");
  };

  if (!recipe) return <Loading />;

  const statTabs = [
    {
      icon: <FaUsers />,
      label: "Servings",
      value: recipe.servings,
    },
    {
      icon: <FaClock />,
      label: "Total Time",
      value: `${recipe.totalCookingTime} min`,
    },
    {
      icon: <FaHeart />,
      label: "Likes",
      value: recipe.likeCount?.length || 0,
    },
    ...(recipe?.nutrition?.calorie
      ? [
          {
            icon: <FaFire />,
            label: "Calories",
            value: `${recipe.nutrition.calorie} kcal`,
          },
        ]
      : []),
  ];

  const handleMadeItToggle = () => {
    if (madeIt) {
      setMadeIt(false);
      setMadeItCount((prev) => prev - 1);
      toast("Maybe next time!", { icon: "🍳" });
    } else {
      setMadeIt(true);
      setMadeItCount((prev) => prev + 1);
      toast.success("Yay! Hope it was delicious! 🎉");
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: recipe.title,
      text: "Check out this amazing recipe!",
      url: window.location.href,
    };

    if (navigator.share) {
      await navigator.share(shareData);
    } else {
      await navigator.clipboard.writeText(shareData.url);
      toast.success("Link copied to clipboard!");
    }
  };

  const toggleIngredientCheck = (index) => {
    setCheckedIngredients((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index],
    );
  };

  return (
    <HomeLayout>
      <div className="min-h-screen relative bg-linear-to-br from-orange-50 via-rose-50 to-amber-50 overflow-hidden">
        <div className="container mx-auto px-4 py-10 relative z-10">
          <div className="max-w-6xl mx-auto space-y-10">
            {/* Hero Section */}
            <div className="hero relative rounded-3xl overflow-hidden shadow-xl border border-orange-100">
              <div className="hero-overlay bg-linear-to-t from-black/40 via-black/10 to-transparent"></div>
              <img
                src={recipe.thumbnail?.secure_url}
                alt={recipe.title}
                className="w-full h-[280px] sm:h-[400px] lg:h-[500px] object-cover transition-transform duration-700 hover:scale-105"
              />

              {/* Author Actions (Edit / Delete) */}
              {isChef && (
                <div className="absolute top-4 left-4 z-20 flex gap-2">
                  <Link
                    to={`/recipe/edit/${recipe._id}`}
                    className="btn btn-circle bg-white/80 text-blue-600 border-none hover:bg-white shadow-md transition-all hover:scale-105"
                    title="Edit Recipe"
                  >
                    <FaEdit className="w-5 h-5" />
                  </Link>
                  <button
                    onClick={() => setShowDeleteModal(true)}
                    className="btn btn-circle bg-white/80 text-red-600 border-none hover:bg-white shadow-md transition-all hover:scale-105"
                    title="Delete Recipe"
                  >
                    <FaTrash className="w-5 h-5" />
                  </button>
                </div>
              )}

              <button
                onClick={toggleFav}
                className={`absolute top-4 right-4 btn btn-circle ${
                  isFav
                    ? "bg-rose-500 text-white border-none"
                    : "bg-white/80 text-gray-700 border-none hover:bg-white"
                }`}
              >
                <FaHeart className="w-5 h-5" />
              </button>

              <button
                onClick={handleShare}
                className="absolute bottom-4 z-20 right-4 btn btn-circle bg-white/80 text-orange-600 border-none hover:bg-white shadow-md transition-all hover:scale-105"
              >
                <FaShareAlt className="w-5 h-5" />
              </button>

              <div className="absolute inset-x-0 bottom-0 px-4 sm:px-10 pb-6 sm:pb-10">
                <div className="bg-linear-to-t from-black/85 via-black/60 to-transparent text-white p-4 sm:p-6 rounded-2xl max-w-3xl mx-auto sm:mx-0 shadow-lg backdrop-blur-sm">
                  <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold leading-tight drop-shadow-md mb-2">
                    {recipe.title}
                  </h1>

                  <div className="max-h-[50px] sm:max-h-[100px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-white/30 scrollbar-track-transparent">
                    <p className="text-xs sm:text-base text-gray-100 whitespace-pre-line">
                      {recipe.description}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Grid Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                {/* --- CHEF INFO CARD --- */}
                <div className="card bg-base-100 shadow-md border border-orange-100 hover:shadow-orange-200/60 transition-all hover:-translate-y-1">
                  <div className="card-body">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="avatar">
                          <div className="w-14 h-14 rounded-full border-2 border-orange-200">
                            <img
                              src={chef?.profile?.avatar?.secure_url}
                              alt={chef?.profile?.name || "Chef"}
                            />
                          </div>
                        </div>
                        <div>
                          <Link
                            to={`/profile/${chef?._id.toString() ?? ""}`}
                            className="card-title link link-hover text-orange-600"
                          >
                            {chef?.profile?.name || "Chef"}
                          </Link>
                          <div className="flex items-center gap-1 text-sm text-gray-500">
                            <FaStar className="text-yellow-400" />
                            {stats.averageRating} • {stats.reviewCount} reviews
                          </div>
                        </div>
                      </div>

                      <div>
                        <button
                          onClick={() => setShowChefReview(true)}
                          className="btn btn-sm btn-outline border-orange-200 text-orange-600 hover:bg-orange-50 hover:border-orange-300 gap-2 rounded-xl"
                        >
                          <FaPen className="w-3 h-3" />
                          Review Chef
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  {statTabs.map((item, i) => (
                    <div
                      key={i}
                      className="card bg-base-100 shadow-sm border border-orange-100 hover:shadow-orange-200/60 transition-all hover:-translate-y-1"
                    >
                      <div className="card-body items-center text-center p-4">
                        <div className="text-orange-500 text-xl mb-1">
                          {item.icon}
                        </div>
                        <div className="card-title text-gray-700">
                          {item.value}
                        </div>
                        <div className="text-sm text-gray-500">
                          {item.label}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Dietary & Cuisine Container */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {recipe.dietaryLabels?.length > 0 && (
                    <div className="card bg-base-100 shadow-sm border border-orange-100">
                      <div className="card-body">
                        <h3 className="card-title text-gray-800">
                          Dietary Information
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {recipe.dietaryLabels.map((label, index) => (
                            <div
                              key={index}
                              className="badge badge-outline border-green-400 text-green-600"
                            >
                              {label}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {recipe.cuisine && (
                    <div className="card bg-base-100 shadow-sm border border-orange-100">
                      <div className="card-body">
                        <h3 className="card-title text-gray-800">Cuisine</h3>
                        <div className="flex flex-wrap gap-2">
                          {(Array.isArray(recipe.cuisine)
                            ? recipe.cuisine
                            : [recipe.cuisine]
                          ).map((item, idx) => (
                            <div
                              key={idx}
                              className="badge badge-outline border-red-600 text-red-600"
                            >
                              {item}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {recipe?.nutrition && (
                  <div className="collapse collapse-arrow bg-base-100 shadow-md border border-orange-100">
                    <input type="checkbox" />

                    <div className="collapse-title text-lg font-bold text-gray-800">
                      Nutritional Information
                    </div>

                    <div className="collapse-content">
                      <div className="overflow-x-auto">
                        <table className="table table-zebra w-full">
                          <tbody>
                            <tr className="hover">
                              <td className="font-medium text-gray-800">
                                Calories
                              </td>

                              <td className="text-right text-gray-600">
                                {`${recipe?.nutrition?.calorie} k || "-"cal`}
                              </td>
                            </tr>

                            <tr className="hover">
                              <td className="font-medium text-gray-800">
                                Carbohydrates
                              </td>

                              <td className="text-right text-gray-600">
                                {`${recipe?.nutrition?.carbohydrate || "-"} g`}
                              </td>
                            </tr>

                            <tr className="hover">
                              <td className="font-medium text-gray-800">
                                Protein
                              </td>

                              <td className="text-right text-gray-600">
                                {`${recipe?.nutrition?.protein || "-"} g`}
                              </td>
                            </tr>

                            <tr className="hover">
                              <td className="font-medium text-gray-800">Fat</td>

                              <td className="text-right text-gray-600">
                                {`${recipe?.nutrition?.fat || "-"} g`}
                              </td>
                            </tr>

                            <tr className="hover">
                              <td className="font-medium text-gray-800">
                                Fiber
                              </td>

                              <td className="text-right text-gray-600">
                                {`${recipe?.nutrition?.fiber || "-"} g`}
                              </td>
                            </tr>

                            <tr className="hover">
                              <td className="font-medium text-gray-800">
                                Sugar
                              </td>

                              <td className="text-right text-gray-600">
                                {`${recipe?.nutrition?.sugar || "-"} g`}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}

                {/* Ingredients */}
                <div className="print-only-steps">
                  <div className="card bg-base-100 shadow-lg border border-orange-100">
                    <div className="card-body">
                      <h3 className="card-title text-gray-800">Ingredients</h3>

                      <p className="text-sm text-gray-500">
                        Estimated cost: ₹{cost?.total?.toFixed(2) ?? "0.00"}
                        {cost?.perServing > 0 &&
                          ` (₹${cost?.perServing?.toFixed(2)} per serving)`}
                      </p>

                      <div className="overflow-x-auto">
                        <table className="table table-zebra">
                          <thead>
                            <tr>
                              <th className="w-10"></th>
                              <th>Ingredient</th>
                              <th>Quantity</th>
                              <th className="text-right">Cost</th>
                            </tr>
                          </thead>
                          <tbody>
                            {recipe?.ingredients?.map((ing, index) => {
                              const isChecked =
                                checkedIngredients.includes(index);

                              return (
                                <tr
                                  key={index}
                                  className={`transition-all duration-300 ${
                                    isChecked ? "opacity-50" : ""
                                  }`}
                                >
                                  <td>
                                    <input
                                      type="checkbox"
                                      className="checkbox checkbox-sm checkbox-warning rounded-md"
                                      checked={isChecked}
                                      onChange={() =>
                                        toggleIngredientCheck(index)
                                      }
                                    />
                                  </td>

                                  <td
                                    className={`font-medium ${
                                      isChecked
                                        ? "line-through text-gray-400"
                                        : "text-gray-800"
                                    }`}
                                  >
                                    {ing.name}
                                  </td>

                                  <td
                                    className={`font-medium ${
                                      isChecked
                                        ? "line-through text-gray-400"
                                        : "text-gray-600"
                                    }`}
                                  >
                                    {ing.quantity} {ing.unit}
                                  </td>

                                  <td
                                    className={`text-right ${
                                      isChecked
                                        ? "line-through text-gray-300"
                                        : "text-gray-500"
                                    }`}
                                  >
                                    ₹{(Number(ing.marketPrice) || 0).toFixed(2)}
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>

                  {/* Instructions */}
                  <div className="card bg-base-100 shadow-lg border border-orange-100 mt-8">
                    <div className="card-body">
                      <h3 className="card-title text-gray-800">Instructions</h3>
                      <div className="space-y-8">
                        {recipe.steps.map((step, i) => (
                          <div key={i} className="print-step space-y-4">
                            <div className="flex items-start gap-4">
                              <div className="w-8 h-8 flex items-center justify-center bg-linear-to-r from-orange-400 to-red-400 text-white rounded-full font-semibold shadow-md shrink-0">
                                {step.stepNo}
                              </div>
                              <div className="flex-1">
                                <p className="text-gray-700 leading-relaxed text-lg">
                                  {step.instruction}
                                </p>
                              </div>
                            </div>

                            {step.imageUrl?.secure_url && (
                              <div className="w-full">
                                <img
                                  src={step.imageUrl.secure_url}
                                  alt={`Step ${step.stepNo}`}
                                  className="rounded-lg shadow-md w-full max-h-96 object-contain"
                                />
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* I MADE IT WIDGET */}
                <div
                  className={`card shadow-lg transition-all duration-500 border-2 ${
                    madeIt
                      ? "bg-emerald-50 border-emerald-400 shadow-emerald-100"
                      : "bg-base-100 border-orange-100 hover:border-orange-200"
                  }`}
                >
                  <div className="card-body p-6 text-center">
                    <div className="flex flex-col items-center mb-4">
                      <div className="flex items-baseline gap-1">
                        <span
                          className={`text-4xl font-black transition-all duration-300 ${
                            madeIt
                              ? "text-emerald-600 scale-110"
                              : "text-gray-800"
                          }`}
                        >
                          {madeItCount}
                        </span>
                      </div>
                      <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                        People cooked this
                      </span>
                    </div>

                    <button
                      onClick={handleMadeItToggle}
                      className={`btn w-full text-sm font-semibold rounded-xl shadow-md transition-all duration-300 group ${
                        madeIt
                          ? "bg-emerald-500 hover:bg-emerald-600 border-none text-white ring-4 ring-emerald-100"
                          : "bg-linear-to-r from-orange-400 to-red-400 border-none text-white hover:shadow-orange-200 hover:-translate-y-1"
                      }`}
                    >
                      <FaCheckCircle
                        className={`w-5 h-5 transition-transform duration-300 ${
                          madeIt ? "scale-125" : "group-hover:scale-110"
                        }`}
                      />
                      {madeIt ? "I Made It!" : "I Made This"}
                    </button>

                    <div
                      className={`transition-all duration-500 ease-in-out overflow-hidden ${
                        madeIt
                          ? "max-h-20 opacity-100 mt-3"
                          : "max-h-0 opacity-0"
                      }`}
                    >
                      <p className="text-sm font-semibold text-emerald-600 bg-white/50 py-2 px-3 rounded-lg inline-flex items-center gap-2">
                        <span>🎉</span> Delicious choice!
                      </p>
                    </div>
                  </div>
                </div>

                {/* --- Reviews & Rating Card --- */}
                <div className="card bg-base-100 shadow-md border border-orange-100 overflow-hidden">
                  <div className="h-2 bg-linear-to-r from-yellow-400 to-orange-500"></div>

                  <div className="card-body items-center text-center p-6">
                    <h3 className="font-bold text-gray-500 text-sm uppercase tracking-widest mb-1">
                      Recipe Rating
                    </h3>
                    <div className="flex items-end justify-center gap-1 leading-none mb-2">
                      <span className="text-5xl font-black text-gray-800">
                        {stats.averageRating}
                      </span>
                      <span className="text-xl font-bold text-gray-300 mb-1">
                        / 5
                      </span>
                    </div>
                    <div className="flex justify-center gap-1.5 mb-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <FaStar
                          key={i}
                          className={`text-2xl transition-colors duration-200 ${
                            i < Math.round(stats.averageRating)
                              ? "text-yellow-400 drop-shadow-sm"
                              : "text-gray-200"
                          }`}
                        />
                      ))}
                    </div>

                    <p className="text-sm text-gray-400 font-medium mb-6">
                      ({stats.reviewCount}
                      {stats.reviewCount === 1 ? "review" : "reviews"})
                    </p>
                    <button
                      onClick={() => setShowReview(true)}
                      className="btn w-full bg-linear-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white border-none shadow-md hover:shadow-orange-200 hover:-translate-y-0.5 transition-all rounded-xl"
                    >
                      <FaStar className="mr-1" />
                      Rate This Recipe
                    </button>
                  </div>
                </div>

                {/* External Media */}
                {recipe.externalMediaLinks?.length > 0 && (
                  <div className="card bg-base-100 shadow-lg border border-orange-100">
                    <div className="card-body">
                      <h3 className="card-title text-gray-800">
                        Related Media
                      </h3>
                      <div className="space-y-2">
                        {recipe.externalMediaLinks.map((link, index) => (
                          <a
                            key={index}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block p-3 border border-orange-200 rounded-lg hover:bg-orange-50 transition-colors"
                          >
                            <span className="font-medium text-orange-600">
                              {link.name}
                            </span>
                            <span className="text-sm text-gray-500 ml-2">
                              →
                            </span>
                          </a>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* --- CAROUSEL IMPLEMENTATION --- */}
            {dummySimilarRecipes.length > 0 && (
              <div className="mt-20 pt-10 border-t-2 border-orange-200/50 relative z-10 print-only-steps">
                <RecipeCarousel
                  title={
                    <div className="flex-1 pr-4">
                      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                        <div>
                          <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-linear-to-r from-orange-600 to-red-500 drop-shadow-sm">
                            Craving Something Similar?
                          </h2>
                          <p className="text-gray-500 mt-2 font-medium">
                            Explore these hand-picked recommendations based on
                            this recipe.
                          </p>
                        </div>
                      </div>
                    </div>
                  }
                  recipes={dummySimilarRecipes}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* --- RECIPE REVIEW MODAL --- */}
      {showReview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-md">
          <div className="relative w-full max-w-md rounded-3xl overflow-hidden border border-white/50 bg-white/70 backdrop-blur-2xl shadow-2xl animate-fadeIn">
            <div className="text-center py-6 px-6 border-b border-white/40 bg-linear-to-r from-orange-500/10 via-amber-300/10 to-red-500/10">
              <h3 className="text-2xl font-extrabold bg-linear-to-r from-orange-500 via-red-500 to-amber-500 bg-clip-text text-transparent">
                Rate this Recipe
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                Share your experience with others
              </p>
            </div>
            <div className="p-6 space-y-5">
              <div className="flex justify-center gap-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <FaStar
                    key={i}
                    onClick={() => setRating(i + 1)}
                    className={`text-3xl cursor-pointer transition-all duration-200 ${
                      i < rating
                        ? "text-yellow-400 drop-shadow-sm scale-110"
                        : "text-gray-100 opacity-90 hover:text-yellow-400 hover:scale-105"
                    }`}
                  />
                ))}
              </div>
              <textarea
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                className="textarea textarea-bordered w-full h-28 resize-none bg-white/60 focus:outline-none focus:ring-2 focus:ring-orange-200"
                placeholder="Write your recipe review..."
              />
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setShowReview(false)}
                  className="btn flex-1 rounded-xl bg-white/70 hover:bg-white border border-gray-200 text-gray-700 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setShowReview(false);
                  }}
                  className="btn flex-1 rounded-xl bg-linear-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold border-none shadow-md hover:shadow-lg transition-all"
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- CHEF REVIEW MODAL --- */}
      {showChefReview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-md">
          <div className="relative w-full max-w-md rounded-3xl overflow-hidden border border-orange-100 bg-white shadow-2xl animate-fadeIn">
            <div className="flex justify-between items-center py-4 px-6 border-b border-orange-50 bg-linear-to-r from-orange-50 to-amber-50">
              <h3 className="text-xl font-bold text-gray-800">
                Review Chef {chef?.profile?.name}
              </h3>
              <button
                onClick={() => setShowChefReview(false)}
                className="btn btn-sm btn-circle btn-ghost text-gray-500 hover:bg-orange-100"
              >
                <FaTimes />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="flex items-center gap-3 bg-orange-50 p-3 rounded-xl border border-orange-100">
                <div className="avatar">
                  <div className="w-10 h-10 rounded-full">
                    <img src={chef?.profile?.avatar?.secure_url} alt="Chef" />
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
                      onClick={() => setChefRating(i + 1)}
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
                  className="textarea textarea-bordered w-full h-32 rounded-xl focus:border-orange-400 focus:ring-4 focus:ring-orange-100/50"
                  placeholder="Share your thoughts on the chef's style, consistency, etc..."
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowChefReview(false)}
                  className="btn flex-1 btn-ghost rounded-xl"
                >
                  Cancel
                </button>
                <button
                  onClick={handleChefReviewSubmit}
                  disabled={chefRating === 0}
                  className="btn flex-1 bg-linear-to-r from-orange-500 to-red-500 border-none text-white rounded-xl disabled:bg-gray-200 disabled:text-gray-400"
                >
                  Submit Review
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- DELETE CONFIRMATION MODAL --- */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-md">
          <div className="relative w-full max-w-sm rounded-3xl overflow-hidden border border-red-100 bg-white shadow-2xl animate-fadeIn">
            <div className="p-8 text-center space-y-4">
              <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-2">
                <FaTrash className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800">
                Delete Recipe?
              </h3>
              <p className="text-gray-500 text-sm">
                Are you sure you want to delete this recipe? This action cannot
                be undone.
              </p>
              <div className="flex gap-3 pt-6">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="btn flex-1 btn-ghost rounded-xl border border-gray-200 text-gray-700"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteRecipe}
                  className="btn flex-1 bg-red-500 hover:bg-red-600 border-none text-white rounded-xl"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </HomeLayout>
  );
}

export default RecipeDetail;
