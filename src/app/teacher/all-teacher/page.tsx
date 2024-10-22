"use client";
import axios from "axios";
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
  specialization: string;
}

interface Specialization {
  id: number;
  name: string;
}

const Page = () => {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSpecialization, setSelectedSpecialization] = useState<string | null>(null);
  const [specializations, setSpecializations] = useState<Specialization[]>([]); // Store specializations
  const [profileToDelete, setProfileToDelete] = useState<number | null>(null);
  const [profiles, setProfiles] = useState<TeacherProfile[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>(""); // New state for search query
  const [error, setError] = useState<string | null>(null);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);  // Add loading state
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const pageSize = 10;

  // Fetch token from localStorage
  useEffect(() => {
    const tokenFromLocalStorage = localStorage.getItem("authToken");
    if (tokenFromLocalStorage) {
      setToken(tokenFromLocalStorage);
    } else {
      router.push("/login");
    }
  }, [router]);

  // Fetch teacher profiles and specializations
  useEffect(() => {
    const fetchData = async () => {
      if (token) {
        try {
          setLoading(true); // Start loading

          // Fetch teacher profiles (initial page)
          const profilesResponse = await axios.get(
            `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/teacher?page=1`,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
          );

          const fetchedProfiles = profilesResponse.data.results.map((teacher: any) => ({
            id: teacher.id,
            pic: teacher.image || "/default-pic.jpg",
            user: {
              username: teacher.user.username,
              email: teacher.user.email,
            },
            job: "Teacher",
            specialization: teacher.specialization,
          }));

          setProfiles(fetchedProfiles);
          setTotalItems(profilesResponse.data.count);

          // Fetch specializations
          const specializationsResponse = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/academics/program/`, {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          });
          
          console.log("Fetched Specializations:", specializationsResponse.data.results);
          setSpecializations(specializationsResponse.data.results || []);
        } catch (error: any) {
          console.error("Error fetching data:", error);
          setError("An error occurred while fetching data.");
        } finally {
          setLoading(false);  // Stop loading
        }
      }
    };

    fetchData();
  }, [token]);

  const handleShowMore = async () => {
    if (token && !loadingMore) {
      setLoadingMore(true);
      try {
        // Fetch all remaining teacher profiles instead of just the next page
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/teacher?all=true`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const allProfiles = response.data.results.map((teacher: any) => ({
          id: teacher.id,
          pic: teacher.image || "/default-pic.jpg",
          user: {
            username: teacher.user.username,
            email: teacher.user.email,
          },
          job: "Teacher",
          specialization: teacher.specialization,
        }));

        // Set all profiles to the state (replace the old profiles with new ones)
        setProfiles(allProfiles);
      } catch (error: any) {
        console.error("Error fetching all profiles:", error);
      } finally {
        setLoadingMore(false);
      }
    }
  };

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

  // Handle specialization change from dropdown
  const handleSpecializationChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSpecialization(event.target.value);
  };

  const handleConfirmDelete = async () => {
    if (profileToDelete !== null) {
      try {
        await axios.delete(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/user/teacher/${profileToDelete}/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setProfiles(profiles.filter((profile) => profile.id !== profileToDelete));
        setIsModalOpen(false);
      } catch (error) {
        console.error("Error deleting profile:", error);
      }
    }
  };

  // Handle search input
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  // Filter profiles based on search query or specialization
  const filteredProfiles = profiles.filter((profile) =>
    profile.user.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const finalProfiles = selectedSpecialization
    ? filteredProfiles.filter((profile) => profile.specialization === selectedSpecialization)
    : filteredProfiles;

  const handleAdd = () => {
    router.push(`/teacher/new-teacher`);
  };

  return (
    <div className="lg:ml-[16%] ml-[45px] mt-20 flex flex-col">
      {/* Header section */}
      <div className="lg:w-[1068px] w-[330px] h-[42px] p-4 bg-white rounded-md flex items-center justify-between">
        <span className="flex flex-row lg:gap-3 gap-2 text-[12px] lg:text-[16px]">
          Teacher |
          <Image src={"/home.svg"} width={15} height={15} alt="public" />- All
          teachers
        </span>
        <Link href={"/#"} passHref>
          <div className="h-[23px] w-[57px] bg-[#1c2b47] flex items-center justify-center rounded-md">
            <Image src={"/refresh.svg"} width={16} height={16} alt="Refresh" />
          </div>
        </Link>
      </div>

      {error && <div className="text-red-500">{error}</div>} {/* Display error */}

      <div className="relative mt-2 flex flex-row justify-between">
        <select
          id="specialization"
          name="specialization"
          value={selectedSpecialization || ""}
          onChange={handleSpecializationChange}
          className="mt-1 block lg:w-[272px] w-[329px] h-[40px] p-2 rounded-md outline-none border-gray-300 shadow-sm"
        >
          <option value="" disabled>
            Select a program
          </option>
          {Array.isArray(specializations) &&
            specializations.map((spec) => (
              <option key={spec.id} value={spec.name}>
                {spec.name}
              </option>
            ))}
        </select>

        {/* Search input */}
        <input
          type="text"
          placeholder="Search by username or email"
          value={searchQuery}
          onChange={handleSearchChange}
          className="mt-1 block lg:w-[297px] text-[15px] p-2 w-[329px] h-[40px] rounded-md outline-none border-gray-300 shadow-sm"
        />

        <button
          onClick={handleAdd}
          className="bg-[#213458] text-[15px] text-white py-2 px-5 rounded-lg shadow-lg hover:bg-[#213498] transition-all duration-300 ease-in-out transform hover:scale-105"
        >
          New Teacher
        </button>
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="mt-5 grid lg:grid-cols-4 grid-cols-2 lg:gap-4 gap-2">
          {finalProfiles.map((profile) => (
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
      )}

      <div className="flex justify-center mt-6">
        {profiles.length < totalItems && ( // Show the button only if more profiles are available
          <button
            onClick={handleShowMore}
            disabled={loadingMore}
            className="bg-[#213458] text-white py-2 px-6 rounded-lg shadow-lg hover:bg-[#213498] transition-all duration-300 ease-in-out"
          >
            {loadingMore ? "Loading..." : "Show More"}
          </button>
        )}
      </div>

      {isModalOpen && (
        <Modal
          onClose={handleCloseModal}
          onConfirm={handleConfirmDelete}
          message="Are you sure you want to delete this teacher?"
        />
      )}
    </div>
  );
};

export default Page;
