'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

interface School {
  id: number;
  name: string;
}

interface Program {
  id: number;
  name: string;
}

const Page = () => {
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    description: '',
    credits: '',
    program: '',
    school: '',
  });

  const router = useRouter();
  const [schools, setSchools] = useState<School[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loadingPrograms, setLoadingPrograms] = useState(true);
  const [loadingSchools, setLoadingSchools] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  useEffect(() => {
    const tokenFromLocalStorage = localStorage.getItem('authToken');
    if (tokenFromLocalStorage) {
      setToken(tokenFromLocalStorage);
    } else {
      router.push('/login');
    }
  }, [router]);
  useEffect(() => {
    if (token) {
      const fetchPrograms = async () => {
        try {
          const programResponse = await axios.get(
            `${process.env.NEXT_PUBLIC_BASE_URL}/api/academics/program`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          setPrograms(programResponse.data.results);
          setLoadingPrograms(false);
        } catch (err) {
          console.error('Error fetching programs:', err);
          setError('Failed to fetch programs.');
          setLoadingPrograms(false);
        }
      };
      fetchPrograms();
    }
  }, [token]);

  // Fetch schools data
  useEffect(() => {
    if (token) {
      const fetchSchools = async () => {
        try {
          const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/schools`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setSchools(response.data.results || []);
          setLoadingSchools(false);
        } catch (err: any) {
          console.error('Error fetching schools:', err.response?.data || err.message);
          setError('Failed to load schools.');
          setLoadingSchools(false);
        }
      };

      fetchSchools();
    }
  }, [token]);

  // Handle form change
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      alert('No authorization token found. Please log in again.');
      return;
    }
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/academics/course/`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log('Course Created:', response.data);
      alert('Course Created Successfully');
      router.push('/program/all-program');
    } catch (err) {
      console.error('Error creating the course:', err);
      alert('Failed to create the course');
    }
  };

  return (
    <div className="lg:ml-[16%] ml-[11%] mt-28 flex flex-col items-center justify-center">
      <div className="w-[450px] h-auto bg-white p-6 rounded-md shadow-md">
        <h2 className="text-xl font-bold mb-6">Create Course</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Course Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded-md"
              placeholder="Enter course name"
            />
          </div>

          {/* Course Code */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Course Code
            </label>
            <input
              type="text"
              name="code"
              value={formData.code}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded-md"
              placeholder="Enter course code"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <input
              type="text"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded-md"
              placeholder="Enter course description"
            />
          </div>

          {/* Credits */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Credits
            </label>
            <input
              type="number"
              name="credits"
              value={formData.credits}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded-md"
              placeholder="Enter number of credits"
            />
          </div>

          {/* Program (Dropdown) */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Program
            </label>
            {loadingPrograms ? (
              <p>Loading programs...</p>
            ) : error ? (
              <p>{error}</p>
            ) : (
              <select
                name="program"
                value={formData.program}
                onChange={handleChange}
                required
                className="mt-1 block w-full h-[40px] outline-none p-2 rounded-md border-gray-300 shadow-sm focus:border-[#213458] focus:ring-[#213458] sm:text-sm"
              >
                <option value="">Select a Program</option>
                {programs.map((program) => (
                  <option key={program.id} value={program.id}>
                    {program.name}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* School (Dropdown) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              School
            </label>
            {loadingSchools ? (
              <p>Loading schools...</p>
            ) : (
              <select
                name="school"
                value={formData.school}
                onChange={handleChange}
                required
                className="block w-[316px] h-[44px] px-3 py-2 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-[#213458] focus:border-[#213458]"
              >
                <option value="" disabled>Select a school</option>
                {schools.map((school) => (
                  <option key={school.id} value={school.id}>
                    {school.name}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-[#213458] hover:bg-blue-600 text-white py-2 rounded-md"
          >
            Create Course
          </button>
        </form>
      </div>
    </div>
  );
};

export default Page;
