import { useEffect, useState } from "react";

export const useTypingEffect = (
  message: string,
  messageId: number,
  isTyping: boolean
): { displayedText: string } => {
  const [displayedText, setDisplayedText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lastMessageId, setLastMessageId] = useState(messageId);

  if (messageId !== lastMessageId) {
    setLastMessageId(messageId);
    setDisplayedText("");
    setCurrentIndex(0);
  }

  useEffect(() => {
    if (!isTyping || currentIndex >= message.length) return;

    const timeout = setTimeout(() => {
      setDisplayedText((prev) => prev + message[currentIndex]);
      setCurrentIndex((prev) => prev + 1);
    }, 10);

    return () => clearTimeout(timeout);
  }, [currentIndex, message, isTyping]);

  return { displayedText };
};
