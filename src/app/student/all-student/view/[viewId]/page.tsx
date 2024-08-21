'use client'
import React, { useState } from 'react';

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
    <div className="ml-[219px] mt-20 flex flex-col">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl mx-auto">
        <div className="flex items-center mb-4">
          <img
            src={student.profilePicture}
            alt={`${student.firstName} ${student.lastName}`}
            className="w-24 h-24 rounded-full mr-4"
          />
          <h2 className="text-2xl font-bold">
            {student.firstName} {student.lastName}
          </h2>
        </div>
        <div className="text-left">
          <p><strong>Age:</strong> {student.age}</p>
          <p><strong>Gender:</strong> {student.gender}</p>
          <p><strong>Admission Date:</strong> {student.admissionDate}</p>
          <p><strong>Class:</strong> {student.class}</p>
          <p><strong>Date of Birth:</strong> {student.dateOfBirth}</p>
          <p><strong>Address:</strong> {student.address}</p>
          <p><strong>Place of Birth:</strong> {student.placeOfBirth}</p>
          <p><strong>Nationality:</strong> {student.nationality}</p>
          <p><strong>Student Passport:</strong> {student.studentPassport}</p>
          <p><strong>Father's Name:</strong> {student.fatherName}</p>
          <p><strong>Father's Occupation:</strong> {student.fatherOccupation}</p>
          <p><strong>Father's Phone:</strong> {student.fatherPhone}</p>
          <p><strong>Mother's Name:</strong> {student.motherName}</p>
          <p><strong>Mother's Occupation:</strong> {student.motherOccupation}</p>
          <p><strong>Mother's Phone:</strong> {student.motherPhone}</p>
          <p><strong>Parent Contact:</strong> {student.parentContact}</p>
        </div>
      </div>
    </div>
  );
};

export default StudentPage;
