import React from "react";
import Image from "next/image";

// Define the CardProps interface
interface CardProps {
  title: string;
  value: number;
  color: string;
}

// Define the StatsCard component
const StatsCard: React.FC<CardProps> = ({ title, value, color }) => {
  return (
    <div
      className="p-3 w-[142px] h-[68px] rounded-lg relative"
      style={{ backgroundColor: color }} // Apply the color directly as a style
    >
      <h2 className="text-white text-[14px] font-semibold">{title}</h2>
      <div className="text-white text-[12px] font-bold">{value}</div>
      <div className="flex justify-end absolute bottom-1 right-2">
        <Image src={"/dicrease.svg"} width={18} height={18} alt="icon" />
      </div>
    </div>
  );
};
const Card: React.FC<CardProps> = ({ title, value, color }) => {
  return (
    <div className="flex mt-5">
      <StatsCard title={title} value={value} color={color} />
    </div>
  );
};

export default Card;
