'use client';
import React, { useEffect, useState } from "react";
import axios from "axios";
import Button from "@/components/Button";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Modal from "@/components/Modal";  // Assuming you have a Modal component

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
  const [token, setToken] = useState<string | null>(null);
  const [schools, setSchools] = useState<School[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [schoolToDelete, setSchoolToDelete] = useState<number | null>(null);
  const router = useRouter();

  const handleAdd = () => {
    router.push(`/school/school/add/`);
  };

  const handleEdit = (id: number) => {
    router.push(`/school/school/edit/${id}`);
  };

  const openDeleteModal = (id: number) => {
    setSchoolToDelete(id);  // Set the ID of the school to be deleted
    setShowModal(true);  // Show the modal
  };

  const handleDeleteConfirm = async () => {
    if (schoolToDelete !== null) {
      try {
        // Delete school by ID
        await axios.delete(`${process.env.NEXT_PUBLIC_BASE_URL}/api/schools/${schoolToDelete}/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        // Remove the deleted school from the state
        setSchools((prevSchools) => prevSchools.filter((school) => school.id !== schoolToDelete));
        setShowModal(false);  // Close the modal after deletion
        setSchoolToDelete(null);  // Reset the schoolToDelete state
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
    const fetchSchools = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/schools/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setSchools(response.data.results);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch schools data.");
        setLoading(false);
      }
    };
    fetchSchools();
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
        <h1 className="text-4xl font-semibold text-gray-800">Schools Information</h1>
        <Button
          onClick={handleAdd}
          className="bg-[#213458] text-white py-2 px-6 rounded-lg hover:bg-blue-700"
        >
          Add School
        </Button>
      </div>
      <div className="overflow-x-auto shadow-lg rounded-lg border border-gray-300">
        <table className="min-w-full bg-white border-collapse">
          <thead className="bg-[#213458] text-white">
            <tr>
              <th className="px-6 py-4 text-center text-sm font-semibold uppercase">ID</th>
              <th className="px-6 py-4 text-center text-sm font-semibold uppercase">Name</th>
              <th className="px-6 py-4 text-center text-sm font-semibold uppercase">Address</th>
              <th className="px-6 py-4 text-center text-sm font-semibold uppercase">Phone</th>
              <th className="px-6 py-4 text-center text-sm font-semibold uppercase">Email</th>
              <th className="px-6 py-4 text-center text-sm font-semibold uppercase">Established</th>
              <th className="px-6 py-4 text-center text-sm font-semibold uppercase">Website</th>
              <th className="px-6 py-4 text-center text-sm font-semibold uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {schools.map((school) => (
              <tr key={school.id} className="hover:bg-gray-100">
                <td className="px-6 py-4 text-center">{school.id}</td>
                <td className="px-6 py-4 text-center">{school.name}</td>
                <td className="px-6 py-4 text-center">{school.address}</td>
                <td className="px-6 py-4 text-center">{school.phone_number}</td>
                <td className="px-6 py-4 text-center">{school.email}</td>
                <td className="px-6 py-4 text-center">
                  {new Date(school.established_date).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-center">
                  {school.website ? (
                    <a
                      href={school.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      Visit
                    </a>
                  ) : (
                    "N/A"
                  )}
                </td>
                <td className="px-6 py-4 mt-4 text-center flex justify-center space-x-2">
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
                    onClick={() => openDeleteModal(school.id)} // Trigger modal open with the correct ID
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
          onClose={() => setShowModal(false)} // Close the modal without deleting
          onConfirm={handleDeleteConfirm} // Confirm deletion
          message="Are you sure you want to delete this school?"
        />
      )}
    </div>
  );
};

export default Page;
