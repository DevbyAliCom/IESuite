// app/page.tsx
"use client";
import { useState, useMemo, useRef, useEffect } from "react";
import { useSignalR } from "@/hooks/useSignalR";
import MessageList from "@/components/Chat/MessageList";
import MessageInput from "@/components/Chat/MessageInput";

export const dynamic = "force-dynamic";

const ChatStreamPage = () => {
    const rawHubUrl = process.env.NEXT_PUBLIC_BRAIN_HUB_URL;
    const [error, setError] = useState<string | null>(null);

    const hubUrl = useMemo(() => {
        if (!rawHubUrl) {
            const errorMessage = "Error: NEXT_PUBLIC_BRAIN_HUB_URL environment variable is not set. Please check your .env.local file and restart the development server.";
            console.error(errorMessage);
            setError(errorMessage);
            return null;
        }
        return `${rawHubUrl}/receptor`;
    }, [rawHubUrl]);

    const { messages, sendMessage, connectionId, isStreaming } = useSignalR({
        hubUrl: hubUrl || "",
    });

    // Ref for the message list container to enable auto-scrolling
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to the bottom when new messages arrive
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);


    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 text-black flex items-center justify-center p-4">
                <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg shadow-lg relative" role="alert">
                    <strong className="font-bold text-lg">Configuration Error!</strong>
                    <span className="block sm:inline mt-2"> {error}</span>
                    <p className="text-sm mt-2">Make sure your `.env.local` is correct and restart your dev server.</p>
                </div>
            </div>
        );
    }

    if (!hubUrl) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-white text-black flex items-center justify-center">
                <p className="text-lg text-gray-700">Loading chat configuration...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-white text-gray-800 p-4 sm:p-6 flex flex-col">
            <div className="max-w-2xl w-full mx-auto bg-white rounded-xl shadow-2xl overflow-hidden flex flex-col h-[calc(100vh-2rem)] sm:h-[calc(100vh-3rem)]">
                {/* Header */}
                <div className="bg-indigo-600 text-white p-4 sm:p-6 shadow-md flex items-center justify-between">
                    <div className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 mr-3 text-indigo-200">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m3.75 13.5 10.5-11.25L12 10.5h8.25L13.5 21.75 16.5 12h-8.25Z" />
                        </svg>
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Synapse Talk</h1>
                            <p className="text-indigo-200 text-sm sm:text-base mt-0.5">Direct Dialogue with the IESuite's Intelligent Core.</p>
                        </div>
                    </div>
                    {/* Optional: Add user avatar or status here */}
                </div>

                {/* Message List Container (scrollable) */}
                <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 custom-scrollbar">
                    <MessageList messages={messages} currentConnectionId={connectionId} />
                    <div ref={messagesEndRef} /> {/* For auto-scrolling */}
                </div>

                {/* Input Area */}
                <div className="p-4 sm:p-6 bg-gray-50 border-t border-gray-200">
                    <MessageInput onSendMessage={sendMessage} />
                    {isStreaming && (
                        <div className="mt-3 text-center text-indigo-600 font-medium text-sm sm:text-base animate-pulse">
                            🧠 Brain is thinking...
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ChatStreamPage;