"use client";
import Dropdown from "@/components/Dropdown";
import Link from "next/link";
import React, { useState } from "react";
import { Card, CardBody, CardFooter } from "@nextui-org/react";
import Modal from "@/components/Modal"; // Adjust the import path as necessary
import Image from "next/image";

const Page = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [cardDelete,setCardDelete]= useState<string | null>(null);
  const list = [
    {
      id: "1", // Assuming you have unique IDs for each student
      title: "Lyseth",
      pic: "/photo.jpg",
      job: "student",
    },
    {
      id: "2", // Assuming you have unique IDs for each student
      title: "Lyseth",
      pic: "/photo.jpg",
      job: "student",
    },
    // Add more students here
  ];

  const handleDeleteClick = ( id:string) => {
    setIsModalOpen(true);
    setCardDelete(id); 
  };

  return (
    <>
      <div className="lg:ml-[219px] mt-20 flex flex-col">
        <div className="lg:w-[1068px] w-[330px] h-[42px] p-4 bg-white rounded-md flex items-center justify-between">
          <span className="flex flex-row lg:gap-3 gap-2 text-[12px] lg:text-[16px]">Student | <Image src={"/home.svg"} width={15} height={15} alt="public"></Image>- All student</span>
          <Link href={"/#"} passHref>
            <div className="h-[23px] w-[57px] bg-[#1c2b47] flex items-center justify-center rounded-md">
              <Image
                src={"/refresh.svg"}
                width={16}
                height={16}
                alt="Refresh"
              />
            </div>
          </Link>
        </div>
        <div className="relative mt-2">
          <Dropdown />
        </div>

        <div className="mt-5 grid grid-cols-4 lg:gap-4 gap-44">
          {list.map((item) => (
            <Card
              shadow="sm"
              key={item.id}
              isPressable
              onPress={() => console.log("item pressed")}
              className="lg:w-[243px] lg:h-[244px] w-[159px] h-[173px] shadow-sm bg-white rounded-[9px]"
            >
              <CardBody className="overflow-visible flex items-center p-4">
                <Image
                  height={100}
                  width={100}
                  className="rounded-full object-cover w-[50px] h-[50px] lg:w-[100px] lg:h-[100px] "
                  src={item.pic}
                  alt={item.title}
                />
                <b className="flex items-center text-12 lg:text-14 mt-2">{item.title}</b>
                <p className="text-default-500">{item.job}</p>
              </CardBody>
              <CardFooter className="justify-center items-center lg:gap-2">
                <div
                  className="flex w-[150px] lg:justify-between justify-center gap-4"
                >
                  {/* View Icon */}
                  <Link href={`/student/all-student/view/${item.id}`} passHref>
                      <Image
                        src="/view.svg"
                        alt="View"
                        width={30}
                        height={30}
                        className="w-[12px] h-[12px] lg:w-[25px] lg:h-[25px]"
                      />
                  </Link>
                  {/* Edit Icon */}
                  <Link href={`/student/all-student/edit/${item.id}`} passHref>
                      <Image
                        src="/edit.svg"
                        alt="public"
                        width={50}
                        height={50}
                        className="w-[12px] h-[12px] lg:w-[25px] lg:h-[25px]"
                      />
                  </Link>
                  {/* Delete Icon */}
                    <Image
                      src="/delete.svg"
                      alt="public"
                      onClick={()=>handleDeleteClick(item.id)}
                      width={30}
                      height={30}
                      className="w-[12px] h-[12px] lg:w-[25px] lg:h-[25px]"
                    />
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
      {isModalOpen && <Modal />}
    </>
  );
};

export default Page;
