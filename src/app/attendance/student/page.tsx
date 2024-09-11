"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Button from "@/components/Button";

const Page = () => {
  const [selectedStatus, setSelectedStatus] = useState("P");
  const [showTable, setShowTable] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  const handleStatusSelect = (status: React.SetStateAction<string>) => {
    setSelectedStatus(status);
  };

  const handleSearchClick = () => {
    setShowTable(true);
  };

  const handleSubmitClick = () => {
    setShowHistory(true);
  };

  return (
    <div className="lg:ml-[16%] ml-[8%] mt-20 flex flex-col w-full">
      {/* Header */}
      <div className="w-full lg:w-[1068px] h-[42px] p-4 bg-white rounded-md flex items-center justify-between shadow-md">
        <span className="flex flex-row gap-2 text-[12px] lg:text-[16px]">
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
      <div className="flex items-center mt-4 gap-2 w-full">
        <input
          type="text"
          placeholder="Search Student"
          className="w-full lg:w-[300px] lg:h-[40px] h-[35px] p-2 rounded-l-[5px] border border-gray-300 focus:outline-none"
        />
        <Button onClick={handleSearchClick} className="lg:h-[40px] h-[35px] px-4 bg-[#213458] text-white font-medium rounded-r-[5px]"> Search</Button>
      </div>
      {showTable && (
        <div className="overflow-x-auto mt-4 w-full">
          <table className="min-w-full ml-2 bg-white border border-gray-200">
          <thead className="bg-[#213458] text-white">
              <tr>
                <th className="lg:px-2 lg:py-2 p-1 text-left text-[8px] lg:text-xs font-medium uppercase tracking-wider">
                  ID
                </th>
                <th className="lg:px-2 lg:py-2 p-1 text-left text-[8px] lg:text-xs font-medium uppercase tracking-wider">
                  Photo
                </th>
                <th className="lg:px-2 lg:py-2 p-1 text-left text-[8px] lg:text-xs font-medium uppercase tracking-wider">
                  Student Name
                </th>
                <th className="lg:px-2 lg:py-2 p-1 text-left text-[8px] lg:text-xs font-medium uppercase tracking-wider">
                  Date
                </th>
                <th className="lg:lg:px-2 lg:py-2 p-1 text-left text-[8px] lg:text-xs font-medium uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="bg-gray-100 border-b border-gray-200">
                <td className="lg:px-2 lg:py-3 p-1">01</td>
                <td className="px-2 py-3">
                  <div className="flex items-center">
                    <div className="h-10 w-10">
                      <Image
                        className="rounded-full lg:w-[40px] lg:h-[40px] w-[30px] h-[30px]"
                        src="/photo.jpg"
                        alt="Student Photo"
                        width={40}
                        height={40}
                      />
                    </div>
                  </div>
                </td>
                <td className="lg:px-2 lg:py-3 p-1">Lyseth</td>
                <td className="lg:px-2 lg:py-3 p-1">8/09/2024</td>
                <td className="lg:px-2 lg:py-3 p-1">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleStatusSelect("P")}
                      className={`lg:w-8 lg:h-8 w-4 h-4 rounded-full font-bold ${
                        selectedStatus === "P"
                          ? "bg-[#213458] text-white lg:text-[8px] text-[5px]"
                          : "border border-black text-gray-800 lg:text-[8px] text-[5px]"
                      }`}
                    >
                      P
                    </button>
                    <button
                      onClick={() => handleStatusSelect("L")}
                      className={`lg:w-8 lg:h-8 w-4 h-4 rounded-full font-bold ${
                        selectedStatus === "L"
                          ? "bg-[#213458] text-white lg:text-[8px] text-[5px]"
                          : "border border-black text-gray-800 lg:text-[8px] text-[5px]"
                      }`}
                    >
                      L
                    </button>
                    <button
                      onClick={() => handleStatusSelect("A")}
                      className={`lg:w-8 lg:h-8 w-4 h-4 rounded-full font-bold ${
                        selectedStatus === "A"
                          ? "bg-[#213458] text-white lg:text-[8px] text-[5px]"
                          : "border border-black text-gray-800 lg:text-[8px] text-[5px]"
                      }`}
                    >
                      A
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
          <div className="flex justify-center mt-3">
            <button
              onClick={handleSubmitClick}
              className="lg:w-28 w-28 py-2 bg-orange-600 text-white font-semibold rounded-md shadow-sm hover:bg-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              Submit
            </button>
          </div>
        </div>
      )}
      {showHistory && (
        <div className="overflow-x-auto mt-4">
          <table className="min-w-full bg-white border border-gray-200">
            <thead className="bg-[#213458] text-white">
              <tr>
                <th className="lg:px-2 lg:py-2 p-1 text-left text-[8px] lg:text-xs font-medium uppercase tracking-wider">
                  ID
                </th>
                <th className="lg:px-2 lg:py-2 p-1 text-left text-[8px] lg:text-xs font-medium uppercase tracking-wider">
                  Photo
                </th>
                <th className="lg:px-2 lg:py-2 p-1 text-left text-[8px] lg:text-xs font-medium uppercase tracking-wider">
                  Student Name
                </th>
                <th className="lg:px-2 lg:py-2 p-1 text-left text-[8px] lg:text-xs font-medium uppercase tracking-wider">
                  Date
                </th>
                <th className="lg:lg:px-2 lg:py-2 p-1 text-left text-[8px] lg:text-xs font-medium uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="bg-gray-100 border-b border-gray-200">
                <td className="px-2 py-3">01</td>
                <td className="px-2 py-3">
                  <div className="flex items-center">
                    <div className="h-10 w-10">
                      <Image
                        className="rounded-full lg:w-[40px] lg:h-[40px] w-[30px] h-[30px]"
                        src="/photo.jpg"
                        alt="Student Photo"
                        width={40}
                        height={40}
                      />
                    </div>
                  </div>
                </td>
                <td className="px-2 py-3 ">Lyseth</td>
                <td className="px-2 py-3">8/09/2024</td>
                <td className="px-2 py-3">
                  <div className="flex space-x-2">P</div>
                </td>
              </tr>
              <tr className="bg-gray-100 border-b border-gray-200">
                <td className="px-2 py-3">02</td>
                <td className="px-2 py-3">
                  <div className="flex items-center">
                    <div className="h-10 w-10">
                      <Image
                        className="rounded-full lg:w-[40px] lg:h-[40px] w-[30px] h-[30px]"
                        src="/photo.jpg"
                        alt="Student Photo"
                        width={40}
                        height={40}
                      />
                    </div>
                  </div>
                </td>
                <td className="px-2 py-3">Lyseth</td>
                <td className="px-2 py-3">8/09/2024</td>
                <td className="px-2 py-3">
                  <div className="flex space-x-2">P</div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Page;
