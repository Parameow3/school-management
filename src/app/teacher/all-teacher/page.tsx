"use client";
import Dropdown from "@/components/Dropdown";
import Link from "next/link";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import ProfileCard from "@/components/ProfileCard";
import Modal from "@/components/Modal";

const Page = () => {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [profileToDelete, setProfileToDelete] = useState<number | null>(null);

  const profiles = [
    {
      id: 1,
      pic: '/photo.jpg',
      name: 'Lyseth',
      job: 'Teacher',
    },
    {
      id: 2,
      pic: '/photo.jpg',
      name: 'John Doe',
      job: 'Teacher',
    },
    {
      id: 3,
      pic: '/photo.jpg',
      name: 'Jane Smith',
      job: 'Teacher',
    },
  ];

  const handleViewClick = (id: number) => {
    router.push(`/teacher/all-teacher/view/${id}`);
  };

  const handleEditClick = (id: number) => {
    router.push(`/teacher/all-teacher/edit/${id}`);
  };

  const handleDeleteClick = (id: number) => {
    setIsModalOpen(true);
    setProfileToDelete(id);
  };
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };
  return (
    <div className="lg:ml-[219px] ml-[40px] mt-20 flex flex-col">
      <div className="lg:w-[1068px] w-[330px] h-[42px] p-4 bg-white rounded-md flex items-center justify-between">
        <span className="flex flex-row lg:gap-3 gap-2 text-[12px] lg:text-[16px]">
          Teacher | 
          <Image src={"/home.svg"} width={15} height={15} alt="public" />
          - All teachers
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
        <Dropdown 
        
        />
      </div>

      <div className="mt-5 grid lg:grid-cols-4 grid-cols-2 lg:gap-4 gap-2">
        {profiles.map(profile => (
          <ProfileCard
            key={profile.id}
            pic={profile.pic}
            name={profile.name}
            job={profile.job}
            onViewClick={() => handleViewClick(profile.id)}
            onEditClick={() => handleEditClick(profile.id)}
            onDeleteClick={() => handleDeleteClick(profile.id)} editPath={""} viewPath={""}          />
        ))}
      </div>
      {isModalOpen && (
        <Modal onClose={handleCloseModal} />
      )}
    </div>
  );
};

export default Page;
