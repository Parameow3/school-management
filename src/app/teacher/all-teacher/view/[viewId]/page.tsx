'use client'
import { useParams } from "next/navigation";
import Image from "next/image";
interface TeacherProp {
  id: number;
  firstName: string;
  lastName: string;
  userName: string;
  program: string;
  profilePicture: string;
  branch: string;
}

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

const Page = () => {
  const params = useParams();
  const id = parseInt(params.viewId as string, 10);
  const selectedTeacher = mockupTeachers.find((item) => {
    if (item.id == id) {
      return item;
    }
  });

  if (!selectedTeacher) {
    return <div className="text-center mt-20">Teacher not found</div>;
  }

  return (
    <div className="lg:ml-[219px] mt-20 flex flex-col">
      <div className="bg-white p-6 rounded-lg lg:gap-12 gap-4 h-[450px] flex lg:flex-row flex-col shadow-lg w-[345px] lg:w-[654px] max-w-2xl mx-auto">
        <div className="flex lg:items-start items-center lg:justify-start flex-col mb-4 ml-4">
          <Image
            src={selectedTeacher.profilePicture}
            alt="Profile Picture"
            width={192}
            height={192}
            className="lg:w-48 lg:h-48 w-16 h-16 mr-4 object-cover"
          />
        </div>
        <div className="text-left">
          <h2 className="font-bold inline-block border-b-2 ml-28 lg:ml-0">
            About Me
          </h2>
          <p className="p-2 text-[12px] lg:text-[16px]">
            <strong>LastName:</strong> {selectedTeacher.lastName}
          </p>
          <p className="p-2 text-[12px] lg:text-[16px]">
            <strong>FirstName:</strong> {selectedTeacher.firstName}
          </p>
          <p className="p-2 text-[12px] lg:text-[16px]">
            <strong>UserName:</strong> {selectedTeacher.userName}
          </p>
          <p className="p-2 text-[12px] lg:text-[16px]">
            <strong>Program:</strong> {selectedTeacher.program}
          </p>
          <p className="p-2 text-[12px] lg:text-[16px]">
            <strong>Branch:</strong> {selectedTeacher.branch}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Page;
