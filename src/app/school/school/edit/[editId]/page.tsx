'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useRouter, useSearchParams } from 'next/navigation';

interface SchoolData {
  name: string;
  address: string;
  phone_number?: string;
  email?: string;
  established_date?: string;
  website?: string;
}

const Page: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const schoolId = parseInt(params.editId as string, 10);
// Assume you're passing school id in the URL as a query param
  console.log("SchoolId",schoolId)
  const [formData, setFormData] = useState<SchoolData>({
    name: '',
    address: '',
    phone_number: '',
    email: '',
    established_date: '',
    website: ''
  });
  const [loading, setLoading] = useState<boolean>(true); // Make sure to check loading state
  const [error, setError] = useState<string>('');

  // Fetch the school data when the component mounts (for editing)
  useEffect(() => {
    if (schoolId) {
      const fetchSchool = async () => {
        try {
          const token = localStorage.getItem('authToken'); // Ensure the token is stored under 'token'

          const response = await axios.get(`http://127.0.0.1:8000/api/schools/${schoolId}/`,
            {
            
              headers: {
                Authorization: `Bearer ${token}`, // Add the token to the Authorization header
              },
            
          });
          setFormData(response.data);
          setLoading(false); // Stop loading once data is fetched
        } catch (err) {
          setError('Failed to fetch school data.');
          setLoading(false); // Stop loading in case of error
        }
      };
      fetchSchool();
    }
  }, [schoolId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const validateForm = (): boolean => {
    if (!formData.name || formData.name.length < 1 || formData.name.length > 255) {
      setError('Name is required and must be between 1 and 255 characters.');
      return false;
    }
    if (!formData.address || formData.address.length < 1) {
      setError('Address is required.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const token = localStorage.getItem('authToken'); // Ensure the token is stored under 'token'

      await axios.put(`http://127.0.0.1:8000/api/schools/${schoolId}/`, formData,
        {
          headers: {
          Authorization: `Bearer ${token}`, // Add the token to the Authorization header
        },
      }
      );
      router.push("/school/school");
      alert('School updated successfully!');
      setError('');
    } catch (err: any) {
      setError('Failed to update data. Please check the server and data.');
      console.error(err.response ? err.response.data : err.message);  // Log the actual error from the server
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white shadow-lg rounded-lg p-6 mt-24">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Edit School</h2>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
            Name:
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="address">
            Address:
          </label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="phone_number">
            Phone Number:
          </label>
          <input
            type="text"
            name="phone_number"
            value={formData.phone_number}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
            Email:
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="established_date">
            Established Date:
          </label>
          <input
            type="date"
            name="established_date"
            value={formData.established_date}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="website">
            Website:
          </label>
          <input
            type="url"
            name="website"
            value={formData.website}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          type="submit"
          className=" bg-[#213458] hover:bg-[#213498] text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default Page;
