"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";

interface Program {
  id: number;
  name: string;
}

interface Teacher {
  id: number;
  name: string;
}

const Page = () => {
  const [isMounted, setIsMounted] = useState(false); // Track whether the component is mounted
  const [formData, setFormData] = useState({
    className: "",
    program: "",
    teacher: "",
    credit: "",
    start_date: "",
    end_date: "",
  });
  const [programs, setPrograms] = useState<Program[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  
  const [loadingTeachers, setLoadingTeachers] = useState(true);
  const [loadingPrograms, setLoadingPrograms] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // This ensures that the component only renders on the client-side after it's mounted
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Fetch teachers and programs after component is mounted
  useEffect(() => {
    if (isMounted) {
      const fetchTeachers = async () => {
        try {
          const response = await axios.get("http://127.0.0.1:8000/api/auth/teacher?page=1");
          setTeachers(response.data.results);
          setLoadingTeachers(false);
        } catch (err: any) {
          setError(err.message || "Error loading teachers");
          setLoadingTeachers(false);
        }
      };
      fetchTeachers();
    }
  }, [isMounted]);

  useEffect(() => {
    if (isMounted) {
      const fetchPrograms = async () => {
        try {
          const response = await axios.get("http://127.0.0.1:8000/api/academics/course/?page=1");
          setPrograms(response.data.results);
          setLoadingPrograms(false);
        } catch (err: any) {
          setError(err.message || "Error loading programs");
          setLoadingPrograms(false);
        }
      };
      fetchPrograms();
    }
  }, [isMounted]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const postData = {
      name: formData.className,
      courses: [parseInt(formData.program)],
      teacher: parseInt(formData.teacher),
      start_date: formData.start_date,
      end_date: formData.end_date,
    };

    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/api/academics/classroom/`, postData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log("Response:", response.data);
      alert("Classroom created successfully!");
    } catch (error: any) {
      console.error("Error submitting the form:", error);
      if (error.response && error.response.data) {
        alert(`Error: ${error.response.data.detail || "An error occurred."}`);
      } else {
        alert("Failed to submit the form.");
      }
    }
  };
  if (!isMounted) {
    return <div>Loading...</div>; 
  }

  return (
    <div className="lg:ml-[16%] ml-[11%] mt-20 flex flex-col">
      <div className="lg:w-[60%] w-[90%] mx-auto mt-10 p-6 bg-white rounded-lg shadow-md space-y-6">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">Class Form</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="flex flex-col">
            <label htmlFor="className" className="text-sm font-medium text-gray-700">Class Name</label>
            <input
              id="className"
              name="className"
              type="text"
              placeholder="Enter Class Name"
              className="w-full h-[40px] p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={handleChange}
            />
          </div>

          {/* Program Dropdown */}
          <div className="flex flex-col">
            <label htmlFor="program" className="text-sm font-medium text-gray-700">Program</label>
            {loadingPrograms ? (
              <span className="text-sm text-blue-500">Loading programs...</span>
            ) : error ? (
              <span className="text-sm text-red-500">Error loading programs</span>
            ) : (
              <select
                id="program"
                name="program"
                className="w-full h-[40px] p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={handleChange}
              >
                <option value="">Select a program</option>
                {programs.map((program) => (
                  <option key={program.id} value={program.id}>
                    {program.name}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Teacher Dropdown */}
          <div className="flex flex-col">
            <label htmlFor="teacher" className="text-sm font-medium text-gray-700">Teacher</label>
            {loadingTeachers ? (
              <span className="text-sm text-blue-500">Loading teachers...</span>
            ) : error ? (
              <span className="text-sm text-red-500">Error loading teachers</span>
            ) : (
              <select
                id="teacher"
                name="teacher"
                className="w-full h-[40px] p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={handleChange}
              >
                <option value="">Select a teacher</option>
                {teachers.map((teacher) => (
                  <option key={teacher.id} value={teacher.id}>
                    {teacher.name}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div className="flex flex-col">
            <label htmlFor="credit" className="text-sm font-medium text-gray-700">Credit</label>
            <select
              id="credit"
              name="credit"
              className="w-full h-[40px] p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={handleChange}
            >
              <option value="">Select a credit</option>
            </select>
          </div>

          <div className="flex flex-col">
            <label htmlFor="startDate" className="text-sm font-medium text-gray-700">Start Date</label>
            <input
              id="startDate"
              name="start_date"
              type="date"
              className="w-full h-[40px] p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={handleChange}
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="endDate" className="text-sm font-medium text-gray-700">End Date</label>
            <input
              id="endDate"
              name="end_date"
              type="date"
              className="w-full h-[40px] p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="flex justify-center mt-6">
          <button
            onClick={handleSubmit}
            className="px-8 py-3 bg-[#213458] text-white font-semibold rounded-md hover:bg-[#213498] transition duration-300"
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
};

export default Page;
