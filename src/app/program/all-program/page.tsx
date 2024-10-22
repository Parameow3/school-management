"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Modal from "@/components/Modal";
import { useRouter } from "next/navigation";
import Dropdown from "@/components/Dropdown";
import axios from "axios"; // Import Axios for API calls

interface Program {
  id: number;
  name: string;
  description: string;
  branch: number;
  course_list?: string[]; // course_list is an array of course names (strings)
}

const Page = () => {
  const router = useRouter();
  const [programs, setPrograms] = useState<Program[]>([]);
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [programToDelete, setProgramToDelete] = useState<Program | null>(null);

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);

  // Fetch token from localStorage
  useEffect(() => {
    const tokenFromLocalStorage = localStorage.getItem("authToken");
    if (tokenFromLocalStorage) {
      setToken(tokenFromLocalStorage);
    } else {
      router.push("/login");
    }
  }, [router]);

  // Fetch programs on component mount
  useEffect(() => {
    if (!token) return;

    const fetchPrograms = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/academics/program/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setPrograms(response.data.results || []); // Set programs with course_list
      } catch (err) {
        setError("Failed to fetch programs");
      } finally {
        setLoading(false);
      }
    };

    fetchPrograms();
  }, [token]);

  // When a program is clicked, show its details including course_list
  const handleCardClick = (program: Program) => {
    setSelectedProgram(program); // Set the selected program, including its course_list
  };

  const handleDeleteClick = (program: Program) => {
    setProgramToDelete(program); // Store the program to delete
    setIsModalOpen(true); // Open the confirmation modal
  };

  const closeModal = () => {
    setIsModalOpen(false); // Close the modal
    setProgramToDelete(null); // Clear the program to delete
  };

  const handleDeleteProgram = async () => {
    if (programToDelete && token) {
      try {
        await axios.delete(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/academics/program/${programToDelete.id}/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setPrograms(
          programs.filter((program) => program.id !== programToDelete.id)
        );
        closeModal(); // Close the modal after deletion
      } catch (err) {
        console.error("Failed to delete program", err);
        setError("Failed to delete program");
      }
    }
  };

  const handleEditClick = (id: number) => {
    router.push(`/program/all-program/edit/${id}`);
  };

  const handleShowAllPrograms = () => {
    setSelectedProgram(null); // Reset selected program
  };

  const handleAddClick = () => {
    router.push(`/program/new-program`);
  };

  const handleAddCourse = (programId: number) => {
    router.push(`/program/all-program/course/add/${programId}`);
  };

  const handleEditCourse = (courseId: number) => {
    router.push(`/program/all-program/course/edit/${courseId}`);
  };

  const handleDeleteCourse = (courseId: number) => {
    alert(`Delete course with ID: ${courseId}`);
  };

  return (
    <div className="lg:ml-[16%] ml-[11%] mt-20 flex flex-col">
      {/* Page Header */}
      <div className="lg:w-[1068px] w-[330px] h-[42px] p-2 bg-white rounded-md flex items-center justify-between">
        <span className="flex flex-row lg:gap-3 gap-2 text-[12px] lg:text-[16px]">
          Program |{" "}
          <Image src={"/home.svg"} width={15} height={15} alt="public" /> - All
          Programs
        </span>
        <Link href={"/#"} passHref>
          <div className="h-[23px] w-[57px] bg-[#1c2b47] flex items-center justify-center rounded-md">
            <Image src={"/refresh.svg"} width={16} height={16} alt="Refresh" />
          </div>
        </Link>
      </div>
      <div className="relative mt-4 flex justify-between">
        <Dropdown />
        <div
          className="w-[40px] h-[40px] p-2 bg-[#213458] flex justify-center items-center cursor-pointer"
          onClick={handleAddClick}
        >
          <Image src={"/add.svg"} width={20} height={20} alt="add" />
        </div>
      </div>
      {loading && <p>Loading programs...</p>}
      {error && <p className="text-red-500">{error}</p>}
      <div className="mt-4 grid grid-cols-1 lg:w-[1070px] sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {programs.map((program) => (
          <div
            key={program.id}
            onClick={() => handleCardClick(program)}
            className={`p-4 bg-white rounded-lg shadow-md cursor-pointer h-[130px] flex flex-col justify-between ${
              selectedProgram && selectedProgram.id !== program.id
                ? "hidden"
                : ""
            }`}
          >
            <div className="flex justify-between items-center">
              <h2 className="font-bold text-[18px]">{program.name}</h2>
              <div className="flex gap-2">
                <Image
                  src={"/edit.svg"}
                  width={20}
                  height={20}
                  alt="Edit"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEditClick(program.id);
                  }}
                />
                <Image
                  src={"/delete.svg"}
                  width={20}
                  height={20}
                  alt="Delete"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteClick(program); // Trigger delete modal
                  }}
                />
              </div>
            </div>
            <p className="text-[14px] font-normal mt-2">
              {program.description}
            </p>
            <div className="flex justify-between items-center mt-auto">
              <p className="text-[16px] font-medium">
                {program.course_list
                  ? `${program.course_list.length} courses`
                  : "No courses available"}
              </p>
              <Image
                src={"/program.svg"}
                width={24}
                height={24}
                alt="courses"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Program Details and Courses Table */}
      <div className="flex flex-col">
        <div>
          {selectedProgram && (
            <div className="mt-8 lg:w-[440px]">
              <div>
                <div className="flex flex-row justify-between">
                  <h3 className="text-xl font-bold text-[#213458]">
                    Program: {selectedProgram.name}
                  </h3>
                  <div className="flex flex-row gap-6">
                     <button onClick={(e) => {
                          e.stopPropagation();
                          handleAddCourse(selectedProgram.id);
                        }} className="bg-[#213458] text-white py-2 px-4 rounded-md shadow-md hover:bg-[#1c2b47] transition-all"> New course</button>
                        
                  </div>
                </div>
              </div>

              <table className="table-auto w-[440px] mt-4 border-b-black">
                <thead>
                  <tr className="border text-center">
                    <th className="border border-black px-2 py-2">
                      Course Name
                    </th>
                  </tr>
                </thead>
                <tbody className="justify-center items-center text-center">
                  {selectedProgram?.course_list?.length ? (
                    selectedProgram.course_list.map((course, index) => (
                      <tr key={index} className="border text-center">
                        <td className="border border-black px-2 py-2">
                          {course}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={1} className="text-center p-4">
                        No courses available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
              <button
                onClick={handleShowAllPrograms}
                className="mt-4 px-4 py-2 mb-4 bg-[#213458] text-white rounded-md"
              >
                Show All Programs
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Confirmation Modal for Deleting Program */}
      {isModalOpen && (
        <Modal
          onClose={closeModal}
          onConfirm={handleDeleteProgram}
          message={`Are you sure you want to delete the program "${programToDelete?.name}"?`}
        />
      )}
    </div>
  );
};

export default Page;
