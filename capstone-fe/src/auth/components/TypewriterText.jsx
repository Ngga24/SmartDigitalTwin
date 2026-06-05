import { useEffect, useState } from "react";

export default function TypewriterText({
  text,
  speed = 80,
  delay = 0,
  className = "",
}) {
  const [displayText, setDisplayText] = useState("");

  useEffect(() => {
    const timeout = setTimeout(() => {
      let currentIndex = 0;

      const interval = setInterval(() => {
        setDisplayText(text.slice(0, currentIndex + 1));

        currentIndex++;

        if (currentIndex >= text.length) {
          clearInterval(interval);
        }
      }, speed);

      return () => clearInterval(interval);
    }, delay);

    return () => clearTimeout(timeout);
  }, [text, speed, delay]);

  return (
    <span className={className}>
      {displayText}
      <span className="animate-pulse">|</span>
    </span>
  );
}