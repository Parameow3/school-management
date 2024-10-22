"use client";
import React, { useState, useEffect } from "react";
import axios from "axios"; // Import Axios for API calls
import { useRouter } from "next/navigation";

interface Program {
  id: number;
  name: string;
}

interface School {
  id: number;
  name: string;
}

const AddCoursePage = () => {
  const router = useRouter();
  const [programs, setPrograms] = useState<Program[]>([]);
  const [schools, setSchools] = useState<School[]>([]);
  const [selectedProgram, setSelectedProgram] = useState<number | null>(null);
  const [selectedSchool, setSelectedSchool] = useState<number | null>(null);
  const [courseName, setCourseName] = useState<string>("");
  const [courseCode, setCourseCode] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [credits, setCredits] = useState<number | null>(null);
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

        // Fetch programs
        const programsResponse = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/academics/program/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setPrograms(programsResponse.data.results || []);

        // Fetch schools
        const schoolsResponse = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/schools/`,
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
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!selectedProgram || !selectedSchool || !courseName || !courseCode || !credits) {
      setError("All fields are required.");
      return;
    }

    try {
      setError(null);

      // Create course API call
      await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/academics/course/`,
        {
          name: courseName,
          code: courseCode,
          description,
          credits,
          program: selectedProgram,
          school: selectedSchool,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Redirect after successful course creation
      router.push("/program/all-program");
    } catch (err) {
      setError("Failed to create course.");
    }
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
          value={courseName}
          onChange={(e) => setCourseName(e.target.value)}
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
          value={courseCode}
          onChange={(e) => setCourseCode(e.target.value)}
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
          value={description}
          onChange={(e) => setDescription(e.target.value)}
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
          value={credits || ""}
          onChange={(e) => setCredits(Number(e.target.value))}
        />

        {/* Program selection */}
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <label htmlFor="program" className="block mb-2 font-medium">
          Select Program
        </label>
        <select
          id="program"
          name="program"
          value={selectedProgram || ""}
          onChange={(e) => setSelectedProgram(Number(e.target.value))}
          className="border border-gray-300 rounded-md w-full px-3 py-2 mb-4"
        >
          <option value="" disabled>
            {loading ? "Loading programs..." : "Select a program"}
          </option>
          {programs.length > 0 ? (
            programs.map((program) => (
              <option key={program.id} value={program.id}>
                {program.name}
              </option>
            ))
          ) : (
            <option value="" disabled>
              No programs available
            </option>
          )}
        </select>

        {/* School selection */}
        <label htmlFor="school" className="block mb-2 font-medium">
          Select School
        </label>
        <select
          id="school"
          name="school"
          value={selectedSchool || ""}
          onChange={(e) => setSelectedSchool(Number(e.target.value))}
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

export default AddCoursePage;
