import { useEffect, useRef, useState } from "react";
import {
  FaArrowLeft,
  FaChevronDown,
  FaLightbulb,
  FaPaperPlane,
  FaRobot,
  FaTimes,
  FaUtensils,
} from "react-icons/fa";
import { LuCookingPot } from "react-icons/lu";
import { RiChatNewFill } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import generateResponseApi from "../../apis/chatbot/generateResponseApi";
import RecipeChatCard from "../../components/bitebot/RecipeChatCard";
import {
  addAssistantMessage,
  addUserMessage,
  clearChat,
  getMessageHistory,
  setCookingTipTool,
  setRecipeSearchTool,
} from "../../redux/slices/chatSlice";
export default function Chat() {
  const { userData } = useSelector((state) => state.auth);
  const { quickSuggestions, messages, toolInUse } = useSelector(
    (state) => state.chat,
  );
  const [inputMessage, setInputMessage] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [language, setLanguage] = useState("en");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);
  const dispatch = useDispatch();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;
    setIsLoading(true);
    const userInput = inputMessage.trim();
    setInputMessage("");
    dispatch(addUserMessage(userInput));
    try {
      const res = await generateResponseApi({
        messages: getMessageHistory(messages, userInput),
        toolInUse,
        language,
      });
      dispatch(addAssistantMessage(res?.data));
    } catch (error) {
      console.log(error);
      dispatch(
        addAssistantMessage({
          reply:
            "Sorry, I'm having trouble understanding your request. Please try again later.",
          recipes: [],
        }),
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  function modifyCloudinaryURL(url) {
    if (url === "" || url === null) return "";
    if (import.meta.env.VITE_IMAGE_TRANSFORMATION === "true") {
      return url.replace(
        "/upload/",
        "/upload/ar_1:1,c_auto,g_auto,w_500/r_max/",
      );
    }
    return url;
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-orange-50 via-white to-amber-50 flex flex-col">
      {/* Header with Back Button */}
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

        {/* Right: Controls (Language Only) */}
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
              onChange={(e) => setLanguage(e.target.value)}
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

      {/* Chat Container */}
      <div className="flex-1 max-w-4xl mx-auto w-full px-4 pb-76 pt-4">
        <div className="space-y-6">
          {messages?.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${
                msg.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`flex gap-3 max-w-[80%] min-w-0 ${
                  msg.role === "user" ? "flex-row-reverse" : ""
                }`}
              >
                {/* Avatar */}
                <div className="shrink-0">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-medium shadow-md ${
                      msg.role === "user"
                        ? "bg-linear-to-br from-orange-500 to-amber-600"
                        : "bg-linear-to-br from-gray-600 to-gray-800"
                    }`}
                  >
                    {msg.role === "user" ? (
                      <img
                        src={modifyCloudinaryURL(
                          userData?.profile?.avatar?.secure_url,
                        )}
                        alt="user avatar"
                        className="w-9 h-9 rounded-full object-cover"
                      />
                    ) : (
                      <FaRobot className="w-5 h-5" />
                    )}
                  </div>
                </div>

                {/* Message Bubble */}
                <div className="min-w-15">
                  <div
                    className={`px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap wrap-break-word shadow-sm pb-6 ${
                      msg.role === "user"
                        ? "bg-linear-to-br from-orange-500 to-amber-600 text-white"
                        : "bg-white text-gray-800 border border-gray-200"
                    }`}
                  >
                    {msg.content}
                  </div>
                  <div className="flex justify-end text-[10px] font-bold relative bottom-5 right-4">
                    {msg.time}
                  </div>

                  {/* Recipes Grid */}
                  {msg.recipes?.length > 0 && (
                    <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {msg.recipes.map((recipe) => {
                        return (
                          <RecipeChatCard
                            key={recipe._id.toString()}
                            recipe={recipe}
                          />
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}

          {/* Loading Indicator */}
          {isLoading && (
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
                  <span className="text-sm text-gray-600">
                    Cooking up ideas...
                  </span>
                </div>
              </div>
              <img
                src="https://res.cloudinary.com/dpoqek1ce/image/upload/Cooking_lq8bsy.gif"
                alt="loading gif"
                className="w-[60%]"
              />
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Floating Input Area */}
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
    </div>
  );
}
