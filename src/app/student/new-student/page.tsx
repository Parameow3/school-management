'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Dropdown from '@/components/Dropdown';
import Button from '@/components/Button';
import axios from 'axios'; // Import axios to make HTTP requests

// Define the Classroom interface to match the structure of the API response
interface Classroom {
  id: number;
  name: string;
}

const Page = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    age: '',
    gender: 'Female',
    admissionDate: '',
    class: '',
    branch: '',
    dob: '',
    nationality: '',
    placeOfBirth: '',
    beltLevel: '',
    studentPassport: '',
    address: '',
    fatherName: '',
    fatherOccupation: '',
    phone: '',
    motherName: '',
    motherOccupation: '',
    parentContact: '',
  });

  // Correctly define classrooms with the Classroom type
  const [classrooms, setClassrooms] = useState<Classroom[]>([]); 
  const [selectedClassroom, setSelectedClassroom] = useState<number | null>(null); 
  const [loading, setLoading] = useState<boolean>(true); 
  const [error, setError] = useState<string | null>(null); 

  // Fetch classrooms from the API
  useEffect(() => {
    const fetchClassrooms = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/academics/classroom/?page=1');
        setClassrooms(response.data.results || []); // Assuming the response is paginated
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch classrooms');
        setLoading(false);
      }
    };

    fetchClassrooms();
  }, []);

  const handleClassroomChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedClassroom(parseInt(e.target.value, 10));
    setFormData((prevData) => ({ ...prevData, class: e.target.value }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Submitted data:", formData);
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/academics/students/', {
        first_name: formData.firstName,
        last_name: formData.lastName,
        age: formData.age,
        gender: formData.gender,
        admission_date: formData.admissionDate,
        class: formData.class,
        branch: formData.branch,
        dob: formData.dob,
        nationality: formData.nationality,
        place_of_birth: formData.placeOfBirth,
        belt_level: formData.beltLevel,
        student_passport: formData.studentPassport,
        address: formData.address,
        father_name: formData.fatherName,
        father_occupation: formData.fatherOccupation,
        phone: formData.phone,
        mother_name: formData.motherName,
        mother_occupation: formData.motherOccupation,
        parent_contact: formData.parentContact,
      }, {
        headers: {
          'Content-Type': 'application/json', // Sending JSON data
        },
      });

      console.log('Response:', response.data);
      alert('Form submitted successfully!');
    } catch (error) {
      console.error('Error submitting the form:', error);
      alert('Failed to submit the form.');
    }
  };

  return (
    <div className="lg:ml-[18%] ml-[11%] mt-20 h-[1040px] flex flex-col">
      <div className="lg:w-[1040px] w-[330px] h-[40px] p-4 bg-white flex items-center rounded-md justify-between">
        <span className="flex flex-row gap-2 text-[12px] lg:text-[15px]">
          Student | <Image src="/home.svg" width={15} height={15} alt="public" /> New-student
        </span>

        <Link href="/#" passHref>
          <div className="h-[23px] w-[57px] bg-[#213458] flex items-center justify-center rounded-md">
            <Image src="/refresh.svg" width={16} height={16} alt="Refresh" />
          </div>
        </Link>
      </div>

      <h1 className="text-center text-2xl font-bold mb-8 mt-4 border-b-2">Admission Form</h1>

      <form className="space-y-8" onSubmit={handleSubmit}>
        {/* Student Information */}
        <section>
          <h2 className="text-2xl font-bold mb-8 lg:mt-4 border-b-2">Student Information</h2>
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
                className="mt-1 block lg:w-[272px] w-[329px] h-[40px] rounded-md outline-none border-gray-300 shadow-sm bg-white text-black"
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
                className="mt-1 block lg:w-[272px] w-[329px] h-[40px] rounded-md outline-none border-gray-300 shadow-sm bg-white text-black"
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
                className="mt-1 block lg:w-[272px] w-[329px] h-[40px] rounded-md outline-none border-gray-300 shadow-sm"
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
                className="mt-1 block lg:w-[272px] w-[329px] h-[40px] rounded-md outline-none border-gray-300 shadow-sm"
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
                className="mt-1 block lg:w-[272px] w-[329px] h-[40px] rounded-md outline-none border-gray-300 shadow-sm"
              />
            </div>

            <div>
              <label htmlFor="classroom" className="block text-sm font-medium text-gray-700">
                Classroom:
              </label>
              <select
                id="classroom"
                name="classroom"
                value={selectedClassroom || ''}
                onChange={handleClassroomChange}
                className="mt-1 block lg:w-[272px] w-[329px] h-[40px] rounded-md border-gray-300 shadow-sm"
              >
                <option value="" disabled>
                  Select a classroom
                </option>
                {classrooms.map((classroom) => (
                  <option key={classroom.id} value={classroom.id}>
                    {classroom.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="branch" className="block text-sm font-medium text-gray-700">
                Branch:
              </label>
              <Dropdown onChange={(value: any) => setFormData({ ...formData, branch: value })} />
            </div>
          </div>
        </section>

        {/* Other Information */}
        <section>
          <h2 className="text-2xl font-bold mb-8 mt-4 border-b-2">Other Information</h2>
          <div className="grid lg:grid-cols-3 flex-col gap-8">
            <div>
              <label htmlFor="dob" className="block text-sm font-medium text-gray-700">
                Date of Birth:
              </label>
              <input
                type="date"
                id="dob"
                name="dob"
                value={formData.dob}
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
                className="mt-1 block lg:w-[272px] w-[329px] h-[40px] rounded-md outline-none border-gray-300 shadow-sm"
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
                className="mt-1 block lg:w-[272px] w-[329px] h-[40px] rounded-md outline-none border-gray-300 shadow-sm"
              />
            </div>

            <div>
              <label htmlFor="beltLevel" className="block text-sm font-medium text-gray-700">
                Belt Level:
              </label>
              <input
                type="text"
                id="beltLevel"
                name="beltLevel"
                value={formData.beltLevel}
                onChange={handleChange}
                className="mt-1 block lg:w-[272px] w-[329px] h-[40px] rounded-md outline-none border-gray-300 shadow-sm"
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
                className="mt-1 block lg:w-[272px] w-[329px] h-[40px] rounded-md outline-none border-gray-300 shadow-sm"
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
                className="mt-1 block lg:w-[272px] w-[329px] h-[40px] rounded-md outline-none border-gray-300 shadow-sm"
              />
            </div>
          </div>
        </section>

        {/* Contact Information */}
        <section>
          <h2 className="text-xl font-semibold mb-4 border-b-2">Contact Information</h2>
          <div className="grid lg:grid-cols-3 flex-col gap-8">
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
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                Phone:
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
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

        {/* Form Actions */}
        <div className="flex justify-center items-center space-x-4">
          <Button bg="secondary">Cancel</Button>
          <Button>Submit</Button>
        </div>
      </form>
    </div>
  );
};

export default Page;
