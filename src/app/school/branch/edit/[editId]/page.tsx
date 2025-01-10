'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useRouter, useSearchParams } from 'next/navigation';


interface School {
  id: number;
  name: string;
  address: string;
  email: string | null;
  established_date: string;
  phone_number: string;
  schoolweb: string | null;
}

interface BranchData {
    id: number;
    name: string;
    address: string;
    phone_number: string ;
    email: string ;
    location: string;
    school_id:string;
    school_name:string;
    user_id: string;
    user_name: string;
}

interface User {
  id: number;
  username: string;
  email: string;
}
const Page: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const branchId = parseInt(params.editId as string, 10);
// Assume you're passing school id in the URL as a query param
  console.log("branchId",branchId)
  const [formData, setFormData] = useState<BranchData>({
    id: 0,
    name: '',
    address: '',
    phone_number: '',
    email: '',
    location: '',
    school_id: '',
    user_id: '',
    user_name: '', 
    school_name: '',
  });

  const [loading, setLoading] = useState<boolean>(true); // Make sure to check loading state
  const [error, setError] = useState<string>('');
  const [userId, setUserId] = useState<number | null>(null);
  const [users, setUsers] = useState<User[]>([]); // Initialize as an empty array
  const [selectedSchool, setSelectedSchool] = useState<number | null>(null);
  const [schools, setSchools] = useState<School[]>([]);


  // Fetch the school data when the component mounts (for editing)
  useEffect(() => {
    if (branchId) {
      const fetchSchool = async () => {
        try {
          const token = localStorage.getItem('authToken'); // Ensure the token is stored under 'token'

          const response = await axios.get(`http://127.0.0.1:8000/api/branches/${branchId}/`,
            {
            
              headers: {
                Authorization: `Bearer ${token}`, // Add the token to the Authorization header
              },
            
          });
          const userResponse = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/user?role_name=admin`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          const schoolResponse = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/schools/`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setSchools(schoolResponse.data.results);
             
          console.log("Users data:", userResponse.data.results); // Log the response to debug
          if (Array.isArray(userResponse.data.results)) {
            setUsers(userResponse.data.results);
          } else {
            console.error("Users API response is not an array");
          }

          console.log(response.data)
          setFormData(response.data);
          setLoading(false); // Stop loading once data is fetched
        } catch (err) {
          setError('Failed to fetch branch data.');
          setLoading(false); // Stop loading in case of error
        }

      };
      fetchSchool();
    }
  }, [branchId]);

  console.log(users)


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSchoolChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = Number(e.target.value);
    setSelectedSchool(selectedId);
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
      console.log("dadwdw" , formData.phone_number)
      await axios.put(`http://127.0.0.1:8000/api/branches/${branchId}/`, formData,
        {
          headers: {
          Authorization: `Bearer ${token}`, // Add the token to the Authorization header
        },
      }
      );

      console.log(formData)
      // setFormData(formData)
      router.push("/school/branch");
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
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="phone_number">
            phone :
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
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="location">
            location :
          </label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>


        <div className="mb-6">
          <label className="block text-gray-600 text-sm font-semibold mb-2" htmlFor='user_id'>
            Select User
          </label>
          <select
            className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-800 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
            name="user_id"
            value={formData.user_id}
            onChange={(e) =>
              setFormData({
                ...formData,
                user_id: e.target.value, // Update user_id in formData
              })
            }
            required
          >
            <option value="">Select a user</option>
            {users.length > 0 ? users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.username} 
              </option>
            )) : <option disabled>Loading users...</option>}
          </select>
        </div>

        {/* <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="school_id">
            school:
          </label>
          <input
            type="text"
            name="school_id"
            value={formData.school_name}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div> */}


        <div className="mb-6">
          <label className="block text-gray-600 text-sm font-semibold mb-2" htmlFor='school_id'>
            Select School
          </label>
          <select
            className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-800 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
            name = "school_id"
            value={formData.school_id}
            onChange={handleSchoolChange}
            required
          >
            <option value="">Select a school</option>
            {schools.map((school) => (
              <option key={school.id} value={school.id}>
                {school.name}
              </option>
            ))}
          </select>
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
