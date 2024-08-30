"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Dropdown from "@/components/Dropdown";
import { useParams } from "next/navigation";
import Button from "@/components/Button";

interface TeacherProp {
  id: number;
  firstName: string;
  lastName: string;
  userName: string;
  program: string;
  profilePicture: string;
  branch: string;
}

const Page = () => {
  const mockupTeachers: TeacherProp[] = [
    {
      id: 1,
      firstName: "Lyseth",
      lastName: "Pham",
      userName: "Potio",
      program: "Robotics",
      profilePicture: "/photo.jpg",
      branch: "FM",
    },
    {
      id: 2,
      firstName: "John",
      lastName: "Doe",
      userName: "jdoe",
      program: "Mathematics",
      profilePicture: "/photo.jpg",
      branch: "NY",
    },
    {
      id: 3,
      firstName: "Jane",
      lastName: "Smith",
      userName: "jsmith",
      program: "Science",
      profilePicture: "/photo.jpg",
      branch: "LA",
    },
  ];

  const params = useParams();
  const id = parseInt(params.editId as string, 10);
  console.log("id", id);

  // Always call the useState hook before any conditional return
  const selectedTeacher = mockupTeachers.find((item) => item.id === id);

  const [formData, setFormData] = useState({
    firstName: selectedTeacher?.firstName || "",
    lastName: selectedTeacher?.lastName || "",
    userName: selectedTeacher?.userName || "",
    program: selectedTeacher?.program || "",
    branch: selectedTeacher?.branch || "",
    phone: "",
    uploadPicture: "",
  });

  if (!selectedTeacher) {
    return <div className="text-center mt-20">Teacher not found</div>;
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, uploadPicture: file.name });
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(formData);
  };

  return (
    <div className="lg:ml-[219px] mt-20 flex flex-col">
      <div className="lg:w-[1079px] w-[330px] h-[40px] p-4 bg-white flex items-center rounded-md justify-between">
        <span className="flex flex-row gap-2 text-[12px] lg:text-[15px]">
          Teacher |{" "}
          <Image src={"/home.svg"} width={15} height={15} alt="public" />{" "}
          Update Teacher
        </span>

        <Link href={"/#"} passHref>
          <div className="h-[23px] w-[57px] bg-[#213458] flex items-center justify-center rounded-md">
            <Image src={"/refresh.svg"} width={16} height={16} alt="Refresh" />
          </div>
        </Link>
      </div>

      <h1 className="text-center text-2xl font-bold mb-8 mt-4 border-b-2">
        Update Teacher Form
      </h1>
      <form className="space-y-8" onSubmit={handleSubmit}>
        <section>
          <h2 className="text-2xl font-bold mb-8 lg:mt-4 border-b-2">
            Teacher Information
          </h2>
          <div className="grid lg:grid-cols-3 flex-col gap-8">
            <div>
              <label
                htmlFor="firstName"
                className="block text-sm font-medium text-gray-700"
              >
                First Name:
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="mt-1 block p-2 lg:w-[272px] w-[329px] h-[40px] rounded-md outline-none border-gray-300 shadow-sm"
              />
            </div>

            <div>
              <label
                htmlFor="lastName"
                className="block text-sm font-medium text-gray-700"
              >
                Last Name:
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="mt-1 block p-2 lg:w-[272px] w-[329px] h-[40px] rounded-md outline-none border-gray-300 shadow-sm"
              />
            </div>

            <div>
              <label
                htmlFor="userName"
                className="block text-sm font-medium text-gray-700"
              >
                User Name
              </label>
              <input
                type="text"
                id="userName"
                name="userName"
                value={formData.userName}
                onChange={handleChange}
                className="mt-1 block p-2 lg:w-[272px] w-[329px] h-[40px] rounded-md outline-none border-gray-300 shadow-sm"
              />
            </div>

            <div>
              <label
                htmlFor="program"
                className="block text-sm font-medium text-gray-700"
              >
                Program
              </label>
              <select
                id="program"
                name="program"
                value={formData.program}
                onChange={handleChange}
                className="mt-1 block p-2 lg:w-[272px] w-[329px] h-[40px] rounded-md outline-none border-gray-300 shadow-sm"
              >
                <option value="Robotics">Robotics</option>
                <option value="Mathematics">Mathematics</option>
                <option value="Science">Science</option>
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
                value={formData.branch}
                onChange={(value: string) =>
                  setFormData({ ...formData, branch: value })
                }
              />
            </div>

            <div>
              <label
                htmlFor="uploadPicture"
                className="block text-sm font-medium text-gray-700"
              >
                Upload Picture:
              </label>
              <input
                type="file"
                id="uploadPicture"
                name="uploadPicture"
                onChange={handleFileChange}
                className="mt-1 block lg:w-[272px] w-[329px] h-[40px]"
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
};

export default Page;
