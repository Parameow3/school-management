"use client";
import Button from "@/components/Button";
import Typography from "@/components/Typography";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const Page = () => {
  const params = useParams();
  const id = params?.editId as string;

  const [formData, setFormData] = useState({
    className: "",
    programName: "",
    session: "",
    section:"",
    description: "",
  });

  const classes = [
    {
      id: "1",
      className: "Level 2", // Changed title to className for consistency
      programName: "Program 1", // Added programName for consistency
      session: "8",
      section: "11:30 - 13:00", // Changed to string for consistency with other fields
      description:"Lego", // Added section for consistency
    },
    {
      id: "2",
      className: "Level 2",
      programName: "Program 2",
      session: "8",
      section: "11:30 - 13:00",
      description: "B",
    },
    {
      id: "3",
      className: "Level 3",
      programName: "Program 3",
      session: "8",
      section: "11:30 - 13:00",
      description: "C",
    },
  ];
  useEffect(() => {
    const selectedClass = classes.find((item) => item.id === id);
    if (selectedClass) {
      setFormData(selectedClass);
    }
  }, [id, classes]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form Data Submitted:", formData);
  };

  return (
<div className="flex justify-center ml-[4%] lg:mt-14 items-center min-h-screen bg-gray-100 py-4">
  <div className="bg-white p-8 rounded-lg ml-[11%] lg:ml-0 shadow-lg w-full max-w-lg">
    <h2 className="text-center text-2xl font-bold text-[#213458] mb-6">
      Edit Programs
    </h2>
    <form onSubmit={handleSubmit} className="space-y-6 w-full">
      {/* Choose Class Field */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Choose the class
        </label>
        <select
          name="className"
          value={formData.className}
          onChange={handleChange}
          className="block w-full h-10 px-3 py-2 rounded-md border border-gray-300 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        >
          <option value="" disabled>
            Select a class
          </option>
          {classes.map((classItem) => (
            <option key={classItem.id} value={classItem.className}>
              {classItem.className}
            </option>
          ))}
        </select>
      </div>

      {/* Program's Name Field */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Program's Name
        </label>
        <input
          type="text"
          name="programName"
          value={formData.programName}
          onChange={handleChange}
          className="block w-full h-10 px-3 py-2 rounded-md border border-gray-300 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          placeholder="Enter the program name"
        />
      </div>

      {/* Session Field */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Session</label>
        <input
          type="text"
          name="session"
          value={formData.session}
          onChange={handleChange}
          className="block w-full h-10 px-3 py-2 rounded-md border border-gray-300 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          placeholder="Enter the session"
        />
      </div>

      {/* Section Field */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Section</label>
        <input
          type="text"
          name="Section"
          value={formData.section}
          onChange={handleChange}
          className="block w-full h-10 px-3 py-2 rounded-md border border-gray-300 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          placeholder="Enter the section"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <input
          type="text"
          name="Description"
          value={formData.description}
          onChange={handleChange}
          className="block w-full h-10 px-3 py-2 rounded-md border border-gray-300 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          placeholder="Enter the description"
        />
      </div>
      {/* Submit Button */}
      <button
        type="submit"
        className="w-full h-10 bg-[#213458] hover:bg-[#213498] text-white font-bold rounded-md shadow-md transition-colors"
      >
        Create
      </button>
    </form>
  </div>
</div>

  );
};
export default Page;
