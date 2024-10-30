"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter, useParams } from "next/navigation";

interface Student {
  id: number;
  first_name: string;
}

interface Course {
  id: number;
  name: string;
}

const Page = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<number | null>(null);
  const [selectedCourses, setSelectedCourses] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const router = useRouter();
  const params = useParams();
  const enrollmentId = params.enrollmentId; // Retrieve enrollment ID from URL parameters

  useEffect(() => {
    const tokenFromLocalStorage = localStorage.getItem("authToken");
    if (tokenFromLocalStorage) {
      setToken(tokenFromLocalStorage);
    } else {
      router.push("/login");
    }
  }, [router]);

  // Fetch existing enrollment data, students, and courses
  useEffect(() => {
    if (!token) return;

    const fetchData = async () => {
      setError(null);
      setDataLoading(true);

      try {
        const config = {
          headers: { Authorization: `Bearer ${token}` },
        };

        // Fetch the specific enrollment data
        const enrollmentResponse = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/academics/enrollment/${enrollmentId}/`,
          config
        );
        const enrollmentData = enrollmentResponse.data;

        if (!enrollmentData || !enrollmentData.student || !enrollmentData.courses) {
          throw new Error("Invalid enrollment data structure");
        }

        // Pre-fill form with enrollment data
        setSelectedStudent(enrollmentData.student.id);
        setSelectedCourses(enrollmentData.courses.map((course: Course) => course.id));

        // Fetch students and courses data
        const [studentsResponse, coursesResponse] = await Promise.all([
          axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/academics/students/`, config),
          axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/academics/course/`, config),
        ]);

        setStudents(studentsResponse.data.results || []);
        setCourses(coursesResponse.data || []);
      } catch (err) {
        setError("Failed to load data. Please check the network or data structure.");
        console.error("Data loading error:", err);
      } finally {
        setDataLoading(false);
      }
    };

    fetchData();
  }, [token, enrollmentId]);

  const handleCourseChange = (courseId: number) => {
    setSelectedCourses((prevSelectedCourses) =>
      prevSelectedCourses.includes(courseId)
        ? prevSelectedCourses.filter((id) => id !== courseId)
        : [...prevSelectedCourses, courseId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!selectedStudent || selectedCourses.length === 0) {
      setError("Please select a student and at least one course.");
      setLoading(false);
      return;
    }

    const updatedEnrollmentData = {
      student: selectedStudent,
      courses: selectedCourses,
    };

    try {
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };
      await axios.put(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/academics/enrollment/${enrollmentId}/`,
        updatedEnrollmentData,
        config
      );

      alert("Enrollment updated successfully!");
      router.push("/enrollment-history");
    } catch (err) {
      setError("Failed to update enrollment. Please try again later.");
      console.error("Update error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6">Update Enrollment</h1>

        {error && <div className="text-red-500 mb-4">{error}</div>}

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
            {loading ? "Updating..." : "Update Enrollment"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Page;
