'use client';
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Modal from "@/components/Modal";
interface User {
  id: number;
  username: string;
  email: string;
  roles_name: string | null;
  date_joined: string;
  is_active: boolean;
  is_staff: boolean;
}

const UsersTable: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const tokenFromLocalStorage = localStorage.getItem("authToken");
    if (tokenFromLocalStorage) {
      setToken(tokenFromLocalStorage);
    } else {
      router.push("/login");
    }
  }, [router]);

  useEffect(() => {
    if (token) {
      fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/user`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then(response => {
          if (!response.ok) {
            throw new Error("Failed to fetch users.");
          }
          return response.json();
        })
        .then(data => {
          console.log('Fetched data:', data);
          if (data.results && Array.isArray(data.results)) {
            setUsers(data.results);
          } else {
            console.error("Fetched data is not in expected format:", data);
            setError("Unexpected data format.");
          }
        })
        .catch(error => {
          console.error('Error fetching data:', error.message);
          setError("Failed to load users. Please try again.");
        });
    }
  }, [token]);

  const handleEdit = (userId: number) => {
    console.log("Edit user with ID:", userId);
    
  };

  const confirmDelete = (user: User) => {
    setSelectedUser(user);
    setIsModalOpen(true); 
  };

  const handleDelete = () => {
    if (selectedUser) {
      fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/user/${selectedUser.id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(response => {
        if (!response.ok) {
          throw new Error("Failed to delete user.");
        }
        setUsers(prevUsers => prevUsers.filter(user => user.id !== selectedUser.id));
        setIsModalOpen(false); 
        setSelectedUser(null); 
      })
      .catch(error => {
        console.error('Error deleting user:', error.message);
        setError("Failed to delete user. Please try again.");
      });
    }
  };
  const handleBack = () => {
    router.back();
  };

  return (
    <div className="flex justify-center items-center lg:ml-[18%] ml-[11%] mt-20  flex-col min-h-screen ">
      <div className="bg-white shadow-2xl rounded-xl p-10 max-w-4xl w-full">
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <p className="text-gray-700 mt-4 text-center text-lg font-semibold">
          All Users
        </p>
        <button
          onClick={handleBack}
          className="mb-4 px-4 py-2 bg-[#213458] text-gray-200 rounded hover:bg-gray-300 transition"
        >
          Back
        </button>
        <table className="min-w-full divide-y divide-gray-200 mt-4">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Username</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Other Info</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center">No users found.</td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.id}>
                  <td className="px-6 py-4">{user.username}</td>
                  <td className="px-6 py-4">{user.email}</td>
                  <td className="px-6 py-4">{user.roles_name || "No role assigned"}</td>
                  <td className="px-6 py-4">
                    <p><strong>Active:</strong> {user.is_active ? 'Yes' : 'No'}</p>
                    <p><strong>Staff:</strong> {user.is_staff ? 'Yes' : 'No'}</p>
                  </td>
                  <td className="px-6 py-4 flex space-x-2">
                    <button
                      onClick={() => handleEdit(user.id)}
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
                      onClick={() => confirmDelete(user)}
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
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        {isModalOpen && (
          <Modal
            onClose={() => setIsModalOpen(false)}
            onConfirm={handleDelete}
            message="Are you sure you want to delete this user?"
          />
        )}
      </div>
    </div>
  );
};

export default UsersTable;
