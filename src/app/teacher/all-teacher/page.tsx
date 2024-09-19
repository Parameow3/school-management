'use client';
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
  branch: number;
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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState<number | null>(null); 
  const [profileToDelete, setProfileToDelete] = useState<number | null>(null);
  const [profiles, setProfiles] = useState<TeacherProfile[]>([]);
  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/auth/teacher");
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
    fetchProfiles();
  }, []); 

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
    setProfileToDelete(null);
  };
  const handleBranchChange = (branchId: number) => {
    setSelectedBranch(branchId);  
  };
  
  useEffect(() => {
    console.log("branch", selectedBranch);
  }, [selectedBranch]);
  const handleConfirmDelete = async () => {
    if (profileToDelete !== null) {
      try {
        await axios.delete(`http://127.0.0.1:8000/api/auth/teacher/${profileToDelete}/`);
        setProfiles(profiles.filter(profile => profile.id !== profileToDelete));
        setIsModalOpen(false);
      } catch (error) {
        console.error("Error deleting profile:", error);
      }
    }
  };
  const filteredProfiles = selectedBranch
  
  ? profiles.filter((profile) => profile.branch === selectedBranch) // Filter profiles by branch_id
  : profiles;
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
      <div className="relative mt-2">
        <Dropdown onChange={handleBranchChange} />
      </div>
      <div className="mt-5 grid lg:grid-cols-4 grid-cols-2 lg:gap-4 gap-2">
        {filteredProfiles.map(profile => (
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
        <Modal
          onClose={handleCloseModal}
          onConfirm={handleConfirmDelete} // Pass the confirm delete function to Modal
          message="Are you sure you want to delete this teacher?" // Custom message for the delete action
        />
      )}
    </div>
  );
};

export default Page;
