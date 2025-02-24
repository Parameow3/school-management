// 'use client';
// import { useState } from "react";
// import Image from "next/image";
// import axios from "axios";
// import { useRouter } from "next/navigation";

// const Login = () => {
//   const [formData, setFormData] = useState({
//     email: "",
//     password: "",
//   });
//   const [passwordVisible, setPasswordVisible] = useState(false);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [errorMessage, setErrorMessage] = useState("");
//   const router = useRouter();

//   // Handle form input changes
//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setFormData((prevData) => ({
//       ...prevData,
//       [name]: value,
//     }));
//   };

//   // Toggle password visibility
//   const togglePasswordVisibility = () => {
//     setPasswordVisible(!passwordVisible);
//   };

//   // Refresh token function
//   const refreshToken = async () => {
//     try {
//       const refreshResponse = await axios.post(
//         `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/refresh-token`,
//         {},
//         {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("authToken")}`,
//           },
//         }
//       );

//       const newToken = refreshResponse.data.token;
//       localStorage.setItem("authToken", newToken);
//       return newToken;
//     } catch (error) {
//       console.error("Failed to refresh token:", error);
//       // Redirect to login page if refreshing token fails
//       router.push("/login");
//       return null;
//     }
//   };

//   // Retry request with refreshed token
//   const retryRequestWithRefreshedToken = async (originalRequest: any) => {
//     const newToken = await refreshToken();
//     if (!newToken) return null; // If refreshing token fails, stop retrying

//     // Retry original request with the new token
//     originalRequest.headers.Authorization = `Bearer ${newToken}`;
//     return axios(originalRequest);
//   };

//   // Handle form submission
//   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     setIsSubmitting(true);
//     setErrorMessage(""); // Clear any previous error message

//     try {
//       // Clear any old token and user data
//       localStorage.removeItem("authToken");
//       localStorage.removeItem("userInfo");
//       localStorage.removeItem("userId");

//       // Call the login API
//       const response = await axios.post(
//         `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/login`,
//         formData
//       );

//       const newToken = response.data.token;
//       const userId = response.data.id;
//       localStorage.setItem("authToken", newToken);

//       const profileResponse = await axios.get(
//         `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/user/${userId}`,
//         {
//           headers: {
//             Authorization: `Bearer ${newToken}`,
//           },
//         }
//       );

//       const newUser = profileResponse.data;
//       localStorage.setItem("userInfo", JSON.stringify(newUser));
//       localStorage.setItem("userId", newUser.id.toString());

//       router.push("/");
//     } catch (error: any) {
//       if (axios.isAxiosError(error)) {
//         if (error.response?.status === 401 || error.response?.status === 403) {
//           // If token is invalid, try refreshing and retrying
//           const originalRequest = error.config;
//           const retryResponse = await retryRequestWithRefreshedToken(originalRequest);

//           if (!retryResponse) {
//             setErrorMessage("Your session has expired. Please log in again.");
//           }
//         } else if (error.response?.status === 400) {
//           setErrorMessage("Invalid email or password.");
//         } else {
//           setErrorMessage("Login failed. Please try again.");
//         }
//       } else {
//         setErrorMessage("An unexpected error occurred. Please try again.");
//       }
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <div className="flex justify-center items-center min-h-screen">
//       <div className="bg-white shadow-xl rounded-lg p-10 max-w-lg w-full">
//         {/* Logo and Welcome Message */}
//         <div className="flex flex-col items-center mb-6">
//           <Image
//             src="/AAA logo.png"
//             alt="Logo"
//             width={100}
//             height={100}
//             className="rounded-full"
//           />
//           <p className="text-gray-700 mt-4 text-center text-lg font-semibold">
//             Welcome back! Please login to your account
//           </p>
//         </div>

