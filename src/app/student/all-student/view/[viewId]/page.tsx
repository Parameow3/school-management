'use client';
import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';

interface Student {
  id: number;
  firstName: string;
  lastName: string;
  age: number;
  gender: string;
  admissionDate: string;
  class: string;
  dateOfBirth: string;
  address: string;
  placeOfBirth: string;
  nationality: string;
  studentPassport: string;
  fatherName: string;
  fatherOccupation: string;
  fatherPhone: string;
  motherName: string;
  motherOccupation: string;
  motherPhone: string;
  parentContact: string;
  profilePicture: string;
}

const mockupStudents: Student[] = [
  {
    id: 1,
    firstName: 'Lyseth',
    lastName: 'Pham',
    age: 12,
    gender: 'Female',
    admissionDate: '2024-08-12',
    class: 'Robotics',
    dateOfBirth: '2012-04-12',
    address: '1234 Example St, Example City',
    placeOfBirth: 'Example City',
    nationality: 'Example Nation',
    studentPassport: 'X987654321',
    fatherName: 'Sok',
    fatherOccupation: 'Business Man',
    fatherPhone: '098465473',
    motherName: 'Sok',
    motherOccupation: 'Business Woman',
    motherPhone: '098465473',
    parentContact: '098465473',
    profilePicture: '/photo.jpg',
  },
  {
    id: 2,
    firstName: 'John',
    lastName: 'Doe',
    age: 14,
    gender: 'Male',
    admissionDate: '2023-09-01',
    class: 'Mathematics',
    dateOfBirth: '2010-06-15',
    address: '5678 Another St, Another City',
    placeOfBirth: 'Another City',
    nationality: 'Another Nation',
    studentPassport: 'A123456789',
    fatherName: 'Jane',
    fatherOccupation: 'Engineer',
    fatherPhone: '0912345678',
    motherName: 'Anna',
    motherOccupation: 'Teacher',
    motherPhone: '0912345678',
    parentContact: '0912345678',
    profilePicture: '/photo.jpg',
  }
];

const StudentPage = () => {
  const params = useParams();
  const id = parseInt(params.viewId as string, 10);
  console.log("id",id)
  const selectedStudent = mockupStudents.find((item) => {
  if(item.id === id){
    return item;
  }
  }
);

  if (!selectedStudent) {
    return <div className="text-center mt-20">Student not found</div>;
  }

  return (
    <div className="lg:ml-[219px] mt-20 flex flex-col">
      <div className="bg-white p-6 rounded-lg lg:gap-12 gap-4 flex lg:flex-row flex-col shadow-lg w-[345px] lg:w-[854px] max-w-2xl mx-auto">
        <div className="flex lg:items-start items-center flex-col mb-4 ml-4">
          <Image
            src={selectedStudent.profilePicture}
            alt={`${selectedStudent.firstName} ${selectedStudent.lastName}`}
            width={192} 
            height={192}
            className="lg:w-48 lg:h-48 w-16 h-16 mr-4 object-cover"
          />
          <h3 className='mt-1 lg:ml-11 lg:font-bold mr-4 text-[12px] lg:text-[16px]'>
            {selectedStudent.firstName} {selectedStudent.lastName}
          </h3>
        </div>
        <div className="text-left">
          <h2 className="font-bold inline-block border-b-2 ml-28 lg:ml-0">About Me</h2>
          <p className='p-2 text-[12px] lg:text-[16px]'><strong>Age:</strong> {selectedStudent.age}</p>
          <p className='p-2 text-[12px] lg:text-[16px]'><strong>Gender:</strong> {selectedStudent.gender}</p>
          <p className='p-2 text-[12px] lg:text-[16px]'><strong>Admission Date:</strong> {selectedStudent.admissionDate}</p>
          <p className='p-2 text-[12px] lg:text-[16px]'><strong>Class:</strong> {selectedStudent.class}</p>
          <p className='p-2 text-[12px] lg:text-[16px]'><strong>Date of Birth:</strong> {selectedStudent.dateOfBirth}</p>
          <p className='p-2 text-[12px] lg:text-[16px]'><strong>Address:</strong> {selectedStudent.address}</p>
          <p className='p-2 text-[12px] lg:text-[16px]'><strong>Place of Birth:</strong> {selectedStudent.placeOfBirth}</p>
          <p className='p-2 text-[12px] lg:text-[16px]'><strong>Nationality:</strong> {selectedStudent.nationality}</p>
          <p className='p-2 text-[12px] lg:text-[16px]'><strong>Student Passport:</strong> {selectedStudent.studentPassport}</p>
          <p className='p-2 text-[12px] lg:text-[16px]'><strong>Father's Name:</strong> {selectedStudent.fatherName}</p>
          <p className='p-2 text-[12px] lg:text-[16px]'><strong>Father's Occupation:</strong> {selectedStudent.fatherOccupation}</p>
          <p className='p-2 text-[12px] lg:text-[16px]'><strong>Father's Phone:</strong> {selectedStudent.fatherPhone}</p>
          <p className='p-2 text-[12px] lg:text-[16px]'><strong>Mother's Name:</strong> {selectedStudent.motherName}</p>
          <p className='p-2 text-[12px] lg:text-[16px]'><strong>Mother's Occupation:</strong> {selectedStudent.motherOccupation}</p>
          <p className='p-2 text-[12px] lg:text-[16px]'><strong>Mother's Phone:</strong> {selectedStudent.motherPhone}</p>
          <p className='p-2 text-[12px] lg:text-[16px]'><strong>Parent Contact:</strong> {selectedStudent.parentContact}</p>
        </div>
      </div>
    </div>
  );
};

export default StudentPage;
