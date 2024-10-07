'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Button from '@/components/Button';

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
  const router = useRouter();
  const { viewId } = useParams(); // Assuming viewId is passed in the URL
  const [teacherData, setTeacherData] = useState<TeacherData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const handleBack = () => {
    router.push(`/teacher/all-teacher`);
  };
  useEffect(() => {
    const tokenFromLocalStorage = localStorage.getItem("authToken");
    if (tokenFromLocalStorage) {
      setToken(tokenFromLocalStorage);
    } else {
      router.push("/login");
    }
  }, [router]);
  useEffect(() => {
    const fetchTeacherData = async () => {
      if (!token || !viewId) return; // Ensure token and viewId are available before making the request

      try {
        setLoading(true); // Set loading state to true when the request starts
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/teacher/${viewId}/`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`, // Add token to Authorization header
          },
        });
        setTeacherData(response.data); // Populate state with API data
      } catch (error) {
        console.error('Error fetching teacher data:', error);
        setError('Failed to load teacher data.');
      } finally {
        setLoading(false); // Set loading state to false when the request finishes
      }
    };

    if (token && viewId) {
      fetchTeacherData();
    }
  }, [token, viewId]); // Trigger the useEffect when token or viewId change

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
            <div className='mt-4'>
        <Button onClick={handleBack}>Back</Button>
      </div>
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
