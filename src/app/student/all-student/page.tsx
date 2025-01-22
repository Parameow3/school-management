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
import { useCallback } from 'react';

const Page = () => {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [profileToDelete, setProfileToDelete] = useState<number | null>(null);
  const [profiles, setProfiles] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedBranch, setSelectedBranch] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>(""); // Track search term
  const [nextPage, setNextPage] = useState<string | null>(`${process.env.NEXT_PUBLIC_BASE_URL}/api/academics/students/?page=1`); // Store next page URL
  const [token, setToken] = useState<string | null>(null); // Store token here

  // Fetch token from localStorage
  useEffect(() => {
    const tokenFromLocalStorage = localStorage.getItem("authToken");
    if (tokenFromLocalStorage) {
      setToken(tokenFromLocalStorage);
    } else {
      // Redirect to login if no token
      router.push("/login");
    }
  }, [router]);

  // Fetch profiles (with pagination)
  const fetchProfiles = async () => {
    if (!token || !nextPage) return;

    setLoading(true);
    try {
      const response = await axios.get(nextPage, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setProfiles((prevProfiles) => [...prevProfiles, ...response.data.results]);
      setNextPage(response.data.next); // Set the next page URL or null if there are no more pages
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchProfile = useCallback(() => {
    // Your logic for fetching profiles
    if (!token) return;
    console.log("Fetching profiles with token:", token);
    // Perform fetch logic
  }, [token]); // Include `token` as a dependency

  useEffect(() => {
    fetchProfile(); // Initial fetch when component loads
  }, [fetchProfile]); // Use the memoized function as a dependency


  const handleBranchChange = (branchId: number | null) => {
    if (branchId === null) {
      // Handle "All branches" or null case if applicable
      console.log("All branches selected");
      setSelectedBranch(null); // Set `null` for "All"
    } else {
      console.log("Selected branch ID:", branchId);
      setSelectedBranch(branchId); // Update to the selected branch
    }
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
    if (profileToDelete !== null && token) {
      try {
        await axios.delete(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/academics/students/${profileToDelete}/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        // After deleting, update the profiles list
        setProfiles(
          profiles.filter((profile) => profile.id !== profileToDelete)
        );
      } catch (err: any) {
        setError("Failed to delete the profile.");
      } finally {
        setIsModalOpen(false); // Close modal after deletion
      }
    }
  };

  // Filter profiles based on search and branch selection
  const filteredProfiles = (profiles || []).filter((profile) => {
    const matchesBranch = selectedBranch
      ? profile.branch === selectedBranch
      : true;
    const matchesSearch =
      profile.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      profile.last_name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesBranch && matchesSearch;
  });

  return (
    <>
      <div className="lg:ml-[16%] ml-[11%] mt-20 flex flex-col">
        {/* Header Section */}
        <div className="lg:w-[1068px] bg-white w-[330px] h-[42px] ml-4 p-4 rounded-md flex items-center justify-between shadow-sm">
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

        {/* Search Input */}
        <div className="mb-4 relative ml-4 mt-4">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8 4a6 6 0 100 12 6 6 0 000-12zm8 8l4 4"
              />
            </svg>
          </span>
          <input
            type="text"
            className="border border-gray-300 rounded-full pl-10 py-2 pr-5 lg:py-3 w-[280px] lg:w-[380px] focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm placeholder-gray-400 text-sm"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)} // Update search query
          />
        </div>

        <div className="relative mt-4 ml-4 flex flex-row space-x-2 justify-between items-center gap-[24px]">
          {/* Branch Dropdown */}
          <div className="w-full lg:w-[300px]">
            <Dropdown onChange={handleBranchChange} />
          </div>
          {/* Buttons */}
          <div className="flex flex-row gap-2">
            <Button
              className="bg-[#213458] text-white font-semibold py-2 px-2 rounded-lg shadow-md hover:bg-[#213458] transition-all duration-300 mr-4"
              onClick={() => router.push(`/student/new-student`)}
            >
              New Student
            </Button>

            <Button
              className="bg-[#213458] text-white font-semibold py-2 px-2 rounded-lg shadow-md hover:bg-[#213458] transition-all duration-300"
              onClick={() => router.push(`/student/trial-student`)}
            >
              New Trial
            </Button>
          </div>
        </div>

        {/* Profiles List */}
        <div className="mt-5 p-5 w-[330px] lg:w-[1055px] grid grid-cols-2 gap-5 lg:gap-10 lg:grid-cols-4">
          {filteredProfiles.map((profile) => (
            <ProfileCard
              key={profile.id}
              pic={profile.image || "/default-image.jpg"} // Use a default image if profile.image is null
              first_name={`${profile.first_name} ${profile.last_name}`}
              job={"Student"}
              onViewClick={() => handleViewClick(profile.id)}
              onEditClick={() => handleEditClick(profile.id)}
              onDeleteClick={() => handleDeleteClick(profile.id)}
              editPath={`/student/edit/${profile.id}`}
              viewPath={`/student/view/${profile.id}`}
            />
          ))}
        </div>



        {/* "Show More" Button */}
        {nextPage && (
          <div className="flex justify-center mt-5">
            <Button
              className="bg-[#213458] text-white py-2 px-6 rounded-lg shadow-lg hover:bg-blue-600 transition-all duration-300 ease-in-out transform hover:scale-105"
              onClick={fetchProfiles}
            >
              Show More
            </Button>
          </div>
        )}

        {/* Modal for Deleting */}
        {isModalOpen && (
          <Modal
            onClose={handleCloseModal}
            onConfirm={handleConfirmDelete}
            message="Are you sure you want to delete this card?"
          />
        )}
      </div>
    </>
  );
};

export default Page;
