import Image from "next/image";
import React from "react";
const StatsCard = ({ title, value, color }: { title: string, value: number, color: string }) => {
  return (
    <div className={`p-3 w-[142px] h-[68px] rounded-lg ${color} relative`}>
      <h2 className="text-white  text-[14px] font-semibold">{title}</h2>
      <div className="text-white text-[12px] font-bold">{value}</div>
      <div className=" flex justify-end absolute bottom-1 right-2">
        <Image src={"/dicrease.svg"} width={18} height={18} alt="public"></Image>
      </div>
    </div>
  );
};

const Card = () => {
  return (
    <div className="flex gap-4 mt-5">
      <StatsCard title="Students" value={100} color="bg-[#4CAF50]" />
      <StatsCard title="Teachers" value={25} color="bg-[#869DCA]" />
      <StatsCard title="Trials" value={100} color="bg-[#213458]" />
      <StatsCard title="Classes" value={100} color="bg-[#3A6EA5]" />
    </div>
  );
};

export default Card;
