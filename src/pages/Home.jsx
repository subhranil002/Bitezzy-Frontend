import HeroSection from "../components/home/HeroSection";
import HomeCarousels from "../components/home/HomeCarousels";
import HomeLayout from "../layouts/HomeLayout";

export default function Home() {
  return (
    <HomeLayout>
      {/* Top banner / introduction section */}
      <HeroSection />

      {/* Recipe category carousels */}
      <HomeCarousels />
    </HomeLayout>
  );
}
