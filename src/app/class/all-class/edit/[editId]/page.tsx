"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
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
  const params = useParams();
  const router = useRouter();
  const id = parseInt(params.editId as string, 10);
  const [formData, setFormData] = useState({
    className: "",
    course: "",
    teacher: "",
    credit: "",
    start_date: "",
    end_date: "",
    students: [""],
  });
  const [courses, setCourses] = useState<Course[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [existingClassroomId, setExistingClassroomId] = useState<number | null>(null); // New state for existing classroom ID

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

      const fetchClassroomData = async (classroomId: number) => {
        try {
          const response = await axios.get(
            `${process.env.NEXT_PUBLIC_BASE_URL}/api/academics/classroom/${classroomId}/`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("authToken")}`,
              },
            }
          );
          const data = response.data;
      
          // Populate formData with existing classroom data
          setFormData({
            className: data.name,
            course: data.courses[0], // Assuming single course selection
            teacher: data.teacher,
            credit: data.credit || "", // Ensure credit is included
            start_date: data.start_date,
            end_date: data.end_date,
            students: data.student.map((id: number) => id.toString()), // Ensure IDs are strings
          });
          setExistingClassroomId(classroomId); // Set the existing classroom ID
        } catch (err: any) {
          console.error("Error fetching classroom data:", err);
        }
      };
      fetchTeachers();
      fetchCourses();
      const classroomId = id; // Replace with logic to get the ID you want to edit
      fetchClassroomData(classroomId);
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
    e: React.ChangeEvent<HTMLInputElement>,
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
      student: studentIDs,
    };


    try {
      const url = existingClassroomId 
        ? `${process.env.NEXT_PUBLIC_BASE_URL}/api/academics/classroom/${existingClassroomId}/` 
        : `${process.env.NEXT_PUBLIC_BASE_URL}/api/academics/classroom/`;
      const method = existingClassroomId ? "PUT" : "POST";
      
      const response = await axios({
        method,
        url,
        data: postData,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
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
          <h1 className="text-2xl font-semibold text-gray-800">Update Class Form</h1>
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
              value={formData.className}
            />
          </div>

          <div className="flex flex-col">
            <label
              htmlFor="course"
              className="text-sm font-medium text-gray-700"
            >
              Course
            </label>
            <select
              id="course"
              name="course"
              className="w-full h-[40px] p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={handleChange}
              value={formData.course}
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
                value={formData.teacher}
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
              value={formData.start_date}
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
              value={formData.end_date}
            />
          </div>
          <div className="flex flex-col">
  <label className="text-sm font-medium text-gray-700">Students</label>
  {formData.students.map((student, index) => (
    <div key={index} className="flex items-center mt-2">
      <input
        type="text"
        placeholder="Enter Student ID"
        className="w-full h-[40px] p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={student}
        onChange={(e) => handleStudentChange(e, index)} // Handle changes properly
      />
      {index > 0 && (
        <button
          type="button"
          className="ml-2 text-red-500"
          onClick={() => handleRemoveStudent(index)} // Function to remove student
        >
          Remove
        </button>
      )}
    </div>
  ))}
  <button
    type="button"
    className="mt-2 px-4 py-2 w-[132px] bg-[#213458] text-[#FFFFFF]"
    onClick={handleAddStudent} // Function to add a new student input
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