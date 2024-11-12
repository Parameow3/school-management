'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Button from '@/components/Button';
import ProgramDropdown from '@/components/programDropdown';
import { useRouter, useSearchParams } from 'next/navigation';
import axios from 'axios';

const Page = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get('id');

  const [loading, setLoading] = useState(true); // Initial loading state
  const [token, setToken] = useState<string | null>(null);
  const [users, setUsers] = useState<{ id: number; username: string }[]>([]);
  const [teachers, setTeachers] = useState<{ id: number; username: string }[]>([]);
  const [selectedTeacher, setSelectedTeacher] = useState('');

  const [formData, setFormData] = useState({
    client: '',
    phone: '',
    number_student: 1,
    programs: [] as number[], 
    status: 'Pending',
    assign_by: 1,
    handle_by: [] as number[],
  });

  // Fetch token from localStorage
  useEffect(() => {
    const tokenFromLocalStorage = localStorage.getItem('authToken');
    if (tokenFromLocalStorage) {
      setToken(tokenFromLocalStorage); // Set token in state
    } else {
      router.push('/login'); // Redirect if no token
    }
  }, [router]);

  // Fetch student data by ID
  useEffect(() => {
    const fetchStudentData = async () => {
      if (id && token) {
        try {
          const response = await axios.get(
            `${process.env.NEXT_PUBLIC_BASE_URL}/api/academics/student_trail/${id}/`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );

          if (response.data) {
            setFormData({
              client: response.data.client || '',
              phone: response.data.phone || '',
              number_student: response.data.number_student || 1,
              programs: response.data.programs || [],
              status: response.data.status || 'Pending',
              assign_by: response.data.assign_by || 1,
              handle_by: response.data.handle_by || [],
            });
          }
        } catch (error: any) {
          console.error('Error fetching student data:', error.response || error);
        } finally {
          setLoading(false);
        }
      }
    };

    if (token) {
      fetchStudentData(); // Call the function when token is available
    }
  }, [id, token]);

  // Fetch users and teachers
  useEffect(() => {
    const fetchUsersAndTeachers = async () => {
      if (token) {
        try {
          const [userResponse, teacherResponse] = await Promise.all([
            axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/user`, {
              headers: { Authorization: `Bearer ${token}` },
            }),
            axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/teacher`, {
              headers: { Authorization: `Bearer ${token}` },
            }),
          ]);

          setUsers(userResponse.data.results);
          setTeachers(
            teacherResponse.data.results.map((teacher: any) => ({
              id: teacher.id,
              username: teacher.user.username,
            }))
          );
        } catch (error) {
          console.error('Error fetching users or teachers:', error);
        }
      }
    };

    if (token) {
      fetchUsersAndTeachers();
    }
  }, [token]);

  // Handle form changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: name === 'handle_by' ? [parseInt(value)] : value,
    }));
  };

  const handleProgramSelect = (selectedPrograms: number[]) => {
    setFormData((prevData) => ({ ...prevData, programs: selectedPrograms }));
  };

  // Handle teacher selection
  const handleTeacherChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedTeacher(event.target.value);
    setFormData((prev) => ({
      ...prev,
      handle_by: [parseInt(event.target.value)],
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!token) {
      alert('Authorization token is missing. Please log in.');
      return;
    }

    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/academics/student_trail/${id}/`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.status === 200) {
        alert('Student information updated successfully!');
        router.push('/student/trial-student');
      } else {
        alert('Failed to update student information.');
      }
    } catch (error:any) {
      console.error('Error updating the form:', error.response || error);
      alert('Error updating the form.');
    }
  };

  // If loading, show loading indicator
  if (loading) {
    return (
      <div className="lg:ml-[219px] mt-20 ml-[25px] flex flex-col">
        Loading...
      </div>
    );
  }

  return (
    <div className="lg:ml-[219px] mt-20 ml-[25px] flex flex-col">
      <div className="lg:w-[1060px] w-[330px] h-[40px] p-4 bg-white flex items-center rounded-md justify-between">
        <span className="flex flex-row gap-2 text-[12px] lg:text-[15px]">
          Student | <Image src="/home.svg" width={15} height={15} alt="public" /> Update-student
        </span>
        <Link href="/#" passHref>
          <div className="h-[23px] w-[57px] bg-[#213458] flex items-center justify-center rounded-md">
            <Image src="/refresh.svg" width={16} height={16} alt="Refresh" />
          </div>
        </Link>
      </div>

      <div className="flex flex-row justify-between p-3">
        <h1 className="text-center text-2xl font-bold mb-8 mt-4 border-b-2">Update Trial Form</h1>
      </div>

      <form className="grid grid-cols-1 lg:grid-cols-3 gap-8" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="client" className="block text-sm font-medium text-gray-700">
            Client (Student Name)
          </label>
          <input
            type="text"
            id="client"
            name="client"
            value={formData.client}
            onChange={handleChange}
            className="mt-1 block lg:w-[272px] w-[329px] p-2 rounded-md outline-none border-gray-300 shadow-sm"
            required
          />
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
            Phone
          </label>
          <input
            type="text"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="mt-1 block lg:w-[272px] w-[329px] p-2 rounded-md outline-none border-gray-300 shadow-sm"
            required
          />
        </div>

        <div>
          <label htmlFor="number_student" className="block text-sm font-medium text-gray-700">
            Number of Students
          </label>
          <input
            type="number"
            id="number_student"
            name="number_student"
            value={formData.number_student}
            onChange={handleChange}
            className="mt-1 block lg:w-[272px] w-[329px] p-2 rounded-md outline-none border-gray-300 shadow-sm"
            required
          />
        </div>

        <div>
          <label htmlFor="programs" className="block text-sm font-medium text-gray-700">
            Programs
          </label>
          <ProgramDropdown onSelect={handleProgramSelect} selectedPrograms={formData.programs} />
        </div>

        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700">
            Status
          </label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="mt-1 block lg:w-[272px] w-[329px] p-2 rounded-md outline-none border-gray-300 shadow-sm"
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
            <option value="Pending">Pending</option>
            <option value="Completed">Completed</option>
          </select>
        </div>

        <div>
          <label htmlFor="assign_by" className="block text-sm font-medium text-gray-700">
            Assigned By
          </label>
          <select
            id="assign_by"
            name="assign_by"
            value={formData.assign_by}
            onChange={handleChange}
            className="mt-1 block lg:w-[272px] w-[329px] p-2 rounded-md outline-none border-gray-300 shadow-sm"
            required
          >
            <option value="">Select User</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.username}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="teacher" className="block text-sm font-medium text-gray-700">
            Select a Teacher:
          </label>
          <select
            id="teacher"
            value={selectedTeacher}
            onChange={handleTeacherChange}
            className="mt-1 block lg:w-[272px] w-[329px] p-2 rounded-md outline-none border-gray-300 shadow-sm"
          >
            <option value="">Select a Teacher</option>
            {teachers.map((teacher) => (
              <option key={teacher.id} value={teacher.id}>
                {teacher.username}
              </option>
            ))}
          </select>
        </div>

        <div className="lg:col-span-3 flex justify-center items-center space-x-4">
          <Button className="lg:h-[40px] h-[40px] flex justify-center items-center px-6 py-2 bg-[#213458] text-white font-medium rounded hover:bg-blue-500">
            Update
          </Button>
        </div>
      </form>
    </div>
  );
};

export default Page;
