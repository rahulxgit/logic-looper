import { useEffect, useState } from "react";

function Timer({ isActive = true, onTimeUpdate }) {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive]);

  useEffect(() => {
    if (onTimeUpdate) {
      onTimeUpdate(seconds);
    }
  }, [seconds, onTimeUpdate]);

  const formatTime = () => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;

    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  return (
    <div className="flex items-center justify-center gap-2 bg-indigo-500/20 backdrop-blur-md px-4 py-2 rounded-xl shadow-sm">
      <span className="text-sm font-medium text-white/80">
        ⏱ Time
      </span>

      <span className="text-lg font-bold text-white">
        {formatTime()}
      </span>
    </div>
  );
}

export default Timer;
