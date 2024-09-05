"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Modal from "@/components/Modal";
import { useRouter } from "next/navigation";
import Dropdown from "@/components/Dropdown";

interface Program {
  id: string;
  title: string;
  time: string;
  sessions: number;
}

interface Session {
  id: string;
  title: string;
  time: string;
}

interface SessionData {
  [key: string]: Session[];
}

const sessionData: SessionData = {
  Level1: [
    { id: "1", title: "Session 1", time: "Lego, wedo2 , typing" },
    { id: "2", title: "Session 2", time: "11:00 - 12:00" },
  ],
  Level2: [
    { id: "3", title: "Session 1", time: "1:00 - 2:00" },
    { id: "4", title: "Session 2", time: "2:00 - 3:00" },
  ],
  Level3: [
    { id: "5", title: "Session 1", time: "2:00 - 3:00" },
    { id: "6", title: "Session 2", time: "3:00 - 4:00" },
  ],
  Level4: [
    { id: "7", title: "Session 1", time: "9:00 - 10:00" },
    { id: "8", title: "Session 2", time: "10:00 - 11:00" },
  ],
};

const Page = () => {
  const router = useRouter();
  const [selectedProgram, setSelectedProgram] = useState<keyof typeof sessionData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [programToDelete, setProgramToDelete] = useState<Program | null>(null);

  const programs: Program[] = [
    { id: "1", title: "Level1", time: "12:30 - 2:00", sessions: 6 },
    { id: "2", title: "Level2", time: "10:00 - 11:30", sessions: 8 },
    { id: "3", title: "Level3", time: "2:00 - 4:00", sessions: 6 },
    { id: "4", title: "Level4", time: "9:00 - 10:30", sessions: 10 },
  ];

  const handleCardClick = (programName: keyof typeof sessionData) => {
    setSelectedProgram(programName);
  };

  const handleDeleteClick = (program: Program) => {
    setProgramToDelete(program);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setProgramToDelete(null);
  };

  const handleEditClick = (id: string) => {
    router.push(`/program/all-program/edit/${id}`);
  };

  const handleShowAllPrograms = () => {
    setSelectedProgram(null);
  };

  return (
    <div className="lg:ml-[16%] ml-[45px] mt-20 flex flex-col">
      <div className="lg:w-[1068px] w-[330px] h-[42px] p-2 bg-white rounded-md flex items-center justify-between">
        <span className="flex flex-row lg:gap-3 gap-2 text-[12px] lg:text-[16px]">
          Program |
          <Image src={"/home.svg"} width={15} height={15} alt="public" />- All Programs
        </span>
        <Link href={"/#"} passHref>
          <div className="h-[23px] w-[57px] bg-[#1c2b47] flex items-center justify-center rounded-md">
            <Image src={"/refresh.svg"} width={16} height={16} alt="Refresh" />
          </div>
        </Link>
      </div>
      <div className="relative mt-4">
        <Dropdown />
      </div>

      <div className="mt-4 grid grid-cols-1 lg:w-[1070px] sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {programs.map((program) => (
          <div
            key={program.title}
            onClick={() => handleCardClick(program.title as keyof typeof sessionData)}
            className={`p-4 bg-white rounded-lg shadow-md cursor-pointer h-[130px] flex flex-col justify-between ${
              selectedProgram && selectedProgram !== program.title ? "hidden" : ""
            }`}
          >
            <div className="flex justify-between items-center">
              <h2 className="font-bold text-[18px]">{program.title}</h2>
              <div className="flex gap-2">
                <Image
                  src={"/edit.svg"}
                  width={20}
                  height={20}
                  alt="Edit"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEditClick(program.id);
                  }}
                />
                <Image
                  src={"/delete.svg"}
                  width={20}
                  height={20}
                  alt="Delete"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteClick(program);
                  }}
                />
              </div>
            </div>
            <p className="text-[14px] font-normal mt-2">{program.time}</p>
            <div className="flex justify-between items-center mt-auto">
              <p className="text-[16px] font-medium">{program.sessions} Sessions</p>
              <Image src={"/program.svg"} width={24} height={24} alt="Sessions" />
            </div>
          </div>
        ))}
      </div>

      {selectedProgram && (
        <div className="mt-8 lg:w-[1070px]">
          <h3 className="text-xl font-bold text-[#213458]">Program: {selectedProgram}</h3>
          <table className="table-auto w-full mt-4 border-collapse">
            {/* <thead className=" text-white">
              <tr className="text-center">
                <th className="px-2 py-2 border">Session Name</th>
                <th className="px-2 py-2 border">Time</th>
              </tr>
            </thead> */}
            <tbody className="justify-center items-center text-center">
              {sessionData[selectedProgram].map((session) => (
                <tr key={session.id} className=" bg-[#213458] text-center">
                  <td className="border px-2 py-2">{session.title}</td>
                  <td className="border px-2 py-2">{session.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <button
            onClick={handleShowAllPrograms}
            className="mt-4 px-4 py-2 bg-[#213458] text-white rounded-md"
          >
            Show All Programs
          </button>
        </div>
      )}
      {isModalOpen && (
        <Modal onClose={closeModal} />
      )}
    </div>
  );
};

export default Page;
