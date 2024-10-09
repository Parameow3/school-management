import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import axios from 'axios';
import { Menu, MenuButton } from '@headlessui/react';
import { useRouter } from 'next/navigation';

const Profile = () => {
  const router = useRouter();
  const [userName, setUserName] = useState<string>('User'); // Fallback to "User" if not available
  // const [userUrl, setUserUrl] = useState<string>('/default-profile.jpg'); // Default profile image
  const [error, setError] = useState<string | null>(null); // For handling errors
  const [token, setToken] = useState<string | null>(null);

  // Fetch token from localStorage when the component mounts
  useEffect(() => {
    const tokenFromLocalStorage = localStorage.getItem("authToken"); // Correct token key
    const userInfo = localStorage.getItem("userInfo");
    const userId = localStorage.getItem("userId");
    console.log("user info" , userInfo)
    console.log("user info" , userId)
    if (tokenFromLocalStorage) {
      setToken(tokenFromLocalStorage); // Set token in state
    } else {
      // Redirect to login if no token found
      router.push("/login");
    }
  }, [router]);

  useEffect(() => {
    const userInfo = localStorage.getItem("userInfo");
    const userId = localStorage.getItem("userId");
    const fetchUserProfile = async () => {
      if (!token) return; // Ensure token is present before making the request
      try {
        const response = await axios.get(  `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/user/${userId}`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`, // Correct token usage
          },
        });
        
        console.log('Fetched Profile Data:', response.data);
        const currentUser = response.data.username
        setUserName(currentUser || 'User');
      } catch (error:any) {
        console.error('Error fetching profile:', error);
        if (error.response && error.response.status === 403) {
          setError('Access forbidden: Invalid or expired token'); // Handle 403 error
        } else {
          setError('Failed to load user profile'); // Set generic error message if other issues arise
        }
      }
    };

    fetchUserProfile();
  }, [token]);

  return (
    <nav className="p-4 ml-6 flex justify-between items-center">
      <div className="flex items-center space-x-4">
        {/* User's name */}
        <span className="text-white">{error ? 'Error' : userName}</span>
        
        {/* User's profile picture */}
        <Menu as="div" className="relative">
          <MenuButton className="flex items-center">
            {/* <Image
              alt={userName}
              // src={userUrl}
              className="h-8 w-8 rounded-full bg-gray-800"
              width={32}
              height={32}
              // onError={() => setUserUrl('/default-profile.jpg')} // Set default on error
            /> */}
          </MenuButton>
        </Menu>
      </div>
    </nav>
  );
};

export default Profile;
