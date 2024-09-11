"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Dropdown from "@/components/Dropdown";
import Button from "@/components/Button";
const ClassForm = () => {
  const [formData, setFormData] = useState({
    className: "",
    section: "",
    teacherName: "",
    branch: "",
    studentName: "",
    credit: "",
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
    console.log("Form Data:", formData);
  };
  return (
<div className="lg:ml-[16%] mt-20 ml-[11%] flex flex-col">
  <div className="lg:w-[1079px] w-[330px] h-[40px] p-4 bg-white flex items-center rounded-md justify-between">
    <span className="flex flex-row gap-2 text-[12px] lg:text-[15px]">
      Class | <Image src={"/home.svg"} width={15} height={15} alt="public" /> New-class
    </span>

    <Link href={"/#"} passHref>
      <div className="h-[23px] w-[57px] bg-[#213458] flex items-center justify-center rounded-md">
        <Image src={"/refresh.svg"} width={16} height={16} alt="Refresh" />
      </div>
    </Link>
  </div>
  
  <h1 className="text-center lg:text-2xl text-lg font-bold mb-8 mt-4 border-b-2">Class Form</h1>
  
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
        
        {/* Section */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Section</label>
          <input
            type="text"
            name="section"
            value={formData.section}
            onChange={handleChange}
            className="mt-1 block w-full h-[40px] outline-none p-2 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-slate-700 sm:text-sm"
          />
        </div>
        
        {/* Teacher Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Teacher Name</label>
          <input
            type="text"
            name="teacherName"
            value={formData.teacherName}
            onChange={handleChange}
            className="mt-1 block w-full h-[40px] outline-none p-2 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        {/* Branch */}
        <div>
          <label className="block mt-1 text-sm font-medium text-gray-700">Branch</label>
          <Dropdown></Dropdown>
        </div>
        
        {/* Student Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Student Name</label>
          <input
            type="text"
            name="studentName"
            value={formData.studentName}
            onChange={handleChange}
            className="mt-1 block w-full h-[40px] outline-none p-2 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-slate-700 sm:text-sm"
          />
        </div>

        {/* Credit */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Credit</label>
          <select
            name="admissionDate"
            value={formData.credit}
            onChange={handleChange}
            className="mt-1 block w-full h-[40px] outline-none p-2 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-slate-700 sm:text-sm"
          >
            <option value="">Select a credit</option>
            <option value="1">Credit 1</option>
            <option value="2">Credit 2</option>
            <option value="3">Credit 3</option>
            <option value="4">Credit 4</option>
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
