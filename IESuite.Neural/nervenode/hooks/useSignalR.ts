// hooks/useSignalR.ts
import { useEffect, useState, useRef, useCallback } from "react";
import { HubConnection, HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
import { Message } from "@/types/chat"; 

interface UseSignalROptions {
    hubUrl: string;
}

interface UseSignalRReturn {
    messages: Message[];
    sendMessage: (content: string) => Promise<void>;
    connectionId: string | null;
    isStreaming: boolean;
}

export const useSignalR = ({ hubUrl }: UseSignalROptions): UseSignalRReturn => {
    const [connection, setConnection] = useState<HubConnection | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const isStreamingRef = useRef(false);
    const [, forceUpdate] = useState(0); // Used to trigger re-render for `isStreamingRef` changes
    const [connectionId, setConnectionId] = useState<string | null>(null);

    useEffect(() => {
        if (!hubUrl) {
            console.error("SignalR Hub URL is not provided.");
            return;
        }

        const connect = new HubConnectionBuilder()
            .withUrl(hubUrl)
            .withAutomaticReconnect()
            .configureLogging(LogLevel.Information)
            .build();

        setConnection(connect);

        connect
            .start()
            .then(() => {
                console.log("✅ Connected to SignalR:", connect.connectionId);
                setConnectionId(connect.connectionId);

                connect.on("ReceiveMessage", (sender: string, content: string, sentTime: Date) => {
                    if (content === "StreamEnd") {
                        isStreamingRef.current = false;
                        forceUpdate((n) => n + 1); // Trigger re-render to update `isStreaming` state
                        return;
                    }

                    if (sender === "brain") { // Handle brain messages specifically
                        if (!isStreamingRef.current) {
                            isStreamingRef.current = true;
                            forceUpdate((n) => n + 1); // Trigger re-render to update `isStreaming` state
                            // Initial placeholder for the brain's streaming message
                            setMessages((prev) => [...prev, { sender, content: "...", sentTime }]);
                            return;
                        } else {
                            // Append to the last brain message during streaming
                            setMessages((prev) => {
                                const updated = [...prev];
                                const lastIndex = updated.length - 1;
                                if (updated[lastIndex]?.sender === "brain") {
                                    // Remove "..." if it's the initial placeholder, then append content
                                    const existingContent = updated[lastIndex].content.replace("...", "");
                                    updated[lastIndex] = {
                                        ...updated[lastIndex],
                                        content: `${existingContent}${content}`, // Append new content directly
                                        sentTime,
                                    };
                                }
                                return updated;
                            });
                            return;
                        }
                    }

                    // For non-brain messages or if streaming is not active/ended
                    console.log("📨 Message received", { sender, content, sentTime });
                    setMessages((prev) => [...prev, { sender, content, sentTime }]);
                });

                connect.on("MessageHistory", (history: Message[]) => {
                    console.log("📚 Message history loaded");
                    setMessages(history);
                });

                connect.invoke("RetrieveMessageHistory");
            })
            .catch((err) =>
                console.error("❌ SignalR connection failed:", err.message)
            );

        return () => {
            if (connect) {
                connect.off("ReceiveMessage");
                connect.off("MessageHistory");
                connect.stop().then(() => console.log("SignalR connection stopped."));
            }
        };
    }, [hubUrl]);

    const sendMessage = useCallback(async (content: string) => {
        if (connection && content.trim()) {
            console.log("🚀 Sending message:", content);
            await connection.send("PostMessage", content);
        }
    }, [connection]);

    return { messages, sendMessage, connectionId, isStreaming: isStreamingRef.current };
};