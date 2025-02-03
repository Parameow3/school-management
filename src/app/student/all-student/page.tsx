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
  const [searchQuery, setSearchQuery] = useState<string>(""); // Track search term
  const [prevPage, setPrevPage] = useState<string | null>(null);
  const [nextPage, setNextPage] = useState<string | null>(null); // Initialize nextPage to null initially
  const [token, setToken] = useState<string | null>(null); // Store token here
  const [statusFilter, setStatusFilter] = useState<'Active' | 'Inactive'>('Active');


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

  // Function to construct the pagination URL
  const constructUrl = (page: number) => {
    console.log(statusFilter)
    return `${process.env.NEXT_PUBLIC_BASE_URL}/api/academics/students/?p=${page}&status=${statusFilter}`;
  };

  // Fetch profiles (with pagination)
  const fetchProfiles = async (url: string | null) => {
    if (!token || !url) return; // If the URL is null, do nothing

    setLoading(true);
    try {
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setProfiles(response.data.results); // Update profiles with new data
      setPrevPage(response.data.previous); // Set the previous page URL
      setNextPage(response.data.next); // Set the next page URL
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleNextPage = () => {
    if (nextPage) { // Only call if nextPage URL exists
      fetchProfiles(nextPage); // Pass the URL to fetchProfiles
    }
  };

  const handlePrevPage = () => {
    if (prevPage) { // Only call if prevPage URL exists
      fetchProfiles(prevPage); // Pass the URL to fetchProfiles
    }
  };

  useEffect(() => {
    if (token) {
      fetchProfiles(constructUrl(1)); // Start from the first page
    }
  }, [token, statusFilter, fetchProfiles, constructUrl]); // Fetch data when token is available

  // Filter profiles based on search and branch selection
  const filteredProfiles = profiles.filter((profile) => {
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
            <Dropdown onChange={(branchId: number | null) => setSelectedBranch(branchId)} />
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

            <Button
                className="bg-[#213458] text-white font-semibold py-2 px-2 rounded-lg shadow-md hover:bg-[#213458] transition-all duration-300"
                onClick={() => setStatusFilter(statusFilter === 'Active' ? 'Inactive' : 'Active')}
              >
                {statusFilter === 'Active' ? 'Show Inactive' : 'Show Active'}
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
              onViewClick={() => router.push(`/student/all-student/view/${profile.id}`)}
              onEditClick={() => router.push(`/student/all-student/edit/${profile.id}`)}
              onDeleteClick={() => setIsModalOpen(true)}
             />
          ))}
        </div>

        {/* Pagination Buttons */}
        <div className="flex justify-between mt-6">
          <button
            className="bg-[#213458] text-white py-2 px-4 rounded-md shadow-md"
            onClick={handlePrevPage}
            disabled={!prevPage} // Disable if there's no previous page
          >
            Back Page
          </button>

          <button
            className="bg-[#213458] text-white py-2 px-4 rounded-md shadow-md"
            onClick={handleNextPage}
            disabled={!nextPage} // Disable if there's no next page
          >
            Show More
          </button>
        </div>

        {/* Modal */}
        {isModalOpen && (
          <Modal
            onClose={() => setIsModalOpen(false)}
            onConfirm={() => setIsModalOpen(false)} // Replace with actual delete logic
            profileToDelete={profileToDelete}
          />
        )}
      </div>
    </>
  );
};

export default Page;
