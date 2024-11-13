'use client';
import React, { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import Modal from "@/components/Modal";
import { useRouter } from "next/navigation";
import Dropdown from "@/components/Dropdown";

interface Class {
  id: number;
  name: string;
  course_name: string[];
  teacher_name: string;
  start_date: string;
  end_date: string;
  students: Student[]; // Add a list of students for each class
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
  const [studentToDelete, setStudentToDelete] = useState<Student | null>(null); // Track student to delete
  const [classData, setClassData] = useState<Class[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const tokenFromLocalStorage = localStorage.getItem("authToken");
    if (tokenFromLocalStorage) {
      setToken(tokenFromLocalStorage);
    } else {
      router.push("/login");
    }
  }, [router]);

  useEffect(() => {
    if (token) {
      const fetchData = async () => {
        try {
          const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/academics/classroom`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setClassData(response.data.results);
          setLoading(false);
        } catch (err: any) {
          setError(err.message);
          setLoading(false);
        }
      };
      fetchData();
    }
  }, [token]);

  const handleCardClick = (classId: number) => {
    setSelectedClass(classId);
  };

  const handleDeleteClick = (student: Student) => {
    setStudentToDelete(student); // Set the student to delete
    setIsModalOpen(true); // Open the modal to confirm delete
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setStudentToDelete(null);
  };

  const handleDeleteStudent = async () => {
    if (!studentToDelete || !selectedClass) return;
    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/academics/classroom/${selectedClass}/students/${studentToDelete.id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      // After successful deletion, we don't need to fetch students anymore.
      closeModal(); // Close modal after delete
    } catch (err: any) {
      console.error("Error deleting student:", err);
      setError("Failed to delete student.");
      closeModal(); // Close modal in case of error as well
    }
  };

  const countUniqueTeachers = () => {
    const uniqueTeachers = new Set(classData.map((classInfo) => classInfo.teacher_name));
    return uniqueTeachers.size;
  };

  if (loading) {
    return <p className="lg:ml-[16%] ml-[11%] mt-20 flex flex-col">Loading...</p>;
  }

  if (error) {
    return <p className="lg:ml-[16%] ml-[11%] mt-20 flex flex-col">Error: {error}</p>;
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
            className="p-4 bg-white rounded-lg shadow-md cursor-pointer h-[130px] flex flex-col justify-between"
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
                    router.push(`/class/all-class/add/${classInfo.id}`);
                  }}
                />
                <Image
                  src={"/edit.svg"}
                  width={20}
                  height={20}
                  alt="Edit"
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push(`/class/all-class/edit/${classInfo.id}`);
                  }}
                />
                <Image
                  src={"/delete.svg"}
                  width={20}
                  height={20}
                  alt="Delete"
                  onClick={(e) => {
                    e.stopPropagation();
                    // Pass student to delete instead of class
                    if (classInfo.students.length > 0) {
                      handleDeleteClick(classInfo.students[0]); // Example: delete first student
                    }
                  }}
                />
              </div>
            </div>
            <p className="text-[14px] font-normal mt-2">
              {classInfo.start_date} - {classInfo.end_date}
            </p>
            <div className="flex justify-between items-center mt-auto">
              <p className="text-[16px] font-medium">{classInfo.teacher_name}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Delete Confirmation Modal */}
      {isModalOpen && studentToDelete && (
        <Modal
          onClose={closeModal}
          onConfirm={handleDeleteStudent} // Confirm deletion when Yes button is clicked
          message={`Are you sure you want to delete the student ${studentToDelete.first_name} ${studentToDelete.last_name}?`} // Custom message for student deletion
        />
      )}
    </div>
  );
};

export default Page;
