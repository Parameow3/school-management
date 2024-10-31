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
  branch: number | null;
}

const Page = () => {
  const params = useParams();
  const router = useRouter();
  const id = parseInt(params.editId as string, 10);

  // States
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [selectedClassroom, setSelectedClassroom] = useState<number | null>(
    null
  );
  const [formData, setFormData] = useState<Student | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null); // Image preview

  // Fetch token once
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
        setFormData(studentData);
        if (studentData.profile_picture) {
          setImagePreview(studentData.profile_picture); // Set initial image preview
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
    const file = e.target.files?.[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file)); // Preview image
      setFormData((prevFormData) => ({
        ...prevFormData!,
        profile_picture: file.name,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();

      // Append all form data
      Object.keys(formData!).forEach((key) => {
        if (formData![key as keyof Student]) {
          formDataToSend.append(key, (formData as any)[key]);
        }
      });

      // Append the file (profile picture) if present
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

            {/* Add more input fields as necessary */}
          </div>
        </section>

        {/* Branch Dropdown */}
        <section>
          <div>
            <label
              htmlFor="branch"
              className="block text-sm font-medium text-gray-700"
            >
              Branch:
            </label>
            <Dropdown
              value={formData.branch || undefined}
              onChange={(value: number) =>
                setFormData((prev) => ({ ...prev!, branch: value }))
              }
            />
          </div>
        </section>

        {/* Profile Picture Upload */}
        <section>
          <div>
            <label
              htmlFor="profile_picture"
              className="block text-sm font-medium text-gray-700"
            >
              Profile Picture:
            </label>
            <input
              type="file"
              id="profile_picture"
              name="profile_picture"
              accept="image/*"
              onChange={handleFileChange}
              className="mt-1 block lg:w-[272px] w-[329px] h-[40px] rounded-md outline-none border-gray-300 shadow-sm"
            />
            {imagePreview && (
              <div className="mt-4">
                <Image
                  src={imagePreview}
                  alt="Profile Preview"
                  width={192}
                  height={192}
                  className="rounded-full"
                />
              </div>
            )}
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
