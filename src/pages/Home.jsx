import HeroSection from "../components/home/HeroSection";
import RecipeCarousels from "../components/home/RecipeCarousels";
import HomeLayout from "../layouts/HomeLayout";

export default function Home() {
  return (
    <HomeLayout>
      {/* Top banner / introduction section */}
      <HeroSection />

      {/* Recipe category carousels */}
      <RecipeCarousels />
    </HomeLayout>
  );
}
