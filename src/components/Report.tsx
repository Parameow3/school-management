import React from "react";
import { ChevronRightIcon } from "@heroicons/react/24/outline";
import { FaceFrownIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";

interface AbsentCardProps {
  title: string;
  message: string;
  onClick: () => void; // Add a click handler for navigation
}

const AbsentCard: React.FC<AbsentCardProps> = ({ title, message, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="lg:w-[618px] w-[300px] h-[114px] bg-gray-200 flex items-center justify-between relative p-4 rounded-lg shadow-lg cursor-pointer hover:bg-gray-300 transition"
    >
      <div>
        <h2 className="lg:text-16 text-[12px] lg:text-[16px] font-semibold">
          {title}
        </h2>
        <div className="flex items-center justify-center ml-12 lg:ml-48 flex-col gap-2">
          <FaceFrownIcon className="h-6 w-6 text-gray-600" />
          <p className="text-gray-600 text-[12px] lg:text-[13px] font-semibold ml-4 lg:mr-14">
            {message}
          </p>
        </div>
      </div>
      <ChevronRightIcon className="h-6 w-6 text-gray-600 top-1" />
    </div>
  );
};

const Report = () => {
  const router = useRouter();

  const navigateToAttendance = (path: string) => {
    router.push(`/attendance/${path}`); // Navigate to the specific path
  };

  return (
    <div className="flex flex-col gap-4 mt-4">
      <AbsentCard
        title="Absent Teacher Today"
        message="Attendance not marked yet for teachers"
        onClick={() => navigateToAttendance("teacher")}
      />
      <AbsentCard
        title="Absent Student Today"
        message="Attendance not marked yet for students"
        onClick={() => navigateToAttendance("student")}
      />
    </div>
  );
};

export default Report;
