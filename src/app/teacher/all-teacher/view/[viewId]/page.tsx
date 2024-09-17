'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import axios from 'axios';

// Define the structure of the data from the backend
interface TeacherData {
  id: number;
  user: {
    username: string;
    email: string;
  };
  school: number;
  specialization: string;
  hire_date: string;
}

const Page = () => {
  const { viewId } = useParams(); // Assuming viewId is passed in the URL
  const [teacherData, setTeacherData] = useState<TeacherData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const fetchTeacherData = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/auth/teacher/${viewId}/`);
        setTeacherData(response.data); // Populate state with API data
      } catch (error) {
        setError('Failed to load teacher data.');
      } finally {
        setLoading(false);
      }
    };

    fetchTeacherData();
  }, [viewId]);

  if (loading) {
    return <div className="text-center mt-20">Loading...</div>;
  }

  if (error) {
    return <div className="text-center mt-20">{error}</div>;
  }

  if (!teacherData) {
    return <div className="text-center mt-20">Teacher not found</div>;
  }

  return (
    <div className="lg:ml-[219px] mt-20 ml-[25px] flex flex-col">
      <div className="bg-white p-6 rounded-lg lg:gap-12 gap-4 h-[450px] flex lg:flex-row flex-col shadow-lg w-[345px] lg:w-[654px] max-w-2xl mx-auto">
        <div className="flex lg:items-start items-center lg:justify-start flex-col mb-4 ml-4">
          <Image
            src="/photo.jpg" // You can replace this with the actual photo URL if provided by the backend
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
            <strong>UserName:</strong> {teacherData.user.username}
          </p>
          <p className="p-2 text-[12px] lg:text-[16px]">
            <strong>Email:</strong> {teacherData.user.email}
          </p>
          <p className="p-2 text-[12px] lg:text-[16px]">
            <strong>Specialization:</strong> {teacherData.specialization}
          </p>
          <p className="p-2 text-[12px] lg:text-[16px]">
            <strong>Hire Date:</strong> {new Date(teacherData.hire_date).toLocaleDateString()}
          </p>
          <p className="p-2 text-[12px] lg:text-[16px]">
            <strong>School ID:</strong> {teacherData.school}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Page;
