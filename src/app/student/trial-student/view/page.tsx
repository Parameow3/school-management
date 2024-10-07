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
  programs: number[];
  status_display: string;
  assign_by: number;
  handle_by: number[];
}

function Page() {
  const router = useRouter();
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState<number | null>(null);
  const [token, setToken] = useState<string | null>(null);

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

  // Fetch the students data when the token is available
  useEffect(() => {
    const fetchStudents = async () => {
      if (token) {  // Only fetch if the token is available
        try {
          setLoading(true);
          const response = await axios.get('http://127.0.0.1:8000/api/academics/student_trail/', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setStudents(response.data.results);
          setLoading(false);
        } catch (error) {
          console.error('Error fetching student data:', error);
          setError('Failed to load student data.');
          setLoading(false);
        }
      }
    };

    fetchStudents();
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
        await axios.delete(`http://127.0.0.1:8000/api/academics/student_trail/${selectedStudentId}/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        alert('Student deleted successfully!');
        // Remove the deleted student from the state without reloading
        setStudents((prev) => prev.filter((student) => student.id !== selectedStudentId));
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

  if (loading) {
    return <div className='lg:ml-[18%] ml-[11%] mt-20 flex flex-col'>Loading...</div>;
  }

  if (error) {
    return <div className='lg:ml-[18%] ml-[11%] mt-20 flex flex-col'>{error}</div>;
  }

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
          {students.map((student) => (
            <tr key={student.id}>
              <td className="border px-4 py-2">{student.client}</td>
              <td className="border px-4 py-2">{student.phone}</td>
              <td className="border px-4 py-2">{student.number_student}</td>
              <td className="border px-4 py-2">{student.status_display}</td>
              <td className="border px-4 py-2">
                {student.programs.map((program) => (
                  <span key={program}>{program}</span>
                ))}
              </td>
              <td className="border px-4 py-2">{student.assign_by}</td>
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
