import React from "react";
import { ChevronRightIcon } from "@heroicons/react/24/outline";
import { FaceFrownIcon } from "@heroicons/react/24/outline";
const AbsentCard = ({ title, message }: { title: string, message: string }) => {
  return (
    <div className="lg:w-[618px] w-[300px] h-[114px] bg-gray-200 flex items-center justify-between relative p-4 rounded-lg shadow-lg">
      <div>
        <h2 className="lg:text-16 text-[12px] font-semibold">{title}</h2>
        <div className="flex items-center justify-center ml-12 lg:ml-48 flex-col gap-2">
          <FaceFrownIcon className="h-6 w-6 text-gray-600 " />
          <p className="text-gray-600 text-[12px] font-semibold ml-4 lg:mr-14">{message}</p>
        </div>
      </div>
      <ChevronRightIcon className="h-6 w-6 text-gray-600 top-1" />
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
