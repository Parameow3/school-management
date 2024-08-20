import React from "react";
import { ChevronRightIcon } from "@heroicons/react/24/outline";
import { FaceFrownIcon } from "@heroicons/react/24/outline";

const AbsentCard = ({ title, message }: { title: string, message: string }) => {
  return (
    <div className="w-[618px] h-[114px] bg-gray-200 flex items-center justify-between relative p-4 rounded-lg shadow-lg">
      <div>
        <h2 className="text-16 font-semibold">{title}</h2>
        <div className="flex items-center justify-center ml-52 flex-col gap-2">
          <FaceFrownIcon className="h-6 w-6 text-gray-600" />
          <p className="text-gray-600 font-semibold">{message}</p>
        </div>
      </div>
      <ChevronRightIcon className="h-6 w-6 text-gray-600 top-1 right-5" />
    </div>
  );
};

const Report = () => {
  return (
    <div className="flex flex-col gap-4 mt-4">
      <AbsentCard title="Today Absent Student" message="Attendance not marked yet" />
    </div>
  );
};

export default Report;
