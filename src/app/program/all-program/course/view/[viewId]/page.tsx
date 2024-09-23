"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Button from "@/components/Button";
import { useRouter } from "next/navigation";

interface EnrollmentData {
  id: number;
  student_name: string;
  enrollment_date: string;
  course_names: string[];
}

const Page = ( {params }: { params: { id: string } }) => {
  const router = useRouter();
  const Id = params.id; 
  const [enrollmentData, setEnrollmentData] = useState<EnrollmentData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEnrollmentData = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/academics/enrollment/${Id}");
        const data = await response.json();
        setEnrollmentData(data.results); // Assuming "results" contains the array of enrollments
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch data");
        setLoading(false);
      }
    };

    fetchEnrollmentData();
  }, []);

  const handleBack = () => {
    router.push(`/program/all-program`);
  };

  const handleRowClick = (id: number) => {
    router.push(`/program/all-program/course/view/${id}`);
  };

  return (
    <div className="lg:ml-[16%] ml-[11%] mt-20 flex flex-col">
      {/* Top navigation bar */}
      <div className="lg:w-[1068px] w-[330px] h-[42px] p-4 bg-white rounded-md flex items-center justify-between">
        <span className="flex flex-row lg:gap-3 gap-2 text-[12px] lg:text-[16px]">
          Course | 
          <Image src={"/home.svg"} width={15} height={15} alt="public" /> - Students
        </span>
        <Link href={"/#"} passHref>
          <div className="h-[23px] w-[57px] bg-[#1c2b47] flex items-center justify-center rounded-md">
            <Image src={"/refresh.svg"} width={16} height={16} alt="Refresh" />
          </div>
        </Link>
      </div>
      <div className="mt-4">
        <Button onClick={handleBack}>Back</Button>
      </div>

      {/* Table for displaying data */}
      <div className="lg:w-[1068px] w-[330px] mt-8">
        {loading ? (
          <p>Loading data...</p>
        ) : error ? (
          <p>{error}</p>
        ) : (
          <table className="table-auto border-collapse border border-gray-300 w-full">
            <thead>
              <tr>
                <th className="border border-gray-300 px-4 py-2">ID</th>
                <th className="border border-gray-300 px-4 py-2">Student Name</th>
                <th className="border border-gray-300 px-4 py-2">Enrollment Date</th>
                <th className="border border-gray-300 px-4 py-2">Course Names</th>
              </tr>
            </thead>
            <tbody>
              {enrollmentData.map((student) => (
                <tr
                  key={student.id}
                  onClick={() => handleRowClick(student.id)} // Make row clickable
                  className="cursor-pointer hover:bg-gray-100" // Optional styling for hover effect
                >
                  <td className="border border-gray-300 px-4 py-2">{student.id}</td>
                  <td className="border border-gray-300 px-4 py-2">{student.student_name}</td>
                  <td className="border border-gray-300 px-4 py-2">{student.enrollment_date}</td>
                  <td className="border border-gray-300 px-4 py-2">
                    {student.course_names.join(", ")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Page;
