'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation'; // Added useSearchParams to extract the id
import Link from 'next/link';
import Image from 'next/image';
import Button from '@/components/Button';
import ProgramDropdown from '@/components/programDropdown';
import axios from 'axios'; // Importing axios

const Page = () => {
  const router = useRouter();
  const searchParams = useSearchParams(); // Use this to get the dynamic id from the URL
  const id = searchParams.get("id"); // Extract the ID from the query string

  const [formData, setFormData] = useState({
    client: '',
    phone: '',
    number_student: 1,
    programs: [] as number[], 
    status: 'Active', 
    assign_by: 1, 
    handle_by: [] as number[],
  });
  useEffect(() => {
    const fetchStudentData = async () => {
      if (id) {
        try {
          const response = await axios.get(`http://127.0.0.1:8000/api/academics/student_trail/${id}/`);
          setFormData(response.data); // Pre-fill the form with existing data
        } catch (error) {
          console.error('Error fetching student data:', error);
          alert('Failed to fetch student data.');
        }
      }
    };
    fetchStudentData();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    // Handle comma-separated lists for programs and handle_by
    if (name === 'programs' || name === 'handle_by') {
      const values = value.split(',').map(Number); // Convert comma-separated strings to numbers
      setFormData({ ...formData, [name]: values });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Handle form submission (update existing student)
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await axios.put(`http://127.0.0.1:8000/api/academics/student_trail/${id}/`, formData);
      
      if (response.status === 200) {
        alert('Student information updated successfully!');
        router.push('/student/trial-student'); // Redirect to another page after successful update
      } else {
        alert('Failed to update student information.');
      }
    } catch (error) {
      console.error('Error updating the form:', error);
      alert('Error updating the form.');
    }
  };

  return (
    <div className="lg:ml-[219px] mt-20 ml-[25px] flex flex-col">
      {/* Header Section */}
      <div className="lg:w-[1060px] w-[330px] h-[40px] p-4 bg-white flex items-center rounded-md justify-between">
        <span className="flex flex-row gap-2 text-[12px] lg:text-[15px]">
          Student | <Image src="/home.svg" width={15} height={15} alt="public" /> Edit-student
        </span>

        <Link href="/#" passHref>
          <div className="h-[23px] w-[57px] bg-[#213458] flex items-center justify-center rounded-md">
            <Image src="/refresh.svg" width={16} height={16} alt="Refresh" />
          </div>
        </Link>
      </div>
      
      <div className='flex flex-row justify-between p-3'>
        <h1 className="text-center text-2xl font-bold mb-8 mt-4 border-b-2">Update Trial Form</h1>
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
            className="mt-1 block lg:w-[272px] w-[329px]  p-2 rounded-md outline-none border-gray-300 shadow-sm"
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
            className="mt-1 block lg:w-[272px] w-[329px]  p-2 rounded-md outline-none border-gray-300 shadow-sm"
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
            className="mt-1 block lg:w-[272px] w-[329px]  p-2 rounded-md outline-none border-gray-300 shadow-sm"
            required
          />
        </div>

        {/* Programs */}
        <div>
          <label htmlFor="programs" className="block text-sm font-medium text-gray-700">
            Programs
          </label>
          <ProgramDropdown />
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
            className="mt-1 block lg:w-[272px] w-[329px]  p-2 rounded-md outline-none border-gray-300 shadow-sm"
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
            <option value="Pending">Pending</option>
            <option value="Completed">Completed</option>
          </select>
        </div>

        {/* Assign By */}
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

        {/* Handle By */}
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
            className="mt-1 block lg:w-[272px] w-[329px]  p-2 rounded-md outline-none border-gray-300 shadow-sm"
          />
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
