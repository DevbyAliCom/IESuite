// components/Chat/MessageInput.tsx
import React, { useState } from "react";

interface MessageInputProps {
    onSendMessage: (message: string) => void;
}

const MessageInput: React.FC<MessageInputProps> = ({ onSendMessage }) => {
    const [newMessage, setNewMessage] = useState("");

    const handleSendMessage = () => {
        if (newMessage.trim()) {
            onSendMessage(newMessage);
            setNewMessage("");
        }
    };

    const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter") {
            handleSendMessage();
        }
    };

    return (
        <div className="flex gap-2">
            <input
                type="text"
                className="flex-1 border border-gray-300 rounded-full py-2 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-gray-800 text-sm sm:text-base shadow-sm"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                aria-label="Type your message"
            />
            <button
                onClick={handleSendMessage}
                className="bg-indigo-600 text-white p-2 sm:px-4 sm:py-2 rounded-full hover:bg-indigo-700 transition-all duration-200 ease-in-out shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 flex items-center justify-center"
                aria-label="Send message"
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 sm:w-6 sm:h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
                </svg>
                <span className="hidden sm:inline ml-1">Send</span>
            </button>
        </div>
    );
};

export default MessageInput;