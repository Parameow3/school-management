"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Button from "@/components/Button";
import axios from "axios";
import Dropdown from "@/components/Dropdown";
import { useRouter } from "next/navigation";
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
}
interface Classroom {}
const Page = () => {
  const params = useParams();
  const router = useRouter();
  const id = parseInt(params.editId as string, 10);

  // States
  const [classrooms, setClassrooms] = useState<Classroom[]>([]);
  const [selectedClassroom, setSelectedClassroom] = useState<number | null>(null);
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
      if (!token) return; // If no token, skip fetching

      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/academics/students/${id}/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setFormData(response.data);
        setIsLoading(false);
      } catch (err) {
        setError("Failed to load student data");
        setIsLoading(false);
      }
    };

    fetchStudent(); // Always call the fetch function unconditionally
  }, [id, token]); // Hook runs whenever id or token changes

  // Fetch classrooms when token is available
  useEffect(() => {
    const fetchClassrooms = async () => {
      if (!token) return; // Early exit if no token

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
      } finally {
        setIsLoading(false); // Ensure loading state is updated
      }
    };

    fetchClassrooms(); // Always call the fetch function unconditionally
  }, [token]);

  if (!formData) {
    return <div className="text-center mt-20">Student not found</div>;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({ ...prevFormData!, [name]: value }));
  };

  const handleClassroomChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedClassroomId = parseInt(e.target.value, 10);
    setSelectedClassroom(selectedClassroomId);

    setFormData((prevData) => {
      if (prevData) {
        return { ...prevData, class: e.target.value };
      }
      return prevData;
    });
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
      const fileInput = document.querySelector<HTMLInputElement>("#profile_picture");
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
            "Content-Type": "multipart/form-data", // Important for file uploads
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
                value={formData?.first_name || ""}
                onChange={handleChange}
                className="mt-1 block lg:w-[272px] w-[329px] h-[40px] rounded-md outline-none border-gray-300 shadow-sm bg-white text-black"
              />
            </div>

            <div>
              <label
                htmlFor="last_name"
                className="block text-sm font-medium text-gray-700"
              >
                Last Name:
              </label>
              <input
                type="text"
                id="last_name"
                name="last_name"
                value={formData?.last_name || ""}
                onChange={handleChange}
                className="mt-1 block lg:w-[272px] w-[329px] h-[40px] rounded-md outline-none border-gray-300 shadow-sm bg-white text-black"
              />
            </div>

            <div>
              <label
                htmlFor="age"
                className="block text-sm font-medium text-gray-700"
              >
                Age:
              </label>
              <input
                type="text"
                id="age"
                name="age"
                value={formData?.age || ""}
                onChange={handleChange}
                className="mt-1 block lg:w-[272px] w-[329px] h-[40px] rounded-md outline-none border-gray-300 shadow-sm"
              />
            </div>

            <div>
              <label
                htmlFor="gender"
                className="block text-sm font-medium text-gray-700"
              >
                Gender:
              </label>
              <select
                id="gender"
                name="gender"
                value={formData?.gender || ""}
                onChange={handleChange}
                className="mt-1 block lg:w-[272px] w-[329px] h-[40px] rounded-md outline-none border-gray-300 shadow-sm"
              >
                <option value="Female">Female</option>
                <option value="Male">Male</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="admission_date"
                className="block text-sm font-medium text-gray-700"
              >
                Admission Date:
              </label>
              <input
                type="date"
                id="admission_date"
                name="admission_date"
                value={formData?.admission_date || ""}
                onChange={handleChange}
                className="mt-1 block lg:w-[272px] w-[329px] h-[40px] rounded-md outline-none border-gray-300 shadow-sm"
              />
            </div>
            <div>
              <label
                htmlFor="classroom"
                className="block text-sm font-medium text-gray-700"
              >
                Classroom:
              </label>
              <select
                id="classroom"
                name="classroom"
                value={selectedClassroom || ""}
                onChange={handleClassroomChange}
                className="mt-1 block lg:w-[272px] w-[329px] h-[40px] rounded-md outline-none border-gray-300 shadow-sm"
              >
                <option value="" disabled>
                  Select a classroom
                </option>
                {classrooms.map((classroom) => (
                  <option key={classroom.id} value={classroom.id}>
                    {classroom.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label
                htmlFor="branch"
                className="block text-sm font-medium text-gray-700"
              >
                Branch:
              </label>
              <Dropdown
                onChange={(value: number) =>
                  setFormData((prev) => prev && { ...prev, branch: value })
                }
              />
            </div>

            {/* Profile Picture Upload */}
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
          </div>
        </section>
        <section>
          <h2 className="text-2xl font-bold mb-8 mt-4 border-b-2">
            Other Information
          </h2>
          <div className="grid lg:grid-cols-3 flex-col gap-8">
            <div>
              <label
                htmlFor="dob"
                className="block text-sm font-medium text-gray-700"
              >
                Date of Birth:
              </label>
              <input
                type="date"
                id="dob"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                className="mt-1 block lg:w-[272px] w-[329px] h-[40px] outline-none rounded-md border-gray-300 shadow-sm"
              />
            </div>

            <div>
              <label
                htmlFor="nationality"
                className="block text-sm font-medium text-gray-700"
              >
                Nationality:
              </label>
              <input
                type="text"
                id="nationality"
                name="nationality"
                value={formData.nationality}
                onChange={handleChange}
                className="mt-1 block lg:w-[272px] w-[329px] h-[40px] rounded-md outline-none border-gray-300 shadow-sm"
              />
            </div>

            <div>
              <label
                htmlFor="placeOfBirth"
                className="block text-sm font-medium text-gray-700"
              >
                Place of Birth:
              </label>
              <input
                type="text"
                id="placeOfBirth"
                name="placeOfBirth"
                value={formData.pob}
                onChange={handleChange}
                className="mt-1 block lg:w-[272px] w-[329px] h-[40px] rounded-md outline-none border-gray-300 shadow-sm"
              />
            </div>

            <div>
              <label
                htmlFor="beltLevel"
                className="block text-sm font-medium text-gray-700"
              >
                Belt Level:
              </label>
              <input
                type="text"
                id="beltLevel"
                name="beltLevel"
                value={formData.belt_level}
                onChange={handleChange}
                className="mt-1 block lg:w-[272px] w-[329px] h-[40px] rounded-md outline-none border-gray-300 shadow-sm"
              />
            </div>

            <div>
              <label
                htmlFor="studentPassport"
                className="block text-sm font-medium text-gray-700"
              >
                Student Passport:
              </label>
              <input
                type="text"
                id="studentPassport"
                name="studentPassport"
                value={formData.student_passport}
                onChange={handleChange}
                className="mt-1 block lg:w-[272px] w-[329px] h-[40px] rounded-md outline-none border-gray-300 shadow-sm"
              />
            </div>

            <div>
              <label
                htmlFor="address"
                className="block text-sm font-medium text-gray-700"
              >
                Address:
              </label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="mt-1 block lg:w-[272px] w-[329px] h-[40px] rounded-md outline-none border-gray-300 shadow-sm"
              />
            </div>
          </div>
        </section>

        {/* Contact Information */}
        <section>
          <h2 className="text-xl font-semibold mb-4 border-b-2">
            Contact Information
          </h2>
          <div className="grid lg:grid-cols-3 flex-col gap-8">
            <div>
              <label
                htmlFor="fatherName"
                className="block text-sm font-medium text-gray-700"
              >
                Father's Name:
              </label>
              <input
                type="text"
                id="fatherName"
                name="fatherName"
                value={formData.father_name}
                onChange={handleChange}
                className="mt-1 block lg:w-[272px] w-[329px] h-[40px] outline-none rounded-md border-gray-300 shadow-sm"
              />
            </div>

            <div>
              <label
                htmlFor="fatherOccupation"
                className="block text-sm font-medium text-gray-700"
              >
                Father's Occupation:
              </label>
              <input
                type="text"
                id="fatherOccupation"
                name="fatherOccupation"
                value={formData.father_occupation}
                onChange={handleChange}
                className="mt-1 block lg:w-[272px] w-[329px] h-[40px] outline-none rounded-md border-gray-300 shadow-sm"
              />
            </div>

            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-700"
              >
                Phone:
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.father_phone}
                onChange={handleChange}
                className="mt-1 block lg:w-[272px] w-[329px] h-[40px] outline-none rounded-md border-gray-300 shadow-sm"
              />
            </div>

            <div>
              <label
                htmlFor="motherName"
                className="block text-sm font-medium text-gray-700"
              >
                Mother's Name:
              </label>
              <input
                type="text"
                id="motherName"
                name="motherName"
                value={formData.mother_name}
                onChange={handleChange}
                className="mt-1 block lg:w-[272px] w-[329px] h-[40px] outline-none rounded-md border-gray-300 shadow-sm"
              />
            </div>

            <div>
              <label
                htmlFor="motherOccupation"
                className="block text-sm font-medium text-gray-700"
              >
                Mother's Occupation:
              </label>
              <input
                type="text"
                id="motherOccupation"
                name="motherOccupation"
                value={formData.mother_occupation}
                onChange={handleChange}
                className="mt-1 block lg:w-[272px] w-[329px] h-[40px] outline-none rounded-md border-gray-300 shadow-sm"
              />
            </div>

            <div>
              <label
                htmlFor="parentContact"
                className="block text-sm font-medium text-gray-700"
              >
                Parent Contact:
              </label>
              <input
                type="text"
                id="parentContact"
                name="parentContact"
                value={formData.parent_contact}
                onChange={handleChange}
                className="mt-1 block lg:w-[272px] w-[329px] h-[40px] outline-none rounded-md border-gray-300 shadow-sm"
              />
            </div>
          </div>
        </section>

        {/* Form Actions */}
        <div className="flex justify-center items-center space-x-4">
          <Button bg="secondary">Cancel</Button>
          <Button>Submit</Button>
        </div>
      </form>
    </div>
  );
};

export default Page;
