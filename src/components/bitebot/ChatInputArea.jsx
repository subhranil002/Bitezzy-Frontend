import { useState } from "react";
import { FaLightbulb, FaPaperPlane, FaTimes, FaUtensils } from "react-icons/fa";
import { LuCookingPot } from "react-icons/lu";
import { useDispatch, useSelector } from "react-redux";

import {
    sendMessage,
  setCookingTipTool,
  setRecipeSearchTool,
} from "../../redux/slices/chatSlice";

export default function ChatInputArea() {
  const { quickSuggestions, messages, toolInUse, isLoading } = useSelector(
    (state) => state.chat,
  );
  const dispatch = useDispatch();
  const [inputMessage, setInputMessage] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleSendMessage = () => {
    const userInput = inputMessage.trim();
    if (!userInput || isLoading) return;
    setInputMessage("");
    setIsMenuOpen(false);
    dispatch(sendMessage({ userMessage: userInput }));
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-xl border-t border-gray-200 px-4 py-4 z-50">
      <div className="max-w-4xl mx-auto space-y-3">
        {/* Quick Suggestions */}
        {messages?.length === 1 && (
          <div className="flex flex-wrap gap-2 justify-center">
            {quickSuggestions.map((suggestion, i) => (
              <button
                key={i}
                onClick={() => setInputMessage(suggestion)}
                className="text-xs px-3 py-1.5 bg-gray-50 border border-gray-200 text-gray-600 rounded-full hover:bg-orange-50 hover:border-orange-200 hover:text-orange-600 transition-colors cursor-pointer"
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}

        {/* Input + Send + Menu */}
        <div className="flex flex-col gap-2">
          {/* Show Selected Tool Badge */}
          {(toolInUse.isRecipeSearch || toolInUse.isCookingTip) && (
            <div className="flex items-center">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-gray-100 border border-gray-200 text-gray-700 shadow-sm transition-all">
                {toolInUse.isRecipeSearch && (
                  <>
                    <FaUtensils className="text-orange-500 w-3 h-3" />
                    <span className="ml-1">Find Recipe</span>
                  </>
                )}
                {toolInUse.isCookingTip && (
                  <>
                    <FaLightbulb className="text-amber-500 w-3 h-3" />
                    <span className="ml-1">Cooking Tips</span>
                  </>
                )}
                <button
                  onClick={() => {
                    dispatch(setRecipeSearchTool(false));
                    dispatch(setCookingTipTool(false));
                  }}
                  className="ml-1 p-0.5 text-gray-400 hover:text-red-500 hover:bg-gray-200 rounded-full transition-colors cursor-pointer"
                  aria-label="Clear tool"
                >
                  <FaTimes className="w-3 h-3" />
                </button>
              </span>
            </div>
          )}

          <div className="flex gap-3 items-end">
            {/* 3-Dot Menu Toggle */}
            <div className="relative shrink-0">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className={`p-3 rounded-full cursor-pointer transition-colors ${
                  isMenuOpen
                    ? "bg-gray-200 text-gray-900"
                    : "bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-900"
                }`}
                aria-label="Menu options"
              >
                <LuCookingPot className="w-5 h-5" />
              </button>

              {/* The Dropdown Card */}
              {isMenuOpen && (
                <div className="absolute left-0 bottom-full mb-3 w-48 bg-white rounded-xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden transform origin-bottom-left transition-all z-50">
                  <div className="p-1.5 flex flex-col gap-1">
                    <button
                      onClick={() => {
                        dispatch(setRecipeSearchTool(true));
                        setIsMenuOpen(false);
                      }}
                      className={`w-full cursor-pointer flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg transition-colors ${
                        toolInUse.isRecipeSearch
                          ? "bg-orange-50 text-orange-600 font-medium"
                          : "text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      <FaUtensils
                        className={
                          toolInUse.isRecipeSearch
                            ? "text-orange-500"
                            : "text-gray-400"
                        }
                      />
                      Find Recipe
                    </button>

                    <button
                      onClick={() => {
                        dispatch(setCookingTipTool(true));
                        setIsMenuOpen(false);
                      }}
                      className={`w-full cursor-pointer flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg transition-colors ${
                        toolInUse.isCookingTip
                          ? "bg-amber-50 text-amber-600 font-medium"
                          : "text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      <FaLightbulb
                        className={
                          toolInUse.isCookingTip
                            ? "text-amber-500"
                            : "text-gray-400"
                        }
                      />
                      Cooking Tips
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Textarea */}
            <textarea
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={
                toolInUse.isRecipeSearch
                  ? "Ask for a recipe or list ingredients..."
                  : toolInUse.isCookingTip
                    ? "Ask for cooking tips (e.g. how to chop onions)..."
                    : "Type a message or ask for a recipe..."
              }
              className="flex-1 px-4 py-3 bg-gray-50 border border-gray-300 rounded-2xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-shadow"
              rows={1}
              disabled={isLoading}
              style={{ fieldSizing: "content", maxHeight: "120px" }}
            />

            {/* Send Button */}
            <button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isLoading}
              className={`p-3 rounded-full transition-all shrink-0 ${
                inputMessage.trim() && !isLoading
                  ? "bg-linear-to-br from-orange-500 to-amber-600 text-white shadow-lg hover:shadow-xl hover:scale-105 cursor-pointer"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <FaPaperPlane className="w-5 h-5 pl-0.5" />
              )}
            </button>
          </div>
        </div>

        <p className="text-[10px] text-gray-400 text-center">
          Press <kbd className="kbd kbd-xs">Enter</kbd> to send • BiteBot may
          occasionally provide inaccurate information
        </p>
      </div>
    </div>
  );
}
