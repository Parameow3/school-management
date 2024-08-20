'use client'
import React, { useState } from "react";
import Button from "./Button";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Username:", username);
    console.log("Password:", password);
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <form
        onSubmit={handleSubmit}
        className="w-[406px] h-[430px] bg-[#213458] flex flex-col rounded-[15px] p-4 items-center"
      >
        <h1 className="font-bold text-xl text-center p-5 text-white">Login</h1>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-[348px] h-[54px] p-2 border border-black outline-none border-none rounded-md"
          placeholder="Enter your Username"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="p-2 mt-4 border w-[348px] h-[54px] border-black outline-none border-none rounded-md"
          placeholder="Enter Your Password"
        />
        <h1 className="text-gray-200 mr-52 p-2">Forget password?</h1>
        <Button>Submit</Button>
      </form>
    </div>
  );
};

export default Login;
