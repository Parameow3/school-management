"use client";
import { useState } from "react";
import Image from "next/image";
import axios from "axios";
import { useRouter } from "next/navigation";

const Login = ({  }) => {
  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    password: "",
  });
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter(); 

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true); // Disable form while submitting
  
    try {
      // Remove old token and user data from localStorage
      console.log("Removing old user data...");
      localStorage.removeItem("authToken");
      localStorage.removeItem("userInfo");
      localStorage.removeItem("userId");
  
      // Call the login API
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/login`, // Using NEXT_PUBLIC_BASE_URL
        formData
      );
  
      const newToken = response.data.token;
      console.log("New Token Received:", newToken);
  
      // Store the new token in localStorage
      localStorage.setItem("authToken", newToken);
  
      // Fetch user profile using the token
      const profileResponse = await axios.get(
       `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/user`,
        {
          headers: {
            Authorization: `Bearer ${newToken}`,
          },
        }
      );
  
      const newUser = profileResponse.data.results[0];
      console.log("New User Info:", newUser);
  
      // Store user information in localStorage
      localStorage.setItem(
        "userInfo",
        JSON.stringify({
          username: newUser.username,
          email: newUser.email,
          profile_image: newUser.profile_image || "/photo.jpg",
        })
      );
      localStorage.setItem("userId", newUser.id);
      router.push("/");
    } catch (error) {
      console.error("Error during login:", error);
  
      // If the API fails, set an error message
      setErrorMessage("Login failed. Please check your credentials and try again.");
    } finally {
      // Re-enable the form after submission
      setIsSubmitting(false);
    }
  };
  

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-xl rounded-lg p-10 max-w-lg w-full">
        {/* Logo and Welcome Message */}
        <div className="flex flex-col items-center mb-6">
          <Image
            src="/AAA logo.png"
            alt="Logo"
            width={100}
            height={100}
            className="rounded-full"
          />
          <p className="text-gray-700 mt-4 text-center text-lg font-semibold">
            Welcome back! Please login to your account
          </p>
        </div>
        {errorMessage && (
          <p className="text-red-600 text-center mb-4">{errorMessage}</p>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Username Input */}
          <div className="relative">
            <label htmlFor="userName" className="sr-only">
              Username
            </label>
            <input
              type="text"
              name="userName"
              id="userName"
              value={formData.userName}
              onChange={handleChange}
              placeholder="Username"
              className="w-full h-[45px] p-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Email Input */}
          <div className="relative">
            <label htmlFor="email" className="sr-only">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email Address"
              className="w-full h-[45px] p-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="relative">
            <label htmlFor="password" className="sr-only">
              Password
            </label>
            <input
              type={passwordVisible ? "text" : "password"}
              name="password"
              id="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              className="w-full h-[45px] p-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute inset-y-0 right-4 flex items-center"
            >
              <Image
                src={passwordVisible ? "/eye-ff.svg" : "/eye.svg"}
                width={18}
                height={18}
                alt="Toggle Password Visibility"
              />
            </button>
          </div>
          <div className="flex space-x-4 mt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#213458] text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Logging in..." : "LOGIN"}
            </button>
            <button
              type="button"
              className="w-full bg-white text-blue-600 border border-blue-600 py-3 rounded-lg font-semibold hover:bg-gray-100 transition duration-300"
              onClick={() => router.push("/")}
            >
              Cancel
            </button>
          </div>
        </form>
        <div className="text-sm text-gray-500 mt-8 text-center">
          By signing up, you agree to our company's{" "}
          <a href="#" className="text-blue-600 hover:text-blue-800">
            Terms and Conditions
          </a>{" "}
          and{" "}
          <a href="#" className="text-blue-600 hover:text-blue-800">
            Privacy Policy
          </a>
          .
        </div>
      </div>
    </div>
  );
};

export default Login;
