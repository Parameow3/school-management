"use client";
import React, { useState, useEffect } from "react";
import Button from "@/components/Button";

const Page = () => {
  const [teachers, setTeachers] = useState<any[]>([]); // To store the list of teachers
  const [selectedTeacher, setSelectedTeacher] = useState<string>(""); // To store the selected teacher ID
  const [classInstance, setClassInstance] = useState<string>("");
  const [date, setDate] = useState<string>("");
  const [status, setStatus] = useState<string>("present");
  const [notes, setNotes] = useState<string>("");
  const [classrooms, setClassrooms] = useState<any[]>([]); // Store the list of classrooms

  const [token, setToken] = useState<string | null>(null);
  const [attendanceData, setAttendanceData] = useState<any[]>([]); // To store attendance history

  // Retrieve token from localStorage on mount
  useEffect(() => {
    const tokenFromLocalStorage = localStorage.getItem("authToken");
    if (tokenFromLocalStorage) {
      setToken(tokenFromLocalStorage);
    }
  }, []);

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/user?role_name=teacher`,
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
            `Failed to fetch teachers. Status code: ${response.status}`
          );
        }

        const data = await response.json();
        console.log("Fetched teachers data:", data); // Log the API response to inspect the structure
        if (data.results && data.results.length > 0) {
          setTeachers(data.results);
        } else {
          console.error("No teachers found");
        }
      } catch (error) {
        console.error("Error fetching teachers:", error);
      }
    };

    if (token) {
      fetchTeachers(); // Fetch teachers only when token is available
    }
  }, [token]);


   // Fetch classrooms data from the API (http://127.0.0.1:8000/api/academics/classroom)
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
  const getTeacherById = (teacherId: number) => {
    const teacher = teachers.find((teacher) => teacher.id === teacherId);
    return teacher
      ? `${teacher.first_name} ${teacher.last_name}`
      : "Unknown teacher";
  };
  const handleSubmitClick = async () => {
    if (!selectedTeacher || !classInstance || !date || !status) {
      alert("Please fill all required fields.");
      return;
    }

    const data = {
      student_id: parseInt(selectedTeacher),
      class_id: parseInt(classInstance),
      date: date,
      status: status,
      notes: notes || "",
    };

    try {
      console.log(data)
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
      <div className="flex flex-col lg:w-[1068px] w-full p-6 bg-white rounded-lg shadow-md mb-10 space-y-4">
        <div className="flex flex-col lg:flex-row lg:space-x-4">
          <div className="flex flex-col lg:w-1/3">
            <label
              htmlFor="teacherId"
              className="text-sm font-medium text-gray-700"
            >
              Teacher (required)
            </label>
            <select
              id="teacherId"
              value={selectedTeacher}
              onChange={(e) => setSelectedTeacher(e.target.value)}
              className="w-full h-[40px] p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select teacher</option>
              {teachers.length > 0 ? (
                teachers.map((teacher) => (
                  <option key={teacher.id} value={teacher.id}>
                    {`${teacher.username} `} {/* Correct fields */}
                  </option>
                ))
              ) : (
                <option disabled>No teachers available</option>
              )}
            </select>
          </div>

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
      {attendanceData.length > 0 && (
        <div className="lg:w-[1068px] w-full mt-8 bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">
            Attendance History
          </h3>
          <table className="min-w-full mt-4 border border-gray-300 rounded-lg">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-4 py-2 text-left text-sm text-gray-700">
                  Teacher Name
                </th>
                <th className="border px-4 py-2 text-left text-sm text-gray-700">
                  Class Instance
                </th>
                <th className="border px-4 py-2 text-left text-sm text-gray-700">
                  Date
                </th>
                <th className="border px-4 py-2 text-left text-sm text-gray-700">
                  Status
                </th>
                <th className="border px-4 py-2 text-left text-sm text-gray-700">
                  Notes
                </th>
              </tr>
            </thead>
            <tbody>
              {attendanceData.map((record, index) => (
                <tr key={index} className="hover:bg-gray-100 transition-colors">
                  <td className="border px-4 py-2">
                    {getTeacherById(record.teacher)} {/* Display teacher name */}
                  </td>
                  <td className="border px-4 py-2">{record.class_instance}</td>
                  <td className="border px-4 py-2">{record.date}</td>
                  <td className="border px-4 py-2">{record.status}</td>
                  <td className="border px-4 py-2">{record.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Page;
