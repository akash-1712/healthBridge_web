import { createContext, useContext, useState } from "react";

const ChatContext = createContext();

export function ChatProvider({ children }) {
  const [chatClient, setChatClient] = useState(null);

  return (
    <ChatContext.Provider value={{ chatClient, setChatClient}}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  return useContext(ChatContext);
}
