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
    course: "",
    teacher: "",
    credit: "",
    start_date: "",
    end_date: "",
    students: [""], // Initializing with an empty student input
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

  useEffect(() => {
    if (isMounted) {
      const fetchTeachers = async () => {
        try {
          const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/user`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
          });
          const teacherUsers = response.data.results.filter(
            (user: any) => user.roles_name === "teacher"
          );
          
          setTeachers(teacherUsers);
        } catch (err: any) {
          const errorMessage = err.response?.data?.detail || err.message;
          setErrorTeachers(`Error loading teachers: ${errorMessage}`);
        } finally {
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
          if (Array.isArray(response.data)) {
            setCourses(response.data);
          }
        } catch (err: any) {
          const errorMessage = err.response?.data?.detail || err.message;
          setErrorCourses(`Error loading courses: ${errorMessage}`);
        } finally {
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

  const handleStudentChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const newStudents = [...formData.students];
    newStudents[index] = e.target.value;
    setFormData({
      ...formData,
      students: newStudents,
    });
  };

  const handleAddStudent = () => {
    setFormData({
      ...formData,
      students: [...formData.students, ""],
    });
  };

  const handleRemoveStudent = (index: number) => {
    const newStudents = formData.students.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      students: newStudents,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (!formData.className || !formData.course || !formData.teacher || !formData.start_date || !formData.end_date) {
      alert("Please fill in all required fields.");
      return;
    }
  
    if (isNaN(parseInt(formData.credit))) {
      alert("Credit must be a numeric value.");
      return;
    }
  
    const startDate = new Date(formData.start_date);
    const endDate = new Date(formData.end_date);
  
    if (startDate >= endDate) {
      alert("Start date must be earlier than end date.");
      return;
    }
  
    const studentIDs = formData.students
      .map((student) => parseInt(student))
      .filter((id) => !isNaN(id));
  
    const postData = {
      name: formData.className,
      courses: [parseInt(formData.course)],
      teacher: parseInt(formData.teacher),
      credit: parseInt(formData.credit),
      start_date: formData.start_date,
      end_date: formData.end_date,
      student: studentIDs,
    };
  
    console.log("Submitting data:", postData);
  
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/api/academics/classroom/`, postData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
      console.log("Server Response:", response.data);
      alert("Classroom created successfully!");
    } catch (error: any) {
      // Enhanced logging for backend error
      const errorMessage = error.response?.data?.detail || error.message || "An unknown error occurred.";
      const errorData = error.response?.data;
      console.error("Error submitting the form:", errorMessage);
      console.error("Full response data:", errorData);
      
      // Displaying specific error details
      alert(`Error: ${errorMessage}. Details: ${JSON.stringify(errorData)}`);
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
            <input
              id="credit"
              name="credit"
              type="text"
              placeholder="Enter Credit"
              className="w-full h-[40px] p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={handleChange}
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="start_date" className="text-sm font-medium text-gray-700">Start Date</label>
            <input
              id="start_date"
              name="start_date"
              type="date"
              className="w-full h-[40px] p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={handleChange}
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="end_date" className="text-sm font-medium text-gray-700">End Date</label>
            <input
              id="end_date"
              name="end_date"
              type="date"
              className="w-full h-[40px] p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={handleChange}
            />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700">Students</label>
          {formData.students.map((student, index) => (
            <div key={index} className="flex items-center mt-2">
              <input
                type="text"
                placeholder="Enter Student ID"
                className="w-full h-[40px] p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={student}
                onChange={(e) => handleStudentChange(e, index)}
              />
              {index > 0 && (
                <button
                  type="button"
                  className="ml-2 text-red-500"
                  onClick={() => handleRemoveStudent(index)}
                >
                  Remove
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            className="mt-2 px-4 py-2 text-blue-500"
            onClick={handleAddStudent}
          >
            Add Student
          </button>
        </div>

        <button
          type="submit"
          onClick={handleSubmit}
          className="w-full mt-6 px-4 py-2 bg-blue-500 text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default Page;
