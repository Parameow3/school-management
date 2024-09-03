"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Modal from "@/components/Modal";
import { useRouter } from "next/navigation"; // Import useRouter from next/navigation

interface Student {
  id: string;
  name: string;
  date: string;
  status: string;
  photo: string;
}

interface StudentData {
  [key: string]: Student[];
}

const studentData: StudentData = {
  Robotic: [
    {
      id: "1",
      name: "Lyseth",
      date: "8/09/2024",
      status: "P",
      photo: "/photo.jpg",
    },
    {
      id: "2",
      name: "John",
      date: "8/09/2024",
      status: "P",
      photo: "/photo2.jpg",
    },
  ],
  Robotic1: [
    {
      id: "3",
      name: "Alice",
      date: "8/09/2024",
      status: "A",
      photo: "/photo.jpg",
    },
  ],
  Robotic2: [
    {
      id: "4",
      name: "Bob",
      date: "8/09/2024",
      status: "P",
      photo: "/photo.jpg",
    },
  ],
  Robotic3: [
    {
      id: "5",
      name: "Charlie",
      date: "8/09/2024",
      status: "P",
      photo: "/photo.jpg",
    },
  ],
  Robotic4: [
    {
      id: "6",
      name: "David",
      date: "8/09/2024",
      status: "P",
      photo: "/photo.jpg",
    },
  ],
};

const Page = () => {
  const router = useRouter();
  const [selectedClass, setSelectedClass] = useState<keyof typeof studentData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState<Student | null>(null);

  const handleCardClick = (className: keyof typeof studentData) => {
    setSelectedClass(className);
  };

  const handleDeleteClick = (student: Student) => {
    setStudentToDelete(student);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setStudentToDelete(null);
  };

  const handleEditClick = (id: string) => {
    router.push(`/class/all-class/edit/${id}`);
  };

  const handleShowAllCards = () => {
    setSelectedClass(null);
  };

  return (
    <div className="lg:ml-[219px] ml-[45px] mt-20 flex flex-col">
      <div className="lg:w-[1068px] w-[330px] h-[42px] p-2 bg-white rounded-md flex items-center justify-between">
        <span className="flex flex-row lg:gap-3 gap-2 text-[12px] lg:text-[16px]">
          Class |
          <Image src={"/home.svg"} width={15} height={15} alt="public" />- All Classes
        </span>
        <Link href={"/#"} passHref>
          <div className="h-[23px] w-[57px] bg-[#1c2b47] flex items-center justify-center rounded-md">
            <Image src={"/refresh.svg"} width={16} height={16} alt="Refresh" />
          </div>
        </Link>
      </div>

      <div className="mt-6 grid grid-cols-1 lg:w-[1070px] h-[64px] lg:h-[98px] sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
        {Object.keys(studentData).map((className) => (
          <div
            key={className}
            onClick={() => handleCardClick(className as keyof typeof studentData)}
            className={`p-2 bg-white rounded-lg shadow-md cursor-pointer ${selectedClass && selectedClass !== className ? 'hidden' : ''}`}
          >
            <div className="flex justify-between items-center">
              <h2 className="font-bold text-[16px]">{className}</h2>
              <div className="flex gap-2">
                <Image
                  src={"/edit.svg"}
                  width={16}
                  height={16}
                  alt="Edit"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEditClick(studentData[className][0].id);
                  }}
                />
                <Image
                  src={"/delete.svg"}
                  width={16}
                  height={16}
                  alt="Delete"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteClick(studentData[className][0]);
                  }}
                />
              </div>
            </div>
            <p className="text-[12px] font-normal mt-2">1:30 - 3:00</p>
            <div className="flex justify-between items-center mt-2">
              <p className="text-[14px] font-normal">
                {studentData[className as keyof typeof studentData].length} Students
              </p>
              <Image src={"/student.svg"} width={20} height={20} alt="Students" />
            </div>
          </div>
        ))}
      </div>

      {selectedClass && (
        <div className="mt-8 lg:w-[1070px]">
          <h3 className="text-xl font-bold text-[#213458]">Class: {selectedClass}</h3>
          <table className="table-auto w-full mt-4 border-collapse">
            <thead className="bg-[#213458] text-white">
              <tr className="text-center">
                <th className="px-2 py-2 border">ID</th>
                <th className="px-2 py-2 border">Photo</th>
                <th className="px-2 py-2 border">Student Name</th>
                <th className="px-2 py-2 border">Date</th>
                <th className="px-2 py-2 border">Status</th>
              </tr>
            </thead>
            <tbody className="justify-center items-center text-center">
              {studentData[selectedClass].map((student) => (
                <tr key={student.id} className="text-center">
                  <td className="border px-2 py-2">{student.id}</td>
                  <td className="border px-2 py-2">
                    <Image
                      src={student.photo}
                      alt={student.name}
                      width={40}
                      height={40}
                      className="rounded-full object-cover mx-auto"
                    />
                  </td>
                  <td className="border px-2 py-2">{student.name}</td>
                  <td className="border px-2 py-2">{student.date}</td>
                  <td className="border px-2 py-2">{student.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {/* Button to show all cards again */}
          <button
            onClick={handleShowAllCards}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md"
          >
            Show All Classes
          </button>
        </div>
      )}

      {isModalOpen && (
        <Modal
          onClose={closeModal}
        />
      )}
    </div>
  );
};

export default Page;
