"use client";
import React from "react";
import Image from "next/image";
import { useState } from "react";
interface Teacher {
  firstName: String;
  lastName: String;
  userName: String;
  program: String;
  profilePicture: String;
  branch: String;
}
const mockupTeacher: Teacher = {
  firstName: "Lyseth",
  lastName: "Pham",
  userName: "Potio",
  program: "Robotics",
  profilePicture: "/photo.jpg",
  branch: "FM", // Ensure this path is correct
};
const Page = () => {
  const [teacher] = useState<Teacher>(mockupTeacher);
  return (
    <div className=" lg:ml-[219px] mt-20 flex flex-col">
      <div className="bg-white p-6 rounded-lg lg:gap-12 gap-4 h-[450px] flex lg:flex-row flex-col shadow-lg w-[345px] lg:w-[654px] max-w-2xl mx-auto">

        <div className="flex lg:items-start items-center lg:justify-start flex-col mb-4 ml-4">
          <Image
            src={teacher.profilePicture.toString()}
            alt="public"
            width={192} // Adjust to the original or higher resolution
            height={192} // Adjust to the original or higher resolution
            className="lg:w-48 lg:h-48 w-16 h-16 mr-4 object-cover" // object-cover helps to maintain aspect ratio
          />
        </div>
        <div className="text-left">
        <h2 className="font-bold inline-block border-b-2 ml-28 lg:ml-0">
        About Me
      </h2>
          <p className="p-2 text-[12px] lg:text-[16px]">
            <strong>LastName:</strong> {teacher.lastName}
          </p>
          <p className="p-2 text-[12px] lg:text-[16px]">
            <strong>FirstName:</strong> {teacher.firstName}
          </p>
          <p className="p-2 text-[12px] lg:text-[16px]">
            <strong>UserName:</strong> {teacher.userName}
          </p>
          <p className="p-2 text-[12px] lg:text-[16px]">
            <strong>Program:</strong>
            {teacher.program}
          </p>
          <p className="p-2 text-[12px] lg:text-[16px]">
            <strong>Branh:</strong>
            {teacher.branch}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Page;
