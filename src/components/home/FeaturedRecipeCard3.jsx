import { FaStar } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function FeaturedRecipeCard3({ recipe }) {
  const navigate = useNavigate();

  return (
    <div
      className="group absolute bottom-[5%] lg:bottom-[8%] left-[2%] lg:left-[4%] xl:left-[12%] w-44 lg:w-52 bg-white/80 backdrop-blur-xl border border-white p-3 rounded-3xl shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] animate-drift-3 z-0 hidden md:block hover:z-20 transition-all hover:scale-110 hover:shadow-[0_40px_70px_-15px_rgba(249,115,22,0.15)] hover:!animate-none duration-500 cursor-pointer opacity-50 md:opacity-70 xl:opacity-100"
      onClick={() => recipe?._id && navigate(`/recipe/${recipe._id}`)}
    >
      <div className="rounded-2xl overflow-hidden pointer-events-none">
        <img
          src={
            recipe?.thumbnail?.secure_url ||
            "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&q=80"
          }
          className="w-full h-32 lg:h-36 object-cover transition-transform duration-700 group-hover:scale-110"
          alt={recipe?.title || "Pizza"}
        />
      </div>

      <div className="mt-4 px-2 pb-1">
        <h3 className="font-bold text-slate-800 text-xs lg:text-sm tracking-tight">
          {recipe?.title || "Rustic Pizza"}
        </h3>

        <div className="flex items-center gap-1.5 text-[10px] lg:text-xs text-slate-500 mt-1.5 font-medium">
          <FaStar className="text-amber-400 w-3 h-3 lg:w-3.5 lg:h-3.5" />
          {recipe?.averageRating || "4.7"}
          <span className="mx-0.5">•</span>
          {(recipe && `${recipe.totalCookingTime}m`) || "45m"}
        </div>
      </div>
    </div>
  );
}
