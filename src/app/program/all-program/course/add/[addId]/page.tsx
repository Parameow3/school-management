'use client'
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Page = () => {
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    description: '',
    credits: '',
    program: '',  // Default is empty, user must select a program
    school: 1     // Default to school 1, adjust based on available schools
  });

  const [programs, setPrograms] = useState([]);  // To store available programs
  const [loadingPrograms, setLoadingPrograms] = useState(true); // For handling loading state for programs
  const [error, setError] = useState(null);  // For handling errors

  // Fetch programs when the component mounts
  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const programResponse = await axios.get('http://127.0.0.1:8000/api/academics/program/?page=1');
        setPrograms(programResponse.data.results);
        setLoadingPrograms(false);  // Data loaded successfully, stop loading
      } catch (error) {
        console.error("Error fetching programs:", error);
        setLoadingPrograms(false);  // Stop loading if error occurs
      }
    };
    fetchPrograms();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/academics/course/', formData);
      console.log("Course Created:", response.data);
      console.log("formData",formData)
      alert("Course Created Successfully");
    } catch (error) {
      console.error("Error creating the course:", error);
      alert("Failed to create the course");
    }
  };

  return (
    <div className='lg:ml-[16%] ml-[11%] mt-28 flex flex-col items-center justify-center'>
      <div className='w-[450px] h-auto bg-white p-6 rounded-md shadow-md'>
        <h2 className="text-xl font-bold mb-6">Create Course</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Course Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Course Name</label>
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
            <label className="block text-sm font-medium text-gray-700 mb-2">Course Code</label>
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
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
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
            <label className="block text-sm font-medium text-gray-700 mb-2">Credits</label>
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
            <label className="block text-sm font-medium text-gray-700">Program</label>
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
                className="mt-1 block w-full h-[40px] outline-none p-2 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              >
                <option value="">Select a Program</option>
                {programs.map((program: any) => (
                  <option key={program.id} value={program.id}>
                    {program.name}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* School (Dropdown) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">School</label>
            <select
              name="school"
              value={formData.school}
              onChange={handleChange}
              required
              className="block w-[316px] h-[44px] px-3 py-2 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="1">School 1</option>
              {/* Add more options here if needed */}
            </select>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-md"
          >
            Create Course
          </button>
        </form>
      </div>
    </div>
  );
};

export default Page;
