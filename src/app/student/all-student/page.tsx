"use client";
import Dropdown from "@/components/Dropdown";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import ProfileCard from "@/components/ProfileCard";
import Modal from "@/components/Modal";
import axios from "axios";
import ProgramDropdown from "@/components/programDropdown";

const Page = () => {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [profileToDelete, setProfileToDelete] = useState<number | null>(null);
  const [profiles, setProfiles] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [availablePrograms, setAvailablePrograms] = useState<any[]>([]); // Available programs
  const [formData, setFormData] = useState({
    programs: [] as number[], // Stores selected program IDs
  });

  useEffect(() => {
    // Fetch profiles
    const fetchProfiles = async () => {
      try {
        const response = await axios.get(
          "http://127.0.0.1:8000/api/academics/students/?page=1"
        );
        setProfiles(response.data.results);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    // Fetch programs
    const fetchPrograms = async () => {
      try {
        const response = await axios.get(
          "http://127.0.0.1:8000/api/academics/program/?page=1"
        );
        setAvailablePrograms(response.data.results); // Assuming the programs come in a `results` array
      } catch (err: any) {
        setError(err.message);
      }
    };

    fetchProfiles();
    fetchPrograms();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(e.target.selectedOptions).map((option) =>
      Number(option.value)
    );
    setFormData({ ...formData, programs: selectedOptions });
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

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setProfileToDelete(null); // Reset profile to delete
  };

  const handleConfirmDelete = async () => {
    if (profileToDelete !== null) {
      try {
        await axios.delete(
          `http://127.0.0.1:8000/api/academics/students/${profileToDelete}/`
        );
        // After deleting, refetch the profiles or remove the deleted one from the state
        setProfiles(profiles.filter((profile) => profile.id !== profileToDelete));
      } catch (err: any) {
        setError("Failed to delete the profile.");
      } finally {
        setIsModalOpen(false); // Close modal after deletion
      }
    }
  };

  return (
    <>
      <div className="lg:ml-[16%] ml-[11%] mt-20 flex flex-col">
        {/* Header Section */}
        <div className="lg:w-[1068px] w-[330px] h-[42px] ml-4 p-4 bg-white rounded-md flex items-center justify-between shadow-sm">
          <span className="flex flex-row lg:gap-3 gap-2 text-[12px] lg:text-[16px] items-center">
            Student |
            <Image
              src={"/home.svg"}
              width={15}
              height={15}
              alt="public"
              className="ml-1"
            />
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

        <div className="relative mt-4 ml-4 flex flex-row space-x-2 items-center">
          {/* Branch Dropdown */}
          <div className="w-full lg:w-[300px]">
            <Dropdown />
          </div>

          {/* Program Dropdown */}
          <div className="w-full lg:w-[300px]">
            <ProgramDropdown />
          </div>
        </div>

        {/* Profiles List */}
        <div className="mt-5 p-5 w-[330px] lg:w-[1055px] grid grid-cols-2 gap-5 lg:gap-10 lg:grid-cols-4">
          {profiles.map((profile) => (
            <ProfileCard
              key={profile.id}
              pic={profile.pic || "/photo.jpg"} // Fallback to a default profile image if not provided
              first_name={profile.first_name}
              job={profile.job || "Student"} // Fallback if job is not provided
              onViewClick={() => handleViewClick(profile.id)}
              onEditClick={() => handleEditClick(profile.id)}
              onDeleteClick={() => handleDeleteClick(profile.id)}
              editPath=""
              viewPath=""
            />
          ))}
        </div>

        {/* Modal for Deleting */}
        {isModalOpen && (
          <Modal
            onClose={handleCloseModal}
            onConfirm={handleConfirmDelete} // Pass the confirm delete function to Modal
            message="Are you sure you want to delete this card?" // Optional message to display in the modal
          />
        )}
      </div>
    </>
  );
};

export default Page;
