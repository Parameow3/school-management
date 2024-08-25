"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Dropdown from "@/components/Dropdown";
import { Card, CardHeader, CardBody } from "@nextui-org/react";
import Modal from "@/components/Modal";

const Page = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [cardToDelete, setCardToDelete] = useState<string | null>(null);
  const [cards, setCards] = useState([
    {
      id: '0',
      title: "Robotic",
      time: "1:30 - 3:00",
      students: 4,
    },
    {
      id: '1',
      title: "AI Programming",
      time: "10:00 - 11:30",
      students: 8,
    },
    {
      id: '2',
      title: "Machine Learning",
      time: "2:00 - 4:00",
      students: 6,
    },
    {
      id: '3',
      title: "Data Science",
      time: "9:00 - 10:30",
      students: 10,
    },
  ]);

  const handleDeleteClick = (id: string) => {
    setIsModalOpen(true);
    setCardToDelete(id); 
  };

  const handleConfirmDelete = () => {
    setCards((prevCards) => prevCards.filter((card) => card.id !== cardToDelete));
    setIsModalOpen(false);
    setCardToDelete(null);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCardToDelete(null);
  };

  return (
    <div className="lg:ml-[219px] mt-20 flex flex-col">
      <div className="lg:w-[1068px] w-[330px] h-[42px] p-4 bg-white rounded-md flex items-center justify-between">
        <span className="flex flex-row lg:gap-3 gap-2 text-[12px] lg:text-[16px]">
          Classes |{" "}
          <Image src={"/home.svg"} width={15} height={15} alt="public" />
          - All classes
        </span>
        <Link href={"/#"} passHref>
          <div className="h-[23px] w-[57px] bg-[#1c2b47] flex items-center justify-center rounded-md">
            <Image src={"/refresh.svg"} width={16} height={16} alt="Refresh" />
          </div>
        </Link>
      </div>
      <div className="mt-3">
        <Dropdown />
      </div>
      <div className="mt-4 grid grid-cols-4 gap-4">
        {cards.map((card, index) => (
          <Card className="py-4 w-[240px]" key={index}>
            <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
              <div className="flex justify-between w-full items-center">
                <h4 className="font-bold text-large">{card.title}</h4>
                <div className="flex space-x-2">
                  <span className="text-default-500 cursor-pointer">
                      <Link href={`/class/all-class/edit/${card.id}`} passHref>
                      <Image
                        src="/edit.svg"
                        alt="public"
                        width={18}
                        height={18}
                        className="w-[12px] h-[12px] lg:w-[18px] lg:h-[18px]"
                      />
                  </Link>
                  </span>
                  <span className="text-red-500 cursor-pointer">
                    <Image
                      src={"/delete.svg"}
                      width={18}
                      height={18}
                      alt="delete"
                      onClick={() => handleDeleteClick(card.id)}
                    />
                  </span>
                </div>
              </div>
              <small className="text-default-500">{card.time}</small>
            </CardHeader>
            <CardBody className="overflow-visible py-2 flex-row flex justify-between items-center">
              <div className="flex flex-row gap-2">
                <p className="text-2xl font-bold">{card.students}</p>
                <small className="text-default-500 text-center">Students</small>
              </div>
              <span className="text-default-500 cursor-pointer mr-3">
                <Image
                  src={"/student.svg"}
                  width={32}
                  height={32}
                  alt="student"
                />
              </span>
            </CardBody>
          </Card>
        ))}
      </div>
      {isModalOpen && (
        <Modal
        />
      )}
    </div>
  );
};

export default Page;
