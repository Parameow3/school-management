"use client";
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import axios from 'axios';
import { useRouter } from "next/navigation";

interface Student {
  id: number;
  first_name: string;
  last_name: string;
  age: number;
  gender: string;
  admissionDate: string;
  belt_level: string; 
  dob: string;
  address: string;
  pob: string; // Place of birth
  nationality: string;
  studentPassport: string;
  fatherName: string;
  fatherOccupation: string;
  fatherPhone?: string; 
  motherName: string;
  motherOccupation: string;
  motherPhone?: string; 
  parentContact: string;
  profilePicture?: string;
}

const Page = () => {
  const router = useRouter();
  const { viewId } = useParams(); // Get the student ID from the URL
  const [student, setStudent] = useState<Student | null>(null); // Initialize as null
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const tokenFromLocalStorage = localStorage.getItem("authToken");
    if (tokenFromLocalStorage) {
      setToken(tokenFromLocalStorage);
    } else {
      // Redirect to login if no token
      router.push("/login");
    }
  }, [router]);

  useEffect(() => {
    const fetchStudent = async () => {
      if (!token) return; // Ensure token is available before making API request

      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/academics/students/${viewId}`, 
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        ); // Fetch data using student ID
        const data = response.data;

        const mappedStudent: Student = {
          id: data.id,
          first_name: data.first_name,
          last_name: data.last_name,
          age: data.age,
          gender: data.gender,
          admissionDate: data.admission_date,
          belt_level: data.belt_level || '', // Optional field
          dob: data.dob,
          address: data.address,
          pob: data.pob, // Place of birth
          nationality: data.nationality,
          studentPassport: data.student_passport,
          fatherName: data.father_name,
          fatherOccupation: data.father_occupation,
          fatherPhone: data.father_phone || '', // Optional field
          motherName: data.mother_name,
          motherOccupation: data.mother_occupation,
          motherPhone: data.mother_phone || '', // Optional field
          parentContact: data.parent_contact,
          profilePicture: data.image || '/default-photo.jpg', // Fallback if no profile picture
        };

        setStudent(mappedStudent);
        setIsLoading(false);
      } catch (error: any) {
        setError("Failed to load student");
        setIsLoading(false);
      }
    };
    fetchStudent();
  }, [viewId, token]);

  if (isLoading) {
    return <div className="text-center mt-20">Loading...</div>;
  }

  if (error) {
    return <div className="text-center mt-20">{error}</div>;
  }

  if (!student) {
    return <div className="text-center mt-20">Student not found</div>;
  }

  return (
    <div className="lg:ml-[219px] mt-20 flex flex-col">
      <div className="bg-white p-6 rounded-lg lg:gap-12 gap-4 flex lg:flex-row flex-col shadow-lg w-[345px] lg:w-[854px] max-w-2xl mx-auto">
        <div className="flex lg:items-start items-center flex-col mb-4 ml-4">
          <Image
            src={student.profilePicture || '/default-photo.jpg'}
            alt={`${student.first_name} ${student.last_name}`}
            width={192}
            height={192}
            className="lg:w-48 lg:h-48 w-16 h-16 mr-4 object-cover"
          />
          <h3 className="mt-1 lg:ml-11 lg:font-bold mr-4 text-[12px] lg:text-[16px]">
            {student.last_name} {student.first_name}
          </h3>
        </div>
        <div className="text-left">
          <h2 className="font-bold inline-block border-b-2 ml-28 lg:ml-0">About Me</h2>

          <p className="p-2 text-[12px] lg:text-[16px]"><strong>First Name:</strong> {student.first_name}</p>
          <p className="p-2 text-[12px] lg:text-[16px]"><strong>Last Name:</strong> {student.last_name}</p>
          <p className="p-2 text-[12px] lg:text-[16px]"><strong>Age:</strong> {student.age}</p>
          <p className="p-2 text-[12px] lg:text-[16px]"><strong>Gender:</strong> {student.gender}</p>
          <p className="p-2 text-[12px] lg:text-[16px]"><strong>Admission Date:</strong> {student.admissionDate}</p>

          {student.belt_level && (
            <p className="p-2 text-[12px] lg:text-[16px]"><strong>Belt Level:</strong> {student.belt_level}</p>
          )}

          <p className="p-2 text-[12px] lg:text-[16px]"><strong>Date of Birth:</strong> {student.dob}</p>
          <p className="p-2 text-[12px] lg:text-[16px]"><strong>Address:</strong> {student.address}</p>
          <p className="p-2 text-[12px] lg:text-[16px]"><strong>Place of Birth:</strong> {student.pob}</p>
          <p className="p-2 text-[12px] lg:text-[16px]"><strong>Nationality:</strong> {student.nationality}</p>
          <p className="p-2 text-[12px] lg:text-[16px]"><strong>Student Passport:</strong> {student.studentPassport}</p>

          <p className="p-2 text-[12px] lg:text-[16px]"><strong>Father's Name:</strong> {student.fatherName}</p>
          <p className="p-2 text-[12px] lg:text-[16px]"><strong>Father's Occupation:</strong> {student.fatherOccupation}</p>

          {student.fatherPhone && (
            <p className="p-2 text-[12px] lg:text-[16px]"><strong>Father's Phone:</strong> {student.fatherPhone}</p>
          )}

          <p className="p-2 text-[12px] lg:text-[16px]"><strong>Mother's Name:</strong> {student.motherName}</p>
          <p className="p-2 text-[12px] lg:text-[16px]"><strong>Mother's Occupation:</strong> {student.motherOccupation}</p>

          {student.motherPhone && (
            <p className="p-2 text-[12px] lg:text-[16px]"><strong>Mother's Phone:</strong> {student.motherPhone}</p>
          )}

          <p className="p-2 text-[12px] lg:text-[16px]"><strong>Parent Contact:</strong> {student.parentContact}</p>
        </div>
      </div>
    </div>
  );
};

export default Page;
