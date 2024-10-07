"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Button from "@/components/Button";

const Page = () => {
  const [attendanceData, setAttendanceData] = useState<any[]>([]); // Holds new attendance and history

  // useEffect to fetch attendance data from the backend when the component is loaded
  useEffect(() => {
    const fetchAttendanceData = async () => {
      try {
        const response = await axios.get(
          "http://127.0.0.1:8000/api/academics/attendances/?page=1"
        );
        setAttendanceData(response.data.results); // Assuming the API returns a `results` array
      } catch (error) {
        console.error("Error fetching attendance data:", error);
        alert("Error fetching attendance data. Please try again.");
      }
    };

    // Fetch the attendance data when the component loads
    fetchAttendanceData();
  }, []); // Empty dependency array means this runs once when the component mounts

  // Function to handle submission
  const handleSubmitClick = async () => {
    // Get data from input fields by ID
    const studentId: string | null = (
      document.getElementById("studentId") as HTMLInputElement
    )?.value;
    const classInstance: string | null = (
      document.getElementById("classInstance") as HTMLInputElement
    )?.value;
    const date: string | null = (
      document.getElementById("date") as HTMLInputElement
    )?.value;
    const status: string | null = (
      document.getElementById("status") as HTMLSelectElement
    )?.value;
    const notes: string | null = (
      document.getElementById("notes") as HTMLInputElement
    )?.value;

    if (!studentId || !classInstance || !date || !status) {
      alert("Please fill all required fields.");
      return;
    }

    const data = {
      student: parseInt(studentId), // Student ID as integer
      class_instance: parseInt(classInstance), // Class instance as integer
      date: date,
      status: status,
      notes: notes || "",
    };

    try {
      await axios.post(
        "http://127.0.0.1:8000/api/academics/attendances/",
        data,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // Add new attendance record to the current state
      setAttendanceData((prevData) => [...prevData, data]);

      alert("Attendance submitted successfully!");
    } catch (error) {
      console.error("Error submitting attendance data:", error);
      alert("Error submitting attendance data. Please try again.");
    }
  };

  return (
    <div className="lg:ml-[16%] ml-[8%] mt-20 flex flex-col py-8">
      {/* Header */}
      <div className="w-full lg:w-[1068px] h-[42px] p-4 bg-white rounded-md flex items-center justify-between shadow-md mb-8">
        <span className="flex flex-row gap-2 text-[14px] lg:text-[18px] font-semibold text-gray-700">
          Attendance | Submit Attendance
        </span>
      </div>

      {/* Form for input data */}
      <div className="flex flex-col lg:w-[1068px] w-full p-6 bg-white rounded-lg shadow-md mb-10 space-y-4">
        {/* First Row */}
        <div className="flex flex-col lg:flex-row lg:space-x-4">
          {/* Student ID */}
          <div className="flex flex-col lg:w-1/3">
            <label
              htmlFor="studentId"
              className="text-sm font-medium text-gray-700"
            >
              Teacher ID (required)
            </label>
            <input
              id="teacherId"
              type="number"
              placeholder="Enter Student ID"
              className="w-full h-[40px] p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Class Instance */}
          <div className="flex flex-col lg:w-1/3">
            <label
              htmlFor="classInstance"
              className="text-sm font-medium text-gray-700"
            >
              Class Instance (required)
            </label>
            <input
              id="classInstance"
              type="number"
              placeholder="Enter Class Instance"
              className="w-full h-[40px] p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Date */}
          <div className="flex flex-col lg:w-1/3">
            <label htmlFor="date" className="text-sm font-medium text-gray-700">
              Date (required)
            </label>
            <input
              id="date"
              type="date"
              className="w-full h-[40px] p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Second Row (Status and Notes) */}
        <div className="flex flex-col lg:flex-row lg:space-x-4">
          {/* Status */}
          <div className="flex flex-col lg:w-1/3">
            <label
              htmlFor="status"
              className="text-sm font-medium text-gray-700"
            >
              Status (required)
            </label>
            <select
              id="status"
              className="w-full h-[40px] p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="present">Present</option>
              <option value="absent">Absent</option>
              <option value="late">Late</option>
            </select>
          </div>

          {/* Notes */}
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
              placeholder="Enter any notes"
              className="w-full h-[40px] p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Submit Button */}
        {/* Submit Button */}
        <div className="flex justify-center">
          <Button
            onClick={handleSubmitClick}
            className="lg:h-[40px] h-[40px] flex justify-center items-center px-6 py-2 bg-[#213458] text-white font-medium rounded hover:bg-[#213498]"
          >
            Submit
          </Button>
        </div>
      </div>

      {/* Display the new attendance and history */}
      {attendanceData.length > 0 && (
        <div className="lg:w-[1068px] w-full mt-8 bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">
            Attendance History
          </h3>
          <table className="min-w-full mt-4 border border-gray-300 rounded-lg">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-4 py-2 text-left text-sm text-gray-700">
                  Student ID
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
                  <td className="border px-4 py-2">{record.student}</td>
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
