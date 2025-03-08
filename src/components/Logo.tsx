import React from "react";

interface LogoProps {
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ className }) => {
  return (
    <div className={`flex flex-col items-center ${className}`}>
      <svg
        width="60"
        height="60"
        viewBox="0 0 60 60"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="mb-2"
      >
        <circle
          cx="20"
          cy="15"
          r="3"
          stroke="black"
          strokeWidth="1.5"
          fill="none"
        />
        <circle
          cx="40"
          cy="15"
          r="3"
          stroke="black"
          strokeWidth="1.5"
          fill="none"
        />
        <circle
          cx="20"
          cy="45"
          r="3"
          stroke="black"
          strokeWidth="1.5"
          fill="none"
        />
        <circle
          cx="40"
          cy="45"
          r="3"
          stroke="black"
          strokeWidth="1.5"
          fill="none"
        />
        <path
          d="M30 10 C 40 10, 45 20, 45 30 C 45 40, 40 50, 30 50 C 20 50, 15 40, 15 30 C 15 20, 20 10, 30 10"
          stroke="black"
          strokeWidth="1.5"
          fill="none"
        />
        <text x="30" y="20" textAnchor="middle" fontSize="8" fontWeight="bold">
          3
        </text>
        <text x="30" y="40" textAnchor="middle" fontSize="8" fontWeight="bold">
          2
        </text>
        <text x="10" y="30" textAnchor="middle" fontSize="8" fontWeight="bold">
          0
        </text>
        <text x="50" y="30" textAnchor="middle" fontSize="8" fontWeight="bold">
          1
        </text>
      </svg>
      <span className="text-xs font-medium uppercase tracking-wider text-center">
        HOLISTIC FINE-TUNNING
      </span>
    </div>
  );
};

export default Logo;
