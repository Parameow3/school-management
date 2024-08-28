"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";

interface Teacher {
  userName: string;
  phone: string;
  password: string;
  profilePicture: string;
}

const mockupTeacher: Teacher = {
  userName: "Lyseth",
  phone: "123-456-7890",
  password: "Robotics",
  profilePicture: "/photo.jpg", // Ensure this path is correct
};

const Page = () => {
  const [teacher, setTeacher] = useState<Teacher>(mockupTeacher);
  const [phone, setPhone] = useState<string>(teacher.phone);
  const [password, setPassword] = useState<string>(teacher.password);
  const [passwordError, setPasswordError] = useState<string>("");
  const [passwordVisible, setPasswordVisible] = useState<boolean>(false);

  const handleUserNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTeacher({ ...teacher, userName: e.target.value });
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhone(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
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

    console.log("UserName:", teacher.userName);
    console.log("Phone:", phone);
    console.log("Password:", password);
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  return (
    <div className="lg:ml-[219px] mt-20 flex flex-col">
      <div className="lg:w-[1068px] w-[330px] h-[42px] p-4 bg-white rounded-md flex items-center justify-between">
        <span className="flex flex-row lg:gap-2 gap-2 text-[12px] lg:text-[16px]">
          Setting |
          <Image
            src={"/setting.svg"}
            width={15}
            height={15}
            alt="Settings Icon"
          />
          - Account-setting
        </span>
        <Link href={"/#"} passHref>
          <div className="h-[23px] w-[57px] bg-[#1c2b47] flex items-center justify-center rounded-md">
            <Image
              src={"/refresh.svg"}
              width={16}
              height={16}
              alt="Refresh Icon"
            />
          </div>
        </Link>
      </div>

      <div className="bg-white mt-6 p-6 rounded-lg shadow-lg w-[90%] lg:w-[700px] max-w-2xl">
        <div className="flex flex-col lg:flex-row items-center lg:items-start">
          <div className="flex flex-col items-center mb-4 lg:mb-0 lg:mr-8">
            <Image
              src={teacher.profilePicture}
              alt="Teacher Profile"
              width={100}
              height={100}
              className="rounded-full mb-2"
            />
            <h3 className="font-semibold text-[15px]">{teacher.userName}</h3>
          </div>
          <div className="flex-1 w-full">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex items-center space-x-2">
                <label className="w-28 font-medium">UserName:</label>
                <input
                  type="text"
                  value={teacher.userName}
                  onChange={handleUserNameChange}
                  className="flex-1 p-2 w-[400px] h-[45px] shadow-sm border rounded-[12px] focus:outline-none focus:ring-2 focus:ring-pink-300"
                />
              </div>
              <div className="flex items-center space-x-2">
                <label className="w-28 font-medium">Phone:</label>
                <input
                  type="text"
                  value={phone}
                  onChange={handlePhoneChange}
                  className="flex-1 px-3 py-2 border rounded-[12px] focus:outline-none focus:ring-2 focus:ring-pink-300"
                />
              </div>
              <div className="flex items-center space-x-2 relative">
                <label className="w-28 font-medium">Password:</label>
                <input
                  type={passwordVisible ? "text" : "password"}
                  value={password}
                  onChange={handlePasswordChange}
                  className="flex-1 px-3 py-2 border rounded-[12px] focus:outline-none focus:ring-2 focus:ring-pink-300 pr-10" // Added padding-right for icon
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 focus:outline-none"
                >
                  <Image
                    src={passwordVisible ? "/eye.svg" : "/eye-ff.svg"}
                    width={22}
                    height={22}
                    alt="Toggle Password Visibility"
                  />
                </button>
              </div>
              {passwordError && (
                <p className="text-red-500 text-sm">{passwordError}</p>
              )}
              <div className="flex justify-end mt-6">
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#FF6F61] text-white font-semibold rounded-md focus:outline-none focus:ring-2 focus:ring-pink-300"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
