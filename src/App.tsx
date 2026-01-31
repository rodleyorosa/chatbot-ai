import { ArrowUp, ChartNoAxesGantt, Sparkles } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useTypingEffect } from "./hooks/useTypingEffect";
import { formatTextWithBold, isMobile } from "./utils";

interface Message {
  id: number;
  role: "user" | "bot";
  text: string;
}

const App = () => {
  const [inputValue, setInputValue] = useState("");
  const [userMessage, setUserMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [typingBotMsg, setTypingBotMsg] = useState("");
  const [typingBotMsgId, setTypingBotMsgId] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const textEffect = useTypingEffect(
    typingBotMsg,
    10,
    isTyping,
    typingBotMsgId
  );
  const subtitle = useTypingEffect("How can I help you today?", 50, true);
  const lastMessageRef = useRef<HTMLDivElement>(null);

  const fetchData = useCallback(async () => {
    if (!userMessage) return;

    try {
      setIsTyping(true);
      const response = await fetch("/.netlify/functions/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userMessage,
        }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const result = await response.json();
      const botMessage = result.choices[0].message.content as string;
      const newMessageId = Date.now();

      setTypingBotMsg(botMessage);
      setTypingBotMsgId(newMessageId);
      setMessages((prevMessages) => [
        ...prevMessages,
        { id: newMessageId, role: "bot", text: botMessage },
      ]);
    } catch (error) {
      console.error("Error fetching data:", error);
      setIsTyping(false);
    }
  }, [userMessage]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setInputValue(e.target.value);
    },
    []
  );

  const sendMessage = useCallback(() => {
    if (!inputValue.trim()) return;

    setUserMessage(inputValue);
    setMessages((prevMessages) => [
      ...prevMessages,
      { id: Date.now(), role: "user", text: inputValue },
    ]);

    setInputValue("");
  }, [inputValue]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
      }
    },
    [sendMessage]
  );

  return (
    <div className="bg-[#0a0a0a] h-dvh text-white flex flex-col">
      <div className="border border-zinc-700 w-fit rounded-md p-2 m-2 cursor-pointer flex-shrink-0">
        <ChartNoAxesGantt className="w-4 h-4" />
      </div>
      <div className="flex flex-col justify-between w-full max-w-3xl mx-auto px-4 pb-4 gap-4 flex-1 min-h-0">
        {messages.length === 0 ? (
          <div className={`w-full ${isMobile() ? "mt-10" : "mt-30 px-20"}`}>
            <h1 className="font-semibold text-xl md:text-2xl">Hello there!</h1>
            <p className="text-xl text-zinc-500 md:text-2xl">{subtitle}</p>
          </div>
        ) : (
          <div className="flex flex-col w-full gap-4 flex-1 overflow-y-auto scrollbar-hide py-4 min-h-0">
            {messages.map(({ id, role, text }, index) => (
              <div key={id} className="flex flex-col" ref={lastMessageRef}>
                {role === "user" && (
                  <div className="flex justify-end">
                    <p className="bg-blue-600 w-fit rounded-2xl px-3 py-2 whitespace-pre-wrap">
                      {text}
                    </p>
                  </div>
                )}
                {role === "bot" && (
                  <div className="flex justify-start py-2 gap-3">
                    <div className="border border-zinc-700 h-fit p-1 rounded-full">
                      <Sparkles strokeWidth={1} width={15} height={15} />
                    </div>
                    <p className="w-fit rounded-2xl whitespace-pre-wrap">
                      {index === messages.length - 1 && isTyping
                        ? formatTextWithBold(textEffect)
                        : formatTextWithBold(text)}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
        <div className="w-full flex-shrink-0">
          <div className="relative inline-block w-full">
            <input
              type="text"
              placeholder="Send a message..."
              className="border border-zinc-700 w-full p-4 rounded-md bg-transparent text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-600"
              value={inputValue}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
            />
            <button
              onClick={sendMessage}
              disabled={!inputValue.trim()}
              className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center justify-center w-8 h-8 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowUp className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
