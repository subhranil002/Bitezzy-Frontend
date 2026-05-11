import { FaArrowRight, FaSearch, FaStar, FaClock } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function HeroSection() {
  return (
    // Changed to 100svh for perfect mobile viewport handling, added vertical padding for small screens
    <section className="relative min-h-[100svh] md:min-h-[90vh] flex items-center justify-center overflow-hidden bg-[#fafafa] py-20 md:py-0">

      {/* --- STUDIO LIGHTING & TEXTURE --- */}
      <div className="absolute inset-0 bg-[url('https://res.cloudinary.com/dz209s6jk/image/upload/v1606503953/bg-pattern_1_i8szyw.png')] opacity-[0.03] bg-repeat pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.8)_0%,transparent_70%)] pointer-events-none" />

      {/* --- CSS ANIMATIONS --- */}
      <style>{`
        @keyframes drift-1 {
          0%, 100% { transform: translate(0px, 0px) rotate(-12deg); }
          33% { transform: translate(20px, -20px) rotate(-8deg); }
          66% { transform: translate(-10px, 15px) rotate(-16deg); }
        }
        @keyframes drift-2 {
          0%, 100% { transform: translate(0px, 0px) rotate(6deg); }
          33% { transform: translate(-20px, 15px) rotate(10deg); }
          66% { transform: translate(15px, -20px) rotate(2deg); }
        }
        @keyframes drift-3 {
          0%, 100% { transform: translate(0px, 0px) rotate(12deg); }
          33% { transform: translate(15px, 20px) rotate(6deg); }
          66% { transform: translate(-20px, -15px) rotate(16deg); }
        }
        @keyframes drift-4 {
          0%, 100% { transform: translate(0px, 0px) rotate(-6deg); }
          33% { transform: translate(-15px, -20px) rotate(-2deg); }
          66% { transform: translate(20px, 15px) rotate(-10deg); }
        }

        .animate-drift-1 { animation: drift-1 12s ease-in-out infinite; }
        .animate-drift-2 { animation: drift-2 15s ease-in-out infinite; }
        .animate-drift-3 { animation: drift-3 14s ease-in-out infinite; }
        .animate-drift-4 { animation: drift-4 16s ease-in-out infinite; }
      `}</style>

      {/* --- BACKGROUND LAYER: DRIFTING GLASS CARDS --- */}

      {/* Card 1: Top Left - Shrunk to w-36 and opacity-30 on mobile */}
      <div className="group absolute top-[5%] md:top-[10%] -left-[5%] md:left-[5%] lg:left-[12%] w-36 md:w-48 lg:w-56 bg-white/80 backdrop-blur-xl border border-white p-2.5 md:p-3 rounded-3xl shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] animate-drift-1 z-0 opacity-30 md:opacity-80 lg:opacity-100 hover:z-20 transition-all hover:scale-110 hover:shadow-[0_40px_70px_-15px_rgba(249,115,22,0.15)] hover:!animate-none duration-500">
        <div className="rounded-2xl overflow-hidden pointer-events-none">
          <img
            src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=80"
            className="w-full h-24 md:h-32 object-cover transition-transform duration-700 group-hover:scale-110"
            alt="Poke Bowl"
          />
        </div>
        <div className="mt-3 md:mt-4 px-2 pb-1">
          <h3 className="font-bold text-slate-800 text-xs md:text-sm tracking-tight">Spicy Poke Bowl</h3>
          <div className="flex items-center gap-1.5 text-[10px] md:text-xs text-slate-500 mt-1 md:mt-1.5 font-medium">
            <FaStar className="text-amber-400 w-3 h-3 md:w-3.5 md:h-3.5" /> 4.9 <span className="mx-0.5">•</span> 15m
          </div>
        </div>
      </div>

      {/* Card 2: Top Right - Shrunk to w-36 and opacity-30 on mobile */}
      <div className="group absolute top-[8%] md:top-[15%] -right-[5%] md:right-[5%] lg:right-[12%] w-36 md:w-44 lg:w-52 bg-white/80 backdrop-blur-xl border border-white p-2.5 md:p-3 rounded-3xl shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] animate-drift-2 z-0 opacity-30 md:opacity-80 lg:opacity-100 hover:z-20 transition-all hover:scale-110 hover:shadow-[0_40px_70px_-15px_rgba(249,115,22,0.15)] hover:!animate-none duration-500">
        <div className="rounded-2xl overflow-hidden pointer-events-none">
          <img
            src="https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=400&q=80"
            className="w-full h-24 md:h-32 object-cover transition-transform duration-700 group-hover:scale-110"
            alt="Pasta"
          />
        </div>
        <div className="mt-3 md:mt-4 px-2 pb-1">
          <h3 className="font-bold text-slate-800 text-xs md:text-sm tracking-tight">Garlic Pasta</h3>
          <div className="flex items-center gap-1.5 text-[10px] md:text-xs text-slate-500 mt-1 md:mt-1.5 font-medium">
            <FaStar className="text-amber-400 w-3 h-3 md:w-3.5 md:h-3.5" /> 4.8 <span className="mx-0.5">•</span> 25m
          </div>
        </div>
      </div>

      {/* Card 3: Bottom Left */}
      <div className="group absolute bottom-[5%] lg:bottom-[8%] left-[2%] lg:left-[4%] xl:left-[12%] w-44 lg:w-52 bg-white/80 backdrop-blur-xl border border-white p-3 rounded-3xl shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] animate-drift-3 z-0 hidden md:block hover:z-20 transition-all hover:scale-110 hover:shadow-[0_40px_70px_-15px_rgba(249,115,22,0.15)] hover:!animate-none duration-500 cursor-pointer">
        <div className="rounded-2xl overflow-hidden pointer-events-none">
          <img
            src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&q=80"
            className="w-full h-32 lg:h-36 object-cover transition-transform duration-700 group-hover:scale-110"
            alt="Pizza"
          />
        </div>
        <div className="mt-4 px-2 pb-1">
          <h3 className="font-bold text-slate-800 text-xs lg:text-sm tracking-tight">Rustic Pizza</h3>
          <div className="flex items-center gap-1.5 text-[10px] lg:text-xs text-slate-500 mt-1.5 font-medium">
            <FaClock className="text-orange-400 w-3 h-3 lg:w-3.5 lg:h-3.5" /> 45m Prep
          </div>
        </div>
      </div>

      {/* Card 4: Bottom Right */}
      <div className="group absolute bottom-[10%] lg:bottom-[12%] right-[2%] lg:right-[4%] xl:right-[12%] w-40 lg:w-48 bg-white/80 backdrop-blur-xl border border-white p-3 rounded-3xl shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] animate-drift-4 z-0 hidden md:block hover:z-20 transition-all hover:scale-110 hover:shadow-[0_40px_70px_-15px_rgba(249,115,22,0.15)] hover:!animate-none duration-500 cursor-pointer">
        <div className="rounded-2xl overflow-hidden pointer-events-none">
          <img
            src="https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&q=80"
            className="w-full h-28 lg:h-32 object-cover transition-transform duration-700 group-hover:scale-110"
            alt="Burger"
          />
        </div>
        <div className="mt-4 px-2 pb-1">
          <h3 className="font-bold text-slate-800 text-xs lg:text-sm tracking-tight">Gourmet Burger</h3>
          <div className="flex items-center gap-1.5 text-[10px] lg:text-xs text-slate-500 mt-1.5 font-medium">
            <FaStar className="text-amber-400 w-3 h-3 lg:w-3.5 lg:h-3.5" /> 5.0 <span className="mx-0.5">•</span> 20m
          </div>
        </div>
      </div>

      {/* --- FOREGROUND LAYER: CENTER TEXT & CTA --- */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 text-center max-w-4xl pointer-events-none">

        {/* Top Badge */}
        <div className="inline-flex items-center justify-center gap-2.5 px-4 sm:px-6 py-2 sm:py-2.5 rounded-full bg-white/90 backdrop-blur-sm border border-slate-200/60 text-slate-600 font-bold text-xs sm:text-sm mb-8 sm:mb-10 shadow-sm pointer-events-auto transition-transform hover:scale-105 cursor-default">
          <div className="relative flex h-2 w-2 sm:h-2.5 sm:w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 sm:h-2.5 sm:w-2.5 bg-orange-500"></span>
          </div>
          AI-Powered Search
        </div>

        {/* Main Headline - Scaled fluidly for all devices */}
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
          Discover perfect recipes using AI-powered search. Find dishes based on ingredients you already have and connect with talented chefs worldwide.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-5 pointer-events-auto w-full max-w-md sm:max-w-none mx-auto">
          <Link
            to="/chat"
            className="group flex items-center justify-center gap-3 w-full sm:w-auto px-6 sm:px-8 py-4 rounded-2xl bg-slate-900 text-white font-bold text-base sm:text-lg hover:bg-slate-800 transition-all duration-300 shadow-xl shadow-slate-900/20 ring-4 ring-transparent hover:ring-slate-900/10 active:scale-95"
          >
            Start Chating
            <FaArrowRight className="transition-transform duration-300 group-hover:translate-x-1.5" />
          </Link>

          <Link
            to="/search"
            className="flex items-center justify-center gap-3 w-full sm:w-auto px-6 sm:px-8 py-4 rounded-2xl bg-white/80 backdrop-blur-md border border-slate-200/80 text-slate-700 font-bold text-base sm:text-lg hover:border-orange-200 hover:bg-orange-50 transition-all duration-300 shadow-sm active:scale-95"
          >
            Explore Recipes
          </Link>
        </div>

      </div>

    </section>
  );
}