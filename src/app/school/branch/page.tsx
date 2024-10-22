'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Button from '@/components/Button';
import { useRouter } from 'next/navigation';

interface School {
  id: number;
  name: string;
  address: string;
  phone_number: string | null;
  email: string | null;
  established_date: string;
  website: string | null;
}

interface Branch {
  id: number;
  school: School;
  name: string;
  address: string;
  phone_number: string | null;
  email: string | null;
  location: string;
  user_id: number;
}

const Page: React.FC = () => {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const tokenFromLocalStorage = localStorage.getItem("authToken");
    if (tokenFromLocalStorage) {
      setToken(tokenFromLocalStorage);
    } else {
      // Redirect to login if no token
      router.push("/login");
      return; // Prevent further execution if no token
    }
  }, [router]);

  const handleAdd = () => {
    router.push(`/school/branch/add/`);
  };

  useEffect(() => {
    if (!token) return;

    const fetchBranches = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/branches/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log("Token branch:", token);
        setBranches(response.data.results);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch branches data.');
        setLoading(false);
      }
    };
    fetchBranches();
  }, [token]); // Added `token` to dependency array

  if (loading) {
    return <div className="text-center text-lg mt-8">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-lg mt-8 text-red-500">{error}</div>;
  }

  return (
    <div className="lg:ml-[18%] ml-[11%] mt-20 flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Branches Information</h1>
        <Button onClick={handleAdd} className="p-2 text-white rounded">New</Button>
      </div>
      <div className="overflow-x-auto shadow-lg sm:rounded-lg">
        <table className="min-w-full bg-white border border-gray-200 table-fixed">
          <thead className="bg-[#213458] text-white">
            <tr>
              <th className="w-12 px-2 py-3 text-left text-[10px] font-medium uppercase tracking-wider">Branch ID</th>
              <th className="w-24 px-2 py-3 text-left text-[10px] font-medium uppercase tracking-wider">Branch Name</th>
              <th className="w-24 px-2 py-3 text-left text-[10px] font-medium uppercase tracking-wider">Branch Address</th>
              <th className="w-24 px-2 py-3 text-left text-[10px] font-medium uppercase tracking-wider">Branch Location</th>
              <th className="w-36 px-2 py-3 text-left text-[10px] font-medium uppercase tracking-wider">School Name</th>
              <th className="w-36 px-2 py-3 text-left text-[10px] font-medium uppercase tracking-wider">School Address</th>
              <th className="w-36 px-2 py-3 text-left text-[10px] font-medium uppercase tracking-wider">School Email</th>
              <th className="w-24 px-2 py-3 text-left text-[10px] font-medium uppercase tracking-wider">School Established</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {branches.map((branch) => (
              <tr key={branch.id} className="hover:bg-gray-50">
                <td className="px-2 py-2 whitespace-nowrap">{branch.id}</td>
                <td className="px-2 py-2 whitespace-nowrap">{branch.name}</td>
                <td className="px-2 py-2 whitespace-nowrap">{branch.address}</td>
                <td className="px-2 py-2 whitespace-nowrap">{branch.location}</td>
                <td className="px-2 py-2 whitespace-nowrap">{branch.school.name}</td>
                <td className="px-2 py-2 whitespace-nowrap">{branch.school.address}</td>
                <td className="px-2 py-2 whitespace-nowrap">{branch.school.email || 'N/A'}</td>
                <td className="px-2 py-2 whitespace-nowrap">{branch.school.established_date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Page;
