"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import Button from "@/components/Button";
import axios from "axios"; // Import Axios for HTTP requests

const ClassForm = () => {
  const [formData, setFormData] = useState({
    className: "",
    program: "", // Store the program ID here
    teacher: "", // Store the teacher ID here
    studentName: "",
    credit: "",
    start_date: "",
    end_date: "",
  });

  const [teachers, setTeachers] = useState([]); 
  const [programs, setPrograms] = useState([]); 
  const [loadingTeachers, setLoadingTeachers] = useState(true); 
  const [loadingPrograms, setLoadingPrograms] = useState(true); 
  const [error, setError] = useState(null); 
  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/teacher`);
        setTeachers(response.data.results);
        setLoadingTeachers(false);
      } catch (err:any) {
        setError(err);
        setLoadingTeachers(false);
      }
    };

    fetchTeachers();
  }, []);

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/academics/course`);
        setPrograms(response.data.results); 
        setLoadingPrograms(false);
      } catch (err:any) {
        setError(err);
        setLoadingPrograms(false);
      }
    };

    fetchPrograms();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle form submission and post the data to the backend
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

  return (
    <div className="lg:ml-[16%] mt-20 ml-[11%] flex flex-col">
      <div className="lg:w-[1079px] w-[330px] h-[40px] p-4 bg-white flex items-center rounded-md justify-between">
        <span className="flex flex-row gap-2 text-[12px] lg:text-[15px]">
          Class | <Image src={"/home.svg"} width={15} height={15} alt="public" /> Update-class
        </span>

        <Link href={"/#"} passHref>
          <div className="h-[23px] w-[57px] bg-[#213458] flex items-center justify-center rounded-md">
            <Image src={"/refresh.svg"} width={16} height={16} alt="Refresh" />
          </div>
        </Link>
      </div>

      <h1 className="text-center lg:text-2xl text-lg font-bold mb-8 mt-4 border-b-2">
        Update Form
      </h1>

      <div className="">
        <form onSubmit={handleSubmit} className="flex flex-col items-center space-y-4">
          {/* Responsive grid - 1 column on mobile and 3 columns on large screens */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 w-full">

            {/* Class Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Class Name</label>
              <input
                type="text"
                name="className"
                value={formData.className}
                onChange={handleChange}
                className="mt-1 block w-full h-[40px] outline-none p-2 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-slate-700 sm:text-sm"
              />
            </div>

            {/* Program Dropdown */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Program</label>
              {loadingPrograms ? (
                <p>Loading programs...</p>
              ) : error ? (
                <p>Error loading programs</p>
              ) : (
                <select
                  name="program"
                  value={formData.program}
                  onChange={handleChange}
                  className="mt-1 block w-full h-[40px] outline-none p-2 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                >
                  <option value="">Select a Program</option>
                  {programs.map((program: any) => (
                    <option key={program.id} value={program.id}>
                      {program.name} {/* Adjusted to access program name */}
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Teacher Dropdown */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Teacher</label>
              {loadingTeachers ? (
                <p>Loading teachers...</p>
              ) : error ? (
                <p>Error loading teachers</p>
              ) : (
                <select
                  name="teacher"
                  value={formData.teacher}
                  onChange={handleChange}
                  className="mt-1 block w-full h-[40px] outline-none p-2 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                >
                  <option value="">Select a Teacher</option>
                  {teachers.map((teacher: any) => (
                    <option key={teacher.id} value={teacher.id}>
                      {teacher.user.username} {/* Adjusted to access username */}
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Start Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Start Date</label>
              <input
                type="date"
                name="start_date"
                value={formData.start_date}
                onChange={handleChange}
                className="mt-1 block w-full h-[40px] outline-none p-2 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-slate-700 sm:text-sm"
              />
            </div>

            {/* End Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700">End Date</label>
              <input
                type="date"
                name="end_date"
                value={formData.end_date}
                onChange={handleChange}
                className="mt-1 block w-full h-[40px] outline-none p-2 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-slate-700 sm:text-sm"
              />
            </div>

            {/* Credit */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Credit</label>
              <select
                name="credit"
                value={formData.credit}
                onChange={handleChange}
                className="mt-1 block w-full h-[40px] outline-none p-2 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-slate-700 sm:text-sm"
              >
                <option value="">Select a credit</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
              </select>
            </div>
          </div>

          {/* Submit Button */}
          <Button bg="secondary">Create</Button>
        </form>
      </div>
    </div>
  );
};

export default ClassForm;
