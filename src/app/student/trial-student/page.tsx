'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Button from '@/components/Button';
import ProgramDropdown from '@/components/programDropdown';
import { useRouter } from 'next/navigation';

const Page = () => {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [users, setUsers] = useState<{ id: number; username: string }[]>([]); // Initialize users as an empty array
  const [teachers, setTeachers] = useState<{ id: number; username: string }[]>([]); // Initialize as empty array
  const [selectedTeacher, setSelectedTeacher] = useState('');

  // Fetch token from localStorage
  useEffect(() => {
    const tokenFromLocalStorage = localStorage.getItem('authToken');
    if (tokenFromLocalStorage) {
      setToken(tokenFromLocalStorage); // Set token in state
    } else {
      // Redirect to login if no token found
      router.push('/login');
    }
  }, [router]);

  // Fetch users (Assigned By) using the token
  useEffect(() => {
    if (token) {
      const fetchUsers = async () => {
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/user`, {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
          }

          const data = await response.json();
          const adminUsers = data.results.filter((user: any) => user.roles === 1);
          setUsers(adminUsers);
        } catch (error) {
          console.error('Error fetching users:', error);
        }
      };

      fetchUsers();
    }
  }, [token]);

  // Fetch teachers using the token
  useEffect(() => {
    if (token) {
      fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/teacher`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,  // Token is used here
        },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error('Failed to fetch teachers');
          }
          return response.json();
        })
        .then((data) => {
          if (data.results && Array.isArray(data.results)) {
            const formattedTeachers = data.results.map((teacher: any) => ({
              id: teacher.id,  // Use the teacher's id
              username: teacher.user.username,  // Extract the username from the nested user object
            }));
            setTeachers(formattedTeachers);  // Set teachers array
          } else {
            console.error('Unexpected response format:', data);
            setTeachers([]); // Set an empty array in case of unexpected format
          }
        })
        .catch((error) => {
          console.error('Error fetching teachers:', error);
          setTeachers([]); // Ensure it's an empty array on error
        });
    }
  }, [token]);  // This ensures that the effect runs after the token is set

  const handleTeacherChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedTeacher(event.target.value);
    setFormData(prev => ({
      ...prev,
      handle_by: [parseInt(event.target.value)]  // Set handle_by as an array containing the selected teacher's ID
    }));
  };

  const [formData, setFormData] = useState({
    client: '',
    phone: '',
    number_student: 1,
    programs: [] as number[], 
    status: 'Pending',  // Default to "Pending" as per your backend structure
    assign_by: 1, 
    handle_by: [] as number[],  // Handle as array
  });

  const handleProgramSelect = (selectedPrograms: number[]) => {
    setFormData((prevData) => ({ ...prevData, programs: selectedPrograms }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (name === 'handle_by') {
      const values = value.split(',').map(Number); 
      setFormData({ ...formData, [name]: values });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleViewClick = () => {
    router.push(`/student/trial-student/view`);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!token) {
      alert('Authorization token is missing. Please log in.');
      return;
    }

    // Prepare payload
    const dataToSubmit = {
      client: formData.client,
      phone: formData.phone,
      number_student: formData.number_student,
      programs: formData.programs,  // Should be an array of program IDs
      status: formData.status.toUpperCase(),  // Ensure status matches backend (Pending -> PENDING)
      assign_by: formData.assign_by,  // ID of the user
      handle_by: formData.handle_by  // Array of teacher IDs
    };

    console.log('Posting data:', dataToSubmit);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/academics/student_trail/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // Add token to Authorization header
        },
        body: JSON.stringify(dataToSubmit),  // Ensure correct payload is sent
      });

      if (response.ok) {
        const responseData = await response.json();
        console.log('API Response:', responseData);
        alert('Trial information submitted successfully!');
      } else {
        const errorData = await response.json();
        console.error('Error response:', errorData);
        alert('Failed to submit trial information.');
      }
    } catch (error) {
      console.error('Error submitting the form:', error);
      alert('Error submitting the form.');
    }
  };

  return (
    <div className="lg:ml-[219px] mt-20 ml-[25px] flex flex-col">
      {/* Header Section */}
      <div className="lg:w-[1060px] w-[330px] h-[40px] p-4 bg-white flex items-center rounded-md justify-between">
        <span className="flex flex-row gap-2 text-[12px] lg:text-[15px]">
          Student | <Image src="/home.svg" width={15} height={15} alt="public" /> New-student
        </span>

        <Link href="/#" passHref>
          <div className="h-[23px] w-[57px] bg-[#213458] flex items-center justify-center rounded-md">
            <Image src="/refresh.svg" width={16} height={16} alt="Refresh" />
          </div>
        </Link>
      </div>
      
      <div className="flex flex-row justify-between p-3">
        <h1 className="text-center text-2xl font-bold mb-8 mt-4 border-b-2">Trial Form</h1>
        <Button className="w-[180px] p-2" onClick={handleViewClick}>
          View 
        </Button>
      </div>

      {/* Form */}
      <form className="grid grid-cols-1 lg:grid-cols-3 gap-8" onSubmit={handleSubmit}>
        {/* Client (Student Name) */}
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

        {/* Phone */}
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

        {/* Number of Students */}
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

        {/* Programs */}
        <div>
          <label htmlFor="programs" className="block text-sm font-medium text-gray-700">
            Programs
          </label>
          <ProgramDropdown onSelect={handleProgramSelect} />
        </div>

        {/* Status */}
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

        {/* Assigned By */}
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
            {Array.isArray(users) && users.length > 0 ? (
              users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.username}
                </option>
              ))
            ) : (
              <option value="">No users available</option>
            )}
          </select>
        </div>

        {/* Handled By */}
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

        {/* Submit Button */}
        <div className="lg:col-span-3 flex justify-center items-center space-x-4">
          <Button className="lg:h-[40px] h-[40px] flex justify-center items-center px-6 py-2 bg-[#213458] text-white font-medium rounded hover:bg-blue-500">
            Submit
          </Button>
        </div>
      </form>
    </div>
  );
};

export default Page;
