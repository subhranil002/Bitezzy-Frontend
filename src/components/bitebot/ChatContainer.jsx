import { useEffect, useRef } from "react";
import { FaRobot } from "react-icons/fa";
import { useSelector } from "react-redux";

import LoadingIndicator from "./LoadingIndicator";
import RecipeChatCard from "./RecipeChatCard";

export default function ChatContainer() {
  const messagesEndRef = useRef(null);
  const { userData } = useSelector((state) => state.auth);
  const { messages, isLoading } = useSelector((state) => state.chat);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

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
        {isLoading && <LoadingIndicator />}

        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}
