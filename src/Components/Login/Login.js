import React, { useState, Fragment } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import JXMESLogo2 from "../../assets/img/New Logo White.png";
import Background from "../../assets/img/NikeAir.mp4";
import { v4 as uuidv4 } from 'uuid';

export default function Login() {
  const history = useHistory();

  const [formData, setFormData] = useState({
    user_id: 'mesuser',
    password: '1234'
  });

  const [notification, setNotification] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://172.16.200.28:3000/login', formData, {
        headers: {
          'Cache-Control': 'no-cache'
        }
      });
      const token = uuidv4();
      console.log('Token yang didapatkan:', token);
      localStorage.setItem('token', token);

      // Redirect ke halaman Dashboard
      history.push('/Dashboard');

      // Set notification
      setNotification('Successfully Login');
    } catch (error) {
      console.error('Please enter ID / Password correctly!', error);
      // Tampilkan pesan kesalahan login kepada pengguna jika diperlukan

      // Set notification
      setNotification('Please enter ID / Password correctly!');
    }
  };

  return (
    <>
    <div className="bg-gray-900 dark:bg-gray-900">
      <div className="flex justify-center h-screen">
        <div className="hidden bg-cover lg:block lg:w-2/3" style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          overflow: 'hidden'
        }}>
          <video
            autoPlay
            loop
            muted
            className='absolute z-10 w-auto min-w-full min-h-full max-w-none'
          >
            <source src={Background} type="video/mp4" />
          </video>
          <div className="flex relative items-center h-full z-30 px-20 bg-gray-900 bg-opacity-40">
            <div>
              <h2 className="text-4xl font-bold text-gray-50">Crafted Footwear with Confidence</h2>
              <p className="max-w-xl mt-3 text-gray-50">Our dedicated team of employees has consistently demonstrated exemplary performance in driving our company towards the realization of becoming a global leader in the footwear industry.</p>
            </div>
          </div>
        </div>

        <div className="flex items-center w-full max-w-md px-6 mx-auto lg:w-2/6">
          <div className="flex-1">
            <div className="text-center">
              <img
                className="mx-12 w-72"
                src={JXMESLogo2}
                alt="Your Company"
                href="/Dashboard"
              />
              <p className="mt-3 text-gray-500 dark:text-gray-300">Sign in to access your account</p>
            </div>

            <div className="mt-8">
              {notification && (
                <div className="mb-4 p-3 text-white bg-red-900 rounded-md text-center">
                  {notification}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div>
                  <label htmlFor="user_id" className="block mb-2 text-sm text-gray-600 dark:text-gray-200">User ID</label>
                  <input
                    type="text"
                    name="user_id"
                    id="user_id"
                    value={formData.user_id}
                    onChange={handleChange}
                    className="block w-full px-4 py-2 mt-2 bg-gray-900 text-gray-800 placeholder-gray-400 border border-gray-200 rounded-md dark:placeholder-gray-600 dark:bg-gray-900 text-white dark:text-gray-300 dark:border-gray-700 focus:border-blue-400 dark:focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40"
                    required
                  />
                </div>

                <div className="mt-6">
                  <div className="flex justify-between mb-2">
                    <label htmlFor="password" className="text-sm text-gray-600 dark:text-gray-200">Password</label>
                    <a href="#" className="text-sm text-gray-400 focus:text-blue-500 hover:text-blue-500 hover:underline">Forgot password?</a>
                  </div>
                  <input
                    type="password"
                    name="password"
                    id="password"
                    placeholder="Your Password"
                    value={formData.password}
                    onChange={handleChange}
                    className="block w-full px-4 py-2 mt-2 text-gray-800 bg-gray-900 placeholder-gray-400 border border-gray-200 rounded-md dark:placeholder-gray-600 dark:bg-gray-900 text-white dark:text-gray-300 dark:border-gray-700 focus:border-blue-400 dark:focus:border-blue-400 focus:ring-blue-400 focus:outline-none focus:ring focus:ring-opacity-40"
                    required
                  />
                </div>
                <div className="mt-6">
                  <button
                    type="submit"
                    className="w-full px-4 py-2 tracking-wide text-white transition-colors duration-200 transform bg-blue-500 rounded-md hover:bg-blue-400 focus:outline-none focus:bg-blue-400 focus:ring focus:ring-blue-300 focus:ring-opacity-50"
                  >
                    Sign in
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
