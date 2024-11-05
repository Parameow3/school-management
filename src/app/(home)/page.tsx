'use client'
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Card from "@/components/Card";
import Report from "@/components/Report";
import Calender from "@/components/Calender";
import FacebookCard from "@/components/facebookCard";
import Typography from "@/components/Typography";
import { useRouter } from "next/navigation";

const Page = () => {
  const [data, setData] = useState([]);
  const [studentCount, setStudentCount] = useState(0);
  const [teacherCount, setTeacherCount] = useState(0);   
  const [token, setToken] = useState<string | null>(null);
  const [classCount, setClassCount] = useState(0);
  const [trailCount, setTrailCount] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const tokenFromLocalStorage = localStorage.getItem("authToken");
    if (tokenFromLocalStorage) {
      setToken(tokenFromLocalStorage); // Set token state
    } else {
      router.push("/login"); // Redirect to login
    }
  }, [router]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!token) return;
  
        // Fetch Students
        const studentsResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/academics/students/`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
  
        if (!studentsResponse.ok) {
          throw new Error(`Error: ${studentsResponse.status} ${studentsResponse.statusText}`);
        }
  
        const studentsData = await studentsResponse.json();
        console.log("Fetched Students Data:", studentsData);
  
        // Update student count if `results` exists and is an array
        if (studentsData && Array.isArray(studentsData.results)) {
          setStudentCount(studentsData.results.length);
        } else {
          console.error('Error: `results` is not an array or does not exist in students response');
        }
  
        // Fetch Classrooms
        const classroomsResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/academics/classroom`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
  
        if (!classroomsResponse.ok) {
          throw new Error(`Error: ${classroomsResponse.status} ${classroomsResponse.statusText}`);
        }
  
        const classroomsData = await classroomsResponse.json();
        console.log("Fetched Classrooms Data:", classroomsData);
  
        // Update class count if `results` exists and is an array
        if (classroomsData && Array.isArray(classroomsData.results)) {
          setClassCount(classroomsData.results.length);
        } else {
          console.error('Error: `results` is not an array or does not exist in classrooms response');
        }
  
        // Fetch Student Trails
        const trailsResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/academics/student_trail/`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
  
        if (!trailsResponse.ok) {
          throw new Error(`Error: ${trailsResponse.status} ${trailsResponse.statusText}`);
        }
  
        const trailsData = await trailsResponse.json();
        console.log("Fetched Trails Data:", trailsData);
  
        // Update trail count if `trailsData` is an array
        if (Array.isArray(trailsData)) {
          setTrailCount(trailsData.length);
        } else {
          console.error('Error: Trails data is not an array');
        }
  
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    };
  
    fetchData();
  }, [token]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!token) return;
  
        // Fetch Teachers
        const usersResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/user`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
  
        if (!usersResponse.ok) {
          throw new Error(`Error: ${usersResponse.status} ${usersResponse.statusText}`);
        }
  
        const usersData = await usersResponse.json();
        console.log("Fetched Users Data:", usersData);
  
        // Filter users by role "teacher"
        const teachers = usersData.results.filter((user: { roles_name: string; }) => user.roles_name === "teacher");
  
        // Update teacher count
        setTeacherCount(teachers.length);
  
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    };
  
    fetchData();
  }, [token]);
  
  return (
    <>
      <div className="flex justify-center lg:ml-[16%] ml-[11%] mt-16">
        <div className="w-[1070px] lg:m-2 flex lg:flex-row flex-col">
          <div className="lg:w-[800px] flex flex-col p-2 ">
            <div className="lg:w-[618px] w-[300px] bg-[#FF6F61] mr-4 backdrop-opacity-75 lg:h-[112px] h-[94px] rounded-[8px] flex flex-row justify-between">
              <div className="flex flex-col justify-center ml-4">
                <Typography className="text-[15px] lg:text-[24px]">
                  Welcome back stella
                </Typography>
                <h3 className="text-white font-medium lg:text-[14px] text-[8px]">
                  you work well , keep it up
                </h3>
              </div>
              <Image
                src={"/hello.svg"}
                width={100}
                height={100}
                alt="public"
                className="mr-7 w-[74px] h-[74px] mt-4 lg:w-[100px] lg:h-[100px]"
              />
            </div>
            <div className="grid grid-cols-2 lg:flex-row lg:flex lg:gap-4 m-0 w-[310px]">
              <div className="p-0 m-0">
                <Card title={"Students"} value={studentCount} color={"#4CAF50"} />
              </div>
              <div className="p-0 m-0">
                <Card title={"Teachers"} value={teacherCount} color={"#869DCA"} />
              </div>
              <div className="p-0 m-0">
                <Card title={"Trails"} value={trailCount} color={"#213458"} />
              </div>
              <div className="p-0 m-0">
                <Card title={"Classes"} value={classCount} color={"#3A6EA5"} />
              </div>
            </div>

            <Report></Report>
            <Report></Report>
          </div>
          <div className="w-[329px] h-full lg:m-2 shadow-sm rounded-lg">
            <Calender></Calender>
            {/* progressBar */}
            <div className="mt-4 p-4 w-[326px] h-[200px] rounded-sm bg-white">
              <p className="text-[15px] font-bold text-gray-900">
                Today New Student
              </p>
              <div aria-hidden="true" className="mt-2 flex items-center">
                <div className="flex-grow overflow-hidden rounded-full bg-gray-200">
                  <div
                    style={{ width: "50%" }}
                    className="h-2 rounded-full bg-indigo-600"
                  />
                </div>
                <span className="ml-2 text-sm font-medium text-gray-900">
                  50%
                </span>
              </div>
              <p className="text-[15px] font-bold text-gray-900">
                Today New Teacher
              </p>
              <div aria-hidden="true" className="mt-2 flex items-center">
                <div className="flex-grow overflow-hidden rounded-full bg-gray-200">
                  <div
                    style={{ width: "60%" }}
                    className="h-2 rounded-full bg-indigo-600"
                  />
                </div>
                <span className="ml-2 text-sm font-medium text-gray-900">
                  60%
                </span>
              </div>
              <p className="text-[15px] font-bold text-gray-900">
                Today Trail Student
              </p>
              <div aria-hidden="true" className="mt-2 flex items-center">
                <div className="flex-grow overflow-hidden rounded-full bg-gray-200">
                  <div
                    style={{ width: "30%" }}
                    className="h-2 rounded-full bg-indigo-600"
                  />
                </div>
                <span className="ml-2 text-sm font-medium text-gray-900">
                  30%
                </span>
              </div>
            </div>
            <div className="mt-4">
              <FacebookCard></FacebookCard>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Page;
