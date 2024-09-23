'use client';
import { useState } from 'react';
import Image from 'next/image'; // Make sure you're using Next.js Image component for images.
import axios from 'axios';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [passwordVisible, setPasswordVisible] = useState(true); // For toggling password visibility

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, password: e.target.value });
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleSubmit = async  (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Login form submitted:', formData);
    try{
      const response = await axios.post("http://127.0.0.1:8000/api/auth/login" , formData);
      console.log("response : " , response);
      window.location.href = "/";
    }catch(err:unknown |any){
      console.error(err.response ? err.response.data : err.message);  // Log the actual error from server
    }
  };

  return (
    <div
      className="h-screen flex justify-center items-center bg-cover bg-center"
    >
      <div className="bg-white bg-opacity-90 shadow-lg rounded-lg flex overflow-hidden max-w-4xl w-full">
        {/* Left side - Form */}
        <div className="w-1/2 p-10 flex flex-col justify-between">
          <div>
            {/* Logo */}
            <div className="flex items-center justify-center">
              <Image src="/AAA logo.png" alt="PlutoDevices" className="w-[100px] h-[100px]" />
            </div>
            {/* Welcome Text */}
            <p className="text-gray-600 mt-2 text-sm text-center">
              Welcome back! Please login to your account to continue
            </p>
          </div>
          
          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Input */}
            <div className="relative">
              <label className="sr-only">Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email Address"
                className="w-[240px] h-[40px] p-4 pr-12 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="relative">
              <label className="sr-only">Password</label>
              <input
                type={passwordVisible ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handlePasswordChange}
                placeholder="Password"
                className="w-[240px] h-[40px] p-4 pr-12 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute inset-y-0 right-4 flex items-center focus:outline-none"
              >
                <Image
                  src={passwordVisible ? "/eye.svg" : "/eye-ff.svg"} 
                  width={18}
                  height={18}
                  alt="Toggle Password Visibility"
                />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input type="checkbox" id="remember" className="mr-2" />
                <label htmlFor="remember" className="text-gray-600 text-sm">
                  Remember me
                </label>
              </div>
            </div>
            <div className="flex space-x-4">
              <button
                type="submit"
                className="w-1/2 bg-[#213458] text-sm text-white py-2 rounded-md font-semibold hover:bg-blue-600 transition duration-300"
              >
                LOGIN
              </button>
              <button
                type="button"
                className="w-1/2 bg-white text-[#213458] border border-[#213458] py-2 rounded-md font-semibold hover:bg-gray-100 transition duration-300"
              >
                Cancel
              </button>
            </div>
          </form>
          <div className="text-sm text-gray-500 mt-8 text-center">
            By signing up, you agree to our company's{' '}
            <a href="#" className="text-blue-600 hover:text-blue-800">
              Terms and Conditions
            </a>{' '}
            and{' '}
            <a href="#" className="text-blue-600 hover:text-blue-800">
              Privacy Policy
            </a>
          </div>
        </div>

        {/* Right side - Background Image */}
        <div
          className="w-1/2 bg-fixed bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('/school.jpg')`, // Replace with your uploaded background image path
          }}
        ></div>
      </div>
    </div>
  );
};

export default Login;
