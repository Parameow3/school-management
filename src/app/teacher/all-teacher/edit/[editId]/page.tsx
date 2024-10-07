'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import Button from '@/components/Button';

const Page = () => {
  const params = useParams();
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const id = parseInt(params.editId as string, 10); // Extract dynamic id from URL
  const [formData, setFormData] = useState({
    user: {
      username: '',
      email: '',
      password: '', 
    },
    school: 1, 
    specialization: '',
    hire_date: '',
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const tokenFromLocalStorage = localStorage.getItem("authToken");
    if (tokenFromLocalStorage) {
      setToken(tokenFromLocalStorage); // Set token in state
    } else {
      router.push("/login");
    }
  }, [router]);
  useEffect(() => {
    const fetchTeacherData = async () => {
      if (!token) return; 
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/teacher/${id}/`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`, 
          },
        });
        const teacherData = response.data;
        setFormData({
          user: {
            username: teacherData.user.username,
            email: teacherData.user.email,
            password: '', // Empty password for security reasons
          },
          school: teacherData.school,
          specialization: teacherData.specialization,
          hire_date: new Date(teacherData.hire_date).toISOString().split('T')[0], // Format date to YYYY-MM-DD
        });
      } catch (error) {
        console.error('Error fetching teacher data:', error);
        setError('Failed to load teacher data.');
      }
    };

    if (id && token) {
      fetchTeacherData();
    }
  }, [id, token]); 
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (name === 'username' || name === 'email' || name === 'password') {
      setFormData({
        ...formData,
        user: { ...formData.user, [name]: value },
      });
    } else if (name === 'school') {
      setFormData({
        ...formData,
        school: parseInt(value, 10), // Convert string to number using parseInt
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleBack = () => {
    router.push(`/teacher/all-teacher`);
  };
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await axios.put(`${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/teacher/${id}/`, formData, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('Update response:', response.data);
      alert('Teacher information updated successfully!');
    } catch (error: any) {
      console.error('Error updating the teacher:', error);
      if (error.response && error.response.data) {
        setError(error.response.data.detail || 'Failed to update the teacher information.');
      } else {
        setError('Failed to update the teacher information.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="lg:ml-[16%] mt-20 ml-[11%] flex flex-col">
      <div className="lg:w-[1079px] w-[330px] h-[40px] p-4 bg-white flex items-center rounded-md justify-between">
        <span className="flex flex-row gap-2 text-[12px] lg:text-[15px]">
          Teacher | <Image src="/home.svg" width={15} height={15} alt="public" /> Update Teacher
        </span>

        <Link href="/#" passHref>
          <div className="h-[23px] w-[57px] bg-[#213458] flex items-center justify-center rounded-md">
            <Image src="/refresh.svg" width={16} height={16} alt="Refresh" />
          </div>
        </Link>
      </div>
      <div className='mt-4'>
        <Button onClick={handleBack}>Back</Button>
      </div>

      <h1 className="text-center lg:text-2xl text-[16px] font-bold mb-8 mt-4 border-b-2">
        Update Teacher Form
      </h1>
      <div className="">
        <form className="space-y-8" onSubmit={handleSubmit}>
          <div className="grid lg:grid-cols-3 flex-col gap-8">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.user.username}
                onChange={handleChange}
                className="mt-1 block lg:w-[272px] w-[329px] h-[40px] rounded-md outline-none border-gray-300 shadow-sm"
                required
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.user.email}
                onChange={handleChange}
                className="mt-1 block lg:w-[272px] w-[329px] h-[40px] rounded-md outline-none border-gray-300 shadow-sm"
                required
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.user.password}
                onChange={handleChange}
                minLength={6}
                placeholder="Enter new password if changing"
                className="mt-1 block lg:w-[272px] w-[329px] h-[40px] rounded-md outline-none border-gray-300 shadow-sm"
              />
            </div>
            <div>
              <label htmlFor="school" className="block text-sm font-medium text-gray-700">
                School ID
              </label>
              <input
                type="number"
                id="school"
                name="school"
                value={formData.school}
                onChange={handleChange}
                className="mt-1 block lg:w-[272px] w-[329px] h-[40px] rounded-md outline-none border-gray-300 shadow-sm"
                required
              />
            </div>
            <div>
              <label htmlFor="specialization" className="block text-sm font-medium text-gray-700">
                Specialization
              </label>
              <input
                type="text"
                id="specialization"
                name="specialization"
                value={formData.specialization}
                onChange={handleChange}
                className="mt-1 block lg:w-[272px] w-[329px] h-[40px] rounded-md outline-none border-gray-300 shadow-sm"
                required
              />
            </div>
            <div>
              <label htmlFor="hire_date" className="block text-sm font-medium text-gray-700">
                Hire Date
              </label>
              <input
                type="date"
                id="hire_date"
                name="hire_date"
                value={formData.hire_date}
                onChange={handleChange}
                className="mt-1 block lg:w-[272px] w-[329px] h-[40px] rounded-md outline-none border-gray-300 shadow-sm"
                required
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center items-center space-x-4">
            <button type="submit" className="bg-[#213458] text-white px-4 py-2 rounded-md" disabled={loading}>
              {loading ? 'Updating...' : 'Update Teacher'}
            </button>
          </div>
        </form>

        {/* Error message */}
        {error && <div className="text-red-500 mt-4">{error}</div>}
      </div>
    </div>
  );
};

export default Page;
