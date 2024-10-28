"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Modal from "@/components/Modal";
import { useRouter } from "next/navigation";
import axios from "axios";

interface Program {
  id: number;
  name: string;
  description: string;
  branch: number;
  school: number; // Assuming programs are associated with schools by an ID
  course_list?: string[];
}

interface School {
  id: number;
  name: string;
}

const Page = () => {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [programToDelete, setProgramToDelete] = useState<Program | null>(null);
  const [courseToDelete, setCourseToDelete] = useState<string | null>(null);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [filteredPrograms, setFilteredPrograms] = useState<Program[]>([]);
  const [schools, setSchools] = useState<School[]>([]);
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [selectedSchoolId, setSelectedSchoolId] = useState<string>("all"); // For filtering by school

  // Fetch token from localStorage
  useEffect(() => {
    const tokenFromLocalStorage = localStorage.getItem("authToken");
    if (tokenFromLocalStorage) {
      setToken(tokenFromLocalStorage);
    } else {
      router.push("/login");
    }
  }, [router]);

  // Fetch programs and schools on component mount
  useEffect(() => {
    const fetchProgramsAndSchools = async () => {
      if (!token) return;
      setLoading(true);

      try {
        const [programResponse, schoolResponse] = await Promise.all([
          axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/academics/program/`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://127.0.0.1:8000/api/schools", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setPrograms(programResponse.data.results || []);
        setFilteredPrograms(programResponse.data.results || []); // Initialize with all programs
        setSchools(schoolResponse.data.results || []); // Set schools for dropdown

      } catch (err) {
        setError("Failed to fetch programs or schools");
      } finally {
        setLoading(false);
      }
    };

    fetchProgramsAndSchools();
  }, [token]);

  // Filter programs based on selected school
  useEffect(() => {
    if (selectedSchoolId === "all") {
      setFilteredPrograms(programs);
    } else {
      const filtered = programs.filter((program) => program.school === Number(selectedSchoolId));
      setFilteredPrograms(filtered);
    }
  }, [selectedSchoolId, programs]);

  const handleSchoolSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSchoolId(event.target.value);
    setSelectedProgram(null); // Reset detailed view when changing filter
  };

  const handleCardClick = (program: Program) => {
    setSelectedProgram(program);
  };

  const handleDeleteClick = (program: Program) => {
    setProgramToDelete(program);
    setCourseToDelete(null); // Clear courseToDelete when deleting a program
    setIsModalOpen(true);
  };

  const handleCourseDeleteClick = (courseId: string) => {
    setCourseToDelete(courseId);
    setProgramToDelete(null); // Clear programToDelete when deleting a course
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setProgramToDelete(null);
    setCourseToDelete(null);
  };

  const handleDeleteProgram = async () => {
    if (programToDelete && token) {
      try {
        await axios.delete(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/academics/program/${programToDelete.id}/`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setPrograms(programs.filter((program) => program.id !== programToDelete.id));
        setFilteredPrograms(filteredPrograms.filter((program) => program.id !== programToDelete.id));
        closeModal();
      } catch (err) {
        console.error("Failed to delete program", err);
        setError("Failed to delete program");
      }
    }
  };

  const handleDeleteCourse = async () => {
    if (courseToDelete && selectedProgram && token) {
      try {
        await axios.delete(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/academics/course/${courseToDelete}/`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setSelectedProgram({
          ...selectedProgram,
          course_list: selectedProgram.course_list?.filter((course) => course !== courseToDelete),
        });
        setPrograms(
          programs.map((program) =>
            program.id === selectedProgram.id
              ? { ...program, course_list: program.course_list?.filter((course) => course !== courseToDelete) }
              : program
          )
        );
        closeModal();
      } catch (err) {
        console.error("Failed to delete course", err);
        setError("Failed to delete course");
      }
    }
  };

  const handleEditClick = (id: number) => {
    router.push(`/program/all-program/edit/${id}`);
  };

  const handleAddClick = () => {
    router.push(`/program/new-program`);
  };

  const handleAddCourse = (programId: number) => {
    router.push(`/program/all-program/course/add/${programId}`);
  };

  const handleEditCourse = (courseId: string) => {
    router.push(`/program/all-program/course/edit/${courseId}`);
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

      {/* School Filter Dropdown */}
      <div className="relative mt-4 flex justify-between">
        <select
          value={selectedSchoolId}
          onChange={handleSchoolSelect}
          className="border border-gray-300 rounded-md w-full max-w-xs px-3 py-2 mb-4"
        >
          <option value="all">All Schools</option>
          {schools.map((school) => (
            <option key={school.id} value={school.id}>
              {school.name}
            </option>
          ))}
        </select>
        <div
          className="w-[40px] h-[40px] p-2 bg-[#213458] flex justify-center items-center cursor-pointer"
          onClick={handleAddClick}
        >
          <Image src={"/add.svg"} width={20} height={20} alt="add" />
        </div>
      </div>

      {loading && <p>Loading programs...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {/* Display Filtered Programs */}
      <div className="mt-4 grid grid-cols-1 lg:w-[1070px] sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredPrograms.map((program) => (
          <div
            key={program.id}
            onClick={() => handleCardClick(program)}
            className={`p-4 bg-white rounded-lg shadow-md cursor-pointer h-[130px] flex flex-col justify-between ${
              selectedProgram && selectedProgram.id !== program.id ? "hidden" : ""
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
                    handleDeleteClick(program);
                  }}
                />
              </div>
            </div>
            <p className="text-[14px] font-normal mt-2">{program.description}</p>
            <div className="flex justify-between items-center mt-auto">
              <p className="text-[16px] font-medium">
                {program.course_list ? `${program.course_list.length} courses` : "No courses available"}
              </p>
              <Image src={"/program.svg"} width={24} height={24} alt="courses" />
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col">
        <div>
          {selectedProgram && (
            <div className="mt-8 lg:w-[440px]">
              <div>
                <div className="flex flex-row justify-between">
                  <h3 className="text-xl font-bold text-[#213458]">Program: {selectedProgram.name}</h3>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddCourse(selectedProgram.id);
                    }}
                    className="bg-[#213458] text-white py-2 px-4 rounded-md shadow-md hover:bg-[#1c2b47] transition-all"
                  >
                    New course
                  </button>
                </div>
              </div>

              <table className="table-auto w-[440px] mt-4 border-b-black">
                <thead>
                  <tr className="border text-center">
                    <th className="border border-black px-2 py-2">Course Name</th>
                    <th className="border border-black px-2 py-2">Action</th>
                  </tr>
                </thead>
                <tbody className="justify-center items-center text-center">
                  {selectedProgram?.course_list?.length ? (
                    selectedProgram.course_list.map((course, index) => (
                      <tr key={index} className="border text-center">
                        <td className="border border-black px-2 py-2">{course}</td>
                        <td className="border border-black px-2 py-2">
                          <div className="flex space-x-3">
                            <button
                              onClick={() => handleEditCourse(course)}
                              className="hover:scale-110 transition-transform transform hover:bg-gray-200 p-1 rounded-full"
                            >
                              <Image
                                src="/edit.svg"
                                alt="Edit"
                                width={25}
                                height={25}
                                className="w-[25px] h-[25px]"
                              />
                            </button>
                            <button
                              onClick={() => handleCourseDeleteClick(course)}
                              className="hover:scale-110 transition-transform transform hover:bg-gray-200 p-1 rounded-full"
                            >
                              <Image
                                src="/delete.svg"
                                alt="Delete"
                                width={25}
                                height={25}
                                className="w-[25px] h-[25px]"
                              />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={2} className="text-center p-4">
                        No courses available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
              <button
                onClick={() => setSelectedProgram(null)}
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
          onConfirm={courseToDelete ? handleDeleteCourse : handleDeleteProgram}
          message={`Are you sure you want to delete ${
            courseToDelete ? ` "${courseToDelete}"` : `"${programToDelete?.name}"`
          }?`}
        />
      )}
    </div>
  );
};

export default Page;
