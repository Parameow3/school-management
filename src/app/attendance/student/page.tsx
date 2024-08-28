"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu } from "@headlessui/react";
import { ChevronUpIcon, ChevronDownIcon } from "@heroicons/react/24/solid";

const Page = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState("Programs");
  const [selectedStatus, setSelectedStatus] = useState("P"); // State for selected circle

  const handleProgramSelect = (program: React.SetStateAction<string>) => {
    setSelectedProgram(program);
    setIsOpen(false); // Close the dropdown after selection
  };

  const handleStatusSelect = (status: React.SetStateAction<string>) => {
    setSelectedStatus(status); // Set the selected status
  };

  return (
    <div className="lg:ml-[219px] mt-20 flex flex-col">
      <div className="lg:w-[1068px] w-[330px] h-[42px] p-4 bg-white rounded-md flex items-center justify-between">
        <span className="flex flex-row lg:gap-3 gap-2 text-[12px] lg:text-[16px]">
          Attendance |
          <Image src={"/home.svg"} width={15} height={15} alt="public" />
          Student-Attendance
        </span>
        <Link href={"/#"} passHref>
          <div className="h-[23px] w-[57px] bg-[#1c2b47] flex items-center justify-center rounded-md">
            <Image src={"/refresh.svg"} width={16} height={16} alt="Refresh" />
          </div>
        </Link>
      </div>
      <div className="relative mt-2">
        <Menu as="div" className="relative inline-block text-left">
          <div>
            <Menu.Button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex justify-between items-center lg:w-[272px] w-[329px] h-[40px] px-4 py-2 bg-[#FFFFFF] text-[#213458] text-sm font-medium rounded-md focus:outline-none"
            >
              {selectedProgram}
              {isOpen ? (
                <ChevronUpIcon className="ml-2 h-5 w-5" aria-hidden="true" />
              ) : (
                <ChevronDownIcon className="ml-2 h-5 w-5" aria-hidden="true" />
              )}
            </Menu.Button>
          </div>

          <Menu.Items className="absolute z-50 lg:w-56 origin-top-right rounded-md mt-2 bg-[#FFFFFF] shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
            <div className="py-1">
              <Menu.Item>
                {({ active }) => (
                  <a
                    href="#Robotic"
                    onClick={() => handleProgramSelect("Robotic")}
                    className={`${
                      active ? "bg-gray-100" : ""
                    } block px-4 py-2 text-sm text-gray-700`}
                  >
                    Robotic
                  </a>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <a
                    href="#Takwando"
                    onClick={() => handleProgramSelect("Takwando")}
                    className={`${
                      active ? "bg-gray-100" : ""
                    } block px-4 py-2 text-sm text-gray-700`}
                  >
                    Takwando
                  </a>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <a
                    href="#Ballet"
                    onClick={() => handleProgramSelect("Ballet")}
                    className={`${
                      active ? "bg-gray-100" : ""
                    } block px-4 py-2 text-sm text-gray-700`}
                  >
                    Ballet
                  </a>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <a
                    href="#SAMBAR"
                    onClick={() => handleProgramSelect("SAMBAR")}
                    className={`${
                      active ? "bg-gray-100" : ""
                    } block px-4 py-2 text-sm text-gray-700`}
                  >
                    SAMBAR
                  </a>
                )}
              </Menu.Item>
            </div>
          </Menu.Items>
        </Menu>
      </div>
      <div className="overflow-x-auto mt-4">
        <table className="min-w-full bg-white border border-gray-200">
          <thead className="bg-[#213458] text-white">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Photo
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Student Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            <tr className="bg-gray-100 border-b border-gray-200">
              <td className="px-6 py-4 whitespace-nowrap">01</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10">
                    <Image
                      className="h-10 w-10 rounded-full"
                      src="/your-photo-url-here.jpg" // Replace with your photo URL
                      alt="Teacher Photo"
                      width={40}
                      height={40}
                    />
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">Lyseth</td>
              <td className="px-6 py-4 whitespace-nowrap">8/09/2024</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleStatusSelect("P")}
                    className={`flex items-center justify-center w-8 h-8 rounded-full font-bold ${
                      selectedStatus === "P"
                        ? "bg-[#213458] text-white"
                        : "border border-black text-gray-800"
                    }`}
                  >
                    P
                  </button>
                  <button
                    onClick={() => handleStatusSelect("L")}
                    className={`flex items-center justify-center w-8 h-8 rounded-full font-bold ${
                      selectedStatus === "L"
                        ? "bg-[#213458] text-white"
                        : "border border-black text-gray-800"
                    }`}
                  >
                    L
                  </button>
                  <button
                    onClick={() => handleStatusSelect("A")}
                    className={`flex items-center justify-center w-8 h-8 rounded-full font-bold ${
                      selectedStatus === "A"
                        ? "bg-[#213458] text-white"
                        : "border border-black text-gray-800"
                    }`}
                  >
                    A
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        <button
          type="submit"
          className="w-28 py-2 justify-center mt-3 ml-[398px] bg-orange-600 text-white font-semibold rounded-md shadow-sm hover:bg-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
        >
          Submit
        </button>
      </div>
      <div>
        <div className="overflow-x-auto mt-4">
          <table className="min-w-full bg-white border border-gray-200">
            <thead className="bg-[#213458] text-white">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Photo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Student Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="bg-gray-100 border-b border-gray-200">
                <td className="px-6 py-4 whitespace-nowrap">01</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <Image
                        className="h-10 w-10 rounded-full"
                        src="/your-photo-url-here.jpg" // Replace with your photo URL
                        alt="Teacher Photo"
                        width={40}
                        height={40}
                      />
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">Lyseth</td>
                <td className="px-6 py-4 whitespace-nowrap">8/09/2024</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex space-x-2">p</div>
                </td>
              </tr>
              <tr className="bg-gray-100 border-b border-gray-200">
                <td className="px-6 py-4 whitespace-nowrap">01</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <Image
                        className="h-10 w-10 rounded-full"
                        src="/your-photo-url-here.jpg" // Replace with your photo URL
                        alt="Teacher Photo"
                        width={40}
                        height={40}
                      />
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">Lyseth</td>
                <td className="px-6 py-4 whitespace-nowrap">8/09/2024</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex space-x-2">p</div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Page;
