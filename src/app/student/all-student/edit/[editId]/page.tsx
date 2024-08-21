'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
interface Student {
  id: string;
  name: string;
}

const EditStudentPage: React.FC = () => {
  const { editId } = useParams(); // Correctly get the dynamic route parameter
  const router = useRouter(); // You can still use this for navigation if needed

  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (editId) {
      // Simulate a fetch call to get student data based on the ID
      const fetchStudent = async () => {
        // Simulated delay
        setTimeout(() => {
          // Example data fetching
          setStudent({ id: editId as string, name: 'John Doe' });
          setLoading(false);
        }, 1000);
      };

      fetchStudent();
    }
  }, [editId]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Simulate form submission logic
    alert(`Student ${student?.name} updated!`);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="ml-[219px] h-[1000px] mt-20 flex flex-col">
      <div className="w-[1079px] h-[40px] p-4 bg-white flex items-center rounded-md justify-between">
        <span className='flex flex-row gap-2'>Student | <Image src={"/home.svg"} width={15} height={15} alt="public"></Image>- Update Student</span>
        <Link href={"/#"} passHref>
            <div className="h-[23px] w-[57px] bg-[#213458] flex items-center justify-center rounded-md">
              <Image src={"/refresh.svg"} width={16} height={16} alt="Refresh" />
            </div>
          </Link>
      </div>

      <h1 className="text-center text-2xl font-bold mb-8 mt-2">Edit Information Student Form</h1>

      <form className="space-y-8" onSubmit={handleSubmit}>
      <section>
          <h2 className="text-xl font-semibold mb-4">Student Information</h2>
          <div className="grid grid-cols-3 gap-8">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                First Name:
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
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
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
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
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              />
            </div>

            <div>
              <label htmlFor="gender" className="block text-sm font-medium text-gray-700">
                Gender:
              </label>
              <select
                id="gender"
                name="gender"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              >
                <option>Female</option>
                <option>Male</option>
                <option>Other</option>
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
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
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
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              />
            </div>

            <div>
              <label htmlFor="branch" className="block text-sm font-medium text-gray-700">
                Branch:
              </label>
              <select
                id="branch"
                name="branch"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              >
                <option>Branch 1</option>
                <option>Branch 2</option>
                <option>Branch 3</option>
              </select>
            </div>

            <div>
              <label htmlFor="uploadPicture" className="block text-sm font-medium text-gray-700">
                Upload Picture:
              </label>
              <input
                type="file"
                id="uploadPicture"
                name="uploadPicture"
                className="mt-1 block w-full"
              />
            </div>
          </div>
        </section>

        {/* Other Information */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Other Information</h2>
          <div className="grid grid-cols-3 gap-8">
            <div>
              <label htmlFor="dob" className="block text-sm font-medium text-gray-700">
                Date of Birth:
              </label>
              <input
                type="date"
                id="dob"
                name="dob"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
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
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
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
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
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
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
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
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
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
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              />
            </div>
          </div>
        </section>

        {/* Contact Information */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
          <div className="grid grid-cols-3 gap-8">
            <div>
              <label htmlFor="fatherName" className="block text-sm font-medium text-gray-700">
                Father's Name:
              </label>
              <input
                type="text"
                id="fatherName"
                name="fatherName"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
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
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
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
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
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
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
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
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
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
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
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

export default EditStudentPage;
