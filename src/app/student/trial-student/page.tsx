import React from "react";
import Link from "next/link";
import Image from "next/image";
import { HomeIcon } from "@heroicons/react/24/outline";
const page = () => {
  return (
    <div className="max-w-7xl mx-auto p-8 ml-[212px] mt-12">
      <div className="w-[1060px] h-[40px] p-4 bg-white flex items-center rounded-md justify-between">
        <span className="flex flex-row gap-2">
          Student |{" "}
          <Image src={"/home.svg"} width={15} height={15} alt="public"></Image>{" "}
          - New student
        </span>

        <Link href={"/#"} passHref>
          <div className="h-[23px] w-[57px] bg-[#213458] flex items-center justify-center rounded-md">
            <Image src={"/refresh.svg"} width={16} height={16} alt="Refresh" />
          </div>
        </Link>
      </div>
      <h1 className="text-center text-2xl font-bold mb-8 mt-4 text-[#123458] ">
        Trial Form
      </h1>
    </div>
  );
};

export default page;
