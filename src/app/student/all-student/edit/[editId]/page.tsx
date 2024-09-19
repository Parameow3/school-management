'use client';
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import Button from '@/components/Button';
import axios from 'axios';
import Dropdown from '@/components/Dropdown';

interface Student {
  id: number;
  first_name: string; // Changed to snake_case to match backend
  last_name: string;
  age: number;
  gender: string;
  admission_date: string; // Changed to match backend
  class: string;
  dob: string; // Date of birth
  address: string;
  pob: string; // Place of birth, changed from placeOfBirth
  nationality: string;
  student_passport: string;
  father_name: string;
  father_occupation: string;
  father_phone: string;
  mother_name: string;
  mother_occupation: string;
  mother_phone: string;
  parent_contact: string;
  profile_picture: string;
  belt_level: string; // Changed to match backend
}

const Page = () => {
  const params = useParams();
  const id = parseInt(params.editId as string, 10);

  const [formData, setFormData] = useState<Student | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/academics/students/${id}/`);
        setFormData(response.data); // Populate form with fetched student data
        setIsLoading(false);
      } catch (err) {
        setError("Failed to load student data");
        setIsLoading(false);
      }
    };

    fetchStudent();
  }, [id]);

  if (!formData) {
    return <div className="text-center mt-20">Student not found</div>;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({ ...prevFormData!, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prevFormData) => ({ ...prevFormData!, profile_picture: file.name }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await axios.put(`http://127.0.0.1:8000/api/academics/students/${id}/`, formData);
      alert("Student updated successfully");
    } catch (error) {
      console.error("Failed to update student", error);
      alert("Failed to update student");
    }
  };

  return (
    <div className="lg:ml-[219px] mt-20 flex flex-col">
      <div className="lg:w-[1079px] w-[330px] h-[40px] p-4 bg-white flex items-center rounded-md justify-between">
        <span className="flex flex-row gap-2 text-[12px] lg:text-[16px]">
          Student | <Image src={"/home.svg"} width={15} height={15} alt="public" /> - Update Student
        </span>
        <Link href={"/#"} passHref>
          <div className="h-[23px] w-[57px] bg-[#213458] flex items-center justify-center rounded-md">
            <Image src={"/refresh.svg"} width={16} height={16} alt="Refresh" />
          </div>
        </Link>
      </div>
      <h1 className="text-center lg:text-2xl text-[16px] font-bold mb-8 mt-4 lg:mt-2 border-b-2">
        Edit Information Student Form
      </h1>
      <form className="space-y-8" onSubmit={handleSubmit}>
        {/* Student Information */}
        <section>
          <h2 className="text-2xl font-bold mb-8 lg:mt-4 border-b-2">Student Information</h2>
          <div className="grid lg:grid-cols-3 flex-col gap-8">
            <div>
              <label htmlFor="first_name" className="block text-sm font-medium text-gray-700">First Name:</label>
              <input
                type="text"
                id="first_name"
                name="first_name"
                value={formData?.first_name || ''}
                onChange={handleChange}
                className="mt-1 block lg:w-[272px] w-[329px] h-[40px] rounded-md outline-none border-gray-300 shadow-sm bg-white text-black"
              />
            </div>

            <div>
              <label htmlFor="last_name" className="block text-sm font-medium text-gray-700">Last Name:</label>
              <input
                type="text"
                id="last_name"
                name="last_name"
                value={formData?.last_name || ''}
                onChange={handleChange}
                className="mt-1 block lg:w-[272px] w-[329px] h-[40px] rounded-md outline-none border-gray-300 shadow-sm bg-white text-black"
              />
            </div>

            <div>
              <label htmlFor="age" className="block text-sm font-medium text-gray-700">Age:</label>
              <input
                type="text"
                id="age"
                name="age"
                value={formData?.age || ''}
                onChange={handleChange}
                className="mt-1 block lg:w-[272px] w-[329px] h-[40px] rounded-md outline-none border-gray-300 shadow-sm"
              />
            </div>

            <div>
              <label htmlFor="gender" className="block text-sm font-medium text-gray-700">Gender:</label>
              <select
                id="gender"
                name="gender"
                value={formData?.gender || ''}
                onChange={handleChange}
                className="mt-1 block lg:w-[272px] w-[329px] h-[40px] rounded-md outline-none border-gray-300 shadow-sm"
              >
                <option value="Female">Female</option>
                <option value="Male">Male</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label htmlFor="admission_date" className="block text-sm font-medium text-gray-700">Admission Date:</label>
              <input
                type="date"
                id="admission_date"
                name="admission_date"
                value={formData?.admission_date || ''}
                onChange={handleChange}
                className="mt-1 block lg:w-[272px] w-[329px] h-[40px] rounded-md outline-none border-gray-300 shadow-sm"
              />
            </div>

            <div>
              <label htmlFor="class" className="block text-sm font-medium text-gray-700">Class:</label>
              <input
                type="text"
                id="class"
                name="class"
                value={formData?.class || ''}
                onChange={handleChange}
                className="mt-1 block lg:w-[272px] w-[329px] h-[40px] rounded-md outline-none border-gray-300 shadow-sm"
              />
            </div>

            <div>
              <label htmlFor="branch" className="block text-sm font-medium text-gray-700">Branch:</label>
              <Dropdown onChange={(value: number) => setFormData((prev) => prev && { ...prev, branch: value })} />
            </div>
          </div>
        </section>

        {/* Other Information */}
        <section>
          <h2 className="text-2xl font-bold mb-8 mt-4 border-b-2">Other Information</h2>
          <div className="grid lg:grid-cols-3 flex-col gap-8">
            <div>
              <label htmlFor="dob" className="block text-sm font-medium text-gray-700">Date of Birth:</label>
              <input
                type="date"
                id="dob"
                name="dob"
                value={formData?.dob || ''}
                onChange={handleChange}
                className="mt-1 block lg:w-[272px] w-[329px] h-[40px] outline-none rounded-md border-gray-300 shadow-sm"
              />
            </div>

            <div>
              <label htmlFor="nationality" className="block text-sm font-medium text-gray-700">Nationality:</label>
              <input
                type="text"
                id="nationality"
                name="nationality"
                value={formData?.nationality || ''}
                onChange={handleChange}
                className="mt-1 block lg:w-[272px] w-[329px] h-[40px] rounded-md outline-none border-gray-300 shadow-sm"
              />
            </div>

            <div>
              <label htmlFor="pob" className="block text-sm font-medium text-gray-700">Place of Birth:</label>
              <input
                type="text"
                id="pob"
                name="pob"
                value={formData?.pob || ''}
                onChange={handleChange}
                className="mt-1 block lg:w-[272px] w-[329px] h-[40px] rounded-md outline-none border-gray-300 shadow-sm"
              />
            </div>

            <div>
              <label htmlFor="belt_level" className="block text-sm font-medium text-gray-700">Belt Level:</label>
              <input
                type="text"
                id="belt_level"
                name="belt_level"
                value={formData?.belt_level || ''}
                onChange={handleChange}
                className="mt-1 block lg:w-[272px] w-[329px] h-[40px] rounded-md outline-none border-gray-300 shadow-sm"
              />
            </div>

            <div>
              <label htmlFor="student_passport" className="block text-sm font-medium text-gray-700">Student Passport:</label>
              <input
                type="text"
                id="student_passport"
                name="student_passport"
                value={formData?.student_passport || ''}
                onChange={handleChange}
                className="mt-1 block lg:w-[272px] w-[329px] h-[40px] rounded-md outline-none border-gray-300 shadow-sm"
              />
            </div>

            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address:</label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData?.address || ''}
                onChange={handleChange}
                className="mt-1 block lg:w-[272px] w-[329px] h-[40px] rounded-md outline-none border-gray-300 shadow-sm"
              />
            </div>
          </div>
        </section>

        {/* Contact Information */}
        <section>
          <h2 className="text-xl font-semibold mb-4 border-b-2">Contact Information</h2>
          <div className="grid lg:grid-cols-3 flex-col gap-8">
            <div>
              <label htmlFor="father_name" className="block text-sm font-medium text-gray-700">Father's Name:</label>
              <input
                type="text"
                id="father_name"
                name="father_name"
                value={formData?.father_name || ''}
                onChange={handleChange}
                className="mt-1 block lg:w-[272px] w-[329px] h-[40px] outline-none rounded-md border-gray-300 shadow-sm"
              />
            </div>

            <div>
              <label htmlFor="father_occupation" className="block text-sm font-medium text-gray-700">Father's Occupation:</label>
              <input
                type="text"
                id="father_occupation"
                name="father_occupation"
                value={formData?.father_occupation || ''}
                onChange={handleChange}
                className="mt-1 block lg:w-[272px] w-[329px] h-[40px] outline-none rounded-md border-gray-300 shadow-sm"
              />
            </div>
            <div>
              <label htmlFor="mother_name" className="block text-sm font-medium text-gray-700">Mother's Name:</label>
              <input
                type="text"
                id="mother_name"
                name="mother_name"
                value={formData?.mother_name || ''}
                onChange={handleChange}
                className="mt-1 block lg:w-[272px] w-[329px] h-[40px] outline-none rounded-md border-gray-300 shadow-sm"
              />
            </div>

            <div>
              <label htmlFor="mother_occupation" className="block text-sm font-medium text-gray-700">Mother's Occupation:</label>
              <input
                type="text"
                id="mother_occupation"
                name="mother_occupation"
                value={formData?.mother_occupation || ''}
                onChange={handleChange}
                className="mt-1 block lg:w-[272px] w-[329px] h-[40px] outline-none rounded-md border-gray-300 shadow-sm"
              />
            </div>

            <div>
              <label htmlFor="parent_contact" className="block text-sm font-medium text-gray-700">Parent Contact:</label>
              <input
                type="text"
                id="parent_contact"
                name="parent_contact"
                value={formData?.parent_contact || ''}
                onChange={handleChange}
                className="mt-1 block lg:w-[272px] w-[329px] h-[40px] outline-none rounded-md border-gray-300 shadow-sm"
              />
            </div>
          </div>
        </section>

        {/* Form Actions */}
        <div className="flex justify-center items-center space-x-4">
          <Button bg="secondary">Cancel</Button>
          <Button>Submit</Button>
        </div>
      </form>
    </div>
  );
};

export default Page;
