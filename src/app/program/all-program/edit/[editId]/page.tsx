"use client";
import Button from "@/components/Button";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const Page = () => {
  const params = useParams();
  const id = params?.editId as string; 

  const [formData, setFormData] = useState({
    className: "",
    programName: "",
    session: "",
    section: "",
  });

  const classes = [
    {
      id: "1",
      className: "Level 2",   // Changed title to className for consistency
      programName: "Program 1", // Added programName for consistency
      session: "8",  // Changed to string for consistency with other fields
      section: "A",  // Added section for consistency
    },
    {
      id: "2",
      className: "Level 2",
      programName: "Program 2",
      session: "8",
      section: "B",
    },
    {
      id: "3",
      className: "Level 3",
      programName: "Program 3",
      session: "8",
      section: "C",
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
    <div className="flex justify-center items-center h-screen ml-16 mt-4 bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-[90%] lg:w-[442px]">
        <h2 className="text-center text-xl font-bold text-[#213458] mb-6">
          Edit Programs
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
              className="mt-1 block w-[352px] h-[40px] p-2 rounded-md border-black shadow-lg focus:ring-2 focus:ring-orange-500"
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

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Program's Name
            </label>
            <input
              type="text"
              name="programName"
              value={formData.programName}
              onChange={handleChange}
              className="mt-1 block w-[352px] h-[40px] p-2 rounded-md border-black shadow-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
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
              className="mt-1 block w-[352px] h-[40px] p-2 rounded-md border-black shadow-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
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
              className="mt-1 block w-[352px] h-[40px] p-2 rounded-md border-black shadow-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <Button>Create</Button>
        </form>
      </div>
    </div>
  );
};
export default Page;
