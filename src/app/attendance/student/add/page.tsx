"use client";
import React, { useState, useEffect } from "react";
import Button from "@/components/Button";
import { useRouter } from "next/navigation";
const Page = () => {
  const [students, setStudents] = useState<any[]>([]); // To store the list of students
  const [selectedStudent, setSelectedStudent] = useState<string>(""); // To store the selected student ID
  const [classInstance, setClassInstance] = useState<string>(""); // Store the selected classroom
  const [classrooms, setClassrooms] = useState<any[]>([]); // Store the list of classrooms
  const [date, setDate] = useState<string>(""); // Store the selected date
  const [status, setStatus] = useState<string>("present"); // Store the selected status
  const [notes, setNotes] = useState<string>(""); // Store notes
  const [token, setToken] = useState<string | null>(null); // Store auth token
  const [attendanceData, setAttendanceData] = useState<any[]>([]); 
  const router = useRouter();
  const getClassroomNameById = (classroomId: number) => {
    const classroom = classrooms.find((classroom) => classroom.id === classroomId);
    return classroom ? classroom.name : "Unknown Class";
  };
  useEffect(() => {
    const tokenFromLocalStorage = localStorage.getItem("authToken");
    if (tokenFromLocalStorage) {
      setToken(tokenFromLocalStorage);
    }
  }, []);

  // Fetch students data from the API
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/academics/students/`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(
            `Failed to fetch students. Status code: ${response.status}`
          );
        }

        const data = await response.json();
        console.log("Fetched students data:", data);

        if (data.results && data.results.length > 0) {
          setStudents(data.results);
        } else {
          console.error("No students found");
        }
      } catch (error) {
        console.error("Error fetching students:", error);
      }
    };

    if (token) {
      fetchStudents();
    }
  }, [token]);
  useEffect(() => {
    const fetchClassrooms = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/academics/classroom/`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(
            `Failed to fetch classrooms. Status code: ${response.status}`
          );
        }

        const data = await response.json();
        console.log("Fetched classrooms data:", data);

        // Access the results field in the response
        if (data.results && data.results.length > 0) {
          setClassrooms(data.results); // Set classrooms from the `results` field
        } else {
          console.error("No classrooms found");
        }
      } catch (error) {
        console.error("Error fetching classrooms:", error);
      }
    };

    if (token) {
      fetchClassrooms(); // Fetch classrooms only when the token is available
    }
  }, [token]);

  // Fetch attendance data (history) from the API
  useEffect(() => {
    const fetchAttendanceHistory = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/academics/attendances/`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(
            `Failed to fetch attendance history. Status code: ${response.status}`
          );
        }

        const data = await response.json();
        console.log("Fetched attendance history:", data);

        if (data.results && data.results.length > 0) {
          setAttendanceData(data.results);
        } else {
          console.error("No attendance history found");
        }
      } catch (error) {
        console.error("Error fetching attendance history:", error);
      }
    };

    if (token) {
      fetchAttendanceHistory();
    }
  }, [token]);

  const getStudentNameById = (studentId: number) => {
    const student = students.find((student) => student.id === studentId);
    return student
      ? `${student.first_name} ${student.last_name}`
      : "Unknown Student";
  };

  // Form submission logic
  const handleSubmitClick = async () => {
    if (!selectedStudent || !classInstance || !date || !status) {
      alert("Please fill all required fields.");
      return;
    }

    const data = {
      student: parseInt(selectedStudent),
      class_instance: parseInt(classInstance),
      date: date,
      status: status,
      notes: notes || "",
    };

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/academics/attendances/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.log("Error data:", errorData);
        throw new Error(
          `Failed to submit attendance. Server responded with: ${response.status}`
        );
      }

      const result = await response.json();
      console.log("Success:", result);
      setAttendanceData((prevData) => [...prevData, result]);
      alert("Attendance submitted successfully!");
      router.push("/attendance/student");
    } catch (error) {
      console.error("Error submitting attendance data:", error);
      alert("Error submitting attendance data. Please try again.");
    }
  };

  return (
    <div className="lg:ml-[16%] ml-[8%] mt-20 flex flex-col py-8">
      <div className="w-full lg:w-[1068px] h-[42px] p-4 bg-white rounded-md flex items-center justify-between shadow-md mb-8">
        <span className="flex flex-row gap-2 text-[14px] lg:text-[18px] font-semibold text-gray-700">
          Attendance | Submit Attendance
        </span>
        
      </div>
      <div>
      <button
          type="button"
          onClick={() => router.back()}
          className=" w-[64px] bg-gray-300 text-black font-bold py-2 px-2 rounded-lg hover:bg-gray-600 transition-colors"
        >
          Back
        </button>
      </div>
      <div className="flex flex-col lg:w-[1068px] w-full p-6 bg-white rounded-lg shadow-md mb-10 space-y-4">
        <div className="flex flex-col lg:flex-row lg:space-x-4">
          <div className="flex flex-col lg:w-1/3">
            <label
              htmlFor="studentId"
              className="text-sm font-medium text-gray-700"
            >
              Student (required)
            </label>
            <select
              id="studentId"
              value={selectedStudent}
              onChange={(e) => setSelectedStudent(e.target.value)}
              className="w-full h-[40px] p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Student</option>
              {students.length > 0 ? (
                students.map((student) => (
                  <option key={student.id} value={student.id}>
                    {`${student.first_name} ${student.last_name}`}
                  </option>
                ))
              ) : (
                <option disabled>No students available</option>
              )}
            </select>
          </div>

          {/* Replace Class Instance Input with Dropdown */}
          <div className="flex flex-col lg:w-1/3">
            <label
              htmlFor="classInstance"
              className="text-sm font-medium text-gray-700"
            >
              Class Instance (required)
            </label>
            <select
              id="classInstance"
              value={classInstance}
              onChange={(e) => setClassInstance(e.target.value)}
              className="w-full h-[40px] p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Class</option>
              {classrooms.length > 0 ? (
                classrooms.map((classroom) => (
                  <option key={classroom.id} value={classroom.id}>
                    {classroom.name} {/* Assuming classrooms have 'name' field */}
                  </option>
                ))
              ) : (
                <option disabled>No classes available</option>
              )}
            </select>
          </div>

          <div className="flex flex-col lg:w-1/3">
            <label htmlFor="date" className="text-sm font-medium text-gray-700">
              Date (required)
            </label>
            <input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full h-[40px] p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="flex flex-col lg:flex-row lg:space-x-4">
          <div className="flex flex-col lg:w-1/3">
            <label
              htmlFor="status"
              className="text-sm font-medium text-gray-700"
            >
              Status (required)
            </label>
            <select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full h-[40px] p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="present">Present</option>
              <option value="absent">Absent</option>
              <option value="late">Late</option>
            </select>
          </div>

          <div className="flex flex-col lg:w-1/3">
            <label
              htmlFor="notes"
              className="text-sm font-medium text-gray-700"
            >
              Notes (optional)
            </label>
            <input
              id="notes"
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Enter any notes"
              className="w-full h-[40px] p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="flex justify-center">
          <Button
            onClick={handleSubmitClick}
            className="lg:h-[40px] h-[40px] flex justify-center items-center px-6 py-2 bg-[#213458] text-white font-medium rounded hover:bg-[#213498]"
          >
            Submit
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Page;
