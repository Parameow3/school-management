'use client';
import Button from "@/components/Button";
import React, { useState } from "react";
import axios from "axios"; // To make API requests

const Page = () => {
  const [formData, setFormData] = useState({
    name: "", // This matches "name" in the backend
    description: "", // This matches "description" in the backend
    school: 1, // Default value of 1, assuming the school is always 1
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/academics/program/', formData);
      console.log("Form Data Submitted:", response.data);
      alert("Create Program Succesful")
    } catch (error) {
      console.error("Error submitting the form:", error);
      alert("Create Program Fail")
    }
  };
  return (
    <div className="flex justify-center items-center  lg:mt-8 min-h-screen bg-gray-100 py-8">
      <div className="bg-white p-8 rounded-lg lg:ml-[16%] ml-[5%]  shadow-lg w-full max-w-md">
        <h2 className="text-center text-2xl font-bold text-[#213458] mb-6">
          Create Program
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Program Name Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Program's Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="block w-[316px] h-[44px] px-3 py-2 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter program name"
            />
          </div>

          {/* Program Description Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Program's Description
            </label>
            <input
              type="text"
              name="description" 
              value={formData.description}
              onChange={handleChange}
              className="block w-[316px] h-[44px] px-3 py-2 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter program description"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              School
            </label>
            <select
              name="school"
              value={formData.school}
              onChange={handleChange}
              className="block w-[316px] h-[44px] px-3 py-2 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="1">School 1</option>
              {/* Add more options here if needed */}
            </select>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-[316px] h-[44px] bg-[#213458] hover:bg-[#213498] text-white font-bold rounded-lg shadow-md transition-colors"
          >
            Create
          </button>
        </form>
      </div>
    </div>
  );
};

export default Page;
