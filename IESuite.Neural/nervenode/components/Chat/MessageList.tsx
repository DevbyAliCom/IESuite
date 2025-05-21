import React from "react";
import { Message } from "@/types/chat";

interface MessageListProps {
  messages: Message[];
  currentConnectionId: string | null;
}

const MessageList: React.FC<MessageListProps> = ({ messages, currentConnectionId }) => {
  const isMyMessage = (sender: string) => currentConnectionId && sender === currentConnectionId;

  return (
      <>
        {messages.map((msg, index) => (
            <div
                key={index}
                className={`flex ${isMyMessage(msg.sender) ? "justify-end" : "justify-start"}`}
            >
              <div
                  className={`p-3 rounded-2xl max-w-[80%] break-words shadow-md transition-all duration-300 ${
                      isMyMessage(msg.sender)
                          ? "bg-indigo-500 text-white rounded-br-none" // Your message
                          : msg.sender === "brain"
                              ? "bg-purple-100 text-purple-800 rounded-bl-none border border-purple-200" // Brain message
                              : "bg-gray-100 text-gray-800 rounded-bl-none border border-gray-200" // Other user message
                  }`}
              >
                <p className={`text-xs font-semibold mb-1 ${isMyMessage(msg.sender) ? "text-indigo-100" : "text-gray-600"}`}>
                  {isMyMessage(msg.sender) ? "You" : (msg.sender === "brain" ? "🧠 Brain" : `User ${msg.sender.substring(0, 8)}...`)}
                </p>
                <p className="text-sm sm:text-base leading-tight">{msg.content}</p>
                <p className={`text-[10px] sm:text-xs mt-1 text-right ${isMyMessage(msg.sender) ? "text-indigo-200" : "text-gray-400"}`}>
                  {new Date(msg.sentTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
        ))}
      </>
  );
};

export default MessageList;