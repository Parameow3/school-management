"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";

const UpdateUser: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const userId = searchParams.get("id"); // Get user ID from URL query params

  const [roles, setRoles] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    roleId: "",
    profilePicture: null as File | null,
  });
  const [existingImage, setExistingImage] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Fetch roles and user data
  useEffect(() => {
    const tokenFromLocalStorage = localStorage.getItem("authToken");
    if (!tokenFromLocalStorage) {
      router.push("/login");
      return;
    }
    setToken(tokenFromLocalStorage);

    const fetchRoles = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/roles`,
          {
            headers: { Authorization: `Bearer ${tokenFromLocalStorage}` },
          }
        );
        setRoles(response.data);
      } catch (err) {
        setError("Failed to load roles. Please try again.");
      }
    };

    const fetchUserData = async () => {
      if (!userId) return;
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/user/${userId}`,
          {
            headers: { Authorization: `Bearer ${tokenFromLocalStorage}` },
          }
        );
        const { username, email, roleId, profilePicture } = response.data;
        setFormData({ username, email, roleId: roleId || "", profilePicture: null });
        setExistingImage(profilePicture);
      } catch (err) {
        setError("Failed to load user data. Please try again.");
      }
    };

    fetchRoles();
    fetchUserData();
  }, [router, userId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormData((prev) => ({ ...prev, profilePicture: file }));

      // Show preview
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.username) newErrors.username = "Username is required";
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.roleId) newErrors.roleId = "Role selection is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) return;

    const formDataToSend = new FormData();
    formDataToSend.append("username", formData.username);
    formDataToSend.append("email", formData.email);
    formDataToSend.append("roleId", formData.roleId);
    if (formData.profilePicture) {
      formDataToSend.append("profilePicture", formData.profilePicture);
    }

    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/user/${userId}`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("User updated successfully!");
      router.push("/setting/register/view");
    } catch (err) {
      setError("Update failed. Please try again.");
    }
  };

  return (
    <div className="lg:ml-[16%] ml-[11%] mt-20 flex flex-col items-center">
      <div className="bg-white shadow-2xl rounded-xl p-8 sm:p-10 max-w-lg w-full">
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <p className="text-gray-700 mt-4 text-center text-lg font-semibold">
          Update User
        </p>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Profile Picture Upload */}
          <div className="flex flex-col items-center space-y-4">
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="Profile Preview"
                className="w-32 h-32 rounded-full object-cover border"
              />
            ) : existingImage ? (
              <img
                src={existingImage}
                alt="Current Profile"
                className="w-32 h-32 rounded-full object-cover border"
              />
            ) : (
              <div className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center text-gray-500">
                No Image
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:border file:border-gray-300 file:rounded-md file:bg-gray-100 hover:file:bg-gray-200"
            />
          </div>

          {/* Username Input */}
          <div>
            <label className="block text-sm text-gray-700">Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 border-gray-300"
            />
          </div>

          {/* Email Input */}
          <div>
            <label className="block text-sm text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 border-gray-300"
            />
          </div>

          {/* Role Select */}
          <div>
            <label className="block text-sm text-gray-700">Select Role</label>
            <select
              name="roleId"
              value={formData.roleId}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 border-gray-300"
            >
              <option value="">Select a role</option>
              {roles.map((role) => (
                <option key={role.id} value={role.id}>
                  {role.name} - {role.description}
                </option>
              ))}
            </select>
          </div>

          {/* Submit Button */}
          <button type="submit" className="w-full py-3 bg-[#213458] text-white rounded-md hover:bg-blue-700 transition duration-300">
            Update User
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateUser;
