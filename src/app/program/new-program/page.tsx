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
    <div className="flex justify-center items-center h-screen ml-16 mt-4 bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-[90%] lg:w-[442px]">
        <h2 className="text-center text-xl font-bold text-[#213458] mb-6">
          Create Programs
        </h2>
        <form
          onSubmit={handleSubmit}
          className="space-y-4 justify-center items-center gap-2 flex flex-col "
        >
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Choose the class
            </label>
            <select
              name="className"
              value={formData.className}
              onChange={handleChange}
              className="mt-1 block w-[352px] h-[40px] p-2 rounded-md border-black shadow-lg focus:ring-2 focus:ring-slate-700"
            >
              <option value="" disabled>
                Select a class
              </option>
              <option value="Class 1">Class 1</option>
              <option value="Class 2">Class 2</option>
              <option value="Class 3">Class 3</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Program's Name
            </label>
            <input
              type="text"
              name="programName"
              value={formData.programName}
              onChange={handleChange}
              className="mt-1 block w-[352px] h-[40px] p-2 rounded-md border-black shadow-lg focus:outline-none focus:ring-2 focus:ring-slate-700"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Session
            </label>
            <input
              type="text"
              name="session"
              value={formData.session}
              onChange={handleChange}
              className="mt-1 block w-[352px] h-[40px] p-2 rounded-md border-black shadow-lg focus:outline-none focus:ring-2 focus:ring-slate-700"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Section
            </label>
            <input
              type="text"
              name="section"
              value={formData.section}
              onChange={handleChange}
              className="mt-1 block w-[352px] h-[40px] p-2 rounded-md border-black shadow-lg focus:outline-none focus:ring-2 focus:ring-slate-700"
            />
          </div>
          <Button>Create</Button>
        </form>
      </div>
    </div>
  );
};
export default Page;
