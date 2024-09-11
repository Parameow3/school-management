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
  section: string;
  sections: number;
}

interface section {
  id: string;
  title: string;
  section: string;
}

interface sectionData {
  [key: string]: section[];
}

const sectionData: sectionData = {
  Level1: [
    { id: "1", title: "section 1", section: "Lego, Wedo2, Typing" },
    { id: "2", title: "section 2", section: "Lego, Wedo2, Typing" },
    { id: "3", title: "section 3", section: "Lego, Wedo2, Typing" },
    { id: "4", title: "section 4", section: "Lego, Wedo2, Typing" },
    { id: "5", title: "section 5", section: "Lego, Wedo2, Typing" },
    { id: "6", title: "section 6", section: "Lego, Wedo2, Typing" },
  ],
  Level2: [
    { id: "3", title: "section 1", section: "wedo2" },
    { id: "4", title: "section 2", section: "Typing" },
  ],
  Level3: [
    { id: "5", title: "section 1", section: "2:00 - 3:00" },
    { id: "6", title: "section 2", section: "3:00 - 4:00" },
  ],
  Level4: [
    { id: "7", title: "section 1", section: "9:00 - 10:00" },
    { id: "8", title: "section 2", section: "10:00 - 11:00" },
  ],
};

const Page = () => {
  const router = useRouter();
  const [selectedProgram, setSelectedProgram] = useState<keyof typeof sectionData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [programToDelete, setProgramToDelete] = useState<Program | null>(null);

  const programs: Program[] = [
    { id: "1", title: "Level1", section: "12:30 - 2:00", sections: 6 },
    { id: "2", title: "Level2", section: "10:00 - 11:30", sections: 8 },
    { id: "3", title: "Level3", section: "2:00 - 4:00", sections: 6 },
    { id: "4", title: "Level4", section: "9:00 - 10:30", sections: 10 },
  ];

  const handleCardClick = (programName: keyof typeof sectionData) => {
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
    <div className="lg:ml-[16%] ml-[11%] mt-20 flex flex-col">
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
            onClick={() => handleCardClick(program.title as keyof typeof sectionData)}
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
            <p className="text-[14px] font-normal mt-2">{program.section}</p>
            <div className="flex justify-between items-center mt-auto">
              <p className="text-[16px] font-medium">{program.sections} sections</p>
              <Image src={"/program.svg"} width={24} height={24} alt="sections" />
            </div>
          </div>
        ))}
      </div>

      {selectedProgram && (
        <div className="mt-8 lg:w-[1070px]">
          <h3 className="text-xl font-bold text-[#213458]">Program: {selectedProgram}</h3>
          <table className="table-auto w-full mt-4 border-b-black">
            <tbody className="justify-center items-center text-center">
              {sectionData[selectedProgram].map((section) => (
                <tr key={section.id} className="border text-center">
                  <td className="border border-black px-2 py-2">{section.title}</td>
                  <td className="border border-black px-2 py-2">{section.section}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <button
            onClick={handleShowAllPrograms}
            className="mt-4 px-4 py-2 mb-4 bg-[#213458] text-white rounded-md"
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
