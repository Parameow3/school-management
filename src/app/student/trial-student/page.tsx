'use client';
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Dropdown from "@/components/Dropdown";
type MyComponentProps = {
  selected: string;
  onChange: (branch: any) => void;
};
const Page:React.FC<MyComponentProps> = ({selected,onChange}) => {
  // State to manage form inputs
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    gender: "Female",
    branch: "",
    trialDate: "",
    contact: "",
    status: "Active", // Default status
  });

  // State to manage the list of students
  const [students, setStudents] = useState([
    // Initial mock data
    {
      firstName: "Lyson",
      lastName: "Lyson",
      gender: "Female",
      branch: "FM",
      trialDate: "12/04/2024",
      contact: "012233239",
      status: "Active",
    },
    {
      firstName: "Q2",
      lastName: "Lyseth",
      gender: "Female",
      branch: "PH",
      trialDate: "12/04/2024",
      contact: "012233239",
      status: "Active",
    },
  ]);

  // Handle input changes
  const handleChange = (e:any) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission
  const handleSubmit = (e:any) => {
    e.preventDefault();
    setStudents([...students, formData]);
    // Reset form after submission
    setFormData({
      firstName: "",
      lastName: "",
      gender: "Female",
      branch: "",
      trialDate: "",
      contact: "",
      status: "Active",
    });
  };

  return (
    <div className="ml-[219px] mt-20 flex flex-col">
      <div className="w-[1060px] h-[40px] p-4 bg-white flex items-center rounded-md justify-between">
        <span className="flex flex-row gap-2">
          Student |{" "}
          <Image src={"/home.svg"} width={15} height={15} alt="public" /> - New
          student
        </span>

        <Link href={"/#"} passHref>
          <div className="h-[23px] w-[57px] bg-[#213458] flex items-center justify-center rounded-md">
            <Image
              src={"/refresh.svg"}
              width={16}
              height={16}
              alt="Refresh"
            />
          </div>
        </Link>
      </div>
      <h1 className="text-center text-2xl font-bold mb-8 mt-4 text-[#123458] border-b-2">
        Trial Form
      </h1>
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Student Information */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Student Information</h2>
          <div className="grid grid-cols-3 gap-8">
            <div>
              <label
                htmlFor="firstName"
                className="block text-sm font-medium text-gray-700"
              >
                First Name:
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="mt-1 block w-[272px] h-[40px] rounded-md outline-none border-gray-300 shadow-sm"
                required
              />
            </div>

            <div>
              <label
                htmlFor="lastName"
                className="block text-sm font-medium text-gray-700"
              >
                Last Name:
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="mt-1 block w-[272px] h-[40px] rounded-md outline-none border-gray-300 shadow-sm"
                required
              />
            </div>
            <div>
              <label
                htmlFor="gender"
                className="block text-sm font-medium text-gray-700"
              >
                Gender:
              </label>
              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="mt-1 block w-[272px] h-[40px] rounded-md outline-none border-gray-300 shadow-sm"
              >
                <option>Female</option>
                <option>Male</option>
                <option>Other</option>
              </select>
            </div>
            <div>
              <label
                htmlFor="branch"
                className="block text-sm font-medium text-gray-700"
              >
                Branch:
              </label>
              <Dropdown
              />
            </div>

            <div>
              <label
                htmlFor="trialDate"
                className="block text-sm font-medium text-gray-700"
              >
                Trial Date:
              </label>
              <input
                type="date"
                id="trialDate"
                name="trialDate"
                value={formData.trialDate}
                onChange={handleChange}
                className="mt-1 block w-[272px] h-[40px] rounded-md outline-none border-gray-300 shadow-sm"
                required
              />
            </div>
            <div>
              <label
                htmlFor="contact"
                className="block text-sm font-medium text-gray-700"
              >
                Contact:
              </label>
              <input
                type="text"
                id="contact"
                name="contact"
                value={formData.contact}
                onChange={handleChange}
                className="mt-1 block w-[272px] h-[40px] rounded-md outline-none border-gray-300 shadow-sm"
                required
              />
            </div>
          </div>
        </section>

        {/* Table Section */}
        <section className="mt-12">
          <h2 className="text-xl font-semibold mb-4">Trial Students</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-[#123458]">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider"
                  >
                    First Name
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider"
                  >
                    Last Name
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider"
                  >
                    Gender
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider"
                  >
                    Branch
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider"
                  >
                    Trial Date
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider"
                  >
                    Contact
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider"
                  >
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {students.map((student, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {student.firstName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {student.lastName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {student.gender}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {student.branch}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {student.trialDate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {student.contact}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {student.status}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Form Actions */}
        <div className="flex justify-center items-center space-x-4">
          <button
            type="button"
            className="inline-flex justify-center rounded-md border border-transparent bg-[#CF510E] py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="inline-flex justify-center gap-1 rounded-md border border-transparent bg-[#123458] py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default Page;
