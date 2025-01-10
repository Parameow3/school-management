"use client";
import Button from "@/components/Button";
import ProfileCard from "@/components/ProfileCard";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const Page = () => {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [profileToDelete, setProfileToDelete] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");

 

  const handleSearchClick = () => {
    // Logic for search functionality - placeholder for now
    console.log("Searching for:", searchTerm);
  };

  const handleViewClick = (id: number) => {
    router.push(`/student/all-student/view/${id}`);
  };

  const handleEditClick = (id: number) => {
    router.push(`/student/all-student/edit/${id}`);
  };

  const handleDeleteClick = (id: number) => {
    setIsModalOpen(true);
    setProfileToDelete(id);
  };

  return (
    <div className="lg:ml-[16%] mt-28 ml-[11%] flex justify-center items-center">
      <div className="">
        <h1 className="text-2xl text-[#213458] font-bold text-center">
          Enrollment
        </h1>
        <div className="flex items-center justify-center mt-4 gap-2 w-full">
          <input
            type="text"
            placeholder="Search Student"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full lg:w-[300px] lg:h-[40px] h-[35px] p-2 rounded-l-[5px] border border-gray-300 focus:outline-none"
          />
          <Button
            onClick={handleSearchClick} // Connect search function
            className="lg:h-[40px] h-[35px] px-4 bg-[#213458] text-white font-medium rounded-r-[5px]"
          >
            Search
          </Button>
        </div>
        
        <div className="flex justify-center mt-4">
          <Button className="bg-[#213458] rounded-md p-1">Submit</Button>
        </div>
      </div>
    </div>
  );
};

export default Page;
