"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";

interface Course {
  id: number;
  name: string;
}

interface Teacher {
  username: string;
  id: number;
}

const Page = () => {
  const [isMounted, setIsMounted] = useState(false);
  const [formData, setFormData] = useState({
    className: "",
    course: "", // Updated to course
    teacher: "",
    credit: "",
    start_date: "",
    end_date: "",
  });
  const [courses, setCourses] = useState<Course[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);

  const [loadingCourses, setLoadingCourses] = useState(true);
  const [loadingTeachers, setLoadingTeachers] = useState(true);
  const [errorCourses, setErrorCourses] = useState<string | null>(null);
  const [errorTeachers, setErrorTeachers] = useState<string | null>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Fetch courses and teachers
  useEffect(() => {
    if (isMounted) {
      const fetchTeachers = async () => {
        try {
          const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/user`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
          });
          const teacherUsers = response.data.results.filter((user: any) => user.roles_name === "teacher");
          setTeachers(teacherUsers);
          setLoadingTeachers(false);
        } catch (err: any) {
          setErrorTeachers("Error loading teachers: " + err.message);
          setLoadingTeachers(false);
        }
      };

      const fetchCourses = async () => {
        try {
          const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/academics/course/`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
          });

          console.log("Courses API response:", response.data);

          if (response.data && Array.isArray(response.data)) {
            setCourses(response.data); // Set the courses to the state
          } else {
            console.error("Invalid courses data format:", response.data);
          }

          setLoadingCourses(false);
        } catch (err: any) {
          setErrorCourses("Error loading courses: " + err.message);
          setLoadingCourses(false);
        }
      };

      fetchTeachers();
      fetchCourses();
    }
  }, [isMounted]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const postData = {
      name: formData.className,
      courses: [parseInt(formData.course)], // Use course instead of program
      teacher: parseInt(formData.teacher),
      start_date: formData.start_date,
      end_date: formData.end_date,
    };

    // Console log the data
    console.log("Form Data Submitted:", postData);

    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/api/academics/classroom/`, postData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
      console.log("Response:", response.data);
      alert("Classroom created successfully!");
    } catch (error: any) {
      console.error("Error submitting the form:", error);
      if (error.response && error.response.data) {
        alert(`Error: ${error.response.data.detail || "An error occurred."}`);
      } else {
        alert("Failed to submit the form.");
      }
    }
  };

  if (!isMounted) {
    return <div>Loading...</div>;
  }

  return (
    <div className="lg:ml-[16%] ml-[11%] mt-20 flex flex-col">
      <div className="lg:w-[60%] w-[90%] mx-auto mt-10 p-6 bg-white rounded-lg shadow-md space-y-6">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">Class Form</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="flex flex-col">
            <label htmlFor="className" className="text-sm font-medium text-gray-700">Class Name</label>
            <input
              id="className"
              name="className"
              type="text"
              placeholder="Enter Class Name"
              className="w-full h-[40px] p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={handleChange}
            />
          </div>

          {/* Course Dropdown */}
          <div className="flex flex-col">
            <label htmlFor="course" className="text-sm font-medium text-gray-700">Course</label>
            <select
              id="course"
              name="course"
              className="w-full h-[40px] p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={handleChange}
            >
              <option value="">Select a course</option>
              {loadingCourses ? (
                <option>Loading courses...</option>
              ) : errorCourses ? (
                <option>{errorCourses}</option>
              ) : (
                courses.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.name}
                  </option>
                ))
              )}
            </select>
          </div>

          {/* Teacher Dropdown */}
          <div className="flex flex-col">
            <label htmlFor="teacher" className="text-sm font-medium text-gray-700">Teacher</label>
            {loadingTeachers ? (
              <span className="text-sm text-blue-500">Loading teachers...</span>
            ) : errorTeachers ? (
              <span className="text-sm text-red-500">{errorTeachers}</span>
            ) : (
              <select
                id="teacher"
                name="teacher"
                className="w-full h-[40px] p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                onChange={handleChange}
              >
                <option value="">Select a teacher</option>
                {teachers.map((teacher) => (
                  <option key={teacher.id} value={teacher.id}>
                    {teacher.username}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div className="flex flex-col">
            <label htmlFor="credit" className="text-sm font-medium text-gray-700">Credit</label>
            <input type="text" name="credit" id="credit" onChange={handleChange} className="w-full h-[40px] border p-2" />
          </div>

          <div className="flex flex-col">
            <label htmlFor="startDate" className="text-sm font-medium text-gray-700">Start Date</label>
            <input
              id="startDate"
              name="start_date"
              type="date"
              className="w-full h-[40px] p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={handleChange}
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="endDate" className="text-sm font-medium text-gray-700">End Date</label>
            <input
              id="endDate"
              name="end_date"
              type="date"
              className="w-full h-[40px] p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="flex justify-center mt-6">
          <button
            onClick={handleSubmit}
            className="px-8 py-3 bg-[#213458] text-white font-semibold rounded-md hover:bg-[#213498] transition duration-300"
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
};

export default Page;
