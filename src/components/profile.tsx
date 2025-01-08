import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Button from "./Button";

const Profile = () => {
  const router = useRouter();
  const [username, setUserName] = useState<string>("User");
  const [error, setError] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);

  useEffect(() => {
    const tokenFromLocalStorage = localStorage.getItem("authToken");
    const userIdFromLocalStorage = localStorage.getItem("userId");

    if (tokenFromLocalStorage && userIdFromLocalStorage) {
      setToken(tokenFromLocalStorage);
      setUserId(userIdFromLocalStorage);
    } else {
      router.push("/login");
    }
  }, [router]);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!token || !userId) {
        return;
      }

      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/user/${userId}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const { username } = response.data;
        setUserName(username || "User");
      } catch (error: any) {
        console.error("Error fetching profile:", error);
        if (error.response && error.response.status === 403) {
          setError("Access forbidden: Invalid or expired token");
        } else {
          setError("Failed to load user profile");
        }
      }
    };

    fetchUserProfile();
  }, [token, userId]);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userId");
    router.push("/login");
  };

  return (
    <nav className="p-4 ml-6 flex justify-end items-center">
      <div className="relative">
        {/* Dropdown Trigger */}
        <div
          className="flex items-center space-x-2 cursor-pointer"
          onClick={() => setIsDropdownOpen((prev) => !prev)}
        >
          <span className="text-white">{error ? error : username}</span>
          <svg
            className="w-5 h-5 text-white"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19 9l-7 7-7-7"
            ></path>
          </svg>
        </div>

        {/* Dropdown Menu */}
        {isDropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md">
            <ul className="py-2">
              <li
                onClick={() => router.push("/setting/account-setting")}
                className="px-4 py-2 hover:bg-gray-200 cursor-pointer text-gray-700"
              >
                Profile
              </li>
              <li
                onClick={handleLogout}
                className="px-4 py-2 hover:bg-gray-200 cursor-pointer text-gray-700"
              >
                Logout
              </li>
            </ul>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Profile;
