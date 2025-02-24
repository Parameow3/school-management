"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Button from "@/components/Button";
import Modal from "@/components/Modal";
import Image from "next/image";
import Link from "next/link";
import { PencilSquareIcon } from "@heroicons/react/24/solid";

interface Student {
  id: number;
  client: string;
  phone: string;
  number_student: number;
  programs: number[] | undefined; // Allow undefined to avoid errors
  status: string;
  status_display: string;
  assign_by: number;
  handle_by: number[];
}

interface Program {
  id: number;
  name: string;
}

interface User {
  id: number;
  username: string;
}

const Page: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedStudentId, setSelectedStudentId] = useState<number | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const router = useRouter();

  // ✅ Ensure `programIds` is always an array before using `.map()`
  const getProgramNames = (programIds?: number[]) => {
    if (!Array.isArray(programIds)) return "No valid programs"; // Prevent error

    const programNames = programIds
      .map((id) => {
        const program = programs.find((prog) => prog.id === id);
        return program ? program.name : null;
      })
      .filter((name) => name !== null);

    return programNames.length > 0 ? programNames.join(", ") : "No valid programs";
  };

  // ✅ Ensure `userIds` is always an array before using `.map()`
  const getUserNames = (userIds: number[] | undefined): string => {
    if (!Array.isArray(userIds)) return "No valid users";

    const userNames = userIds
      .map((id) => {
        const user = users.find((u) => u.id === id);
        return user ? user.username : null;
      })
      .filter((name) => name !== null);

    return userNames.length > 0 ? userNames.join(", ") : "No valid users";
  };

  useEffect(() => {
    const tokenFromLocalStorage = localStorage.getItem("authToken");
    if (tokenFromLocalStorage) {
      setToken(tokenFromLocalStorage);
    } else {
      router.push("/login");
    }
  }, [router]);

  useEffect(() => {
    if (!token) return;

    const fetchStudentAndProgramData = async () => {
      try {
        const studentResponse = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/academics/student_trail/`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setStudents(studentResponse.data);

        const programResponse = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/academics/program/`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setPrograms(programResponse.data.results || []);

        const userResponse = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/user`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setUsers(userResponse.data.results || []);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(error instanceof Error ? error.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchStudentAndProgramData();
  }, [token]);

  const handleBack = () => {
    router.push(`/student/trial-student`);
  };

  const handleDeleteClick = (id: number) => {
    setSelectedStudentId(id);
    setShowModal(true);
  };

  const handleEdit = (id: number) => {
    router.push(`/student/trial-student/edit/${id}`);
  };

  const handleDeleteConfirm = async () => {
    if (selectedStudentId && token) {
      try {
        await axios.delete(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/academics/student_trail/${selectedStudentId}/`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setStudents((prev) =>
          prev.filter((student) => student.id !== selectedStudentId)
        );
        setShowModal(false);
      } catch (error) {
        console.error("Error deleting student:", error);
        alert("Failed to delete student.");
      }
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
  };

  const filteredStudents = students.filter(
    (student) =>
      student.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.phone.includes(searchQuery)
  );

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="lg:ml-[219px] mt-20 ml-[25px] flex flex-col">
      <Button className="mb-4" onClick={handleBack}>Back</Button>

      <table className="min-w-full border-collapse border">
        <thead className="bg-[#213458] text-white">
          <tr>
            <th className="border px-3 py-2">ID</th>
            <th className="border px-3 py-2">Client</th>
            <th className="border px-3 py-2">Phone</th>
            <th className="border px-3 py-2">Number of Students</th>
            <th className="border px-3 py-2">Programs</th>
            <th className="border px-3 py-2">Status</th>
            <th className="border px-3 py-2">Assigned By</th>
            <th className="border px-3 py-2">Handled By</th>
            <th className="border px-3 py-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredStudents.length > 0 ? (
            filteredStudents.map((student) => (
              <tr key={student.id}>
                <td className="border px-4 py-2">{student.id}</td>
                <td className="border px-4 py-2">{student.client}</td>
                <td className="border px-4 py-2">{student.phone}</td>
                <td className="border px-4 py-2">{student.number_student}</td>
                <td className="border px-4 py-2">{getProgramNames(student.programs)}</td>
                <td className="border px-4 py-2">{student.status_display}</td>
                <td className="border px-4 py-2">{getUserNames([student.assign_by])}</td>
                <td className="border px-4 py-2">{getUserNames(student.handle_by)}</td>
                <td className="border px-4 py-2 flex justify-center">
                  
          <button
            onClick={() => handleEdit(student.id)}
            className="hover:scale-110 transition-transform transform p-2 rounded-full bg-gray-200 hover:bg-gray-300"
          >
            <PencilSquareIcon className="w-5 h-5 text-gray-700" />
          </button>
          <Image src="/delete.svg" width={20} height={20} alt="delete" onClick={() => handleDeleteClick(student.id)} />
                 
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={8} className="border px-4 py-2 text-center">No students found</td>
            </tr>
          )}
        </tbody>
      </table>

      {showModal && <Modal onClose={handleModalClose} onConfirm={handleDeleteConfirm} />}
    </div>
  );
};

export default Page;
