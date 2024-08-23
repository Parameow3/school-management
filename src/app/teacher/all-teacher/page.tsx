'use client'
import Link from "next/link";
import React from "react";
import Image from "next/image";
import { useState } from "react";
import Dropdown from "@/components/Dropdown";
import { Card, CardBody, CardFooter } from "@nextui-org/react";
import Modal from "@/components/Modal";
const Page = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [cardDelete,setCardDelete]= useState<string | null>(null);
  const list = [
    {
      id: "1", // Assuming you have unique IDs for each student
      title: "Lyseth",
      img: "/photo.jpg",
      job: "Teacher",
    },
    {
      id: "2", // Assuming you have unique IDs for each student
      title: "Lyseth",
      img: "/photo.jpg",
      job: "Teacher",
    },
    // Add more students here
  ];
  const handleDeleteClick = ( id:string) => {
    setIsModalOpen(true);
    setCardDelete(id); 
  };


  return (
    <div className="lg:ml-[219px] mt-20 flex flex-col">
      <div className="lg:w-[1068px] w-[330px] h-[42px] p-4 bg-white rounded-md flex items-center justify-between">
        <span className="flex flex-row gap-3">Teacher |<Image src={"/home.svg"} width={15} height={15} alt="public"></Image>- All teacher</span>
        <Link href={"/#"} passHref>
          <div className="h-[23px] w-[57px] bg-[#213458] flex items-center justify-center rounded-md">
            <Image src={"/refresh.svg"} width={16} height={16} alt="Refresh" />
          </div>
        </Link>
      </div>
      <div className="relative mt-3">
          <Dropdown />
        </div>
        <div>
          
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
                      <Image
                        src="/view.svg"
                        alt="View"
                        width={30}
                        height={30}
                      />
                  </Link>
                  {/* Edit Icon */}
                  <Link href={`/student/all-student/edit/${item.id}`} passHref>
                      <Image
                        src="/edit.svg"
                        alt="Edit"
                        width={30}
                        height={30}
                      />
                  </Link>
                  {/* Delete Icon */}
                    <Image
                      src="/delete.svg"
                      alt="Delete"
                      onClick={()=>handleDeleteClick(item.id)}
                      width={30}
                      height={30}
                    />
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
        </div>
        {isModalOpen && <Modal />}
    </div>
  );
};

export default Page;
