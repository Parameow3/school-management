"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

interface Course {
  program_id: number;
  id: number;
  name: string;
}

interface Program {
  course_list: any;
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
  const [formData, setFormData] = useState({
    className: "",
    program: "",
    course: "",
    teacher: "",
    start_date: "",
    end_date: "",
    students: [""],
  });

  const [programs, setPrograms] = useState<Program[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [allCourses, setAllCourses] = useState<Course[]>([]); // All courses fetched from API
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [loadingPrograms, setLoadingPrograms] = useState(true);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [loadingTeachers, setLoadingTeachers] = useState(true);
  const [loadingStudents, setLoadingStudents] = useState(true);

  const [errorPrograms, setErrorPrograms] = useState<string | null>(null);
  const [errorCourses, setErrorCourses] = useState<string | null>(null);
  const [errorTeachers, setErrorTeachers] = useState<string | null>(null);
  const [errorStudents, setErrorStudents] = useState<string | null>(null);

  const token = localStorage.getItem("authToken") || ""; // Get token from localStorage

  // Fetch programs, teachers, students, and courses
  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/academics/program/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setPrograms(response.data.results || []);
      } catch (error: any) {
        setErrorPrograms("Failed to load programs.");
      } finally {
        setLoadingPrograms(false);
      }
    };

    const fetchTeachers = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/user`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const teacherUsers = response.data.results.filter(
          (user: any) => user.roles_name === "teacher"
        );
        setTeachers(teacherUsers);
      } catch (error: any) {
        setErrorTeachers("Failed to load teachers.");
      } finally {
        setLoadingTeachers(false);
      }
    };

    const fetchStudents = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/academics/students/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setStudents(response.data.results || []);
      } catch (error: any) {
        setErrorStudents("Failed to load students.");
      } finally {
        setLoadingStudents(false);
      }
    };

    const fetchCourses = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/academics/course/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("Courses Data from API:", response.data);

        // Check if courses include program_id and handle mapping if needed
        const coursesWithProgram = response.data.map((course: any) => ({
          ...course,
          program_id: course.program_id || course.program, // Ensure program_id exists
        }));
        console.log("Updated Courses with program_id:", coursesWithProgram);

        setAllCourses(coursesWithProgram);
      } catch (error: any) {
        setErrorCourses("Failed to load courses.");
      } finally {
        setLoadingCourses(false);
      }
    };



    fetchPrograms();
    fetchTeachers();
    fetchStudents();
    fetchCourses();
  }, [token]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleStudentChange = (
    e: React.ChangeEvent<HTMLSelectElement>,
    index: number
  ) => {
    const updatedStudents = [...formData.students];
    updatedStudents[index] = e.target.value;
    setFormData({ ...formData, students: updatedStudents });
  };
  const handleProgramChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const programId = parseInt(e.target.value); // Convert to number for comparison
    setFormData({ ...formData, program: programId.toString(), course: "" });
  
    if (programId) {
      const filtered = allCourses.filter((course) => {
        return course.program_id === programId; // Ensure program_id matches
      });
      setFilteredCourses(filtered);
    } else {
      setFilteredCourses([]); // Clear if no program selected
    }
  };
  
  const handleAddStudent = () => {
    setFormData({ ...formData, students: [...formData.students, ""] });
  };

  const handleRemoveStudent = (index: number) => {
    const updatedStudents = formData.students.filter((_, i) => i !== index);
    setFormData({ ...formData, students: updatedStudents });
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    // Ensure required fields are filled
    if (
      !formData.className ||
      !formData.program ||
      !formData.course ||
      !formData.teacher ||
      !formData.start_date ||
      !formData.end_date
    ) {
      alert("Please fill in all required fields.");
      return;
    }
  
    // Prepare payload
    const postData = {
      name: formData.className,
      courses: [parseInt(formData.course)], // Ensure courses is an array of numbers
      teacher: parseInt(formData.teacher), // Ensure teacher is a number
      start_date: formData.start_date,
      end_date: formData.end_date,
      student: formData.students
        .map((id) => parseInt(id)) // Map student IDs to numbers
        .filter((id) => !isNaN(id)), // Remove invalid entries
    };
  
    try {
      // Send the POST request
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/academics/classroom/`,
        postData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      alert("Classroom created successfully!");
      router.push("/class/all-class");
    } catch (error: any) {
      alert(`Failed to create classroom: ${error.response?.data?.detail || error.message}`);
    }
  };
  
  return (
    <div className="lg:ml-[16%] ml-[11%] mt-20 flex flex-col">
      <div className="lg:w-[60%] w-[90%] mx-auto mt-10 p-6 bg-white rounded-lg shadow-md space-y-6">
        <h1 className="text-2xl font-semibold text-gray-800 text-center">Class Form</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
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

          <div className="flex flex-col">
            <label htmlFor="program" className="text-sm font-medium text-gray-700">
              Program
            </label>
            <select
              id="program"
              name="program"
              className="w-full h-[40px] p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={handleProgramChange}
            >
              <option value="">Select a Program</option>
              {loadingPrograms ? (
                <option disabled>Loading programs...</option>
              ) : errorPrograms ? (
                <option disabled>{errorPrograms}</option>
              ) : (
                programs.map((program) => (
                  <option key={program.id} value={program.id}>
                    {program.name}
                  </option>
                ))
              )}
            </select>
          </div>

          {formData.program && (
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
                <option value="">Select a Course</option>
                {loadingCourses ? (
                  <option disabled>Loading courses...</option>
                ) : errorCourses ? (
                  <option disabled>{errorCourses}</option>
                ) : filteredCourses.length > 0 ? (
                  filteredCourses.map((course) => (
                    <option key={course.id} value={course.id}>
                      {course.name}
                    </option>
                  ))
                ) : (
                  <option disabled>No courses available</option>
                )}
              </select>
            </div>
          )}

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
              <option value="">Select a Teacher</option>
              {loadingTeachers ? (
                <option disabled>Loading teachers...</option>
              ) : errorTeachers ? (
                <option disabled>{errorTeachers}</option>
              ) : (
                teachers.map((teacher) => (
                  <option key={teacher.id} value={teacher.id}>
                    {teacher.username}
                  </option>
                ))
              )}
            </select>
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700">Students</label>
            {formData.students.map((studentId, index) => (
              <div key={index} className="flex items-center mt-2">
                <select
                  value={studentId}
                  onChange={(e) => handleStudentChange(e, index)}
                  className="w-full h-[40px] p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select a Student</option>
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
            ))}
            <button
              type="button"
              className="mt-2 px-4 py-2 w-[164px] ml-56 flex justify-center items-center bg-[#213458] text-white rounded"
              onClick={handleAddStudent}
            >
              Add Student
            </button>
          </div>

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

          <div className="flex justify-center">
            <button
              type="submit"
              className="px-6 py-2 bg-[#213456] text-white rounded"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Page;
