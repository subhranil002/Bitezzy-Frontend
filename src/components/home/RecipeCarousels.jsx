// Finalized

import { useEffect, useState } from "react";
import { AiFillStar } from "react-icons/ai";
import { FaBolt, FaFire, FaGem, FaUser } from "react-icons/fa";
import { shallowEqual, useDispatch, useSelector } from "react-redux";

import {
  getFreshAndNew,
  getPremium,
  getQuickAndEasy,
  getRecommended,
  getTrending,
} from "../../redux/slices/homeSlice";
import RecipeCarousel from "../recipe/RecipeCarousel";
import RecipeCarouselSkeleton from "../recipe/RecipeCarouselSkeleton";

/* Reusable section title with icon + gradient text */
const Title = ({ Icon, gradient, children, pad = "px-1 sm:px-2" }) => (
  <h2
    className={`flex items-center gap-3 text-2xl sm:text-3xl font-extrabold text-gray-800 ${pad}`}
  >
    <Icon className="text-orange-500 drop-shadow-sm" />
    <span className={`${gradient} bg-clip-text text-transparent`}>
      {children}
    </span>
  </h2>
);

export default function RecipeCarousels() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  // Select required slices from Redux store (optimized with shallowEqual)
  const {
    trendingNow,
    freshAndNew,
    recommendedForYou,
    quickAndEasy,
    premiumPicks,
    isLoggedIn,
  } = useSelector(
    (state) => ({
      trendingNow: state.home.trendingNow,
      freshAndNew: state.home.freshAndNew,
      recommendedForYou: state.home.recommendedForYou,
      quickAndEasy: state.home.quickAndEasy,
      premiumPicks: state.home.premiumPicks,
      isLoggedIn: state.auth.isLoggedIn,
    }),
    shallowEqual,
  );

  // Fetch data only if not already available
  useEffect(() => {
    (async () => {
      setLoading(true);

      const requests = [];

      if (trendingNow.length === 0) requests.push(dispatch(getTrending(12)));

      if (freshAndNew.length === 0) requests.push(dispatch(getFreshAndNew(12)));

      if (quickAndEasy.length === 0)
        requests.push(dispatch(getQuickAndEasy(12)));

      if (premiumPicks.length === 0) requests.push(dispatch(getPremium(12)));

      if (isLoggedIn && recommendedForYou.length === 0)
        requests.push(dispatch(getRecommended(12)));

      await Promise.all(requests);

      setLoading(false);
    })();
  }, [isLoggedIn]);

  // Section configuration for dynamic rendering
  const sections = [
    {
      id: "for-you",
      title: (
        <Title
          Icon={FaUser}
          gradient="bg-gradient-to-r from-orange-400 via-red-400 to-amber-400"
        >
          Recommended
        </Title>
      ),
      recipes: recommendedForYou,
    },
    {
      id: "trending",
      title: (
        <Title
          Icon={FaFire}
          gradient="bg-gradient-to-r from-orange-500 to-red-500"
          pad="px-2 sm:px-2"
        >
          Trending Now
        </Title>
      ),
      recipes: trendingNow,
      pad: "sm:px-2",
    },
    {
      id: "fresh",
      title: (
        <Title
          Icon={AiFillStar}
          gradient="bg-gradient-to-r from-yellow-500 to-amber-500"
        >
          Fresh &amp; New
        </Title>
      ),
      recipes: freshAndNew,
    },
    {
      id: "quick",
      title: (
        <Title
          Icon={FaBolt}
          gradient="bg-gradient-to-r from-orange-400 via-red-400 to-amber-400"
        >
          Quick &amp; Easy
        </Title>
      ),
      recipes: quickAndEasy,
    },
    {
      id: "premium",
      title: (
        <Title
          Icon={FaGem}
          gradient="bg-gradient-to-r from-yellow-400 to-orange-400"
        >
          Premium Picks
        </Title>
      ),
      recipes: premiumPicks,
    },
  ];

  if (loading)
    return (
      <>
        {sections.map((_, i) => (
          <section key={i} className="space-y-6" id={i}>
            <div className="px-1 sm:px-2">
              <RecipeCarouselSkeleton key={i} />
            </div>
          </section>
        ))}
      </>
    );

  return (
    <div className="mx-auto sm:px-6 lg:px-8 space-y-10 bg-white py-10">
      {/* Render each carousel section dynamically */}
      {sections.map(({ id, title, recipes }) => (
        <section key={id} className="space-y-6" id={id}>
          <div className="px-1 sm:px-2">
            <RecipeCarousel title={title} recipes={recipes} />
          </div>
        </section>
      ))}
    </div>
  );
}
