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
    admissionDate: "",
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
    <div className=" lg:ml-[219px] mt-20 flex flex-col">
      <div className="lg:w-[1079px] w-[330px] h-[40px] p-4 bg-white flex items-center rounded-md justify-between">
        <span className="flex flex-row gap-2 text-[12px] lg:text-[15px]">
          Class |{" "}
          <Image src={"/home.svg"} width={15} height={15} alt="public" />{" "}
          New-class
        </span>

        <Link href={"/#"} passHref>
          <div className="h-[23px] w-[57px] bg-[#213458] flex items-center justify-center rounded-md">
            <Image src={"/refresh.svg"} width={16} height={16} alt="Refresh" />
          </div>
        </Link>
      </div>

      <h1 className="text-center text-2xl font-bold mb-8 mt-4 border-b-2">
        Class Form
      </h1>
      <div className="">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col items-center space-y-4"
        >
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Class Name
              </label>
              <input
                type="text"
                name="className"
                value={formData.className}
                onChange={handleChange}
                className="mt-1 block lg:w-[272px] w-[329px] h-[40px] outline-none p-2 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
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
                className="mt-1 block lg:w-[272px] w-[329px] h-[40px] outline-none p-2 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Teacher Name
              </label>
              <input
                type="text"
                name="teacherName"
                value={formData.teacherName}
                onChange={handleChange}
                className="mt-1 block lg:w-[272px] w-[329px] h-[40px] outline-none p-2 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block mt-1 text-sm font-medium text-gray-700">
                Branch
              </label>
              <Dropdown></Dropdown>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Student Name
              </label>
              <input
                type="text"
                name="studentName"
                value={formData.studentName}
                onChange={handleChange}
                className="mt-1 block lg:w-[272px] w-[329px] h-[40px] outline-none p-2 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Admission Date
              </label>
              <input
                type="date"
                name="admissionDate"
                value={formData.admissionDate}
                onChange={handleChange}
                className="mt-1 block lg:w-[272px] w-[329px] h-[40px] outline-none p-2 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
          </div>
          <Button bg="secondary">Create</Button>
        </form>
      </div>
    </div>
  );
};
export default ClassForm;
