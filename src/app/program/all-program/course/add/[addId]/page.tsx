"use client";
import React, { useState, useEffect } from "react";
import axios from "axios"; // Import Axios for API calls
import { useRouter } from "next/navigation";
import ProgramDropdown from "@/components/programDropdown";
interface Program {
  id: number;
  name: string;
}

interface School {
  id: number;
  name: string;
}

const Page = () => {
  const router = useRouter();
  const [programs, setPrograms] = useState<Program[]>([]);
  const [schools, setSchools] = useState<School[]>([]);
  const [selectedProgram, setSelectedProgram] = useState<string | null>(null);
  const [selectedSchool, setSelectedSchool] = useState<string | null>(null);
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

  // Fetch programs and schools on component mount
  useEffect(() => {
    const fetchData = async () => {
      if (!token) return;

      try {
        setLoading(true);
        const schoolsResponse = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/schools`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setSchools(schoolsResponse.data.results || []);

      } catch (err) {
        setError("Failed to fetch programs or schools.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  const handleProgramChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedProgram(event.target.value);
  };

  const handleSchoolChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSchool(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    // Add your course creation logic here
  };

  return (
    <div className="lg:ml-[16%] ml-[11%] mt-20 flex flex-col">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-md shadow-md w-full max-w-lg mx-auto">
        <h1 className="text-2xl font-bold mb-6">Create Course</h1>

        {/* Course name input */}
        <label htmlFor="courseName" className="block mb-2 font-medium">
          Course Name
        </label>
        <input
          type="text"
          id="courseName"
          name="courseName"
          className="border border-gray-300 rounded-md w-full px-3 py-2 mb-4"
          placeholder="Enter course name"
        />

        {/* Course code input */}
        <label htmlFor="courseCode" className="block mb-2 font-medium">
          Course Code
        </label>
        <input
          type="text"
          id="courseCode"
          name="courseCode"
          className="border border-gray-300 rounded-md w-full px-3 py-2 mb-4"
          placeholder="Enter course code"
        />

        {/* Course description */}
        <label htmlFor="description" className="block mb-2 font-medium">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          className="border border-gray-300 rounded-md w-full px-3 py-2 mb-4"
          placeholder="Enter course description"
        />

        {/* Course credits */}
        <label htmlFor="credits" className="block mb-2 font-medium">
          Credits
        </label>
        <input
          type="number"
          id="credits"
          name="credits"
          className="border border-gray-300 rounded-md w-full px-3 py-2 mb-4"
          placeholder="Enter number of credits"
        />

        {/* Program selection */}
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <label htmlFor="program" className="block mb-2 font-medium">
          Select Program
        </label>
        <ProgramDropdown onSelect={function (selectedPrograms: number[]): void {
          throw new Error("Function not implemented.");
        } }></ProgramDropdown>

        {/* School selection */}
        <label htmlFor="school" className="block mb-2 font-medium">
          Select School
        </label>
        <select
          id="school"
          name="school"
          value={selectedSchool || ""}
          onChange={handleSchoolChange}
          className="border border-gray-300 rounded-md w-full px-3 py-2 mb-4"
        >
          <option value="" disabled>
            {loading ? "Loading schools..." : "Select a school"}
          </option>
          {schools.length > 0 ? (
            schools.map((school) => (
              <option key={school.id} value={school.id}>
                {school.name}
              </option>
            ))
          ) : (
            <option value="" disabled>
              No schools available
            </option>
          )}
        </select>

        <button
          type="submit"
          className="bg-[#213458] text-white py-2 px-4 rounded-md shadow-md hover:bg-[#1c2b47] transition-all w-full"
        >
          Create Course
        </button>
      </form>
    </div>
  );
};

export default Page;
