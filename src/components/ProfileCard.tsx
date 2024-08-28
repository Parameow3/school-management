import React from 'react';
import Image from 'next/image';
import { Card, CardBody, CardFooter } from "@nextui-org/react";
interface ProfileCardProps {
  pic: string;
  name: string;
  job: string;
  onViewClick: (viewPath: string) => void;
  onEditClick: (editPath: string) => void; 
  onDeleteClick: () => void;
  editPath: string;
  viewPath: string; 
}
const ProfileCard: React.FC<ProfileCardProps> = ({ pic, name, job, editPath, viewPath, onViewClick, onEditClick, onDeleteClick }) => {
  return (
    <Card className="lg:w-[243px] lg:h-[244px] w-[159px] h-[173px] shadow-sm bg-white rounded-[9px]"> 
      <CardBody className="flex flex-col items-center p-4 overflow-hidden"> 
        <Image
          height={100}
          width={100}
          className="rounded-full object-cover"
          src={pic}
          alt={name}
        />
        <b className="flex items-center text-lg mt-4 text-center">{name}</b> 
        <p className="text-default-500 text-center">{job}</p>
      </CardBody>
      <CardFooter className="flex justify-center gap-4">
        <button onClick={() => onViewClick(viewPath)}>
          <Image
            src="/view.svg"
            alt="View"
            width={25}
            height={25}
            className="w-[25px] h-[25px]"
          />
        </button>
        <button onClick={() => onEditClick(editPath)}>
          <Image
            src="/edit.svg"
            alt="Edit"
            width={25}
            height={25}
            className="w-[25px] h-[25px]"
          />
        </button>
        <button onClick={onDeleteClick}>
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
