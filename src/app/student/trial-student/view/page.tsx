"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Button from "@/components/Button";
import Modal from "@/components/Modal"; // Corrected Modal import
import Image from "next/image";
import Link from "next/link";
interface Student {
  id: number;
  client: string;
  phone: string;
  number_student: number;
  programs: number[];
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
  const [users, setUsers] = useState<User[]>([]); // Ensure this is initialized as an array
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedStudentId, setSelectedStudentId] = useState<number | null>(
    null
  );
  const [showModal, setShowModal] = useState<boolean>(false);
  const router = useRouter();

  // Fetch user names by their IDs
  const getUserNames = (userIds: number[]): string => {
    // Return names by matching IDs from the users array
    const userNames = userIds
      .map((id) => {
        const user = users.find((u) => u.id === id);
        return user ? user.username : null; // Adjusted from `name` to `username`
      })
      .filter((name) => name !== null);

    return userNames.length > 0 ? userNames.join(", ") : "No valid users";
  };

  // Get the program names based on the provided programIds
  const getProgramNames = (programIds: number[]) => {
    const programNames = programIds
      .map((id) => {
        const program = programs.find((prog) => prog.id === id);
        return program ? program.name : null;
      })
      .filter((name) => name !== null);

    return programNames.length > 0
      ? programNames.join(", ")
      : "No valid programs";
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
        // Fetch students data
        const studentResponse = await axios.get(
          "http://127.0.0.1:8000/api/academics/student_trail/",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setStudents(studentResponse.data);

        // Fetch programs data
        const programResponse = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/academics/program/`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const programsList = programResponse.data.results || [];
        setPrograms(programsList);

        // Fetch user data (for assign_by and handle_by)
        const userResponse = await axios.get(
          "http://127.0.0.1:8000/api/auth/user",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const usersList: User[] = userResponse.data.results || []; // Ensure it's typed as User[]
        setUsers(usersList);
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
        alert("Student deleted successfully!");
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
      <div className="lg:w-[1040px] w-[330px] mb-4 h-[40px] p-2 bg-white flex items-center rounded-md justify-between">
        <span className="flex flex-row gap-2 text-[14px] lg:text-[15px]">
          Student |{" "}
          <Image src="/home.svg" width={15} height={15} alt="public" /> Student
          Trail
        </span>

        <Link href="/#" passHref>
          <div className="h-[23px] w-[57px] bg-[#213458] flex items-center justify-center rounded-md">
            <Image src="/refresh.svg" width={16} height={16} alt="Refresh" />
          </div>
        </Link>
      </div>
      <div className="mb-4 relative">
        <span className="absolute inset-y-0 left-0 flex items-center pl-3">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8 4a6 6 0 100 12 6 6 0 000-12zm8 8l4 4"
            />
          </svg>
        </span>
        <input
          type="text"
          className="border border-gray-300 rounded-full pl-10 pr-4 py-2 w-full lg:w-[240px] focus:outline-none focus:ring-2 focus:ring-[#213458] shadow-sm placeholder-gray-400 text-sm"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div>
        <Button className="mb-4" onClick={handleBack}>
          Back
        </Button>
      </div>

      <table className="min-w-full border-collapse border">
        <thead className="bg-[#213458] text-white">
          <tr>
            <th className="border px-3 py-2 text-[14px]">ID</th>
            <th className="border px-3 py-2 text-[14px]">Client</th>
            <th className="border px-3 py-2 text-[14px]">Phone</th>
            <th className="border px-3 py-2 text-[14px]">Number of Students</th>
            <th className="border px-3 py-2 text-[14px]">Programs</th>
            <th className="border px-3 py-2 text-[14px]">Status</th>
            <th className="border px-3 py-2 text-[14px]">Assigned By</th>
            <th className="border px-3 py-2 text-[14px]">Handled By</th>
            <th className="border px-3 py-2 text-[14px]">Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredStudents.length > 0 ? (
            filteredStudents.map((student) => (
              <tr key={student.id}>
                <td className="border px-4 py-2 text-[14px]">{student.id}</td>
                <td className="border px-4 py-2 text-[14px]">
                  {student.client}
                </td>
                <td className="border px-4 py-2 text-[14px]">
                  {student.phone}
                </td>
                <td className="border px-4 py-2 text-[14px]">
                  {student.number_student}
                </td>
                <td className="border px-4 py-2 text-[14px]">
                  {getProgramNames(student.programs)}
                </td>
                <td className="border px-4 py-2 text-[14px]">
                  {student.status_display}
                </td>
                <td className="border px-4 py-2 text-[14px]">
                  {getUserNames([student.assign_by])}
                </td>
                <td className="border px-4 py-2 text-[14px]">
                  {getUserNames(student.handle_by)}
                </td>
                <td className="border px-4 py-2 flex justify-center">
                  <Image
                    src="/update.svg"
                    width={20}
                    height={20}
                    alt="update"
                    className="mr-2"
                    onClick={() => handleEdit(student.id)}
                  />
                  <Image
                    src="/delete.svg"
                    width={20}
                    height={20}
                    alt="delete"
                    onClick={() => handleDeleteClick(student.id)}
                  />
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={8} className="border px-4 py-2 text-center">
                No students found
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {showModal && (
        <Modal onClose={handleModalClose} onConfirm={handleDeleteConfirm} />
      )}
    </div>
  );
};

export default Page;
