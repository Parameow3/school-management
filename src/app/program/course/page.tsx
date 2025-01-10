'use client';

import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Modal from "@/components/Modal";
import Typography from '@/components/Typography';

interface Course {
  id: number;
  name: string;
  description: string;
  program: string;
  credits: number;
  enrolled_students?: Student[];
}

interface Student {
  id: number;
  first_name: string;
  last_name: string;
  course_names: string[];  // List of course names the student is enrolled in
}

interface Program {
  id: string;
  name: string;
  course_list: string[]; // Names of courses in this program
}

const Page: React.FC = () => {
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [token, setToken] = useState<string | null>(null);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  useEffect(() => {
    const tokenFromLocalStorage = localStorage.getItem("authToken");
    if (tokenFromLocalStorage) {
      setToken(tokenFromLocalStorage);
    } else {
      router.push("/login");
    }
  }, [router]);

  useEffect(() => {
    if (!token) return;

    const fetchPrograms = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/academics/program`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error('Failed to fetch programs');
        const data = await response.json();
        setPrograms(Array.isArray(data.results) ? data.results : []);
      } catch (error) {
        console.error('Error fetching program data:', error);
        setError('Failed to load programs. Please try again later.');
      }
    };

    fetchPrograms();
  }, [token]);

  useEffect(() => {
    if (!token) return;

    const fetchCoursesWithStudents = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/academics/course`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error('Failed to fetch courses');
        const coursesData = await response.json();
        const courses = Array.isArray(coursesData) ? coursesData : [];

        // Fetch enrolled students for each course
        const coursesWithStudents = await Promise.all(
          courses.map(async (course) => {
            try {
              const enrollmentResponse = await fetch(
                `${process.env.NEXT_PUBLIC_BASE_URL}/api/academics/enrollment/?course_id=${course.id}`,
                {
                  headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                  },
                }
              );

              if (!enrollmentResponse.ok) {
                throw new Error(`Failed to fetch students for course ${course.id}`);
              }

              const enrollmentData = await enrollmentResponse.json();
              // Match students based on course names
              const studentsEnrolledInCourse = enrollmentData.students.filter((student: Student) =>
                student.course_names.includes(course.name)
              );

              return { ...course, enrolled_students: studentsEnrolledInCourse || [] };
            } catch (error) {
              console.error('Error fetching enrollment data:', error);
              return { ...course, enrolled_students: [] };  // Fallback to an empty array
            }
          })
        );

        setCourses(coursesWithStudents);
      } catch (error) {
        console.error('Error fetching course data:', error);
        setError('Failed to load courses. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchCoursesWithStudents();
  }, [token]);

  const getProgramNameForCourse = (courseName: string) => {
    const program = programs.find((p) => p.course_list.includes(courseName));
    return program ? program.name : 'Unknown Program';
  };

  const handleEditClick = (id: number) => {
    router.push(`/program/course/edit/${id}`);
  };

  const handleDeleteClick = (course: Course) => {
    setSelectedCourse(course);
    setIsModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (selectedCourse) {
      setCourses(courses.filter((course) => course.id !== selectedCourse.id));
      setIsModalOpen(false);
      setSelectedCourse(null);
    }
  };

  if (loading) return <p>Loading courses...</p>;
  if (error) return <p>{error}</p>;

  const coursesByProgram = courses.reduce((acc: { [key: string]: Course[] }, course) => {
    const programName = getProgramNameForCourse(course.name);
    (acc[programName] = acc[programName] || []).push(course);
    return acc;
  }, {});

  return (
    <div className='lg:ml-[16%] ml-[11%] mt-20 flex flex-col'>
      <Typography className='font-bold text-black' fontsize='24px'>Course Information</Typography>
      {Object.keys(coursesByProgram).map((programName) => (
        <div key={programName} className='mt-8'>
          <h2 className="text-lg font-bold mb-4">{programName}</h2>
          <table className="min-w-full border-collapse border border-[#213458] mb-4">
            <thead className='bg-[#213458] text-white'>
              <tr>
                <th className="border px-4 py-2">Course ID</th>
                <th className="border px-4 py-2">Course Name</th>
                <th className="border px-4 py-2">Description</th>
                <th className="border px-4 py-2">Credits</th>
                {/* <th className="border px-4 py-2">Enrolled Students</th> */}
                <th className="border px-4 py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {coursesByProgram[programName].map((course) => (
                <tr key={course.id}>
                  <td className="border px-4 py-2">{course.id}</td>
                  <td className="border px-4 py-2">{course.name}</td>
                  <td className="border px-4 py-2">{course.description}</td>
                  <td className="border px-4 py-2">{course.credits}</td>
                  {/* <td className="border px-4 py-2">
                    {course.enrolled_students && course.enrolled_students.length > 0 ? (
                      course.enrolled_students.map((student) => (
                        <div key={student.id}>
                          {student.first_name} {student.last_name}
                        </div>
                      ))
                    ) : (
                      <span>No students enrolled</span>
                    )}
                  </td> */}
                  <td className="border px-4 py-2">
                    <div className="flex gap-2">
                      <Image
                        src={"/edit.svg"}
                        width={20}
                        height={20}
                        alt="Edit"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditClick(course.id);
                        }}
                      />
                      <Image
                        src={"/delete.svg"}
                        width={20}
                        height={20}
                        alt="Delete"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteClick(course);
                        }}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}

      {isModalOpen && (
        <Modal
          onClose={() => setIsModalOpen(false)}
          onConfirm={handleDeleteConfirm}
          message={`Are you sure you want to delete the course "${selectedCourse?.name}"?`}
        />
      )}
    </div>
  );
};

export default Page;
