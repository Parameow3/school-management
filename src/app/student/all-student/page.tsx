"use client";
import Dropdown from "@/components/Dropdown";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import ProfileCard from "@/components/ProfileCard";
import Modal from "@/components/Modal";
import axios from "axios";
import Button from "@/components/Button";

const Page = () => {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [profileToDelete, setProfileToDelete] = useState<number | null>(null);
  const [profiles, setProfiles] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedBranch, setSelectedBranch] = useState<number | null>(null);
  const [availablePrograms, setAvailablePrograms] = useState<any[]>([]); // Available programs
  const [formData, setFormData] = useState({
    programs: [] as number[], // Stores selected program IDs
  });
  
  const [token, setToken] = useState<string | null>(null); // Store token here
  useEffect(() => {
    const tokenFromLocalStorage = localStorage.getItem("authToken");
    if (tokenFromLocalStorage) {
      setToken(tokenFromLocalStorage);
    } else {
      // Redirect to login if no token
      router.push("/login");
    }
  }, [router]);

  // Fetch profiles data after token is available
  useEffect(() => {
    const fetchProfiles = async () => {
      if (!token) return; // Only fetch if token is available

      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/academics/students/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setProfiles(response.data.results);
        console.log("student", response.data.results);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfiles();
  }, [token]);

  // Fetch programs after token is set
  useEffect(() => {
    const fetchPrograms = async () => {
      if (!token) return; // Only fetch if token is available

      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/academics/program`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setAvailablePrograms(response.data.results); 
      } catch (err: any) {
        setError(err.message);
      }
    };

    fetchPrograms();
  }, [token]);

  const handleBranchChange = (branchId: number) => {
    setSelectedBranch(branchId);
  };

  useEffect(() => {
    console.log("branch", selectedBranch);
  }, [selectedBranch]);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(e.target.selectedOptions).map((option) => Number(option.value));
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

  const handleClickNew = () => {
    router.push(`/student/new-student`);
  };

  const handleClickTrial = () => {
    router.push(`/student/trial-student`);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setProfileToDelete(null); // Reset profile to delete
  };

  const handleConfirmDelete = async () => {
    if (profileToDelete !== null && token) {
      try {
        await axios.delete(`${process.env.NEXT_PUBLIC_BASE_URL}/api/academics/students/${profileToDelete}/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        // After deleting, refetch the profiles or remove the deleted one from the state
        setProfiles(profiles.filter((profile) => profile.id !== profileToDelete));
      } catch (err: any) {
        setError("Failed to delete the profile.");
      } finally {
        setIsModalOpen(false); // Close modal after deletion
      }
    }
  };

  const filteredProfiles = selectedBranch
    ? profiles.filter((profile) => profile.branch === selectedBranch) // Filter profiles by branch_id
    : profiles;

  return (
    <>
      <div className="lg:ml-[16%] ml-[11%] mt-20 flex flex-col">
        {/* Header Section */}
        <div className="lg:w-[1068px] bg-white w-[330px] h-[42px] ml-4 p-4 rounded-md flex items-center justify-between shadow-sm">
          <span className="flex flex-row lg:gap-3 gap-2 text-[12px] lg:text-[16px] items-center">
            Student |
            <Image src={"/home.svg"} width={15} height={15} alt="public" className="ml-1" />
            - All students
          </span>
          <Link href={"/#"} passHref>
            <div className="h-[23px] w-[57px] bg-[#1c2b47] flex items-center justify-center rounded-md hover:bg-[#16223a] cursor-pointer">
              <Image src={"/refresh.svg"} width={16} height={16} alt="Refresh" />
            </div>
          </Link>
        </div>

        <div className="relative mt-4 ml-4 flex flex-row space-x-2 items-center gap-[424px]">
          {/* Branch Dropdown */}
          <div className="w-full lg:w-[300px]">
            <Dropdown onChange={handleBranchChange} />
          </div>

          <div className="flex flex-row gap-2">
            <Button className="bg-[#213458] text-white font-semibold py-2 px-2 rounded-lg shadow-md hover:bg-[#213458] transition-all duration-300 mr-4" onClick={handleClickNew}>
              New Student
            </Button>

            <Button className="bg-[#213458] text-white font-semibold py-2 px-2 rounded-lg shadow-md hover:bg-[#213458] transition-all duration-300" onClick={handleClickTrial}>
              New Trial
            </Button>
          </div>
        </div>

        {/* Profiles List */}
        <div className="mt-5 p-5 w-[330px] lg:w-[1055px] grid grid-cols-2 gap-5 lg:gap-10 lg:grid-cols-4">
          {filteredProfiles.map((profile) => (
            <ProfileCard
              key={profile.id}
              pic={profile.image || "/photo.jpg"} // Pass only the image URL string
              first_name={`${profile.first_name} ${profile.last_name}`} // Combine first and last name
              job={profile.job || "Student"} // Assuming 'belt_level' is like a rank or title
              onViewClick={() => handleViewClick(profile.id)}
              onEditClick={() => handleEditClick(profile.id)}
              onDeleteClick={() => handleDeleteClick(profile.id)}
              editPath={`/student/edit/${profile.id}`} // Provide edit path
              viewPath={`/student/view/${profile.id}`} // Provide view path
            />
          ))}
        </div>

        {/* Modal for Deleting */}
        {isModalOpen && (
          <Modal onClose={handleCloseModal} onConfirm={handleConfirmDelete} message="Are you sure you want to delete this card?" />
        )}
      </div>
    </>
  );
};

export default Page;
