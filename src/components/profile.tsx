import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

const Profile = () => {
  const router = useRouter();
  const [username, setUserName] = useState<string>('User');
  const [error, setError] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  // Retrieve token and userId from localStorage once
  useEffect(() => {
    const tokenFromLocalStorage = localStorage.getItem("authToken");
    const userIdFromLocalStorage = localStorage.getItem("userId");

    if (tokenFromLocalStorage && userIdFromLocalStorage) {
      setToken(tokenFromLocalStorage);
      setUserId(userIdFromLocalStorage);
    } else {
      console.log("Token or userId missing, redirecting to login...");
      router.push("/login");
    }
  }, [router]);

  // Fetch user profile
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!token || !userId) {
        console.log("Token or userId is missing.");
        return;
      }

      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/user/${userId}`,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log('Fetched Profile Data:', response.data);
        
        const { username, profileImage } = response.data;
        setUserName(username || 'User');
        // if (profileImage) {
        //   setProfileImage(profileImage);
        // }
      } catch (error: any) {
        console.error('Error fetching profile:', error);
        if (error.response && error.response.status === 403) {
          setError('Access forbidden: Invalid or expired token');
        } else {
          setError('Failed to load user profile');
        }
      }
    };

    fetchUserProfile();
  }, [token, userId]);

  return (
    <nav className="p-4 ml-6 flex justify-between items-center">
      <div className="flex items-center space-x-4">
        {/* <img src={profileImage} alt="Profile" className="w-10 h-10 rounded-full" /> */}
        <span className="text-white">{error ? error : username}</span>
      </div>
    </nav>
  );
};

export default Profile;
