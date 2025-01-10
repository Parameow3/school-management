'use client';
import React, { useState, useEffect } from "react";
import axios from "axios";
import Button from "@/components/Button";
import { useRouter } from "next/navigation";

interface School {
  id: number;
  name: string;
  address: string;
  email: string | null;
  established_date: string;
  phone_number: string;
  schoolweb: string | null;
}

interface User {
  id: number;
  username: string;
  email: string;
}

const Page: React.FC = () => {
  const [branchName, setBranchName] = useState<string>("");
  const [branchAddress, setBranchAddress] = useState<string>("");
  const [branchLocation, setBranchLocation] = useState<string>("");
  const [branchPhoneNumber, setBranchPhoneNumber] = useState<string>("");
  const [branchEmail, setBranchEmail] = useState<string>("");
  const [userId, setUserId] = useState<number | null>(null);

  const [schools, setSchools] = useState<School[]>([]);
  const [users, setUsers] = useState<User[]>([]); // Initialize as an empty array
  const [selectedSchool, setSelectedSchool] = useState<number | null>(null);

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);

  // Fetch the token from localStorage
  useEffect(() => {
    const tokenFromLocalStorage = localStorage.getItem("authToken");
    if (tokenFromLocalStorage) {
      setToken(tokenFromLocalStorage);
    } else {
      router.push("/login");
    }
  }, [router]);

  useEffect(() => {
    if (!token) return;
  
    const fetchSchoolsAndUsers = async () => {
      try {
        // Fetch schools
        const schoolResponse = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/schools/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setSchools(schoolResponse.data.results);
  
        // Fetch users
        const userResponse = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/user?role_name=admin`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("Users data:", userResponse.data); // Log the response to debug
  
        // Ensure the response is an array and contains users data
        if (Array.isArray(userResponse.data.results)) {
          setUsers(userResponse.data.results);
        } else {
          console.error("Users API response is not an array");
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to fetch data.");
      }
    };
  
    fetchSchoolsAndUsers();
  }, [token]);

  const handleSchoolChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = Number(e.target.value);
    setSelectedSchool(selectedId);
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Prepare branch data to send
      const branchData = {
        name: branchName,
        address: branchAddress,
        phone_number: branchPhoneNumber,
        email: branchEmail,
        location: branchLocation,
        user_id: userId,  // Use userId selected from the dropdown
        school_id: selectedSchool || null,
      };

      console.log("Submitting data:", branchData);

      // Submit branch data
      await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/api/branches/`, branchData, {
        headers: {
          Authorization: `Bearer ${token}`, // Ensure the token is included in the request
        },
      });
      router.push("/school/branch");
    } catch (err) {
      setError("Failed to add branch. Please check the form and try again.");
      console.error("Submission error:", err);
    } finally {
      setLoading(false); // Reset loading state after submission
    }
  };

  return (
    <div className="lg:ml-[18%] ml-[11%] mt-24 flex flex-col">
      <form
        onSubmit={handleSubmit}
        className="w-[540px] max-w-2xl mx-auto bg-white shadow-lg p-8 rounded-lg"
      >
        <h1 className="text-xl font-bold text-gray-800 mb-8 text-center">
          Add New Branch
        </h1>

        {/* Branch Information */}
        <div className="mb-6">
          <label className="block text-gray-600 text-sm font-semibold mb-2">
            Branch Name
          </label>
          <input
            className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-800 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
            type="text"
            value={branchName}
            onChange={(e) => setBranchName(e.target.value)}
            placeholder="Enter branch name"
            required
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-600 text-sm font-semibold mb-2">
            Branch Address
          </label>
          <input
            className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-800 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
            type="text"
            value={branchAddress}
            onChange={(e) => setBranchAddress(e.target.value)}
            placeholder="Enter branch address"
            required
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-600 text-sm font-semibold mb-2">
            Branch Phone Number
          </label>
          <input
            className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-800 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
            type="text"
            value={branchPhoneNumber}
            onChange={(e) => setBranchPhoneNumber(e.target.value)}
            placeholder="Enter branch phone number"
            required
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-600 text-sm font-semibold mb-2">
            Branch Email
          </label>
          <input
            className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-800 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
            type="email"
            value={branchEmail}
            onChange={(e) => setBranchEmail(e.target.value)}
            placeholder="Enter branch email"
            required
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-600 text-sm font-semibold mb-2">
            Branch Location
          </label>
          <input
            className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-800 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
            type="text"
            value={branchLocation}
            onChange={(e) => setBranchLocation(e.target.value)}
            placeholder="Enter branch location"
            required
          />
        </div>

        {/* User Dropdown */}
        <div className="mb-6">
          <label className="block text-gray-600 text-sm font-semibold mb-2">
            Select User
          </label>
          <select
            className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-800 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={userId || ""}
            onChange={(e) => setUserId(Number(e.target.value))}  // Set userId on selection
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

        {/* School Information */}
        <h2 className="text-2xl font-bold text-gray-700 mt-8 mb-4">
          School Information
        </h2>

        <div className="mb-6">
          <label className="block text-gray-600 text-sm font-semibold mb-2">
            Select School
          </label>
          <select
            className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-800 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={selectedSchool || ""}
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

        {error && <div className="text-red-500 text-sm mb-4">{error}</div>}

        <Button className="bg-[#213458] flex items-center justify-center hover:bg[#213498] text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
          {loading ? "Submitting..." : "Submit"}
        </Button>
      </form>
    </div>
  );
};

export default Page;
