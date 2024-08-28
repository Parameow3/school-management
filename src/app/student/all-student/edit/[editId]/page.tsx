"use client";
import React, { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

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
    firstName: "Lyseth",
    lastName: "Pham",
    age: 12,
    gender: "Female",
    admissionDate: "2024-08-12",
    class: "Robotics",
    dateOfBirth: "2012-04-12",
    address: "1234 Example St, Example City",
    placeOfBirth: "Example City",
    nationality: "Example Nation",
    studentPassport: "X987654321",
    fatherName: "Sok",
    fatherOccupation: "Business Man",
    fatherPhone: "098465473",
    motherName: "Sok",
    motherOccupation: "Business Woman",
    motherPhone: "098465473",
    parentContact: "098465473",
    profilePicture: "/photo.jpg",
  },
  {
    id: 2,
    firstName: "John",
    lastName: "Doe",
    age: 14,
    gender: "Male",
    admissionDate: "2023-09-01",
    class: "Mathematics",
    dateOfBirth: "2010-06-15",
    address: "5678 Another St, Another City",
    placeOfBirth: "Another City",
    nationality: "Another Nation",
    studentPassport: "A123456789",
    fatherName: "Jane",
    fatherOccupation: "Engineer",
    fatherPhone: "0912345678",
    motherName: "Anna",
    motherOccupation: "Teacher",
    motherPhone: "0912345678",
    parentContact: "0912345678",
    profilePicture: "/photo.jpg",
  },
];

