import { useNavigate } from "react-router-dom";

export default function RecipeChatCard({recipe}) {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gray-100 relative">
      <img
        src={recipe.thumbnail?.secure_url}
        alt={recipe.title}
        className="w-full h-32 object-cover"
      />
      <div className="p-3">
        <h3 className="font-medium text-gray-800 text-sm line-clamp-1">
          {recipe.title}
        </h3>
        <div className="flex justify-between items-center mt-2">
          <span className="text-xs text-orange-600 font-medium">
            {recipe.cuisine}
          </span>
          <button
            onClick={() => navigate(`/recipe/${recipe._id.toString()}`)}
            className="not-[]:text-xs px-3 py-1 rounded-full hover:scale-105 transition-transform bg-orange-500 text-white hover:bg-orange-600 cursor-pointer"
          >
            View
          </button>
        </div>
      </div>
    </div>
  );
}
