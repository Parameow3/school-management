"use client";
import Button from "@/components/Button";
import React, { useState } from "react";

const Page = () => {
  const [formData, setFormData] = useState({
    className: "",
    programName: "",
    session: "",
    section: "",
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form Data Submitted:", formData);
  };

  return (
<div className="flex justify-center items-center  lg:mt-8 min-h-screen bg-gray-100 py-8">
  <div className="bg-white p-8 rounded-lg lg:ml-[16%] ml-[5%]  shadow-lg w-full max-w-md">
    <h2 className="text-center text-2xl font-bold text-[#213458] mb-6">
      Create Programs
    </h2>

    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Choose Class Field */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Choose the class
        </label>
        <select
          name="className"
          value={formData.className}
          onChange={handleChange}
          className="block w-[316px] h-[44px] px-3 py-2 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        >
          <option value="" disabled>
            Select a class
          </option>
          <option value="Class 1">Class 1</option>
          <option value="Class 2">Class 2</option>
          <option value="Class 3">Class 3</option>
        </select>
      </div>

      {/* Program's Name Field */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Program's Name
        </label>
        <input
          type="text"
          name="programName"
          value={formData.programName}
          onChange={handleChange}
          className="block w-[316px] h-[44px] px-3 py-2 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          placeholder="Enter program name"
        />
      </div>

      {/* Session Field */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Session</label>
        <input
          type="text"
          name="session"
          value={formData.session}
          onChange={handleChange}
          className="block w-[316px] h-[44px] px-3 py-2 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          placeholder="Enter session"
        />
      </div>

      {/* Section Field */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Section</label>
        <input
          type="text"
          name="section"
          value={formData.section}
          onChange={handleChange}
          className="block w-[316px] h-[44px] px-3 py-2 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          placeholder="Enter section"
        />
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
