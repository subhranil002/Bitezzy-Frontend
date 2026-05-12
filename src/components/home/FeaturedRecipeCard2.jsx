import { FaStar } from "react-icons/fa";

export default function FeaturedRecipeCard2() {
  return (
    <div className="group absolute top-[8%] md:top-[15%] -right-[5%] md:right-[5%] lg:right-[12%] w-36 md:w-44 lg:w-52 bg-white/80 backdrop-blur-xl border border-white p-2.5 md:p-3 rounded-3xl shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] animate-drift-2 z-0 opacity-50 md:opacity-70 xl:opacity-100 hover:z-20 transition-all hover:scale-110 hover:shadow-[0_40px_70px_-15px_rgba(249,115,22,0.15)] hover:!animate-none duration-500">
      <div className="rounded-2xl overflow-hidden pointer-events-none">
        <img
          src="https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=400&q=80"
          className="w-full h-24 md:h-32 object-cover transition-transform duration-700 group-hover:scale-110"
          alt="Pasta"
        />
      </div>
      <div className="mt-3 md:mt-4 px-2 pb-1">
        <h3 className="font-bold text-slate-800 text-xs md:text-sm tracking-tight">
          Garlic Pasta
        </h3>
        <div className="flex items-center gap-1.5 text-[10px] md:text-xs text-slate-500 mt-1 md:mt-1.5 font-medium">
          <FaStar className="text-amber-400 w-3 h-3 md:w-3.5 md:h-3.5" /> 4.8{" "}
          <span className="mx-0.5">•</span> 25m
        </div>
      </div>
    </div>
  );
}
