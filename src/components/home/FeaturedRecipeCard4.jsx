import { FaStar } from 'react-icons/fa';

export default function FeaturedRecipeCard4() {
  return (
    <div className="group absolute bottom-[10%] lg:bottom-[12%] right-[2%] lg:right-[4%] xl:right-[12%] w-40 lg:w-48 bg-white/80 backdrop-blur-xl border border-white p-3 rounded-3xl shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] animate-drift-4 z-0 hidden md:block hover:z-20 transition-all hover:scale-110 hover:shadow-[0_40px_70px_-15px_rgba(249,115,22,0.15)] hover:!animate-none duration-500 cursor-pointer opacity-50 md:opacity-70 xl:opacity-100">
        <div className="rounded-2xl overflow-hidden pointer-events-none">
          <img
            src="https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&q=80"
            className="w-full h-28 lg:h-32 object-cover transition-transform duration-700 group-hover:scale-110"
            alt="Burger"
          />
        </div>
        <div className="mt-4 px-2 pb-1">
          <h3 className="font-bold text-slate-800 text-xs lg:text-sm tracking-tight">
            Gourmet Burger
          </h3>
          <div className="flex items-center gap-1.5 text-[10px] lg:text-xs text-slate-500 mt-1.5 font-medium">
            <FaStar className="text-amber-400 w-3 h-3 lg:w-3.5 lg:h-3.5" /> 5.0{" "}
            <span className="mx-0.5">•</span> 20m
          </div>
        </div>
      </div>
  )
}