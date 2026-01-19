import React from "react";
import { STEP_DURATION, steps } from "../constants";

const LoaderSteps: React.FC = () => {
  const [current, setCurrent] = React.useState<number>(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((s: number) => (s + 1) % steps.length);
    }, STEP_DURATION);

    return () => clearInterval(interval);
  }, []);

  const Icon = steps[current].icon;

  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-gray-950 relative overflow-hidden text-white">
      <div className="absolute inset-0 bg-linear-to-br from-blue-500/10 via-purple-500/10 to-fuchsia-500/10 blur-3xl animate-pulse"></div>

      <div className="relative z-0 w-32 h-32 flex items-center justify-center">
        <div className="absolute inset-0 rounded-full border border-indigo-400 animate-ping opacity-30" />
        <div className="absolute inset-0 rounded-full border border-purple-400/20" />
        <Icon className="w-8 h-8 text-white opacity-80 animate-bounce" />
      </div>

      {/* Step label */}
      <p
        key={current}
        className="mt-8 text-lg font-light text-white/90 tracking-wide transition-all duration-700 ease-in-out opacity-100"
      >
        {steps[current].label}
      </p>

      <p className="text-xs text-gray-400 mt-2 transition-opacity duration-700 opacity-100">
        This may take 2-3 minutes...
      </p>
    </div>
  );
};

export default LoaderSteps;
