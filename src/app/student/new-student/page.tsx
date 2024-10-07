'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Dropdown from '@/components/Dropdown';
import Button from '@/components/Button';
import axios from 'axios';
import { useRouter } from 'next/navigation';
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
    image: '',
  });
  const router= useRouter();
  const [classrooms, setClassrooms] = useState<Classroom[]>([]); 
  const [selectedClassroom, setSelectedClassroom] = useState<number | null>(null); 
  const [loading, setLoading] = useState<boolean>(true); 
  const [error, setError] = useState<string | null>(null); 
  const [imagePreview, setImagePreview] = useState<string | null>(null); 
  const [token, setToken] = useState<string | null>(null); // Store token here
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
    const fetchClassrooms = async () => {
      if(!token) return;
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/academics/classroom',{
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setClassrooms(response.data.results || []); // Assuming the response is paginated
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch classrooms');
        setLoading(false);
      }
    };

    fetchClassrooms();
  }, [token]);

  const handleClassroomChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedClassroom(parseInt(e.target.value, 10));
    setFormData((prevData) => ({ ...prevData, class: e.target.value }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file)); // Create a local URL to preview the selected image
      setFormData((prevFormData) => ({ ...prevFormData!, profile_picture: file.name }));
    }
  };
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!token) {
      alert('No authentication token found. Please log in.');
      router.push('/login');
      return;
    }
  
    const formDataToSubmit = new FormData();
    formDataToSubmit.append('first_name', formData.firstName);
    formDataToSubmit.append('last_name', formData.lastName);
    formDataToSubmit.append('age', formData.age);
    formDataToSubmit.append('gender', formData.gender);
    formDataToSubmit.append('admission_date', formData.admissionDate);
    formDataToSubmit.append('class', formData.class);
    formDataToSubmit.append('branch', formData.branch);
    formDataToSubmit.append('dob', formData.dob);
    formDataToSubmit.append('nationality', formData.nationality);
    formDataToSubmit.append('place_of_birth', formData.placeOfBirth);
    formDataToSubmit.append('belt_level', formData.beltLevel);
    formDataToSubmit.append('student_passport', formData.studentPassport);
    formDataToSubmit.append('address', formData.address);
    formDataToSubmit.append('father_name', formData.fatherName);
    formDataToSubmit.append('father_occupation', formData.fatherOccupation);
    formDataToSubmit.append('phone', formData.phone);
    formDataToSubmit.append('mother_name', formData.motherName);
    formDataToSubmit.append('mother_occupation', formData.motherOccupation);
    formDataToSubmit.append('parent_contact', formData.parentContact);
  
    // Append the image file to the formData (if it's been selected)
    if (formData.image) {
      formDataToSubmit.append('profile_picture', formData.image); // The key must match the backend's expected name
    }
  
    try {
      const response = await axios.post(
        'http://127.0.0.1:8000/api/academics/students/',
        formDataToSubmit,
        {
          headers: {
            'Content-Type': 'multipart/form-data', // Use multipart for file uploads
            Authorization: `Bearer ${token}`,  // Include the token
          },
        }
      );
      console.log('Response:', response.data);
      alert('Form submitted successfully!');
      router.push('/student/all-student');
    } catch (error) {
      console.error('Error submitting the form:', error); // Log the error for debugging
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
            <div>
              <label htmlFor="profile_picture" className="block text-sm font-medium text-gray-700">Profile Picture:</label>
              <input
                type="file"
                id="profile_picture"
                name="profile_picture"
                accept="image/*"
                onChange={handleFileChange}
                className="mt-1 block lg:w-[272px] w-[329px] h-[40px] rounded-md outline-none border-gray-300 shadow-sm"
              />
              {imagePreview && (
                <div className="mt-4">
                  <Image
                    src={imagePreview}
                    alt="Profile Preview"
                    width={192}
                    height={192}
                    className="rounded-full"
                  />
                </div>
              )}
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
