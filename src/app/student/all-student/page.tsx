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

  return (
    <>
      <div className="lg:ml-[219px] mt-20 flex flex-col">
        <div className="lg:w-[1068px] w-[330px] h-[42px] p-4 bg-white rounded-md flex items-center justify-between">
          <span className="flex flex-row lg:gap-3 gap-2 text-[12px] lg:text-[16px]">
            Student | 
            <Image src={"/home.svg"} width={15} height={15} alt="public" />
            - All students
          </span>
          <Link href={"/#"} passHref>
            <div className="h-[23px] w-[57px] bg-[#1c2b47] flex items-center justify-center rounded-md">
              <Image
                src={"/refresh.svg"}
                width={16}
                height={16}
                alt="Refresh"
              />
            </div>
          </Link>
        </div>
        <div className="relative mt-2">
          <Dropdown />
        </div>

        <div className="mt-5 grid grid-cols-4 lg:gap-4 gap-44">
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
        {isModalOpen && (
        <Modal
        />
      )}
      </div>

    </>
  );
};

export default Page;
