'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import Button from '@/components/Button';

interface User {
  username: string;
  email : string;
  // role_name : string;
  hire_date: string;
  specialization: string;

}
const Page = () => {
  const params = useParams();
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const id = parseInt(params.editId as string, 10); // Extract dynamic id from URL
  const [formData, setFormData] = useState<User>({
    username: "",
    email: "",
    // role_name: "" ,
    hire_date : "" ,
    specialization : "" ,
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
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/user/${id}/`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`, 
          },
        });

        const teacherData = response.data;
       
        let hireDate = new Date(teacherData.hire_date);
    // Format hire_date as YYYY-MM-DD
    let formattedHireDate = hireDate.toISOString().split('T')[0];

        console.log(formattedHireDate)
        setFormData({
          username: response.data.username,
          email: response.data.email,
          specialization: response.data.specialization,
          hire_date: formattedHireDate, // Update formatted hire_date
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(formData)
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  
  

  const handleBack = () => {
    router.push(`/teacher/all-teacher`);
  };


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    console.log(formData)
    try {
      const response = await axios.put(`${process.env.NEXT_PUBLIC_BASE_URL}api/auth/user/${id}/`, formData, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('Update response:', response.data);
      alert('Teacher information updated successfully!');
      router.push(`/teacher/all-teacher`);

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

        <Link href={`/teacher/all-teacher/edit/${id}`} passHref>
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
                value={formData.username}
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
                value={formData.email}
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


            <div className="flex flex-col">
            <label
              htmlFor="hire_date"
              className="text-sm font-medium text-gray-700"
            >
              Hire Date
            </label>
         

            <input
              id="hire_date"
              name="hire_date"
              type="date"
              className="w-full h-[40px] p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.hire_date}
              onChange={handleChange}

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
