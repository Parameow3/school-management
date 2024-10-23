'use client';
import React, { useEffect, useState } from "react";
import axios from "axios";
import Button from "@/components/Button";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Modal from "@/components/Modal"; // Import your modal component

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
  const [token, setToken] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false); // For modal state
  const [branchToDelete, setBranchToDelete] = useState<Branch | null>(null); // Track the branch to delete
  const router = useRouter();

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

  const handleEdit = (branchId: number) => {
    router.push(`/school/branch/edit/${branchId}`);
  };

  const handleDelete = async (branchId: number) => {
    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/branches/${branchId}/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setBranches((prevBranches) =>
        prevBranches.filter((branch) => branch.id !== branchId)
      );
      setIsModalOpen(false); // Close modal after successful deletion
    } catch (err) {
      setError("Failed to delete branch.");
      setIsModalOpen(false); // Close modal even if error
    }
  };

  const confirmDelete = (branch: Branch) => {
    setBranchToDelete(branch);
    setIsModalOpen(true); // Open modal when delete is triggered
  };

  const handleConfirmDelete = () => {
    if (branchToDelete) {
      handleDelete(branchToDelete.id); // Call the delete function with the selected branch
    }
  };

  useEffect(() => {
    if (!token) return;

    const fetchBranches = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/branches/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setBranches(response.data.results);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch branches data.");
        setLoading(false);
      }
    };
    fetchBranches();
  }, [token]);

  if (loading) {
    return <div className="text-center text-lg mt-8">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-lg mt-8 text-red-500">{error}</div>;
  }

  return (
    <div className="lg:ml-[18%] ml-[11%] mt-20 flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          Branches Information
        </h1>
        <Button
          onClick={handleAdd}
          className="p-2 bg-[#213458] hover:bg-[#215498] text-white rounded-md"
        >
          New
        </Button>
      </div>
      <div className="overflow-x-auto shadow-lg sm:rounded-lg border border-gray-200">
        <table className="min-w-full bg-white table-auto">
          <thead className="bg-[#213458] text-white">
            <tr>
              <th className="w-12 px-4 py-3 text-left text-[12px] font-semibold uppercase tracking-wider">
                Branch ID
              </th>
              <th className="w-32 px-4 py-3 text-left text-[12px] font-semibold uppercase tracking-wider">
                Branch Name
              </th>
              <th className="w-32 px-4 py-3 text-left text-[12px] font-semibold uppercase tracking-wider">
                Branch Address
              </th>
              <th className="w-32 px-4 py-3 text-left text-[12px] font-semibold uppercase tracking-wider">
                Branch Location
              </th>
              <th className="w-48 px-4 py-3 text-left text-[12px] font-semibold ml-20 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {branches.map((branch) => (
              <tr key={branch.id} className="hover:bg-gray-50">
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700">
                  {branch.id}
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700">
                  {branch.name}
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700">
                  {branch.address}
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700">
                  {branch.location}
                </td>
                <td className="px-4 py-2 whitespace-nowrap">
                  <div className="flex space-x-3">
                    <button
                      onClick={() => handleEdit(branch.id)}
                      className="hover:scale-110 transition-transform transform hover:bg-gray-200 p-1 rounded-full"
                    >
                      <Image
                        src="/edit.svg"
                        alt="Edit"
                        width={25}
                        height={25}
                        className="w-[25px] h-[25px]"
                      />
                    </button>
                    <button
                      onClick={() => confirmDelete(branch)} // Trigger the modal on delete click
                      className="hover:scale-110 transition-transform transform hover:bg-gray-200 p-1 rounded-full"
                    >
                      <Image
                        src="/delete.svg"
                        alt="Delete"
                        width={25}
                        height={25}
                        className="w-[25px] h-[25px]"
                      />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal for confirming deletion */}
      {isModalOpen && branchToDelete && (
        <Modal
          onClose={() => setIsModalOpen(false)}
          onConfirm={handleConfirmDelete}
          message={`Are you sure you want to delete the branch "${branchToDelete.name}"?`}
        />
      )}
    </div>
  );
};

export default Page;
