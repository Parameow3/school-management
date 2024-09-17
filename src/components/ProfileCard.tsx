import React from 'react';
import Image from 'next/image';
import { Card, CardBody, CardFooter } from "@nextui-org/react";

interface ProfileCardProps {
  pic: string;
  first_name: string;
  job: string;
  onViewClick: (viewPath: string) => void;
  onEditClick: (editPath: string) => void; 
  onDeleteClick: () => void;
  editPath: string;
  viewPath: string; 
}

const ProfileCard: React.FC<ProfileCardProps> = ({ pic, first_name, job, editPath, viewPath, onViewClick, onEditClick, onDeleteClick }) => {
  return (
    <Card className="lg:w-[243px] lg:h-[244px] w-[139px] h-[173px] shadow-sm bg-white rounded-[9px] transition-transform transform hover:scale-105 hover:shadow-lg hover:bg-gray-100"> 
      <CardBody className="flex flex-col items-center p-4 overflow-hidden"> 
        <Image
          height={100}
          width={100}
          className="rounded-full object-cover lg:w-[100px] lg:h-[100px] w-[70px] h-[70px]"
          src={pic}
          alt={first_name}
        />
        <b className="flex items-center lg:text-lg text-[12px] lg:mt-4 text-center">{first_name}</b> 
        <p className="text-default-500 lg:text-[18px] text-[11px] text-center">{job}</p>
      </CardBody>
      <CardFooter className="flex justify-center gap-4">
        <button 
          onClick={() => onViewClick(viewPath)}
          className="hover:scale-110 transition-transform transform hover:bg-gray-200 p-1 rounded-full"
        >
          <Image
            src="/view.svg"
            alt="View"
            width={25}
            height={25}
            className="w-[25px] h-[25px]"
          />
        </button>
        <button 
          onClick={() => onEditClick(editPath)}
          className="hover:scale-110 transition-transform transform hover:bg-gray-200 p-1 rounded-full"
        >
          <Image
            src="/edit.svg"
            alt="Edit"
            width={25}
            height={25}
            className="w-[25px] h-[25px]"
          />
        </button>
        <button 
          onClick={onDeleteClick}
          className="hover:scale-110 transition-transform transform hover:bg-gray-200 p-1 rounded-full"
        >
          <Image
            src="/delete.svg"
            alt="Delete"
            width={25}
            height={25}
            className="w-[25px] h-[25px]"
          />
        </button>
      </CardFooter>
    </Card>
  );
};

export default ProfileCard;