"use client";
import React, { useState, useEffect } from "react";
import Button from "@/components/Button";
import { useRouter } from "next/navigation";

const Page = () => {
  const router = useRouter();
  const [attendanceData, setAttendanceData] = useState<any[]>([]);
  const [filteredData, setFilteredData] = useState<any[]>([]); // For displaying filtered data
  const [token, setToken] = useState<string | null>(null); // Store auth token
  const [searchQuery, setSearchQuery] = useState<string>(""); // Store search input

  useEffect(() => {
    const tokenFromLocalStorage = localStorage.getItem("authToken");
    if (tokenFromLocalStorage) {
      setToken(tokenFromLocalStorage);
    } else {
      console.error("Token not found in localStorage.");
    }
  }, []);

  // Fetch attendance data (list of student attendance records)
  const fetchAttendanceData = async () => {
    if (!token) {
      console.error("Token is not available.");
      return;
    }

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
        throw new Error(`Failed to fetch attendance. Status code: ${response.status}`);
      }

      const data = await response.json();
      console.log("Fetched attendance data:", data);

      if (data.length > 0) {
        setAttendanceData(data);
        setFilteredData(data); // Initialize filtered data
      } else {
        console.warn("No attendance records found in the response.");
        setAttendanceData([]);
        setFilteredData([]);
      }
    } catch (error) {
      console.error("Error fetching attendance data:", error);
    }
  };

  useEffect(() => {
    if (token) {
      fetchAttendanceData();
    }
  }, [token]);

  // Add Student Button Click Handler
  const handleAddStudent = () => {
    router.push(`/attendance/student/add`);
  };

  // Handle Search Input
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    // Filter attendance data based on the query
    const filtered = attendanceData.filter((record) =>
      record.student_name.toLowerCase().includes(query)
    );
    setFilteredData(filtered);
  };

  return (
    <div className="lg:ml-[16%] ml-[8%] mt-20 flex flex-col py-8">
      {/* Page Header */}
      <div className="w-full lg:w-[1068px] h-[42px] p-4 bg-white rounded-md flex items-center justify-between shadow-md mb-8">
        <span className="flex flex-row gap-2 text-[14px] lg:text-[18px] font-semibold text-gray-700">
          Attendance | Student Attendance Records
        </span>
      </div>
      <div className="flex gap-28 items-center mb-4">
      <input
          type="text"
          placeholder="Search by student name"
          value={searchQuery}
          onChange={handleSearchChange}
          className="border border-gray-300 w-[434px] px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <Button
          onClick={handleAddStudent}
          className="bg-[#213458] text-white px-4 py-2 rounded hover:bg-blue-800"
        >
          Add Student
        </Button>
        {/* Search Input */}
        
      </div>
      {/* Attendance List */}
      {filteredData.length > 0 ? (
        <div className="lg:w-[1068px] w-full mt-8 bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Attendance Records</h3>
          <table className="min-w-full border border-gray-300 rounded-lg">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-4 py-2 text-left text-sm text-gray-700">Student Name</th>
                <th className="border px-4 py-2 text-left text-sm text-gray-700">Class</th>
                <th className="border px-4 py-2 text-left text-sm text-gray-700">Date</th>
                <th className="border px-4 py-2 text-left text-sm text-gray-700">Status</th>
                <th className="border px-4 py-2 text-left text-sm text-gray-700">Notes</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((record, index) => (
                <tr key={index} className="hover:bg-gray-100 transition-colors">
                  <td className="border px-4 py-2">{record.student_name || "Unknown Student"}</td>
                  <td className="border px-4 py-2">{record.class_name || "Unknown Class"}</td>
                  <td className="border px-4 py-2">{record.date}</td>
                  <td className="border px-4 py-2">{record.status_display || "No Status"}</td>
                  <td className="border px-4 py-2">{record.notes || "No Notes"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-gray-700 mt-4">No attendance records found.</p>
      )}
    </div>
  );
};

export default Page;
