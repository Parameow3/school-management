'use client';
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Modal from "@/components/Modal";
import { 
  CheckCircleIcon, 
  XCircleIcon, 
  BriefcaseIcon, 
  UserIcon, 
  PencilSquareIcon, 
  TrashIcon 
} from "@heroicons/react/24/solid"; // Import Heroicons

interface User {
  id: number;
  username: string;
  email: string;
  roles_name: string | null;
  date_joined: string;
  is_active: boolean;
  is_staff: boolean;
}

const UsersList: React.FC = () => {
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
          if (data.results && Array.isArray(data.results)) {
            setUsers(data.results);
          } else {
            setError("Unexpected data format.");
          }
        })
        .catch(() => {
          setError("Failed to load users. Please try again.");
        });
    }
  }, [token]);

  const handleEdit = (userId: number) => {
    router.push(`/setting/all-user/edit/${userId}`);
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
      .catch(() => {
        setError("Failed to delete user. Please try again.");
      });
    }
  };

  return (
    <div className="lg:ml-[18%] ml-[11%] mt-20 flex flex-col items-center">
      <div className="bg-white shadow-lg rounded-xl p-6 max-w-4xl w-full">
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <p className="text-gray-800 text-center text-xl font-bold mb-6">
          All Users
        </p>

        {users.length === 0 ? (
          <p className="text-center text-gray-500 py-4">No users found.</p>
        ) : (
          <div className="divide-y border-t border-b border-gray-200">
            {users.map((user) => (
              <div key={user.id} className="flex justify-between items-center px-6 py-4 transition-all duration-300 hover:bg-gray-100 rounded-md">
                <div className="flex flex-col">
                  <span className="text-lg font-semibold text-gray-900">{user.username}</span>
                  <span className="text-sm text-gray-500">{user.email}</span>
                  <span className="text-sm text-gray-400">{user.roles_name || "No role assigned"}</span>
                  <div className="flex items-center text-xs text-gray-600 mt-2">
                    {/* Active Status */}
                    <span className="flex items-center mr-4">
                      {user.is_active ? (
                        <CheckCircleIcon className="w-5 h-5 text-green-500 mr-1" />
                      ) : (
                        <XCircleIcon className="w-5 h-5 text-red-500 mr-1" />
                      )}
                      <span className="font-semibold">Active</span>
                    </span>
                    
                    {/* Staff Status */}
                    <span className="flex items-center">
                      {user.is_staff ? (
                        <BriefcaseIcon className="w-5 h-5 text-blue-500 mr-1" />
                      ) : (
                        <UserIcon className="w-5 h-5 text-gray-500 mr-1" />
                      )}
                      <span className="font-semibold">Staff</span>
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-3">
                  <button
                    onClick={() => handleEdit(user.id)}
                    className="hover:scale-110 transition-transform transform p-2 rounded-full bg-gray-200 hover:bg-gray-300"
                  >
                    <PencilSquareIcon className="w-5 h-5 text-gray-700" />
                  </button>
                  <button
                    onClick={() => confirmDelete(user)}
                    className="hover:scale-110 transition-transform transform p-2 rounded-full bg-red-100 hover:bg-red-200"
                  >
                    <TrashIcon className="w-5 h-5 text-red-600" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {isModalOpen && (
          <Modal
            onClose={() => setIsModalOpen(false)}
            onConfirm={handleDelete}
            message={`Are you sure you want to delete ${selectedUser?.username}?`}
          />
        )}
      </div>
    </div>
  );
};

export default UsersList;
