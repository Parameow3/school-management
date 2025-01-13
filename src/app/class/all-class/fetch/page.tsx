"use client";

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const StudentCourseDropdown = () => {
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('');

  // Fetch data on component mount
  useEffect(() => {
    fetchStudents();
    fetchCourses();
  }, []);

  // Fetch students
  const fetchStudents = async () => {
    try {
      const response = await axios.get('/api/students'); // Replace with your endpoint
      setStudents(response.data);
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  // Fetch courses
  const fetchCourses = async () => {
    try {
      const response = await axios.get('/api/courses'); // Replace with your endpoint
      setCourses(response.data);
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  // Handle student selection
  const handleStudentChange = (e: { target: { value: React.SetStateAction<string>; }; }) => {
    setSelectedStudent(e.target.value);
  };

  // Handle course selection
  const handleCourseChange = (e: { target: { value: React.SetStateAction<string>; }; }) => {
    setSelectedCourse(e.target.value);
  };

  return (
      <div>
        <h2>Choose Student</h2>
        <select value={selectedStudent} onChange={handleStudentChange}>
          <option value="">Select a student</option>
          {students.map((student) => (
              <option key={student.id} value={student.id}>
                {student.name}
              </option>
          ))}
        </select>

        <h2>Choose Course</h2>
        <select value={selectedCourse} onChange={handleCourseChange}>
          <option value="">Select a course</option>
          {courses.map((course) => (
              <option key={course.id} value={course.id}>
                {course.title}
              </option>
          ))}
        </select>
      </div>
  );
};

export default StudentCourseDropdown;
