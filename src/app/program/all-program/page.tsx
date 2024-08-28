"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu } from "@headlessui/react";
import { ChevronUpIcon, ChevronDownIcon } from "@heroicons/react/24/solid";
import { Card, CardHeader, CardBody } from "@nextui-org/react";
import Modal from "@/components/Modal";
const Page = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [cardToDelete, setCardToDelete] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState("Programs"); // State to store the selected program
  const [cards, setCards] = useState([
    {
      id: "0",
      title: "Level1",
      time: "1:30 - 3:00",
      sessions: 4,
    },
    {
      id: "1",
      title: "Level2",
      time: "10:00 - 11:30",
      sessions: 8,
    },
    {
      id: "2",
      title: "Level3",
      time: "2:00 - 4:00",
      sessions: 6,
    },
    {
      id: "3",
      title: "Level4",
      time: "9:00 - 10:30",
      sessions: 10,
    },
  ]);

  const handleDeleteClick = (id: string) => {
    setIsModalOpen(true);
    setCardToDelete(id);
  };

  const handleProgramSelect = (program: string) => {
    setSelectedProgram(program);
    setIsOpen(false); // Close the dropdown after selection
  };

  return (
    <div className="lg:ml-[219px] mt-20 flex flex-col">
      <div className="lg:w-[1068px] w-[330px] h-[42px] p-4 bg-white rounded-md flex items-center justify-between">
        <span className="flex flex-row lg:gap-3 gap-2 text-[12px] lg:text-[16px]">
          Program |
          <Image src={"/home.svg"} width={15} height={15} alt="public" />- All
          Program
        </span>
        <Link href={"/#"} passHref>
          <div className="h-[23px] w-[57px] bg-[#1c2b47] flex items-center justify-center rounded-md">
            <Image src={"/refresh.svg"} width={16} height={16} alt="Refresh" />
          </div>
        </Link>
      </div>
      <div className="relative mt-2">
        <Menu as="div" className="relative inline-block text-left">
          <div>
            <Menu.Button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex justify-between items-center lg:w-[272px] w-[329px] h-[40px] px-4 py-2 bg-[#FFFFFF] text-[#213458] text-sm font-medium rounded-md focus:outline-none"
            >
              {selectedProgram}
              {isOpen ? (
                <ChevronUpIcon className="ml-2 h-5 w-5" aria-hidden="true" />
              ) : (
                <ChevronDownIcon className="ml-2 h-5 w-5" aria-hidden="true" />
              )}
            </Menu.Button>
          </div>

          <Menu.Items className="absolute z-50 lg:w-56 origin-top-right rounded-md mt-2 bg-[#FFFFFF] shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
            <div className="py-1">
              <Menu.Item>
                {({ active }) => (
                  <a
                    href="#Robotic"
                    onClick={() => handleProgramSelect("Robotic")}
                    className={`${
                      active ? "bg-gray-100" : ""
                    } block px-4 py-2 text-sm text-gray-700`}
                  >
                    Robotic
                  </a>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <a
                    href="#Takwando"
                    onClick={() => handleProgramSelect("Takwando")}
                    className={`${
                      active ? "bg-gray-100" : ""
                    } block px-4 py-2 text-sm text-gray-700`}
                  >
                    Takwando
                  </a>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <a
                    href="#Ballet"
                    onClick={() => handleProgramSelect("Ballet")}
                    className={`${
                      active ? "bg-gray-100" : ""
                    } block px-4 py-2 text-sm text-gray-700`}
                  >
                    Ballet
                  </a>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <a
                    href="#SAMBAR"
                    onClick={() => handleProgramSelect("SAMBAR")}
                    className={`${
                      active ? "bg-gray-100" : ""
                    } block px-4 py-2 text-sm text-gray-700`}
                  >
                    SAMBAR
                  </a>
                )}
              </Menu.Item>
            </div>
          </Menu.Items>
        </Menu>
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
                <p className="text-2xl font-bold">{card.sessions}</p>
                <small className="text-default-500 text-center">sessions</small>
              </div>
              <span className="text-default-500 cursor-pointer mr-3">
                <Image
                  src={"/program.svg"}
                  width={22}
                  height={22}
                  alt="public"
                />
              </span>
            </CardBody>
          </Card>
        ))}
      </div>
      {isModalOpen && <Modal />}
    </div>
  );
};

export default Page;
