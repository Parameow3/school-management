'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';  // For navigation

const EditCoursePage = ({ params }: { params: { id: string } }) => {
  const router = useRouter();
  const courseId = params.id;  // Get the dynamic ID from the URL

  const [formData, setFormData] = useState({
    name: '',
    code: '',
    description: '',
    credits: '',
    program: '',  // Default is empty
    school: 1     // Default to school 1
  });

  const [programs, setPrograms] = useState([]);  // To store available programs
  const [loading, setLoading] = useState(true);  // Loading state for programs
  const [error, setError] = useState<string | null>(null);  // Error handling

  useEffect(() => {
    console.log('Course ID:', courseId);  // For debugging

    const fetchCourseAndPrograms = async () => {
      try {
        // Fetch course data for the specific course using dynamic ID
        const courseResponse = await axios.get(`http://127.0.0.1:8000/api/academics/course/${courseId}/`);
        const courseData = courseResponse.data;

        setFormData({
          name: courseData.name || '',
          code: courseData.code || '',
          description: courseData.description || '',
          credits: courseData.credits.toString() || '',
          program: courseData.program.toString() || '',
          school: courseData.school || 1,
        });

        // Fetch available programs
        const programResponse = await axios.get('http://127.0.0.1:8000/api/academics/program/?page=1');
        setPrograms(programResponse.data.results);
        setLoading(false);
      } catch (error: any) {
        console.error('Error fetching course or program data:', error);
        setError('Failed to load data');
        setLoading(false);
      }
    };

    if (courseId) {
      fetchCourseAndPrograms();
    }
  }, [courseId]);  // Runs when courseId changes

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
      const response = await axios.put(`http://127.0.0.1:8000/api/academics/course/${courseId}/`, {
        name: formData.name,
        code: formData.code,
        description: formData.description,
        credits: Number(formData.credits),  // Convert to number
        program: Number(formData.program),  // Convert to number
        school: Number(formData.school),    // Convert to number
      });
      console.log('Course updated:', response.data);
      alert('Course updated successfully');
      router.push('/course/all');  // Redirect to courses list
    } catch (error) {
      console.error('Error updating the course:', error);
      alert('Failed to update the course');
    }
  };

  return (
    <div className='lg:ml-[16%] ml-[11%] mt-28 flex flex-col items-center justify-center'>
      <div className='w-[450px] h-auto bg-white p-6 rounded-md shadow-md'>
        <h2 className="text-xl font-bold mb-6">Edit Course</h2>
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

          {/* Program Dropdown */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Program</label>
            {loading ? (
              <p>Loading programs...</p>
            ) : error ? (
              <p>{error}</p>
            ) : (
              <select
                name="program"
                value={formData.program}
                onChange={handleChange}
                required
                className="mt-1 block w-full h-[40px] outline-none p-2 rounded-md border-gray-300 shadow-sm"
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

          {/* School Dropdown */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">School</label>
            <select
              name="school"
              value={formData.school}
              onChange={handleChange}
              required
              className="block w-[316px] h-[44px] px-3 py-2 rounded-lg border border-gray-300 shadow-sm"
            >
              <option value="1">School 1</option>
            </select>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-md"
          >
            Update Course
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditCoursePage;
