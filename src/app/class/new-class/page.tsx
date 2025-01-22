"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";


interface Course {
  id: number;
  name: string;
}

interface Student {
  id: number;
  first_name : string
}

interface Teacher {
  username: string;
  id: number;
}

const Page = () => {
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();

  const [formData, setFormData] = useState({
    className: "",
    courses: [""],
    teacher: "",
    credit: "",
    start_date: "",
    end_date: "",
    students: [""], // Initializing with an empty student input
  });
  
  const [courses, setCourses] = useState<Course[]>([]);
  const [currentCourse, setCurrentCourse] = useState<string>(""); // Dropdown selection
  const [selectedCourses, setSelectedCourses] = useState<{ id: number; name: string }[]>([]);


  const [teachers, setTeachers] = useState<Teacher[]>([]);

  const [students, setStudents] = useState<Student[]>([]);
  const [currentStudent, setCurrentStudent] = useState<string>(""); // Dropdown selection
  const [selectedStudents, setSelectedStudents] = useState<{ id: number; first_name: string }[]>([]);


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
          const response = await axios.get(
            `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/user?role_name=teacher`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("authToken")}`,
              },
            }
          );
          
          console.log(response.data.results)
          if (Array.isArray(response.data.results)) {
            setTeachers(response.data.results);
          } else {
            console.error("Users API response is not an array");
          }        } catch (err: any) {
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
          console.log(response.data.results)
          if (Array.isArray(response.data.results)) {
            setCourses(response.data.results);
          } else {
            console.error("Users API response is not an array");
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
            `${process.env.NEXT_PUBLIC_BASE_URL}/api/academics/students`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("authToken")}`,
              },
            }
          );
          console.log(response.data)
          if (Array.isArray(response.data.results)) {
            setStudents(response.data.results);
          }
        } catch (err: any) {
          const errorMessage = err.response?.data?.detail || err.message;
          setErrorCourses(`Error loading courses: ${errorMessage}`);
        } finally {
          setLoadingCourses(false);
        }
      };
      fetchStudents();
      fetchTeachers();
      fetchCourses();
    }
  }, [isMounted]);

  const handleAddCourse = () => {
    const course = courses.find((s) => s.id === Number(currentCourse));
  
    if (course && !selectedCourses.some((s) => s.id === course.id)) {
      setSelectedCourses([...selectedCourses, course]);
      setCurrentCourse(""); // Reset dropdown
    } else if (!course) {
      console.error("Selected student not found in the list.");
    }
  };

  const handleRemoveCourse = (id: number) => {
    setSelectedCourses(selectedCourses.filter((s) => s.id !== id));
  };

  const handleAddStudent = () => {
    const student = students.find((s) => s.id === Number(currentStudent));
  
    if (student && !selectedStudents.some((s) => s.id === student.id)) {
      setSelectedStudents([...selectedStudents, student]);
      setCurrentStudent(""); // Reset dropdown
    } else if (!student) {
      console.error("Selected student not found in the list.");
    }
  };

  const handleRemoveStudent = (id: number) => {
    setSelectedStudents(selectedStudents.filter((s) => s.id !== id));
  };

  

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.className ||
      !formData.courses ||
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

    const selectedCourseIds = selectedCourses.map(course => course.id);
    const selectedStudentIds = selectedStudents.map(student => student.id);

    console.log(selectedCourseIds)
    const postData = {
      name: formData.className,
      courses_id: selectedCourseIds,
      teacher_id: parseInt(formData.teacher),
      start_date: formData.start_date,
      end_date: formData.end_date,
      student_id: selectedStudentIds,
    };


    try {
      console.log(postData)
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
      
      alert("Update classroom successfully!");
      router.push('/class/all-class')
      
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.detail ||
        error.message ||
        "An unknown error occurred.";
      const errorData = error.response?.data;
      console.error("Error submitting the form:", errorMessage);
      console.error("Full response data:", errorData);
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
            <label
              htmlFor="className"
              className="text-sm font-medium text-gray-700"
            >
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

        

          <div className="flex flex-col">
            <label
              htmlFor="teacher"
              className="text-sm font-medium text-gray-700"
            >
              Teacher
            </label>
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
            <label
              htmlFor="start_date"
              className="text-sm font-medium text-gray-700"
            >
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

          <div className="flex flex-col">
            <label
              htmlFor="end_date"
              className="text-sm font-medium text-gray-700"
            >
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

          <div className="p-4 bg-gray-50 rounded shadow-md ">
      <label className="text-lg font-semibold text-gray-800 mb-2">Select a course</label>
      <div className="flex items-center mt-4 ">
        <select
          className="w-full h-[40px] p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={currentCourse}
          onChange={(e) => setCurrentCourse(e.target.value)} // Track dropdown selection
        >
          <option value="">Select a Course</option>
          {courses.map((course) => (
            <option key={course.id} value={course.id}>
              {course.name}
            </option>
          ))}
        </select>
        <button
          type="button"
          className="ml-2 text-white bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded"
          onClick={handleAddCourse} // Add selected student to the table
        >
          Add
        </button>
      </div>

      {/* Display selected students in a table */}
      {selectedCourses.length > 0 && (
        <table className="mt-16 w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200 ">
              <th className="border border-gray-300 px-4 py-2">ID</th>
              <th className="border border-gray-300 px-4 py-2">Name</th>
              <th className="border border-gray-300 px-4 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {selectedCourses.map((course) => (
              <tr key={course.id}>
                <td className="border border-gray-300 px-4 py-2">{course.id}</td>
                <td className="border border-gray-300 px-4 py-2">{course.name}</td>
                <td className="border border-gray-300 px-4 py-2">
                  <button
                    type="button"
                    className="text-white bg-red-500 hover:bg-red-600 px-3 py-1 rounded"
                    onClick={() => handleRemoveCourse(course.id)} // Remove student from the table
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      </div>
         

      <div className="p-4 bg-gray-50 rounded shadow-md ">
      <label className="text-lg font-semibold text-gray-800 mb-2">Select a Student</label>
      <div className="flex items-center mt-4 ">
        <select
          className="w-full h-[40px] p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={currentStudent}
          onChange={(e) => setCurrentStudent(e.target.value)} // Track dropdown selection
        >
          <option value="">Select a Student</option>
          {students.map((student) => (
            <option key={student.id} value={student.id}>
              {student.first_name}
            </option>
          ))}
        </select>
        <button
          type="button"
          className="ml-2 text-white bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded"
          onClick={handleAddStudent} // Add selected student to the table
        >
          Add
        </button>
      </div>

      {/* Display selected students in a table */}
      {selectedStudents.length > 0 && (
        <table className="mt-16 w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200 ">
              <th className="border border-gray-300 px-4 py-2">ID</th>
              <th className="border border-gray-300 px-4 py-2">Name</th>
              <th className="border border-gray-300 px-4 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {selectedStudents.map((student) => (
              <tr key={student.id}>
                <td className="border border-gray-300 px-4 py-2">{student.id}</td>
                <td className="border border-gray-300 px-4 py-2">{student.first_name}</td>
                <td className="border border-gray-300 px-4 py-2">
                  <button
                    type="button"
                    className="text-white bg-red-500 hover:bg-red-600 px-3 py-1 rounded"
                    onClick={() => handleRemoveStudent(student.id)} // Remove student from the table
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
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
