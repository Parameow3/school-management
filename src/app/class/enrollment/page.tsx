'use client';
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

// Define the types
interface Course {
  id: number;
  name: string;
}

interface Student {
  first_name: string;
  id: number;
}

const Page = () => {
  const [students, setStudents] = useState<Student[]>([]); // List of students
  const [courses, setCourses] = useState<Course[]>([]); // List of courses
  const [selectedStudent, setSelectedStudent] = useState<number | null>(null); // Selected student
  const [selectedCourses, setSelectedCourses] = useState<number[]>([]); // Selected courses
  const [loading, setLoading] = useState(false); // For form submission
  const [dataLoading, setDataLoading] = useState(true); // For initial data loading
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const router = useRouter();

  // Fetch token from localStorage and handle redirect to login if no token
  useEffect(() => {
    const tokenFromLocalStorage = localStorage.getItem("authToken");
    if (tokenFromLocalStorage) {
      setToken(tokenFromLocalStorage);
    } else {
      // Redirect to login if no token
      router.push("/login");
    }
  }, [router]);

  // Fetch students and courses on component mount
  useEffect(() => {
    if (!token) return;

    const fetchStudentsAndCourses = async () => {
      setError(null); // Reset error on fetch start
      setDataLoading(true); // Start loading data

      try {
        const config = {
          headers: { Authorization: `Bearer ${token}` },
        };

        const studentResponse = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/academics/students/`, config);
        console.log("Student API Response:", studentResponse.data);

        const courseResponse = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/academics/course/`, config);
        console.log("Course API Response:", courseResponse.data);

        if (studentResponse.data && studentResponse.data.results) {
          setStudents(studentResponse.data.results); 
        } else {
          console.error("Unexpected student API response format", studentResponse.data);
        }

        if (Array.isArray(courseResponse.data)) {
          setCourses(courseResponse.data); // Assuming courseResponse.data is an array
        } else {
          console.error("Unexpected course API response format", courseResponse.data);
        }
      } catch (err) {
        setError("Failed to load students or courses.");
      } finally {
        setDataLoading(false); // Stop loading data
      }
    };

    fetchStudentsAndCourses();
  }, [token]);

  const handleCourseChange = (courseId: number) => {
    // Toggle course selection
    setSelectedCourses((prevSelectedCourses) => {
      if (prevSelectedCourses.includes(courseId)) {
        return prevSelectedCourses.filter((id) => id !== courseId); // Remove if already selected
      } else {
        return [...prevSelectedCourses, courseId]; // Add if not selected
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    const enrollmentData = {
      student: selectedStudent,
      courses: selectedCourses,
    };

    try {
      // Submit enrollment data to API
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };
      await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/api/academics/enrollment/`, enrollmentData, config);
      setSuccess("Enrollment successful!");
      window.alert("Enrollment successful!"); // Alert on success
    } catch (err) {
      setError("Failed to enroll student.");
      window.alert("Failed to enroll student."); // Alert on error
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="lg:ml-[16%] ml-[11%] mt-20 flex flex-col bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
      <h1 className="text-2xl font-bold mb-6">Student Enrollment</h1>
      
      {error && <div className="text-red-500 mb-4">{error}</div>}
      {success && <div className="text-green-500 mb-4">{success}</div>}
      
      <form onSubmit={handleSubmit}>
        {/* Select Student */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-semibold mb-2">
            Select Student
          </label>
          <select
            value={selectedStudent !== null ? selectedStudent : ""} // Ensure proper handling of null
            onChange={(e) => setSelectedStudent(Number(e.target.value))}
            className="shadow-sm appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Select a student</option>
            {students.length > 0 ? students.map((student) => (
              <option key={student.id} value={student.id}>
                {student.first_name}
              </option>
            )) : <option disabled>Loading students...</option>}
          </select>
        </div>

        {/* Select Courses */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-semibold mb-2">
            Select Courses
          </label>

          {dataLoading ? (
            <div className="text-gray-500">Loading courses...</div>
          ) : courses && courses.length > 0 ? (  // Ensure courses is an array
            courses.map((course) => (
              <div key={course.id} className="flex items-center mb-2">
                <input
                  type="checkbox"
                  value={course.id}
                  checked={selectedCourses.includes(course.id)}
                  onChange={() => handleCourseChange(course.id)}
                  className="form-checkbox h-4 w-4 text-blue-600"
                />
                <label className="ml-2 text-gray-700">{course.name}</label>
              </div>
            ))
          ) : (
            <div className="text-gray-500">No courses available</div>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className={`bg-blue-500 text-white font-bold py-2 px-4 rounded-lg w-full hover:bg-blue-700 ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={loading}
        >
          {loading ? "Enrolling..." : "Enroll Student"}
        </button>
      </form>
    </div>
  );
};

export default Page;
