'use client'; // Next.js directive for client-side code
import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';

const Page = () => {
  const router = useRouter();
  const { editId } = useParams(); // Fetch the exam ID from the URL

  // State to store form input values
  const [formData, setFormData] = useState({
    student_id: '',
    student_name: '',
    class_id: '',
    status: '',
    class_name: '',
    date: '',
    notes: '',
    status_display: ''
  });

  // State to store the list of class instances and courses fetched from the API
  const [students, setStudents] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [date, setDate] = useState<string>(""); // Store the selected date
  const [status, setStatus] = useState<string>("present"); // Store the selected status
  const [notes, setNotes] = useState<string>(""); // Store notes




  // Fetch class instances and courses, and also fetch exam data by ID
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    
    if (token) {
      // Fetch Class Instances
      fetch('http://127.0.0.1:8000/api/academics/students/', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      .then(response => response.json())
      .then(data => {
        console.log(data)
        setStudents(data.results || []);
      })
      .catch(error => console.error('Error fetching class instances:', error));

      // Fetch Courses
      fetch('http://127.0.0.1:8000/api/academics/classroom/', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      .then(response => response.json())
      .then(data => {
        console.log(data)
        setCourses(data.results || []);
      })
      .catch(error => console.error('Error fetching courses:', error));
      console.log(editId)
      // Fetch Exam Data to pre-fill the form
      fetch(`http://127.0.0.1:8000/api/academics/attendances/${editId}/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      .then(response => response.json())
      .then(data => {

        console.log(data)
        setFormData({
          student_id: data.student_id,
          student_name: data.student_name,
          class_id: data.class_id,
          status: data.status_display,
          class_name: data.class_name,
          date: data.date,
          notes: data.notes,
          status_display: data.status_display
        });
      })
      .catch(error => console.error('Error fetching exam details:', error));
    }
  }, [editId]); // Dependencies include exam ID so it refetches when ID changes

  // Handle form input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    console.log(formData)
    console.log(e.target.name)
    console.log(e.target.value  )
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    formData.status = formData.status.toLowerCase();

    try {
      // Making PUT request to the API for updating the exam
      console.log(formData)
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/academics/attendances/${editId}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
        body: JSON.stringify(formData),
      });
      console.log(formData)
      // Check for a successful response
      if (response.ok) {
        console.log('Exam updated successfully');
        router.push('/attendance/student');
      } else {
        console.error('Failed to update exam');
      }
    } catch (error) {
      console.error('Error occurred while updating exam:', error);
    }
  };

  return (
    <div className="lg:ml-[36%] ml-[11%] mt-20 p-8 bg-gray-50 rounded-lg shadow-lg max-w-lg mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 text-center">Update Attendance</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-gray-600 font-medium mb-1">Class</label>
          <select
            name="class_id"
            value={formData.class_id}
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
          <label className="block text-gray-600 font-medium mb-1">Student</label>
          <select
            name="student_id"
            value={formData.student_id}
            onChange={handleChange}
            className="border border-gray-300 rounded-md px-4 py-2 w-full focus:ring-2 focus:ring-blue-400 outline-none"
            required
          >
            <option value="" disabled>Select class instance</option>
            {students.length > 0 ? (
              students.map((student) => (
                <option key={student.id} value={student.id}>
                  {student.first_name} {student.last_name}
                </option>
              ))
            ) : (
              <option value="">No class instances available</option>
            )}
          </select>
        </div>

        <div>
          <label className="block text-gray-600 font-medium mb-1">Exam Date</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="border border-gray-300 rounded-md px-4 py-2 w-full focus:ring-2 focus:ring-blue-400 outline-none"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:1 gap-4">
            <div className="flex flex-col lg:w-1/3">
                <label
                htmlFor="status"
                className="text-sm font-medium text-gray-700"
                >
                Status (required)
                </label>
                <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full h-[40px] p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                <option value={formData.status}>{formData.status}</option>
                <option value="present">Present</option>
                <option value="absent">Absent</option>
                <option value="late">Late</option>
                </select>
            </div>
         
        </div>

          <div>
          <label className="block text-gray-600 font-medium mb-1">Note</label>
          <input
            type="text"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            className="border border-gray-300 rounded-md px-4 py-2 w-full focus:ring-2 focus:ring-blue-400 outline-none"
            placeholder="Enter exam description"
            required
          />
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
