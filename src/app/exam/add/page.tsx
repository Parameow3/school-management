'use client'; // Next.js directive for client-side code
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

const CreateExamPage = () => {
  const router = useRouter(); // Router for redirection after creation

  // State to store form input values
  const [formData, setFormData] = useState({
    title: '',
    exam_date: '',
    start_time: '',
    end_time: ''
  });

  // Handle form input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      // Making POST request to the API
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/academics/exams/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`, // Fetching token from local storage
        },
        body: JSON.stringify(formData),
      });

      // Check for a successful response
      if (response.ok) {
        console.log('Exam created successfully');
        // Redirect to the exam page or route after successful creation
        router.push('/exam');
      } else {
        console.error('Failed to create exam');
      }
    } catch (error) {
      console.error('Error occurred while creating exam:', error);
    }
  };

  return (
    <div className="lg:ml-[16%] ml-[11%] mt-20 p-8 bg-gray-50 rounded-lg shadow-lg max-w-lg mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 text-center">Create New Exam</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-gray-600 font-medium mb-1">Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="border border-gray-300 rounded-md px-4 py-2 w-full focus:ring-2 focus:ring-blue-400 outline-none"
            placeholder="Enter exam title"
            required
          />
        </div>

        <div>
          <label className="block text-gray-600 font-medium mb-1">Exam Date</label>
          <input
            type="date"
            name="exam_date"
            value={formData.exam_date}
            onChange={handleChange}
            className="border border-gray-300 rounded-md px-4 py-2 w-full focus:ring-2 focus:ring-blue-400 outline-none"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-600 font-medium mb-1">Start Time</label>
            <input
              type="time"
              name="start_time"
              value={formData.start_time}
              onChange={handleChange}
              className="border border-gray-300 rounded-md px-4 py-2 w-full focus:ring-2 focus:ring-blue-400 outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-gray-600 font-medium mb-1">End Time</label>
            <input
              type="time"
              name="end_time"
              value={formData.end_time}
              onChange={handleChange}
              className="border border-gray-300 rounded-md px-4 py-2 w-full focus:ring-2 focus:ring-blue-400 outline-none"
              required
            />
          </div>
        </div>

        <div className="text-center">
          <button
            type="submit"
            className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition-transform duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50 transform hover:scale-105"
          >
            Create Exam
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateExamPage;
