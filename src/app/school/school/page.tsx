"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Button from "@/components/Button";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Modal from "@/components/Modal";

interface School {
  id: number;
  name: string;
  address: string;
  phone_number: string;
  email: string;
  established_date: string;
  website: string | null;
}

const Page: React.FC = () => {
  const [schools, setSchools] = useState<School[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false); // Control modal visibility
  const [schoolToDelete, setSchoolToDelete] = useState<number | null>(null); // Track school to delete
  const router = useRouter();

  const handleAdd = () => {
    router.push(`/school/school/add/`);
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
        await axios.delete(`http://127.0.0.1:8000/api/schools/${schoolToDelete}/`);
        setSchools((prevSchools) =>
          prevSchools.filter((school) => school.id !== schoolToDelete)
        );
        setShowModal(false); // Close modal after deletion
      } catch (err) {
        console.error("Failed to delete school:", err);
      }
    }
  };

  useEffect(() => {
    const fetchSchools = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/schools/");
        setSchools(response.data.results); // Assuming the data is inside "results"
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch schools data.");
        setLoading(false);
      }
    };
    fetchSchools();
  }, []);

  if (loading) {
    return <div className="text-center text-lg mt-8">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-lg mt-8 text-red-500">{error}</div>;
  }

  return (
    <div className="lg:ml-[15%] ml-[11%] mt-20 flex flex-col">
      <div className="flex flex-row justify-between">
        <h1 className="text-3xl font-bold mb-6">Schools Information</h1>
        <Button
          onClick={handleAdd}
          className="bg-[#213458] text-white py-2 px-4 rounded-lg hover:bg-blue-700"
        >
          Add
        </Button>
      </div>
      <div className="overflow-x-auto shadow-lg sm:rounded-lg">
        <table className="min-w-full bg-white border border-gray-200">
          <thead className="bg-[#213458] text-white">
            <tr>
              <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider">
                ID
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider">
                Address
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider">
                Phone Number
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider">
                Established Date
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider">
                Website
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {schools.map((school) => (
              <tr key={school.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-center">{school.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-center">{school.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  {school.address}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  {school.phone_number}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">{school.email}</td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  {school.established_date}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  {school.website ? (
                    <a
                      href={school.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline"
                    >
                      {school.website}
                    </a>
                  ) : (
                    "N/A"
                  )}
                </td>
                <td className="px-2 py-2 whitespace-nowrap flex justify-center space-x-4">
                  <Image
                    src="/edit.svg"
                    width={20}
                    height={20}
                    alt="Edit icon"
                    onClick={() => handleEdit(school.id)}
                    className="cursor-pointer"
                  />

                  <Image
                    src="/delete.svg"
                    width={20}
                    height={20}
                    alt="Delete icon"
                    onClick={() => openDeleteModal(school.id)}
                    className="cursor-pointer"
                  />
                </td>
              </tr>
            ))}
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
