'use client';
import axios from 'axios';
import ProgramDropdown from '@/components/programDropdown';
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import ProfileCard from "@/components/ProfileCard";
import Modal from "@/components/Modal";

interface TeacherProfile {
  id: number;
  pic: string;
  user: {
    username: string;
    email: string;
  };
  job: string;
  specialization: string; // Assuming this is the field you're filtering by
}

const Page = () => {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSpecialization, setSelectedSpecialization] = useState<string | null>(null); // Change to specialization
  const [profileToDelete, setProfileToDelete] = useState<number | null>(null);
  const [profiles, setProfiles] = useState<TeacherProfile[]>([]);
  const [error, setError] = useState<string | null>(null); // Track errors

  // Fetch token from localStorage
  useEffect(() => {
    const tokenFromLocalStorage = localStorage.getItem("authToken");
    if (tokenFromLocalStorage) {
      setToken(tokenFromLocalStorage); 
    } else {
      // Redirect to login if no token found
      router.push("/login");
    }
  }, [router]);

  // Fetch teacher profiles
  useEffect(() => {
    const fetchProfiles = async () => {
      if (token) {
        try {
          const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/teacher`, {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`, // Add token to Authorization header
            },
          });

          // Process teacher profiles
          const fetchedProfiles = response.data.results.map((teacher: any) => ({
            id: teacher.id,
            pic: teacher.image || "/default-pic.jpg", // Assuming default image if none provided
            user: {
              username: teacher.user.username,
              email: teacher.user.email,
            },
            job: "Teacher", // Default job as "Teacher"
            specialization: teacher.specialization, // Assuming specialization is a field
          }));

          setProfiles(fetchedProfiles);
        } catch (error: any) {
          console.error("Error fetching profiles:", error);
          if (error.response && error.response.status === 403) {
            setError("Authorization failed. Please check your token.");
          } else {
            setError("An error occurred while fetching teacher profiles.");
          }
        }
      }
    };
    fetchProfiles();
  }, [token]); // Fetch profiles when token is available

  // Handle view button click
  const handleViewClick = (id: number) => {
    router.push(`/teacher/all-teacher/view/${id}`);
  };

  // Handle edit button click
  const handleEditClick = (id: number) => {
    router.push(`/teacher/all-teacher/edit/${id}`);
  };

  // Handle delete button click
  const handleDeleteClick = (id: number) => {
    setIsModalOpen(true);
    setProfileToDelete(id);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setProfileToDelete(null);
  };

  // Handle program (specialization) change from dropdown
  const handleProgramChange = (selectedPrograms: number[]) => {
    setSelectedSpecialization(selectedPrograms[0].toString()); // Assuming specialization is a string
  };

  // Confirm delete handler
  const handleConfirmDelete = async () => {
    if (profileToDelete !== null) {
      try {
        await axios.delete(`${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/user/teacher/${profileToDelete}/`, {
          headers: {
            Authorization: `Bearer ${token}`, // Add token to Authorization header
          },
        });
        setProfiles(profiles.filter((profile) => profile.id !== profileToDelete));
        setIsModalOpen(false);
      } catch (error) {
        console.error("Error deleting profile:", error);
      }
    }
  };

  // Filter profiles by selected specialization
  const filteredProfiles = selectedSpecialization
    ? profiles.filter((profile) => profile.specialization === selectedSpecialization)
    : profiles;

  const handleAdd = () => {
    router.push(`/teacher/new-teacher`);
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
            <Image src={"/refresh.svg"} width={16} height={16} alt="Refresh" />
          </div>
        </Link>
      </div>
      
      {error && <div className="text-red-500">{error}</div>} {/* Display error */}

      <div className="relative mt-2 flex flex-row justify-between">
        {/* Program dropdown (for specialization) */}
        <ProgramDropdown onSelect={handleProgramChange} />

        <button onClick={handleAdd} className='bg-[#213458] text-white py-2 px-6 rounded-lg shadow-lg hover:bg-[#213498] transition-all duration-300 ease-in-out transform hover:scale-105'>
          New Teacher
        </button>
      </div>
      
      <div className="mt-5 grid lg:grid-cols-4 grid-cols-2 lg:gap-4 gap-2">
        {filteredProfiles.map((profile) => (
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
