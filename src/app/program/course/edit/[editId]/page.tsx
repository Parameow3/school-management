"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter, usePathname } from "next/navigation";

interface School {
  id: number;
  name: string;
}

const Page = () => {
  const router = useRouter();
  const pathname = usePathname();
  
  // Extract courseId from the URL path
  const courseId = pathname.split("/").pop(); // This will get the last segment of the URL, i.e., the course ID

  const [schools, setSchools] = useState<School[]>([]);
  const [selectedSchool, setSelectedSchool] = useState<number | null>(null);
  const [courseName, setCourseName] = useState<string>("");
  const [courseCode, setCourseCode] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [credits, setCredits] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [programName, setProgramName] = useState<string>("Loading...");

  // Fetch token from localStorage
  useEffect(() => {
    const tokenFromLocalStorage = localStorage.getItem("authToken");
    if (tokenFromLocalStorage) {
      setToken(tokenFromLocalStorage);
    } else {
      router.push("/login");
    }
  }, [router]);

  // Fetch the course details, program name, and available schools
  useEffect(() => {
    const fetchData = async () => {
      if (!token || !courseId) return;

      try {
        setLoading(true);
        console.log("Fetching course details...");

        // Fetch the course details
        const courseResponse = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/academics/course/${courseId}/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const courseData = courseResponse.data;
        console.log("Course data fetched:", courseData);

        if (!courseData) {
          throw new Error("Course data not found.");
        }

        setCourseName(courseData.name || "");
        setCourseCode(courseData.code || "");
        setDescription(courseData.description || "");
        setCredits(courseData.credits || null);
        setSelectedSchool(courseData.school || null);

        // Check if program ID is available, then fetch program name
        const programId = courseData.program;
        if (programId) {
          const programResponse = await axios.get(
            `${process.env.NEXT_PUBLIC_BASE_URL}/api/academics/program/${programId}/`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          setProgramName(programResponse.data.name || ""); // Set the actual program name
        } else {
          setProgramName("Program not found");
        }

        // Fetch schools
        console.log("Fetching schools...");
        const schoolsResponse = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/schools/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setSchools(schoolsResponse.data.results || []);
        console.log("Schools data fetched:", schoolsResponse.data.results);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to fetch course details or schools.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token, courseId]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!selectedSchool || !courseName || !courseCode || !credits) {
      setError("All fields are required.");
      return;
    }

    try {
      setError(null);
      console.log("Updating course...");

      // Update course API call
      await axios.put(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/academics/course/${courseId}/`,
        {
          name: courseName,
          code: courseCode,
          description,
          credits,
          school: selectedSchool,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Redirect after successful course update
      router.push("/program/all-program");
    } catch (err) {
      console.error("Failed to update course:", err);
      setError("Failed to update course.");
    }
  };

  return (
    <div className="lg:ml-[16%] ml-[11%] mt-20 flex flex-col">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-md shadow-md w-full max-w-lg mx-auto">
        <h1 className="text-2xl font-bold mb-6">Update Course</h1>

        {/* Display Program Name */}
        <div className="mb-4">
          <label className="block font-medium">Program</label>
          <p className="border border-gray-300 rounded-md w-full px-3 py-2 bg-gray-100">
            {loading ? "Loading..." : programName}
          </p>
        </div>

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

        {/* Error message */}
        {error && <p className="text-red-500 mb-4">{error}</p>}

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

        {/* Back and Submit Buttons */}
        <div className="flex justify-between mt-4">
          <button
            type="button"
            onClick={() => router.back()} // Use router.back() to navigate back
            className="bg-gray-300 text-gray-700 py-2 px-4 rounded-md shadow-md hover:bg-gray-400 transition-all"
          >
            Back
          </button>
          <button
            type="submit"
            className="bg-[#213458] text-white py-2 px-4 rounded-md shadow-md hover:bg-[#1c2b47] transition-all"
          >
            Update Course
          </button>
        </div>
      </form>
    </div>
  );
};

export default Page;
