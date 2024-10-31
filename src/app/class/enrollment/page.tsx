"use client";
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
  const [students, setStudents] = useState<Student[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<number | null>(null);
  const [selectedCourses, setSelectedCourses] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const tokenFromLocalStorage = localStorage.getItem("authToken");
    if (tokenFromLocalStorage) {
      setToken(tokenFromLocalStorage);
    } else {
      router.push("/login");
    }
  }, [router]);

  useEffect(() => {
    if (!token) return;

    const fetchStudentsAndCourses = async () => {
      setError(null);
      setDataLoading(true);

      try {
        const config = {
          headers: { Authorization: `Bearer ${token}` },
        };

        const studentResponse = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/academics/students/`,
          config
        );
        const courseResponse = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/academics/course/`,
          config
        );

        setStudents(studentResponse.data.results || []);
        setCourses(courseResponse.data || []);
      } catch (err) {
        setError("Failed to load students or courses.");
      } finally {
        setDataLoading(false);
      }
    };

    fetchStudentsAndCourses();
  }, [token]);

  const handleCourseChange = (courseId: number) => {
    setSelectedCourses((prevSelectedCourses) => {
      if (prevSelectedCourses.includes(courseId)) {
        return prevSelectedCourses.filter((id) => id !== courseId);
      } else {
        return [...prevSelectedCourses, courseId];
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    if (!selectedStudent || selectedCourses.length === 0) {
      setError("Please select a student and at least one course.");
      setLoading(false);
      return;
    }

    const enrollmentData = {
      student: selectedStudent,
      courses: selectedCourses,
    };

    try {
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };

      // Pre-check for existing enrollment
      const checkEnrollmentResponse = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/academics/enrollment/`,
        enrollmentData,
        config
      );

      if (checkEnrollmentResponse.data.alreadyEnrolled.length > 0) {
        const alreadyEnrolledCourses =
          checkEnrollmentResponse.data.alreadyEnrolled
            .map((course: { name: string }) => course.name)
            .join(", ");

        window.alert(
          `Student is already enrolled in the following courses: ${alreadyEnrolledCourses}`
        );
        setLoading(false);
        return;
      }

      // Proceed with enrollment if no existing enrollment found
      await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/academics/enrollment/`,
        enrollmentData,
        config
      );
      setSuccess("Enrollment successful!");
      window.alert("Enrollment successful!");
    } catch (err) {
      setError("Failed to enroll student.");
      window.alert("Failed to enroll student.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6">Student Enrollment</h1>
        <button
          type="button"
          onClick={() => router.push("/class/enrollment/view")}
          className="bg-gray-500 text-white font-bold py-2 px-4 rounded-lg w-full hover:bg-gray-600 mt-2"
        >
          View Enrollment History
        </button>

        {error && <div className="text-red-500 mb-4">{error}</div>}
        {success && <div className="text-green-500 mb-4">{success}</div>}

        <form onSubmit={handleSubmit}>
          {/* Select Student */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-semibold mb-2">
              Select Student
            </label>
            <select
              value={selectedStudent !== null ? selectedStudent : ""}
              onChange={(e) => setSelectedStudent(Number(e.target.value))}
              className="shadow-sm appearance-none border rounded-lg w-full py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select a student</option>
              {students.length > 0 ? (
                students.map((student) => (
                  <option key={student.id} value={student.id}>
                    {student.first_name}
                  </option>
                ))
              ) : (
                <option disabled>Loading students...</option>
              )}
            </select>
          </div>

          {/* Select Courses */}
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-semibold mb-2">
              Select Courses
            </label>

            {dataLoading ? (
              <div className="text-gray-500">Loading courses...</div>
            ) : courses && courses.length > 0 ? (
              courses.map((course) => (
                <div key={course.id} className="flex items-center mb-2">
                  <input
                    type="checkbox"
                    value={course.id}
                    checked={selectedCourses.includes(course.id)}
                    onChange={() => handleCourseChange(course.id)}
                    className="form-checkbox h-4 w-4 text-[#213458]"
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
            className={`bg-[#213458] text-white font-bold py-2 px-4 rounded-lg w-full hover:bg-[#214598] ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={loading}
          >
            {loading ? "Enrolling..." : "Enroll Student"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Page;
