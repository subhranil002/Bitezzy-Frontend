import { useEffect } from "react";
import { AiFillStar } from "react-icons/ai";
import { FaBolt, FaFire, FaGem, FaUser } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";

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

export default function HomeCarousels() {
  const dispatch = useDispatch();
  const { isLoggedIn } = useSelector((state) => state.auth);
  const {
    trendingNow,
    freshAndNew,
    recommendedForYou,
    quickAndEasy,
    premiumPicks,
    isTrendingNowLoading,
    isFreshAndNewLoading,
    isRecommendedForYouLoading,
    isQuickAndEasyLoading,
    isPremiumPicksLoading,
  } = useSelector((state) => state.home);

  useEffect(() => {
    if (trendingNow.length === 0) dispatch(getTrending(12));
    if (freshAndNew.length === 0) dispatch(getFreshAndNew(12));
    if (quickAndEasy.length === 0) dispatch(getQuickAndEasy(12));
    if (premiumPicks.length === 0) dispatch(getPremium(12));
    if (isLoggedIn && recommendedForYou.length === 0)
      dispatch(getRecommended(12));
  }, [isLoggedIn]);

  return (
    <div className="mx-auto sm:px-6 lg:px-8 space-y-10 bg-white py-10">
      {isLoggedIn && isRecommendedForYouLoading ? (
        <section key="for-you" className="space-y-6" id="for-you">
          <div className="px-1 sm:px-2">
            <RecipeCarouselSkeleton key="for-you" />
          </div>
        </section>
      ) : (
        <section key="for-you" className="space-y-6" id="for-you">
          <div className="px-1 sm:px-2">
            <RecipeCarousel
              title={
                <Title
                  Icon={FaUser}
                  gradient="bg-gradient-to-r from-orange-400 via-red-400 to-amber-400"
                >
                  Recommended
                </Title>
              }
              recipes={recommendedForYou}
            />
          </div>
        </section>
      )}
      {isTrendingNowLoading ? (
        <section key="trending" className="space-y-6" id="trending">
          <div className="px-1 sm:px-2">
            <RecipeCarouselSkeleton key="trending" />
          </div>
        </section>
      ) : (
        <section key="trending" className="space-y-6" id="trending">
          <div className="px-1 sm:px-2">
            <RecipeCarousel
              title={
                <Title
                  Icon={FaFire}
                  gradient="bg-gradient-to-r from-orange-500 to-red-500"
                  pad="px-2 sm:px-2"
                >
                  Trending Now
                </Title>
              }
              recipes={trendingNow}
            />
          </div>
        </section>
      )}
      {isFreshAndNewLoading ? (
        <section key="fresh" className="space-y-6" id="fresh">
          <div className="px-1 sm:px-2">
            <RecipeCarouselSkeleton key="fresh" />
          </div>
        </section>
      ) : (
        <section key="fresh" className="space-y-6" id="fresh">
          <div className="px-1 sm:px-2">
            <RecipeCarousel
              title={
                <Title
                  Icon={AiFillStar}
                  gradient="bg-gradient-to-r from-yellow-500 to-amber-500"
                >
                  Fresh &amp; New
                </Title>
              }
              recipes={freshAndNew}
            />
          </div>
        </section>
      )}
      {isQuickAndEasyLoading ? (
        <section key="quick" className="space-y-6" id="quick">
          <div className="px-1 sm:px-2">
            <RecipeCarouselSkeleton key="quick" />
          </div>
        </section>
      ) : (
        <section key="quick" className="space-y-6" id="quick">
          <div className="px-1 sm:px-2">
            <RecipeCarousel
              title={
                <Title
                  Icon={FaBolt}
                  gradient="bg-gradient-to-r from-orange-400 via-red-400 to-amber-400"
                >
                  Quick &amp; Easy
                </Title>
              }
              recipes={quickAndEasy}
            />
          </div>
        </section>
      )}
      {isPremiumPicksLoading ? (
        <section key="premium" className="space-y-6" id="premium">
          <div className="px-1 sm:px-2">
            <RecipeCarouselSkeleton key="premium" />
          </div>
        </section>
      ) : (
        <section key="premium" className="space-y-6" id="premium">
          <div className="px-1 sm:px-2">
            <RecipeCarousel
              title={
                <Title
                  Icon={FaGem}
                  gradient="bg-gradient-to-r from-yellow-400 to-orange-400"
                >
                  Premium Picks
                </Title>
              }
              recipes={premiumPicks}
            />
          </div>
        </section>
      )}
    </div>
  );
}
