"use client";
import Dropdown from "@/components/Dropdown";
import Link from "next/link";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import ProfileCard from "@/components/ProfileCard";
import Modal from "@/components/Modal"; // Ensure the Modal component is correctly imported

const Page = () => {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [profileToDelete, setProfileToDelete] = useState<number | null>(null);

  const profiles = [
    {
      id: 1,
      pic: '/photo.jpg',
      name: 'Lyseth',
      job: 'Student',
    },
    {
      id: 2,
      pic: '/photo.jpg',
      name: 'John Doe',
      job: 'Software Engineer',
    },
    {
      id: 3,
      pic: '/photo.jpg',
      name: 'Jane Smith',
      job: 'Designer',
    },
    {
      id: 4,
      pic: '/photo.jpg',
      name: 'Jane Smith',
      job: 'Designer',
    },
    {
      id: 5,
      pic: '/photo.jpg',
      name: 'Jane Smith',
      job: 'Designer',
    },
  ];

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

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <div className="lg:ml-[16%] mt-20 flex flex-col">
        {/* Header Section */}
        <div className="lg:w-[1068px] w-[330px] h-[42px] p-4 bg-white rounded-md flex items-center justify-between shadow-sm">
          <span className="flex flex-row lg:gap-3 gap-2 text-[12px] lg:text-[16px] items-center">
            Student | 
            <Image src={"/home.svg"} width={15} height={15} alt="public" className="ml-1" />
            - All students
          </span>
          <Link href={"/#"} passHref>
            <div className="h-[23px] w-[57px] bg-[#1c2b47] flex items-center justify-center rounded-md hover:bg-[#16223a] cursor-pointer">
              <Image
                src={"/refresh.svg"}
                width={16}
                height={16}
                alt="Refresh"
              />
            </div>
          </Link>
        </div>
        
        {/* Dropdown Section */}
        <div className="relative mt-4">
          <Dropdown />
        </div>

        {/* Profile Cards Section */}
        <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {profiles.map(profile => (
            <ProfileCard
              key={profile.id}
              pic={profile.pic}
              name={profile.name}
              job={profile.job}
              onViewClick={() => handleViewClick(profile.id)}
              onEditClick={() => handleEditClick(profile.id)}
              onDeleteClick={() => handleDeleteClick(profile.id)}
              editPath=""
              viewPath=""
            />
          ))}
        </div>

        {/* Modal Section */}
        {isModalOpen && (
          <Modal onClose={handleCloseModal} />
        )}
      </div>
    </>
  );
};

export default Page;
