import ChatContainer from "../../components/bitebot/ChatContainer";
import ChatHeader from "../../components/bitebot/ChatHeader";
import ChatInputArea from "../../components/bitebot/ChatInputArea";

export default function Chat() {
  return (
    <div className="min-h-screen bg-linear-to-br from-orange-50 via-white to-amber-50 flex flex-col">
      {/* Header */}
      <ChatHeader />

      {/* Chat Container */}
      <ChatContainer />

      {/* Input Area */}
      <ChatInputArea />
    </div>
  );
}
