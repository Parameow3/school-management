'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useRouter } from 'next/navigation';

interface SchoolData {
  name: string;
  address: string;
  phone_number?: string;
  email?: string;
  established_date?: string;
  website?: string;
}

interface BranchData {
  school: { id: number };
  id: number;
  name: string;
  address: string;
  phone_number: string;
  email: string;
  location: string;
  established_date?: string;
}

const Page: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const schoolId = parseInt(params.editId as string, 10);

  const [formData, setFormData] = useState<SchoolData>({
    name: '',
    address: '',
    phone_number: '',
    email: '',
    established_date: '',
    website: '',
  });

  const [branches, setBranches] = useState<BranchData[]>([]);
  const [branchName, setBranchName] = useState<string>(''); // State for branch name
  const [branchAddress, setBranchAddress] = useState<string>('');
  const [branchPhoneNumber, setBranchPhoneNumber] = useState<string>('');
  const [branchEmail, setBranchEmail] = useState<string>('');
  const [branchLocation, setBranchLocation] = useState<string>('');
  const [editingBranch, setEditingBranch] = useState<BranchData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isSavingBranch, setIsSavingBranch] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [token, setToken] = useState<string | null>(null);

  // Retrieve token from localStorage
  useEffect(() => {
    const tokenFromLocalStorage = localStorage.getItem('authToken');
    if (tokenFromLocalStorage) {
      setToken(tokenFromLocalStorage);
    } else {
      router.push('/login'); // Redirect to login if no token
    }
  }, [router]);

  // Fetch school data and associated branches
  useEffect(() => {
    if (schoolId && token) {
      const fetchSchoolAndBranches = async () => {
        try {
          // Fetch school details
          const schoolResponse = await axios.get(
            `${process.env.NEXT_PUBLIC_BASE_URL}/api/schools/${schoolId}/`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          setFormData(schoolResponse.data);

          // Fetch branches for the school
          const branchResponse = await axios.get(
            `${process.env.NEXT_PUBLIC_BASE_URL}/api/branches/`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          const schoolBranches = branchResponse.data.results.filter(
            (branch: BranchData) => branch.school.id === schoolId
          );
          setBranches(schoolBranches);

          setLoading(false);
        } catch (err) {
          setError('Failed to fetch data.');
          setLoading(false);
        }
      };
      fetchSchoolAndBranches();
    }
  }, [schoolId, token]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleEditBranch = (branch: BranchData) => {
    setEditingBranch(branch);
    setBranchName(branch.name); // Set branch name
    setBranchAddress(branch.address);
    setBranchPhoneNumber(branch.phone_number);
    setBranchEmail(branch.email);
    setBranchLocation(branch.location);
  };

  const handleSaveBranch = async () => {
    if (token && editingBranch) {
      setIsSavingBranch(true);
      try {
        const response = await axios.patch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/branches/${editingBranch.id}/`,
          {
            school_id: editingBranch.school.id,
            name: branchName, // Save branch name
            address: branchAddress,
            phone_number: branchPhoneNumber,
            email: branchEmail,
            location: branchLocation,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // Update the branches list
        setBranches((prevBranches) =>
          prevBranches.map((branch) =>
            branch.id === editingBranch.id ? response.data : branch
          )
        );

        setEditingBranch(null); // Close the edit form
        alert('Branch updated successfully!');
      } catch (err) {
        setError('Failed to update branch.');
        console.error(err);
      } finally {
        setIsSavingBranch(false);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (token) {
      try {
        await axios.put(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/schools/${schoolId}/`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        router.push('/school/school');
        alert('School updated successfully!');
      } catch (err: any) {
        setError('Failed to update school data.');
      }
    } else {
      setError('No token found, please log in.');
    }
  };

  return (
    <div className="lg:ml-[16%] ml-[11%] mt-20 flex flex-col">
      <div>
        <button
          type="button"
          onClick={() => router.back()}
          className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50"
        >
          Back
        </button>
      </div>

      <div className="max-w-md ml-[234px] bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Edit School</h2>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <>
            {error && <div className="text-red-500 mb-4">{error}</div>}
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">School Name:</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Address:</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                />
              </div>

              <button
                type="submit"
                className="bg-[#213458] text-white py-2 px-4 rounded-md"
              >
                Save Changes
              </button>
            </form>

            <h3 className="text-xl font-bold text-gray-800 mt-8">Branches</h3>
            {branches.length > 0 ? (
              branches.map((branch) => (
                <div key={branch.id} className="flex justify-between items-center mt-4">
                  <div>
                    <strong>{branch.name}</strong> - {branch.address} ({branch.phone_number})
                  </div>
                  <div>
                    <button
                      onClick={() => handleEditBranch(branch)}
                      className="text-blue-600 hover:underline mr-4"
                    >
                      Edit
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="mt-4 text-gray-600">No branches available for this school.</p>
            )}

            {/* Edit Branch Form */}
            {editingBranch && (
              <div className="mt-8">
                <h4 className="text-lg font-bold text-gray-800">Edit Branch</h4>
                <div className="mb-6">
                  <label className="block text-gray-600 text-sm font-semibold mb-2">Branch Name</label>
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
                  <label className="block text-gray-600 text-sm font-semibold mb-2">Branch Address</label>
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
                  <label className="block text-gray-600 text-sm font-semibold mb-2">Branch Phone Number</label>
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
                  <label className="block text-gray-600 text-sm font-semibold mb-2">Branch Email</label>
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
                  <label className="block text-gray-600 text-sm font-semibold mb-2">Branch Location</label>
                  <input
                    className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-800 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
                    type="text"
                    value={branchLocation}
                    onChange={(e) => setBranchLocation(e.target.value)}
                    placeholder="Enter branch location"
                    required
                  />
                </div>

                <button
                  onClick={handleSaveBranch}
                  className="bg-[#213458] text-white py-2 px-4 rounded-md"
                  disabled={isSavingBranch}
                >
                  {isSavingBranch ? 'Saving...' : 'Save Branch'}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Page;
