"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Dropdown from "@/components/Dropdown";
import Image from "next/image";
import Link from "next/link";
import Button from "@/components/Button";
interface FormDataType {
  first_name: string;
  last_name: string;
  age: string;
  gender: string;
  dob: string;
  pob: string;
  nationality: string;
  belt_level: string;
  phone: string;
  email: string;
  mother_name: string;
  mother_occupation: string;
  father_name: string;
  father_occupation: string;
  address: string;
  parent_contact: string;
  student_passport: string;
  admission_date: string;
  branch: number | null; // Branch can be a number or null
  image: File | null; // Image is a file or null
  classrooms: string[]; // Array of classroom identifiers
}

const Page= ()=> {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormDataType>({
    first_name: "",
    last_name: "",
    age: "",
    gender: "Male",
    dob: "",
    pob: "",
    nationality: "",
    belt_level: "",
    phone: "",
    email: "",
    mother_name: "",
    mother_occupation: "",
    father_name: "",
    father_occupation: "",
    address: "",
    parent_contact: "",
    student_passport: "",
    admission_date: "",
    branch: null, 
    image: null, 
    classrooms: [],
  });

  useEffect(() => {
    const tokenFromLocalStorage = localStorage.getItem("authToken");
    if (tokenFromLocalStorage) {
      setToken(tokenFromLocalStorage);
    } else {
      router.push("/login");
    }
  }, [router]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type, files } = e.target as HTMLInputElement;
    setFormData({
      ...formData,
      [name]: type === "file" ? (files ? files[0] : null) : value,
    });
  };

  const handleBranchChange = (selectedBranchId: number) => {
    setFormData({
      ...formData,
      branch: selectedBranchId,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const data = new FormData();
    for (const key in formData) {
      const value = formData[key as keyof FormDataType];
      if (value !== null) {
        data.append(key, value instanceof File ? value : String(value));
      }
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/academics/students/`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: data,
        }
      );

      if (response.ok) {
        alert("Student data saved successfully!");
        setFormData({
          first_name: "",
          last_name: "",
          age: "",
          gender: "Male",
          dob: "",
          pob: "",
          nationality: "",
          belt_level: "black",
          phone: "",
          email: "",
          mother_name: "",
          mother_occupation: "",
          father_name: "",
          father_occupation: "",
          address: "",
          parent_contact: "",
          student_passport: "",
          admission_date: "",
          branch: null,
          image: null,
          classrooms: [],
        });
      } else {
        const errorData = await response.json();
        alert(
          `Failed to save student data: ${errorData.message || "Unknown error"}`
        );
      }
    } catch (error: any) {
      alert(`Error: ${error.message}`);
    }
  };

  return (
    <div className="lg:ml-[18%] ml-[11%] mt-20 h-[1040px] flex flex-col">
      <div className="lg:w-[1040px] w-[330px] h-[40px] p-4 bg-white flex items-center rounded-md justify-between">
        <span className="flex flex-row gap-2 text-[12px] lg:text-[15px]">
          Student |{" "}
          <Image src="/home.svg" width={15} height={15} alt="public" />{" "}
          New-student
        </span>

        <Link href="/#" passHref>
          <div className="h-[23px] w-[57px] bg-[#213458] flex items-center justify-center rounded-md">
            <Image src="/refresh.svg" width={16} height={16} alt="Refresh" />
          </div>
        </Link>
      </div>

      <h1 className="text-center text-2xl font-bold mb-8 mt-4 border-b-2">
        Admission Form
      </h1>
      <form onSubmit={handleSubmit} className="space-y-8">
        <section>
          <h2 className="text-2xl font-bold mb-8 lg:mt-4 border-b-2">
            Student Information Form
          </h2>
          <div className="grid lg:grid-cols-3 flex-col gap-8">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                First Name
              </label>
              <input
                type="text"
                name="first_name"
                value={formData.first_name}
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
          </div>
        </section>
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
                onChange={handleChange}
                className="mt-1 block lg:w-[272px] w-[329px] h-[40px] rounded-md outline-none border-gray-300 shadow-sm bg-white text-black"
              />
            </div>
          </div>
        </section>
        <div className="flex justify-center items-center space-x-4">
          <Button bg="secondary">Cancel</Button>
          <Button>Submit</Button>
        </div>
      </form>
    </div>
  );
}
export default Page;