'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Button from '@/components/Button';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Modal from '@/components/Modal'; // Assuming Modal is in the correct directory

interface Student {
  id: number;
  client: string;
  phone: string;
  number_student: number;
  programs: number[]; // Programs are stored as IDs
  status_display: string;
  assign_by: number; // Assign by is stored as an ID
  handle_by: number[];
}

interface User {
  id: number;
  username: string;
}

interface Program {
  id: number;
  name: string;
}

function Page() {
  const router = useRouter();
  const [students, setStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]); // New state for filtered students
  const [users, setUsers] = useState<User[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState<number | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>(''); // State for search query

  // Fetch the token from localStorage when the component mounts
  useEffect(() => {
    const tokenFromLocalStorage = localStorage.getItem("authToken");
    if (tokenFromLocalStorage) {
      setToken(tokenFromLocalStorage);
    } else {
      // Redirect to login if no token
      router.push("/login");
    }
  }, [router]);

  // Fetch the students, users, and programs data when the token is available
  useEffect(() => {
    const fetchStudentsAndRelatedData = async () => {
      if (token) {  // Only fetch if the token is available
        try {
          setLoading(true);
          
          // Fetch students
          const studentResponse = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/academics/student_trail/`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          // Fetch users (for assign_by field)
          const userResponse = await axios.get(`http://127.0.0.1:8000/api/auth/user`, {  // Corrected API endpoint
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          const programResponse = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/academics/program/`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          setStudents(studentResponse.data.results);
          setFilteredStudents(studentResponse.data.results); // Initialize filtered students
          setUsers(userResponse.data.results);
          setPrograms(programResponse.data.results);
          
          setLoading(false);
        } catch (error) {
          console.error('Error fetching student or related data:', error);
          setError('Failed to load data.');
          setLoading(false);
        }
      }
    };

    fetchStudentsAndRelatedData();
  }, [token]); // Dependency on token

  const handleEdit = (id: number) => {
    router.push(`/student/trial-student/edit/${id}`);
  };

  const handleBack = () => {
    router.push(`/student/trial-student`);
  };

  const handleDeleteClick = (id: number) => {
    setSelectedStudentId(id);
    setShowModal(true);  // Show the modal when delete is clicked
  };

  const handleDeleteConfirm = async () => {
    if (selectedStudentId) {
      try {
        await axios.delete(`${process.env.NEXT_PUBLIC_BASE_URL}/api/academics/student_trail/${selectedStudentId}/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        alert('Student deleted successfully!');
        // Remove the deleted student from the state without reloading
        setStudents((prev) => prev.filter((student) => student.id !== selectedStudentId));
        setFilteredStudents((prev) => prev.filter((student) => student.id !== selectedStudentId)); // Update filtered students as well
        setShowModal(false);  // Close the modal
      } catch (error) {
        console.error('Error deleting student:', error);
        alert('Failed to delete student.');
      }
    }
  };

  const handleModalClose = () => {
    setShowModal(false);  // Close the modal without deleting
  };

  // Filter students based on search query
  useEffect(() => {
    if (searchQuery) {
      const filtered = students.filter((student) =>
        student.client.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredStudents(filtered);
    } else {
      setFilteredStudents(students); // Reset to all students if search is cleared
    }
  }, [searchQuery, students]);

  if (loading) {
    return <div className='lg:ml-[18%] ml-[11%] mt-20 flex flex-col'>Loading...</div>;
  }

  if (error) {
    return <div className='lg:ml-[18%] ml-[11%] mt-20 flex flex-col'>{error}</div>;
  }

  const getUserById = (id: number) => {
    const user = users.find(user => user.id === id);
    return user ? user.username : 'Unknown'; // Return 'Unknown' if user not found
  };

  const getProgramNames = (programIds: number[]) => {
    const programNames = programIds.map(id => {
      const program = programs.find(program => program.id === id);
      return program ? program.name : 'Unknown'; // Return 'Unknown' if program not found
    });
    return programNames.join(', ');
  };

  return (
    <div className='lg:ml-[18%] ml-[11%] mt-20 flex flex-col'>
      <div className="lg:w-[1040px] w-[330px] mb-4 h-[40px] p-2 bg-white flex items-center rounded-md justify-between">
        <span className="flex flex-row gap-2 text-[12px] lg:text-[15px]">
          Student | <Image src="/home.svg" width={15} height={15} alt="public" /> New-student
        </span>

        <Link href="/#" passHref>
          <div className="h-[23px] w-[57px] bg-[#213458] flex items-center justify-center rounded-md">
            <Image src="/refresh.svg" width={16} height={16} alt="Refresh" />
          </div>
        </Link>
      </div>

      {/* Search Input */}
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
    onChange={(e) => setSearchQuery(e.target.value)} // Update search query
  />
</div>

      <div>
        <Button className='mb-4' onClick={handleBack}>Back</Button>
      </div>

      <table className="min-w-full border-collapse border">
        <thead className="bg-[#213458] text-white">
          <tr>
            <th className="border px-4 py-2">First Name</th>
            <th className="border px-4 py-2">Phone</th>
            <th className="border px-4 py-2">Number of Students</th>
            <th className="border px-4 py-2">Status</th>
            <th className="border px-4 py-2">Programs</th>
            <th className="border px-4 py-2">Assigned By</th>
            <th className="border px-4 py-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredStudents.map((student) => (
            <tr key={student.id}>
              <td className="border px-4 py-2">{student.client}</td>
              <td className="border px-4 py-2">{student.phone}</td>
              <td className="border px-4 py-2">{student.number_student}</td>
              <td className="border px-4 py-2">{student.status_display}</td>
              <td className="border px-4 py-2">
                {getProgramNames(student.programs)} {/* Get program names */}
              </td>
              <td className="border px-4 py-2">
                {getUserById(student.assign_by)} {/* Get username */}
              </td>
              <td className="border px-4 py-2 flex justify-center">
                <Image
                  src="/update.svg"
                  width={20}
                  height={20}
                  alt='update'
                  className="mr-2"
                  onClick={() => handleEdit(student.id)}
                />
                <Image
                  src="/delete.svg"
                  width={20}
                  height={20}
                  alt='delete'
                  onClick={() => handleDeleteClick(student.id)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && (
        <Modal onClose={handleModalClose} onConfirm={handleDeleteConfirm} />
      )}
    </div>
  );
}

export default Page;
