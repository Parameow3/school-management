'use client'
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Card from "@/components/Card";
import Report from "@/components/Report";
import Calender from "@/components/Calender";
import FacebookCard from "@/components/facebookCard";
import { useRouter } from "next/navigation";
import axios from "axios";
const Page = () => {
  const [studentCount, setStudentCount] = useState(0);
  const [teacherCount, setTeacherCount] = useState(0);  
  const [todayStudentCount, setTodayStudentCount] = useState(0); 
  const [token, setToken] = useState<string | null>(null);
  const [classCount, setClassCount] = useState(0);
  const [trailCount, setTrailCount] = useState(0);
  const router = useRouter();
  const [userName, setUserName] = useState("User");
  const [userId, setUserId] = useState<string | null>(null);
  useEffect(() => {
    const tokenFromLocalStorage = localStorage.getItem("authToken");
    const userIdFromLocalStorage = localStorage.getItem("userId");
    if (tokenFromLocalStorage) {
      setToken(tokenFromLocalStorage);
      setUserId(userIdFromLocalStorage); // Set token state
    } else {
      router.push("/login"); // Redirect to login
    }
  }, [router]);

  const isToday = (dateString: string) => {
    const today = new Date().toISOString().split("T")[0]; // Get today's date in YYYY-MM-DD format
    const recordDate = new Date(dateString).toISOString().split("T")[0]; // Record's date in YYYY-MM-DD format
    return today === recordDate;
  };
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!token || !userId) return;

      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/user/${userId}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const { username } = response.data;
        setUserName(username || "User");
        console.log("Fetched username:", userId);
      } catch (error: any) {
        console.error("Error fetching profile:", error);
        if (error.response && error.response.status === 403) {
          setError("Access forbidden: Invalid or expired token");
        } else {
          setError("Failed to load user profile");
        }
      }
    };

    fetchUserProfile();
  }, [token, userId]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!token) return;
    
        // Fetch Students
        const studentsResponse = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/academics/students/`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
    
        if (!studentsResponse.ok) {
          throw new Error(`Error: ${studentsResponse.status}`);
        }
    
        const studentsData = await studentsResponse.json();
        if (studentsData && Array.isArray(studentsData.results)) {
          setStudentCount(studentsData.results.length);
    
          // Count today's students
          const todayCount = studentsData.results.filter((student: { admission_date: string }) =>
            isToday(student.admission_date)
          ).length;

          setTodayStudentCount(todayCount);
        }
      } catch (error) {
        console.error("Failed to fetch students data:", error);
      }
    };
    
  
    fetchData();
  }, [token]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!token) return;
  // Fetch Classrooms
  const classroomsResponse = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/academics/classroom`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  if (!classroomsResponse.ok) {
    throw new Error(`Error: ${classroomsResponse.status}`);
  }

  const classroomsData = await classroomsResponse.json();
  if (classroomsData && Array.isArray(classroomsData.results)) {
    setClassCount(classroomsData.results.length);
  } else {
    console.error("Invalid classroom data");
    setClassCount(0);
  }
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
        const teachers = usersData.results.filter((user: { roles_name: string; }) => user.roles_name === "teacher");

        setTeacherCount(teachers.length);
  
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    };
  
    fetchData();
  }, [token]);
  useEffect(() => {
    const fetchTrailCount = async () => {
      try {
        if (!token) return;
  
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/academics/student_trail/`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
  
        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }
  
        const data = await response.json();
       
        if (Array.isArray(data)) {
          setTrailCount(data.length);
        } else if (data.results && Array.isArray(data.results)) {
          setTrailCount(data.results.length);
        } else {
          console.error("Unexpected trail data format");
          setTrailCount(0); // Default to 0 in case of unexpected data
        }
      } catch (error) {
        console.error('Error fetching trail data:', error);
      }
    };
  
    fetchTrailCount();
  }, [token]);
  
  return (
    <>
      <div className="flex justify-center lg:ml-[16%] ml-[11%] mt-16">
        <div className="w-[1070px] lg:m-2 flex lg:flex-row flex-col">
          <div className="lg:w-[800px] flex flex-col p-2 ">
            <div className="lg:w-[618px] w-[300px] bg-[#FF6F61] mr-4 backdrop-opacity-75 lg:h-[112px] h-[94px] rounded-[8px] flex flex-row justify-between">
              <div className="flex flex-col justify-center ml-4">
                <p className="text-[15px] lg:text-[24px] font-bold text-white">
                    Welcome back {userName}
                </p>
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
          </div>
          <div className="w-[329px] h-full lg:m-2 shadow-sm rounded-lg">
            <Calender></Calender>
            {/* progressBar */}
            <div className="mt-4 p-4 w-[326px] h-[100px] rounded-sm bg-white">
  <p className="text-[15px] font-bold text-gray-900">
    Today New Students
  </p>
  <div aria-hidden="true" className="mt-2 flex items-center">
    <div className="flex-grow overflow-hidden rounded-full bg-gray-200">
      <div
        style={{
          width:
            studentCount > 0
              ? `${Math.min((todayStudentCount / studentCount) * 100, 100)}%`
              : "0%",
          backgroundColor: "#3B82F6", // Blue color for the progress bar
        }}
        className="h-2 rounded-full"
      />
    </div>
    <span className="ml-2 text-sm font-medium text-gray-900">
      {todayStudentCount}/{studentCount}
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
function setError(arg0: string) {
  throw new Error("Function not implemented.");
}

