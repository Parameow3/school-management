'use client'
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter, useSearchParams } from 'next/navigation';  // To get the dynamic course ID from the URL

const EditCoursePage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const courseId = searchParams.get('id');  // Get the dynamic ID from the URL

  const [formData, setFormData] = useState({
    name: '',
    code: '',
    description: '',
    credits: '',
    program: '',  // Default is empty, user must select a program
    school: 1     // Default to school 1, adjust based on available schools
  });

  const [programs, setPrograms] = useState([]);  // To store available programs
  const [loading, setLoading] = useState(true); // For handling loading state for programs
  const [error, setError] = useState<string | null>(null); // For handling errors

  // Fetch the course data and available programs when the component mounts
  useEffect(() => {
    const fetchCourseAndPrograms = async () => {
      try {
        if (courseId) {
          // Fetch the course details if editing (when courseId is present)
          const courseResponse = await axios.get(`http://127.0.0.1:8000/api/academics/course/${courseId}/`);
          const courseData = courseResponse.data;

          console.log('Fetched Course Data:', courseData);  // Debugging to check if the data is fetched
          
          setFormData({
            name: courseData.name || '',
            code: courseData.code || '',
            description: courseData.description || '',
            credits: courseData.credits || '',
            program: courseData.program || '',  // Assuming program is an ID
            school: courseData.school || 1,     // Assuming school is an ID
          });
        }

        // Fetch the available programs
        const programResponse = await axios.get('http://127.0.0.1:8000/api/academics/program/?page=1');
        setPrograms(programResponse.data.results);
        setLoading(false);  // Data loaded successfully, stop loading
      } catch (error:any) {
        console.error("Error fetching programs or course data:", error);
        setError("Failed to load data");
        setLoading(false);  // Stop loading if error occurs
      }
    };
    fetchCourseAndPrograms();
  }, [courseId]);  // This runs when `courseId` changes

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
      // PUT request to update the course with the correct payload structure
      const response = await axios.put(`http://127.0.0.1:8000/api/academics/course/${courseId}/`, {
        name: formData.name,
        code: formData.code,
        description: formData.description,
        credits: Number(formData.credits),  // Ensure credits is a number
        program: Number(formData.program),  // Ensure program ID is a number
        school: Number(formData.school),    // Ensure school ID is a number
      });
      console.log("Course Updated:", response.data);
      alert("Course Updated Successfully");
      router.push('/course/all');  // Redirect after successful update
    } catch (error) {
      console.error("Error updating the course:", error);
      alert("Failed to update the course");
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
              value={formData.name}  // Pre-fill value
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
              value={formData.code}  // Pre-fill value
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
              value={formData.description}  // Pre-fill value
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
              value={formData.credits}  // Pre-fill value
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded-md"
              placeholder="Enter number of credits"
            />
          </div>

          {/* Program (Dropdown) */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Program</label>
            {loading ? (
              <p>Loading programs...</p>
            ) : error ? (
              <p>{error}</p>
            ) : (
              <select
                name="program"
                value={formData.program}  // Pre-fill value
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
              value={formData.school}  // Pre-fill value
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
            Update Course
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditCoursePage;
