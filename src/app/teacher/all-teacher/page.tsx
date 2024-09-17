"use client";
import axios from 'axios';
import Dropdown from "@/components/Dropdown";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import ProfileCard from "@/components/ProfileCard";
import Modal from "@/components/Modal";

// Define the structure of the teacher profile data
interface TeacherProfile {
  id: number;
  pic: string;
  user: {
    username: string;
    email: string;
  };
  job: string;
}

const Page = () => {
  const router = useRouter();
  
  // State for modal visibility and selected profile to delete
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [profileToDelete, setProfileToDelete] = useState<number | null>(null);
  const [profiles, setProfiles] = useState<TeacherProfile[]>([]);

  // Fetch teacher profiles when the component mounts
  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/auth/teacher?page=1");
        const fetchedProfiles = response.data.results.map((teacher: any) => ({
          id: teacher.id,
          pic: "/photo.jpg", // Placeholder for the teacher's profile picture
          user: {
            username: teacher.user.username,
            email: teacher.user.email,
          },
          job: "Teacher", 
        }));
        setProfiles(fetchedProfiles);
      } catch (error) {
        console.error("Error fetching profiles:", error);
      }
    };

    // Calling the fetchProfiles function
    fetchProfiles();
  }, []); 
  const handleViewClick = (id: number) => {
    router.push(`/teacher/all-teacher/view/${id}`);
  };
  const handleEditClick = (id: number) => {
    router.push(`/teacher/all-teacher/edit/${id}`);
  };

  // Handler for deleting a teacher's profile
  const handleDeleteClick = (id: number) => {
    setIsModalOpen(true);
    setProfileToDelete(id);
  };
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="lg:ml-[16%] ml-[45px] mt-20 flex flex-col">
      {/* Header section */}
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

      {/* Dropdown */}
      <div className="relative mt-2">
        <Dropdown />
      </div>

      {/* Profiles grid */}
      <div className="mt-5 grid lg:grid-cols-4 grid-cols-2 lg:gap-4 gap-2">
        {profiles.map(profile => (
          <ProfileCard
            key={profile.id}
            pic={profile.pic}
            first_name={profile.user.username}
            job={profile.job}
            onViewClick={() => handleViewClick(profile.id)}
            onEditClick={() => handleEditClick(profile.id)}
            onDeleteClick={() => handleDeleteClick(profile.id)}
            editPath={`/teacher/all-teacher/edit/${profile.id}`}
            viewPath={`/teacher/all-teacher/view/${profile.id}`}
          />
        ))}
      </div>

      {/* Modal for confirming profile deletion */}
      {isModalOpen && (
        <Modal onClose={handleCloseModal} />
      )}
    </div>
  );
};

export default Page;


