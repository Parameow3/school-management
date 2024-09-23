"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import Modal from "@/components/Modal";
import { useRouter } from "next/navigation";
import Dropdown from "@/components/Dropdown";

// Define interfaces based on backend data
interface Class {
  id: number;
  name: string;
  course_name: string[];
  teacher_name: string;
  start_date: string;
  end_date: string;
}

interface Student {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
}

const Page = () => {
  const router = useRouter();
  const [selectedClass, setSelectedClass] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState<Class | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [classData, setClassData] = useState<Class[]>([]);
  const [studentData, setStudentData] = useState<Student[]>([]); // New state for student data
  const [loading, setLoading] = useState(true); 
  const [studentLoading, setStudentLoading] = useState(false); // Loading state for students
  const [error, setError] = useState<string | null>(null); 

  useEffect(() => {
    setIsMounted(true);
    const fetchData = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/academics/classroom/?page=1");
        setClassData(response.data.results); 
        setLoading(false); 
      } catch (err:any) {
        setError(err.message);
        setLoading(false); 
      }
    };

    fetchData();
  }, []);

  // Fetch students when a class is clicked
  const fetchStudents = async (classId: number) => {
    setStudentLoading(true);
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/academics/classroom/${classId}/students`);
      setStudentData(response.data.results); // Update student data based on response
      setStudentLoading(false);
    } catch (err: any) {
      console.error("Error fetching students:", err);
      setStudentLoading(false);
    }
  };

  const handleCardClick = (classId: number) => {
    setSelectedClass(classId);
    fetchStudents(classId); // Fetch students when a class is clicked
  };

  const handleDeleteClick = (classInfo: Class) => {
    setStudentToDelete(classInfo);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setStudentToDelete(null);
  };

  const handleAddClick = (id: number) => {
    router.push(`/class/all-class/add/${id}`);
  };

  const handleEditClick = (id: number) => {
    router.push(`/class/all-class/edit/${id}`);
  };

  const handleShowAllCards = () => {
    setSelectedClass(null);
  };
  const countUniqueTeachers = () => {
    const uniqueTeachers = new Set(classData.map((classInfo) => classInfo.teacher_name));
    return uniqueTeachers.size;
  };

  if (loading) {
    return <p>Loading...</p>; 
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div className="lg:ml-[16%] ml-[11%] mt-20 flex flex-col">
      <div className="lg:w-[1068px] w-[330px] h-[42px] p-2 bg-white rounded-md flex items-center justify-between">
        <span className="flex flex-row lg:gap-3 gap-2 text-[12px] lg:text-[16px]">
          Class |
          <Image src={"/home.svg"} width={15} height={15} alt="public" /> - All Classes
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
      <div className="mt-4 grid grid-cols-1 lg:w-[1070px] w-[330px] sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {classData.map((classInfo) => (
          <div
            key={classInfo.id}
            onClick={() => handleCardClick(classInfo.id)}
            className={`p-4 bg-white rounded-lg shadow-md cursor-pointer h-[130px] flex flex-col justify-between`}
          >
            <div className="flex justify-between items-center">
              <h2 className="font-bold text-[18px]">{classInfo.name}</h2>
              <div className="flex gap-2">
                <Image
                  src={"/add.svg"}
                  width={20}
                  height={20}
                  alt="Add"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAddClick(classInfo.id);
                  }}
                />
                <Image
                  src={"/edit.svg"}
                  width={20}
                  height={20}
                  alt="Edit"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEditClick(classInfo.id);
                  }}
                />
                <Image
                  src={"/delete.svg"}
                  width={20}
                  height={20}
                  alt="Delete"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteClick(classInfo);
                  }}
                />
              </div>
            </div>
            <p className="text-[14px] font-normal mt-2">
              {classInfo.start_date} - {classInfo.end_date}
            </p>
            <div className="flex justify-between items-center mt-auto">
              <p className="text-[16px] font-medium"> {classInfo.teacher_name}</p>
              <p className="text-[16px] font-medium"> {countUniqueTeachers()}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Display students if a class is selected */}
      {selectedClass && (
        <div className="mt-6">
          <h3 className="font-bold text-xl">Students in Class {selectedClass}</h3>
          {studentLoading ? (
            <p>Loading students...</p>
          ) : studentData.length === 0 ? (
            <p>No students found for this class.</p>
          ) : (
            <ul className="mt-4">
              {studentData.map((student) => (
                <li key={student.id} className="p-2 bg-white rounded-md shadow-md my-2">
                  {student.first_name} {student.last_name} ({student.email})
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
      {isModalOpen && <Modal onClose={closeModal} />}
    </div>
  );
};

export default Page;
