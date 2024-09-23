"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Modal from "@/components/Modal";
import { useRouter } from "next/navigation";
import Dropdown from "@/components/Dropdown";
import axios from "axios"; // Import Axios for API calls

interface Course {
  id: number;
  name: string;
  code: string;
  description: string;
  credits: number;
  program: number;
  school: number;
}

interface Program {
  id: number;
  name: string;
  description: string;
  school: number;
  courses: Course[];
}

const Page = () => {
  const router = useRouter();
  const [programs, setPrograms] = useState<Program[]>([]); // Store fetched programs
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null); // Store selected program
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [programToDelete, setProgramToDelete] = useState<Program | null>(null); // Store the program to delete

  const [loading, setLoading] = useState<boolean>(true); // State to manage loading
  const [error, setError] = useState<string | null>(null); // State to manage errors

  // Fetch programs from the API
  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const response = await axios.get(
          "http://127.0.0.1:8000/api/academics/program/"
        );
        setPrograms(response.data.results || []); // Adjusted to match the structure
        setLoading(false); // Set loading to false once data is fetched
      } catch (err) {
        setError("Failed to fetch programs");
        setLoading(false); // Stop loading if an error occurs
      }
    };

    fetchPrograms();
  }, []);

  const handleCardClick = (program: Program) => {
    setSelectedProgram(program);
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
    if (programToDelete) {
      try {
        await axios.delete(`http://127.0.0.1:8000/api/academics/program/${programToDelete.id}/`);
        setPrograms(programs.filter((program) => program.id !== programToDelete.id));
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

  const handleviewCourse = (courseId: number) => {
    router.push(`/program/all-program/course/view/${courseId}`);
  };

  const handleShowAllPrograms = () => {
    setSelectedProgram(null);
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
        <div className="w-[40px] h-[40px] p-2 bg-[#213458] flex justify-center items-center">
          <Image
            src={"/add.svg"}
            width={20}
            height={20}
            alt="add"
            onClick={(e) => {
              e.stopPropagation();
              handleAddClick();
            }}
          />
        </div>
      </div>

      {/* Program Cards */}
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
                {program.courses.length} courses
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

      <div className="flex flex-col">
        <div>
          {selectedProgram && (
            <div className="mt-8 lg:w-[1070px]">
              <div>
                <div className="flex flex-row justify-between">
                  <h3 className="text-xl font-bold text-[#213458]">
                    Program: {selectedProgram.name}
                  </h3>
                  <div className="flex flex-row gap-6">
                    <div className="flex flex-row w-[80px] h-[40px] bg-[#213458] p-2">
                      <label htmlFor="" className="text-white">
                        New
                      </label>
                      <Image
                        src={"/add.svg"}
                        width={20}
                        height={20}
                        alt="add"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddCourse(selectedProgram.id);
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <table className="table-auto w-full mt-4 border-b-black">
                <thead>
                  <tr className="border text-center">
                    <th className="border border-black px-2 py-2">
                      Course Name
                    </th>
                    <th className="border border-black px-2 py-2">Code</th>
                    <th className="border border-black px-2 py-2">Credits</th>
                    <th className="border border-black px-2 py-2">
                      Description
                    </th>
                    <th className="border border-black px-2 py-2">Action</th>
                  </tr>
                </thead>
                <tbody className="justify-center items-center text-center">
                  {selectedProgram.courses.map((course) => (
                    <tr key={course.id} className="border text-center">
                      <td className="border border-black px-2 py-2">
                        {course.name}
                      </td>
                      <td className="border border-black px-2 py-2">
                        {course.code}
                      </td>
                      <td className="border border-black px-2 py-2">
                        {course.credits}
                      </td>
                      <td className="border border-black px-2 py-2">
                        {course.description}
                      </td>
                      <td className="flex flex-row gap-5 items-center justify-center border border-black px-2 py-2">
                        <div className="">
                          <Image
                            src={"/view.svg"}
                            width={15}
                            height={15}
                            alt="view"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleviewCourse(course.id); // Pass course.id for viewing
                            }}
                          />
                        </div>
                        <div className="">
                          <Image
                            src={"/update.svg"}
                            width={15}
                            height={15}
                            alt="edit"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditCourse(course.id); // Pass course.id for editing
                            }}
                          />
                        </div>
                        <div className="">
                          <Image
                            src={"/delete.svg"}
                            width={20}
                            height={20}
                            alt="delete"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteCourse(course.id); // Pass course.id for deletion
                            }}
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
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
