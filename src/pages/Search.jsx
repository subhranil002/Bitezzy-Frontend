import { useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import {
  FaDollarSign,
  FaFilter,
  FaFire,
  FaSearch,
  FaSlidersH,
  FaStar,
} from "react-icons/fa";

import searchRecipeApi from "../apis/recipe/searchRecipeApi";
import RecipeCard from "../components/recipe/RecipeCard";
import RecipeCardSkeleton from "../components/recipe/RecipeCardSkeleton";
import { CUISINE_OPTIONS, DIETARY_OPTIONS, SORT_OPTIONS } from "../constants";
import HomeLayout from "../layouts/HomeLayout";

const defaultFormValues = {
  query: "",
  cuisine: "",
  dietaryPreferences: [],
  rating: 0,
  priceMin: "",
  priceMax: "",
  premium: false,
  sort: "relevance",
  page: 1,
  limit: 12,
};

const RecipeGrid = ({ children }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 md:gap-8 gap-6 w-full pb-12 justify-items-center">
    {children}
  </div>
);

const EmptyState = ({ onClear }) => (
  <div className="flex flex-col items-center justify-center pb-24 text-center">
    <div className="relative w-32 h-32 mb-8">
      <div className="absolute inset-0 bg-orange-100 rounded-full animate-ping opacity-20"></div>
      <div className="absolute inset-0 bg-orange-50 rounded-full flex items-center justify-center shadow-inner">
        <FaSearch className="w-12 h-12 text-orange-300" />
      </div>
    </div>
    <h3 className="text-3xl font-black text-gray-800 mb-3 tracking-tight">
      Nothing found here
    </h3>
    <p className="text-gray-500 mb-8 max-w-md text-lg">
      We searched the entire kitchen, but couldn't find recipes matching your
      specific taste.
    </p>
    <button
      type="button"
      onClick={onClear}
      className="btn bg-gray-900 hover:bg-gray-800 text-white rounded-full px-10 shadow-xl transition-transform hover:scale-105 border-none"
    >
      Reset All Filters
    </button>
  </div>
);

function Search() {
  const [recipes, setRecipes] = useState([]);
  const [meta, setMeta] = useState({});
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const quickSelectDebounceRef = useRef(null);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    getValues,
    setValue,
    setFocus,
  } = useForm({
    mode: "onChange",
    defaultValues: defaultFormValues,
  });

  const watchedValues = watch();

  const updateField = (field, value) => {
    setValue(field, value, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
  };

  useEffect(() => {
    setFocus("query");
  }, [setFocus]);

  const buildSearchParams = (data = {}) => {
    const rating = +data.rating;
    const priceMin = +data.priceMin;
    const priceMax = +data.priceMax;

    return {
      query: data.query?.trim() || undefined,
      cuisine: data.cuisine || undefined,
      diet: data.dietaryPreferences?.length
        ? data.dietaryPreferences.join(",")
        : undefined,
      rating: rating > 0 ? rating : undefined,
      priceMin: priceMin > 0 ? priceMin : undefined,
      priceMax: priceMax > 0 ? priceMax : undefined,
      premium: data.premium || undefined,
      sort: data.sort,
      page: +data.page || 1,
      limit: +data.limit || 12,
    };
  };

  const searchRecipes = async (formData) => {
    try {
      setIsSearching(true);
      const params = buildSearchParams(formData);
      const res = await searchRecipeApi(params);

      setRecipes(res?.data?.recipes ?? []);
      setMeta(res?.data?.meta ?? {});
    } catch (err) {
      console.error("Recipe search failed:", err);
      setRecipes([]);
      setMeta({});
    } finally {
      setIsSearching(false);
    }
  };

  const applySearch = (updates = {}) => {
    const newValues = { ...getValues(), ...updates };
    reset(newValues);
    searchRecipes(newValues);
  };

  const onSubmit = (data) => {
    const updated = { ...data, page: 1 };
    searchRecipes(updated);
  };

  const handleSortChange = (value) => {
    applySearch({ sort: value, page: 1 });
  };

  const toggleQuickSelect = (pref) => {
    const current = getValues("dietaryPreferences") || [];
    const updatedList = current.includes(pref)
      ? current.filter((p) => p !== pref)
      : [...current, pref];

    updateField("dietaryPreferences", updatedList);

    if (quickSelectDebounceRef.current) {
      clearTimeout(quickSelectDebounceRef.current);
    }

    quickSelectDebounceRef.current = setTimeout(() => {
      searchRecipes({ ...getValues(), dietaryPreferences: updatedList, page: 1 });
    }, 600);
  };

  const toggleDietaryPreference = (pref) => {
    const current = getValues("dietaryPreferences") || [];
    updateField(
      "dietaryPreferences",
      current.includes(pref)
        ? current.filter((p) => p !== pref)
        : [...current, pref],
    );
  };

  const clearAllFilters = () => {
    reset(defaultFormValues);
    searchRecipes(defaultFormValues);
  };

  const changePage = (newPage) => {
    updateField("page", newPage);
    searchRecipes({ ...getValues(), page: newPage });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    const delay = setTimeout(() => {
      const values = getValues();
      searchRecipes({ ...values, page: 1 });
    }, 800);
    return () => clearTimeout(delay);
  }, [watchedValues.query]);

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (
      Number(watchedValues.priceMin) > 0 ||
      Number(watchedValues.priceMax) > 0
    )
      count++;
    if (Number(watchedValues.rating) > 0) count++;
    if (watchedValues.premium) count++;
    if (watchedValues.cuisine) count++;
    if (watchedValues.dietaryPreferences?.length) count++;
    return count;
  }, [watchedValues]);

  return (
    <HomeLayout>
      <div className="min-h-screen bg-gray-50/50">
        {/* HERO SECTION */}
        <div className="relative bg-linear-to-br from-orange-400 via-orange-500 to-red-500 pt-16 pb-28 px-4 overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://res.cloudinary.com/dpoqek1ce/image/upload/food_tjm7b4.png')] opacity-90 mix-blend-overlay"></div>
          <div className="relative z-10 max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-black text-white mb-4 drop-shadow-md tracking-tight">
              What are you craving?
            </h1>
            <p className="text-orange-100 text-lg md:text-xl font-medium mb-10">
              Discover thousands of recipes crafted by top chefs.
            </p>
          </div>
        </div>

        {/* FLOATING COMMAND CENTER */}
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 relative z-20 -mt-16">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* The Main Search Input Bar */}
            <div className="bg-white p-2 rounded-4xl shadow-2xl shadow-orange-500/10 flex items-center border border-gray-100 transition-all focus-within:shadow-orange-500/20 focus-within:ring-4 focus-within:ring-orange-100">
              <div className="pl-6 pr-4">
                <FaSearch className="w-6 h-6 text-orange-400" />
              </div>
              <input
                type="text"
                placeholder="Search recipes or cuisines..."
                className="flex-1 bg-transparent border-none outline-none text-gray-800 text-base md:text-xl py-3 md:py-4 placeholder-gray-400 font-medium truncate"
                {...register("query")}
              />
              <div className="pr-2 hidden sm:block">
                <button
                  type="submit"
                  className="btn bg-gray-900 hover:bg-gray-800 text-white border-none rounded-full px-8 text-base shadow-md"
                >
                  {isSearching ? (
                    <span className="loading loading-spinner"></span>
                  ) : (
                    "Search"
                  )}
                </button>
              </div>
            </div>

            {/* Quick Actions & Sort Toolbar */}
            <div className="bg-white rounded-3xl p-4 sm:px-6 flex flex-row items-center justify-between shadow-xl shadow-gray-200/50 border border-gray-100">
              <div className="hidden xl:flex flex-wrap items-center gap-2 w-auto">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mr-1 mb-0">
                  Quick Select
                </span>
                {DIETARY_OPTIONS.map((pref) => {
                  const selected =
                    watchedValues.dietaryPreferences?.includes(pref);
                  return (
                    <label
                      key={pref}
                      className={`cursor-pointer capitalize px-4 py-1.5 rounded-full text-sm font-bold transition-all duration-200 border select-none active:scale-95 ${
                        selected
                          ? "bg-orange-500 text-white border-orange-500 shadow-md shadow-orange-500/20"
                          : "bg-white text-gray-600 border-gray-200 hover:border-orange-300 hover:text-orange-600 hover:bg-orange-50 shadow-sm"
                      }`}
                    >
                      <input
                        type="checkbox"
                        className="hidden"
                        checked={selected}
                        onChange={() => toggleQuickSelect(pref)}
                      />
                      {pref}
                    </label>
                  );
                })}
              </div>

              {/* Advanced Toggle & Sort */}
              <div className="flex items-center gap-3 w-full xl:w-auto justify-between xl:justify-end shrink-0">
                <select
                  className="select select-bordered bg-gray-50 border-gray-200 focus:border-orange-400 rounded-full font-bold text-gray-600 uppercase text-xs"
                  value={watchedValues.sort}
                  onChange={(e) => handleSortChange(e.target.value)}
                >
                  {SORT_OPTIONS.map((sort) => (
                    <option key={sort} value={sort}>
                      {sort}
                    </option>
                  ))}
                </select>

                <button
                  type="button"
                  onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                  className={`btn rounded-full border-none transition-colors ${
                    showAdvancedFilters || activeFiltersCount > 0
                      ? "bg-orange-100 text-orange-600 hover:bg-orange-200"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  <FaSlidersH />
                  Advanced
                  {activeFiltersCount > 0 && (
                    <span className="badge bg-orange-500 border-none text-white badge-sm ml-1">
                      {activeFiltersCount}
                    </span>
                  )}
                </button>
              </div>
            </div>

            {/* COLLAPSIBLE ADVANCED FILTERS */}
            <div
              className={`transition-all duration-500 ease-in-out overflow-hidden rounded-3xl ${
                showAdvancedFilters
                  ? "opacity-100 max-h-[1000px] mt-4"
                  : "opacity-0 max-h-0 m-0"
              }`}
            >
              <div className="bg-white p-6 sm:p-8 shadow-xl shadow-gray-200/50 border border-gray-100 rounded-3xl">
                <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
                  <h3 className="font-black text-xl text-gray-800 flex items-center gap-2">
                    <FaFilter className="text-orange-500" /> Deep Filters
                  </h3>
                  <button
                    type="button"
                    onClick={clearAllFilters}
                    className="text-sm font-bold text-gray-400 hover:text-red-500 transition-colors"
                  >
                    Clear All
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                  <div className="space-y-3 xl:hidden md:col-span-2 lg:col-span-4">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                      Dietary Needs
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {DIETARY_OPTIONS.map((pref) => {
                        const selected =
                          watchedValues.dietaryPreferences?.includes(pref);
                        return (
                          <label
                            key={`mobile-${pref}`}
                            className={`cursor-pointer capitalize px-4 py-2 rounded-full text-sm font-bold transition-all duration-200 border select-none active:scale-95 ${
                              selected
                                ? "bg-orange-500 text-white border-orange-500 shadow-md shadow-orange-500/20"
                                : "bg-gray-50 text-gray-600 border-gray-200 hover:border-orange-300 hover:text-orange-600 hover:bg-orange-50 shadow-sm"
                            }`}
                          >
                            <input
                              type="checkbox"
                              className="hidden"
                              checked={selected}
                              onChange={() => toggleDietaryPreference(pref)}
                            />
                            {pref}
                          </label>
                        );
                      })}
                    </div>
                  </div>

                  {/* Cuisine Select */}
                  <div className="space-y-3">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                      Cuisine Type
                    </label>
                    <select
                      className="select select-bordered w-full bg-gray-50 border-gray-200 focus:border-orange-400 rounded-2xl text-gray-700 font-medium transition-all"
                      value={watchedValues.cuisine}
                      onChange={(e) => updateField("cuisine", e.target.value)}
                    >
                      <option value="">Any Cuisine</option>
                      {CUISINE_OPTIONS.map((cuisine) => (
                        <option
                          key={cuisine}
                          value={cuisine}
                          className="uppercase"
                        >
                          {cuisine}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Price Range */}
                  <div className="space-y-3">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1">
                      Budget <FaDollarSign className="text-orange-400" />
                    </label>
                    <div className="flex items-center gap-2 bg-gray-50 p-1.5 rounded-2xl border border-gray-200 focus-within:border-orange-400 transition-all">
                      <input
                        type="number"
                        className="input input-ghost w-full bg-transparent focus:bg-transparent h-10 px-3 text-center font-bold text-gray-700 placeholder-gray-400"
                        placeholder="Min"
                        {...register("priceMin", {
                          valueAsNumber: true,
                          min: 0,
                        })}
                      />
                      <div className="w-px h-6 bg-gray-300"></div>
                      <input
                        type="number"
                        className="input input-ghost w-full bg-transparent focus:bg-transparent h-10 px-3 text-center font-bold text-gray-700 placeholder-gray-400"
                        placeholder="Max"
                        {...register("priceMax", {
                          valueAsNumber: true,
                          validate: (value) => {
                            const min = getValues("priceMin");
                            if (!value || !min) return true;
                            return Number(value) >= Number(min) || "Invalid";
                          },
                        })}
                      />
                    </div>
                  </div>

                  {/* Rating Radio Buttons */}
                  <div className="space-y-3">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1">
                      Rating <FaStar className="text-amber-400" />
                    </label>
                    <div className="bg-gray-50 rounded-2xl border border-gray-200 p-1 flex">
                      {[0, 2, 3, 4, 4.5].map((stars) => (
                        <label
                          key={stars}
                          className={`flex-1 cursor-pointer py-2 text-center rounded-xl text-sm font-bold transition-all ${
                            Number(watchedValues.rating) === stars
                              ? "bg-white text-orange-600 shadow-sm border border-gray-100"
                              : "text-gray-500 hover:bg-gray-100"
                          }`}
                        >
                          <input
                            type="radio"
                            className="hidden"
                            name="rating"
                            checked={Number(watchedValues.rating) === stars}
                            onChange={() => updateField("rating", stars)}
                          />
                          {stars === 0 ? "Any" : `${stars}+`}
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Premium Toggle */}
                  <div className="space-y-3 flex flex-col justify-end pb-1">
                    <label
                      className={`flex items-center justify-between p-4 cursor-pointer rounded-2xl transition-all border ${
                        watchedValues.premium
                          ? "bg-linear-to-r from-orange-50 to-red-50 border-orange-200 shadow-inner"
                          : "bg-gray-50 border-gray-200 hover:border-orange-300"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <FaFire
                          className={`w-5 h-5 ${watchedValues.premium ? "text-red-500" : "text-gray-400"}`}
                        />
                        <span
                          className={`font-black ${watchedValues.premium ? "text-gray-900" : "text-gray-600"}`}
                        >
                          Premium Recipes
                        </span>
                      </div>
                      <input
                        type="checkbox"
                        className="toggle toggle-warning"
                        checked={!!watchedValues.premium}
                        onChange={(e) =>
                          updateField("premium", e.target.checked)
                        }
                      />
                    </label>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-100 flex justify-end">
                  <button
                    onClick={() => {
                      setShowAdvancedFilters(false);
                    }}
                    type="submit"
                    className="btn bg-gray-900 hover:bg-gray-800 text-white rounded-full px-8 w-full md:w-auto shadow-md"
                  >
                    Apply Filters
                  </button>
                </div>
              </div>
            </div>
          </form>

          {/* MAIN RESULTS AREA */}
          <div className="mt-12">
            <div className="mb-6 sm:flex sm:justify-between sm:items-end px-2">
              <h2 className="text-2xl font-black text-gray-800 truncate">
                {watchedValues.query
                  ? `Results for "${watchedValues.query}"`
                  : "Explore Recipes"}
              </h2>
              <span className="badge badge-neutral">
                {meta.total || 0} Found
              </span>
            </div>

            {isSearching ? (
              <RecipeGrid>
                {Array.from({ length: 12 }).map((_, i) => (
                  <RecipeCardSkeleton key={i} />
                ))}
              </RecipeGrid>
            ) : recipes.length === 0 ? (
              <EmptyState onClear={clearAllFilters} />
            ) : (
              <RecipeGrid>
                {recipes.map((recipe) => (
                  <RecipeCard key={recipe._id} recipe={recipe} />
                ))}
              </RecipeGrid>
            )}

            {/* Pagination Component */}
            {Number(meta?.totalPages || 1) > 1 && (
              <div className="flex justify-center pt-8 pb-16">
                <div className="join">
                  <button
                    className="join-item btn"
                    disabled={Number(meta?.page || 1) <= 1 || isSearching}
                    onClick={() => changePage(Number(meta?.page || 1) - 1)}
                  >
                    « Prev
                  </button>

                  <button className="join-item btn">
                    Page {Number(meta?.page || 1)} of{" "}
                    {Number(meta?.totalPages || 1)}
                  </button>

                  <button
                    className="join-item btn"
                    disabled={
                      isSearching ||
                      Number(meta?.page || 1) >= Number(meta?.totalPages || 1)
                    }
                    onClick={() => changePage(Number(meta?.page || 1) + 1)}
                  >
                    Next »
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </HomeLayout>
  );
}

export default Search;