//         {/* Error message display */}
//         {errorMessage && (
//           <p className="text-red-600 text-center mb-4">{errorMessage}</p>
//         )}
//         <form onSubmit={handleSubmit} className="space-y-6">
//           {/* Email Input */}
//           <div className="relative">
//             <label htmlFor="email" className="sr-only">
//               Email Address
//             </label>
//             <input
//               type="email"
//               name="email"
//               id="email"
//               value={formData.email}
//               onChange={handleChange}
//               placeholder="Email Address"
//               className="w-full h-[45px] p-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
//               required
//             />
//           </div>

//           {/* Password Input */}
//           <div className="relative">
//             <label htmlFor="password" className="sr-only">
//               Password
//             </label>
//             <input
//               type={passwordVisible ? "text" : "password"}
//               name="password"
//               id="password"
//               value={formData.password}
//               onChange={handleChange}
//               placeholder="Password"
//               className="w-full h-[45px] p-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
//               required
//             />
//             <button
//               type="button"
//               onClick={togglePasswordVisibility}
//               className="absolute inset-y-0 right-4 flex items-center"
//             >
//               <Image
//                 src={passwordVisible ? "/eye-ff.svg" : "/eye.svg"}
//                 width={18}
//                 height={18}
//                 alt="Toggle Password Visibility"
//               />
//             </button>
//           </div>

//           {/* Action Buttons */}
//           <div className="flex space-x-4 mt-4">
//             <button
//               type="submit"
//               disabled={isSubmitting}
//               className="w-full bg-[#213458] text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//               {isSubmitting ? "Logging in..." : "LOGIN"}
//             </button>
//             <button
//               type="button"
//               className="w-full bg-white text-blue-600 border border-blue-600 py-3 rounded-lg font-semibold hover:bg-gray-100 transition duration-300"
//               onClick={() => router.push("/")}>
//               Cancel
//             </button>
//           </div>
//         </form>

//         {/* Terms and Privacy Policy */}
//         <div className="text-sm text-gray-500 mt-8 text-center">
//           By signing up, you agree to our company's{" "}
//           <a href="#" className="text-[#213458] hover:text-blue-800">
//             Terms and Conditions
//           </a>{" "}
//           and{" "}
//           <a href="#" className="text-[#213458] hover:text-[#213498]">
//             Privacy Policy
//           </a>.
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Login;

'use client';
import { useState } from "react";
import Image from "next/image";
import axios from "axios";
import { useRouter } from "next/navigation";

const Login = () => {
  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    password: "",
  });
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");  // Clear any previous error message

    try {
      // Clear any old token and user data
      localStorage.removeItem("authToken");
      localStorage.removeItem("userInfo");
      localStorage.removeItem("userId");

      // Call the login API
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/login`,
        formData
      );

      const newToken = response.data.token;
      const userId = response.data.id;
      localStorage.setItem("authToken", newToken);
      const profileResponse = await axios.get(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/user/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${newToken}`,
          },
        }
      );

      const newUser = profileResponse.data;
      localStorage.setItem("userInfo", JSON.stringify(newUser));
      localStorage.setItem("userId", newUser.id.toString());

      router.push("/");
    } catch (error: any) {
      // Error handling for failed login
      if (axios.isAxiosError(error) && error.response) {
        if (error.response.status === 400) {
          setErrorMessage("Invalid email or password.");
        } else {
          setErrorMessage("Login failed. Please try again.");
        }
      } else {
        setErrorMessage("An unexpected error occurred. Please try again.");
      }
    } finally {
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

        {/* Error message display */}
        {errorMessage && (
          <p className="text-red-600 text-center mb-4">{errorMessage}</p>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
         

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

          {/* Password Input */}
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

          {/* Action Buttons */}
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
              onClick={() => router.push("/")}>
              Cancel
            </button>
          </div>
        </form>

        {/* Terms and Privacy Policy */}
        <div className="text-sm text-gray-500 mt-8 text-center">
          By signing up, you agree to our company's{" "}
          <a href="#" className="text-[#213458] hover:text-blue-800">
            Terms and Conditions
          </a>{" "}
          and{" "}
          <a href="#" className="text-[#213458] hover:text-[#213498]">
            Privacy Policy
          </a>.
        </div>
      </div>
    </div>
  );
};

export default Login;
