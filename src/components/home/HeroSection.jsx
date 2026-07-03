import { useEffect } from "react";
import { FaArrowRight } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import { getTrendingPremium } from "../../redux/slices/homeSlice";
import FeaturedRecipeCard1 from "./FeaturedRecipeCard1";
import FeaturedRecipeCard2 from "./FeaturedRecipeCard2";
import FeaturedRecipeCard3 from "./FeaturedRecipeCard3";
import FeaturedRecipeCard4 from "./FeaturedRecipeCard4";

export default function HeroSection() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { trendingPremium, isTrendingPremiumLoading } = useSelector(
    (state) => state.home,
  );

  useEffect(() => {
    dispatch(getTrendingPremium(4));
  }, []);

  return (
    <section className="relative min-h-[100svh] md:min-h-[90vh] flex items-center justify-center overflow-hidden bg-linear-to-br from-orange-50 to-amber-50 py-20 md:py-0">
      {/* --- STUDIO LIGHTING & TEXTURE --- */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.8)_0%,transparent_70%)] pointer-events-none" />

      {!isTrendingPremiumLoading && (
        <>
          {/* Card 1: Top Left */}
          <FeaturedRecipeCard1 recipe={trendingPremium[0]} />

          {/* Card 2: Top Right */}
          <FeaturedRecipeCard2 recipe={trendingPremium[1]} />

          {/* Card 3: Bottom Left */}
          <FeaturedRecipeCard3 recipe={trendingPremium[2]} />

          {/* Card 4: Bottom Right */}
          <FeaturedRecipeCard4 recipe={trendingPremium[3]} />
        </>
      )}

      {/* --- CTA --- */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 text-center max-w-4xl pointer-events-none">
        {/* Top Badge */}
        <div
          className="inline-flex items-center justify-center gap-2.5 px-4 sm:px-6 py-2 sm:py-2.5 rounded-full bg-white/90 backdrop-blur-sm border border-slate-200/60 text-slate-600 font-bold text-xs sm:text-sm mb-8 sm:mb-10 shadow-sm pointer-events-auto transition-transform hover:scale-105 cursor-pointer"
          onClick={() => navigate("/chat")}
        >
          <div className="relative flex h-2 w-2 sm:h-2.5 sm:w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 sm:h-2.5 sm:w-2.5 bg-orange-500"></span>
          </div>
          AI-Powered Search
        </div>

        {/* Main Headline */}
        <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-slate-900 tracking-tighter leading-[1.05] sm:leading-[1.05] mb-6 sm:mb-8 pointer-events-auto">
          Cook your next <br className="hidden sm:block" />
          <span className="relative inline-block mt-1 sm:mt-0">
            {/* Glowing blur behind the text */}
            <span className="absolute inset-0 bg-gradient-to-r from-orange-400 to-red-500 blur-xl sm:blur-2xl opacity-30 mix-blend-multiply"></span>
            <span className="relative text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-red-500 to-rose-500">
              masterpiece.
            </span>
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-lg md:text-xl text-black/90 mb-10 sm:mb-12 max-w-2xl mx-auto font-medium leading-relaxed pointer-events-auto px-2 sm:px-0">
          Discover perfect recipes using AI-powered search. Find dishes based on
          ingredients you already have and connect with talented chefs
          worldwide.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-5 pointer-events-auto w-full max-w-md sm:max-w-none mx-auto">
          <Link
            to="/chat"
            className="group flex items-center justify-center gap-3 w-full sm:w-auto px-6 sm:px-8 py-4 rounded-2xl bg-slate-900 text-white font-bold text-base sm:text-lg transition-all duration-300 shadow-xl shadow-slate-900/20 ring-4 ring-transparent hover:ring-slate-900/10 active:scale-95"
          >
            Start Cooking
            <FaArrowRight className="transition-transform duration-300 group-hover:translate-x-1.5" />
          </Link>

          <Link
            to="/search"
            className="flex items-center justify-center gap-3 w-full sm:w-auto px-6 sm:px-8 py-4 rounded-2xl bg-white/80 backdrop-blur-md border border-slate-200/80 text-slate-700 font-bold text-base sm:text-lg transition-all duration-300 shadow-sm active:scale-95 ring-4 ring-transparent hover:ring-orange-200"
          >
            Explore Recipes
          </Link>
        </div>
      </div>
    </section>
  );
}
