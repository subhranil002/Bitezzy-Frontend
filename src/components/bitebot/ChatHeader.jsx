import { FaArrowLeft, FaChevronDown, FaRobot } from "react-icons/fa";
import { RiChatNewFill } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { clearChat, setLanguage } from "../../redux/slices/chatSlice";

export default function ChatHeader() {
  const { language } = useSelector((state) => state.chat);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 bg-white/85 backdrop-blur-lg border-b border-gray-100 py-3 px-4 sm:px-6 flex items-center justify-between shadow-sm transition-all">
      {/* Left: Back Button & Branding */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="p-2.5 bg-gray-50 cursor-pointer text-gray-600 hover:bg-orange-50 hover:text-orange-600 rounded-full transition-colors flex items-center justify-center"
          aria-label="Go back"
        >
          <FaArrowLeft className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-linear-to-br from-orange-500 to-amber-500 flex items-center justify-center shadow-md shadow-orange-500/20">
            <FaRobot className="w-4 h-4 text-white" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-lg font-bold text-gray-900 tracking-tight leading-none flex items-center gap-1.5">
              BiteBot
              <span className="text-[9px] font-extrabold tracking-wider bg-orange-100 text-orange-600 px-1.5 py-0.5 rounded-sm uppercase">
                Beta
              </span>
            </h1>
          </div>
        </div>
      </div>

      {/* Right: Controls */}
      <div className="flex items-center gap-2 relative">
        {/* New Chat Button */}
        <button
          onClick={() => dispatch(clearChat())}
          className="btn btn-ghost hover:text-orange-600"
          aria-label="New chat"
        >
          <RiChatNewFill className="w-4 h-4" />
          <span className="hidden sm:inline-block">New chat</span>
        </button>

        {/* Language Selector */}
        <div className="relative">
          <select
            value={language}
            onChange={(e) => dispatch(setLanguage(e.target.value))}
            className="appearance-none bg-gray-50 border border-gray-200 text-gray-700 text-xs font-semibold rounded-lg pl-3 pr-7 py-2 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-400 cursor-pointer hover:bg-gray-100 transition-colors"
          >
            <option value="en">English</option>
            <option value="hi">Hindi</option>
            <option value="bn">Bengali</option>
          </select>
          <div className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-[10px]">
            <FaChevronDown />
          </div>
        </div>
      </div>
    </header>
  );
}
