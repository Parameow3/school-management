"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Button from "@/components/Button";
import axios from "axios";
import Dropdown from "@/components/Dropdown";

interface Classroom {
  id: number;
  name: string;
}

interface Student {
  id: number;
  first_name: string;
  last_name: string;
  age: number;
  gender: string;
  admission_date: string;
  class: string;
  dob: string;
  address: string;
  pob: string;
  nationality: string;
  student_passport: string;
  father_name: string;
  father_occupation: string;
  father_phone: string;
  mother_name: string;
  mother_occupation: string;
  mother_phone: string;
  parent_contact: string;
  profile_picture: string;
  belt_level: string;
  phone: string;
  email: string;
  image: File | string;
  branch: number | null;
}

const Page = () => {
  const params = useParams();
  const router = useRouter();
  const id = parseInt(params.editId as string, 10);
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [formData, setFormData] = useState<Student | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  useEffect(() => {
    const tokenFromLocalStorage = localStorage.getItem("authToken");
    if (tokenFromLocalStorage) {
      setToken(tokenFromLocalStorage);
    } else {
      router.push("/login"); // Always navigate to login if no token
    }
  }, [router]);

  // Fetch student data when token and id are available
  useEffect(() => {
    const fetchStudent = async () => {
      if (!token) return;

      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/academics/students/${id}/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const studentData = response.data;
        console.log("image",studentData.image)
        setFormData(studentData);
        if (studentData.image) {
          setImagePreview(studentData.image); // Set initial image preview
        }
        setIsLoading(false);
      } catch (err) {
        setError("Failed to load student data");
        setIsLoading(false);
      }
    };

    fetchStudent();
  }, [id, token]);

  // Fetch classrooms when token is available
  useEffect(() => {
    const fetchClassrooms = async () => {
      if (!token) return;

      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/academics/classroom`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setClassrooms(response.data.results || []); // Assuming paginated data
      } catch (err) {
        setError("Failed to fetch classrooms");
      }
    };

    fetchClassrooms();
  }, [token]);

  if (!formData) {
    return <div className="text-center mt-20">Student not found</div>;
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({ ...prevFormData!, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; // Get the selected file
  
    if (file) {
      setFormData((prevData) => {
        if (!prevData) return null; 
        return {
          ...prevData, 
          image: file, 
        };
      });
  
      // Generate a preview URL for the uploaded image
      setImagePreview(URL.createObjectURL(file));
    }
  };
  
  const handleBranchChange = (selectedBranchId: number) => {
    setFormData({
      ...formData,
      branch: selectedBranchId,
    });
  };
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      Object.keys(formData!).forEach((key) => {
        if (formData![key as keyof Student]) {
          formDataToSend.append(key, (formData as any)[key]);
        }
      });
      const fileInput =
        document.querySelector<HTMLInputElement>("#profile_picture");
      const file = fileInput?.files?.[0];
      if (file) {
        formDataToSend.append("profile_picture", file);
      }

      await axios.put(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/academics/students/${id}/`,
        formDataToSend,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      router.push("/student/all-studen");
      alert("Student updated successfully");
    } catch (error) {
      console.error("Failed to update student", error);
      alert("Failed to update student");
    }
  };

  return (
    <div className="lg:ml-[219px] mt-20 flex flex-col">
      <div className="lg:w-[1079px] w-[330px] h-[40px] p-4 bg-white flex items-center rounded-md justify-between">
        <span className="flex flex-row gap-2 text-[12px] lg:text-[16px]">
          Student |{" "}
          <Image src={"/home.svg"} width={15} height={15} alt="public" /> -
          Update Student
        </span>
        <Link href={"/#"} passHref>
          <div className="h-[23px] w-[57px] bg-[#213458] flex items-center justify-center rounded-md">
            <Image src={"/refresh.svg"} width={16} height={16} alt="Refresh" />
          </div>
        </Link>
      </div>
      <h1 className="text-center lg:text-2xl text-[16px] font-bold mb-8 mt-4 lg:mt-2 border-b-2">
        Edit Information Student Form
      </h1>
      <form
        className="space-y-8"
        onSubmit={handleSubmit}
        encType="multipart/form-data"
      >
        {/* Student Information */}
        <section>
          <h2 className="text-2xl font-bold mb-8 lg:mt-4 border-b-2">
            Student Information
          </h2>
          <div className="grid lg:grid-cols-3 flex-col gap-8">
            <div>
              <label
                htmlFor="first_name"
                className="block text-sm font-medium text-gray-700"
              >
                First Name:
              </label>
              <input
                type="text"
                id="first_name"
                name="first_name"
                value={formData.first_name || ""}
                onChange={handleChange}
                className="mt-1 block lg:w-[272px] w-[329px] h-[40px] rounded-md outline-none border-gray-300 shadow-sm bg-white text-black"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Last Name
              </label>
              <input
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                className="mt-1 block lg:w-[272px] w-[329px] h-[40px] rounded-md outline-none border-gray-300 shadow-sm bg-white text-black"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Age
              </label>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
                className="mt-1 block lg:w-[272px] w-[329px] h-[40px] rounded-md outline-none border-gray-300 shadow-sm bg-white text-black"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Gender
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="mt-1 block lg:w-[272px] w-[329px] h-[40px] rounded-md outline-none border-gray-300 shadow-sm bg-white text-black"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Admission Date
              </label>
              <input
                type="date"
                name="admission_date"
                value={formData.admission_date}
                onChange={handleChange}
                className="mt-1 block lg:w-[272px] w-[329px] h-[40px] rounded-md outline-none border-gray-300 shadow-sm bg-white text-black"
              />
            </div>
            {/* Add more input fields as necessary */}
          </div>
        </section>

        {/* Branch Dropdown */}
        <section>
        <h2 className="text-2xl font-bold mb-8 mt-4 border-b-2">
            Other Information
          </h2>
          <div className="grid lg:grid-cols-3 flex-col gap-8">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Date of Birth
              </label>
              <input
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                className="mt-1 block lg:w-[272px] w-[329px] h-[40px] rounded-md outline-none border-gray-300 shadow-sm bg-white text-black"
              />
            </div>
            <div className="">
              <label className="block text-sm font-medium text-gray-700">
                Nationality
              </label>
              <input
                type="text"
                name="nationality"
                value={formData.nationality}
                onChange={handleChange}
                className="mt-1 block lg:w-[272px] w-[329px] h-[40px] rounded-md outline-none border-gray-300 shadow-sm bg-white text-black"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Belt Level
              </label>
              <input
                type="text"
                name="belt_level"
                value={formData.belt_level}
                onChange={handleChange}
                className="mt-1 block lg:w-[272px] w-[329px] h-[40px] rounded-md outline-none border-gray-300 shadow-sm bg-white text-black"
              />
            </div>
            <div className="">
              <label className="block text-sm font-medium text-gray-700">
                Place of Birth
              </label>
              <input
                type="text"
                name="pob"
                value={formData.pob}
                onChange={handleChange}
                className="mt-1 block lg:w-[272px] w-[329px] h-[40px] rounded-md outline-none border-gray-300 shadow-sm bg-white text-black placeholder-gray-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Student Passport
              </label>
              <input
                type="text"
                name="student_passport"
                value={formData.student_passport}
                onChange={handleChange}
                className="mt-1 block lg:w-[272px] w-[329px] h-[40px] rounded-md outline-none border-gray-300 shadow-sm bg-white text-black"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Phone
              </label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="mt-1 block lg:w-[272px] w-[329px] h-[40px] rounded-md outline-none border-gray-300 shadow-sm bg-white text-black"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="mt-1 block lg:w-[272px] w-[329px] h-[40px] rounded-md outline-none border-gray-300 shadow-sm bg-white text-black"
              />
            </div>
         </div>
        </section>
        <section>
        <h2 className="text-xl font-semibold mb-4 border-b-2">
            Contact Information
          </h2>
          <div className="grid lg:grid-cols-3 flex-col gap-8">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Father's Name
              </label>
              <input
                type="text"
                name="father_name"
                value={formData.father_name}
                onChange={handleChange}
                className="mt-1 block lg:w-[272px] w-[329px] h-[40px] rounded-md outline-none border-gray-300 shadow-sm bg-white text-black"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                father's Occupation
              </label>
              <input
                type="text"
                name="father_occupation"
                value={formData.father_occupation}
                onChange={handleChange}
                className="mt-1 block lg:w-[272px] w-[329px] h-[40px] rounded-md outline-none border-gray-300 shadow-sm bg-white text-black"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Mother's Name
              </label>
              <input
                type="text"
                name="mother_name"
                value={formData.mother_name}
                onChange={handleChange}
                className="mt-1 block lg:w-[272px] w-[329px] h-[40px] rounded-md outline-none border-gray-300 shadow-sm bg-white text-black"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Mother's Occupation
              </label>
              <input
                type="text"
                name="mother_occupation"
                value={formData.mother_occupation}
                onChange={handleChange}
                className="mt-1 block lg:w-[272px] w-[329px] h-[40px] rounded-md outline-none border-gray-300 shadow-sm bg-white text-black"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Address
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="mt-1 block lg:w-[272px] w-[329px] h-[40px] rounded-md outline-none border-gray-300 shadow-sm bg-white text-black"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Parent Contact
              </label>
              <input
                type="text"
                name="parent_contact"
                value={formData.parent_contact}
                onChange={handleChange}
                className="mt-1 block lg:w-[272px] w-[329px] h-[40px] rounded-md outline-none border-gray-300 shadow-sm bg-white text-black"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Branch
              </label>
              <Dropdown
                value={formData.branch ?? undefined} // Use undefined if branch is null
                onChange={handleBranchChange}
              />
            </div>
            <div>
  <label className="block text-sm font-medium text-gray-700">
    Image
  </label>
  <input
    type="file"
    name="image"
    onChange={handleFileChange}
    className="mt-1 block lg:w-[272px] w-[329px] h-[40px] rounded-md outline-none border-gray-300 shadow-sm bg-white text-black"
  />
  <div className="mt-2">
    {/* Display the image preview */}
    {imagePreview && (
      <img
        src={imagePreview} // Show the current or fetched image
        alt="Student"
        className="mt-2 w-40 h-40 object-cover rounded-md border border-gray-300"
      />
    )}
  </div>
</div>

          </div>
        </section>

        {/* Form Actions */}
        <div className="flex justify-center items-center space-x-4">
          <Button bg="secondary" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button>Submit</Button>
        </div>
      </form>
    </div>
  );
};

export default Page;
