'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Button from '@/components/Button';
import ProgramDropdown from '@/components/programDropdown';
import { useRouter } from "next/navigation";
import axios from 'axios'; // Import Axios

const Page = () => {
  const router = useRouter();
  
  // State to store the token
  const [token, setToken] = useState<string | null>(null);

  // Fetch token from localStorage when the component mounts
  useEffect(() => {
    const tokenFromLocalStorage = localStorage.getItem("authToken");
    if (tokenFromLocalStorage) {
      setToken(tokenFromLocalStorage); // Set token in state
    } else {
      // Redirect to login if no token found
      router.push("/login");
    }
  }, [router]);

  const [formData, setFormData] = useState({
    client: '',
    phone: '',
    number_student: 1,
    programs: [] as number[], 
    status: 'Pending',  // Default to "Pending" as per your backend structure
    assign_by: 1, 
    handle_by: [] as number[],
  });

  // Function to update formData when programs are selected
  const handleProgramSelect = (selectedPrograms: number[]) => {
    setFormData((prevData) => ({ ...prevData, programs: selectedPrograms }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (name === 'handle_by') {
      // Convert comma-separated values to an array of numbers
      const values = value.split(',').map(Number); 
      setFormData({ ...formData, [name]: values });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleViewClick = () => {
    router.push(`/student/trial-student/view`);
  };

  // Handle form submission using Axios
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!token) {
      alert('Authorization token is missing. Please log in.');
      return;
    }
    console.log("Posting data:", formData);

    try {
      // Submit data using Axios, including token in the header
      const response = await axios.post('http://127.0.0.1:8000/api/academics/student_trail/', formData, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // Add token to Authorization header
        },
      });

      // Log the response after successful posting
      console.log("API Response:", response.data);

      if (response.status === 201) { // HTTP 201 Created
        alert('Trial information submitted successfully!');
      } else {
        alert('Failed to submit trial information.');
      }
    } catch (error: any) {
      console.error('Error submitting the form:', error);
      if (error.response && error.response.status === 403) {
        alert('Authorization error: 403 Forbidden. Please check your token.');
      } else {
        alert('Error submitting the form.');
      }
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
      
      <div className='flex flex-row justify-between p-3'>
        <h1 className="text-center text-2xl font-bold mb-8 mt-4 border-b-2">Trial Form</h1>
        <Button className='w-[180px] p-2' onClick={handleViewClick}>
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
            Assigned By (ID)
          </label>
          <input
            type="number"
            id="assign_by"
            name="assign_by"
            value={formData.assign_by}
            onChange={handleChange}
            className="mt-1 block lg:w-[272px] w-[329px] p-2 rounded-md outline-none border-gray-300 shadow-sm"
            required
          />
        </div>

        {/* Handled By */}
        <div>
          <label htmlFor="handle_by" className="block text-sm font-medium text-gray-700">
            Handled By
          </label>
          <input
            type="text"
            id="handle_by"
            name="handle_by"
            value={formData.handle_by.join(',')}
            onChange={handleChange}
            placeholder="e.g., 1,2,3"
            className="mt-1 block lg:w-[272px] w-[329px] p-2 rounded-md outline-none border-gray-300 shadow-sm"
          />
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
