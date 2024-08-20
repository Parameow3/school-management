"use client";
import Dropdown from "@/components/Dropdown";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { Card, CardBody, CardFooter } from "@nextui-org/react";
import Modal from "@/components/Modal"; // Adjust the import path as necessary

const Page = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [cardDelete,setCardDelete]= useState<string | null>(null);
  const list = [
    {
      id: "1", // Assuming you have unique IDs for each student
      title: "Lyseth",
      img: "/photo.jpg",
      job: "student",
    },
    {
      id: "2", // Assuming you have unique IDs for each student
      title: "Lyseth",
      img: "/photo.jpg",
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
      <div className="ml-[219px] mt-20 flex flex-col">
        <div className="w-[1068px] h-[40px] p-4 bg-white rounded-md flex items-center justify-between">
          <span>Student | All student</span>

          <Link href={"/#"} passHref>
            <div className="h-[23px] w-[57px] bg-[#213458] flex items-center justify-center rounded-md">
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

        <div className="mt-5 grid grid-cols-4 gap-4">
          {list.map((item) => (
            <Card
              shadow="sm"
              key={item.id}
              isPressable
              onPress={() => console.log("item pressed")}
              className="w-[243px] h-[244px] shadow-sm bg-white rounded-[9px]"
            >
              <CardBody className="overflow-visible flex items-center p-4">
                <Image
                  height={100}
                  width={100}
                  className="rounded-full object-cover"
                  src={item.img}
                  alt={item.title}
                />
                <b className="flex items-center mt-2">{item.title}</b>
                <p className="text-default-500">{item.job}</p>
              </CardBody>
              <CardFooter className="justify-center items-center gap-2">
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-around",
                    width: "150px",
                  }}
                >
                  {/* View Icon */}
                  <Link href={`/student/all-student/view/${item.id}`} passHref>
                      <img
                        src="/view.svg"
                        alt="View"
                        style={{ width: "30px", height: "30px" }}
                      />
                  </Link>
                  {/* Edit Icon */}
                  <Link href={`/student/all-student/edit/${item.id}`} passHref>
                      <img
                        src="/edit.svg"
                        alt="Edit"
                        style={{
                          width: "30px",
                          height: "30px",
                          padding: "2px",
                        }}
                      />
                  </Link>
                  {/* Delete Icon */}
                  <button onClick={()=>handleDeleteClick(item.id)}>
                    <img
                      src="/delete.svg"
                      alt="Delete"
                      style={{ width: "30px", height: "30px" }}
                    />
                  </button>
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
