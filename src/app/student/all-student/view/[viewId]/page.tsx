'use client'
import React, { useState } from 'react';
import Image from 'next/image';
interface Student {
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

const mockupStudent: Student = {
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
  profilePicture: '/photo.jpg', // Ensure this path is correct
};

const StudentPage = () => {
  const [student] = useState<Student>(mockupStudent);

  return (
    <div className="lg:ml-[219px] mt-20 flex flex-col">
      <div className="bg-white p-6 rounded-lg lg:gap-12 gap-4 flex lg:flex-row flex-col shadow-lg w-[345px] lg:w-[854px] max-w-2xl mx-auto">
        <div className="flex lg:items-start items-center flex-col mb-4 ml-4">
          <Image
            src={student.profilePicture}
            alt={`${student.firstName} ${student.lastName}`}
            width={48}
            height={48}
            className="lg:w-48 lg:h-48 w-16 h-16 mr-4"
          />
          <h3 className='mt-1 lg:ml-11 lg:font-bold mr-4 text-[12px] lg:text-[16px]'>{student.firstName} {student.lastName}</h3>
        </div>
        <div className="text-left">
          <h2 className="font-bold inline-block border-b-2 ml-28 lg:ml-0">About Me</h2>
          <p className='p-2 text-[12px] lg:text-[16px]'><strong>Age:</strong> {student.age}</p>
          <p className='p-2 text-[12px] lg:text-[16px]'><strong>Gender:</strong> {student.gender}</p>
          <p className='p-2 text-[12px] lg:text-[16px]'><strong>Admission Date:</strong> {student.admissionDate}</p>
          <p className='p-2 text-[12px] lg:text-[16px]'><strong>Class:</strong>{student.class}</p>
          <p className='p-2 text-[12px] lg:text-[16px]'><strong>Date of Birth:</strong> {student.dateOfBirth}</p>
          <p className='p-2 text-[12px] lg:text-[16px]'><strong>Address:</strong> {student.address}</p>
          <p className='p-2 text-[12px] lg:text-[16px]'><strong>Place of Birth:</strong> {student.placeOfBirth}</p>
          <p className='p-2 text-[12px] lg:text-[16px]'><strong>Nationality:</strong> {student.nationality}</p>
          <p className='p-2 text-[12px] lg:text-[16px]'><strong>Student Passport:</strong> {student.studentPassport}</p>
          <p className='p-2 text-[12px] lg:text-[16px]'><strong>Father's Name:</strong> {student.fatherName}</p>
          <p className='p-2 text-[12px] lg:text-[16px]'><strong>Father's Occupation:</strong> {student.fatherOccupation}</p>
          <p className='p-2 text-[12px] lg:text-[16px]'><strong>Father's Phone:</strong> {student.fatherPhone}</p>
          <p className='p-2 text-[12px] lg:text-[16px]'><strong>Mother's Name:</strong> {student.motherName}</p>
          <p className='p-2 text-[12px] lg:text-[16px]'><strong>Mother's Occupation:</strong> {student.motherOccupation}</p>
          <p className='p-2 text-[12px] lg:text-[16px]'><strong>Mother's Phone:</strong> {student.motherPhone}</p>
          <p className='p-2 text-[12px] lg:text-[16px]'><strong>Parent Contact:</strong> {student.parentContact}</p>
        </div>
      </div>
    </div>
  );
};

export default StudentPage;