const Page = () => {
  const params = useParams();
  const id = parseInt(params.editId as string, 10);
  console.log("id", id);

  // Always call the useState hook before any conditional return
  const selectedStudent = mockupStudents.find((item) => item.id === id);

  const [formData, setFormData] = useState({
    firstName: selectedStudent?.firstName || "",
    lastName: selectedStudent?.lastName || "",
    age: selectedStudent?.age || "",
    gender: selectedStudent?.gender || "Female",
    admissionDate: selectedStudent?.admissionDate || "",
    class: selectedStudent?.class || "",
    dateOfBirth: selectedStudent?.dateOfBirth || "",
    address: selectedStudent?.address || "",
    placeOfBirth: selectedStudent?.placeOfBirth || "",
    nationality: selectedStudent?.nationality || "",
    studentPassport: selectedStudent?.studentPassport || "",
    fatherName: selectedStudent?.fatherName || "",
    fatherOccupation: selectedStudent?.fatherOccupation || "",
    fatherPhone: selectedStudent?.fatherPhone || "",
    motherName: selectedStudent?.motherName || "",
    motherOccupation: selectedStudent?.motherOccupation || "",
    motherPhone: selectedStudent?.motherPhone || "",
    parentContact: selectedStudent?.parentContact || "",
    profilePicture: selectedStudent?.profilePicture || "",
    uploadPicture: "",
  });

  if (!selectedStudent) {
    return <div className="text-center mt-20">Student not found</div>;
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, uploadPicture: file.name });
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(formData);
  };

  return (
    <div className="lg:ml-[219px] mt-20 flex flex-col">
      <div className="lg:w-[1079px] w-[330px] h-[40px] p-4 bg-white flex items-center rounded-md justify-between">
        <span className="flex flex-row gap-2 text-[12px] lg:text-[16px]">
          Student | <Image src={"/home.svg"} width={15} height={15} alt="public" />{" "}
          - Update Student
        </span>
        <Link href={"/#"} passHref>
          <div className="h-[23px] w-[57px] bg-[#213458] flex items-center justify-center rounded-md">
            <Image src={"/refresh.svg"} width={16} height={16} alt="Refresh" />
          </div>
        </Link>
      </div>

      <h1 className="text-center lg:text-2xl text-[16px] font-bold mb-8 mt-4 lg:mt-2 border-b-2">
        Edit Information Student Form
      </h1>

      <form className="space-y-8" onSubmit={handleSubmit}>
        <section>
          <h2 className="lg:text-xl text-[16px] font-semibold  mb-4">Student Information</h2>
          <div className="grid lg:grid-cols-3 flex-col gap-8">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                First Name:
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="mt-1 block lg:w-[272px] w-[329px] outline-none h-[40px] rounded-md border-gray-300 shadow-sm"
              />
            </div>
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                Last Name:
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="mt-1 block lg:w-[272px] w-[329px] outline-none h-[40px] rounded-md border-gray-300 shadow-sm"
              />
            </div>

            <div>
              <label htmlFor="age" className="block text-sm font-medium text-gray-700">
                Age:
              </label>
              <input
                type="text"
                id="age"
                name="age"
                value={formData.age}
                onChange={handleChange}
                className="mt-1 block lg:w-[272px] w-[329px] outline-none h-[40px] rounded-md border-gray-300 shadow-sm"
              />
            </div>

            <div>
              <label htmlFor="gender" className="block text-sm font-medium text-gray-700">
                Gender:
              </label>
              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="mt-1 block lg:w-[272px] w-[329px] outline-none h-[40px] rounded-md border-gray-300 shadow-sm"
              >
                <option value="Female">Female</option>
                <option value="Male">Male</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label htmlFor="admissionDate" className="block text-sm font-medium text-gray-700">
                Admission Date:
              </label>
              <input
                type="date"
                id="admissionDate"
                name="admissionDate"
                value={formData.admissionDate}
                onChange={handleChange}
                className="mt-1 block lg:w-[272px] w-[329px] outline-none h-[40px] rounded-md border-gray-300 shadow-sm"
              />
            </div>

            <div>
              <label htmlFor="class" className="block text-sm font-medium text-gray-700">
                Class:
              </label>
              <input
                type="text"
                id="class"
                name="class"
                value={formData.class}
                onChange={handleChange}
                className="mt-1 block lg:w-[272px] w-[329px] h-[40px] outline-none rounded-md border-gray-300 shadow-sm"
              />
            </div>

            <div>
              <label htmlFor="placeOfBirth" className="block text-sm font-medium text-gray-700">
                Place of Birth:
              </label>
              <input
                type="text"
                id="placeOfBirth"
                name="placeOfBirth"
                value={formData.placeOfBirth}
                onChange={handleChange}
                className="mt-1 block lg:w-[272px] w-[329px] h-[40px] outline-none rounded-md border-gray-300 shadow-sm"
              />
            </div>

            <div>
              <label htmlFor="nationality" className="block text-sm font-medium text-gray-700">
                Nationality:
              </label>
              <input
                type="text"
                id="nationality"
                name="nationality"
                value={formData.nationality}
                onChange={handleChange}
                className="mt-1 block lg:w-[272px] w-[329px] h-[40px] outline-none rounded-md border-gray-300 shadow-sm"
              />
            </div>

            <div>
              <label htmlFor="studentPassport" className="block text-sm font-medium text-gray-700">
                Student Passport:
              </label>
              <input
                type="text"
                id="studentPassport"
                name="studentPassport"
                value={formData.studentPassport}
                onChange={handleChange}
                className="mt-1 block lg:w-[272px] w-[329px] h-[40px] outline-none rounded-md border-gray-300 shadow-sm"
              />
            </div>

            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                Address:
              </label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="mt-1 block lg:w-[272px] w-[329px] h-[40px] outline-none rounded-md border-gray-300 shadow-sm"
              />
            </div>

            <div>
              <label htmlFor="uploadPicture" className="block text-sm font-medium text-gray-700">
                Upload Picture:
              </label>
              <input
                type="file"
                id="uploadPicture"
                name="uploadPicture"
                onChange={handleFileChange}
                className="mt-1 block lg:w-[272px] w-[329px] h-[40px] outline-none"
              />
            </div>
          </div>
        </section>

        {/* Contact Information */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
          <div className="grid lg:grid-cols-3 flex-row gap-8">
            <div>
              <label htmlFor="fatherName" className="block text-sm font-medium text-gray-700">
                Father's Name:
              </label>
              <input
                type="text"
                id="fatherName"
                name="fatherName"
                value={formData.fatherName}
                onChange={handleChange}
                className="mt-1 block lg:w-[272px] w-[329px] h-[40px] outline-none rounded-md border-gray-300 shadow-sm"
              />
            </div>

            <div>
              <label htmlFor="fatherOccupation" className="block text-sm font-medium text-gray-700">
                Father's Occupation:
              </label>
              <input
                type="text"
                id="fatherOccupation"
                name="fatherOccupation"
                value={formData.fatherOccupation}
                onChange={handleChange}
                className="mt-1 block lg:w-[272px] w-[329px] h-[40px] outline-none rounded-md border-gray-300 shadow-sm"
              />
            </div>

            <div>
              <label htmlFor="fatherPhone" className="block text-sm font-medium text-gray-700">
                Father's Phone:
              </label>
              <input
                type="tel"
                id="fatherPhone"
                name="fatherPhone"
                value={formData.fatherPhone}
                onChange={handleChange}
                className="mt-1 block lg:w-[272px] w-[329px] h-[40px] outline-none rounded-md border-gray-300 shadow-sm"
              />
            </div>

            <div>
              <label htmlFor="motherName" className="block text-sm font-medium text-gray-700">
                Mother's Name:
              </label>
              <input
                type="text"
                id="motherName"
                name="motherName"
                value={formData.motherName}
                onChange={handleChange}
                className="mt-1 block lg:w-[272px] w-[329px] h-[40px] outline-none rounded-md border-gray-300 shadow-sm"
              />
            </div>

            <div>
              <label htmlFor="motherOccupation" className="block text-sm font-medium text-gray-700">
                Mother's Occupation:
              </label>
              <input
                type="text"
                id="motherOccupation"
                name="motherOccupation"
                value={formData.motherOccupation}
                onChange={handleChange}
                className="mt-1 block lg:w-[272px] w-[329px] h-[40px] outline-none rounded-md border-gray-300 shadow-sm"
              />
            </div>

            <div>
              <label htmlFor="motherPhone" className="block text-sm font-medium text-gray-700">
                Mother's Phone:
              </label>
              <input
                type="tel"
                id="motherPhone"
                name="motherPhone"
                value={formData.motherPhone}
                onChange={handleChange}
                className="mt-1 block lg:w-[272px] w-[329px] h-[40px] outline-none rounded-md border-gray-300 shadow-sm"
              />
            </div>

            <div>
              <label htmlFor="parentContact" className="block text-sm font-medium text-gray-700">
                Parent Contact:
              </label>
              <input
                type="text"
                id="parentContact"
                name="parentContact"
                value={formData.parentContact}
                onChange={handleChange}
                className="mt-1 block lg:w-[272px] w-[329px] h-[40px] outline-none rounded-md border-gray-300 shadow-sm"
              />
            </div>
          </div>
        </section>
        <div className="flex items-center justify-center space-x-4">
          <button
            type="button"
            className="inline-flex justify-center rounded-md border border-transparent bg-red-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default Page;
