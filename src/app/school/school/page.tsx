"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Button from "@/components/Button";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Modal from "@/components/Modal"; // Assuming you have a Modal component

interface School {
  id: number;
  name: string;
  address: string;
  phone_number: string;
  email: string;
  established_date: string | null;
  website: string | null;
}

interface Branch {
  id: number;
  name: string;
  school: {
    id: number;
    name: string;
  };
}

const Page: React.FC = () => {
  const [token, setToken] = useState<string | null>(null);
  const [schools, setSchools] = useState<School[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [schoolToDelete, setSchoolToDelete] = useState<number | null>(null);
  const router = useRouter();

  const handleAdd = () => {
    router.push(`/school/school/add/`);
  };
  const handleAddBranch = () => {
    router.push(`/school/branch/add/`);
  };
  const handleEdit = (id: number) => {
    router.push(`/school/school/edit/${id}`);
  };

  const openDeleteModal = (id: number) => {
    setSchoolToDelete(id);
    setShowModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (schoolToDelete !== null) {
      try {
        await axios.delete(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/schools/${schoolToDelete}/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setSchools((prevSchools) =>
          prevSchools.filter((school) => school.id !== schoolToDelete)
        );
        setShowModal(false);
        setSchoolToDelete(null);
      } catch (err) {
        console.error("Failed to delete school:", err);
        setError("Failed to delete school. Please try again.");
      }
    }
  };

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

    const fetchSchoolsAndBranches = async () => {
      try {
        const schoolResponse = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/schools/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const branchResponse = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/branches`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setSchools(schoolResponse.data.results);
        setBranches(branchResponse.data.results);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch data:", err);
        setError("Failed to fetch data. Please try again.");
        setLoading(false);
      }
    };

    fetchSchoolsAndBranches();
  }, [token]);

  if (loading) {
    return <div className="text-center text-lg mt-8">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-lg mt-8 text-red-500">{error}</div>;
  }

  return (
    <div className="lg:ml-[15%] ml-[8%] mt-24 flex flex-col">
      <div className="flex flex-row justify-between mb-8">
        <h1 className="text-4xl font-semibold text-gray-800">
          Schools and Branches
        </h1>
       <div className="flex justify-around gap-4">
       <Button
          onClick={handleAdd}
          className="bg-[#213458] text-white py-2 px-6 rounded-lg hover:bg-blue-700"
        >
          Add School
        </Button>
        <Button
          onClick={handleAddBranch}
          className="p-2 bg-[#213458] hover:bg-[#215498] text-white rounded-md"
        >
          Add branch
        </Button>
       </div>
      </div>
      <div className="overflow-x-auto shadow-lg rounded-lg border border-gray-300">
        <table className="min-w-full bg-white border-collapse">
          <thead className="bg-[#213458] text-white">
            <tr>
              <th className="px-6 py-4 text-center text-sm font-semibold uppercase">
                ID
              </th>
              <th className="px-6 py-4 text-center text-sm font-semibold uppercase">
                Name
              </th>
              <th className="px-6 py-4 text-center text-sm font-semibold uppercase">
                Address
              </th>
              <th className="px-6 py-4 text-center text-sm font-semibold uppercase">
                Branches
              </th>
              <th className="px-6 py-4 text-center text-sm font-semibold uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {schools.map((school) => {
              const schoolBranches = branches.filter(
                (branch) => branch.school.id === school.id
              );

              return (
                <tr key={school.id} className="hover:bg-gray-100">
                  <td className="px-6 py-4 text-center">{school.id}</td>
                  <td className="px-6 py-4 text-center">{school.name}</td>
                  <td className="px-6 py-4 text-center">{school.address}</td>
                  <td className="px-6 py-4 text-center">
                    {schoolBranches.length > 0 ? (
                      <ul className="list-disc list-inside">
                        {schoolBranches.map((branch) => (
                          <li key={branch.id}>{branch.name}</li>
                        ))}
                      </ul>
                    ) : (
                      <span>No branches</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-center flex justify-center items-center mt-3 space-x-2">
                    <Image
                      src="/update.svg"
                      width={20}
                      height={20}
                      alt="update"
                      className="mr-2"
                      onClick={() => handleEdit(school.id)}
                    />
                    <Image
                      src="/delete.svg"
                      width={20}
                      height={20}
                      alt="delete"
                      onClick={() => openDeleteModal(school.id)}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Modal for Delete Confirmation */}
      {showModal && (
        <Modal
          onClose={() => setShowModal(false)}
          onConfirm={handleDeleteConfirm}
          message="Are you sure you want to delete this school?"
        />
      )}
    </div>
  );
};

export default Page;
