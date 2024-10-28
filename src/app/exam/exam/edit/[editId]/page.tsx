'use client'; // Next.js directive for client-side code
import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';

const Page = () => {
  const router = useRouter();
  const { id } = useParams(); // Fetch the exam ID from the URL

  // State to store form input values
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    exam_date: '',
    start_time: '',
    end_time: '',
    course: '',
    class_instance: ''
  });

  // State to store the list of class instances and courses fetched from the API
  const [classInstances, setClassInstances] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);

  // Fetch class instances and courses, and also fetch exam data by ID
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    
    if (token) {
      // Fetch Class Instances
      fetch('http://127.0.0.1:8000/api/academics/classroom/', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      .then(response => response.json())
      .then(data => {
        setClassInstances(data.results || []);
      })
      .catch(error => console.error('Error fetching class instances:', error));

      // Fetch Courses
      fetch('http://127.0.0.1:8000/api/academics/course/', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      .then(response => response.json())
      .then(data => {
        setCourses(data || []);
      })
      .catch(error => console.error('Error fetching courses:', error));

      // Fetch Exam Data to pre-fill the form
      fetch(`http://127.0.0.1:8000/api/academics/exams/${id}/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      .then(response => response.json())
      .then(data => {
        setFormData({
          title: data.title,
          description: data.description,
          exam_date: data.exam_date,
          start_time: data.start_time,
          end_time: data.end_time,
          course: data.course,
          class_instance: data.class_instance,
        });
      })
      .catch(error => console.error('Error fetching exam details:', error));
    }
  }, [id]); // Dependencies include exam ID so it refetches when ID changes

  // Handle form input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      // Making PUT request to the API for updating the exam
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/academics/exams/${id}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
        body: JSON.stringify(formData),
      });

      // Check for a successful response
      if (response.ok) {
        console.log('Exam updated successfully');
        router.push('/exam/exam');
      } else {
        console.error('Failed to update exam');
      }
    } catch (error) {
      console.error('Error occurred while updating exam:', error);
    }
  };

  return (
    <div className="lg:ml-[36%] ml-[11%] mt-20 p-8 bg-gray-50 rounded-lg shadow-lg max-w-lg mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 text-center">Update Exam</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-gray-600 font-medium mb-1">Course</label>
          <select
            name="course"
            value={formData.course}
            onChange={handleChange}
            className="border border-gray-300 rounded-md px-4 py-2 w-full focus:ring-2 focus:ring-blue-400 outline-none"
            required
          >
            <option value="" disabled>Select course</option>
            {courses.length > 0 ? (
              courses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.name}
                </option>
              ))
            ) : (
              <option value="">No courses available</option>
            )}
          </select>
        </div>

        <div>
          <label className="block text-gray-600 font-medium mb-1">Class Instance</label>
          <select
            name="class_instance"
            value={formData.class_instance}
            onChange={handleChange}
            className="border border-gray-300 rounded-md px-4 py-2 w-full focus:ring-2 focus:ring-blue-400 outline-none"
            required
          >
            <option value="" disabled>Select class instance</option>
            {classInstances.length > 0 ? (
              classInstances.map((instance) => (
                <option key={instance.id} value={instance.id}>
                  {instance.name}
                </option>
              ))
            ) : (
              <option value="">No class instances available</option>
            )}
          </select>
        </div>

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
          <label className="block text-gray-600 font-medium mb-1">Description</label>
          <input
            type="text"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="border border-gray-300 rounded-md px-4 py-2 w-full focus:ring-2 focus:ring-blue-400 outline-none"
            placeholder="Enter exam description"
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
            className="bg-[#213458] text-white px-6 py-2 rounded-md hover:bg-[#213498] transition-transform duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50 transform hover:scale-105"
          >
            Update Exam
          </button>
        </div>
      </form>
    </div>
  );
};

export default Page;
