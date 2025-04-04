"use client";
import { useEffect, useState } from "react";

interface TypingTextProps {
  text: string;
  speed?: number; // Optional: default to 50ms per char
  className?: string; // Optional: for styling
}

const TypingText: React.FC<TypingTextProps> = ({
  text,
  speed = 80,
  className = "",
}) => {
  const [typed, setTyped] = useState("");

  useEffect(() => {
    let i = 0;
    setTyped(""); // Reset on text change

    const interval = setInterval(() => {
      setTyped(text.slice(0, i + 1));
      i++;
      if (i == text.length) clearInterval(interval);
    }, speed);
    return () => clearInterval(interval);
  }, [text, speed]);

  return (
    <span className={className}>
      {typed}
    </span>
  );
};

export default TypingText;
