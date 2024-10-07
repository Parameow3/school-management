"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";

interface Teacher {
  userName: string;
  email: string;
  profilePicture: string;
  password: string;
}

const Page = () => {
  const [teacher, setTeacher] = useState<Teacher>({
    userName: "",
    email: "",
    password: "",
    profilePicture: "/photo.jpg",
  });

  const [password, setPassword] = useState<string>(""); // New password that the user sets
  const [passwordError, setPasswordError] = useState<string>("");
  const [passwordVisible, setPasswordVisible] = useState<boolean>(false);

  useEffect(() => {
    const fetchTeacher = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/teacher/3/`);
        const teacherData = response.data;

        setTeacher({
          userName: teacherData.user.username,
          email: teacherData.user.email || "Not available",
          password: teacherData.user.password,
          profilePicture: teacherData.profile_picture || "/photo.jpg",
        });
        setPassword(teacherData.user.password); // Set the existing password
      } catch (error) {
        console.error("Error fetching teacher data:", error);
      }
    };

    fetchTeacher();
  }, []);

  const handleUserNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTeacher({ ...teacher, userName: e.target.value });
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTeacher({ ...teacher, email: e.target.value });
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value); // Correctly set the password as a string
  };

  const validatePassword = () => {
    if (password.length < 8) {
      setPasswordError("Password must be at least 8 characters long");
      return false;
    }
    setPasswordError("");
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validatePassword()) {
      return;
    }

    // Handle form submission
    console.log("UserName:", teacher.userName);
    console.log("Email:", teacher.email);
    console.log("Password:", password); // New password set by the user
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  return (
    <div className="lg:ml-[16%] mt-20 flex flex-col items-center">
      <div className="lg:w-[1068px] w-[330px] h-[42px] p-4 bg-white rounded-md flex items-center justify-between shadow-md">
        <span className="flex flex-row lg:gap-2 gap-2 text-[14px] lg:text-[18px] text-gray-700 font-semibold">
          Settings | Account-setting
        </span>
        <Link href={"/#"} passHref>
          <div className="h-[35px] w-[80px] bg-[#1c2b47] flex items-center justify-center rounded-lg hover:bg-[#0f1d33] transition-colors">
            <Image
              src={"/refresh.svg"}
              width={18}
              height={18}
              alt="Refresh Icon"
            />
          </div>
        </Link>
      </div>

      <div className="bg-white mt-6 p-8 rounded-lg shadow-lg w-[90%] lg:w-[500px] max-w-2xl flex flex-col items-center">
        <div className="flex flex-col items-center mb-6">
          <Image
            src={teacher.profilePicture} // Fetch profile picture from the teacher data
            alt="Teacher Profile"
            width={120}
            height={120}
            className="rounded-full mb-4 shadow-lg"
            priority // Add priority to this image for better LCP
          />
          <h3 className="font-bold text-[18px] text-gray-800">{teacher.userName}</h3>
        </div>
        <div className="w-full">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex items-center space-x-2">
              <label className="w-28 font-medium text-gray-600 text-[15px]">UserName:</label>
              <input
                type="text"
                value={teacher.userName}
                onChange={handleUserNameChange}
                className="flex-1 p-3 w-full h-[50px] shadow-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div className="flex items-center space-x-2">
              <label className="w-28 font-medium text-gray-600 text-[15px]">Email:</label>
              <input
                type="text"
                value={teacher.email} // Ensure email is fetched and set correctly
                onChange={handleEmailChange}
                className="flex-1 p-3 w-full h-[50px] shadow-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div className="flex items-center space-x-2 relative">
              <label className="w-28 font-medium text-gray-600 text-[15px]">Password:</label>
              <input
                type={passwordVisible ? "text" : "password"}
                value={password} // New password entered by the user
                onChange={handlePasswordChange}
                className="flex-1 p-3 w-full h-[50px] shadow-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 pr-10"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 focus:outline-none"
              >
                <Image
                  src={passwordVisible ? "/eye.svg" : "/eye-ff.svg"}
                  width={24}
                  height={24}
                  alt="Toggle Password Visibility"
                />
              </button>
            </div>
            {passwordError && (
              <p className="text-red-500 text-sm">{passwordError}</p>
            )}

            {/* Save Button */}
            <div className="flex justify-end mt-6">
              <button
                type="submit"
                className="px-8 py-3 bg-[#213458] text-white font-semibold rounded-lg shadow-md hover:bg-[#FF544A] focus:outline-none focus:ring-2 focus:ring-pink-300 transition"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Page;
