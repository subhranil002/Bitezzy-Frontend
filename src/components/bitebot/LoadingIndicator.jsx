import { FaRobot } from "react-icons/fa";

export default function LoadingIndicator() {
  return (
    <div className="flex justify-start flex-col">
      <div className="flex gap-3">
        <div className="w-9 h-9 rounded-full bg-linear-to-br from-gray-600 to-gray-800 flex items-center justify-center text-white">
          <FaRobot />
        </div>
        <div className="bg-white px-4 py-3 rounded-2xl shadow-sm border border-gray-200 flex items-center gap-2">
          <div className="flex space-x-1">
            <span className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-bounce"></span>
            <span className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-bounce delay-100"></span>
            <span className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-bounce delay-200"></span>
          </div>
          <span className="text-sm text-gray-600">Cooking up ideas...</span>
        </div>
      </div>
      <img
        src="https://res.cloudinary.com/dpoqek1ce/image/upload/Cooking_lq8bsy.gif"
        alt="loading gif"
        className="w-[60%]"
      />
    </div>
  );
}
