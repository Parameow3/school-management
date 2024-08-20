"use client";
import React, { useState } from "react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

const Register = () => {
  const [userName, setUserName] = useState("");
  const [gmail, setGmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [visible, setVisible] = useState(false);
  const [errors, setErrors] = useState({ gmail: "", password: "", confirmPassword: "" });

  const validateGmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (pwd: string) => {
    const isValidLength = pwd.length >= 8;
    return  isValidLength;
  };

  const handleGmailChange = (e: any) => {
    setGmail(e.target.value);
  };

  const handlePasswordChange = (e: any) => {
    setPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (e: any) => {
    setConfirmPassword(e.target.value);
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    let validationErrors = {
      gmail: validateGmail(gmail) ? "" : "Invalid email address",
      password: validatePassword(password)
        ? ""
        : "Password must be at least 8 characters",
      confirmPassword: password === confirmPassword ? "" : "Passwords do not match",
    };

    setErrors(validationErrors);

    const hasErrors = Object.values(validationErrors).some((error) => error !== "");

    if (!hasErrors) {
      console.log({
        userName,
        gmail,
        phoneNumber,
        address,
        password,
        confirmPassword,
      });
    } else {
      console.log("Validation failed");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="h-full w-[350px] m-auto bg-slate-500 p-3">
      <h1 className="text-center font-bold">Register</h1>
      <div className="flex flex-col mt-2 gap-2">
        <h2>UserName</h2>
        <input
          type="text"
          className="p-3 border border-black"
          placeholder="input name"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
        />
      </div>
      <div className="flex flex-col mt-2 gap-2">
        <h2>Gmail</h2>
        <input
          type="email"
          className="p-3 border border-black"
          placeholder="input your gmail"
          value={gmail}
          onChange={handleGmailChange}
        />
        {errors.gmail && <p className="text-red-500">{errors.gmail}</p>}
      </div>
      <div className="flex flex-col mt-2 gap-2">
        <h2>Phone Number</h2>
        <input
          type="text"
          className="p-3 border border-black"
          placeholder="Input your phone number"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
        />
      </div>
      <div className="flex flex-col mt-2 gap-2">
        <h2>Address</h2>
        <input
          type="text"
          className="p-3 border border-black"
          placeholder="Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
      </div>
      <div className="flex flex-col mt-2 gap-2 relative">
        <h2>Password</h2>
        <div className="relative flex items-center">
          <input
            type={visible ? "text" : "password"}
            value={password}
            onChange={handlePasswordChange}
            className="p-3 border border-black w-full"
            placeholder="Password"
          />
          <div
            className="absolute right-3 cursor-pointer"
            onClick={() => setVisible(!visible)}
          >
            {visible ? (
              <EyeSlashIcon className="h-5 w-5 text-gray-700" />
            ) : (
              <EyeIcon className="h-5 w-5 text-gray-700" />
            )}
          </div>
        </div>
        {errors.password && <p className="text-red-500">{errors.password}</p>}
      </div>
      <div className="flex flex-col mt-2 gap-2 relative">
        <h2>Confirm Password</h2>
        <div className="relative flex items-center">
          <input
            type={visible ? "text" : "password"}
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
            className="p-3 border border-black w-full"
            placeholder="Confirm Password"
          />
        </div>
        {errors.confirmPassword && <p className="text-red-500">{errors.confirmPassword}</p>}
      </div>
      <div className="flex items-center justify-center mt-4">
        <button type="submit" className="p-4 bg-green-300">
          Register
        </button>
      </div>
    </form>
  );
};

export default Register;
