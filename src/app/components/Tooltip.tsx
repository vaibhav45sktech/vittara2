"use client";

import React, { useState } from "react";

interface TooltipProps {
  children: React.ReactNode;
  content: string;
}

const Tooltip: React.FC<TooltipProps> = ({ children, content }) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div
      className="relative flex items-center justify-center"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <div className="absolute top-full mt-2 px-2 py-1 text-xs font-medium text-white bg-black rounded shadow-lg z-50 whitespace-nowrap transition-opacity duration-200 animate-fade-in-up">
          {content}
        
          <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-black rotate-45"></div>
        </div>
      )}
    </div>
  );
};

export default Tooltip;
