"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

interface Course {
  id: number;
  name: string;
}

interface Teacher {
  username: string;
  id: number;
}

interface Student {
  id: number;
  first_name: string;
}

const Page: React.FC = () => {
  const router = useRouter();
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
  const [students, setStudents] = useState<Student[]>([]);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [loadingTeachers, setLoadingTeachers] = useState(true);
  const [loadingStudents, setLoadingStudents] = useState(true);

  const [errorCourses, setErrorCourses] = useState<string | null>(null);
  const [errorTeachers, setErrorTeachers] = useState<string | null>(null);
  const [errorStudents, setErrorStudents] = useState<string | null>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted) {
      const fetchTeachers = async () => {
        try {
          const response = await axios.get(
            `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/user`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("authToken")}`,
              },
            }
          );
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
          const response = await axios.get(
            `${process.env.NEXT_PUBLIC_BASE_URL}/api/academics/course/`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("authToken")}`,
              },
            }
          );
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

      const fetchStudents = async () => {
        try {
          const response = await axios.get(
            `${process.env.NEXT_PUBLIC_BASE_URL}/api/academics/students/`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("authToken")}`,
              },
            }
          );
          if (response.data && Array.isArray(response.data.results)) {
            setStudents(response.data.results);
          } else {
            throw new Error("Invalid student data format");
          }
        } catch (err: any) {
          const errorMessage = err.response?.data?.detail || err.message;
          setErrorStudents(`Error loading students: ${errorMessage}`);
        } finally {
          setLoadingStudents(false);
        }
      };

      fetchTeachers();
      fetchCourses();
      fetchStudents();
    }
  }, [isMounted]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleStudentChange = (
    e: React.ChangeEvent<HTMLSelectElement>,
    index: number
  ) => {
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

    if (
      !formData.className ||
      !formData.course ||
      !formData.teacher ||
      !formData.start_date ||
      !formData.end_date
    ) {
      alert("Please fill in all required fields.");
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
      start_date: formData.start_date,
      end_date: formData.end_date,
      student: studentIDs, // Adjusted field name to match API requirement
    };

    // Debugging logs
    console.log("Form Data:", formData);
    console.log("Post Data:", postData);
    console.log("Auth Token:", localStorage.getItem("authToken"));
    console.log(
      "API URL:",
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/academics/classroom/`
    );

    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/academics/classroom/`,
        postData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );

      alert("Classroom created successfully!");
      router.push("/class/all-class");
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.detail ||
        error.message ||
        "An unknown error occurred.";
      alert(`Error: ${errorMessage}`);
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
          {/* Class Name */}
          <div className="flex flex-col">
            <label htmlFor="className" className="text-sm font-medium text-gray-700">
              Class Name
            </label>
            <input
              id="className"
              name="className"
              type="text"
              placeholder="Enter Class Name"
              className="w-full h-[40px] p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={handleChange}
            />
          </div>

          {/* Course Selection */}
          <div className="flex flex-col">
            <label htmlFor="course" className="text-sm font-medium text-gray-700">
              Course
            </label>
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

          {/* Teacher Selection */}
          <div className="flex flex-col">
            <label htmlFor="teacher" className="text-sm font-medium text-gray-700">
              Teacher
            </label>
            <select
              id="teacher"
              name="teacher"
              className="w-full h-[40px] p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={handleChange}
            >
              <option value="">Select a teacher</option>
              {loadingTeachers ? (
                <option>Loading teachers...</option>
              ) : errorTeachers ? (
                <option>{errorTeachers}</option>
              ) : (
                teachers.map((teacher) => (
                  <option key={teacher.id} value={teacher.id}>
                    {teacher.username}
                  </option>
                ))
              )}
            </select>
          </div>

          {/* Start Date */}
          <div className="flex flex-col">
            <label htmlFor="start_date" className="text-sm font-medium text-gray-700">
              Start Date
            </label>
            <input
              id="start_date"
              name="start_date"
              type="date"
              className="w-full h-[40px] p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={handleChange}
            />
          </div>

          {/* End Date */}
          <div className="flex flex-col">
            <label htmlFor="end_date" className="text-sm font-medium text-gray-700">
              End Date
            </label>
            <input
              id="end_date"
              name="end_date"
              type="date"
              className="w-full h-[40px] p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={handleChange}
            />
          </div>

          {/* Students */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700">Students</label>
            {loadingStudents ? (
              <span>Loading students...</span>
            ) : errorStudents ? (
              <span className="text-red-500">{errorStudents}</span>
            ) : students.length > 0 ? (
              formData.students.map((studentId, index) => (
                <div key={index} className="flex items-center mt-2">
                  <select
                    value={studentId}
                    onChange={(e) => handleStudentChange(e, index)}
                    className="w-full h-[40px] p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select a student</option>
                    {students.map((student) => (
                      <option key={student.id} value={student.id}>
                        {student.first_name}
                      </option>
                    ))}
                  </select>
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
              ))
            ) : (
              <span>No students available</span>
            )}
            <button
              type="button"
              className="mt-2 px-4 py-2 w-[132px] bg-[#213458] text-[#FFFFFF]"
              onClick={handleAddStudent}
            >
              Add Student
            </button>
          </div>
        </div>

        <div className="flex justify-center mt-6">
          <button
            type="submit"
            onClick={handleSubmit}
            className="w-[184px] px-4 py-2 bg-[#213458] text-white rounded flex justify-center items-center focus:outline-none focus:ring-2 focus:ring-[#214567]"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default Page;
